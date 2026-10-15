import { cTablet, type CompactSeed } from './_factory';

/**
 * 联想平板（拯救者 Y700 / 小新 Pad）机型。
 *
 * 数据来源：`research/tablets.md` H 段。
 */
const SEEDS: CompactSeed[] = [
  {
    // ⚠️ 命名坑：联想中国官网同时挂着两台不同机器
    //   「拯救者平板 Y700 **四代**」= 骁龙 8 至尊版（Snapdragon 8 Elite）← 本条
    //   「拯救者 Y700 **2025**」  = 骁龙 8 Gen3（见下方 `lenovo-legion-y700-2025`）
    // 二者 SoC / 分辨率 / 电池 / 重量 / 主摄全都不同，不是同一台的两种叫法。
    // 2026-10-15 新增（原本全库缺失；联想官方商城商品页 + 百度百科配置表 + GSMArena 三处口径一致）
    // 来源：https://m.lenovo.com.cn/wiki/product-1050505.html
    //      https://baike.baidu.com/item/拯救者Y700/59672899
    //      https://www.gsmarena.com/lenovo_legion_y700_(gen_4)-13993.php
    i: 'lenovo-legion-y700-gen4', n: '联想拯救者平板 Y700 四代', d: '2025-05', lp: 3299, cp: 3099,
    sz: 8.8, res: '3040x1904', ppi: 408, mat: 'LTPS LCD（TCL华星）', rr: 165, nit: 600,
    soc: '骁龙8至尊版', sb: '高通', pr: '3nm', cpu: '八核', ft: 'UFS 4.1',
    ram: [12, 16], rom: [256, 512, 1024],
    cm: '5000万像素', fc: '800万像素',
    bc: 7600, bw: 68, bwl: 0,
    os: 'Android 15', ui: 'ZUI', net: 'Wi-Fi', wf: 'Wi-Fi 7', nfc: false, ir: false,
    bdim: '207.6x128.5x7mm', wt: 340, bm: '金属一体机身', ip: null, bio: null,
    spk: '2 扬声器（JBL）', port: '双 USB-C', col: '碳晶黑,冰魄白',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'Lenovo Tab Pen Plus（第 3 代）', bundled: false },
      keyboard: { supported: true, name: 'G9 可拆卸磁吸游戏手柄', attach: 'magnetic', bundled: false },
      desktopMode: null,
      speakerCount: 2,
      microSd: true,
    },
    tags: ['平板', '小屏', '游戏', '高性能', '长续航'],
  },
  {
    // 联想官方 SKU 名就是「拯救者 Y700 2025」（骁龙 8 Gen3，2024-09-29 发布、10-25 开售），
    // 与上面的「四代 / 骁龙 8 至尊版」是两台机器，勿合并
    i: 'lenovo-legion-y700-2025',
    n: '联想拯救者 Y700（2025 款）',
    d: '2024-12',
    lp: 2899,
    cp: 2899,
    cat: 'tablet',
    ff: 'slate',
    sz: 8.8,
    res: '2560x1600',
    mat: 'LCD',
    rr: 165,
    soc: '骁龙8 Gen3',
    sb: '高通',
    pr: '4nm',
    cpu: '八核',
    ft: 'UFS 4.0',
    ram: [12, 16],
    rom: [256, 512],
    cm: '1300万像素',
    fc: '800万像素',
    bc: 6550,
    bw: 68,
    bwl: 0,
    os: 'Android 14',
    ui: 'ZUI 16.1',
    net: 'Wi-Fi',
    nfc: false,
    ir: false,
    bdim: '厚7.79mm',
    wt: 350,
    spk: '2 扬声器（杜比全景声）',
    port: '双 USB-C',
    col: '钛晶灰',
    tb: {
      cellular: false,
      stylus: { supported: false },
      keyboard: null,
      desktopMode: null,
      speakerCount: 2,
      microSd: null,
    },
    tags: ['平板', '小屏', '游戏', '长续航'],
  },
  {
    i: 'lenovo-legion-y700-2023', n: '联想拯救者 Y700（2023 款）', d: '2023', lp: 2299, cp: null,
    sz: 8.8, res: '2560x1600', ppi: null, mat: 'LCD', rr: 144,
    soc: '骁龙8+ Gen1', sb: '高通', pr: '4nm', cpu: '八核', ram: [12, 16], rom: [256, 512],
    // 2026-10-15 补（GSMArena 机型库 + 太平洋科技参数库，两处口径一致；联想官网该页已下架）：
    // 后置 1300 万主摄（+200 万微距）/ 前置 800 万
    // 来源：https://mobile.gsmarena.com/lenovo_legion_y700_(2023)-12476.php
    cm: '1300万像素', fc: '800万像素',
    bc: 6550, bw: null, bwl: 0,
    os: 'Android 13', ui: 'ZUI', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 348, bm: null, ip: null, bio: null, spk: '2 扬声器', port: '双 USB-C', col: '钛晶灰',
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 2, microSd: null,
    },
    tags: ['平板', '小屏', '游戏', '轻薄'],
  },
  {
    i: 'lenovo-xiaoxin-pad-pro-127', n: '联想小新 Pad Pro 12.7（2023）', d: '2023', lp: 1599, cp: 1499,
    sz: 12.7, res: '2944x1840', ppi: null, mat: 'LCD', rr: 120,
    soc: '骁龙870', sb: '高通', pr: '7nm', cpu: '八核', ram: [8], rom: [128, 256],
    // 2026-10-15 补（IT之家发布会规格报道，权威媒体；联想官网该页已下架）：
    // 前置 1300 万超广角、后置 800 万（注意与 2025 款前后相反）
    // 来源：https://www.ithome.com/0/709/032.htm
    cm: '800万像素', fc: '1300万像素',
    bc: 10200, bw: 20, bwl: 0,
    os: 'Android 13', ui: 'ZUI 15', net: 'Wi-Fi', wf: 'Wi-Fi 6', nfc: false, ir: false,
    wt: 620, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: '鸽子灰',
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小新触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '大屏', '长续航'],
  },
  {
    // 2024-10 上市，但官方命名为「2025 款」——id 与 name 都按官方命名走
    i: 'lenovo-xiaoxin-pad-pro-127-2025', n: '联想小新 Pad Pro 12.7（2025 款）', d: '2024-10', lp: 1599, cp: 1444,
    sz: 12.7, res: '2944x1840', ppi: null, mat: 'LCD', rr: 144,
    soc: '天玑8300', sb: '联发科', pr: '4nm', ram: [8, 12], rom: [128, 256],
    // 2026-10-15 补（联想官网商品文档页 + 京东自营规格参数区，两处口径一致）：
    // 前置 800 万、后置 1300 万（与 2023 款前后相反）
    // 来源：https://www.lenovo.com.cn/wiki/product-doc-32736.html
    cm: '1300万像素', fc: '800万像素',
    bc: 10200, bw: 45, bwl: 0,
    os: 'Android', ui: 'ZUI', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: '小新触控笔', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '大屏', '长续航'],
  },
  {
    // ⚠️ 2022 年机型，超出 3 年窗口，但首轮已收录，照录
    // 2026-10-15 补（联想中国官网商城商品页「规格参数」区，第一档官方来源）：
    // CPU 高通骁龙 750G 八核 / 前置 800 万 / 后置 1300 万 / 电池 7700mAh / 258.4x163x7.9mm / 约 520g
    // 来源：https://mitem.lenovo.com.cn/product/1017181.html
    i: 'lenovo-xiaoxin-pad-plus', n: '联想小新 Pad Plus（11 英寸）', d: '2022', lp: 1499, cp: null,
    sz: 11, res: '2000x1200', ppi: null, mat: 'TDDI LCD（莱茵TUV低蓝光认证）', rr: 60,
    soc: '骁龙750G', sb: '高通', cpu: '八核', ram: [6], rom: [128],
    cm: '1300万像素', fc: '800万像素',
    bc: 7700, bw: null, bwl: 0,
    os: 'Android 11', ui: 'ZUI 12.5', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 520, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '入门'],
  },
];

export const LENOVO_TABLETS = cTablet('联想', SEEDS);
