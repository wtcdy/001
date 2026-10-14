import type { Device, FormFactor } from '../types/device';
import type { SpecGroup, SpecRow, SpecValue } from '../types/phone';

import { dealOfPhone } from './prices';

/** 把可能的空值统一转换成可展示字符串；null / undefined / 空串 返回 null */
function v(value: SpecValue): SpecValue {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
}

/** 布尔值转中文「支持 / 不支持」 */
function boolText(value: boolean | null, trueText = '支持', falseText = '不支持'): string | null {
  if (value === null || value === undefined) return null;
  return value ? trueText : falseText;
}

/** 数组转字符串，如 [8,12,16] -> "8 / 12 / 16" */
function joinNumbers(list: number[] | undefined, suffix: string): string | null {
  if (!list || list.length === 0) return null;
  return list.map((n) => `${n}${suffix}`).join(' / ');
}

/**
 * 需要渲染「外屏」两行的形态：全部折叠形态。
 *
 * 枚举还在增殖（横折叠 → 阔折叠 → 三折叠 → 中折叠），新增形态时记得同步这里。
 */
const FOLD_FORM_FACTORS: FormFactor[] = [
  'fold-h',
  'fold-mid',
  'fold-v',
  'fold-wide',
  'fold-triple',
];

/** 手机 / 平板（笔记本没有折叠外屏，也没有影像强需求） */
const PHONE_AND_TABLET = ['phone', 'tablet'] as const;
/** 全部品类 */
const ALL_CATEGORIES = ['phone', 'tablet', 'laptop'] as const;

/**
 * 参数分组展示配置。
 *
 * 顺序参考懂车帝车型对比的分组方式：基础信息 → 屏幕 → 性能 → 存储 → 影像 → 前置 → 电池与充电 → 系统与网络 → 机身。
 *
 * 品类裁剪：`categories` 声明该分组 / 该行适用的品类（缺省 = 全品类）；
 * 跨品类降级：`crossComparable` 是**白名单**（缺省 = false），跨品类对比时只渲染为 true 的行，
 * 且不做优劣判定——6.7" vs 11"、5000mAh vs 10000mAh、200g vs 682g 硬比会误导用户。
 */
