/**
 * 机型「主打方向」派生工具。
 *
 * 与 `features.ts` 思路一致：定位**不落地**——不写进 632 条数据里，
 * 而是在运行时按字段判定得出。改规则改一处，改名单改这里。
 *
 * 判定优先级（自上而下，命中即返回）：
 *  1. 影像旗舰：主摄大底 + 长焦 + OIS（与 `camera-flagship` 特性同口径）
 *  2. 游戏性能：安兔兔 ≥ 200 万分，或（高刷 + 大电池）组合（与 `gaming` 特性同口径）
 *  3. 轻薄长续航（手机专属）：重量 ≤ 180g 且大电池（mAh ≥ 6000）
 *  4. 长续航（平板专属）：大电池（mAh ≥ 8000 或 Wh ≥ 28），不判轻薄
 *  5. 性价比：参考现价 ≤ 1999 元（覆盖手机 / 平板）
 *  6. 兜底：均衡水桶机
 *
 * 说明：
 *  - 阈值与 `features.ts` 保持一致，避免「特性命中了但定位不认」的分裂；
 *  - 平板单独拆成 `long-battery`（标签「长续航」）：平板 600g 是常态，
 *    套手机 180g 轻薄阈值会全军覆没，且标成「轻薄长续航」会误导用户；
 *  - 「性价比」阈值取 1999 元：这是国内千元机 / 中端机的心理分界线，
 *    超过这个价位谈性价比意义不大。
 */

import type { Device } from '../types/device';

/* ------------------------------------------------------------------ */
/* 判定阈值（口径与 features.ts 对齐）                                   */
/* ------------------------------------------------------------------ */

/** 影像旗舰主摄像素下界（万）。 */
const CAMERA_FLAGSHIP_MAIN_MP_MIN = 5000;

/** 光学防抖识别正则：数据里 OIS 内嵌在镜头文案中（如 "5000万像素 f/1.6 OIS"）。 */
const OIS_RE = /ois/i;

/** 游戏性能：安兔兔上界，或（高刷 + 大电池）组合。 */
const GAMING_ANTUTU_MIN = 2_000_000;
const GAMING_REFRESH_MIN = 144;
const GAMING_BATTERY_MIN = 6000;

/** 轻薄机身重量上界（g），仅判手机。 */
const LIGHT_WEIGHT_MAX_G = 180;

/** 大电池容量下界：手机 mAh >= 6000；平板 mAh >= 8000 或 Wh >= 28。 */
const LONG_BATTERY_PHONE_MIN = 6000;
const LONG_BATTERY_TABLET_MIN = 8000;
const LONG_BATTERY_TABLET_WH_MIN = 28;

/** 性价比价格上界（元）：参考现价不超过此值即算性价比机型。 */
const VALUE_PRICE_MAX = 1999;

/* ------------------------------------------------------------------ */
/* 内部辅助                                                             */
/* ------------------------------------------------------------------ */

