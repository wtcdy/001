import { describe, expect, it } from 'vitest';

// 以源码文本形式读入（Vite 的 ?raw）：用来校验「数据文件与导入脚本模板的导出是否一致」
import pricesSource from '../data/prices.ts?raw';
import scriptSource from '../../scripts/import-prices.mjs?raw';
import utilSource from '../utils/effectivePrice.ts?raw';

import { SUBSIDY_POLICY } from '../constants';
import { ALL_PHONES, PRICES, PRICE_BOUNDS, dealOfPhone, getPriceRecord } from '../data';
import { priceOf } from '../hooks/useFilters';
import { effectivePriceOf } from '../utils/effectivePrice';
import { computeDeal, formatYuan, normalizePrice, roundCents } from '../utils/price';
import type { PriceRecord } from '../types/phone';

import { makePhone } from './fixtures';

/** 构造报价记录；未传的渠道为 null */
function record(jd: number | null, pdd: number | null, extra: Partial<PriceRecord> = {}): PriceRecord {
  return { jd, pdd, updatedAt: '2026-10-13', ...extra };
}

describe('国补政策常量', () => {
  it('政策参数与 2026 年现行规则一致', () => {
    expect(SUBSIDY_POLICY.year).toBe(2026);
    expect(SUBSIDY_POLICY.priceCeiling).toBe(6000);
    expect(SUBSIDY_POLICY.rate).toBe(0.15);
    expect(SUBSIDY_POLICY.maxAmount).toBe(500);
    expect(SUBSIDY_POLICY.perPersonPerCategory).toBe(1);
    expect(SUBSIDY_POLICY.source).toContain('发改环资');
  });
});

describe('computeDeal 边界值', () => {
  it('5999 元：未超上限，但补贴被 500 元封顶', () => {
    const deal = computeDeal(record(5999, null));
    expect(deal.bestPrice).toBe(5999);
    expect(deal.eligible).toBe(true);
    expect(deal.subsidy).toBe(500); // 5999 × 15% = 899.85 → 封顶 500
    expect(deal.finalPrice).toBe(5499);
    expect(deal.saved).toBe(500);
    expect(deal.overCeiling).toBe(false);
  });

  it('6000 元：恰好等于上限，仍享受补贴', () => {
    const deal = computeDeal(record(null, 6000));
    expect(deal.eligible).toBe(true);
    expect(deal.subsidy).toBe(500);
    expect(deal.finalPrice).toBe(5500);
  });

  it('6001 元：超出上限，不享受补贴', () => {
    const deal = computeDeal(record(6001, null));
    expect(deal.eligible).toBe(false);
    expect(deal.subsidy).toBe(0);
    expect(deal.finalPrice).toBe(6001);
    expect(deal.overCeiling).toBe(true);
    expect(deal.saved).toBe(0);
  });

  it('5000 元：15% = 750 元，被封顶到 500 元', () => {
    const deal = computeDeal(record(5000, 5200));
    expect(deal.bestPrice).toBe(5000);
    expect(deal.subsidy).toBe(500);
    expect(deal.finalPrice).toBe(4500);
  });

  it('3333 元：15% = 499.95 元，精确到分不被封顶', () => {
    const deal = computeDeal(record(3333, null));
    expect(deal.subsidy).toBe(499.95);
    expect(deal.finalPrice).toBe(2833.05);
  });
});

describe('computeDeal 渠道取值', () => {
  it('两渠道都有价：取低价（jd 4299 / pdd 3999 → pdd）', () => {
    const deal = computeDeal(record(4299, 3999));
    expect(deal.bestChannel).toBe('pdd');
    expect(deal.bestPrice).toBe(3999);
    expect(deal.hasPrice).toBe(true);
  });

  it('两渠道都有价：京东更低时取京东', () => {
    const deal = computeDeal(record(3899, 3999));
    expect(deal.bestChannel).toBe('jd');
    expect(deal.bestPrice).toBe(3899);
  });

  it('价格相等时优先拼多多百亿补贴', () => {
    const deal = computeDeal(record(3999, 3999));
    expect(deal.bestChannel).toBe('pdd');
    expect(deal.bestPrice).toBe(3999);
  });

  it('仅京东有价', () => {
    const deal = computeDeal(record(4599, null));
    expect(deal.bestChannel).toBe('jd');
    expect(deal.bestPrice).toBe(4599);
    expect(deal.pdd).toBeNull();
    expect(deal.hasPrice).toBe(true);
  });

  it('仅拼多多有价', () => {
    const deal = computeDeal(record(null, 4299));
    expect(deal.bestChannel).toBe('pdd');
    expect(deal.bestPrice).toBe(4299);
    expect(deal.jd).toBeNull();
  });

  it('两渠道都无价：hasPrice 为 false，前端显示「暂无报价」', () => {
    const deal = computeDeal(record(null, null));
    expect(deal.hasPrice).toBe(false);
    expect(deal.bestPrice).toBeNull();
    expect(deal.finalPrice).toBeNull();
    expect(deal.subsidy).toBe(0);
    expect(deal.eligible).toBe(false);
  });

  it('未收录的机型（undefined）等同无报价', () => {
    const deal = computeDeal(undefined);
    expect(deal.hasPrice).toBe(false);
    expect(deal.updatedAt).toBeNull();
  });
});

