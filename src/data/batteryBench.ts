/**
 * 第三方实测续航数据（与官方参数解耦，可独立更新）。
 *
 * 数据来源与口径：
 *  - 来源：极客湾 Geekerwan 官方数据库 https://www.socpk.com/chart/battery-life-5-0
 *  - 标准：极客湾「手机续航测试 5.0」，参测机均为自购零售机（站点原文：「均使用自购零售机测试」）
 *  - `batteryLifeMin`：满电连续使用**至关机**的实测总时长（分钟）。
 *    **这是第三方实测值，不是官方参数**——站点未公布测试项目/亮度/条件明细，
 *    只能表述为「实测至关机时长」，绝不可写成官方口径（如「视频播放 20 小时」）。
 *  - `systemVersion`：测试时该机的系统版本（同一机型换版本重测会更新，故一并保留）
 *  - `videoUrl`：该次测试的 B 站全程录像，作为溯源依据
 *  - `ratedEnergyWh`：极客湾标注的电池**额定**能量（Wh），与我们库中官方 mAh 容量是两回事
 *  - 数值：整数分钟。站点原始值带 1e-6 级浮点误差，已四舍五入取整
 *
 * 覆盖范围说明：
 *  - 共 80 款参测机型，其中 62 款能对齐到本库机型，其余 18 款
 *    为本库尚未收录的 2026 年新机（如小米 17T 系列、一加 Ace6 系列、华为 nova 15/16），不臆造、不入表；
 *  - 未收录机型的 `batteryLifeMin` 一律 undefined，界面显示「—」；
 *  - 平板 / 笔记本无实测数据。
 *
 * 更新方式：
 *   node scripts/gen-battery-bench.mjs       # 重新从 research/socpk-battery-life.json 生成本文件
 *   （该 JSON 由 socpk 抓站脚本产出，dataVersion: 7ddf4f90e2c1，抓取日期 2026-10-15）
 */
export interface BatteryBench {
  /** 极客湾续航测试 5.0 实测至关机时长（分钟）。第三方口径，非官方参数 */
  batteryLifeMin: number | null;
  /** 测试时系统版本 */
  systemVersion: string | null;
  /** B 站全程录像 */
  videoUrl: string | null;
  /** 电池额定能量（Wh），极客湾实测标注值 */
  ratedEnergyWh: number | null;
}

