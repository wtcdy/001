import { c, type CompactSeed } from './_factory';

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
];

export const VIVO_TABLETS = c('vivo', SEEDS);
