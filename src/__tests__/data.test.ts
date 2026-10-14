import { describe, expect, it } from 'vitest';

import {
  ALL_PHONES,
  BRANDS,
  BRAND_COUNTS,
  DUPLICATE_IDS,
  getPhonesByIds,
  PHONE_MAP,
  PHONES_BY_BRAND,
} from '../data';

describe('src/data/index.ts 数据集', () => {
  it('ALL_PHONES 非空且规模符合预期（>= 400 款）', () => {
    expect(ALL_PHONES.length).toBeGreaterThan(0);
    expect(ALL_PHONES.length).toBeGreaterThanOrEqual(400);
  });

  it('机型 id 全局唯一（无重复）', () => {
    const ids = ALL_PHONES.map((phone) => phone.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(DUPLICATE_IDS).toEqual([]);
  });

  it('PHONE_MAP 覆盖全部机型，且命中对象与原对象一致', () => {
    expect(Object.keys(PHONE_MAP).length).toBe(ALL_PHONES.length);
    const sample = ALL_PHONES[0];
    expect(PHONE_MAP[sample.id]).toBe(sample);
  });

  it('BRANDS / BRAND_COUNTS 与真实数据一致，且合计等于总数', () => {
    const sum = Object.values(BRAND_COUNTS).reduce((acc, n) => acc + n, 0);
    expect(sum).toBe(ALL_PHONES.length);
    expect(new Set(BRANDS).size).toBe(BRANDS.length);
    for (const brand of BRANDS) {
      expect(BRAND_COUNTS[brand]).toBeGreaterThan(0);
    }
  });

  it('PHONES_BY_BRAND 的条目既不在 ALL_PHONES 之外，也不重复计入', () => {
    const grouped = Object.values(PHONES_BY_BRAND).flat();
    expect(grouped.length).toBe(ALL_PHONES.length);
    for (const phone of grouped) {
      expect(PHONE_MAP[phone.id]).toBe(phone);
    }
  });

  describe('getPhonesByIds', () => {
    it('按传入顺序返回对应机型', () => {
      const [a, b, c] = [ALL_PHONES[0], ALL_PHONES[1], ALL_PHONES[2]];
      const result = getPhonesByIds([c.id, a.id, b.id]);
      expect(result.map((phone) => phone.id)).toEqual([c.id, a.id, b.id]);
    });

    it('不存在的 id 被过滤掉，不产生 undefined', () => {
      const real = ALL_PHONES[0];
      const result = getPhonesByIds(['not-exist-1', real.id, 'not-exist-2']);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(real.id);
      expect(result.every((phone) => phone !== undefined)).toBe(true);
      expect(result.some((phone) => phone === null)).toBe(false);
    });

    it('空数组返回空数组', () => {
      expect(getPhonesByIds([])).toEqual([]);
    });

    it('重复 id 会被原样返回两次（调用方负责去重）', () => {
      const real = ALL_PHONES[0];
      expect(getPhonesByIds([real.id, real.id])).toHaveLength(2);
    });
  });
});
