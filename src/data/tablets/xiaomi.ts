import { cTablet, type CompactSeed } from './_factory';

/**
 * 小米 / REDMI 平板机型。
 *
 * 数据来源：`research/tablets.md` C 段、`research/tablets-batch2.md` §10。
 * REDMI 与小米同属一个文件（沿用 `phones/` 的品牌命名），
 * 但 `brand` 分别取 `小米` / `Redmi`，保证筛选器里两个品牌各自可选。
 *
 * ⚠️ 口径：
 * - 全系国行平板无官方蜂窝版，`tb.cellular` 一律 `false`；
 * - 安卓平板电池只填 `bc`（mAh），**不填 `bwh`、严禁 Wh→mAh 换算**；
 * - 小米官方参数页对平板摄像头 / 重量普遍不列，这些字段为 `null` 属于诚实表达，不是漏录；
 * - `xiaomi-pad-5` / `xiaomi-pad-5-pro` 为 2021-08 机型，超出 3 年窗口但仍在售，照录。
 */
const XIAOMI_SEEDS: CompactSeed[] = [
  {
    i: 'xiaomi-pad-9-pro',
    n: '小米平板 9 Pro',
    d: '2026-09',
    lp: 3799,
    cp: 3799,
    cat: 'tablet',
    ff: 'slate',
    sz: 12.5,
    res: '3.2K',
    mat: 'LCD',
    rr: 144,
    nit: 1000,
    dim: '全亮度DC调光',
    soc: '第五代骁龙8至尊版',
    sb: '高通',
    pr: '3nm',
    an: 3400000,
    ft: 'UFS 4.1',
    ram: [8, 12, 16],
    rom: [128, 256],
    cm: '5000万像素',
    fc: '3200万像素',
    bc: 11000,
    bw: 67,
    bwl: 0,
    br: '22.5W有线反充',
    ui: 'HyperOS 4',
    net: 'Wi-Fi',
    wf: 'Wi-Fi 7',
    bt: '6.0',
    nfc: false,
    ir: false,
    bdim: '厚5.8mm',
    wt: 580,
    bio: '侧边指纹',
    spk: '6 扬声器',
    port: 'USB-C',
    col: '黑,银,云杉绿',
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔 Pro', bundled: false },
      keyboard: { supported: true, name: '小米官方键盘', attach: 'pogo', bundled: false },
      desktopMode: null,
      speakerCount: 6,
      microSd: false,
    },
    tags: ['平板', '旗舰', '大屏', '长续航', '生产力'],
  },
  {
    i: 'xiaomi-pad-9',
    n: '小米平板 9',
    d: '2026-09',
    lp: 2999,
    cp: 2999,
    cat: 'tablet',
    ff: 'slate',
    sz: 11.2,
    res: '3.2K',
    mat: 'LCD',
    rr: 144,
    nit: 1000,
    soc: '骁龙8s Gen4',
    sb: '高通',
    ft: 'UFS 4.1',
    ram: [8, 12],
    rom: [128, 256],
    cm: '1300万像素',
    fc: '800万像素',
    bc: 9720,
    bw: 45,
    bwl: 0,
    br: '支持有线反充',
    ui: 'HyperOS 4',
    net: 'Wi-Fi',
    wf: 'Wi-Fi 7',
    bt: '6.0',
    nfc: false,
    ir: false,
    bdim: '厚5.75mm',
    wt: 485,
    bio: '侧边指纹',
    spk: '4 扬声器（杜比全景声）',
    port: 'USB-C',
    col: '黑,冰桃粉,银,云杉绿',
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔 Pro', bundled: false },
      keyboard: { supported: true, name: '小米官方键盘', attach: 'pogo', bundled: false },
      desktopMode: null,
      speakerCount: 4,
      microSd: false,
    },
    tags: ['平板', '主流', '长续航'],
  },
  {
    // 🔴 极稀疏：官方只放出「13.3" 3408x2272 + 玄戒 O3 + 4799 元起」，电池 / 摄像头 / 重量 / 刷新率全部未查到
    // 2026-10-15 补（www.mi.com/prod/xiaomi-pad-9-pro-max/specs）：整机 12000mAh(typ)/11740mAh(min)、
    // 主摄 5000 万像素超清主摄、前置 3200 万像素超广镜头；玄戒 O3 AI 旗舰处理器 3nm
    i: 'xiaomi-pad-9-pro-max', n: '小米平板 9 Pro Max', d: '2026-09', lp: 4799, cp: 4799,
    sz: 13.3, res: '3408x2272', ppi: null, mat: 'LCD', rr: null,
    soc: '玄戒 O3', sb: '小米', pr: '3nm', // ram / rom 未查到（类型不接受 null，故省略 → 空选项）
    cm: '5000万像素', fc: '3200万像素',
    bc: 12000, bw: null, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '生产力'],
  },
  {
    i: 'xiaomi-pad-8-pro', n: '小米平板 8 Pro', d: '2025-09-25', lp: 3199, cp: null,
    sz: 11.2, res: '3.2K', ppi: null, mat: 'LCD', rr: 144,
    soc: '骁龙8至尊版', sb: '高通', pr: '3nm', ram: [8, 12, 16], rom: [128, 256, 512],
    // 2026-10-15 补（mi.com/prod/xiaomi-pad-8-pro/specs）：后置 5000 万 1/2.76" ƒ/1.8 PDAF，前置 3200 万
    cm: '5000万像素 f/1.8', fc: '3200万像素',
    bc: 9200, bw: null, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '旗舰', '长续航'],
  },
  {
    i: 'xiaomi-pad-8', n: '小米平板 8', d: '2025-09-25', lp: 2499, cp: null,
    sz: 11.2, res: '3.2K', ppi: null, mat: 'LCD', rr: 144,
    soc: '骁龙8s Gen4', sb: '高通', ram: [8, 12], rom: [128, 256],
    // 2026-10-15 补（mi.com/prod/xiaomi-pad-8/specs）：后置 1300 万 1/3.06" ƒ/2.2 PDAF，前置 800 万
    cm: '1300万像素 f/2.2', fc: '800万像素',
    bc: 9200, bw: null, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '主流', '长续航'],
  },
  {
    // 14" 3.2K 高亮 OLED + 玄戒 O1 自研芯片 + 12000mAh，5699 元起
    i: 'xiaomi-pad-7-ultra', n: '小米平板 7 Ultra', d: '2025-05-22', lp: 5699, cp: null,
    sz: 14, res: '3.2K', ppi: null, mat: 'OLED', rr: 120,
    soc: '玄戒 O1', sb: '小米', ram: [12, 16], rom: [256, 512, 1024],
    // 2026-10-15 补（mi.com/prod/xiaomi-pad-7-ultra/specs）：后置 5000 万 JN1 1/2.76" ƒ/1.8 PDAF，前置 3200 万
    cm: '5000万像素 f/1.8', fc: '3200万像素',
    bc: 12000, bw: null, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔 Pro', bundled: false },
      keyboard: { supported: true, name: '官方悬浮键盘', attach: 'magnetic', bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '长续航'],
  },
  {
    i: 'xiaomi-pad-7s-pro', n: '小米平板 7S Pro 12.5', d: '2025-06-26', lp: 3699, cp: 3299,
    sz: 12.5, res: '3.2K', ppi: null, mat: 'LCD', rr: 144,
    soc: '玄戒 O1', sb: '小米', ram: [8, 12, 16], rom: [256, 512, 1024],
    // 2026-10-15 补（mi.com/prod/xiaomi-pad-7s-pro/specs）：后置 5000 万 JN1 1/2.76" ƒ/1.8 PDAF，前置 3200 万
    cm: '5000万像素 f/1.8', fc: '3200万像素',
    bc: 10610, bw: null, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔 Pro', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '长续航'],
  },
  {
    i: 'xiaomi-pad-7-pro', n: '小米平板 7 Pro', d: '2024-10-29', lp: 2699, cp: null,
    sz: 11.2, res: '3.2K', ppi: null, mat: 'LCD', rr: 144,
    soc: '骁龙8s Gen3', sb: '高通', pr: '4nm', ram: [8, 12], rom: [128, 256, 512],
    // 2026-10-15 补（mi.com 规格页）：主摄 50MP JN1 1/2.76" ƒ/1.8 PDAF，前置 3200 万
    cm: '5000万像素 f/1.8', fc: '3200万像素',
    bc: 8850, bw: null, bwl: 0,
    os: null, ui: 'HyperOS 2', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '主流'],
  },
  {
    i: 'xiaomi-pad-7', n: '小米平板 7', d: '2024-10-29', lp: 2299, cp: null,
    sz: 11.2, res: '3.2K', ppi: null, mat: 'LCD', rr: 144,
    soc: '骁龙7+ Gen3', sb: '高通', pr: '4nm', ram: [8, 12], rom: [128, 256],
    // 2026-10-15 补（mi.com/prod/xiaomi-pad-7/specs）：主摄 13MP 1/3.06" ƒ/2.2 PDAF，前置 800 万
    cm: '1300万像素 f/2.2', fc: '800万像素',
    bc: 8850, bw: null, bwl: 0,
    os: null, ui: 'HyperOS 2', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '主流'],
  },
  {
    // lp 未查到（2024-02-22 发布）。120W 快充是本系列独一份
    // 2026-10-15 核：首发价 8GB+256GB 3299（小米发布会）；cp 留空——小米官网现售 Pad 8/9 系列，已下架
    i: 'xiaomi-pad-6s-pro', n: '小米平板 6S Pro 12.4', d: '2024-02-22', lp: 3299, cp: null,
    sz: 12.4, res: '3048x2032', ppi: null, mat: 'LCD', rr: 144,
    soc: '骁龙8 Gen2', sb: '高通', pr: '4nm', ram: [8, 12, 16], rom: [256, 512, 1024],
    // 2026-10-15 补（mi.com/prod/xiaomi-pad-6s-pro/specs）：主摄 5000 万 1/2.76" ƒ/1.8 PDAF，前置 3200 万
    cm: '5000万像素 f/1.8', fc: '3200万像素',
    bc: 10000, bw: 120, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: '6 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 6, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '长续航'],
  },
  {
    i: 'xiaomi-pad-6-max', n: '小米平板 6 Max', d: '2023-08-14', lp: 3799, cp: null,
    sz: 14, res: '2880x1800', ppi: null, mat: 'LCD', rr: 120,
    soc: '骁龙8+ Gen1', sb: '高通', pr: '4nm', ram: [8, 12, 16], rom: [256, 512, 1024],
    // 2026-10-15 补（mi.com/xiaomi-pad-6-max/specs 官方规格页）：主摄 50MP 1/2.76" 1.28μm f/1.8 PDAF，
    // 副摄景深；前置 2000 万 IMX596 1/3.4" f/2.2；同页给出 318.58x206.1x6.53mm / 750g
    cm: '5000万像素 f/1.8', cw: '200万像素景深', fc: '2000万像素',
    bc: 10000, bw: null, bwl: 0,
    os: null, ui: 'MIUI Pad 14', net: 'Wi-Fi', nfc: false, ir: false,
    bdim: '318.58x206.1x6.53mm', wt: 750, bm: null, ip: null, bio: null, spk: '8 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米焦点触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 8, microSd: null,
    },
    tags: ['平板', '大屏', '长续航'],
  },
  {
    i: 'xiaomi-pad-6-pro', n: '小米平板 6 Pro', d: '2023-04-18', lp: 2499, cp: null,
    sz: 11, res: '2880x1800', ppi: 309, mat: 'LCD', rr: 144,
    soc: '骁龙8+ Gen1', sb: '高通', pr: '4nm', cpu: '3.2GHz 八核', ram: [8, 12], rom: [128, 256, 512],
    cm: '5000万像素', cw: '200万像素景深', fc: '2000万像素',
    bc: 8600, bw: 67, bwl: 0,
    os: null, ui: 'MIUI Pad 14', net: 'Wi-Fi', nfc: false, ir: false,
    bdim: '253.95x165.18x6.51mm', wt: null, bm: null, ip: null, bio: '侧边指纹',
    spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米灵感触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '主流'],
  },
  {
    i: 'xiaomi-pad-6', n: '小米平板 6', d: '2023-04-18', lp: 1999, cp: null,
    sz: 11, res: '2880x1800', ppi: 309, mat: 'LCD', rr: 144,
    soc: '骁龙870', sb: '高通', pr: '7nm', ram: [6, 8], rom: [128, 256],
    cm: '1300万像素', fc: '800万像素',
    bc: 8840, bw: 33, bwl: 0,
    os: null, ui: 'MIUI Pad 14', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 490, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米灵感触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '主流'],
  },
  {
    i: 'xiaomi-pad-5-pro-124', n: '小米平板 5 Pro 12.4', d: '2022-08-11', lp: 2999, cp: 1889,
    sz: 12.4, res: '2560x1600', ppi: 244, mat: 'LCD（OGS全贴合）', rr: 120,
    soc: '骁龙870', sb: '高通', pr: '7nm', ram: [6, 8, 12], rom: [128, 256, 512],
    cm: '5000万像素', cw: '200万像素景深', fc: '2000万像素',
    bc: 10000, bw: 67, bwl: 0,
    os: null, ui: 'MIUI 13', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 620, bm: '全金属一体化机身', ip: null, bio: '侧边指纹', spk: '8 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米灵感触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 8, microSd: null,
    },
    tags: ['平板', '大屏', '长续航'],
  },
  {
    // ⚠️ 2021-08 发布，超出 3 年窗口，但首轮调研已收录且仍在售，照录
    i: 'xiaomi-pad-5-pro', n: '小米平板 5 Pro', d: '2021-08-10', lp: 2499, cp: null,
    sz: 11, res: '2560x1600', ppi: 274, mat: 'LCD', rr: 120,
    soc: '骁龙870', sb: '高通', pr: '7nm', ram: [6, 8], rom: [128, 256],
    cm: '1300万像素', cw: '500万像素', fc: '800万像素',
    bc: 8600, bw: 67, bwl: 0,
    os: null, ui: 'MIUI 12.5', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 515, bm: null, ip: null, bio: '侧边指纹', spk: '8 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米灵感触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 8, microSd: null,
    },
    tags: ['平板', '主流'],
  },
  {
    // ⚠️ 2021-08 发布，超出 3 年窗口，照录
    i: 'xiaomi-pad-5', n: '小米平板 5', d: '2021-08-10', lp: 1999, cp: null,
    sz: 11, res: '2560x1600', ppi: 274, mat: 'LCD', rr: 120,
    soc: '骁龙860', sb: '高通', pr: '7nm', ram: [6], rom: [128, 256],
    cm: '1300万像素', fc: '800万像素',
    bc: 8720, bw: 33, bwl: 0,
    os: null, ui: 'MIUI 12.5', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 511, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小米灵感触控笔', bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '入门'],
  },
];

