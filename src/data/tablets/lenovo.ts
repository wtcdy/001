import { c, type CompactSeed } from './_factory';

/**
 * 联想平板（拯救者 Y700 / 小新 Pad）机型。
 *
 * 数据来源：`research/tablets.md` H 段。
 */
const SEEDS: CompactSeed[] = [
  {
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
];

export const LENOVO_TABLETS = c('联想', SEEDS);