export const SPEC_GROUPS: SpecGroup[] = [
  {
    key: 'basic',
    label: '基础信息',
    icon: 'Info',
    defaultOpen: true,
    categories: [...ALL_CATEGORIES],
    rows: [
      {
        key: 'brand',
        label: '品牌',
        get: (device: Device) => v(device.brand),
        // 跨品类对比必须能看到「哪一列是哪台设备」，否则用户对着一堆数值不知道在看什么；
        // 这两行非数值型，标 true 只是保证渲染，不会产生优劣判定
        crossComparable: true,
      },
      {
        key: 'name',
        label: '机型名称',
        get: (device: Device) => v(device.name),
        crossComparable: true,
      },
      {
        key: 'releaseDate',
        label: '发布时间',
        get: (device: Device) => v(device.releaseDate),
        // 时间是同量纲，跨品类可比（「同代产品 vs 同代产品」）
        crossComparable: true,
      },
      {
        key: 'launchPrice',
        label: '首发价',
        get: (device: Device) => v(device.launchPrice ?? null),
        unit: '元',
        better: 'lower',
        numeric: true,
        // 与渠道价同属「元」量纲，口径保持一致：价格类一律跨品类可比
        crossComparable: true,
      },
      {
        key: 'currentPrice',
        // 明确标注「未计国补」：与下面的渠道价 / 国补后到手价区分开，避免两个「参考价」混淆
        label: '参考现价（未计国补）',
        get: (device: Device) => v(device.currentPrice ?? null),
        unit: '元',
        better: 'lower',
        numeric: true,
        crossComparable: true,
      },
      // 渠道价与国补后到手价：价格类一律「越低越优」，参与差异高亮与最优/最弱标记；
      // 且跨品类可比——「同预算买手机还是平板」是真实决策场景
      {
        key: 'price.jd',
        label: '京东自营价',
        get: (device: Device) => v(dealOfPhone(device).jd),
        unit: '元',
        better: 'lower',
        numeric: true,
        crossComparable: true,
      },
      {
        key: 'price.pdd',
        label: '拼多多百亿补贴价',
        get: (device: Device) => v(dealOfPhone(device).pdd),
        unit: '元',
        better: 'lower',
        numeric: true,
        crossComparable: true,
      },
      {
        key: 'price.final',
        label: '国补后到手价',
        get: (device: Device) => v(dealOfPhone(device).finalPrice),
        unit: '元',
        better: 'lower',
        numeric: true,
        crossComparable: true,
      },
      {
        key: 'tags',
        label: '产品标签',
        get: (device: Device) => (device.tags && device.tags.length > 0 ? device.tags.join('、') : null),
      },
    ],
  },
  {
    key: 'screen',
    label: '屏幕',
    icon: 'Monitor',
    defaultOpen: true,
    categories: [...ALL_CATEGORIES],
    rows: [
      {
        key: 'screen.size',
        label: '屏幕尺寸',
        get: (device: Device) => v(device.screen?.size ?? null),
        unit: '英寸',
        numeric: true,
        // 6.7" vs 11" 无优劣，跨品类硬比会误导
        crossComparable: false,
      },
      {
        key: 'screen.resolution',
        label: '分辨率',
        get: (device: Device) => v(device.screen?.resolution ?? null),
      },
      {
        key: 'screen.ppi',
        label: '像素密度',
        get: (device: Device) => v(device.screen?.ppi ?? null),
        unit: 'PPI',
        better: 'higher',
        numeric: true,
        // 密度与尺寸无关，跨品类可比
        crossComparable: true,
      },
      {
        key: 'screen.material',
        label: '屏幕材质',
        get: (device: Device) => v(device.screen?.material ?? null),
      },
      {
        key: 'screen.refreshRate',
        label: '刷新率',
        get: (device: Device) => v(device.screen?.refreshRate ?? null),
        unit: 'Hz',
        better: 'higher',
        numeric: true,
        crossComparable: true,
      },
      {
        key: 'screen.peakBrightness',
        label: '峰值亮度',
        get: (device: Device) => v(device.screen?.peakBrightness ?? null),
        unit: 'nit',
        better: 'higher',
        numeric: true,
        crossComparable: true,
      },
      {
        key: 'screen.dimming',
        label: '调光方式',
        get: (device: Device) => v(device.screen?.dimming ?? null),
      },
      {
        key: 'screen.hdr',
        label: 'HDR 支持',
        get: (device: Device) => v(device.screen?.hdr ?? null),
      },
      {
        key: 'screen.ratio',
        label: '屏占比',
        get: (device: Device) => v(device.screen?.ratio ?? null),
      },
      // 折叠机外屏：仅折叠形态渲染，直板机 / 平板不会出现两行「—」
      {
        key: 'screen.coverSize',
        label: '外屏尺寸',
        get: (device: Device) => v(device.screen?.coverSize ?? null),
        unit: '英寸',
        numeric: true,
        categories: [...PHONE_AND_TABLET],
        formFactors: FOLD_FORM_FACTORS,
      },
      {
        key: 'screen.coverResolution',
        label: '外屏分辨率',
        get: (device: Device) => v(device.screen?.coverResolution ?? null),
        categories: [...PHONE_AND_TABLET],
        formFactors: FOLD_FORM_FACTORS,
      },
    ],
  },
  {
    key: 'performance',
    label: '性能',
    icon: 'Cpu',
    defaultOpen: true,
    categories: [...ALL_CATEGORIES],
    rows: [
      {
        key: 'performance.soc',
        label: '处理器',
        get: (device: Device) => v(device.performance?.soc ?? null),
      },
      {
        key: 'performance.socBrand',
        label: '处理器厂商',
        get: (device: Device) => v(device.performance?.socBrand ?? null),
      },
      {
        key: 'performance.process',
        label: '制程工艺',
        get: (device: Device) => v(device.performance?.process ?? null),
      },
      {
        key: 'performance.cpu',
        label: 'CPU',
        get: (device: Device) => v(device.performance?.cpu ?? null),
      },
      {
        key: 'performance.gpu',
        label: 'GPU',
        get: (device: Device) => v(device.performance?.gpu ?? null),
      },
      {
        key: 'performance.antutu',
        label: '安兔兔跑分',
        get: (device: Device) => v(device.performance?.antutu ?? null),
        better: 'higher',
        numeric: true,
        // 同量纲跑分，跨品类可比
        crossComparable: true,
      },
      {
        key: 'performance.ramType',
        label: '内存规格',
        get: (device: Device) => v(device.performance?.ramType ?? null),
      },
      {
        key: 'performance.romType',
        label: '闪存规格',
        get: (device: Device) => v(device.performance?.romType ?? null),
      },
    ],
  },
  {
    key: 'storage',
    label: '存储',
    icon: 'HardDrive',
    defaultOpen: true,
    categories: [...ALL_CATEGORIES],
    rows: [
      {
        key: 'storage.ramOptions',
        label: '运行内存',
        get: (device: Device) => joinNumbers(device.storage?.ramOptions, 'GB'),
        crossComparable: true,
      },
      {
        key: 'storage.romOptions',
        label: '机身存储',
        get: (device: Device) => joinNumbers(device.storage?.romOptions, 'GB'),
        crossComparable: true,
      },
    ],
  },
  {
    key: 'camera',
    label: '影像',
    icon: 'Camera',
    defaultOpen: true,
    // 笔记本摄像头仅摄像用，不参与影像对比
    categories: [...PHONE_AND_TABLET],
    rows: [
      {
        key: 'camera.main',
        label: '主摄',
        get: (device: Device) => v(device.camera?.main ?? null),
        crossComparable: false,
      },
      {
        key: 'camera.ultraWide',
        label: '超广角',
        get: (device: Device) => v(device.camera?.ultraWide ?? null),
        crossComparable: false,
      },
      {
        key: 'camera.telephoto',
        label: '长焦',
        get: (device: Device) => v(device.camera?.telephoto ?? null),
        crossComparable: false,
      },
      {
        key: 'camera.extra',
        label: '其他镜头',
        get: (device: Device) => v(device.camera?.extra ?? null),
        crossComparable: false,
      },
      {
        key: 'camera.zoom',
        label: '变焦能力',
        get: (device: Device) => v(device.camera?.zoom ?? null),
        crossComparable: false,
      },
      {
        key: 'camera.video',
        label: '视频拍摄',
        get: (device: Device) => v(device.camera?.video ?? null),
        crossComparable: false,
      },
    ],
  },
  {
    key: 'front',
    label: '前置',
    icon: 'User',
    defaultOpen: true,
    categories: [...PHONE_AND_TABLET],
    rows: [
      {
        key: 'frontCamera',
        label: '前置摄像头',
        get: (device: Device) => v(device.frontCamera ?? null),
      },
    ],
  },
  {
    key: 'battery',
    label: '电池与充电',
    icon: 'BatteryCharging',
    defaultOpen: true,
    categories: [...ALL_CATEGORIES],
    rows: [
      {
        key: 'battery.capacity',
        label: '电池容量',
        get: (device: Device) => v(device.battery?.capacity ?? null),
        unit: 'mAh',
        better: 'higher',
        numeric: true,
        // 5000mAh vs 10000mAh 无优劣（功耗差数倍），跨品类不可比
        crossComparable: false,
      },
      {
        key: 'battery.wiredCharge',
        label: '有线充电',
        get: (device: Device) => v(device.battery?.wiredCharge ?? null),
        unit: 'W',
        better: 'higher',
        numeric: true,
      },
      {
        key: 'battery.wirelessCharge',
        label: '无线充电',
        // get() 返回原始数值，保证能参与 numeric 优劣比较；
        // 展示文案（「50W」/「不支持」）交给 format 钩子，渲染层无需特判。
        get: (device: Device) => v(device.battery?.wirelessCharge ?? null),
        format: (value: SpecValue) => {
          if (typeof value !== 'number') return null;
          return value > 0 ? `${value}W` : '不支持';
        },
        better: 'higher',
        numeric: true,
      },
      {
        key: 'battery.reverseCharge',
        label: '反向充电',
        get: (device: Device) => v(device.battery?.reverseCharge ?? null),
      },
    ],
  },
  {
    key: 'system',
    label: '系统与网络',
    icon: 'Wifi',
    defaultOpen: true,
    categories: [...ALL_CATEGORIES],
    rows: [
      {
        key: 'system.os',
        label: '出厂系统',
        get: (device: Device) => v(device.system?.os ?? null),
      },
      {
        key: 'system.ui',
        label: '系统界面',
        get: (device: Device) => v(device.system?.ui ?? null),
      },
      {
        key: 'system.network',
        label: '网络制式',
        get: (device: Device) => v(device.system?.network ?? null),
      },
      {
        key: 'system.wifi',
        label: 'Wi-Fi',
        get: (device: Device) => v(device.system?.wifi ?? null),
      },
      {
        key: 'system.bluetooth',
        label: '蓝牙',
        get: (device: Device) => v(device.system?.bluetooth ?? null),
      },
      {
        key: 'system.nfc',
        label: 'NFC',
        get: (device: Device) => boolText(device.system?.nfc ?? null),
      },
      {
        key: 'system.infrared',
        label: '红外遥控',
        get: (device: Device) => boolText(device.system?.infrared ?? null),
      },
      {
        key: 'system.satellite',
        label: '卫星通信',
        get: (device: Device) => v(device.system?.satellite ?? null),
      },
    ],
  },
  {
    key: 'body',
    label: '机身',
    icon: 'Smartphone',
    defaultOpen: true,
    categories: [...ALL_CATEGORIES],
    rows: [
      {
        key: 'body.dimensions',
        label: '机身尺寸',
        get: (device: Device) => v(device.body?.dimensions ?? null),
      },
      {
        key: 'body.weight',
        label: '重量',
        // 统一存 g；跨品类不可比（200g vs 682g 无优劣）
        get: (device: Device) => v(device.body?.weight ?? null),
        unit: 'g',
        better: 'lower',
        numeric: true,
        crossComparable: false,
      },
      {
        key: 'body.material',
        label: '机身材质',
        get: (device: Device) => v(device.body?.material ?? null),
      },
      {
        key: 'body.ip',
        label: '防尘防水',
        get: (device: Device) => v(device.body?.ip ?? null),
      },
      {
        key: 'body.biometrics',
        label: '生物识别',
        get: (device: Device) => v(device.body?.biometrics ?? null),
      },
      {
        key: 'body.speaker',
        label: '扬声器',
        get: (device: Device) => v(device.body?.speaker ?? null),
      },
      {
        key: 'body.port',
        label: '接口',
        get: (device: Device) => v(device.body?.port ?? null),
      },
      {
        key: 'body.colors',
        label: '配色',
        get: (device: Device) => v(device.body?.colors ?? null),
      },
    ],
  },
];

