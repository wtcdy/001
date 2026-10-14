import { useCallback, useMemo, useState } from 'react';

import { BATTERY_BOUNDS, PRICE_BOUNDS, SCREEN_SIZE_BOUNDS } from '../data';
import type { DeviceCategory, FeatureId, FormFactor } from '../types/device';
import type { Phone, SortKey } from '../types/phone';

import { featuresOf } from '../utils/features';
import { effectivePriceOf } from '../utils/effectivePrice';

/** 默认筛选条件 */
export const DEFAULT_FILTERS = {
  keyword: '',
  brands: [] as string[],
  priceRange: [PRICE_BOUNDS[0], PRICE_BOUNDS[1]] as [number, number],
  years: [] as string[],
  socBrands: [] as string[],
  screenSizeRange: [SCREEN_SIZE_BOUNDS[0], SCREEN_SIZE_BOUNDS[1]] as [number, number],
  batteryRange: [BATTERY_BOUNDS[0], BATTERY_BOUNDS[1]] as [number, number],
  wirelessOnly: false,
  ip68Only: false,
  nfcOnly: false,
  // 品类默认 phone：默认值（phone + 空 formFactors + 空 features）恰好等价于「不过滤」，
  // 因此既有断言（未设置这三个字段时返回全部机型）无需改动即可继续成立。
  category: 'phone' as DeviceCategory,
  formFactors: [] as FormFactor[],
  features: [] as FeatureId[],
};

export type Filters = typeof DEFAULT_FILTERS;

/** 当前是否有任意生效的筛选/搜索条件 */
export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.keyword.trim() !== '' ||
    filters.brands.length > 0 ||
    filters.years.length > 0 ||
    filters.socBrands.length > 0 ||
    filters.wirelessOnly ||
    filters.ip68Only ||
    filters.nfcOnly ||
    filters.formFactors.length > 0 ||
    filters.features.length > 0 ||
    filters.category !== DEFAULT_FILTERS.category ||
    filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
    filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1] ||
    filters.screenSizeRange[0] !== DEFAULT_FILTERS.screenSizeRange[0] ||
    filters.screenSizeRange[1] !== DEFAULT_FILTERS.screenSizeRange[1] ||
    filters.batteryRange[0] !== DEFAULT_FILTERS.batteryRange[0] ||
    filters.batteryRange[1] !== DEFAULT_FILTERS.batteryRange[1]
  );
}

/**
 * 取机型「有效价」，用于价格筛选与排序：
 *  1. 优先取渠道低价经国补后的到手价（最能反映用户实际支出）；
 *  2. 没有渠道报价时，回落到机型自带的参考现价 / 首发价。
 *
 * 与 `PRICE_BOUNDS` 使用同一口径（见 data/prices.ts 的 effectivePriceOf），
 * 避免边界机型被价格滑块误筛掉。
 */
export function priceOf(phone: Phone): number | null {
  return effectivePriceOf(phone);
}

function matchKeyword(phone: Phone, keyword: string): boolean {
  const kw = keyword.trim().toLowerCase();
  if (kw === '') return true;
  const haystack = [
    phone.name,
    phone.brand,
    phone.performance?.soc ?? '',
    (phone.tags ?? []).join(' '),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(kw);
}

/**
 * 筛选 + 排序 Hook。
 * 返回过滤后的机型列表以及常用的更新方法。
 */
export function useFilters(phones: Phone[]) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>('release-desc');

  const update = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  /** 多选开关：已选则移除，未选则加入 */
  const toggleInArray = useCallback(
    (key: 'brands' | 'years' | 'socBrands' | 'formFactors' | 'features', value: string) => {
      setFilters((prev) => {
        // 五个键的值都是字符串数组（FormFactor / FeatureId 均为字符串联合，
        // 可安全视作 string[]），显式标注避免索引访问被推成 never[]
        const list: string[] = prev[key];
        const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
        return { ...prev, [key]: next };
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filtered = useMemo(() => {
    const result = phones.filter((phone) => {
      if (!matchKeyword(phone, filters.keyword)) return false;

      if (filters.brands.length > 0 && !filters.brands.includes(phone.brand)) return false;

      if (filters.years.length > 0) {
        const year = (phone.releaseDate ?? '').slice(0, 4);
        if (!filters.years.includes(year)) return false;
      }

      if (filters.socBrands.length > 0) {
        const brand = phone.performance?.socBrand ?? '';
        if (!filters.socBrands.includes(brand)) return false;
      }

      const price = priceOf(phone);
      if (price !== null) {
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      }

      const size = phone.screen?.size ?? null;
      if (size !== null) {
        if (size < filters.screenSizeRange[0] || size > filters.screenSizeRange[1]) return false;
      }

      const capacity = phone.battery?.capacity ?? null;
      if (capacity !== null) {
        if (capacity < filters.batteryRange[0] || capacity > filters.batteryRange[1]) return false;
      }

      if (filters.wirelessOnly && (phone.battery?.wirelessCharge ?? 0) <= 0) return false;

      if (filters.ip68Only) {
        const ip = (phone.body?.ip ?? '').toUpperCase();
        if (!ip.includes('IP68') && !ip.includes('IP69')) return false;
      }

      if (filters.nfcOnly && phone.system?.nfc !== true) return false;

      // 品类：单选精确匹配
      if (phone.category !== filters.category) return false;

      // 形态：空数组 = 不限，否则命中任一即保留（OR）
      if (filters.formFactors.length > 0 && !filters.formFactors.includes(phone.formFactor)) {
        return false;
      }

      // 特性：空数组 = 不限，否则全部命中才保留（AND）——
      // 用户勾「折叠屏 + 潜望长焦」是想找同时满足的机型，不是二选一。
      if (filters.features.length > 0) {
        const features = featuresOf(phone);
        for (const id of filters.features) {
          if (!features.includes(id)) return false;
        }
      }

      return true;
    });

    const sorted = [...result];
    sorted.sort((a, b) => {
      switch (sortKey) {
        case 'release-asc':
          return (a.releaseDate ?? '').localeCompare(b.releaseDate ?? '');
        case 'price-asc': {
          const pa = priceOf(a) ?? Number.POSITIVE_INFINITY;
          const pb = priceOf(b) ?? Number.POSITIVE_INFINITY;
          return pa - pb;
        }
        case 'price-desc': {
          const pa = priceOf(a) ?? Number.NEGATIVE_INFINITY;
          const pb = priceOf(b) ?? Number.NEGATIVE_INFINITY;
          return pb - pa;
        }
        case 'battery-desc':
          return (b.battery?.capacity ?? -1) - (a.battery?.capacity ?? -1);
        case 'name-asc':
          return (a.name ?? '').localeCompare(b.name ?? '', 'zh-CN');
        case 'release-desc':
        default:
          return (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '');
      }
    });
    return sorted;
  }, [phones, filters, sortKey]);

  return {
    filters,
    update,
    toggleInArray,
    reset,
    sortKey,
    setSortKey,
    filtered,
    total: phones.length,
    active: hasActiveFilters(filters),
  };
}
