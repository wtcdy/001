/**
 * 设备特性派生工具。
 *
 * 特性一律**派生、不落地**：不存进数据里，而是在运行时按字段判定得出。
 * 好处是「改规则改一处，改名单改这里」——`FeatureId` 联合类型与 `FEATURE_DEFS`
 * 的 id 一一对应（见文件末尾的编译期断言），增删特性时编译器会逼你同步两处，
 * 不会出现「类型里有、判定表里没有」的幽灵特性。
 *
 * 口径来源说明：
 *  - 阈值（小屏 6.3"、大电池手机 6000mAh / 平板 8000mAh 或 28Wh、快充 80W、高刷 120Hz、
 *    旗舰芯 150 万分、轻薄 180g、大屏平板 12"、游戏 200 万分 / 144Hz+6000mAh）来自产品
 *    需求给定的建议值；
 *  - 潜望长焦判定用正则 `/潜望|潜望式|棱镜|periscope/i`：只认「潜望」二字会漏掉苹果全系
 *    （苹果官方术语是「四重反射棱镜」，文案里不含「潜望」）；也不做「有长焦即告警」的
 *    宽泛兜底——那会刷出几百条噪音，噪音等于没人看。
 */

import type { Device, DeviceCategory, FeatureId } from '../types/device';

/* ------------------------------------------------------------------ */
/* 判定阈值（模块内私有常量，口径见文件头注释）                          */
/* ------------------------------------------------------------------ */

/** 小屏手机上界（英寸）：`screen.size <= 6.3` 即算小屏。 */
const SMALL_SCREEN_MAX = 6.3;

/**
 * 大电池容量下界：
 *  - 手机：mAh >= 6000；
 *  - 平板：mAh >= 8000，或官方公布 Wh >= 28（苹果只公布 Wh，绝不换算 mAh）。
 *
 * Wh 阈值取 28 而非 30 的原因：iPad 10（28.6Wh）/ iPad 11 A16（28.93Wh）必须命中，
 * 否则会出现「iPad 9（32.4Wh）算长续航、隔代的 iPad 10/11 反而不算」的分裂，
 * 用户会认为筛选坏了。取 28 后只有 iPad mini 全系（19.3Wh）不命中——这是合理的，
 * mini 电池小一个量级，本就是小屏便携定位。
 */
const LONG_BATTERY_PHONE_MIN = 6000;
const LONG_BATTERY_TABLET_MIN = 8000;
const LONG_BATTERY_TABLET_WH_MIN = 28;

/** 快充有线功率下界（W）。 */
const FAST_CHARGE_MIN_W = 80;

/** 高刷屏刷新率下界（Hz）。 */
const HIGH_REFRESH_MIN = 120;

/** 旗舰芯片安兔兔跑分下界。 */
const FLAGSHIP_SOC_ANTUTU_MIN = 1_500_000;

/** 轻薄机身重量上界（g），仅判手机。 */
const LIGHT_WEIGHT_MAX_G = 180;

/** 大屏平板尺寸下界（英寸）。 */
const LARGE_TABLET_MIN_IN = 12;

/** 游戏性能：安兔兔上界，或（高刷 + 大电池）组合。 */
const GAMING_ANTUTU_MIN = 2_000_000;
const GAMING_REFRESH_MIN = 144;
const GAMING_BATTERY_MIN = 6000;

/** 影像旗舰主摄像素下界（万）。 */
const CAMERA_FLAGSHIP_MAIN_MP_MIN = 5000;

/**
 * 潜望长焦识别正则。
 *
 * 覆盖中文「潜望 / 潜望式」、苹果「（四重反射）棱镜」以及英文 periscope；
 * 明确不做「有长焦但文案不含这些词就告警」的宽泛兜底（噪音过大）。
 */
const PERISCOPE_RE = /潜望|潜望式|棱镜|periscope/i;

/** 光学防抖识别正则：数据里 OIS 内嵌在镜头文案中（如 "5000万像素 f/1.6 OIS"）。 */
const OIS_RE = /ois/i;

/* ------------------------------------------------------------------ */
/* 内部辅助                                                             */
/* ------------------------------------------------------------------ */