/** 分组 key -> 分组对象 的索引，方便按 key 快速取用 */
export const SPEC_GROUP_MAP: Record<string, SpecGroup> = SPEC_GROUPS.reduce(
  (acc: Record<string, SpecGroup>, group: SpecGroup) => {
    acc[group.key] = group;
    return acc;
  },
  {} as Record<string, SpecGroup>,
);

/**
 * 判断某一行在给定设备列表下是否需要渲染。
 *
 * 两条裁剪规则：
 *  1. 品类：行声明了 `categories` 时，**所有**参与对比的设备品类都在名单内才渲染；
 *  2. 形态：行声明了 `formFactors` 时，**至少有一台**设备形态命中才渲染
 *     （Pura X vs iPhone 也要能看到外屏那一行）。
 *
 * 未声明即不裁剪。当前 455 款手机全部是 `phone` + `bar`，因此本函数对既有着
 * 对比页渲染结果**零影响**，只是把扩展位接好。
 */
export function shouldRenderRow(row: SpecRow, devices: Device[]): boolean {
  if (devices.length === 0) return true;

  if (row.categories && row.categories.length > 0) {
    const allowed = new Set(row.categories);
    if (!devices.every((device) => allowed.has(device.category))) return false;
  }

  if (row.formFactors && row.formFactors.length > 0) {
    const allowed = new Set(row.formFactors);
    if (!devices.some((device) => allowed.has(device.formFactor))) return false;
  }

  return true;
}

