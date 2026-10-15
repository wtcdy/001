import { SUBSIDY_POLICY } from '../constants';
import type { PriceRecord } from '../types/phone';

/**
 * 带「价格对应配置」的渠道报价。
 *
 * 同一机型不同内存/存储版本价差可达数千元（例如 12+256 与 16+1TB），
 * 只报价格不报配置会误导用户，因此报价必须带 `spec`。
 * 口径：`spec` 取该机型的**最低配组合**（min(ram) + min(rom)），由
 * `scripts/fill-price-spec.mjs` 从机型参数数据推导回填。
 */
export interface PriceRecordWithSpec extends PriceRecord {
  /** 价格对应的配置，形如 '12+256'；取不到时为 undefined / 空串 */
  spec?: string;
}

/**
 * 成交价计算（纯函数，无 React / 无 DOM，便于单测）。
 *
 * 计算顺序必须遵循政策口径：**先取渠道低价 → 再按低价计算国补**，
 * 因为补贴基数是「扣除各环节优惠后的最终销售价格」。
 *
 * 金额精度统一保留到「分」（两位小数），计算与展示使用同一个舍入结果，
 * 避免出现「展示 499.95、计算按 500」的偏差。
 */

/** 报价渠道（当前仅京东自营一个渠道；拼多多已下线） */
export type PriceChannel = 'jd';

/** 成交价计算结果 */
export interface DealResult {
  /** 是否有京东自营的有效报价 */
  hasPrice: boolean;
  /** 京东自营价（已规范化，无效值为 null） */
  jd: number | null;
  /** 有效报价渠道；单渠道下若有价必为 'jd'，无价为 null */
  bestChannel: PriceChannel | null;
  /** 渠道价（单渠道下即京东自营价） */
  bestPrice: number | null;
  /** 是否符合国补条件（渠道价 ≤ 政策价格上限） */
  eligible: boolean;
  /** 国补金额（元）；不符合条件时为 0 */
  subsidy: number;
  /** 国补后到手价（元） */
  finalPrice: number | null;
  /** 报价对应的配置，形如 '12+256'；取不到时为空串 */
  spec: string;
  /** 相对渠道价节省的金额（等于 subsidy，便于 UI 直接取用） */
  saved: number;
  /** 有报价但超出国补价格上限 */
  overCeiling: boolean;
  /** 报价采集日期 */
  updatedAt: string | null;
  /** 是否为内置兜底参考价 */
  isReference: boolean;
}

/** 金额保留到分：四舍五入，消除 0.1+0.2 这类浮点误差 */
export function roundCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** 规范化渠道价：非数字 / 非有限值 / ≤ 0 一律视为缺失（等同 null） */
export function normalizePrice(value: number | null | undefined): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value <= 0) return null;
  return roundCents(value);
}

/** 渠道中文名（单渠道口径，恒为京东） */
export function channelLabel(): string {
  return '京东';
}

/** 渠道角标（单渠道口径，恒为自营） */
export function channelTag(): string {
  return '自营';
}

/** 规范化配置串：去空格；非字符串统一降级为空串，UI 据此不显示配置 */
export function normalizeSpec(spec: string | null | undefined): string {
  return typeof spec === 'string' ? spec.trim() : '';
}

/** 配置展示文案：'12+256' → '12+256 · 最低配'；取不到返回 null */
export function specLabel(spec: string | null | undefined): string | null {
  const normalized = normalizeSpec(spec);
  return normalized === '' ? null : `${normalized} · 最低配`;
}

/** 无报价 / 无补贴时的空结果 */
function emptyDeal(record?: PriceRecordWithSpec): DealResult {
  return {
    hasPrice: false,
    jd: null,
    bestChannel: null,
    bestPrice: null,
    eligible: false,
    subsidy: 0,
    finalPrice: null,
    spec: normalizeSpec(record?.spec),
    saved: 0,
    overCeiling: false,
    updatedAt: record?.updatedAt ?? null,
    isReference: record?.isReference ?? false,
  };
}

/**
 * 计算「京东自营价 + 国补后到手价」。
 *
 * 展示口径：**主视觉是京东自营价**，国补后到手价只作为辅助信息，
 * 因此不要把 finalPrice 当成唯一价格展示。
 *
 * 单渠道口径：只认京东自营价，没有有效京东价即 hasPrice: false（前端回落到官网售价）。
 *
 * @param record 渠道报价记录；undefined 或京东价无效时返回 hasPrice: false
 */
export function computeDeal(record: PriceRecordWithSpec | undefined): DealResult {
  if (!record) return emptyDeal();

  const jd = normalizePrice(record.jd);
  if (jd === null) return emptyDeal(record);

  const bestChannel: PriceChannel = 'jd';
  const bestPrice = jd;

  const eligible = bestPrice <= SUBSIDY_POLICY.priceCeiling;
  const subsidy = eligible
    ? Math.min(roundCents(bestPrice * SUBSIDY_POLICY.rate), SUBSIDY_POLICY.maxAmount)
    : 0;

  return {
    hasPrice: true,
    jd,
    bestChannel,
    bestPrice,
    eligible,
    subsidy,
    finalPrice: roundCents(bestPrice - subsidy),
    spec: normalizeSpec(record.spec),
    saved: subsidy,
    overCeiling: !eligible,
    updatedAt: record.updatedAt ?? null,
    isReference: record.isReference ?? false,
  };
}

/**
 * 金额展示文本：整数不带小数，其余保留两位。
 * 空值统一返回「—」。
 */
export function formatYuan(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  const cents = roundCents(value);
  return Number.isInteger(cents) ? String(cents) : cents.toFixed(2);
}
