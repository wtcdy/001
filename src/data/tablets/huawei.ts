import { cTablet, type CompactSeed } from './_factory';

/**
 * 华为平板（MatePad）机型。
 *
 * 数据来源：`research/tablets.md` B 段。本批先接入 3 款验证管线，
 * 其中 **MatePad Edge X90 是全库唯一 `ff: 'detachable'`**（带可拆卸键盘、平板/电脑双模式）。
 * 第二批追加 14 款（来源 `research/tablets-batch2.md` §3），全库共 17 款。
 */
const SEEDS: CompactSeed[] = [
  {
    i: 'huawei-matepad-pro-12-2026',
    n: '华为 MatePad Pro 12（2026）',
    d: '2026-08',
    lp: 5999,
    cp: 5699,
    sz: 12,
    res: '3036x1952',
    mat: '柔性 OLED',
    rr: 144,
    nit: 1600,
    hdr: 'HDR Vivid',
    soc: '麒麟 T93（标准版）/ 麒麟 T93A（悦享版）',
    sb: '海思',
    ram: [12],
    rom: [256, 512],
    cm: '5000万像素 f/1.8 AF',
    cv: '1080p',
    fc: '1200万像素 f/2.4',
    bc: 10400,
    bw: 66,
    bwl: 0,
    br: '40W有线反充',
    os: 'HarmonyOS 6.1',
    ui: 'HarmonyOS',
    net: 'Wi-Fi',
    wf: 'Wi-Fi 7+',
    bt: '6.0',
    nfc: false,
    ir: false,
    bdim: '264.2x172.9x4.7mm',
    wt: 439,
    bm: '金属一体成型',
    bio: '指纹识别',
    spk: '4 扬声器（HUAWEI Sound）',
    port: 'USB-C',
    col: '浮白,凝蓝,樱花粉,深空灰,明月银',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil（第三代，星闪低延迟）', bundled: false },
      keyboard: { supported: true, name: '华为智能磁吸键盘（星闪版）', attach: 'magnetic', bundled: false },
      desktopMode: null,
      speakerCount: 4,
      microSd: false,
    },
    tags: ['平板', '旗舰', '轻薄', '生产力'],
  },
  {
    i: 'huawei-matepad-pro-122-2025',
    n: '华为 MatePad Pro 12.2（2025）',
    d: '2025-05',
    lp: 3999,
    cp: 3999,
    sz: 12.2,
    res: '2800x1840',
    ppi: 275,
    mat: '双层串联 OLED（Tandem OLED）+ PaperMatte 防眩',
    rr: 144,
    nit: 2000,
    hdr: 'HDR Vivid',
    soc: '麒麟 T92A',
    sb: '海思',
    cpu: '八核 2.62GHz',
    ram: [12, 16],
    rom: [256, 512, 1024],
    cm: '5000万像素 f/1.8',
    cw: '800万像素超广角 f/2.2',
    cv: '4K',
    fc: '800万像素 f/2.0',
    bc: 10100,
    bw: 100,
    bwl: 0,
    br: '支持有线反充',
    os: 'HarmonyOS 5.0',
    ui: 'HarmonyOS',
    net: 'Wi-Fi',
    wf: 'Wi-Fi 7',
    bt: '5.2',
    nfc: false,
    ir: false,
    bdim: '282.5x182.5x5.5mm',
    wt: 508,
    bm: '铝合金一体机身',
    bio: '指纹识别',
    spk: '4 扬声器（8 驱阵列）',
    port: 'USB-C 3.1',
    col: '黑,绿',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil（第三代，星闪）', bundled: false },
      keyboard: { supported: true, name: 'Glide 键盘', attach: null, bundled: false },
      desktopMode: null,
      speakerCount: 4,
      microSd: false,
    },
    tags: ['平板', '旗舰', '大屏', '生产力'],
  },
  {
    i: 'huawei-matepad-edge-x90',
    n: '华为 MatePad Edge X90',
    d: '2025-11',
    lp: 5999,
    cp: 5799,
    // 全库唯一二合一，显式覆盖 cTablet 默认的 ff:'slate'
    ff: 'detachable',
    sz: 14.2,
    res: '3120x2080',
    ppi: 264,
    mat: 'OLED',
    rr: 120,
    nit: 1000,
    sr: '94%',
    soc: '麒麟 X90 / X90A',
    sb: '海思',
    ram: [16, 24, 32],
    rom: [256, 512, 1024, 2048],
    cm: '5000万像素',
    cw: '800万像素',
    fc: '3200万像素',
    bc: 12900,
    bw: 140,
    bwl: 0,
    os: 'HarmonyOS 5.1',
    ui: 'HarmonyOS',
    net: 'Wi-Fi',
    nfc: false,
    ir: false,
    bdim: '312.08x212.02x6.85mm',
    wt: 789,
    port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil Pro', bundled: false },
      keyboard: { supported: true, name: '华为星跃悬浮键盘（液冷版随附）', attach: 'magnetic', bundled: false },
      desktopMode: '平板 / 电脑双模式（HarmonyOS）',
      speakerCount: null,
      microSd: null,
    },
    tags: ['平板', '二合一', '生产力', '大屏'],
  },
  {
    // ⚠️ d 只有年份、lp 未查到
    // 2026-10-15 补（华为商城官方商详页「主要参数」，型号 GEM-W40 悦享款 / GEM-W00）：
    // CPU 麒麟 T93（悦享款）/ 麒麟 T93 Pro（标准版）；电池 10400mAh（典型值，双电池等效 3.83V / 39.84Wh）
    // 来源：https://www.vmall.com/product/comdetail/index.html?prdId=10086127502687
    //      https://www.vmall.com/product/comdetail/index.html?prdId=10086722719405
    i: 'huawei-matepad-pro-max-2026', n: '华为 MatePad Pro Max（13.2，2026 款）', d: '2026', lp: null, cp: 5699,
    sz: 13.2, res: '3000x2000', ppi: 273, mat: '柔性 OLED PaperMatte 云晰柔光屏', rr: 144, hdr: 'HDR Vivid',
    soc: '麒麟 T93 / 麒麟 T93 Pro', sb: '海思', ram: [12], rom: [512],
    cm: '5000万像素 f/1.8', fc: '1200万像素 f/2.4',
    bc: 10400, bwl: 0,
    os: 'HarmonyOS 4.3', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 509, spk: '6 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil Pro', bundled: false },
      keyboard: { supported: true, name: 'HUAWEI 星跃键盘', attach: null, bundled: false },
      desktopMode: null, speakerCount: 6, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '生产力'],
  },
  {
    i: 'huawei-matepad-pro-132-2025', n: '华为 MatePad Pro 13.2（2025 款）', d: '2024-11', lp: 5199, cp: 5299,
    sz: 13.2, res: '2880x1920', ppi: 262, mat: 'OLED', rr: 144, nit: 1000, hdr: 'HDR',
    soc: '麒麟', sb: '海思', cpu: '八核', ram: [12, 16], rom: [256, 512, 1024],
    cm: '5000万像素 f/1.8', cw: '800万像素超广角 f/2.2', fc: '1600万像素广角 f/2.2',
    bc: 10100, bw: 88, bwl: 0,
    os: 'HarmonyOS 4.3', ui: 'HarmonyOS', net: 'Wi-Fi', bt: '5.2', nfc: false, ir: false,
    bdim: '289.1x196.1x5.5mm', wt: 580, spk: '4 扬声器', port: 'USB-C 3.1', col: '黑,白,金',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil（第三代）', bundled: false },
      keyboard: { supported: true, name: '华为智能磁吸键盘', attach: 'magnetic', bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏', '生产力'],
  },
  {
    i: 'huawei-matepad-pro-132-2023', n: '华为 MatePad Pro 13.2（2023 款）', d: '2023-09', lp: 5199, cp: null,
    sz: 13.2, res: '2880x1920', ppi: 262, mat: 'OLED', rr: 144, hdr: 'HDR Vivid',
    soc: '麒麟 9000s', sb: '海思', ram: [12, 16], rom: [256, 512, 1024],
    cm: '5000万像素', cw: '800万像素超广角', fc: '1600万像素',
    bc: 10100, bw: 88, bwl: 0,
    os: 'HarmonyOS 4', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 580, spk: '6 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil（第三代）', bundled: false },
      keyboard: { supported: true, name: '华为智能磁吸键盘', attach: 'magnetic', bundled: false },
      desktopMode: null, speakerCount: 6, microSd: null,
    },
    tags: ['平板', '旗舰', '大屏'],
  },
  {
    // ⚠️ 只缺 lp（首发价未查到）
    // 2026-10-15 核：首发价 12GB+256GB 4299（新华社/中国日报发布会报道）；cp 留空——华为官网现售
    // MatePad Pro 12 英寸 / Pro Max，11 英寸 2024 款官网已下架，渠道仅第三方店报价不采信
    i: 'huawei-matepad-pro-11-2024', n: '华为 MatePad Pro 11（2024）', d: '2024-05', lp: 4299, cp: null,
    sz: 11, res: '2560x1600', mat: 'OLED', rr: 144, hdr: 'HDR Vivid',
    soc: '麒麟', sb: '海思', ram: [8, 12], rom: [128, 256, 512],
    cm: '1300万像素', cw: '800万像素超广角', fc: '1600万像素',
    bc: 8300, bw: 66, bwl: 0,
    os: 'HarmonyOS 4', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 449, spk: '4 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil（第三代）', bundled: false },
      keyboard: { supported: true, name: '华为智能磁吸键盘', attach: 'magnetic', bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '旗舰', '轻薄', '生产力'],
  },
  {
    // ⚠️ d 只有年份、soc / lp 未查到
    i: 'huawei-matepad-air-12-2025', n: '华为 MatePad Air 12（2025 第二代）', d: '2025', lp: null, cp: null,
    sz: 12, res: '2800x1840', mat: 'LCD', rr: 144,
    soc: null, ram: [12], rom: [256, 512],
    cm: '5000万像素 f/1.8', fc: '800万像素 f/2.2',
    bc: 10100, bw: 66, bwl: 0,
    os: 'HarmonyOS 5.0', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 555, spk: '6 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil（第三代）', bundled: false },
      keyboard: { supported: true, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 6, microSd: null,
    },
    tags: ['平板', '主流', '大屏'],
  },
  {
    // ⚠️ d 只有年份、lp 未查到（华为商城 3999 与太平洋 5299 冲突，两个都没取作 lp）
    i: 'huawei-matepad-air-12-3rd', n: '华为 MatePad Air 12（第三代，鸿蒙焕新版）', d: '2026', lp: null, cp: 3999,
    sz: 12, res: '2800x1840', mat: 'OLED', rr: 144,
    soc: '麒麟 T93B', sb: '海思', ram: [8, 12], rom: [256, 512],
    cm: '5000万像素 f/1.8', fc: '1200万像素 f/2.4',
    bc: 10100, bw: 66, bwl: 0,
    os: 'HarmonyOS 6.1', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 509, spk: '4 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil', bundled: false },
      keyboard: { supported: true, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '主流', '大屏'],
  },
  {
    // ⚠️ d 只有年份
    // 2026-10-15 补（华为商城官方商详页「主要参数」，型号 SLG-W50 灵动款 / SLG-W10 柔光版）：
    // 灵动款 麒麟 T92C、柔光版 麒麟 T92B；电池 8800mAh（典型值，额定 8700mAh）
    // 来源：https://www.vmall.com/product/comdetail/index.html?prdId=10086518319242
    i: 'huawei-matepad-115s-2025', n: '华为 MatePad 11.5 S（2025）', d: '2025', lp: 2199, cp: null,
    sz: 11.5, res: '2800x1840', ppi: 291, mat: 'LCD', rr: 144,
    soc: '麒麟 T92B（柔光版）/ 麒麟 T92C（灵动款）', sb: '海思', ram: [12], rom: [256, 512],
    cm: '1300万像素 f/1.8 AF', cw: '800万像素 f/2.0',
    bc: 8800, bwl: 0,
    os: 'HarmonyOS 4.3', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 515, spk: '4 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil Pro', bundled: false },
      keyboard: { supported: true, name: 'HUAWEI 智能磁吸键盘', attach: 'magnetic', bundled: false },
      desktopMode: null, speakerCount: 4, microSd: null,
    },
    tags: ['平板', '主流', '学习'],
  },
  {
    // 2026-10-15 补（华为商城官方商详页「主要参数」，型号 SLG-W50，2026-06 上市）：
    // 麒麟 T92C / 8800mAh（典型值）/ 后置 1300 万 f1.8 AF / 前置 800 万 f2.0 / 515g
    // 来源：https://www.vmall.com/product/comdetail/index.html?prdId=10086693978514
    // 摄像头口径参照同型号华为海外官网规格页（后置 13MP f/1.8 AF、前置 8MP f/2.0）
    i: 'huawei-matepad-115s-lingdong', n: '华为 MatePad 11.5 S 灵动款（鸿蒙焕新版，2026）', d: '2026', lp: null, cp: 2999,
    sz: 11.5, res: '2800x1840', ppi: 291, mat: 'LCD', rr: 144,
    soc: '麒麟 T92C', sb: '海思', ram: [8, 12], rom: [256, 512],
    cm: '1300万像素 f/1.8 AF', fc: '800万像素',
    bc: 8800, bwl: 0,
    os: 'HarmonyOS 6.0', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 515, spk: '4 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil', bundled: false },
      keyboard: { supported: true, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '主流', '学习'],
  },
  {
    // 2026-10-15 补（华为中国官网规格参数页）：标准版 麒麟 T82B、柔光版 麒麟 T82；
    // 后置 1300 万 f/1.8 AF、前置 800 万 f/2.0；11.5" 2456x1600 256ppi 120Hz；电池 10100mAh
    // 来源：https://consumer.huawei.com/cn/tablets/matepad-11-5-2026/specs
    i: 'huawei-matepad-115-2026', n: '华为 MatePad 11.5（鸿蒙焕新版，2026）', d: '2026', lp: null, cp: 2199,
    sz: 11.5, res: '2456x1600', ppi: 256, mat: 'LCD', rr: 120,
    soc: '麒麟 T82B（标准版）/ 麒麟 T82（柔光版）', sb: '海思', ram: [8, 12], rom: [128, 256],
    cm: '1300万像素 f/1.8', fc: '800万像素',
    bc: 10100, bwl: 0,
    os: 'HarmonyOS 5.1', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 515, spk: null, port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '入门', '长续航'],
  },
  {
    // 2026-10-15 补（华为商城官方商详页「主要参数」，型号 AST-W30 悦享款，2026-09 上市）：
    // 麒麟 T93SD / 10100mAh（典型值）/ 后置 5000 万 f1.8 AF / 前置 800 万 f2.2 / 12" 2800x1840 280ppi 144Hz / 555g
    // 口径冲突：vmall 商详标「悦享款 = T93SD」，华为官网规格对比页标「Air Z = T93SD、悦享款 = T93S」。
    // 按来源优先级取官网规格页口径（本条是 Air Z 本体，非悦享款）→ 麒麟 T93SD。若日后官网更新以官网为准。
    // 来源：https://www.vmall.com/product/comdetail/index.html?prdId=10086966141469
    //      https://consumer.huawei.com/cn/support/content/zh-cn16118536/
    i: 'huawei-matepad-air-z', n: '华为 MatePad Air Z（12 英寸，2026）', d: '2026', lp: null, cp: 2799,
    sz: 12, res: '2800x1840', ppi: 280, mat: 'LCD', rr: 144,
    soc: '麒麟 T93SD', sb: '海思', ram: [8, 12], rom: [128, 256],
    cm: '5000万像素 f/1.8 AF', fc: '800万像素',
    bc: 10100, bwl: 0,
    os: 'HarmonyOS 7.0', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 555, spk: '6 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '主流', '学习'],
  },
  {
    // 2026-10-15 补（华为商城官方商详页「主要参数」，型号 AGS6-W00）：
    // ⚠️ 本款是高通平台，不是麒麟——CPU 高通骁龙 685 八核（4×A73@2.8GHz + 4×A53@1.9GHz，Adreno 610）
    // 电池 7700mAh（典型值）/ 后置 800 万 f2.0 AF / 前置 500 万 f2.2 / 11" 1920x1200 207ppi / 475g
    // 来源：https://www.vmall.com/product/comdetail/index.html?prdId=10086426290126
    i: 'huawei-matepad-se-11', n: '华为 MatePad SE 11（焕新版）', d: '2025', lp: null, cp: 1799,
    sz: 11, res: '1920x1200', ppi: 207, mat: 'TFT LCD（IPS）', rr: 90,
    soc: '骁龙685', sb: '高通', cpu: '八核 2.8GHz', gpu: 'Adreno 610', ram: [8], rom: [256],
    cm: '800万像素 f/2.0', fc: '500万像素',
    bc: 7700, bwl: 0,
    os: 'HarmonyOS 4.2', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    wt: 475, bm: '全金属一体机身', spk: null, port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: false, name: null, bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: null, microSd: null,
    },
    tags: ['平板', '入门'],
  },
  {
    // 华为唯一支持插卡通话 + 北斗卫星消息的平板
    // 2026-10-15 补（华为商城官方商详页「主要参数」麒麟 9010B + 华为海外官网规格页 Kirin 9010B）：
    // 电池 6400mAh（典型值，额定 6350mAh）
    // 来源：https://item.vmall.com/product/comdetail/index.html?cid=353007&prdId=10086287244006
    //      https://consumer.huawei.com/za/tablets/matepad-mini/specs/
    i: 'huawei-matepad-mini', n: '华为 MatePad Mini（8.8，2025）', d: '2025-09', lp: 3299, cp: 3799,
    sz: 8.8, res: '2560x1600', ppi: 343, mat: '柔性 OLED（PaperMatte 云晰柔光屏）', rr: 120,
    soc: '麒麟 9010B', sb: '海思', cpu: '六核', ram: [12], rom: [256, 512],
    cm: '5000万像素 f/1.8', cw: '800万像素广角 f/2.2', fc: '3200万像素 f/2.4',
    bc: 6400, bwl: 0,
    os: 'HarmonyOS 4.3', ui: 'HarmonyOS', net: 'Wi-Fi + 全网通（可插卡通话）', nfc: false, ir: false, sat: '北斗卫星消息',
    wt: 255, spk: '2 扬声器', port: 'USB-C',
    tb: {
      cellular: true,
      stylus: { supported: true, name: 'HUAWEI M-Pencil Pro', bundled: false },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 2, microSd: null,
    },
    tags: ['平板', '小屏', '轻薄', '长续航'],
  },
  {
    // ⚠️ lp 未查到；墨水屏特殊品类，无前后摄像头（cm / fc 为 null）
    // 2026-10-15 说明：MatePad Paper 是 E-Ink 阅读器，华为官网规格页无摄像头条目，整机不带摄像头，
    //    属「官网确实不公布」的平板特例，cm 保持 null 而非补 0（见任务 2 的平板特例口径）
    i: 'huawei-matepad-paper', n: '华为 MatePad Paper（10.3 墨水屏）', d: '2022-08', lp: null, cp: 4298,
    sz: 10.3, res: '1872x1404', ppi: 227, mat: '墨水屏（E-Ink）',
    soc: '麒麟 820E', sb: '海思', cpu: '2.4GHz', ram: [6], rom: [128],
    cm: null, fc: null,
    bc: 4000, bwl: 0,
    os: 'HarmonyOS', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    bdim: '225.2x182.7x6.65mm', wt: 360, spk: '2 扬声器', port: 'USB-C', col: '锦白,墨黑',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil（第二代，4096 级压感）', bundled: true },
      keyboard: { supported: false, name: null, attach: null, bundled: false },
      desktopMode: null, speakerCount: 2, microSd: null,
    },
    tags: ['平板', '墨水屏', '阅读'],
  },
  {
    // ⚠️ d 只有年份、lp 未查到
    // 2026-10-15 补（华为官网规格参数页）：Kirin T92B 八核 / 电池 10100mAh（典型值，额定 10000mAh，66W）
    // 来源：https://consumer.huawei.com/hk/tablets/matepad-12-x-2025/specs/
    //      https://consumer.huawei.com/sa-en/tablets/matepad-12-x-2025/specs/
    // ⚠️ 同页更正两处旧值：屏幕为 12 英寸（原录 12.2）；重量约 555g（原录 512g）；
    //    800 万 f/2.2 是前置单摄、本款无后置副摄，故 cw 撤下改记 fc
    i: 'huawei-matepad-12x', n: '华为 MatePad 12 X（2025）', d: '2025', lp: null, cp: null,
    sz: 12, res: '2800x1840', ppi: 280, mat: 'HUAWEI PaperMatte 屏（IPS）', rr: 144,
    soc: '麒麟 T92B', sb: '海思', cpu: '八核', ram: [12], rom: [256],
    cm: '5000万像素 f/1.8 AF', fc: '800万像素 f/2.2',
    bc: 10100, bw: 66, bwl: 0,
    os: 'HarmonyOS 4.3', ui: 'HarmonyOS', net: 'Wi-Fi', nfc: false, ir: false,
    bdim: '270x183x5.9mm', wt: 555, spk: '6 扬声器', port: 'USB-C',
    tb: {
      cellular: false,
      stylus: { supported: true, name: 'HUAWEI M-Pencil Pro', bundled: false },
      keyboard: { supported: true, name: 'HUAWEI 智能磁吸键盘', attach: 'magnetic', bundled: false },
      desktopMode: null, speakerCount: 6, microSd: null,
    },
    tags: ['平板', '主流', '大屏'],
  },
];

export const HUAWEI_TABLETS = cTablet('华为', SEEDS);