/** 计算某一行在给定机型列表下的「差异情况」与「最优 / 最差下标」 */
export interface RowDiffResult {
  /** 是否所有机型取值完全一致（完全一致的行在「只看不同」模式下会被隐藏） */
  allSame: boolean;
  /** 各机型展示文本（缺失为 null） */
  displayValues: (string | null)[];
  /** 与其他机型不一致的下标集合 */
  diffIndexes: number[];
  /** 数值最优的下标集合（仅在该行为数值型且 better 有方向时才有值） */
  bestIndexes: number[];
  /** 数值最差的下标集合 */
  worstIndexes: number[];
}

/**
 * 通用展示文本格式化：布尔 → 支持/不支持、数值 → 数字 + unit、字符串 → trim。
 * 行自带 `format` 钩子时优先使用钩子，避免为单行写特判。
 */
function formatValue(value: SpecValue, row: SpecRow): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return value ? '支持' : '不支持';
  if (typeof value === 'number') {
    const text = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
    return row.unit ? `${text}${row.unit}` : text;
  }
  const text = String(value).trim();
  return text === '' ? null : text;
}

/**
 * 计算一行的差异信息。
 *
 * 差异语义：**缺失（null）也是一个可比较的取值**。
 * 「A 有潜望长焦、B 没有」必须算差异，否则「只看不同」会把这类用户最关心的差异藏掉。
 * 只有当所有机型的取值（含缺失状态）完全一致时，allSame 才为 true。
 *
 * 注意：中国用户习惯「更优 = 红/橙系，更差 = 绿/灰系」，本函数只负责算出下标，
 * 配色由 UI 层决定（better.* 与 worse.* Tailwind 色板）。
 */
