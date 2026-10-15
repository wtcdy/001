import { describe, expect, it } from 'vitest';

import { ALL_DEVICES } from '../data';
import type { Device, DeviceCategory, TabletExtras } from '../types/device';

import { makePhone } from './fixtures';

import { positioningIdOf, positioningOf } from '../utils/positioning';

/**
 * `positioning.ts` 单测。
 *
 * 覆盖：
 *  1. 每条定位规则至少 1 正例 + 1 反例；
 *  2. 兜底规则：任何设备都返回非空字符串（632 台全量校验）；
 *  3. 优先级：影像旗舰 > 游戏性能 > 轻薄长续航 > 性价比 > 均衡水桶机；
 *  4. 全量设备定位分布统计（观察用，不强制断言具体数字）。
 */

/** 用 makePhone 造一台设备并按需覆写品类 / 形态 / 平板块 */
function device(
  overrides: {
    category?: DeviceCategory;
    formFactor?: Device['formFactor'];
    screen?: Partial<Device['screen']>;
    performance?: Partial<Device['performance']>;
    camera?: Partial<Device['camera']>;
    battery?: Partial<Device['battery']>;
    system?: Partial<Device['system']>;
    body?: Partial<Device['body']>;
    /** 只需填关心的字段，其余自动补 null（与工厂 normalizeTablet 口径一致） */
    tablet?: Partial<Omit<TabletExtras, 'stylus' | 'keyboard'>> & {
      stylus?: TabletExtras['stylus'];
      keyboard?: TabletExtras['keyboard'];
    };
    /** 参考现价（元） */
    currentPrice?: number | null;
  } = {},
): Device {
  const tablet = overrides.tablet !== undefined
    ? {
        cellular: overrides.tablet.cellular ?? null,
        stylus: overrides.tablet.stylus ?? null,
        keyboard: overrides.tablet.keyboard ?? null,
        desktopMode: overrides.tablet.desktopMode ?? null,
        speakerCount: overrides.tablet.speakerCount ?? null,
        microSd: overrides.tablet.microSd ?? null,
      }
    : undefined;
  return makePhone({
    id: 'pos-test',
    category: overrides.category ?? 'phone',
    formFactor: overrides.formFactor ?? 'bar',
    screen: overrides.screen,
    performance: overrides.performance,
    camera: overrides.camera,
    battery: overrides.battery,
    system: overrides.system,
    body: overrides.body,
    currentPrice: overrides.currentPrice,
    ...(tablet !== undefined ? { tablet } : {}),
  }) as Device;
}

/* ------------------------------------------------------------------ */
/* 影像旗舰                                                             */
/* ------------------------------------------------------------------ */

describe('positioningOf 影像旗舰', () => {
  it('正例：主摄 5000 万 + 长焦 + OIS → 影像旗舰', () => {
    const d = device({
      camera: {
        main: '5000万像素 f/1.6 OIS',
        telephoto: '5000万像素 5x 潜望',
      },
    });
    expect(positioningOf(d)).toBe('影像旗舰');
    expect(positioningIdOf(d)).toBe('camera-flagship');
  });

  it('正例：2 亿像素主摄 + 长焦 + OIS → 影像旗舰', () => {
    const d = device({
      camera: {
        main: '2亿像素 f/1.7 OIS',
        telephoto: '1000万像素 3x',
      },
    });
    expect(positioningOf(d)).toBe('影像旗舰');
  });

  it('反例：主摄 5000 万但无长焦 → 不是影像旗舰', () => {
    const d = device({
      camera: {
        main: '5000万像素 f/1.6 OIS',
        telephoto: null,
      },
    });
    expect(positioningIdOf(d)).not.toBe('camera-flagship');
  });

  it('反例：主摄 5000 万 + 长焦但无 OIS → 不是影像旗舰', () => {
    const d = device({
      camera: {
        main: '5000万像素 f/1.6',
        telephoto: '5000万像素 5x',
      },
    });
    expect(positioningIdOf(d)).not.toBe('camera-flagship');
  });

  it('反例：主摄 1200 万 + 长焦 + OIS → 像素不够，不是影像旗舰', () => {
    const d = device({
      camera: {
        main: '1200万像素 f/1.6 OIS',
        telephoto: '5000万像素 5x',
      },
    });
    expect(positioningIdOf(d)).not.toBe('camera-flagship');
  });
});

/* ------------------------------------------------------------------ */
/* 游戏性能                                                             */
/* ------------------------------------------------------------------ */

