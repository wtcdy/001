import { computeDeal } from '../utils/price';
import type { DealResult, PriceRecordWithSpec } from '../utils/price';
import type { Phone } from '../types/phone';

/**
 * 渠道价格数据（与参数数据解耦，可独立更新）。
 *
 * 数据来源与口径：
 *  - `spec`：该报价对应的配置，形如 '12+256'（**最低配组合** = min(ram)+min(rom)）。
 *            同一机型不同配置价差可达数千元，价格必须带配置才有意义。
 *            由 `node scripts/fill-price-spec.mjs` 从机型参数数据推导回填，新增机型后重跑即可。
 *  - `jd`  ：京东自营参考价（元）；当前唯一渠道（拼多多已下线）
 *  - `updatedAt`：该条报价的采集日期
 *  - `isReference`：true 表示内置兜底参考价（由「参考现价 + 渠道折扣模型」推导），
 *                    非平台实时抓取值；通过 `npm run import:prices` 导入真实数据后可置为 false。
 *
 * 覆盖范围说明：
 *  - 只收录近 2-3 年仍在售的热门机型（共 225 款），其余机型不出现在表中，前端显示「暂无报价」；
 *  - 已下架 / 停产的老机型不臆造价格；
 *  - 2026-10-14 清理：按「不收录停产机型」口径移除 10 条报价（mate-xt 串机型 + A 档 9 款已停产老机），
 *    这些机型的参数仍在 `src/data/phones/` 中保留，只是不再展示渠道价；
 *  - 价格均为整数（元），请以平台页面实际结算价为准。
 *
 * 更新方式：
 *   npm run import:prices -- --input prices.csv            # 输出 prices-imported.ts
 *   npm run import:prices -- --input prices.csv --overwrite # 直接覆盖本文件
 */

