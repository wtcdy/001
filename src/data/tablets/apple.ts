import { c, type CompactSeed } from './_factory';

/**
 * Apple 平板（iPad）机型。
 *
 * 数据来源：`research/tablets.md` A 段（#1~#18）。本批先接入 1 款验证管线。
 *
 * ⚠️ 口径提示：苹果官方**只公布 Wh，不公布 mAh**（iPad Pro 13 M5 官方 38.99Wh）。
 * 因此 Apple 全系 `bc`（mAh）一律 `null`，官方 Wh 填 `bwh`（→ `battery.batteryWh`）。
 * **严禁 Wh → mAh 换算**：此前这里填的 10290mAh 是第三方折算值（另有 10210 / 10340 两种口径），
 * 已按 team-lead 2026-10-14 拍板清除。Wh 值来源见 `research/apple-battery-wh.md`。
 *
 * ⚠️ 已知连锁反应：`scripts/_qa-validate.mjs` 把 `battery.capacity` 列为硬必填，
 * `bc: null` 会触发必填告警（属于校验规则与「苹果只公布 Wh」的事实冲突，已上报待拍板）。
 */
const SEEDS: CompactSeed[] = [
  {
    i: 'ipad-pro-m5-13',
    n: 'iPad Pro 13（M5）',
    d: '2025-10',
    lp: 10799,
    cp: 10799,
    cat: 'tablet',
    ff: 'slate',
    sz: 13,
    res: '2752x2064',
    ppi: 264,
    mat: 'Ultra Retina XDR（Tandem OLED）',
    rr: 120,
    nit: 1000,
    hdr: '杜比视界 / HDR10 / HDR10+',
    soc: 'Apple M5',
    sb: 'Apple',
    pr: '3nm',
    ram: [12, 16],
    rom: [256, 512, 1024, 2048],
    cm: '1200万像素广角',
    cv: '4K ProRes',
    fc: '1200万像素 Center Stage（横向）',
    // 苹果官方只公布 Wh（38.99 瓦时），不公布 mAh；bc 与 bwh 不得同时有值
    bc: null,
    bwh: 38.99,
    bw: 60,
    bwl: 0,
    os: 'iPadOS 26',
    ui: 'iPadOS',
    net: 'Wi-Fi / Wi-Fi+5G',
    wf: 'Wi-Fi 7',
    bt: '6.0',
    nfc: false,
    ir: false,
    wt: 579,
    bm: '铝金属',
    bio: '面容 ID（原深感）',
    spk: '4 扬声器',
    port: 'USB-C（雷雳 / USB4）',
    tb: {
      cellular: true,
      stylus: { supported: true, name: 'Apple Pencil Pro / Apple Pencil (USB-C)', bundled: false },
      keyboard: { supported: true, name: '妙控键盘', attach: 'magnetic', bundled: false },
      desktopMode: null,
      speakerCount: 4,
      microSd: false,
    },
    tags: ['平板', '旗舰', '大屏', '生产力'],
  },
];

export const APPLE_TABLETS = c('Apple', SEEDS);