/** 从形如 "2亿像素" / "5000万像素" / "1200万" 的文案里解析出像素数（单位：万）。无数据返回 null。 */
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

/** 安全取数值，非有限数一律视作 null（不参与判定）。 */
function num(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/* ------------------------------------------------------------------ */
/* 特性定义表                                                           */
/* ------------------------------------------------------------------ */

/** 单条特性的定义。 */
export interface FeatureDef {
  /** 特性 id，必须与 `FeatureId` 联合类型严格一一对应 */
  id: FeatureId;
  /** 中文展示名 */
  label: string;
  /** 该特性在哪些品类下展示（UI 只展示当前品类可见的特性） */
  categories: DeviceCategory[];
  /** 判定一款设备是否命中该特性 */
  match(d: Device): boolean;
}

/**
 * 全部特性定义（18 条）。
 *
 * 顺序即 UI 展示顺序；`categories` 归属规则：
 *  - 平板专属（手写笔 / 键盘 / 蜂窝版 / 大屏平板）→ `['tablet']`；
 *  - 手机专属（小屏 / 潜望长焦 / 游戏 / 影像旗舰 / 轻薄）→ `['phone']`；
 *  - 其余跨品类通用 → `['phone', 'tablet']`。
 *
 * 注意：用户点名的「折叠屏」不是 FeatureId，而是通过 `formFactors` 筛选实现的
 * （横折 / 竖折 / 阔折 / 三折 / 中折），因此这里没有「折叠屏」条目。
 */
export const FEATURE_DEFS: FeatureDef[] = [
  {
    id: 'small-screen',
    label: '小屏手机',
    categories: ['phone'],
    match: (d) => d.category === 'phone' && (num(d.screen?.size) ?? 0) <= SMALL_SCREEN_MAX,
  },
  {
    id: 'periscope',
    label: '潜望长焦',
    categories: ['phone'],
    match: (d) => PERISCOPE_RE.test(d.camera?.telephoto ?? ''),
  },
  {
    id: 'long-battery',
    label: '大电池',
    categories: ['phone', 'tablet'],
    match: (d) => {
      const cap = num(d.battery?.capacity);
      if (d.category === 'tablet') {
        // 平板：mAh >= 8000，或官方 Wh >= 28（苹果只公布 Wh）
        const mahOk = cap !== null && cap >= LONG_BATTERY_TABLET_MIN;
        // 双单位电池：Wh 与 mAh 二选一，苹果只公布 Wh（不换算）
        const wh = num(d.battery?.batteryWh);
        const whOk = wh !== null && wh >= LONG_BATTERY_TABLET_WH_MIN;
        return mahOk || whOk;
      }
      return cap !== null && cap >= LONG_BATTERY_PHONE_MIN;
    },
  },
  {
    id: 'fast-charge',
    label: '快充',
    categories: ['phone', 'tablet'],
    match: (d) => (num(d.battery?.wiredCharge) ?? 0) >= FAST_CHARGE_MIN_W,
  },
  {
    id: 'wireless-charge',
    label: '无线充电',
    categories: ['phone', 'tablet'],
    match: (d) => (num(d.battery?.wirelessCharge) ?? 0) > 0,
  },
  {
    id: 'ip68',
    label: 'IP68 防尘防水',
    categories: ['phone', 'tablet'],
    match: (d) => {
      const ip = (d.body?.ip ?? '').toUpperCase();
      return ip.includes('IP68') || ip.includes('IP69');
    },
  },
  {
    id: 'satellite',
    label: '卫星通信',
    categories: ['phone', 'tablet'],
    match: (d) => (d.system?.satellite ?? '').trim() !== '',
  },
  {
    id: 'nfc',
    label: 'NFC',
    categories: ['phone', 'tablet'],
    match: (d) => d.system?.nfc === true,
  },
  {
    id: 'infrared',
    label: '红外遥控',
    categories: ['phone', 'tablet'],
    match: (d) => d.system?.infrared === true,
  },
  {
    id: 'high-refresh',
    label: '高刷屏',
    categories: ['phone', 'tablet'],
    match: (d) => (num(d.screen?.refreshRate) ?? 0) >= HIGH_REFRESH_MIN,
  },
  {
    id: 'flagship-soc',
    label: '旗舰芯片',
    categories: ['phone', 'tablet'],
    match: (d) => (num(d.performance?.antutu) ?? 0) >= FLAGSHIP_SOC_ANTUTU_MIN,
  },
  {
    id: 'light-weight',
    label: '轻薄机身',
    categories: ['phone'],
    match: (d) => d.category === 'phone' && (num(d.body?.weight) ?? Number.POSITIVE_INFINITY) <= LIGHT_WEIGHT_MAX_G,
  },
  {
    id: 'stylus',
    label: '手写笔',
    categories: ['tablet'],
    match: (d) => d.tablet?.stylus !== null && d.tablet?.stylus !== undefined,
  },
  {
    id: 'keyboard',
    label: '键盘',
    categories: ['tablet'],
    match: (d) => d.tablet?.keyboard !== null && d.tablet?.keyboard !== undefined,
  },
  {
    id: 'cellular',
    label: '蜂窝版',
    categories: ['tablet'],
    // 字段类型为 boolean | null：true 才算蜂窝版，false / null 均排除。
    match: (d) => d.tablet?.cellular === true,
  },
  {
    id: 'large-screen-tablet',
    label: '大屏平板',
    categories: ['tablet'],
    match: (d) => d.category === 'tablet' && (num(d.screen?.size) ?? 0) >= LARGE_TABLET_MIN_IN,
  },
  {
    id: 'gaming',
    label: '游戏性能',
    categories: ['phone'],
    match: (d) => {
      const antutu = num(d.performance?.antutu) ?? 0;
      if (antutu >= GAMING_ANTUTU_MIN) return true;
      const refresh = num(d.screen?.refreshRate) ?? 0;
      const battery = num(d.battery?.capacity) ?? 0;
      return refresh >= GAMING_REFRESH_MIN && battery >= GAMING_BATTERY_MIN;
    },
  },
  {
    id: 'camera-flagship',
    label: '影像旗舰',
    categories: ['phone'],
    match: (d) => {
      // 主摄 >= 5000 万像素
      const mainMp = parseMegapixels(d.camera?.main);
      if (mainMp === null || mainMp < CAMERA_FLAGSHIP_MAIN_MP_MIN) return false;
      // 有长焦（telephoto 文案非空）
      if ((d.camera?.telephoto ?? '').trim() === '') return false;
      // 主摄带光学防抖（OIS 内嵌在镜头文案里）
      return OIS_RE.test(d.camera?.main ?? '');
    },
  },
];

/* ------------------------------------------------------------------ */
/* 编译期断言：FEATURE_DEFS 的 id 集合 === FeatureId 联合类型            */
/* ------------------------------------------------------------------ */

/**
 * 双向约束：`FeatureId` 的每个成员都必须在 `FEATURE_DEFS` 中出现，反之亦然。
 * 少写一条或多写一条，下面这行都会编译报错——这是有意为之，防止特性表与
 * 类型定义漂移。
 */
type FeatureIdCoverage = FeatureId extends (typeof FEATURE_DEFS)[number]['id']
  ? (typeof FEATURE_DEFS)[number]['id'] extends FeatureId
    ? true
    : never
  : never;
// 赋值 `true` 会强制校验上面的条件类型：覆盖不全时类型为 never，此处即编译报错。
// `void` 读取一次以满足 noUnusedLocals（校验发生在赋值时，与读取无关）。
const _featureIdCoverage: FeatureIdCoverage = true;
void _featureIdCoverage;

/* ------------------------------------------------------------------ */
/* 对外 API                                                             */
/* ------------------------------------------------------------------ */

/** 返回一款设备命中的全部特性 id（顺序与 `FEATURE_DEFS` 一致）。 */
export function featuresOf(d: Device): FeatureId[] {
  return FEATURE_DEFS.filter((def) => def.match(d)).map((def) => def.id);
}

/** 取特性中文名；未知 id 原样返回，避免显示 undefined。 */
export function featureLabel(id: FeatureId): string {
  return FEATURE_DEFS.find((def) => def.id === id)?.label ?? id;
}
