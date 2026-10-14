import { cTablet, type CompactSeed } from './_factory';

/**
 * vivo 平板机型。
 *
 * 数据来源：`research/tablets.md` F 段。
 */
const SEEDS: CompactSeed[] = [
  {
    i: 'vivo-pad5-pro',
    n: 'vivo Pad5 Pro',
    d: '2025-04',
    lp: 2999,
    cat: 'tablet',
    ff: 'slate',
    sz: 13,
    res: '3096x2064',
    mat: 'LCD',
    rr: 144,
    soc: '天玑9400',
    sb: '联发科',
    pr: '3nm',
    ram: [8, 12, 16],
    rom: [256, 512],
    cm: '1300万像素',
    fc: '800万像素',
    bc: 12050,
    bw: 66,
    bwl: 0,
    os: 'Android 15',
    ui: 'OriginOS 5',
    net: 'Wi-Fi',
    nfc: false,
    ir: false,
    wt: 635,
    spk: '8 扬声器',
    port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'vivo Pencil 3', bundled: false },
      keyboard: { supported: true, name: 'vivo 智能触控键盘', attach: 'pogo', bundled: false },
      desktopMode: null,
      speakerCount: 8,
      microSd: false,
    },
    tags: ['平板', '旗舰', '大屏', '长续航', '生产力'],
  },
  {
    // 上市 2026-03-30。⚠️ 官方只写「13.2 英寸 4K 原彩屏」，未确认面板类型 → mat 留 null；os（Android 版本）未查到 → null
    // 柔光版另行存在，但按架构师口径「柔光版不拆机型」，本条为标准版
    i: 'vivo-pad6-pro', n: 'vivo Pad6 Pro', d: '2026-03', lp: 4499, cp: 4499,
    sz: 13.2, res: '4K', ppi: null, mat: null, rr: 144, nit: null, hdr: '杜比视界',
    soc: '第五代骁龙8至尊版', sb: '高通', pr: '3nm', rt: 'LPDDR5X', ft: 'UFS 4.1',
    ram: [8], rom: [256],
    cm: null, fc: null,
    bc: 13000, bw: 66, bwl: 0,
    os: null, ui: 'OriginOS 6 平板定制系统', net: 'Wi-Fi', wf: 'Wi-Fi 7', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'vivo Pencil 3', bundled: false },
      keyboard: { supported: true, name: 'vivo 智能键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '生产力'],
  },
  {
    // ⚠️ lp 冲突不采：首轮调研（gizmochina）记「1599 元起」，京东 / ZOL / 太平洋记 6+128 = 999，差 600 元
    // 柔光版 569g（标准版 559g），按架构师口径不拆
    i: 'vivo-pad-se', n: 'vivo Pad SE', d: '2025', lp: null, cp: 999,
    sz: 12.3, res: '2464x1600', ppi: null, mat: 'LCD', rr: null,
    soc: '骁龙4 Gen2', sb: '高通', ram: [6, 8], rom: [128, 256],
    cm: '5000万像素', fc: '500万像素',
    bc: 8500, bw: null, bwl: 0,
    os: null, ui: 'OriginOS 5 HD', net: 'Wi-Fi', wf: 'Wi-Fi 5', nfc: false, ir: false,
    wt: 559, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '入门'],
  },
  {
    // lp 未查到（2024-03 发布）
    i: 'vivo-pad3-pro', n: 'vivo Pad3 Pro', d: '2024-03', lp: null, cp: null,
    sz: 13, res: '3096x2064', ppi: null, mat: 'LCD', rr: 144,
    soc: '天玑9300', sb: '联发科', pr: '4nm', ram: [8, 12, 16], rom: [256, 512],
    cm: '1300万像素', fc: '800万像素',
    bc: 11500, bw: 66, bwl: 0,
    os: 'Android 14', ui: 'OriginOS 4', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 678, bm: null, ip: null, bio: null, spk: '8 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'vivo Pencil 2', bundled: false },
      keyboard: { supported: true, name: '智能触控键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 8, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '长续航'],
  },
  {
    // soc / nit 本轮新补（太平洋产品库）。⚠️ lp：ZOL / 太平洋均报 2499，但是渠道在售价，不是确认的首发价 → null
    i: 'vivo-pad3', n: 'vivo Pad3', d: '2024-06', lp: null, cp: null,
    sz: 12.1, res: '2800x1968', ppi: null, mat: 'LCD', rr: 144, nit: 600,
    soc: '骁龙8s Gen3', sb: '高通', ram: [8, 12], rom: [128, 256],
    cm: null, fc: null,
    bc: 10000, bw: 44, bwl: 0,
    os: 'Android 14', ui: 'OriginOS 4', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 589, bm: null, ip: null, bio: null, spk: '6 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'vivo Pencil', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 6, microSd: null,
    },
    tags: ['平板', '主流'],
  },
  {
    // lp 未查到（2023-08 发布）
    i: 'vivo-pad-air', n: 'vivo Pad Air', d: '2023-08', lp: null, cp: null,
    sz: 11.5, res: '2800x1840', ppi: null, mat: 'LCD', rr: 144,
    soc: '骁龙870', sb: '高通', pr: '7nm', ram: [8, 12], rom: [128, 256, 512],
    cm: '1300万像素', fc: '500万像素',
    bc: 8500, bw: 44, bwl: 0,
    os: 'Android 13', ui: 'OriginOS 3', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 530, bm: '一体化铝合金', ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'vivo Pencil', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '主流', '轻薄'],
  },
  {
    // lp 未查到（2023-04 发布）
    i: 'vivo-pad2', n: 'vivo Pad2', d: '2023-04', lp: null, cp: null,
    sz: 12.1, res: '2800x1968', ppi: null, mat: 'LCD', rr: 144,
    soc: '天玑9000', sb: '联发科', pr: '4nm', ram: [8, 12], rom: [128, 256, 512],
    cm: '1300万像素', fc: '800万像素',
    bc: 10000, bw: 44, bwl: 0,
    os: 'Android 13', ui: 'OriginOS 3', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 585, bm: null, ip: null, bio: null, spk: '4 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'vivo Pencil', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '主流', '大屏', '长续航'],
  },
];

export const VIVO_TABLETS = cTablet('vivo', SEEDS);
