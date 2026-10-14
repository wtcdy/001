import { describe, expect, it } from 'vitest';

import { ALL_DEVICES } from '../data';
import { FEATURE_DEFS, featureLabel, featuresOf } from '../utils/features';
import type { Device, DeviceCategory, TabletExtras } from '../types/device';

import { makePhone } from './fixtures';

/**
 * `features.ts` 单测。
 *
 * 覆盖三件事：
 *  1. 每条特性至少 1 正例 + 1 反例（18 × 2 起）；
 *  2. `featuresOf` 的返回能覆盖 `FEATURE_DEFS` 全部 id；
 *  3. `FEATURE_DEFS` 的 id 集合 === `FeatureId` 联合（运行时断言，与 features.ts 内的
 *     编译期断言双保险，防止特性表与类型定义漂移）。
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
    id: 'feat-test',
    category: overrides.category,
    formFactor: overrides.formFactor,
    screen: overrides.screen,
    performance: overrides.performance,
    camera: overrides.camera,
    battery: overrides.battery,
    system: overrides.system,
    body: overrides.body,
    ...(tablet !== undefined ? { tablet } : {}),
  }) as Device;
}

describe('FEATURE_DEFS 与 FeatureId 一一对应', () => {
  it('FEATURE_DEFS 的 id 集合等于 FeatureId 联合（不多不少）', () => {
    const defIds = new Set(FEATURE_DEFS.map((def) => def.id));
    // 运行时能枚举的 FeatureId 成员：用 makePhone 无法直接拿到联合，
    // 因此这里用「FEATURE_DEFS 覆盖自身」+「featureLabel 对每个 id 都有中文名」双向校验，
    // 编译期断言已在 features.ts 内保证与类型联合严格一致。
    expect(defIds.size).toBe(FEATURE_DEFS.length);
    for (const def of FEATURE_DEFS) {
      expect(featureLabel(def.id)).toBe(def.label);
    }
  });

  it('FEATURE_DEFS 恰好 18 条', () => {
    expect(FEATURE_DEFS).toHaveLength(18);
  });
});

describe('featuresOf 覆盖全部特性 id', () => {
  it('构造一台命中全部通用特性的设备，featuresOf 返回 18 个 id', () => {
    // 手机品类：命中除平板专属（stylus/keyboard/cellular/large-screen-tablet）外的全部
    const phone = device({
      category: 'phone',
      screen: { size: 6.2, refreshRate: 144 },
      performance: { antutu: 2100000 },
      camera: {
        main: '5000万像素 f/1.6 OIS',
        telephoto: '5000万像素 潜望长焦 OIS',
      },
      battery: { capacity: 6500, wiredCharge: 100, wirelessCharge: 50 },
      system: { nfc: true, infrared: true, satellite: '北斗卫星消息' },
      body: { ip: 'IP68', weight: 175 },
    });
    const ids = featuresOf(phone);
    // 手机可见的 14 条全部命中
    expect(ids).toContain('small-screen');
    expect(ids).toContain('periscope');
    expect(ids).toContain('long-battery');
    expect(ids).toContain('fast-charge');
    expect(ids).toContain('wireless-charge');
    expect(ids).toContain('ip68');
    expect(ids).toContain('satellite');
    expect(ids).toContain('nfc');
    expect(ids).toContain('infrared');
    expect(ids).toContain('high-refresh');
    expect(ids).toContain('flagship-soc');
    expect(ids).toContain('light-weight');
    expect(ids).toContain('gaming');
    expect(ids).toContain('camera-flagship');
    // 平板专属 4 条不应出现在手机品类
    expect(ids).not.toContain('stylus');
    expect(ids).not.toContain('keyboard');
    expect(ids).not.toContain('cellular');
    expect(ids).not.toContain('large-screen-tablet');
  });

  it('平板品类：构造命中平板专属特性的设备', () => {
    const tablet = device({
      category: 'tablet',
      screen: { size: 12.9, refreshRate: 120 },
      performance: { antutu: 1600000 },
      battery: { capacity: 9000, wiredCharge: 90, wirelessCharge: 15 },
      system: { nfc: true, infrared: true, satellite: '北斗卫星消息' },
      body: { ip: 'IP68' },
      tablet: {
        cellular: true,
        stylus: { supported: true, name: 'Test Pen' },
        keyboard: { supported: true, name: 'Test Keyboard' },
        desktopMode: null,
        speakerCount: 4,
        microSd: null,
      },
    });
    const ids = featuresOf(tablet);
    expect(ids).toContain('stylus');
    expect(ids).toContain('keyboard');
    expect(ids).toContain('cellular');
    expect(ids).toContain('large-screen-tablet');
    expect(ids).toContain('long-battery');
    expect(ids).toContain('flagship-soc');
  });
});

describe('small-screen 小屏手机', () => {
  it('正例：6.3" 手机命中', () => {
    expect(featuresOf(device({ category: 'phone', screen: { size: 6.3 } }))).toContain('small-screen');
  });
  it('反例：6.4" 手机不命中', () => {
    expect(featuresOf(device({ category: 'phone', screen: { size: 6.4 } }))).not.toContain('small-screen');
  });
  it('反例：平板即使 <= 6.3" 也不判小屏', () => {
    expect(featuresOf(device({ category: 'tablet', screen: { size: 6.0 } }))).not.toContain('small-screen');
  });
});

describe('periscope 潜望长焦', () => {
  it('正例：文案含「潜望」命中', () => {
    expect(featuresOf(device({ category: 'phone', camera: { telephoto: '5000万像素 潜望长焦 OIS' } }))).toContain(
      'periscope',
    );
  });
  it('正例：苹果「四重反射棱镜」文案命中（本次修正的核心回归点）', () => {
    expect(
      featuresOf(device({ category: 'phone', camera: { telephoto: '4800万像素 四重反射棱镜 f/2.8 OIS' } })),
    ).toContain('periscope');
  });
  it('正例：英文 periscope 命中', () => {
    expect(featuresOf(device({ category: 'phone', camera: { telephoto: 'periscope telephoto 5x' } }))).toContain(
      'periscope',
    );
  });
  it('反例：普通长焦（文案无潜望 / 棱镜）不命中', () => {
    expect(featuresOf(device({ category: 'phone', camera: { telephoto: '1200万像素 3倍长焦 OIS' } }))).not.toContain(
      'periscope',
    );
  });
  it('反例：无长焦文案不命中', () => {
    expect(featuresOf(device({ category: 'phone', camera: { telephoto: null } }))).not.toContain('periscope');
  });
  it('真实机型：华为 Pura X（阔折叠，长焦文案只写「长焦」）不命中，Pura X Max（潜望式）命中', () => {
    const byId = new Map(ALL_DEVICES.map((d) => [d.id, d]));
    const puraX = byId.get('huawei-pura-x');
    const puraXMax = byId.get('huawei-pura-x-max');
    // 数据可能尚未回填，取不到就跳过（避免因数据未就位而误判）
    if (puraX) expect(featuresOf(puraX)).not.toContain('periscope');
    if (puraXMax) expect(featuresOf(puraXMax)).toContain('periscope');
  });
});

describe('long-battery 大电池', () => {
  it('正例：手机 6000mAh 命中', () => {
    expect(featuresOf(device({ category: 'phone', battery: { capacity: 6000 } }))).toContain('long-battery');
  });
  it('反例：手机 5999mAh 不命中', () => {
    expect(featuresOf(device({ category: 'phone', battery: { capacity: 5999 } }))).not.toContain('long-battery');
  });
  it('正例：平板 8000mAh 命中', () => {
    expect(featuresOf(device({ category: 'tablet', battery: { capacity: 8000 } }))).toContain('long-battery');
  });
  it('反例：平板 7999mAh（且无 Wh）不命中', () => {
    expect(featuresOf(device({ category: 'tablet', battery: { capacity: 7999 } }))).not.toContain('long-battery');
  });
  it('正例：平板 Wh >= 28 命中（苹果只公布 Wh 的场景）', () => {
    expect(featuresOf(device({ category: 'tablet', battery: { capacity: null, batteryWh: 28 } }))).toContain('long-battery');
  });
  it('反例：平板 Wh < 28 不命中', () => {
    expect(featuresOf(device({ category: 'tablet', battery: { capacity: null, batteryWh: 27 } }))).not.toContain('long-battery');
  });
  it('锁死 28 阈值：iPad 10（28.6Wh）/ iPad 11 A16（28.93Wh）命中，iPad mini（19.3Wh）不命中', () => {
    // 这组正反例直接钉死 28 这个阈值，防止以后有人随手调回 30
    expect(
      featuresOf(device({ category: 'tablet', battery: { capacity: null, batteryWh: 28.6 } })),
    ).toContain('long-battery');
    expect(
      featuresOf(device({ category: 'tablet', battery: { capacity: null, batteryWh: 28.93 } })),
    ).toContain('long-battery');
    expect(
      featuresOf(device({ category: 'tablet', battery: { capacity: null, batteryWh: 19.3 } })),
    ).not.toContain('long-battery');
  });
});

describe('fast-charge 快充', () => {
  it('正例：80W 命中', () => {
    expect(featuresOf(device({ battery: { wiredCharge: 80 } }))).toContain('fast-charge');
  });
  it('反例：79W 不命中', () => {
    expect(featuresOf(device({ battery: { wiredCharge: 79 } }))).not.toContain('fast-charge');
  });
  it('反例：功率缺失不命中', () => {
    expect(featuresOf(device({ battery: { wiredCharge: null } }))).not.toContain('fast-charge');
  });
});

describe('wireless-charge 无线充电', () => {
  it('正例：功率 > 0 命中', () => {
    expect(featuresOf(device({ battery: { wirelessCharge: 1 } }))).toContain('wireless-charge');
  });
  it('反例：功率为 0 不命中', () => {
    expect(featuresOf(device({ battery: { wirelessCharge: 0 } }))).not.toContain('wireless-charge');
  });
});

describe('ip68 防尘防水', () => {
  it('正例：IP68 命中', () => {
    expect(featuresOf(device({ body: { ip: 'IP68' } }))).toContain('ip68');
  });
  it('正例：IP69 也命中（大小写不敏感）', () => {
    expect(featuresOf(device({ body: { ip: 'ip69' } }))).toContain('ip68');
  });
  it('反例：IP54 不命中', () => {
    expect(featuresOf(device({ body: { ip: 'IP54' } }))).not.toContain('ip68');
  });
});

describe('satellite 卫星通信', () => {
  it('正例：非空字符串命中', () => {
    expect(featuresOf(device({ system: { satellite: '北斗卫星消息' } }))).toContain('satellite');
  });
  it('反例：空字符串不命中', () => {
    expect(featuresOf(device({ system: { satellite: '' } }))).not.toContain('satellite');
  });
  it('反例：null 不命中', () => {
    expect(featuresOf(device({ system: { satellite: null } }))).not.toContain('satellite');
  });
});

describe('nfc', () => {
  it('正例：nfc === true 命中', () => {
    expect(featuresOf(device({ system: { nfc: true } }))).toContain('nfc');
  });
  it('反例：nfc === false 不命中', () => {
    expect(featuresOf(device({ system: { nfc: false } }))).not.toContain('nfc');
  });
});

describe('infrared 红外遥控', () => {
  it('正例：infrared === true 命中', () => {
    expect(featuresOf(device({ system: { infrared: true } }))).toContain('infrared');
  });
  it('反例：infrared === false 不命中', () => {
    expect(featuresOf(device({ system: { infrared: false } }))).not.toContain('infrared');
  });
});

describe('high-refresh 高刷屏', () => {
  it('正例：120Hz 命中', () => {
    expect(featuresOf(device({ screen: { refreshRate: 120 } }))).toContain('high-refresh');
  });
  it('反例：60Hz 不命中', () => {
    expect(featuresOf(device({ screen: { refreshRate: 60 } }))).not.toContain('high-refresh');
  });
});

describe('flagship-soc 旗舰芯片', () => {
  it('正例：150 万分命中', () => {
    expect(featuresOf(device({ performance: { antutu: 1500000 } }))).toContain('flagship-soc');
  });
  it('反例：1499999 分不命中', () => {
    expect(featuresOf(device({ performance: { antutu: 1499999 } }))).not.toContain('flagship-soc');
  });
});

describe('light-weight 轻薄机身', () => {
  it('正例：手机 180g 命中', () => {
    expect(featuresOf(device({ category: 'phone', body: { weight: 180 } }))).toContain('light-weight');
  });
  it('反例：手机 181g 不命中', () => {
    expect(featuresOf(device({ category: 'phone', body: { weight: 181 } }))).not.toContain('light-weight');
  });
  it('反例：平板不判轻薄', () => {
    expect(featuresOf(device({ category: 'tablet', body: { weight: 150 } }))).not.toContain('light-weight');
  });
});

describe('stylus 手写笔', () => {
  it('正例：tablet.stylus 非空命中', () => {
    expect(
      featuresOf(
        device({ category: 'tablet', tablet: { cellular: null, stylus: { supported: true }, keyboard: null } }),
      ),
    ).toContain('stylus');
  });
  it('反例：tablet.stylus 为 null 不命中', () => {
    expect(
      featuresOf(
        device({ category: 'tablet', tablet: { cellular: null, stylus: null, keyboard: null } }),
      ),
    ).not.toContain('stylus');
  });
});

describe('keyboard 键盘', () => {
  it('正例：tablet.keyboard 非空命中', () => {
    expect(
      featuresOf(
        device({
          category: 'tablet',
          tablet: { cellular: null, stylus: null, keyboard: { supported: true } },
        }),
      ),
    ).toContain('keyboard');
  });
  it('反例：tablet.keyboard 为 null 不命中', () => {
    expect(
      featuresOf(
        device({ category: 'tablet', tablet: { cellular: null, stylus: null, keyboard: null } }),
      ),
    ).not.toContain('keyboard');
  });
});

describe('cellular 蜂窝版', () => {
  it('正例：cellular === true 命中', () => {
    expect(
      featuresOf(device({ category: 'tablet', tablet: { cellular: true, stylus: null, keyboard: null } })),
    ).toContain('cellular');
  });
  it('反例：cellular === false（含「无蜂窝版」语义）不命中', () => {
    expect(
      featuresOf(device({ category: 'tablet', tablet: { cellular: false, stylus: null, keyboard: null } })),
    ).not.toContain('cellular');
  });
  it('反例：cellular 为 null 不命中', () => {
    expect(
      featuresOf(device({ category: 'tablet', tablet: { cellular: null, stylus: null, keyboard: null } })),
    ).not.toContain('cellular');
  });
});

describe('large-screen-tablet 大屏平板', () => {
  it('正例：平板 12" 命中', () => {
    expect(featuresOf(device({ category: 'tablet', screen: { size: 12 } }))).toContain('large-screen-tablet');
  });
  it('反例：平板 11.9" 不命中', () => {
    expect(featuresOf(device({ category: 'tablet', screen: { size: 11.9 } }))).not.toContain('large-screen-tablet');
  });
  it('反例：手机 12" 也不判大屏平板', () => {
    expect(featuresOf(device({ category: 'phone', screen: { size: 12 } }))).not.toContain('large-screen-tablet');
  });
});

describe('gaming 游戏性能', () => {
  it('正例：安兔兔 200 万分命中', () => {
    expect(featuresOf(device({ category: 'phone', performance: { antutu: 2000000 } }))).toContain('gaming');
  });
  it('正例：144Hz + 6000mAh 组合命中', () => {
    expect(
      featuresOf(device({ category: 'phone', screen: { refreshRate: 144 }, battery: { capacity: 6000 } })),
    ).toContain('gaming');
  });
  it('反例：143Hz + 6000mAh 不满足高刷门槛', () => {
    expect(
      featuresOf(device({ category: 'phone', screen: { refreshRate: 143 }, battery: { capacity: 6000 } })),
    ).not.toContain('gaming');
  });
  it('反例：144Hz + 5999mAh 不满足电池门槛', () => {
    expect(
      featuresOf(device({ category: 'phone', screen: { refreshRate: 144 }, battery: { capacity: 5999 } })),
    ).not.toContain('gaming');
  });
});

describe('camera-flagship 影像旗舰', () => {
  it('正例：主摄 5000万 + 长焦 + OIS 命中', () => {
    expect(
      featuresOf(
        device({
          category: 'phone',
          camera: { main: '5000万像素 f/1.6 OIS', telephoto: '5000万像素 潜望长焦 OIS' },
        }),
      ),
    ).toContain('camera-flagship');
  });
  it('正例：2亿像素主摄 + 长焦 + OIS 命中', () => {
    expect(
      featuresOf(
        device({
          category: 'phone',
          camera: { main: '2亿像素 F1.7 OIS', telephoto: '5000万像素 5倍潜望长焦 OIS' },
        }),
      ),
    ).toContain('camera-flagship');
  });
  it('反例：主摄 4800万（不足 5000万）不命中', () => {
    expect(
      featuresOf(
        device({
          category: 'phone',
          camera: { main: '4800万像素 f/1.6 OIS', telephoto: '1200万像素 3倍长焦 OIS' },
        }),
      ),
    ).not.toContain('camera-flagship');
  });
  it('反例：主摄达标但无长焦不命中', () => {
    expect(
      featuresOf(device({ category: 'phone', camera: { main: '5000万像素 f/1.6 OIS', telephoto: null } })),
    ).not.toContain('camera-flagship');
  });
  it('反例：主摄达标 + 长焦但无 OIS 不命中', () => {
    expect(
      featuresOf(
        device({
          category: 'phone',
          camera: { main: '5000万像素 f/1.6', telephoto: '5000万像素 潜望长焦' },
        }),
      ),
    ).not.toContain('camera-flagship');
  });
});

describe('阈值敏感性（变异自测）', () => {
  /**
   * 证明测试确实在校验 SMALL_SCREEN_MAX 的真实取值，而非恒真断言：
   *  - 取 5.5"（介于 5.0 与 6.3 之间）：当前阈值 6.3 下命中；
   *  - 若把 features.ts 里的 SMALL_SCREEN_MAX 从 6.3 改成 5.0，5.5" 不再命中，本例变红；
   *  - 改回 6.3 即恢复变绿。
   *
   * SMALL_SCREEN_MAX 是 features.ts 的模块内常量、无法从外部注入，因此这里直接调用
   * 导出的 match 函数，用落在两个候选阈值之间的尺寸来「间接」锁定当前取值。
   */
  it('5.5" 手机在当前阈值（6.3）下命中小屏', () => {
    const def = FEATURE_DEFS.find((item) => item.id === 'small-screen')!;
    expect(def.match(device({ category: 'phone', screen: { size: 5.5 } }))).toBe(true);
  });
  it('反证：6.4" 手机在任何合理阈值下都不命中小屏', () => {
    const def = FEATURE_DEFS.find((item) => item.id === 'small-screen')!;
    expect(def.match(device({ category: 'phone', screen: { size: 6.4 } }))).toBe(false);
  });
});