/** 机型 id -> 渠道报价 */
export const PRICES: Record<string, PriceRecordWithSpec> = {
  /* ---------- Apple ---------- */
  'iphone-17-pro-max': { spec: '12+256', jd: 9999, updatedAt: '2026-10-13', isReference: true },
  'iphone-17-pro': { spec: '12+256', jd: 8999, updatedAt: '2026-10-13', isReference: true },
  // 2026-10-14 核：256GB 首发 5999，苹果 10 月官价上调 800 至 6799，但渠道未跟涨 ——
  // 京东自营活动价 5999，叠加国补后约 5499（拼多多百亿补贴同档）。
  'iphone-17': { spec: '8+256', jd: 5999, updatedAt: '2026-10-14', isReference: true },
  // 2026-10-14 核：苹果官网 256GB 已由首发 7999 上调至 8799，但渠道价反而在跌 ——
  // 京东自营活动价 5999（领券/国补后可到 5269），拼多多百亿补贴 5199。
  'iphone-air': { spec: '12+256', jd: 5999, updatedAt: '2026-10-14', isReference: true },
  'iphone-16e': { spec: '8+128', jd: 4999, updatedAt: '2026-10-13', isReference: true },
  'iphone-16-pro-max': { spec: '8+256', jd: 7999, updatedAt: '2026-10-13', isReference: true },
  'iphone-16-pro': { spec: '8+128', jd: 6999, updatedAt: '2026-10-13', isReference: true },
  'iphone-16': { spec: '8+128', jd: 5999, updatedAt: '2026-10-13', isReference: true },
  'iphone-16-plus': { spec: '8+128', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'iphone-15-pro-max': { spec: '8+256', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'iphone-15-pro': { spec: '8+128', jd: 5499, updatedAt: '2026-10-13', isReference: true },
  'iphone-15': { spec: '6+128', jd: 4699, updatedAt: '2026-10-13', isReference: true },
  'iphone-15-plus': { spec: '6+128', jd: 5299, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 华为 ---------- */
  'huawei-mate-70-pro-plus': { spec: '16+512', jd: 7499, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-70-pro': { spec: '12+256', jd: 6099, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-70': { spec: '12+256', jd: 4899, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-70-rs': { spec: '16+512', jd: 10999, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-x6': { spec: '12+256', jd: 11999, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-x5': { spec: '12+256', jd: 6999, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-80-ultra': { spec: '16+512', jd: 9499, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-80-pro': { spec: '12+256', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-80': { spec: '12+256', jd: 4999, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-70-ultra': { spec: '16+512', jd: 6999, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-70-pro-plus': { spec: '16+512', jd: 5799, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-70-pro': { spec: '12+256', jd: 4799, updatedAt: '2026-10-13', isReference: true },
  'huawei-pura-70': { spec: '12+256', jd: 4199, updatedAt: '2026-10-13', isReference: true },
  'huawei-p60-pro': { spec: '8+256', jd: 3999, updatedAt: '2026-10-13', isReference: true },
  'huawei-p60-art': { spec: '12+512', jd: 4599, updatedAt: '2026-10-13', isReference: true },
  'huawei-pocket-2': { spec: '12+256', jd: 5299, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-60-pro': { spec: '12+256', jd: 4999, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-60-pro-plus': { spec: '16+512', jd: 6299, updatedAt: '2026-10-13', isReference: true },
  'huawei-mate-60': { spec: '12+256', jd: 4199, updatedAt: '2026-10-13', isReference: true },
  'huawei-nova-13-pro': { spec: '12+256', jd: 2999, updatedAt: '2026-10-13', isReference: true },
  'huawei-nova-13': { spec: '12+256', jd: 2199, updatedAt: '2026-10-13', isReference: true },
  'huawei-enjoy-70': { spec: '8+128', jd: 899, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 荣耀 ---------- */
  'honor-magic7-pro': { spec: '12+256', jd: 4699, updatedAt: '2026-10-13', isReference: true },
  'honor-magic7': { spec: '12+256', jd: 3699, updatedAt: '2026-10-13', isReference: true },
  'honor-magic7-rsr': { spec: '16+512', jd: 6999, updatedAt: '2026-10-13', isReference: true },
  'honor-magic6-pro': { spec: '12+256', jd: 3599, updatedAt: '2026-10-13', isReference: true },
  'honor-magic6': { spec: '12+256', jd: 2899, updatedAt: '2026-10-13', isReference: true },
  'honor-magic6-rsr': { spec: '24+1024', jd: 5799, updatedAt: '2026-10-13', isReference: true },
  'honor-magic-v3': { spec: '12+256', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'honor-magic-v2': { spec: '16+256', jd: 4999, updatedAt: '2026-10-13', isReference: true },
  'honor-magic-vs3': { spec: '12+256', jd: 4799, updatedAt: '2026-10-13', isReference: true },
  'honor-magic-vflip': { spec: '12+256', jd: 3999, updatedAt: '2026-10-13', isReference: true },
  'honor-400-pro': { spec: '12+256', jd: 3299, updatedAt: '2026-10-13', isReference: true },
  'honor-400': { spec: '8+256', jd: 2399, updatedAt: '2026-10-13', isReference: true },
  'honor-300-pro': { spec: '12+256', jd: 2599, updatedAt: '2026-10-13', isReference: true },
  'honor-300': { spec: '8+256', jd: 1899, updatedAt: '2026-10-13', isReference: true },
  'honor-200-pro': { spec: '12+256', jd: 2299, updatedAt: '2026-10-13', isReference: true },
  'honor-200': { spec: '8+256', jd: 1799, updatedAt: '2026-10-13', isReference: true },
  'honor-gt-pro': { spec: '12+256', jd: 3199, updatedAt: '2026-10-13', isReference: true },
  'honor-gt': { spec: '12+256', jd: 1599, updatedAt: '2026-10-13', isReference: true },
  'honor-x60-pro': { spec: '8+128', jd: 1099, updatedAt: '2026-10-13', isReference: true },
  'honor-x60': { spec: '8+128', jd: 899, updatedAt: '2026-10-13', isReference: true },
  'honor-power': { spec: '8+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'honor-magic6-ultimate': { spec: '16+512', jd: 4299, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 小米 ---------- */
  'xiaomi-15-ultra': { spec: '12+256', jd: 5999, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-15-pro': { spec: '12+256', jd: 4199, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-15': { spec: '12+256', jd: 3499, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-14-ultra': { spec: '12+256', jd: 4299, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-mix-fold-4': { spec: '12+256', jd: 5999, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-mix-fold-3': { spec: '12+256', jd: 4599, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-mix-flip-2': { spec: '12+256', jd: 5499, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-mix-flip': { spec: '12+256', jd: 3999, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-civi-5-pro': { spec: '12+256', jd: 2699, updatedAt: '2026-10-13', isReference: true },
  'xiaomi-civi-4-pro': { spec: '12+256', jd: 2099, updatedAt: '2026-10-13', isReference: true },
  /* ---------- Redmi ---------- */
  'redmi-k80-pro': { spec: '12+256', jd: 2999, updatedAt: '2026-10-13', isReference: true },
  'redmi-k80': { spec: '12+256', jd: 2099, updatedAt: '2026-10-13', isReference: true },
  'redmi-k80-ultra': { spec: '12+256', jd: 2399, updatedAt: '2026-10-13', isReference: true },
  'redmi-turbo-4-pro': { spec: '12+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'redmi-turbo-4': { spec: '12+256', jd: 1499, updatedAt: '2026-10-13', isReference: true },
  'redmi-turbo-3': { spec: '12+256', jd: 1299, updatedAt: '2026-10-13', isReference: true },
  'redmi-note-14-pro-plus': { spec: '8+128', jd: 1599, updatedAt: '2026-10-13', isReference: true },
  'redmi-note-14-pro': { spec: '8+128', jd: 1199, updatedAt: '2026-10-13', isReference: true },
  'redmi-note-14': { spec: '6+128', jd: 899, updatedAt: '2026-10-13', isReference: true },
  'redmi-14c': { spec: '4+128', jd: 699, updatedAt: '2026-10-13', isReference: true },
  'redmi-a3-pro': { spec: '4+128', jd: 549, updatedAt: '2026-10-13', isReference: true },
  'redmi-note-15-pro-plus': { spec: '8+256', jd: 1899, updatedAt: '2026-10-13', isReference: true },
  /* ---------- OPPO ---------- */
  'oppo-find-x8-ultra': { spec: '12+256', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x8-pro': { spec: '12+256', jd: 4999, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x8': { spec: '12+256', jd: 3399, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x8s': { spec: '12+256', jd: 3699, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x7-ultra': { spec: '12+256', jd: 4299, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-x7': { spec: '12+256', jd: 2699, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-n5': { spec: '12+256', jd: 9999, updatedAt: '2026-10-13', isReference: true },
  'oppo-find-n3': { spec: '12+256', jd: 5999, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno14-pro': { spec: '12+256', jd: 3399, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno14': { spec: '12+256', jd: 2499, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno13-pro': { spec: '12+256', jd: 2899, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno13': { spec: '12+256', jd: 2199, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno12-pro': { spec: '12+256', jd: 2299, updatedAt: '2026-10-13', isReference: true },
  'oppo-reno12': { spec: '12+256', jd: 1799, updatedAt: '2026-10-13', isReference: true },
  'oppo-k13-turbo-pro': { spec: '12+256', jd: 1999, updatedAt: '2026-10-13', isReference: true },
  'oppo-k12-plus': { spec: '8+256', jd: 1399, updatedAt: '2026-10-13', isReference: true },
  'oppo-k12': { spec: '8+256', jd: 1199, updatedAt: '2026-10-13', isReference: true },
  'oppo-a5-pro': { spec: '8+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'oppo-a3-pro': { spec: '8+256', jd: 1299, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 一加 ---------- */
  'oneplus-13': { spec: '12+256', jd: 3699, updatedAt: '2026-10-13', isReference: true },
  'oneplus-13t': { spec: '12+256', jd: 3099, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-5-pro': { spec: '12+256', jd: 2799, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-5': { spec: '12+256', jd: 1899, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-5-ultra': { spec: '12+256', jd: 2299, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-3-pro': { spec: '12+256', jd: 2199, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-3': { spec: '12+256', jd: 1799, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-3v': { spec: '12+256', jd: 1399, updatedAt: '2026-10-13', isReference: true },
  'oneplus-ace-3-pro-gundam': { spec: '24+1024', jd: 2599, updatedAt: '2026-10-13', isReference: true },
  /* ---------- realme ---------- */
  'realme-gt7-pro': { spec: '12+256', jd: 2899, updatedAt: '2026-10-13', isReference: true },
  'realme-gt7': { spec: '12+256', jd: 2299, updatedAt: '2026-10-13', isReference: true },
  'realme-gt6': { spec: '12+256', jd: 1999, updatedAt: '2026-10-13', isReference: true },
  'realme-gt-neo6': { spec: '12+256', jd: 1499, updatedAt: '2026-10-13', isReference: true },
  'realme-gt-neo6-se': { spec: '8+256', jd: 1199, updatedAt: '2026-10-13', isReference: true },
  'realme-14-pro-plus': { spec: '8+256', jd: 2199, updatedAt: '2026-10-13', isReference: true },
  'realme-14-pro': { spec: '8+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'realme-13-pro-plus': { spec: '8+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'realme-13-pro': { spec: '8+256', jd: 1399, updatedAt: '2026-10-13', isReference: true },
  'realme-12-pro-plus': { spec: '8+128', jd: 1499, updatedAt: '2026-10-13', isReference: true },
  'realme-12-pro': { spec: '8+128', jd: 1199, updatedAt: '2026-10-13', isReference: true },
  'realme-v60-pro': { spec: '6+128', jd: 1199, updatedAt: '2026-10-13', isReference: true },
  'realme-gt7-pro-racing': { spec: '12+256', jd: 2699, updatedAt: '2026-10-13', isReference: true },
  'realme-neo7': { spec: '12+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'realme-gt7-dream': { spec: '16+512', jd: 2999, updatedAt: '2026-10-13', isReference: true },
  'realme-15-pro': { spec: '8+128', jd: 2099, updatedAt: '2026-10-13', isReference: true },
  'realme-v70': { spec: '6+128', jd: 999, updatedAt: '2026-10-13', isReference: true },
  'realme-14x': { spec: '4+128', jd: 899, updatedAt: '2026-10-13', isReference: true },
  'realme-12x': { spec: '6+128', jd: 799, updatedAt: '2026-10-13', isReference: true },
  /* ---------- vivo ---------- */
  'vivo-x200-ultra': { spec: '12+256', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200-pro': { spec: '12+256', jd: 4999, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200-pro-mini': { spec: '12+256', jd: 3899, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200': { spec: '12+256', jd: 3499, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200s': { spec: '12+256', jd: 3899, updatedAt: '2026-10-13', isReference: true },
  'vivo-x100-ultra': { spec: '12+256', jd: 4499, updatedAt: '2026-10-13', isReference: true },
  'vivo-x100-pro': { spec: '12+256', jd: 3599, updatedAt: '2026-10-13', isReference: true },
  'vivo-x100s': { spec: '12+256', jd: 2899, updatedAt: '2026-10-13', isReference: true },
  'vivo-x-fold5': { spec: '12+256', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'vivo-x-fold3-pro': { spec: '16+512', jd: 5999, updatedAt: '2026-10-13', isReference: true },
  'vivo-x-fold3': { spec: '12+256', jd: 4299, updatedAt: '2026-10-13', isReference: true },
  'vivo-s30-pro-mini': { spec: '12+256', jd: 2999, updatedAt: '2026-10-13', isReference: true },
  'vivo-s30': { spec: '8+256', jd: 2299, updatedAt: '2026-10-13', isReference: true },
  'vivo-s20-pro': { spec: '12+256', jd: 2399, updatedAt: '2026-10-13', isReference: true },
  'vivo-s20': { spec: '8+256', jd: 1899, updatedAt: '2026-10-13', isReference: true },
  'vivo-s19-pro': { spec: '12+256', jd: 2199, updatedAt: '2026-10-13', isReference: true },
  'vivo-s19': { spec: '8+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'vivo-y300-pro': { spec: '8+128', jd: 1399, updatedAt: '2026-10-13', isReference: true },
  'vivo-y200': { spec: '8+128', jd: 1099, updatedAt: '2026-10-13', isReference: true },
  'vivo-x200-fe': { spec: '12+256', jd: 3999, updatedAt: '2026-10-13', isReference: true },
  /* ---------- iQOO ---------- */
  'iqoo-13': { spec: '12+256', jd: 3299, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo10-pro': { spec: '12+256', jd: 2799, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo10': { spec: '12+256', jd: 2099, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo9-pro': { spec: '12+256', jd: 1999, updatedAt: '2026-10-13', isReference: true },
  'iqoo-z10-turbo-pro': { spec: '12+256', jd: 1799, updatedAt: '2026-10-13', isReference: true },
  'iqoo-z10-turbo': { spec: '12+256', jd: 1499, updatedAt: '2026-10-13', isReference: true },
  'iqoo-z9-turbo': { spec: '12+256', jd: 1499, updatedAt: '2026-10-13', isReference: true },
  'iqoo-z9': { spec: '8+128', jd: 1099, updatedAt: '2026-10-13', isReference: true },
  // id 跟随 src/data/phones/iqoo.ts 的修正（原 `iqoo-pad5-pro` 是手机，与平板撞键）
  'iqoo-13-legend': { spec: '16+1024', jd: 4299, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo9s-pro': { spec: '12+256', jd: 2199, updatedAt: '2026-10-13', isReference: true },
  'iqoo-neo9s-pro-plus': { spec: '12+256', jd: 2499, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 三星 ---------- */
  'samsung-galaxy-s25-ultra': { spec: '12+256', jd: 8299, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s25-plus': { spec: '12+256', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s25': { spec: '12+256', jd: 5299, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s25-edge': { spec: '12+256', jd: 6699, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s24-ultra': { spec: '12+256', jd: 5999, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s24-plus': { spec: '12+256', jd: 4499, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s24': { spec: '8+128', jd: 3699, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s23-ultra': { spec: '8+256', jd: 4499, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-z-fold6': { spec: '12+256', jd: 8999, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-z-fold5': { spec: '12+256', jd: 6299, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-z-flip6': { spec: '12+256', jd: 5399, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-z-flip5': { spec: '8+256', jd: 3599, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-a56': { spec: '8+128', jd: 2699, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-a55': { spec: '8+128', jd: 1999, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-a35': { spec: '8+128', jd: 1599, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-a15': { spec: '6+128', jd: 1099, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-m55': { spec: '8+128', jd: 1499, updatedAt: '2026-10-13', isReference: true },
  'samsung-galaxy-s24-fe': { spec: '8+128', jd: 3399, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 魅族 ---------- */
  'meizu-22': { spec: '12+256', jd: 2799, updatedAt: '2026-10-13', isReference: true },
  'meizu-21-pro': { spec: '12+256', jd: 3299, updatedAt: '2026-10-13', isReference: true },
  'meizu-21-note': { spec: '12+256', jd: 1899, updatedAt: '2026-10-13', isReference: true },
  'meizu-note-16-pro': { spec: '8+256', jd: 1599, updatedAt: '2026-10-13', isReference: true },
  'meizu-note-16': { spec: '8+128', jd: 1099, updatedAt: '2026-10-13', isReference: true },
  'meizu-lucky-08': { spec: '8+256', jd: 1199, updatedAt: '2026-10-13', isReference: true },
  'meizu-mblu-22-pro': { spec: '6+128', jd: 899, updatedAt: '2026-10-13', isReference: true },
  'meizu-mblu-22': { spec: '6+128', jd: 699, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 努比亚 ---------- */
  'nubia-redmagic-10-pro': { spec: '12+256', jd: 4299, updatedAt: '2026-10-13', isReference: true },
  'nubia-redmagic-10-ultra': { spec: '16+512', jd: 5499, updatedAt: '2026-10-13', isReference: true },
  'nubia-redmagic-9s-pro': { spec: '12+256', jd: 3599, updatedAt: '2026-10-13', isReference: true },
  'nubia-z70-ultra': { spec: '12+256', jd: 3999, updatedAt: '2026-10-13', isReference: true },
  'nubia-z60s-pro': { spec: '12+256', jd: 2499, updatedAt: '2026-10-13', isReference: true },
  'nubia-flip-5g': { spec: '8+256', jd: 2699, updatedAt: '2026-10-13', isReference: true },
  'nubia-flip-2': { spec: '8+256', jd: 2999, updatedAt: '2026-10-13', isReference: true },
  'nubia-music-2': { spec: '6+128', jd: 899, updatedAt: '2026-10-13', isReference: true },
  'nubia-music': { spec: '6+128', jd: 699, updatedAt: '2026-10-13', isReference: true },
  'nubia-z70s-ultra': { spec: '12+256', jd: 4599, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 摩托罗拉 ---------- */
  'motorola-moto-x50-ultra': { spec: '12+256', jd: 2999, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-60-pro': { spec: '8+256', jd: 2699, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-50-pro': { spec: '8+256', jd: 2299, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-50': { spec: '8+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'motorola-razr-60-ultra': { spec: '12+256', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'motorola-razr-50-ultra': { spec: '12+256', jd: 4499, updatedAt: '2026-10-13', isReference: true },
  'motorola-razr-50': { spec: '8+256', jd: 2699, updatedAt: '2026-10-13', isReference: true },
  'motorola-moto-s50': { spec: '8+256', jd: 1899, updatedAt: '2026-10-13', isReference: true },
  'motorola-moto-g75': { spec: '8+256', jd: 1399, updatedAt: '2026-10-13', isReference: true },
  'motorola-moto-g85': { spec: '8+256', jd: 1199, updatedAt: '2026-10-13', isReference: true },
  'motorola-moto-g34': { spec: '8+128', jd: 699, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-50-ultra': { spec: '12+512', jd: 3499, updatedAt: '2026-10-13', isReference: true },
  'motorola-edge-60': { spec: '8+256', jd: 1799, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 索尼 ---------- */
  'sony-xperia-1-vii': { spec: '12+256', jd: 8499, updatedAt: '2026-10-13', isReference: true },
  'sony-xperia-1-vi': { spec: '12+256', jd: 5999, updatedAt: '2026-10-13', isReference: true },
  'sony-xperia-10-vi': { spec: '8+128', jd: 2499, updatedAt: '2026-10-13', isReference: true },
  /* ---------- Google ---------- */
  'google-pixel-10-pro-xl': { spec: '16+256', jd: 9099, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-10-pro': { spec: '16+128', jd: 7699, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-10': { spec: '12+128', jd: 5999, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-9-pro-xl': { spec: '16+128', jd: 6499, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-9-pro': { spec: '16+128', jd: 5299, updatedAt: '2026-10-13', isReference: true },
  'google-pixel-9': { spec: '12+128', jd: 4299, updatedAt: '2026-10-13', isReference: true },
  /* ---------- Nothing ---------- */
  'nothing-phone-3a-pro': { spec: '8+128', jd: 2799, updatedAt: '2026-10-13', isReference: true },
  'nothing-phone-3a': { spec: '8+128', jd: 2099, updatedAt: '2026-10-13', isReference: true },
  'nothing-phone-2a': { spec: '8+128', jd: 1499, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 中兴 ---------- */
  'zte-axon-50': { spec: '8+128', jd: 1299, updatedAt: '2026-10-13', isReference: true },
  'zte-nubia-z60-ultra-lead': { spec: '12+256', jd: 3499, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 华硕 ---------- */
  'asus-rog-phone-9-pro': { spec: '16+512', jd: 6299, updatedAt: '2026-10-13', isReference: true },
  'asus-rog-phone-8-pro': { spec: '16+512', jd: 4299, updatedAt: '2026-10-13', isReference: true },
  'asus-zenfone-11-ultra': { spec: '12+256', jd: 3499, updatedAt: '2026-10-13', isReference: true },
  /* ---------- 其他 ---------- */
  'tecno-camon-30-pro': { spec: '12+256', jd: 1699, updatedAt: '2026-10-13', isReference: true },
  'sharp-aquos-r9-pro': { spec: '12+256', jd: 4999, updatedAt: '2026-10-13', isReference: true },
};

/** 已收录报价的机型数量 */
export const PRICE_COUNT: number = Object.keys(PRICES).length;

/** 取某一机型的渠道报价（未收录返回 undefined） */
export function getPriceRecord(phoneId: string | undefined): PriceRecordWithSpec | undefined {
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

export type { PriceRecordWithSpec };