describe('computeDeal 脏数据', () => {
  it('0 / 负数 / NaN 都视为缺失', () => {
    expect(computeDeal(record(0, 3999)).jd).toBeNull();
    expect(computeDeal(record(0, 3999)).bestChannel).toBe('pdd');
    expect(computeDeal(record(-100, null)).hasPrice).toBe(false);
    expect(computeDeal(record(Number.NaN, null)).hasPrice).toBe(false);
    expect(computeDeal(record(Number.POSITIVE_INFINITY, null)).hasPrice).toBe(false);
  });

  it('两渠道都是脏数据时整条无报价', () => {
    expect(computeDeal(record(0, -1)).hasPrice).toBe(false);
  });

  it('normalizePrice 只放行正的有效数字', () => {
    expect(normalizePrice(100)).toBe(100);
    expect(normalizePrice(0)).toBeNull();
    expect(normalizePrice(-1)).toBeNull();
    expect(normalizePrice(Number.NaN)).toBeNull();
    expect(normalizePrice(null)).toBeNull();
    expect(normalizePrice(undefined)).toBeNull();
  });

  it('roundCents 消除浮点误差', () => {
    expect(roundCents(0.1 + 0.2)).toBe(0.3);
    expect(roundCents(1.005)).toBe(1.01);
  });
});

describe('formatYuan 展示', () => {
  it('整数不带小数，非整数保留两位', () => {
    expect(formatYuan(3999)).toBe('3999');
    expect(formatYuan(2833.05)).toBe('2833.05');
    expect(formatYuan(499.95)).toBe('499.95');
    expect(formatYuan(null)).toBe('—');
    expect(formatYuan(undefined)).toBe('—');
  });

  it('展示值与计算值一致（不会出现展示 499.95、计算按 500）', () => {
    const deal = computeDeal(record(3333, null));
    expect(formatYuan(deal.subsidy)).toBe('499.95');
    expect(3333 - Number(formatYuan(deal.finalPrice))).toBeCloseTo(deal.subsidy, 6);
  });
});