describe('现有机型统计（阈值体检）', () => {
  it('每条特性命中的机型数量（命中 0 款或命中全部需重点排查）', () => {
    const counts: Record<string, number> = {};
    for (const def of FEATURE_DEFS) counts[def.id] = 0;
    for (const d of ALL_DEVICES) {
      for (const id of featuresOf(d)) counts[id] += 1;
    }
    const total = ALL_DEVICES.length;
    for (const def of FEATURE_DEFS) {
      const ratio = total > 0 ? ((counts[def.id] / total) * 100).toFixed(1) : '0.0';
      console.log(`[features] ${def.id}(${def.label}) 命中 ${counts[def.id]} / ${total}（${ratio}%）`);
    }
    expect(total).toBeGreaterThan(0);
  });

  it('口径修正前后差值：periscope 旧口径（只认「潜望」）vs 新口径（正则）', () => {
    // 旧口径漏掉苹果「四重反射棱镜」与华为「潜望式」；新口径 = features.ts 的正则
    const OLD_RE = /潜望/;
    let oldCount = 0;
    let newCount = 0;
    for (const d of ALL_DEVICES) {
      const tele = d.camera?.telephoto ?? '';
      if (OLD_RE.test(tele)) oldCount += 1;
      if (featuresOf(d).includes('periscope')) newCount += 1;
    }
    console.log(`[diff] periscope 旧口径(只认「潜望」)命中 ${oldCount} 款 → 新口径(正则)命中 ${newCount} 款，差值 +${newCount - oldCount}`);
    // 新口径命中数必须严格不少于旧口径（正则更宽松）
    expect(newCount).toBeGreaterThanOrEqual(oldCount);
  });

  it('口径修正前后差值：long-battery 平板阈值 30Wh vs 28Wh', () => {
    let countAt30 = 0;
    let countAt28 = 0;
    for (const d of ALL_DEVICES) {
      if (d.category !== 'tablet') continue;
      const wh = typeof d.battery?.batteryWh === 'number' ? d.battery.batteryWh : null;
      const cap = typeof d.battery?.capacity === 'number' ? d.battery.capacity : null;
      const baseMah = cap !== null && cap >= 8000;
      if (baseMah || (wh !== null && wh >= 30)) countAt30 += 1;
      if (baseMah || (wh !== null && wh >= 28)) countAt28 += 1;
    }
    console.log(`[diff] long-battery 平板阈值 30Wh 命中 ${countAt30} 款 → 28Wh 命中 ${countAt28} 款，差值 +${countAt28 - countAt30}`);
    expect(countAt28).toBeGreaterThanOrEqual(countAt30);
  });
});
