import { SUBSIDY_POLICY } from '../constants';
import type { PriceRecord } from '../types/phone';

/**
 * 成交价计算（纯函数，无 React / 无 DOM，便于单测）。
 *
 * 计算顺序必须遵循政策口径：**先取渠道低价 → 再按低价计算国补**，
 * 因为补贴基数是「扣除各环节优惠后的最终销售价格」。
 *
 * 金额精度统一保留到「分」（两位小数），计算与展示使用同一个舍入结果，
 * 避免出现「展示 499.95、计算按 500」的偏差。
 */

/** 报价渠道 */
export type PriceChannel = 'jd' | 'pdd';

/** 成交价计算结果 */
export interface DealResult {
  /** 是否至少有一个渠道的有效报价 */
  hasPrice: boolean;
  /** 京东自营价（已规范化，无效值为 null） */
  jd: number | null;
  /** 拼多多百亿补贴价（已规范化，无效值为 null） */
  pdd: number | null;
  /** 低价渠道；两渠道价格相等时优先拼多多百亿补贴 */
  bestChannel: PriceChannel | null;
  /** 渠道低价 */
  bestPrice: number | null;
  /** 是否符合国补条件（渠道低价 ≤ 政策价格上限） */
  eligible: boolean;
  /** 国补金额（元）；不符合条件时为 0 */
  subsidy: number;
  /** 国补后到手价（元） */
  finalPrice: number | null;
  /** 相对渠道低价节省的金额（等于 subsidy，便于 UI 直接取用） */
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

/** 渠道中文名 */
export function channelLabel(channel: PriceChannel): string {
  return channel === 'jd' ? '京东自营' : '拼多多百亿补贴';
}

/** 无报价 / 无补贴时的空结果 */
function emptyDeal(record?: PriceRecord): DealResult {
  return {
    hasPrice: false,
    jd: null,
    pdd: null,
    bestChannel: null,
    bestPrice: null,
    eligible: false,
    subsidy: 0,
    finalPrice: null,
    saved: 0,
    overCeiling: false,
    updatedAt: record?.updatedAt ?? null,
    isReference: record?.isReference ?? false,
  };
}

/**
 * 计算「渠道低价 + 国补后到手价」。
 *
 * @param record 渠道报价记录；undefined 或两渠道均无效时返回 hasPrice: false
 */
export function computeDeal(record: PriceRecord | undefined): DealResult {
  if (!record) return emptyDeal();

  const jd = normalizePrice(record.jd);
  const pdd = normalizePrice(record.pdd);
  if (jd === null && pdd === null) return emptyDeal(record);

  let bestChannel: PriceChannel;
  let bestPrice: number;
  if (jd === null) {
    bestChannel = 'pdd';
    bestPrice = pdd as number;
  } else if (pdd === null) {
    bestChannel = 'jd';
    bestPrice = jd;
  } else {
    // 两渠道都有价：取低价；相等时优先拼多多百亿补贴
    bestChannel = pdd <= jd ? 'pdd' : 'jd';
    bestPrice = pdd <= jd ? pdd : jd;
  }

  const eligible = bestPrice <= SUBSIDY_POLICY.priceCeiling;
  const subsidy = eligible
    ? Math.min(roundCents(bestPrice * SUBSIDY_POLICY.rate), SUBSIDY_POLICY.maxAmount)
    : 0;

  return {
    hasPrice: true,
    jd,
    pdd,
    bestChannel,
    bestPrice,
    eligible,
    subsidy,
    finalPrice: roundCents(bestPrice - subsidy),
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
