import type { Device, DeviceCategory, FormFactor } from '../types/device';
import type { Phone } from '../types/phone';

import { CATEGORIES } from '../constants';
import { formFactorLabel } from '../utils/deviceFormat';
import { effectivePriceOf } from '../utils/effectivePrice';
import { APPLE_PHONES } from './phones/apple';
import { HONOR_PHONES } from './phones/honor';
import { HUAWEI_PHONES } from './phones/huawei';
import { IQOO_PHONES } from './phones/iqoo';
import { MEIZU_PHONES } from './phones/meizu';
import { MOTOROLA_PHONES } from './phones/motorola';
import { NUBIA_PHONES } from './phones/nubia';
import { ONEPLUS_PHONES } from './phones/oneplus';
import { OPPO_PHONES } from './phones/oppo';
import {
  ASUS_PHONES,
  NOTHING_PHONES,
  OTHER_PHONES,
  OTHERS_ALL,
  PIXEL_PHONES,
  ZTE_PHONES,
} from './phones/others';
import { REALME_PHONES } from './phones/realme';
import { REDMI_PHONES } from './phones/redmi';
import { SAMSUNG_PHONES } from './phones/samsung';
import { SONY_PHONES } from './phones/sony';
import { VIVO_PHONES } from './phones/vivo';
import { XIAOMI_PHONES } from './phones/xiaomi';

/**
 * 全部设备数据源。
 *
 * 各品牌数据文件位于 `src/data/phones/` 目录：
 *  - 详细格式使用 `../_factory.ts` 的 `list()`（见 apple.ts）
 *  - 紧凑格式使用 `../_factory.ts` 的 `c()`（其余品牌）
 *
 * 品类抽象后：手机 / 平板 / 笔记本全部产出 `Device`，在 `ALL_DEVICES` 汇总；
 * 平板目录（`src/data/tablets/`）在 T03 接入后追加到 `ALL_DEVICES` 即可。
 */

/** 按品牌分组的机型数据 */
export const PHONES_BY_BRAND: Record<string, Phone[]> = {
  Apple: APPLE_PHONES,
  华为: HUAWEI_PHONES,
  荣耀: HONOR_PHONES,
  小米: XIAOMI_PHONES,
  Redmi: REDMI_PHONES,
  OPPO: OPPO_PHONES,
  一加: ONEPLUS_PHONES,
  realme: REALME_PHONES,
  vivo: VIVO_PHONES,
  iQOO: IQOO_PHONES,
  三星: SAMSUNG_PHONES,
  魅族: MEIZU_PHONES,
  努比亚: NUBIA_PHONES,
  摩托罗拉: MOTOROLA_PHONES,
  索尼: SONY_PHONES,
  Google: PIXEL_PHONES,
  Nothing: NOTHING_PHONES,
  中兴: ZTE_PHONES,
  华硕: ASUS_PHONES,
  其他: OTHER_PHONES,
};

/** 汇总后的全部机型（含「其他」品牌的合集） */
export const ALL_PHONES: Device[] = [
  APPLE_PHONES,
  HUAWEI_PHONES,
  HONOR_PHONES,
  XIAOMI_PHONES,
  REDMI_PHONES,
  OPPO_PHONES,
  ONEPLUS_PHONES,
  REALME_PHONES,
  VIVO_PHONES,
  IQOO_PHONES,
  SAMSUNG_PHONES,
  MEIZU_PHONES,
  NUBIA_PHONES,
  MOTOROLA_PHONES,
  SONY_PHONES,
  OTHERS_ALL,
].flat();

/** 全部设备（跨品类总表）。当前只有手机；平板 / 笔记本接入后在此追加 */
export const ALL_DEVICES: Device[] = ALL_PHONES;

/* ------------------------------------------------------------------ */
/* 数据自检：跨品类 id 唯一性校验                                       */
/* ------------------------------------------------------------------ */

/**
 * 重复 id 列表（正常情况下应为空数组，用于开发期自检）。
 *
 * 跨品类也必须唯一：手机与平板若撞 id，`DEVICE_MAP` 会静默互相覆盖，
 * 用户从 URL 带 4 个 id 进来时会取到错误的设备。
 */
export const DUPLICATE_IDS: string[] = (() => {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const device of ALL_DEVICES) {
    if (seen.has(device.id)) dup.add(device.id);
    seen.add(device.id);
  }
  return Array.from(dup);
})();