export function computeRowDiff(row: SpecRow, devices: Device[]): RowDiffResult {
  const rawValues: SpecValue[] = devices.map((device) => {
    try {
      return row.get(device);
    } catch {
      return null;
    }
  });

  const displayValues: (string | null)[] = rawValues.map((value, index) =>
    row.format ? row.format(value, devices[index]) : formatValue(value, row),
  );

  // 差异判定：所有机型的展示值（含 null）完全一致才算「无差异」
  const allSame = displayValues.every((text) => text === displayValues[0]);

  const diffIndexes: number[] = [];
  if (!allSame && devices.length > 1) {
    // 以出现次数最多的取值（含缺失）作为「基准」，其余视为差异项
    const counter = new Map<string | null, number>();
    for (const text of displayValues) {
      counter.set(text, (counter.get(text) ?? 0) + 1);
    }
    let baseText: string | null = displayValues[0];
    let maxCount = 0;
    counter.forEach((count, text) => {
      if (count > maxCount) {
        maxCount = count;
        baseText = text;
      }
    });
    displayValues.forEach((text, index) => {
      if (text !== baseText) diffIndexes.push(index);
    });
  }

  const bestIndexes: number[] = [];
  const worstIndexes: number[] = [];
  if (row.numeric && row.better && devices.length > 1) {
    // 直接用下标取 rawValues，避免 devices.indexOf(device) 造成的 O(n²)
    const numericValues: number[] = rawValues.map((raw) =>
      typeof raw === 'number' && Number.isFinite(raw) ? raw : Number.NaN,
    );
    const valid = numericValues.filter((n) => !Number.isNaN(n));
    if (valid.length > 1) {
      const max = Math.max(...valid);
      const min = Math.min(...valid);
      if (max !== min) {
        numericValues.forEach((n, index) => {
          if (Number.isNaN(n)) return;
          if (row.better === 'higher') {
            if (n === max) bestIndexes.push(index);
            if (n === min) worstIndexes.push(index);
          } else {
            if (n === min) bestIndexes.push(index);
            if (n === max) worstIndexes.push(index);
          }
        });
      }
    }
  }

  return { allSame, displayValues, diffIndexes, bestIndexes, worstIndexes };
}
