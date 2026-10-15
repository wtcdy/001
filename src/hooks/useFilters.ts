import { useCallback, useMemo, useState } from 'react';

import { BATTERY_BOUNDS, BOUNDS_BY_CATEGORY, PRICE_BOUNDS, SCREEN_SIZE_BOUNDS } from '../data';
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
  /**
   * 机身厚度区间（mm）；`null` = 不限。
   *
   * 与价格 / 屏幕 / 电池不同，厚度和重量**没有全库统一边界**：
   * 手机 6-10mm / 150-250g，平板 5-8mm / 300-900g，量纲差一个数量级，
   * 因此默认「不限」，由筛选面板按当前品类给出边界。
   */
  thicknessRange: null as [number, number] | null,
  /** 重量区间（g）；`null` = 不限 */
  weightRange: null as [number, number] | null,
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
    filters.batteryRange[1] !== DEFAULT_FILTERS.batteryRange[1] ||
    filters.thicknessRange !== null ||
    filters.weightRange !== null
  );
}

/**
 * 取机型「有效价」，用于价格筛选与排序：
 *  1. 优先取**京东自营价**（当前唯一渠道），与卡片主视觉展示的价格一致；
 *  2. 没有京东报价时，回落到机型自带的参考现价 / 首发价。
 *
 * 不取国补后到手价：国补有 6000 元上限，超上限机型补贴为 0，
 * 用它排序会让高价机型的顺序和展示价对不上。
 *
 * 与 `PRICE_BOUNDS` 使用同一口径（见 utils/effectivePrice.ts 的 effectivePriceOf），
 * 避免边界机型被价格滑块误筛掉。
 */
export function priceOf(phone: Phone): number | null {
  return effectivePriceOf(phone);
}

/**
 * 无有效价机型的排序规则：**一律沉底**（升序降序同规则），彼此按机型名稳定排序。
 *
 * 为什么不直接拿 `±Infinity` 参与相减：两个都是 null 时 `Infinity - Infinity` 得到 NaN，
 * 而比较器返回 NaN 时规范按 +0 处理，同一批无价机型之间的先后顺序就成了「看引擎心情」。
 * 停售机型（如已下架的 iPhone）现在 `currentPrice` 为 null 且可能没有渠道报价，
 * 这类机型有几十款，顺序飘动在用户眼里就是「每次刷新结果都不一样」。
 */
function compareMissingPrice(a: Phone, b: Phone, pa: number | null, pb: number | null): number {
  if (pa === null && pb === null) return (a.name ?? '').localeCompare(b.name ?? '', 'zh-CN');
  return pa === null ? 1 : -1;
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

  /**
   * 切换品类。
   *
   * 必须连带重置**按品类派生**的筛选项，否则会静默筛出 0 条：
   *  - `formFactors`：手机勾的 `fold-h` 在平板里不存在 → 平板列表空
   *  - `features`：特性是按品类定义的（如「小屏手机」只属于 phone）
   *  - 三条区间滑块：手机电池边界 2000-8000mAh 会把 10000mAh 的平板全筛掉
   *  - 品牌 / 年份 / 处理器厂商：平板的年份跨度与手机不同，残留会误筛
   *
   * 关键词保留——用户切品类时通常还想继续找同一个词。
   */
  const setCategory = useCallback((next: DeviceCategory) => {
    setFilters((prev) => {
      if (prev.category === next) return prev;
      const bounds = BOUNDS_BY_CATEGORY[next];
      return {
        ...DEFAULT_FILTERS,
        keyword: prev.keyword,
        category: next,
        priceRange: bounds.price,
        screenSizeRange: bounds.screenSize,
        batteryRange: bounds.battery,
      };
    });
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

      // 厚度 / 重量：null 表示不限；无该数值的机型不做排除（数据缺失不该被判为「不符合」）
      if (filters.thicknessRange) {
        const thickness = phone.body?.thickness ?? null;
        if (
          thickness !== null &&
          (thickness < filters.thicknessRange[0] || thickness > filters.thicknessRange[1])
        ) {
          return false;
        }
      }

      if (filters.weightRange) {
        const weight = phone.body?.weight ?? null;
        if (weight !== null && (weight < filters.weightRange[0] || weight > filters.weightRange[1])) {
          return false;
        }
      }

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
          const pa = priceOf(a);
          const pb = priceOf(b);
          if (pa === null || pb === null) return compareMissingPrice(a, b, pa, pb);
          return pa - pb;
        }
        case 'price-desc': {
          const pa = priceOf(a);
          const pb = priceOf(b);
          if (pa === null || pb === null) return compareMissingPrice(a, b, pa, pb);
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
    setCategory,
    sortKey,
    setSortKey,
    filtered,
    total: phones.length,
    active: hasActiveFilters(filters),
  };
}