const REDMI_SEEDS: CompactSeed[] = [
  {
    i: 'redmi-k-pad',
    n: 'REDMI K Pad',
    d: '2025-06',
    lp: 3099,
    cp: 2799,
    cat: 'tablet',
    ff: 'slate',
    sz: 8.8,
    res: '3008x1880',
    ppi: 403,
    mat: 'LCD',
    rr: 165,
    nit: 700,
    soc: '天玑9400+',
    sb: '联发科',
    pr: '3nm',
    ram: [8, 12, 16],
    rom: [256, 512, 1024],
    cm: '1300万像素',
    fc: '800万像素',
    bc: 7500,
    bw: 67,
    bwl: 0,
    ui: 'HyperOS',
    net: 'Wi-Fi',
    wf: 'Wi-Fi 7',
    nfc: false,
    ir: false,
    wt: 326,
    bm: '铝合金液冷VC 12050mm²',
    spk: '2 扬声器（四音圈对称）',
    port: '双 USB-C',
    col: '深邃黑,烟霞紫,云杉绿,流金白',
    tb: {
      cellular: false,
      stylus: { supported: false },
      keyboard: { supported: true, name: 'REDMI 游戏手柄 / 键盘外设', attach: 'bluetooth', bundled: false },
      desktopMode: null,
      speakerCount: 2,
      microSd: false,
    },
    tags: ['平板', '小屏', '游戏', '长续航', '轻薄'],
  },
  {
    // 🔴 极稀疏 + 日期只有年份：3599 元起、天玑 9500 之外全部未查到
    i: 'redmi-k-pad-2', n: 'REDMI K Pad 2', d: '2026', lp: 3599, cp: null,
    // 2026-10-15 补（www.mi.com/prod/redmi-kpad2/specs + 小米商城 m.mi.com/commodity/detail/23974）：
    // 8.8" 3008*1880 165Hz / 整机等效 9100mAh(typ) / 后置 1300 万 OV13B 1/3.06" 1.12μm f/2.2 PDAF / 前置 800 万 OV08F
    sz: 8.8, res: '3008x1880', ppi: null, mat: 'LCD', rr: 165,
    soc: '天玑9500', sb: '联发科', pr: '3nm', // ram / rom 未查到
    cm: '1300万像素 f/2.2', fc: '800万像素',
    bc: 9100, bw: null, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '小屏', '游戏', '长续航'],
  },
  {
    // 官方卖点：12000mAh 超大容量电池。SoC / 摄像头 / 重量未查到
    i: 'redmi-pad-2-pro', n: 'REDMI Pad 2 Pro', d: '2026-01-29', lp: 1999, cp: null,
    sz: 12.1, res: null, ppi: null, mat: 'LCD', rr: 120,
    // 2026-10-15 补（mi.com 官方规格页 + 京东自营商品参数均指向第四代骁龙 7s）
    // 2026-10-15 二次核：小米商城官方商详页明确「后置摄像头 800W / 前置摄像头 800W」；
    // mi.com/global 规格页（Wi-Fi 版）同口径 8MP 1/4" f/2。此前看到的 13MP 是 5G 版口径，
    // 本条是国行 Wi-Fi 版，取 800 万。12.1" 2560x1600 249ppi 120Hz / 610g / 279.8x181.65x7.5mm
    // 来源：https://m.mi.com/commodity/detail/22535 、https://www.mi.com/global/product/redmi-pad-2-pro/specs/
    // 2026-10-15 补（小米商城商详页「运行内存 8GB/12GB、内存容量 128GB/256GB」）
    soc: '骁龙7s Gen4', sb: '高通', pr: '4nm', ram: [8, 12], rom: [128, 256],
    cm: '800万像素 f/2.0', fc: '800万像素',
    bc: 12000, bw: 33, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    bdim: '279.8x181.65x7.5mm', wt: 610, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '入门', '大屏', '长续航'],
  },
  {
    // 官方卖点：9000mAh 超长续航
    // 2026-10-15 补（mi.com/sg/product/redmi-pad-2/specs 官方规格页 + 京东自营「小米移动京东自营旗舰店」规格参数区，
    // 两处口径一致）：联发科 Helio G100-Ultra 6nm、后置 8MP 1/4" f/2.0、前置 5MP f/2.2、11" 2560x1600 274ppi、510g
    i: 'redmi-pad-2', n: 'REDMI Pad 2', d: '2025-08-01', lp: 1399, cp: null,
    sz: 11, res: '2560x1600', ppi: 274, mat: 'LCD', rr: 90,
    soc: 'Helio G100 Ultra', sb: '联发科', pr: '6nm', // ram / rom 未查到
    cm: '800万像素 f/2.0', fc: '500万像素',
    bc: 9000, bw: null, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    bdim: '254.58x166.04x7.36mm', wt: 510, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '入门', '长续航'],
  },
  {
    i: 'redmi-pad-pro', n: 'Redmi Pad Pro', d: '2024-04-10', lp: 1599, cp: null,
    sz: 12.1, res: '2560x1600', ppi: 249, mat: 'LCD', rr: 120,
    soc: '骁龙7s Gen2', sb: '高通', pr: '4nm', ram: [6, 8], rom: [128, 256],
    cm: '800万像素', fc: '800万像素',
    bc: 10000, bw: 33, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 570, bm: null, ip: null, bio: null, spk: '4 扬声器（杜比全景声）', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'Redmi 灵感触控笔', bundled: false },
      keyboard: { supported: true, name: 'Redmi 键盘保护套', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '入门', '大屏'],
  },
  {
    // lp 未查到（2024-08 发布）
    i: 'redmi-pad-se-87', n: 'REDMI Pad SE 8.7', d: '2024-08', lp: null, cp: null,
    sz: 8.7, res: '1340x800', ppi: null, mat: 'LCD', rr: 90,
    soc: 'Helio G85', sb: '联发科', ram: [4, 6], rom: [64, 128],
    cm: '800万像素', fc: '500万像素',
    bc: 6650, bw: 18, bwl: 0,
    os: null, ui: 'HyperOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 373, bm: null, ip: null, bio: null, spk: '2 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 2, microSd: null,
    },
    tags: ['平板', '入门', '小屏', '长续航'],
  },
];

export const XIAOMI_TABLETS = cTablet('小米', XIAOMI_SEEDS);
export const REDMI_TABLETS = cTablet('Redmi', REDMI_SEEDS);