if (DUPLICATE_IDS.length > 0 && typeof console !== 'undefined') {
  // 仅在开发阶段提示，不影响生产构建
  console.warn('[data] 检测到重复设备 id：', DUPLICATE_IDS.join(', '));
}

/* ------------------------------------------------------------------ */
/* 派生数据：品类索引 / 品牌 / SOC 厂商 / 年份 / 边界                    */
/* ------------------------------------------------------------------ */

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

/** 某一品类的全部设备 */
export const DEVICES_BY_CATEGORY: Record<DeviceCategory, Device[]> = (() => {
  const map = {} as Record<DeviceCategory, Device[]>;
  for (const category of CATEGORIES) map[category.id] = [];
  for (const device of ALL_DEVICES) {
    if (!map[device.category]) map[device.category] = [];
    map[device.category].push(device);
  }
  return map;
})();

/** 各品类设备数量 */
export const CATEGORY_COUNTS: Record<DeviceCategory, number> = (() => {
  const counts = {} as Record<DeviceCategory, number>;
  for (const category of CATEGORIES) counts[category.id] = DEVICES_BY_CATEGORY[category.id].length;
  return counts;
})();

/** 全部品牌（按机型数量降序，保证筛选器里主流品牌在前） */
export const BRANDS: string[] = (() => {
  const counter = new Map<string, number>();
  for (const phone of ALL_PHONES) {
    counter.set(phone.brand, (counter.get(phone.brand) ?? 0) + 1);
  }
  return Array.from(counter.entries())
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0], 'zh-CN'))
    .map(([brand]) => brand);
})();

/** 各品牌机型数量 */
export const BRAND_COUNTS: Record<string, number> = (() => {
  const counter: Record<string, number> = {};
  for (const phone of ALL_PHONES) {
    counter[phone.brand] = (counter[phone.brand] ?? 0) + 1;
  }
  return counter;
})();

/** 处理器厂商列表 */
export const SOC_BRANDS: string[] = uniqueSorted(
  ALL_PHONES.map((phone) => phone.performance?.socBrand ?? ''),
);

/** 全部处理器型号（去重排序） */
export const SOC_LIST: string[] = uniqueSorted(
  ALL_PHONES.map((phone) => phone.performance?.soc ?? ''),
);

/** 发布年份列表（倒序，形如 "2025"） */
export const YEARS: string[] = (() => {
  const years = new Set<string>();
  for (const phone of ALL_PHONES) {
    const year = (phone.releaseDate ?? '').slice(0, 4);
    if (/^\d{4}$/.test(year)) years.add(year);
  }
  return Array.from(years).sort((a, b) => Number(b) - Number(a));
})();

/** 全部标签（去重） */
export const ALL_TAGS: string[] = uniqueSorted(ALL_PHONES.flatMap((phone) => phone.tags ?? []));

/**
 * 价格区间（用于价格滑块边界）。
 *
 * 必须与 `effectivePriceOf`（筛选/排序用的口径）保持一致：都取「国补后到手价优先、
 * 回落参考现价 / 首发价」。否则补贴后低于下界的机型会被价格滑块误筛掉。
 */
export const PRICE_BOUNDS: [number, number] = (() => {
  const prices = ALL_PHONES.map((phone) => effectivePriceOf(phone)).filter(
    (price): price is number => typeof price === 'number' && price > 0,
  );
  if (prices.length === 0) return [0, 10000];
  const min = Math.floor(Math.min(...prices) / 100) * 100;
  const max = Math.ceil(Math.max(...prices) / 100) * 100;
  return [min, max];
})();

/** 屏幕尺寸区间（英寸） */
export const SCREEN_SIZE_BOUNDS: [number, number] = (() => {
  const sizes = ALL_PHONES.map((phone) => phone.screen?.size ?? null).filter(
    (size): size is number => typeof size === 'number' && size > 0,
  );
  if (sizes.length === 0) return [4, 8];
  return [Math.floor(Math.min(...sizes)), Math.ceil(Math.max(...sizes))];
})();

/** 电池容量区间（mAh） */
export const BATTERY_BOUNDS: [number, number] = (() => {
  const caps = ALL_PHONES.map((phone) => phone.battery?.capacity ?? null).filter(
    (cap): cap is number => typeof cap === 'number' && cap > 0,
  );
  if (caps.length === 0) return [2000, 8000];
  return [
    Math.floor(Math.min(...caps) / 100) * 100,
    Math.ceil(Math.max(...caps) / 100) * 100,
  ];
})();