describe('positioningOf 游戏性能', () => {
  it('正例：安兔兔 200 万分 → 游戏性能', () => {
    const d = device({
      performance: { antutu: 2_000_000 },
    });
    expect(positioningOf(d)).toBe('游戏性能');
    expect(positioningIdOf(d)).toBe('gaming');
  });

  it('正例：安兔兔 250 万分 → 游戏性能', () => {
    const d = device({
      performance: { antutu: 2_500_000 },
    });
    expect(positioningOf(d)).toBe('游戏性能');
  });

  it('正例：高刷 144Hz + 大电池 6000mAh（跑分不够）→ 游戏性能', () => {
    const d = device({
      performance: { antutu: 1_200_000 },
      screen: { refreshRate: 144 },
      battery: { capacity: 6000 },
    });
    expect(positioningOf(d)).toBe('游戏性能');
  });

  it('反例：安兔兔 150 万分（不到 200 万）+ 普通刷 + 普通电池 → 不是游戏性能', () => {
    const d = device({
      performance: { antutu: 1_500_000 },
      screen: { refreshRate: 120 },
      battery: { capacity: 5000 },
    });
    expect(positioningIdOf(d)).not.toBe('gaming');
  });

  it('反例：高刷 144Hz 但电池 5000mAh → 不是游戏性能', () => {
    const d = device({
      performance: { antutu: 1_200_000 },
      screen: { refreshRate: 144 },
      battery: { capacity: 5000 },
    });
    expect(positioningIdOf(d)).not.toBe('gaming');
  });
});

/* ------------------------------------------------------------------ */
/* 轻薄长续航                                                           */
/* ------------------------------------------------------------------ */

describe('positioningOf 轻薄长续航', () => {
  it('正例：手机 180g + 6000mAh → 轻薄长续航', () => {
    const d = device({
      body: { weight: 180 },
      battery: { capacity: 6000 },
      performance: { antutu: 800_000 },
      screen: { refreshRate: 120 },
    });
    expect(positioningOf(d)).toBe('轻薄长续航');
    expect(positioningIdOf(d)).toBe('lightweight-long-battery');
  });

  it('正例：手机 170g + 7000mAh → 轻薄长续航', () => {
    const d = device({
      body: { weight: 170 },
      battery: { capacity: 7000 },
    });
    expect(positioningOf(d)).toBe('轻薄长续航');
  });

  it('反例：手机 200g + 6000mAh → 不够轻薄，不是轻薄长续航', () => {
    const d = device({
      body: { weight: 200 },
      battery: { capacity: 6000 },
    });
    expect(positioningIdOf(d)).not.toBe('lightweight-long-battery');
  });

  it('反例：手机 170g + 5000mAh → 电池不够大，不是轻薄长续航', () => {
    const d = device({
      body: { weight: 170 },
      battery: { capacity: 5000 },
    });
    expect(positioningIdOf(d)).not.toBe('lightweight-long-battery');
  });

  it('正例：平板 28Wh（苹果）→ 长续航（平板不判轻薄，标签不含「轻薄」）', () => {
    const d = device({
      category: 'tablet',
      formFactor: 'slate',
      battery: { capacity: null, batteryWh: 28 },
    });
    expect(positioningOf(d)).toBe('长续航');
    expect(positioningIdOf(d)).toBe('long-battery');
  });

  it('反例：平板 19Wh（iPad mini）→ 不是长续航', () => {
    const d = device({
      category: 'tablet',
      formFactor: 'slate',
      battery: { capacity: null, batteryWh: 19 },
    });
    expect(positioningIdOf(d)).not.toBe('long-battery');
  });

  it('反例：大电池但重量大的平板 → 必须返回「长续航」而不是「轻薄长续航」', () => {
    // 700g 平板 + 8000mAh，命中大电池但不该被标「轻薄」
    const d = device({
      category: 'tablet',
      formFactor: 'slate',
      body: { weight: 700 },
      battery: { capacity: 8000 },
    });
    expect(positioningOf(d)).toBe('长续航');
    expect(positioningIdOf(d)).toBe('long-battery');
    // 关键断言：标签里不能出现「轻薄」二字
    expect(positioningOf(d)).not.toContain('轻薄');
  });
});

/* ------------------------------------------------------------------ */
/* 性价比                                                               */
/* ------------------------------------------------------------------ */

