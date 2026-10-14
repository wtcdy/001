import { c, type CompactSeed } from './_factory';

/**
 * OPPO / 一加 平板机型。
 *
 * 数据来源：`research/tablets.md` E 段。一加与 OPPO 同属一个文件（沿用 `phones/` 的品牌命名），
 * 但 `brand` 分别取 `OPPO` / `一加`。
 */
const OPPO_SEEDS: CompactSeed[] = [
  {
    i: 'oppo-pad-4-pro',
    n: 'OPPO Pad 4 Pro',
    d: '2025-04',
    lp: 3199,
    cp: 3599,
    cat: 'tablet',
    ff: 'slate',
    sz: 13.2,
    res: '3392x2400',
    ppi: 315,
    mat: 'LCD',
    rr: 144,
    nit: 900,
    dim: '全亮度DC调光',
    hdr: 'Dolby Vision',
    soc: '骁龙8至尊版',
    sb: '高通',
    pr: '3nm',
    ft: 'UFS 4.0',
    ram: [8, 12, 16],
    rom: [256, 512],
    cm: '1300万像素',
    fc: '800万像素',
    bc: 12140,
    bw: 67,
    bwl: 0,
    os: 'Android 15',
    ui: 'ColorOS',
    net: 'Wi-Fi',
    nfc: false,
    ir: false,
    bdim: '289.61x209.66x5.97mm',
    wt: 675,
    spk: '8 扬声器（HiFi 级）',
    port: 'USB-C 3.2',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'OPPO Pencil 2', bundled: false },
      keyboard: { supported: true, name: 'OPPO 官方磁吸键盘', attach: 'magnetic', bundled: false },
      desktopMode: null,
      speakerCount: 8,
      microSd: false,
    },
    tags: ['平板', '旗舰', '大屏', '长续航', '生产力'],
  },
];

const ONEPLUS_SEEDS: CompactSeed[] = [
  {
    i: 'oneplus-pad-pro',
    n: '一加平板 Pro',
    d: '2024-06',
    lp: 2799,
    cat: 'tablet',
    ff: 'slate',
    sz: 12.1,
    res: '3000x2120',
    ppi: 303,
    mat: 'LCD',
    rr: 144,
    nit: 900,
    soc: '骁龙8 Gen3',
    sb: '高通',
    pr: '4nm',
    ram: [8, 12, 16],
    rom: [256, 512],
    cm: '1300万像素',
    fc: '800万像素',
    bc: 9510,
    bw: 67,
    bwl: 0,
    os: 'Android 14',
    ui: 'ColorOS',
    net: 'Wi-Fi',
    nfc: false,
    ir: false,
    wt: 584,
    spk: '6 扬声器（环绕式）',
    port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: '一加手写笔', bundled: false },
      keyboard: { supported: true, name: '一加官方磁吸键盘', attach: 'magnetic', bundled: false },
      desktopMode: null,
      speakerCount: 6,
      microSd: false,
    },
    tags: ['平板', '旗舰', '大屏', '生产力'],
  },
];

export const OPPO_TABLETS = c('OPPO', OPPO_SEEDS);
export const ONEPLUS_TABLETS = c('一加', ONEPLUS_SEEDS);