/* ------------------------------------------------------------------ */
/* 分品类派生索引（T02 起由筛选器按当前品类取用）                        */
/* ------------------------------------------------------------------ */

/** 一个品类的三条滑块边界 */
export interface CategoryBounds {
  /** 价格区间（元） */
  price: [number, number];
  /** 屏幕尺寸区间（英寸） */
  screenSize: [number, number];
  /** 电池容量区间（mAh） */
  battery: [number, number];
}

/**
 * 各品类的兜底边界（该品类暂无数据时使用）。
 *
 * 注意：笔记本电池行业惯例用 Wh，`battery.capacity`（mAh）恒为 null，
 * 因此这里的 laptop 电池区间只是占位；接入笔记本数据时滑块应改用 `batteryWh` 口径。
 */
const FALLBACK_BOUNDS: Record<DeviceCategory, CategoryBounds> = {
  phone: { price: [0, 10000], screenSize: [4, 8], battery: [2000, 8000] },
  tablet: { price: [0, 10000], screenSize: [8, 14], battery: [5000, 12000] },
  laptop: { price: [0, 20000], screenSize: [13, 18], battery: [0, 200] },
};

function boundsOf(devices: Device[], fallback: CategoryBounds): CategoryBounds {
  const prices = devices
    .map((device) => effectivePriceOf(device))
    .filter((price): price is number => typeof price === 'number' && price > 0);
  const sizes = devices
    .map((device) => device.screen?.size ?? null)
    .filter((size): size is number => typeof size === 'number' && size > 0);
  const caps = devices
    .map((device) => device.battery?.capacity ?? null)
    .filter((cap): cap is number => typeof cap === 'number' && cap > 0);

  return {
    price:
      prices.length === 0
        ? fallback.price
        : [
            Math.floor(Math.min(...prices) / 100) * 100,
            Math.ceil(Math.max(...prices) / 100) * 100,
          ],
    screenSize:
      sizes.length === 0
        ? fallback.screenSize
        : [Math.floor(Math.min(...sizes)), Math.ceil(Math.max(...sizes))],
    battery:
      caps.length === 0
        ? fallback.battery
        : [
            Math.floor(Math.min(...caps) / 100) * 100,
            Math.ceil(Math.max(...caps) / 100) * 100,
          ],
  };
}

/** 分品类的滑块边界 */
export const BOUNDS_BY_CATEGORY: Record<DeviceCategory, CategoryBounds> = (() => {
  const map = {} as Record<DeviceCategory, CategoryBounds>;
  for (const category of CATEGORIES) {
    map[category.id] = boundsOf(DEVICES_BY_CATEGORY[category.id], FALLBACK_BOUNDS[category.id]);
  }
  return map;
})();

/** 分品类的品牌列表（按机型数量降序） */
export const BRANDS_BY_CATEGORY: Record<DeviceCategory, string[]> = (() => {
  const map = {} as Record<DeviceCategory, string[]>;
  for (const category of CATEGORIES) {
    const counter = new Map<string, number>();
    for (const device of DEVICES_BY_CATEGORY[category.id]) {
      counter.set(device.brand, (counter.get(device.brand) ?? 0) + 1);
    }
    map[category.id] = Array.from(counter.entries())
      .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0], 'zh-CN'))
      .map(([brand]) => brand);
  }
  return map;
})();

/** 分品类的发布年份（倒序） */
export const YEARS_BY_CATEGORY: Record<DeviceCategory, string[]> = (() => {
  const map = {} as Record<DeviceCategory, string[]>;
  for (const category of CATEGORIES) {
    const years = new Set<string>();
    for (const device of DEVICES_BY_CATEGORY[category.id]) {
      const year = (device.releaseDate ?? '').slice(0, 4);
      if (/^\d{4}$/.test(year)) years.add(year);
    }
    map[category.id] = Array.from(years).sort((a, b) => Number(b) - Number(a));
  }
  return map;
})();