describe('报价数据自检', () => {
  it('PRICES 里的 id 必须存在于机型库（防止脏数据）', () => {
    const ids = new Set(ALL_PHONES.map((phone) => phone.id));
    const unknown = Object.keys(PRICES).filter((id) => !ids.has(id));
    expect(unknown).toEqual([]);
  });

  it('价格均为 300~20000 的整数，且至少有一个渠道有价', () => {
    for (const [id, item] of Object.entries(PRICES)) {
      const values = [item.jd, item.pdd];
      expect(values.some((value) => typeof value === 'number' && value > 0), `${id} 无有效报价`).toBe(
        true,
      );
      for (const value of values) {
        if (value === null) continue;
        expect(Number.isInteger(value), `${id} 价格非整数：${value}`).toBe(true);
        expect(value).toBeGreaterThanOrEqual(300);
        expect(value).toBeLessThanOrEqual(20000);
      }
      expect(item.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('数据量落在 150~250 款的热门机型区间内', () => {
    const count = Object.keys(PRICES).length;
    expect(count).toBeGreaterThanOrEqual(150);
    expect(count).toBeLessThanOrEqual(250);
  });

  it('dealOfPhone / getPriceRecord 与 PRICES 一致', () => {
    const [firstId] = Object.keys(PRICES);
    const phone = ALL_PHONES.find((item) => item.id === firstId);
    if (!phone) throw new Error(`机型库中缺少 id：${firstId}`);
    const deal = dealOfPhone(phone);
    expect(deal.hasPrice).toBe(true);
    expect(getPriceRecord(firstId)).toBe(PRICES[firstId]);
    expect(getPriceRecord('not-exist')).toBeUndefined();
  });
});

describe('价格口径函数的位置（防止被数据文件重新生成时丢掉）', () => {
  /** 抽取源码里 export 出来的符号名 */
  function exportedNames(source: string): string[] {
    const names = new Set<string>();
    for (const match of source.matchAll(/export (?:const|function|class) ([A-Za-z0-9_]+)/g)) {
      names.add(match[1]);
    }
    for (const match of source.matchAll(/export (?:type|interface) ([A-Za-z0-9_]+)/g)) {
      names.add(match[1]);
    }
    for (const match of source.matchAll(/export type \{([^}]+)\}/g)) {
      for (const part of match[1].split(',')) {
        const name = part.trim().replace(/^type\s+/, '');
        if (name) names.add(name);
      }
    }
    return Array.from(names).sort();
  }

  /**
   * 回归用例：`src/data/prices.ts` 会被 `npm run import:prices --overwrite` 整文件重写。
   * 若脚本模板漏导出某个符号（历史上 effectivePriceOf 就漏过），
   * 覆盖后 `src/data/index.ts` 会编译失败、PRICE_BOUNDS 求值即崩（白屏）。
   * 这里锁住「脚本生成的模块必须导出当前 prices.ts 的全部符号」。
   */
  it('导入脚本模板导出的符号必须覆盖 prices.ts 的导出', () => {
    const required = exportedNames(pricesSource);
    const provided = new Set(exportedNames(scriptSource));
    expect(required.length).toBeGreaterThan(0);
    expect(required.filter((name) => !provided.has(name))).toEqual([]);
  });

  /** 口径函数属于「规则」而不是「数据」，必须待在不会被重写的文件里 */
  it('effectivePriceOf 定义在 utils/ 下，不在会被重新生成的 data/prices.ts 里', () => {
    expect(exportedNames(utilSource)).toContain('effectivePriceOf');
    expect(pricesSource).not.toContain('export function effectivePriceOf');
  });

  it('effectivePriceOf 与 priceOf 行为一致（同一口径）', () => {
    const [id] = Object.keys(PRICES);
    const phone = ALL_PHONES.find((item) => item.id === id);
    if (!phone) throw new Error(`机型库中缺少 id：${id}`);
    expect(effectivePriceOf(phone)).toBe(priceOf(phone));
    expect(effectivePriceOf(makePhone({ id: 'x', currentPrice: 1999, launchPrice: 2999 }))).toBe(
      1999,
    );
    expect(effectivePriceOf(makePhone({ id: 'x', currentPrice: null, launchPrice: null }))).toBeNull();
  });
});

describe('价格筛选/排序优先使用国补后到手价', () => {
  it('有渠道报价时按到手价取值', () => {
    const [id] = Object.keys(PRICES);
    const phone = makePhone({ id, currentPrice: 99999, launchPrice: 99999 });
    const deal = dealOfPhone(phone);
    expect(priceOf(phone)).toBe(deal.finalPrice);
    expect(priceOf(phone)).toBeLessThan(99999);
  });

  /**
   * 回归用例：补贴后的到手价可能低于「按首发价算出来的价格滑块下界」，
   * 若两个口径不一致，默认筛选就会悄悄漏掉最便宜的那批机型
   * （曾出现过首页少渲染 1 张卡片的问题）。
   */
  it('全部机型的有效价都落在 PRICE_BOUNDS 内（默认筛选不会漏机型）', () => {
    const [min, max] = PRICE_BOUNDS;
    const outside = ALL_PHONES.filter((phone) => {
      const price = priceOf(phone);
      return price !== null && (price < min || price > max);
    }).map((phone) => `${phone.id}=${priceOf(phone)}`);
    expect(outside).toEqual([]);
  });

  it('无渠道报价时回落到参考现价 / 首发价', () => {
    expect(priceOf(makePhone({ id: 'no-price-1', currentPrice: 2999, launchPrice: 3999 }))).toBe(2999);
    expect(priceOf(makePhone({ id: 'no-price-2', currentPrice: null, launchPrice: 3999 }))).toBe(3999);
    expect(priceOf(makePhone({ id: 'no-price-3', currentPrice: null, launchPrice: null }))).toBeNull();
  });
});
