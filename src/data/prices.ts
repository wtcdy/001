import { computeDeal } from '../utils/price';
import type { DealResult } from '../utils/price';
import type { Phone, PriceRecord } from '../types/phone';

/**
 * 渠道价格数据（与参数数据解耦，可独立更新）。
 *
 * 数据来源与口径：
 *  - `jd`  ：京东自营参考价（元）
 *  - `pdd` ：拼多多百亿补贴参考价（元）
 *  - `updatedAt`：该条报价的采集日期
 *  - `isReference`：true 表示内置兜底参考价（由「参考现价 + 渠道折扣模型」推导），
 *                    非平台实时抓取值；通过 `npm run import:prices` 导入真实数据后可置为 false。
 *
 * 覆盖范围说明：
 *  - 只收录近 2-3 年仍在售的热门机型（共 235 款），其余机型不出现在表中，前端显示「暂无报价」；
 *  - 已下架 / 停产的老机型不臆造价格；
 *  - 价格均为整数（元），请以平台页面实际结算价为准。
 *
 * 更新方式：
 *   npm run import:prices -- --input prices.csv            # 输出 prices-imported.ts
 *   npm run import:prices -- --input prices.csv --overwrite # 直接覆盖本文件
 */

/** 机型 id -> 渠道报价 */
export const PRICES: Record<string, PriceRecord> = {
  /* ---------- Apple ---------- */
  'iphone-17-pro-max': { jd: 9999, pdd: 9299, updatedAt: '2026-10-13', isReference: true },
  'iphone-17-pro': { jd: 8999, pdd: 8369, updatedAt: '2026-10-13', isReference: true },
  'iphone-17': { jd: 7999, pdd: 7439, updatedAt: '2026-10-13', isReference: true },
  'iphone-air': { jd: 7999, pdd: 7439, updatedAt: '2026-10-13', isReference: true },
  'iphone-16e': { jd: 4999, pdd: 4599, updatedAt: '2026-10-13', isReference: true },
  'iphone-16-pro-max': { jd: 7999, pdd: 7439, updatedAt: '2026-10-13', isReference: true },
  'iphone-16-pro': { jd: 6999, pdd: 6509, updatedAt: '2026-10-13', isReference: true },
  'iphone-16': { jd: 5999, pdd: 5519, updatedAt: '2026-10-13', isReference: true },
  'iphone-16-plus': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'iphone-15-pro-max': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'iphone-15-pro': { jd: 5499, pdd: 5059, updatedAt: '2026-10-13', isReference: true },
  'iphone-15': { jd: 4699, pdd: 4319, updatedAt: '2026-10-13', isReference: true },
  'iphone-15-plus': { jd: 5299, pdd: 4869, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 华为 ---------- */
  'huawei-mate-70-pro-plus': { jd: 7499, pdd: 6969, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-70-pro': { jd: 6099, pdd: 5669, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-70': { jd: 4899, pdd: 4499, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-70-rs': { jd: 10999, pdd: 10229, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-xt': { jd: 17999, pdd: 16739, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-x6': { jd: 11999, pdd: 11159, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-x5': { jd: 8999, pdd: 8369, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-x3': { jd: 6999, pdd: 6509, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-80-ultra': { jd: 9499, pdd: 8829, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-80-pro': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-80': { jd: 4999, pdd: 4599, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-70-ultra': { jd: 6999, pdd: 6509, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-70-pro-plus': { jd: 5799, pdd: 5329, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-70-pro': { jd: 4799, pdd: 4409, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-70': { jd: 4199, pdd: 3859, updatedAt: '2026-10-13', isReference: true },
  'huawei-p60-pro': { jd: 3999, pdd: 3639, updatedAt: '2026-10-13', isReference: true },
  'huawei-p60-art': { jd: 4599, pdd: 4229, updatedAt: '2026-10-13', isReference: true },
  'huawei-pocket-2': { jd: 5299, pdd: 4869, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-60-pro': { jd: 4999, pdd: 4599, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-60-pro-plus': { jd: 6299, pdd: 5849, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-60': { jd: 4199, pdd: 3859, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-60-rs': { jd: 8999, pdd: 8369, updatedAt: '2026-10-13', isReference: true },
  'huawei-nova-13-pro': { jd: 2999, pdd: 2729, updatedAt: '2026-10-13', isReference: true },
  'huawei-nova-13': { jd: 2199, pdd: 1999, updatedAt: '2026-10-13', isReference: true },
  'huawei-enjoy-70': { jd: 899, pdd: 849, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 荣耀 ---------- */
  'honor-magic7-pro': { jd: 4699, pdd: 4319, updatedAt: '2026-10-13', isReference: true },
  'honor-magic7': { jd: 3699, pdd: 3359, updatedAt: '2026-10-13', isReference: true },
  'honor-magic7-rsr': { jd: 6999, pdd: 6509, updatedAt: '2026-10-13', isReference: true },
  'honor-magic6-pro': { jd: 3599, pdd: 3269, updatedAt: '2026-10-13', isReference: true },
  'honor-magic6': { jd: 2899, pdd: 2629, updatedAt: '2026-10-13', isReference: true },
  'honor-magic6-rsr': { jd: 5799, pdd: 5329, updatedAt: '2026-10-13', isReference: true },
  'honor-magic-v3': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'honor-magic-v2': { jd: 4999, pdd: 4599, updatedAt: '2026-10-13', isReference: true },
  'honor-magic-vs3': { jd: 4799, pdd: 4409, updatedAt: '2026-10-13', isReference: true },
  'honor-magic-vflip': { jd: 3999, pdd: 3639, updatedAt: '2026-10-13', isReference: true },
  'honor-400-pro': { jd: 3299, pdd: 2999, updatedAt: '2026-10-13', isReference: true },
  'honor-400': { jd: 2399, pdd: 2179, updatedAt: '2026-10-13', isReference: true },
  'honor-300-pro': { jd: 2599, pdd: 2359, updatedAt: '2026-10-13', isReference: true },
  'honor-300': { jd: 1899, pdd: 1759, updatedAt: '2026-10-13', isReference: true },
  'honor-200-pro': { jd: 2299, pdd: 2089, updatedAt: '2026-10-13', isReference: true },
  'honor-200': { jd: 1799, pdd: 1669, updatedAt: '2026-10-13', isReference: true },
  'honor-gt-pro': { jd: 3199, pdd: 2909, updatedAt: '2026-10-13', isReference: true },
  'honor-gt': { jd: 1599, pdd: 1479, updatedAt: '2026-10-13', isReference: true },
  'honor-x60-pro': { jd: 1099, pdd: 1019, updatedAt: '2026-10-13', isReference: true },
  'honor-x60': { jd: 899, pdd: 849, updatedAt: '2026-10-13', isReference: true },
  'honor-power': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  'honor-magic6-ultimate': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 小米 ---------- */
  'xiaomi-15-ultra': { jd: 5999, pdd: 5519, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-15-pro': { jd: 4199, pdd: 3859, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-15': { jd: 3499, pdd: 3179, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-14-ultra': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-mix-fold-4': { jd: 5999, pdd: 5519, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-mix-fold-3': { jd: 4599, pdd: 4229, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-mix-flip-2': { jd: 5499, pdd: 5059, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-mix-flip': { jd: 3999, pdd: 3639, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-civi-5-pro': { jd: 2699, pdd: 2449, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-civi-4-pro': { jd: 2099, pdd: 1909, updatedAt: '2026-10-13', isReference: true },
  /* ---------- Redmi ---------- */
  'redmi-k80-pro': { jd: 2999, pdd: 2729, updatedAt: '2026-10-13', isReference: true },
  'redmi-k80': { jd: 2099, pdd: 1909, updatedAt: '2026-10-13', isReference: true },
  'redmi-k80-ultra': { jd: 2399, pdd: 2179, updatedAt: '2026-10-13', isReference: true },
  'redmi-turbo-4-pro': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  'redmi-turbo-4': { jd: 1499, pdd: 1389, updatedAt: '2026-10-13', isReference: true },
  'redmi-turbo-3': { jd: 1299, pdd: 1199, updatedAt: '2026-10-13', isReference: true },
  'redmi-note-14-pro-plus': { jd: 1599, pdd: 1479, updatedAt: '2026-10-13', isReference: true },
  'redmi-note-14-pro': { jd: 1199, pdd: 1109, updatedAt: '2026-10-13', isReference: true },
  'redmi-note-14': { jd: 899, pdd: 849, updatedAt: '2026-10-13', isReference: true },
  'redmi-14c': { jd: 699, pdd: 659, updatedAt: '2026-10-13', isReference: true },
  'redmi-a3-pro': { jd: 549, pdd: 519, updatedAt: '2026-10-13', isReference: true },
  'redmi-note-15-pro-plus': { jd: 1899, pdd: 1759, updatedAt: '2026-10-13', isReference: true },
  /* ---------- OPPO ---------- */
  'oppo-find-x8-ultra': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x8-pro': { jd: 4999, pdd: 4599, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x8': { jd: 3399, pdd: 3089, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x8s': { jd: 3699, pdd: 3359, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x7-ultra': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x7': { jd: 2699, pdd: 2449, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-n5': { jd: 9999, pdd: 9299, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-n3': { jd: 5999, pdd: 5519, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-n3-flip': { jd: 3699, pdd: 3359, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno14-pro': { jd: 3399, pdd: 3089, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno14': { jd: 2499, pdd: 2269, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno13-pro': { jd: 2899, pdd: 2629, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno13': { jd: 2199, pdd: 1999, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno12-pro': { jd: 2299, pdd: 2089, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno12': { jd: 1799, pdd: 1669, updatedAt: '2026-10-13', isReference: true },
  'oppo-k13-turbo-pro': { jd: 1999, pdd: 1859, updatedAt: '2026-10-13', isReference: true },
  'oppo-k12-plus': { jd: 1399, pdd: 1299, updatedAt: '2026-10-13', isReference: true },
  'oppo-k12': { jd: 1199, pdd: 1109, updatedAt: '2026-10-13', isReference: true },
  'oppo-a5-pro': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  'oppo-a3-pro': { jd: 1299, pdd: 1199, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 一加 ---------- */
  'oneplus-13': { jd: 3699, pdd: 3359, updatedAt: '2026-10-13', isReference: true },
  'oneplus-13t': { jd: 3099, pdd: 2819, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-5-pro': { jd: 2799, pdd: 2539, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-5': { jd: 1899, pdd: 1759, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-5-ultra': { jd: 2299, pdd: 2089, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-3-pro': { jd: 2199, pdd: 1999, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-3': { jd: 1799, pdd: 1669, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-3v': { jd: 1399, pdd: 1299, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-3-pro-gundam': { jd: 2599, pdd: 2359, updatedAt: '2026-10-13', isReference: true },
  /* ---------- realme ---------- */
  'realme-gt7-pro': { jd: 2899, pdd: 2629, updatedAt: '2026-10-13', isReference: true },
  'realme-gt7': { jd: 2299, pdd: 2089, updatedAt: '2026-10-13', isReference: true },
  'realme-gt6': { jd: 1999, pdd: 1859, updatedAt: '2026-10-13', isReference: true },
  'realme-gt-neo6': { jd: 1499, pdd: 1389, updatedAt: '2026-10-13', isReference: true },
  'realme-gt-neo6-se': { jd: 1199, pdd: 1109, updatedAt: '2026-10-13', isReference: true },
  'realme-14-pro-plus': { jd: 2199, pdd: 1999, updatedAt: '2026-10-13', isReference: true },
  'realme-14-pro': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  'realme-13-pro-plus': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  'realme-13-pro': { jd: 1399, pdd: 1299, updatedAt: '2026-10-13', isReference: true },
  'realme-12-pro-plus': { jd: 1499, pdd: 1389, updatedAt: '2026-10-13', isReference: true },
  'realme-12-pro': { jd: 1199, pdd: 1109, updatedAt: '2026-10-13', isReference: true },
  'realme-v60-pro': { jd: 1199, pdd: 1109, updatedAt: '2026-10-13', isReference: true },
  'realme-gt7-pro-racing': { jd: 2699, pdd: 2449, updatedAt: '2026-10-13', isReference: true },
  'realme-neo7': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  'realme-gt7-dream': { jd: 2999, pdd: 2729, updatedAt: '2026-10-13', isReference: true },
  'realme-15-pro': { jd: 2099, pdd: 1909, updatedAt: '2026-10-13', isReference: true },
  'realme-v70': { jd: 999, pdd: 949, updatedAt: '2026-10-13', isReference: true },
  'realme-14x': { jd: 899, pdd: 849, updatedAt: '2026-10-13', isReference: true },
  'realme-12x': { jd: 799, pdd: 759, updatedAt: '2026-10-13', isReference: true },
  /* ---------- vivo ---------- */
  'vivo-x200-ultra': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200-pro': { jd: 4999, pdd: 4599, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200-pro-mini': { jd: 3899, pdd: 3539, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200': { jd: 3499, pdd: 3179, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200s': { jd: 3899, pdd: 3539, updatedAt: '2026-10-13', isReference: true },
  'vivo-x100-ultra': { jd: 4499, pdd: 4139, updatedAt: '2026-10-13', isReference: true },
  'vivo-x100-pro': { jd: 3599, pdd: 3269, updatedAt: '2026-10-13', isReference: true },
  'vivo-x100s': { jd: 2899, pdd: 2629, updatedAt: '2026-10-13', isReference: true },
  'vivo-x-fold5': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'vivo-x-fold3-pro': { jd: 5999, pdd: 5519, updatedAt: '2026-10-13', isReference: true },
  'vivo-x-fold3': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  'vivo-x-fold2': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  'vivo-s30-pro-mini': { jd: 2999, pdd: 2729, updatedAt: '2026-10-13', isReference: true },
  'vivo-s30': { jd: 2299, pdd: 2089, updatedAt: '2026-10-13', isReference: true },
  'vivo-s20-pro': { jd: 2399, pdd: 2179, updatedAt: '2026-10-13', isReference: true },
  'vivo-s20': { jd: 1899, pdd: 1759, updatedAt: '2026-10-13', isReference: true },
  'vivo-s19-pro': { jd: 2199, pdd: 1999, updatedAt: '2026-10-13', isReference: true },
  'vivo-s19': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  'vivo-y300-pro': { jd: 1399, pdd: 1299, updatedAt: '2026-10-13', isReference: true },
  'vivo-y200': { jd: 1099, pdd: 1019, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200-fe': { jd: 3999, pdd: 3639, updatedAt: '2026-10-13', isReference: true },
  /* ---------- iQOO ---------- */
  'iqoo-13': { jd: 3299, pdd: 2999, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo10-pro': { jd: 2799, pdd: 2539, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo10': { jd: 2099, pdd: 1909, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo9-pro': { jd: 1999, pdd: 1859, updatedAt: '2026-10-13', isReference: true },
  'iqoo-z10-turbo-pro': { jd: 1799, pdd: 1669, updatedAt: '2026-10-13', isReference: true },
  'iqoo-z10-turbo': { jd: 1499, pdd: 1389, updatedAt: '2026-10-13', isReference: true },
  'iqoo-z9-turbo': { jd: 1499, pdd: 1389, updatedAt: '2026-10-13', isReference: true },
  'iqoo-z9': { jd: 1099, pdd: 1019, updatedAt: '2026-10-13', isReference: true },
  // id 跟随 src/data/phones/iqoo.ts 的修正（原 `iqoo-pad5-pro` 是手机，与平板撞键）
  'iqoo-13-legend': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo9s-pro': { jd: 2199, pdd: 1999, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo9s-pro-plus': { jd: 2499, pdd: 2269, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 三星 ---------- */
  'samsung-galaxy-s25-ultra': { jd: 8299, pdd: 7709, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s25-plus': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s25': { jd: 5299, pdd: 4869, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s25-edge': { jd: 6699, pdd: 6229, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s24-ultra': { jd: 5999, pdd: 5519, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s24-plus': { jd: 4499, pdd: 4139, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s24': { jd: 3699, pdd: 3359, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s23-ultra': { jd: 4499, pdd: 4139, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-z-fold6': { jd: 8999, pdd: 8369, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-z-fold5': { jd: 6299, pdd: 5849, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-z-flip6': { jd: 5399, pdd: 4959, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-z-flip5': { jd: 3599, pdd: 3269, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-a56': { jd: 2699, pdd: 2449, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-a55': { jd: 1999, pdd: 1859, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-a35': { jd: 1599, pdd: 1479, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-a15': { jd: 1099, pdd: 1019, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-m55': { jd: 1499, pdd: 1389, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s24-fe': { jd: 3399, pdd: 3089, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 魅族 ---------- */
  'meizu-22': { jd: 2799, pdd: 2539, updatedAt: '2026-10-13', isReference: true },
  'meizu-21-pro': { jd: 3299, pdd: 2999, updatedAt: '2026-10-13', isReference: true },
  'meizu-21-note': { jd: 1899, pdd: 1759, updatedAt: '2026-10-13', isReference: true },
  'meizu-note-16-pro': { jd: 1599, pdd: 1479, updatedAt: '2026-10-13', isReference: true },
  'meizu-note-16': { jd: 1099, pdd: 1019, updatedAt: '2026-10-13', isReference: true },
  'meizu-lucky-08': { jd: 1199, pdd: 1109, updatedAt: '2026-10-13', isReference: true },
  'meizu-mblu-22-pro': { jd: 899, pdd: 849, updatedAt: '2026-10-13', isReference: true },
  'meizu-mblu-22': { jd: 699, pdd: 659, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 努比亚 ---------- */
  'nubia-redmagic-10-pro': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  'nubia-redmagic-10-ultra': { jd: 5499, pdd: 5059, updatedAt: '2026-10-13', isReference: true },
  'nubia-redmagic-9s-pro': { jd: 3599, pdd: 3269, updatedAt: '2026-10-13', isReference: true },
  'nubia-z70-ultra': { jd: 3999, pdd: 3639, updatedAt: '2026-10-13', isReference: true },
  'nubia-z60s-pro': { jd: 2499, pdd: 2269, updatedAt: '2026-10-13', isReference: true },
  'nubia-flip-5g': { jd: 2699, pdd: 2449, updatedAt: '2026-10-13', isReference: true },
  'nubia-flip-2': { jd: 2999, pdd: 2729, updatedAt: '2026-10-13', isReference: true },
  'nubia-music-2': { jd: 899, pdd: 849, updatedAt: '2026-10-13', isReference: true },
  'nubia-music': { jd: 699, pdd: 659, updatedAt: '2026-10-13', isReference: true },
  'nubia-z70s-ultra': { jd: 4599, pdd: 4229, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 摩托罗拉 ---------- */
  'motorola-moto-x50-ultra': { jd: 2999, pdd: 2729, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-60-pro': { jd: 2699, pdd: 2449, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-50-pro': { jd: 2299, pdd: 2089, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-50': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  'motorola-razr-60-ultra': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'motorola-razr-50-ultra': { jd: 4499, pdd: 4139, updatedAt: '2026-10-13', isReference: true },
  'motorola-razr-50': { jd: 2699, pdd: 2449, updatedAt: '2026-10-13', isReference: true },
  'motorola-moto-s50': { jd: 1899, pdd: 1759, updatedAt: '2026-10-13', isReference: true },
  'motorola-moto-g75': { jd: 1399, pdd: 1299, updatedAt: '2026-10-13', isReference: true },
  'motorola-moto-g85': { jd: 1199, pdd: 1109, updatedAt: '2026-10-13', isReference: true },
  'motorola-moto-g34': { jd: 699, pdd: 659, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-50-ultra': { jd: 3499, pdd: 3179, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-60': { jd: 1799, pdd: 1669, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 索尼 ---------- */
  'sony-xperia-1-vii': { jd: 8499, pdd: 7899, updatedAt: '2026-10-13', isReference: true },
  'sony-xperia-1-vi': { jd: 5999, pdd: 5519, updatedAt: '2026-10-13', isReference: true },
  'sony-xperia-1-v': { jd: 4499, pdd: 4139, updatedAt: '2026-10-13', isReference: true },
  'sony-xperia-5-v': { jd: 3699, pdd: 3359, updatedAt: '2026-10-13', isReference: true },
  'sony-xperia-10-vi': { jd: 2499, pdd: 2269, updatedAt: '2026-10-13', isReference: true },
  /* ---------- Google ---------- */
  'google-pixel-10-pro-xl': { jd: 9099, pdd: 8459, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-10-pro': { jd: 7699, pdd: 7159, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-10': { jd: 5999, pdd: 5519, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-9-pro-xl': { jd: 6499, pdd: 6039, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-9-pro': { jd: 5299, pdd: 4869, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-9': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  /* ---------- Nothing ---------- */
  'nothing-phone-3a-pro': { jd: 2799, pdd: 2539, updatedAt: '2026-10-13', isReference: true },
  'nothing-phone-3a': { jd: 2099, pdd: 1909, updatedAt: '2026-10-13', isReference: true },
  'nothing-phone-2a': { jd: 1499, pdd: 1389, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 中兴 ---------- */
  'zte-axon-50': { jd: 1299, pdd: 1199, updatedAt: '2026-10-13', isReference: true },
  'zte-nubia-z60-ultra-lead': { jd: 3499, pdd: 3179, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 华硕 ---------- */
  'asus-rog-phone-9-pro': { jd: 6299, pdd: 5849, updatedAt: '2026-10-13', isReference: true },
  'asus-rog-phone-8-pro': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  'asus-rog-phone-7-ultimate': { jd: 3699, pdd: 3359, updatedAt: '2026-10-13', isReference: true },
  'asus-zenfone-11-ultra': { jd: 3499, pdd: 3179, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 其他 ---------- */
  'tecno-phantom-v-fold': { jd: 4299, pdd: 3949, updatedAt: '2026-10-13', isReference: true },
  'tecno-camon-30-pro': { jd: 1699, pdd: 1579, updatedAt: '2026-10-13', isReference: true },
  '8848-titanium-m6': { jd: 8999, pdd: 8369, updatedAt: '2026-10-13', isReference: true },
  'sharp-aquos-r9-pro': { jd: 4999, pdd: 4599, updatedAt: '2026-10-13', isReference: true },
};

/** 已收录报价的机型数量 */
export const PRICE_COUNT: number = Object.keys(PRICES).length;

/** 取某一机型的渠道报价（未收录返回 undefined） */
export function getPriceRecord(phoneId: string | undefined): PriceRecord | undefined {
  if (!phoneId) return undefined;
  return PRICES[phoneId];
}

/** 取某一机型的「成交价计算结果」（含国补），未收录报价时返回 hasPrice: false */
export function dealOfPhone(phone: Phone): DealResult {
  return computeDeal(getPriceRecord(phone.id));
}

/**
 * 注意：本文件会被 `npm run import:prices` 整文件重新生成，
 * 因此**不要**在这里新增导出（口径函数请放 `src/utils/effectivePrice.ts`），
 * 否则脚本模板未同步时会直接编译失败。见 `src/utils/price.ts` 与 `src/utils/effectivePrice.ts`。
 */

export type { PriceRecord };