/** 安全取数值，非有限数一律视作 null（不参与判定）。 */
function num(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * 从形如 "2亿像素" / "5000万像素" / "1200万" 的文案里解析出像素数（单位：万）。
 * 无数据返回 null。
 */
function parseMegapixels(text: string | null): number | null {
  if (!text) return null;
  // "2亿像素" / "2亿" → 2 × 10000 = 20000 万
  const yi = /(\d+(?:\.\d+)?)\s*亿/.exec(text);
  if (yi) return Math.round(Number(yi[1]) * 10000);
  // "5000万像素" / "5000万" → 5000 万
  const wan = /(\d+)\s*万/.exec(text);
  if (wan) return Number(wan[1]);
  return null;
}

/**
 * 判定一款设备是否命中「大电池」——口径与 features.ts 的 `long-battery` 完全一致。
 * 抽出来复用，避免两处阈值漂移。
 */
function isLongBattery(d: Device): boolean {
  const cap = num(d.battery?.capacity);
  if (d.category === 'tablet') {
    const mahOk = cap !== null && cap >= LONG_BATTERY_TABLET_MIN;
    const wh = num(d.battery?.batteryWh);
    const whOk = wh !== null && wh >= LONG_BATTERY_TABLET_WH_MIN;
    return mahOk || whOk;
  }
  return cap !== null && cap >= LONG_BATTERY_PHONE_MIN;
}

/* ------------------------------------------------------------------ */
/* 主打方向判定                                                         */
/* ------------------------------------------------------------------ */

/** 主打方向枚举（兜底为「均衡水桶机」）。 */
export type PositioningId =
  /** 影像旗舰：主摄大底 + 长焦 + OIS */
  | 'camera-flagship'
  /** 游戏性能：跑分怪兽 或 高刷 + 大电池 */
  | 'gaming'
  /** 轻薄长续航：手机专属，轻薄机身 + 大电池 */
  | 'lightweight-long-battery'
  /** 长续航：平板专属，仅大电池（平板不判轻薄） */
  | 'long-battery'
  /** 性价比：参考现价 ≤ 1999 元 */
  | 'value'
  /** 均衡水桶机：以上都不命中时的兜底 */
  | 'balanced';

/** 主打方向中文标签。 */
const POSITIONING_LABELS: Record<PositioningId, string> = {
  'camera-flagship': '影像旗舰',
  'gaming': '游戏性能',
  'lightweight-long-battery': '轻薄长续航',
  'long-battery': '长续航',
  'value': '性价比',
  'balanced': '均衡水桶机',
};

/** 单条定位判定规则。 */
interface PositioningRule {
  id: PositioningId;
  match(d: Device): boolean;
}

/**
 * 定位规则表（按优先级排序，命中即返回）。
 *
 * 顺序即优先级——`positioningOf` 返回第一条命中的规则标签。
 * 兜底规则 `balanced` 永远命中（match 返回 true），保证函数返回值非空。
 */
const POSITIONING_RULES: PositioningRule[] = [
  {
    id: 'camera-flagship',
    // 与 features.ts 的 `camera-flagship` 特性同口径：
    // 主摄 ≥ 5000 万像素 + 有长焦 + 主摄带 OIS
    match: (d) => {
      const mainMp = parseMegapixels(d.camera?.main);
      if (mainMp === null || mainMp < CAMERA_FLAGSHIP_MAIN_MP_MIN) return false;
      if ((d.camera?.telephoto ?? '').trim() === '') return false;
      return OIS_RE.test(d.camera?.main ?? '');
    },
  },
  {
    id: 'gaming',
    // 与 features.ts 的 `gaming` 特性同口径：
    // 安兔兔 ≥ 200 万分，或（刷新率 ≥ 144Hz + 电池 ≥ 6000mAh）
    match: (d) => {
      const antutu = num(d.performance?.antutu) ?? 0;
      if (antutu >= GAMING_ANTUTU_MIN) return true;
      const refresh = num(d.screen?.refreshRate) ?? 0;
      const battery = num(d.battery?.capacity) ?? 0;
      return refresh >= GAMING_REFRESH_MIN && battery >= GAMING_BATTERY_MIN;
    },
  },
  {
    id: 'lightweight-long-battery',
    // 手机专属：轻薄机身 + 大电池
    match: (d) => {
      if (d.category !== 'phone') return false;
      const weight = num(d.body?.weight);
      const light = weight !== null && weight <= LIGHT_WEIGHT_MAX_G;
      return light && isLongBattery(d);
    },
  },
  {
    id: 'long-battery',
    // 平板专属：仅大电池（平板 600g 是常态，不判轻薄）
    match: (d) => d.category === 'tablet' && isLongBattery(d),
  },
  {
    id: 'value',
    // 参考现价 ≤ 1999 元（手机 / 平板通用）
    match: (d) => {
      const price = num(d.currentPrice);
      return price !== null && price <= VALUE_PRICE_MAX;
    },
  },
  {
    id: 'balanced',
    // 兜底：以上都不命中 → 均衡水桶机
    match: () => true,
  },
];

/* ------------------------------------------------------------------ */
/* 对外 API                                                             */
/* ------------------------------------------------------------------ */

/**
 * 返回一款设备的「主打方向」一句话定位。
 *
 * 判定按 `POSITIONING_RULES` 顺序进行，命中即返回；兜底规则保证返回值非空。
 * 例：影像旗舰 / 游戏性能 / 轻薄长续航 / 性价比 / 均衡水桶机。
 */
export function positioningOf(d: Device): string {
  for (const rule of POSITIONING_RULES) {
    if (rule.match(d)) return POSITIONING_LABELS[rule.id];
  }
  // 理论上不会走到这里（balanced 兜底），保留以防规则表被改坏
  return POSITIONING_LABELS.balanced;
}

/** 取主打方向 id；未知时返回兜底 `balanced`。 */
export function positioningIdOf(d: Device): PositioningId {
  for (const rule of POSITIONING_RULES) {
    if (rule.match(d)) return rule.id;
  }
  return 'balanced';
}