/** 机型 id -> 第三方实测续航 */
export const BATTERY_BENCH: Record<string, BatteryBench> = {
  /* ---------- 荣耀 ---------- */
  'honor-win-rt': { batteryLifeMin: 726, systemVersion: 'MagicOS 10.0.0.160', videoUrl: 'https://www.bilibili.com/video/BV1z83G6hEAj/', ratedEnergyWh: 36.88 }, // 荣耀 WIN RT
  'honor-magic8-pro': { batteryLifeMin: 603, systemVersion: 'MagicOS 10.0.0.160', videoUrl: 'https://www.bilibili.com/video/BV1aw3G6SE8L/', ratedEnergyWh: 26.54 }, // 荣耀 Magic8 Pro
  'honor-gt-pro': { batteryLifeMin: 570, systemVersion: 'MagicOS 10.0.0.150', videoUrl: 'https://www.bilibili.com/video/BV1fUgU6FELN/', ratedEnergyWh: 27.51 }, // 荣耀 GT Pro
  'honor-magic8': { batteryLifeMin: 552, systemVersion: 'MagicOS 10.0.0.155', videoUrl: 'https://www.bilibili.com/video/BV1Gw3G6SErZ/', ratedEnergyWh: 25.78 }, // 荣耀 Magic8
  'honor-magic7-pro': { batteryLifeMin: 458, systemVersion: 'MagicOS 10.0.0.150', videoUrl: 'https://www.bilibili.com/video/BV1Yw3G6SEGM/', ratedEnergyWh: 21.97 }, // 荣耀 Magic7 Pro
  /* ---------- Redmi ---------- */
  'redmi-k90-max': { batteryLifeMin: 684, systemVersion: 'HyperOS 3.0.310.0', videoUrl: 'https://www.bilibili.com/video/BV13w3G6SEXU/', ratedEnergyWh: 31.85 }, // REDMI K90 Max
  'redmi-k90-pro-max': { batteryLifeMin: 581, systemVersion: 'HyperOS 3.0.306.0', videoUrl: 'https://www.bilibili.com/video/BV1AMga6WE1G/', ratedEnergyWh: 28.13 }, // REDMI K90 Pro Max
  'redmi-k80-ultra': { batteryLifeMin: 573, systemVersion: 'HyperOS 3.0.302.0', videoUrl: 'https://www.bilibili.com/video/BV1D23G6UEvR/', ratedEnergyWh: 27.78 }, // Redmi K80 至尊版
  'redmi-k90': { batteryLifeMin: 516, systemVersion: 'HyperOS 3.0.304.0', videoUrl: 'https://www.bilibili.com/video/BV1di3G6xECC/', ratedEnergyWh: 26.52 }, // REDMI K90
  'redmi-k80-pro': { batteryLifeMin: 467, systemVersion: 'HyperOS 3.0.303.0', videoUrl: 'https://www.bilibili.com/video/BV1AMga6WEFj/', ratedEnergyWh: 22.62 }, // Redmi K80 Pro
  /* ---------- 努比亚 ---------- */
  'nubia-redmagic-11-pro': { batteryLifeMin: 681, systemVersion: 'RedMagicOS 11.0.23MR1', videoUrl: 'https://www.bilibili.com/video/BV1wMga6WEfg/', ratedEnergyWh: 29.66 }, // 红魔 11 Pro
  /* ---------- iQOO ---------- */
  'iqoo-z11-turbo': { batteryLifeMin: 658, systemVersion: 'OriginOS 6 16.0.11.3', videoUrl: 'https://www.bilibili.com/video/BV1JGgX63Edn/', ratedEnergyWh: 27.83 }, // iQOO Z11 Turbo
  'iqoo-15-ultra': { batteryLifeMin: 593, systemVersion: 'OriginOS 6 16.0.14.9', videoUrl: 'https://www.bilibili.com/video/BV1AMga6WEuA/', ratedEnergyWh: 27.08 }, // iQOO 15 Ultra
  'iqoo-15t': { batteryLifeMin: 591, systemVersion: 'OriginOS 6 16.0.11.2', videoUrl: 'https://www.bilibili.com/video/BV1zGgX63Emo/', ratedEnergyWh: 29.35 }, // iQOO 15T
  'iqoo-15': { batteryLifeMin: 557, systemVersion: 'OriginOS 6 16.0.26.22', videoUrl: 'https://www.bilibili.com/video/BV161gt6rE1e/', ratedEnergyWh: 25.62 }, // iQOO 15
  'iqoo-13': { batteryLifeMin: 475, systemVersion: 'OriginOS 6 16.1.16.5', videoUrl: 'https://www.bilibili.com/video/BV1WMga6WEuA/', ratedEnergyWh: 22.97 }, // iQOO 13
  /* ---------- OPPO ---------- */
  'oppo-find-x9-pro': { batteryLifeMin: 600, systemVersion: 'ColorOS 16.0.5.703', videoUrl: 'https://www.bilibili.com/video/BV1VhgC6MELX/', ratedEnergyWh: 27.34 }, // OPPO Find X9 Pro
  'oppo-find-x9s-pro': { batteryLifeMin: 553, systemVersion: 'ColorOS 16.0.8.306', videoUrl: 'https://www.bilibili.com/video/BV1wkgU6NEHf/', ratedEnergyWh: 25.64 }, // OPPO Find X9s Pro
  'oppo-find-x9': { batteryLifeMin: 524, systemVersion: 'ColorOS 16.0.5.701', videoUrl: 'https://www.bilibili.com/video/BV1XhgC6TEmN/', ratedEnergyWh: 25.65 }, // OPPO Find X9
  'oppo-find-x9-ultra': { batteryLifeMin: 513, systemVersion: 'ColorOS 16.0.7.210', videoUrl: 'https://www.bilibili.com/video/BV1ahgC6TEtL/', ratedEnergyWh: 25.64 }, // OPPO Find X9 Ultra
  'oppo-find-x8-ultra': { batteryLifeMin: 472, systemVersion: 'ColorOS 16.0.8.300', videoUrl: 'https://www.bilibili.com/video/BV1uCKa6RE4E/', ratedEnergyWh: 22.87 }, // OPPO Find X8 Ultra
  /* ---------- 华为 ---------- */
  'huawei-pura-90-pro': { batteryLifeMin: 576, systemVersion: 'HarmonyOS 6.1.0.125', videoUrl: 'https://www.bilibili.com/video/BV1Rj336nECc/', ratedEnergyWh: 22.35 }, // 华为 Pura 90 Pro
  'huawei-pura-90-pro-max': { batteryLifeMin: 552, systemVersion: 'HarmonyOS 6.1.0.125', videoUrl: 'https://www.bilibili.com/video/BV1Yn336UEWx/', ratedEnergyWh: 22.35 }, // 华为 Pura 90 Pro Max
  'huawei-pura-90': { batteryLifeMin: 542, systemVersion: 'HarmonyOS 6.1.0.125', videoUrl: 'https://www.bilibili.com/video/BV1qQ3364Ehm/', ratedEnergyWh: 24.21 }, // 华为 Pura 90
  'huawei-mate-80': { batteryLifeMin: 512, systemVersion: 'HarmonyOS 6.1.0.125', videoUrl: 'https://www.bilibili.com/video/BV1CMga6WEDJ/', ratedEnergyWh: 21.36 }, // 华为 Mate 80
  'huawei-mate-70-pro-plus': { batteryLifeMin: 496, systemVersion: 'HarmonyOS 6.1.0.117', videoUrl: 'https://www.bilibili.com/video/BV1Gw3G6SEzg/', ratedEnergyWh: 21.34 }, // 华为 Mate 70 Pro+
  'huawei-mate-80-pro': { batteryLifeMin: 494, systemVersion: 'HarmonyOS 6.1.0.125', videoUrl: 'https://www.bilibili.com/video/BV1Xw3G6SE2F/', ratedEnergyWh: 21.36 }, // 华为 Mate 80 Pro
  'huawei-mate-80-pro-max': { batteryLifeMin: 494, systemVersion: 'HarmonyOS 6.1.0.125', videoUrl: 'https://www.bilibili.com/video/BV1TV3G6GErp/', ratedEnergyWh: 22.31 }, // 华为 Mate 80 Pro Max
  'huawei-mate-60-pro': { batteryLifeMin: 356, systemVersion: 'HarmonyOS 6.1.0.117', videoUrl: 'https://www.bilibili.com/video/BV1Yw3G6SEGV/', ratedEnergyWh: 19.15 }, // 华为 Mate 60 Pro
  /* ---------- 一加 ---------- */
  'oneplus-15': { batteryLifeMin: 552, systemVersion: 'ColorOS 16.0.5.702', videoUrl: 'https://www.bilibili.com/video/BV1WMga6WEH5/', ratedEnergyWh: 27.03 }, // 一加 15
  'oneplus-ace-5-ultra': { batteryLifeMin: 506, systemVersion: 'ColorOS 16.0.8.300', videoUrl: 'https://www.bilibili.com/video/BV1WMga6WEpV/', ratedEnergyWh: 25.28 }, // 一加 Ace 5 至尊版
  'oneplus-ace-5-pro': { batteryLifeMin: 465, systemVersion: 'ColorOS 16.0.5.701', videoUrl: 'https://www.bilibili.com/video/BV1AMga6WEzZ/', ratedEnergyWh: 22.76 }, // 一加 Ace 5 Pro
  'oneplus-13': { batteryLifeMin: 456, systemVersion: 'ColorOS 16.0.5.703', videoUrl: 'https://www.bilibili.com/video/BV1WMga6WEGp/', ratedEnergyWh: 22.31 }, // 一加 13
  /* ---------- realme ---------- */
  'realme-gt8': { batteryLifeMin: 544, systemVersion: 'ColorOS 16.0.5.793', videoUrl: 'https://www.bilibili.com/video/BV1wMga6WEfT/', ratedEnergyWh: 26.78 }, // realme GT8
  'realme-gt8-pro': { batteryLifeMin: 499, systemVersion: 'ColorOS 16.0.5.704', videoUrl: 'https://www.bilibili.com/video/BV1Xn336mEta/', ratedEnergyWh: 25.9 }, // realme GT8 Pro
  /* ---------- vivo ---------- */
  'vivo-x300s': { batteryLifeMin: 542, systemVersion: 'OriginOS 6 16.0.8.7', videoUrl: 'https://www.bilibili.com/video/BV13m356oEUE/', ratedEnergyWh: 25.81 }, // vivo X300s
  'vivo-x300-pro': { batteryLifeMin: 501, systemVersion: 'OriginOS 6 16.0.28.30', videoUrl: 'https://www.bilibili.com/video/BV1Qm356dEDo/', ratedEnergyWh: 24.55 }, // vivo X300 Pro
  'vivo-x300': { batteryLifeMin: 500, systemVersion: 'OriginOS 6 16.0.28.30', videoUrl: 'https://www.bilibili.com/video/BV1Nn356LEyE/', ratedEnergyWh: 22.34 }, // vivo X300
  'vivo-x300-ultra': { batteryLifeMin: 490, systemVersion: 'OriginOS 6 16.0.21.11', videoUrl: 'https://www.bilibili.com/video/BV13m356oEXz/', ratedEnergyWh: 23.92 }, // vivo X300 Ultra
  'vivo-x200-ultra': { batteryLifeMin: 434, systemVersion: 'OriginOS 6 16.1.17.2', videoUrl: 'https://www.bilibili.com/video/BV1qg336sEHb/', ratedEnergyWh: 22.35 }, // vivo X200 Ultra
  /* ---------- 小米 ---------- */
  'xiaomi-17-pro-max': { batteryLifeMin: 536, systemVersion: 'HyperOS 3.0.306.0', videoUrl: 'https://www.bilibili.com/video/BV1yu376nEim/', ratedEnergyWh: 27.64 }, // 小米 17 Pro Max
  'xiaomi-17': { batteryLifeMin: 525, systemVersion: 'HyperOS 3.0.306.0', videoUrl: 'https://www.bilibili.com/video/BV1Qm356dEQc/', ratedEnergyWh: 25.94 }, // 小米 17
  'xiaomi-17-ultra': { batteryLifeMin: 478, systemVersion: 'HyperOS 3.0.303.0', videoUrl: 'https://www.bilibili.com/video/BV1Ym356oE3m/', ratedEnergyWh: 25.11 }, // 小米 17 Ultra
  'xiaomi-17-pro': { batteryLifeMin: 460, systemVersion: 'HyperOS 3.0.306.0', videoUrl: 'https://www.bilibili.com/video/BV1Qm356dEtD/', ratedEnergyWh: 23.13 }, // 小米 17 Pro
  'xiaomi-15-pro': { batteryLifeMin: 445, systemVersion: 'HyperOS 3.0.302.0', videoUrl: 'https://www.bilibili.com/video/BV1Cu376JELP/', ratedEnergyWh: 22.95 }, // 小米 15 Pro
  'xiaomi-15': { batteryLifeMin: 422, systemVersion: 'HyperOS 3.0.302.0', videoUrl: 'https://www.bilibili.com/video/BV1yu376JEFE/', ratedEnergyWh: 20.26 }, // 小米 15
  /* ---------- Apple ---------- */
  'iphone-17-pro-max': { batteryLifeMin: 534, systemVersion: 'iOS 26.5 RC', videoUrl: 'https://www.bilibili.com/video/BV1AMga6WE6u/', ratedEnergyWh: 18.75 }, // iPhone 17 Pro Max
  'iphone-17-pro': { batteryLifeMin: 439, systemVersion: 'iOS 26.5 RC', videoUrl: 'https://www.bilibili.com/video/BV1U3gb69EvL/', ratedEnergyWh: 15.53 }, // iPhone 17 Pro
  'iphone-16-pro-max': { batteryLifeMin: 423, systemVersion: 'iOS 26.5', videoUrl: 'https://www.bilibili.com/video/BV1U3gb69EG5/', ratedEnergyWh: 18.17 }, // iPhone 16 Pro Max
  'iphone-15-pro-max': { batteryLifeMin: 396, systemVersion: 'iOS 26.5', videoUrl: 'https://www.bilibili.com/video/BV1cCgU6eEqs/', ratedEnergyWh: 17.11 }, // iPhone 15 Pro Max
  'iphone-17': { batteryLifeMin: 385, systemVersion: 'iOS 26.5 RC', videoUrl: 'https://www.bilibili.com/video/BV1f2gU6hEYw/', ratedEnergyWh: 14.35 }, // iPhone 17
  'iphone-16': { batteryLifeMin: 342, systemVersion: 'iOS 26.5', videoUrl: 'https://www.bilibili.com/video/BV1cCgU6eErz/', ratedEnergyWh: 13.84 }, // iPhone 16
  'iphone-16-pro': { batteryLifeMin: 333, systemVersion: 'iOS 26.5', videoUrl: 'https://www.bilibili.com/video/BV1U3gb69EZY/', ratedEnergyWh: 13.94 }, // iPhone 16 Pro
  'iphone-air': { batteryLifeMin: 331, systemVersion: 'iOS 26.5.2', videoUrl: 'https://www.bilibili.com/video/BV1mYgt6SEAc/', ratedEnergyWh: 12.26 }, // iPhone Air
  'iphone-15-pro': { batteryLifeMin: 300, systemVersion: 'iOS 26.5 RC', videoUrl: 'https://www.bilibili.com/video/BV1KSKa6DEsD/', ratedEnergyWh: 12.7 }, // iPhone 15 Pro
  'iphone-18-pro': { batteryLifeMin: 470, systemVersion: 'iOS 27.0', videoUrl: 'https://www.bilibili.com/video/BV1yye26tE7s/', ratedEnergyWh: null }, // iPhone 18 Pro
  'iphone-18-pro-max': { batteryLifeMin: 637, systemVersion: 'iOS 27.0', videoUrl: 'https://www.bilibili.com/video/BV1BkeS64EHS/', ratedEnergyWh: null }, // iPhone 18 Pro Max
  /* ---------- 三星 ---------- */
  'samsung-galaxy-s26-ultra': { batteryLifeMin: 435, systemVersion: 'OneUI 8.5', videoUrl: 'https://www.bilibili.com/video/BV1qg336sEdZ/', ratedEnergyWh: 18.94 }, // 三星 Galaxy S26 Ultra
  'samsung-galaxy-s25-ultra': { batteryLifeMin: 406, systemVersion: 'OneUI 8.5', videoUrl: 'https://www.bilibili.com/video/BV1qg336sEnb/', ratedEnergyWh: 18.84 }, // 三星 Galaxy S25 Ultra
  'samsung-galaxy-s26': { batteryLifeMin: 400, systemVersion: 'OneUI 8.5', videoUrl: 'https://www.bilibili.com/video/BV1v5336QEkJ/', ratedEnergyWh: 16.29 }, // 三星 Galaxy S26
  'samsung-galaxy-s25-edge': { batteryLifeMin: 354, systemVersion: 'OneUI 8.5', videoUrl: 'https://www.bilibili.com/video/BV1ej336nEtA/', ratedEnergyWh: 14.77 }, // 三星 Galaxy S25 Edge
  /* ---------- Google ---------- */
  'google-pixel-10-pro-xl': { batteryLifeMin: 351, systemVersion: 'Android 16', videoUrl: 'https://www.bilibili.com/video/BV1pz336vEqd/', ratedEnergyWh: 19.76 }, // Google Pixel 10 Pro XL
};