describe('positioningOf 性价比', () => {
  it('正例：参考现价 1599 元 → 性价比', () => {
    const d = device({
      currentPrice: 1599,
      performance: { antutu: 800_000 },
      screen: { refreshRate: 120 },
      battery: { capacity: 5000 },
      body: { weight: 200 },
    });
    expect(positioningOf(d)).toBe('性价比');
    expect(positioningIdOf(d)).toBe('value');
  });

  it('正例：参考现价 1999 元（边界值）→ 性价比', () => {
    const d = device({
      currentPrice: 1999,
      performance: { antutu: 800_000 },
      battery: { capacity: 5000 },
      body: { weight: 200 },
    });
    expect(positioningOf(d)).toBe('性价比');
  });

  it('反例：参考现价 2000 元（刚超边界）→ 不是性价比', () => {
    const d = device({
      currentPrice: 2000,
      performance: { antutu: 800_000 },
      battery: { capacity: 5000 },
      body: { weight: 200 },
    });
    expect(positioningIdOf(d)).not.toBe('value');
  });

  it('反例：参考现价 5000 元 → 不是性价比', () => {
    const d = device({
      currentPrice: 5000,
    });
    expect(positioningIdOf(d)).not.toBe('value');
  });
});

/* ------------------------------------------------------------------ */
/* 兜底：均衡水桶机                                                      */
/* ------------------------------------------------------------------ */

describe('positioningOf 兜底均衡水桶机', () => {
  it('正例：各项都不突出 → 均衡水桶机', () => {
    const d = device({
      currentPrice: 2999,
      performance: { antutu: 1_000_000 },
      screen: { refreshRate: 120 },
      battery: { capacity: 5000 },
      body: { weight: 200 },
      camera: { main: '1200万像素' },
    });
    expect(positioningOf(d)).toBe('均衡水桶机');
    expect(positioningIdOf(d)).toBe('balanced');
  });

  it('正例：旗舰芯 + 高价（不命中前四条）→ 均衡水桶机', () => {
    // 安兔兔 180 万分不到游戏门槛，价格 4999 元超过性价比门槛
    const d = device({
      currentPrice: 4999,
      performance: { antutu: 1_800_000 },
      screen: { refreshRate: 120 },
      battery: { capacity: 5000 },
      body: { weight: 210 },
      camera: { main: '5000万像素' },
    });
    expect(positioningOf(d)).toBe('均衡水桶机');
  });
});

/* ------------------------------------------------------------------ */
/* 优先级                                                               */
/* ------------------------------------------------------------------ */

describe('positioningOf 优先级', () => {
  it('影像旗舰 > 游戏性能：同时命中两条时返回影像旗舰', () => {
    const d = device({
      performance: { antutu: 2_500_000 },
      camera: {
        main: '5000万像素 f/1.6 OIS',
        telephoto: '5000万像素 5x',
      },
    });
    expect(positioningOf(d)).toBe('影像旗舰');
  });

  it('游戏性能 > 轻薄长续航：同时命中两条时返回游戏性能', () => {
    // 安兔兔 200 万分 + 170g + 6000mAh
    const d = device({
      performance: { antutu: 2_000_000 },
      body: { weight: 170 },
      battery: { capacity: 6000 },
    });
    expect(positioningOf(d)).toBe('游戏性能');
  });

  it('轻薄长续航 > 性价比：同时命中两条时返回轻薄长续航', () => {
    const d = device({
      currentPrice: 1599,
      body: { weight: 170 },
      battery: { capacity: 6000 },
    });
    expect(positioningOf(d)).toBe('轻薄长续航');
  });
});

/* ------------------------------------------------------------------ */
/* 全量校验                                                             */
/* ------------------------------------------------------------------ */

describe('positioningOf 全量设备', () => {
  it('所有设备都返回非空字符串', () => {
    for (const d of ALL_DEVICES) {
      const p = positioningOf(d);
      expect(p, `设备 ${d.id} 的定位不应为空`).toBeTruthy();
      expect(p.length).toBeGreaterThan(0);
    }
  });

  it('所有设备定位分布统计（观察用）', () => {
    const counts: Record<string, number> = {};
    for (const d of ALL_DEVICES) {
      const id = positioningIdOf(d);
      counts[id] = (counts[id] ?? 0) + 1;
    }
    // 打印分布，方便观察是否合理（不强制断言具体数字）
    // eslint-disable-next-line no-console
    console.log('定位分布：', counts);
    // 至少保证每条规则都有设备命中（否则说明规则写坏了）
    expect(counts['camera-flagship']).toBeGreaterThan(0);
    expect(counts['gaming']).toBeGreaterThan(0);
    expect(counts['lightweight-long-battery']).toBeGreaterThan(0);
    expect(counts['long-battery']).toBeGreaterThan(0);
    expect(counts['value']).toBeGreaterThan(0);
    expect(counts['balanced']).toBeGreaterThan(0);
  });

  it('总设备数与 ALL_DEVICES 一致', () => {
    expect(ALL_DEVICES.length).toBeGreaterThan(600);
  });
});