/** 分品类的处理器厂商列表 */
export const SOC_BRANDS_BY_CATEGORY: Record<DeviceCategory, string[]> = (() => {
  const map = {} as Record<DeviceCategory, string[]>;
  for (const category of CATEGORIES) {
    map[category.id] = uniqueSorted(
      DEVICES_BY_CATEGORY[category.id].map((device) => device.performance?.socBrand ?? ''),
    );
  }
  return map;
})();

/**
 * 分品类**实际出现过**的形态（按机型数量降序）。
 *
 * 形态枚举还在增殖（横折叠 → 阔折叠 → 三折叠 → 中折叠），筛选 chips 必须从这里派生，
 * **不要硬编码形态列表**——否则每加一种形态就要改一次 UI，还会出现点了没结果的空 chip。
 */
export const FORM_FACTORS_BY_CATEGORY: Record<DeviceCategory, FormFactor[]> = (() => {
  const map = {} as Record<DeviceCategory, FormFactor[]>;
  for (const category of CATEGORIES) {
    const counter = new Map<FormFactor, number>();
    for (const device of DEVICES_BY_CATEGORY[category.id]) {
      counter.set(device.formFactor, (counter.get(device.formFactor) ?? 0) + 1);
    }
    map[category.id] = Array.from(counter.entries())
      .sort((a, b) => (b[1] - a[1]) || formFactorLabel(a[0]).localeCompare(formFactorLabel(b[0]), 'zh-CN'))
      .map(([formFactor]) => formFactor);
  }
  return map;
})();

/** 分品类各形态的机型数量（`FORM_FACTORS_BY_CATEGORY` 的计数版本，供 chip 显示「阔折叠 (2)」） */
export const FORM_FACTOR_COUNTS_BY_CATEGORY: Record<DeviceCategory, Record<string, number>> =
  (() => {
    const map = {} as Record<DeviceCategory, Record<string, number>>;
    for (const category of CATEGORIES) {
      const counter: Record<string, number> = {};
      for (const device of DEVICES_BY_CATEGORY[category.id]) {
        counter[device.formFactor] = (counter[device.formFactor] ?? 0) + 1;
      }
      map[category.id] = counter;
    }
    return map;
  })();

/* ------------------------------------------------------------------ */
/* id 索引                                                             */
/* ------------------------------------------------------------------ */

/** id -> Device 的索引（跨品类），供对比页按 URL 参数查表 */
export const DEVICE_MAP: Record<string, Device> = ALL_DEVICES.reduce(
  (acc: Record<string, Device>, device: Device) => {
    acc[device.id] = device;
    return acc;
  },
  {} as Record<string, Device>,
);

/** 分品类的 id 索引：`DEVICE_MAP_BY_CATEGORY['phone'][id]` */
export const DEVICE_MAP_BY_CATEGORY: Record<DeviceCategory, Record<string, Device>> = (() => {
  const map = {} as Record<DeviceCategory, Record<string, Device>>;
  for (const category of CATEGORIES) {
    map[category.id] = DEVICES_BY_CATEGORY[category.id].reduce(
      (acc: Record<string, Device>, device: Device) => {
        acc[device.id] = device;
        return acc;
      },
      {} as Record<string, Device>,
    );
  }
  return map;
})();

/** id -> Phone 的索引（旧别名，等价于 `DEVICE_MAP`） */
export const PHONE_MAP: Record<string, Phone> = DEVICE_MAP;

/** 按 id 列表取机型（自动过滤不存在的 id，并保持传入顺序） */
export function getPhonesByIds(ids: string[]): Phone[] {
  return ids.map((id) => DEVICE_MAP[id]).filter((device): device is Device => Boolean(device));
}

/** 按 id 列表取设备（跨品类） */
export function getDevicesByIds(ids: string[]): Device[] {
  return ids.map((id) => DEVICE_MAP[id]).filter((device): device is Device => Boolean(device));
}

export { effectivePriceOf } from '../utils/effectivePrice';
export { PRICES, PRICE_COUNT, getPriceRecord, dealOfPhone } from './prices';
export { SPEC_GROUPS, SPEC_GROUP_MAP, computeRowDiff, shouldRenderRow } from './specGroups';
export type { RowDiffResult } from './specGroups';
export { LAPTOP_SPEC_GROUPS } from './laptopSpecGroups';
export type {
  Phone,
  Device,
  DeviceCategory,
  FormFactor,
  PriceRecord,
  SpecGroup,
  SpecRow,
  SpecValue,
  FilterState,
  SortKey,
} from '../types/phone';
