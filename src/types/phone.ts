/**
 * 机型 / 设备参数数据模型定义。
 *
 * **本文件是兼容层**：`Phone` 已降级为 `Device` 的类型别名（方案 C），
 * 真正的字段定义在 `src/types/device.ts`。全项目 100+ 处 `Phone` 引用、
 * `SpecRow.get: (p: Phone) => SpecValue`、7 个测试文件因此零改动继续编译通过。
 *
 * 约定：新代码一律写 `Device` / `DeviceCategory`，老代码自然腐化淘汰。
 * 说明：所有「拿不准」的字段一律填 null，前端渲染时统一显示为「—」。
 */

import type { Device, DeviceCategory, FeatureId, FormFactor } from './device';

/* ------------------------------------------------------------------ */
/* 向后兼容：`Phone` = `Device`                                         */
/* ------------------------------------------------------------------ */

export type { Device, Device as Phone } from './device';
export type {
  DeviceScreen as PhoneScreen,
  DevicePerformance as PhonePerformance,
  DeviceStorage as PhoneStorage,
  DeviceCamera as PhoneCamera,
  DeviceBattery as PhoneBattery,
  DeviceSystem as PhoneSystem,
  DeviceBody as PhoneBody,
} from './device';
export type { DeviceCategory, FormFactor, FeatureId } from './device';
export type {
  TabletExtras,
  LaptopExtras,
  StylusSpec,
  KeyboardSpec,
} from './device';

/**
 * 渠道报价记录。
 *
 * 与机型参数解耦、独立维护（见 `src/data/prices.ts`），便于价格单独更新而不动参数数据。
 */
export interface PriceRecord {
  /** 京东自营价（元）；无报价为 null */
  jd: number | null;
  /** 报价采集日期，形如 "2026-10-13" */
  updatedAt: string;
  /** 是否为内置兜底参考价（true 表示非平台实时抓取值） */
  isReference?: boolean;
}

/** 对比页使用的「一行参数」取值类型 */
export type SpecValue = string | number | boolean | null;

/** 优劣方向：数值越大越好 / 越小越好 / 不做判断 */
export type BetterDirection = 'higher' | 'lower' | null;

/** 参数分组中的一行定义 */
export interface SpecRow {
  /** 唯一 key，需与 Device 字段对应 */
  key: string;
  /** 展示用中文标签 */
  label: string;
  /** 取值函数 */
  get: (device: Device) => SpecValue;
  /**
   * 展示文本格式化钩子（可选）。
   *
   * 默认格式化只做「布尔 → 支持/不支持」「数值 + unit」「字符串 trim」；
   * 当某一行需要特殊文案（例如无线充电：0 → 「不支持」、>0 → 「50W」）时，
   * 通过该钩子描述，避免在渲染层针对具体行写 if 特判。
   */
  format?: (value: SpecValue, device: Device) => string | null;
  /** 单位后缀（纯数值项使用） */
  unit?: string;
  /** 优劣方向，用于对比高亮 */
  better?: BetterDirection;
  /** 是否为数值型（数值型才参与最优/最差判定） */
  numeric?: boolean;
  /**
   * 该行适用的品类；缺省 = 全品类。
   *
   * 例如影像组标注 `['phone','tablet']`，笔记本品类自动不渲染该行。
   */
  categories?: DeviceCategory[];
  /**
   * 仅在这些形态下渲染；缺省 = 不限形态。
   *
   * 例如「外屏尺寸 / 外屏分辨率」标注 `['fold-h','fold-v','fold-wide','fold-triple']`，
   * 直板机对比时不会出现两行「—」。
   */
  formFactors?: FormFactor[];
  /**
   * 是否允许跨品类对比（白名单制，缺省 = false）。
   *
   * 跨品类模式下只渲染 `crossComparable: true` 的行，且不做优劣判定：
   * 6.7" vs 11"、5000mAh vs 10000mAh、200g vs 682g 硬比会误导用户。
   */
  crossComparable?: boolean;
  /**
   * 行标签的补充说明（可选），渲染为标签旁的角标 + 悬浮提示。
   *
   * 用于价格行：渠道价可能是「官网价 × 折扣模型」推导的参考估算值，
   * 而非平台实时抓取，需要在对比表里让用户一眼看出并说明口径。
   */
  title?: string;
  /**
   * 角标文案（可选），缺省为「参考」。
   *
   * 「参考」只适合**估算值**（如渠道价）。第三方**实测**值（如极客湾实测续航 / 实测充满）
   * 是真实测出来的、不是估算，打「参考」语义偏了，这类行应传 `titleBadge: '实测'`。
   */
  titleBadge?: string;
}

/** 参数分组定义 */
export interface SpecGroup {
  /** 分组 key */
  key: string;
  /** 分组中文名 */
  label: string;
  /** 分组图标名（lucide） */
  icon: string;
  /** 默认是否展开 */
  defaultOpen: boolean;
  /** 该分组适用的品类；缺省 = 全品类 */
  categories?: DeviceCategory[];
  /** 该组下的参数行 */
  rows: SpecRow[];
}

/** 筛选条件 */
export interface FilterState {
  /** 关键词 */
  keyword: string;
  /** 选中的品牌列表，空数组代表不限 */
  brands: string[];
  /** 价格区间（元） */
  priceRange: [number, number];
  /** 发布年份列表 */
  years: string[];
  /** SOC 品牌列表 */
  socBrands: string[];
  /** 屏幕尺寸区间（英寸） */
  screenSizeRange: [number, number];
  /** 电池容量区间（mAh） */
  batteryRange: [number, number];
  /** 仅显示支持无线充电的机型（T02 起并入 `features`） */
  wirelessOnly: boolean;
  /** 仅显示 IP68 及以上机型（T02 起并入 `features`） */
  ip68Only: boolean;
  /** 仅显示支持 NFC 的机型（T02 起并入 `features`） */
  nfcOnly: boolean;
  /** 品类（单选，默认 phone）；T02 起由 `useFilters` 维护 */
  category: DeviceCategory;
  /** 形态多选；空数组代表不限 */
  formFactors: FormFactor[];
  /** 特性多选（派生特性 + 人工标签，统一为 id） */
  features: FeatureId[];
}

/** 排序方式 */
export type SortKey =
  | 'release-desc'
  | 'release-asc'
  | 'price-asc'
  | 'price-desc'
  | 'battery-desc'
  | 'name-asc';
