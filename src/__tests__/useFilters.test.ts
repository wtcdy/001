import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useFilters } from '../hooks/useFilters';
import type { Phone } from '../types/phone';

import { makePhone } from './fixtures';

function setup(phones: Phone[]) {
  return renderHook(() => useFilters(phones));
}

describe('useFilters', () => {
  describe('关键词搜索', () => {
    const phones = [
      makePhone({ id: 'p1', name: 'iPhone 15 Pro Max', brand: 'Apple', performance: { soc: 'A17 Pro' } }),
      makePhone({ id: 'p2', name: '小米14 Ultra', brand: '小米', performance: { soc: 'Snapdragon 8 Gen 3' } }),
      makePhone({ id: 'p3', name: 'vivo X100 Pro', brand: 'vivo', performance: { soc: '天玑9300' } }),
    ];

    it('空关键词返回全部机型', () => {
      const { result } = setup(phones);
      expect(result.current.filtered).toHaveLength(3);
      expect(result.current.active).toBe(false);
    });

    it('按机型名命中（大小写不敏感）', () => {
      const { result } = setup(phones);
      act(() => result.current.update('keyword', 'iphone'));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['p1']);
    });

    it('按品牌名命中', () => {
      const { result } = setup(phones);
      act(() => result.current.update('keyword', '小米'));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['p2']);
    });

    it('按处理器型号命中', () => {
      const { result } = setup(phones);
      act(() => result.current.update('keyword', '天玑'));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['p3']);
    });

    it('关键词首尾空格不影响命中', () => {
      const { result } = setup(phones);
      act(() => result.current.update('keyword', '  小米  '));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['p2']);
    });

    it('无命中时返回空列表且 active 为 true', () => {
      const { result } = setup(phones);
      act(() => result.current.update('keyword', '不存在的机型'));
      expect(result.current.filtered).toHaveLength(0);
      expect(result.current.active).toBe(true);
      expect(result.current.total).toBe(3);
    });
  });

  describe('品牌多选', () => {
    const phones = [
      makePhone({ id: 'a1', brand: 'Apple' }),
      makePhone({ id: 'a2', brand: 'Apple' }),
      makePhone({ id: 's1', brand: '三星' }),
      makePhone({ id: 'h1', brand: '华为' }),
    ];

    it('未选品牌时返回全部', () => {
      const { result } = setup(phones);
      expect(result.current.filtered).toHaveLength(4);
    });

    it('单选品牌只保留该品牌', () => {
      const { result } = setup(phones);
      act(() => result.current.update('brands', ['Apple']));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['a1', 'a2']);
    });

    it('多选品牌为并集（机型品牌属于所选任一品牌即保留）', () => {
      const { result } = setup(phones);
      act(() => result.current.update('brands', ['Apple', '三星']));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['a1', 'a2', 's1']);
    });

    it('toggleInArray 可反复增删品牌', () => {
      const { result } = setup(phones);
      act(() => result.current.toggleInArray('brands', '华为'));
      expect(result.current.filters.brands).toEqual(['华为']);
      act(() => result.current.toggleInArray('brands', '华为'));
      expect(result.current.filters.brands).toEqual([]);
    });

    it('品牌筛选与关键词同时生效时为「与」关系', () => {
      const target = [
        makePhone({ id: 'a1', brand: 'Apple', name: 'iPhone 15' }),
        makePhone({ id: 'a2', brand: 'Apple', name: 'iPhone 14' }),
        makePhone({ id: 'h1', brand: '华为', name: 'Mate 60' }),
      ];
      const { result } = setup(target);
      act(() => {
        result.current.update('brands', ['Apple']);
        result.current.update('keyword', '15');
      });
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['a1']);
    });
  });

  describe('价格区间', () => {
    const phones = [
      makePhone({ id: 'p2999', currentPrice: 2999, launchPrice: null }),
      makePhone({ id: 'p3000', currentPrice: 3000, launchPrice: null }),
      makePhone({ id: 'p4000', currentPrice: 4000, launchPrice: null }),
      makePhone({ id: 'p4001', currentPrice: 4001, launchPrice: null }),
    ];

    it('区间边界为闭区间（等于边界值即保留）', () => {
      const { result } = setup(phones);
      act(() => result.current.update('priceRange', [3000, 4000]));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['p3000', 'p4000']);
    });

    it('无价格数据时用首发价兜底', () => {
      const list = [makePhone({ id: 'lp', currentPrice: null, launchPrice: 3500 })];
      const { result } = setup(list);
      act(() => result.current.update('priceRange', [3000, 4000]));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['lp']);
    });

    it('价格缺失（且无首发价）的机型不被价格区间过滤掉', () => {
      const list = [makePhone({ id: 'np', currentPrice: null, launchPrice: null })];
      const { result } = setup(list);
      act(() => result.current.update('priceRange', [3000, 4000]));
      expect(result.current.filtered).toHaveLength(1);
    });
  });

  describe('布尔开关', () => {
    it('ip68Only 只保留 IP68 / IP69 机型', () => {
      const phones = [
        makePhone({ id: 'ip68', body: { ip: 'IP68' } }),
        makePhone({ id: 'ip69', body: { ip: 'IP69' } }),
        makePhone({ id: 'ip54', body: { ip: 'IP54' } }),
        makePhone({ id: 'none', body: { ip: null } }),
      ];
      const { result } = setup(phones);
      act(() => result.current.update('ip68Only', true));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['ip68', 'ip69']);
    });

    it('wirelessOnly 只保留无线充电功率 > 0 的机型', () => {
      const phones = [
        makePhone({ id: 'w50', battery: { wirelessCharge: 50 } }),
        makePhone({ id: 'w0', battery: { wirelessCharge: 0 } }),
        makePhone({ id: 'wnull', battery: { wirelessCharge: null } }),
      ];
      const { result } = setup(phones);
      act(() => result.current.update('wirelessOnly', true));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['w50']);
    });

    it('nfcOnly 只保留 nfc === true 的机型（false / null 均排除）', () => {
      const phones = [
        makePhone({ id: 't', system: { nfc: true } }),
        makePhone({ id: 'f', system: { nfc: false } }),
        makePhone({ id: 'n', system: { nfc: null } }),
      ];
      const { result } = setup(phones);
      act(() => result.current.update('nfcOnly', true));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['t']);
    });
  });

  describe('排序', () => {
    const phones = [
      makePhone({ id: 'old', releaseDate: '2021-03', currentPrice: 2000, battery: { capacity: 4000 } }),
      makePhone({ id: 'mid', releaseDate: '2023-06', currentPrice: 5000, battery: { capacity: 6000 } }),
      makePhone({ id: 'new', releaseDate: '2025-01', currentPrice: 3000, battery: { capacity: 5000 } }),
    ];

    it('release-desc（默认）：最新发布在前', () => {
      const { result } = setup(phones);
      expect(result.current.sortKey).toBe('release-desc');
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['new', 'mid', 'old']);
    });

    it('release-asc：最早发布在前', () => {
      const { result } = setup(phones);
      act(() => result.current.setSortKey('release-asc'));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['old', 'mid', 'new']);
    });

    it('price-asc：价格最低在前', () => {
      const { result } = setup(phones);
      act(() => result.current.setSortKey('price-asc'));
      expect(result.current.filtered[0].id).toBe('old');
      expect(result.current.filtered[result.current.filtered.length - 1].id).toBe('mid');
    });

    it('price-desc：价格最高在前', () => {
      const { result } = setup(phones);
      act(() => result.current.setSortKey('price-desc'));
      expect(result.current.filtered[0].id).toBe('mid');
      expect(result.current.filtered[result.current.filtered.length - 1].id).toBe('old');
    });

    it('battery-desc：电池最大在前', () => {
      const { result } = setup(phones);
      act(() => result.current.setSortKey('battery-desc'));
      expect(result.current.filtered[0].id).toBe('mid');
      expect(result.current.filtered[result.current.filtered.length - 1].id).toBe('old');
    });

    it('name-asc：按机型名排序', () => {
      const list = [
        makePhone({ id: 'b', name: 'Beta' }),
        makePhone({ id: 'a', name: 'Alpha' }),
      ];
      const { result } = setup(list);
      act(() => result.current.setSortKey('name-asc'));
      expect(result.current.filtered.map((phone) => phone.id)).toEqual(['a', 'b']);
    });
  });

  describe('reset', () => {
    it('reset 后恢复默认筛选条件', () => {
      const { result } = setup([makePhone({ id: 'a' })]);
      act(() => {
        result.current.update('keyword', 'xxx');
        result.current.update('brands', ['Apple']);
      });
      expect(result.current.active).toBe(true);
      act(() => result.current.reset());
      expect(result.current.active).toBe(false);
      expect(result.current.filters.keyword).toBe('');
      expect(result.current.filters.brands).toEqual([]);
    });
  });
});
