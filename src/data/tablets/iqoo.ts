import { cTablet, type CompactSeed } from './_factory';

/**
 * iQOO 平板机型。
 *
 * 数据来源：`research/tablets-batch2.md` §8.2。
 *
 * 口径：品牌字符串 `'iQOO'`（Q 大写、两个 O）；全系国行无官方蜂窝版 → `tb.cellular: false`；
 * 全系不支持无线充电 → `bwl: 0`；安卓平板电池写 `bc`（mAh），`bwh` 不写。
 */
const SEEDS: CompactSeed[] = [
  {
    // 🔴 极稀疏：官方只放出「8.8 英寸 OLED + 9020mAh」，SoC / 分辨率 / 刷新率 / 充电 / 重量全部未查到
    // 2026-10-15 核：vivo 官网参数页「上市价格」12GB+256GB 6499；vivo 官方商城在售 6499
    i: 'iqoo-pad-ultra', n: 'iQOO Pad Ultra', d: '2026-09', lp: 6499, cp: 6499,
    sz: 8.8, res: null, ppi: null, mat: 'OLED', rr: null,
    // ram / rom 未查到：`CompactSeed` 的 `ram` / `rom` 不接受 null（缺即 `[]`），故整行省略而非写 null
    // 2026-10-15 补（vivo 官网参数页）：后置 1300 万像素，SoC 第六代骁龙 8 超级至尊版
    soc: '第六代骁龙8超级至尊版', sb: '高通',
    cm: '1300万像素', fc: '800万像素',
    bc: 9020, bw: null, bwl: 0,
    os: null, ui: 'OriginOS', net: 'Wi-Fi', nfc: false, ir: false,
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
    // 本批 vivo / iQOO 里唯一参数最全的一条（vivo 官方参数页是一手来源）
    // 原种子块曾因与手机侧历史错 id（`iqoo-pad5-pro` = iQOO 13 传奇典藏版）撞键而临时用 `-13` 后缀。
    // 手机侧已于 2026-10-14 改回 `iqoo-13-legend`，本条随之恢复标准 id `iqoo-pad5-pro`。
    i: 'iqoo-pad5-pro', n: 'iQOO Pad5 Pro', d: '2025-05-20', lp: 3199, cp: 3299,
    sz: 13, res: '3096x2064', ppi: null, mat: 'LCD', rr: 144, nit: 1200, hdr: 'HDR10',
    soc: '天玑9400+', sb: '联发科', pr: '3nm', cpu: '3.73GHz×1 + 3.3GHz×3 + 2.4GHz×4', gpu: '1.6GHz', an: 2750000,
    rt: 'LPDDR5X 四通道', ft: 'UFS 4.1', ram: [8, 12, 16], rom: [256, 512],
    cm: '1300万像素', cv: '4K', fc: '800万像素',
    bc: 12050, bw: 66, bwl: 0,
    os: 'Android 15', ui: 'OriginOS 5 平板定制系统', net: 'Wi-Fi', wf: 'Wi-Fi 7', bt: '5.4', nfc: false, ir: false,
    bdim: '289.56x198.32x6.07mm', wt: 635, bm: '金属机身', ip: null, bio: '面部识别/密码',
    spk: '8 扬声器（全景声 HDR 影院）', port: 'USB-C（USB 3.2 Gen1）', col: '曼岛,灰晶,银翼',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'iQOO Pencil 3', bundled: false },
      keyboard: { supported: true, name: '智能触控键盘 5 Pro', attach: null, bundled: false },
      desktopMode: null, speakerCount: 8, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '游戏', '长续航'],
  },
  {
    // 2026-10-15 核：vivo 官网参数页「上市价格」8GB+128GB 2499；官网状态「立即购买」在售
    // 2026-10-15 补（vivo 官网参数页）：SoC 天玑 9300+、后置 800 万像素、电池典型值 10000mAh
    i: 'iqoo-pad5', n: 'iQOO Pad5', d: '2025-05', lp: 2499, cp: 2499,
    sz: 13, res: null, ppi: null, mat: 'LCD', rr: 144,
    soc: '天玑9300+', sb: '联发科', ram: [8, 12], rom: [128, 256],
    cm: '800万像素', fc: '500万像素',
    bc: 10000, bw: null, bwl: 0,
    os: null, ui: 'OriginOS 5', net: 'Wi-Fi', nfc: false, ir: false,
    wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'iQOO Pencil', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '主流', '游戏'],
  },
  {
    // ✅ 日期修正：首轮调研只有年份 '2026'，本轮查到上市 2025-10-17（京东备案型号 iPA2537 / ZOL）
    // 屏幕 12.1" 2.8K 144Hz、第三代骁龙8s、10000mAh 均为本轮新补
    i: 'iqoo-pad5e', n: 'iQOO Pad5e', d: '2025-10', lp: 1999, cp: 2199,
    sz: 12.1, res: '2800x1968', ppi: null, mat: 'LCD', rr: 144,
    soc: '第三代骁龙8s', sb: '高通', cpu: '3.0GHz', gpu: 'Adreno 735',
    ram: [8], rom: [128, 256],
    cm: '800万像素', fc: '500万像素',
    bc: 10000, bw: null, bwl: 0,
    os: 'Android 15', ui: 'OriginOS 5', net: 'Wi-Fi', nfc: false, ir: false,
    bdim: '266.43x192x6.62mm', wt: null, bm: null, ip: null, bio: null, spk: null, port: 'USB-C', col: '曼岛,银翼',
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '入门', '游戏'],
  },
  {
    // lp 未查到（2023-05 发布）
    // 2026-10-15 核：vivo 官网参数页「上市价格」8GB+128GB 2599；官网状态「缺货」→ cp 留空
    i: 'iqoo-pad', n: 'iQOO Pad', d: '2023-05', lp: 2599, cp: null,
    sz: 12.1, res: '2800x1968', ppi: null, mat: 'LCD', rr: 144,
    soc: '天玑9000+', sb: '联发科', pr: '4nm', ram: [8, 12], rom: [128, 256, 512],
    cm: '1300万像素', fc: '800万像素',
    bc: 10000, bw: 44, bwl: 0,
    os: 'Android 13', ui: 'OriginOS 3', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 585, bm: null, ip: null, bio: null, spk: '6 扬声器', port: 'USB-C', col: null,
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'iQOO Pencil', bundled: false },
      keyboard: { supported: true, name: '官方键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 6, microSd: null,
    },
    tags: ['平板', '主流', '大屏', '长续航', '游戏'],
  },
];

export const IQOO_TABLETS = cTablet('iQOO', SEEDS);
