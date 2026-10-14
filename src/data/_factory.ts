import type {
  Device,
  DeviceBattery,
  DeviceBody,
  DeviceCamera,
  DeviceCategory,
  DevicePerformance,
  DeviceScreen,
  DeviceStorage,
  DeviceSystem,
  FormFactor,
  LaptopExtras,
  TabletExtras,
} from '../types/device';

/**
 * 设备数据的精简录入结构。
 *
 * 说明：设备数据条目较多，若每个字段都完整书写会导致数据文件极其冗长且容易出错，
 * 因此这里提供一个「带默认值的工厂函数」，各品牌文件只需填写自己掌握的关键字段，
 * 未填写的字段统一置为 null（前端渲染为「—」）。
 *
 * **品类默认值**：`category` 默认 `'phone'`、`formFactor` 默认 `'bar'`，
 * 因此 455 条既有 `CompactSeed` 一个字符都不用改。
 */
export interface PhoneSeed {
  /** 英文 slug（跨品类全局唯一） */
  id: string;
  /** 机型名 */
  name: string;
  /** 发布时间，形如 "2023-09" */
  release: string;
  /** 首发价（元，最低配） */
  launch?: number | null;
  /** 参考现价（元） */
  price?: number | null;
  /** 品类；缺省 'phone' */
  cat?: DeviceCategory;
  /** 形态；缺省 'bar' */
  ff?: FormFactor;
  /** 平板扩展块；非平板不填 */
  tb?: Partial<TabletExtras> | null;
  /**
   * 笔记本扩展块；非笔记本不填。
   *
   * 注意：设计稿写的是 `lp`，但 `lp` 在 `CompactSeed` 里已是「首发价」短键
   * （455 条数据在用），会撞键，因此短键统一取 `lx`（laptop extras）。
   */
  lx?: Partial<LaptopExtras> | null;
  /** 屏幕 */
  screen?: Partial<DeviceScreen>;
  /** 性能 */
  perf?: Partial<DevicePerformance>;
  /** 存储组合 */
  ram?: number[];
  rom?: number[];
  /** 后置影像 */
  cam?: Partial<DeviceCamera>;
  /** 前置摄像头 */
  front?: string | null;
  /** 电池与充电 */
  bat?: Partial<DeviceBattery>;
  /** 系统与网络 */
  sys?: Partial<DeviceSystem>;
  /** 机身 */
  body?: Partial<DeviceBody>;
  /** 标签 */
  tags?: string[];
  /** 数据来源标注；缺省 '公开参数整理' */
  src?: string | null;
}

/** 把平板扩展块补齐为完整结构（未填字段一律 null，前端渲染为「—」） */
function normalizeTablet(extras: Partial<TabletExtras> | null | undefined): TabletExtras | null {
  if (!extras) return null;
  return {
    cellular: extras.cellular ?? null,
    stylus: extras.stylus ?? null,
    keyboard: extras.keyboard ?? null,
    desktopMode: extras.desktopMode ?? null,
    speakerCount: extras.speakerCount ?? null,
    microSd: extras.microSd ?? null,
  };
}

/** 把笔记本扩展块补齐为完整结构（未填字段一律 null） */
function normalizeLaptop(extras: Partial<LaptopExtras> | null | undefined): LaptopExtras | null {
  if (!extras) return null;
  return {
    cpuModel: extras.cpuModel ?? null,
    cpuTdp: extras.cpuTdp ?? null,
    gpuDiscrete: extras.gpuDiscrete ?? null,
    gpuVram: extras.gpuVram ?? null,
    gpuTgp: extras.gpuTgp ?? null,
    ports: extras.ports ?? null,
    colorGamut: extras.colorGamut ?? null,
    ramUpgradable: extras.ramUpgradable ?? null,
  };
}

/**
 * 品类默认值（工厂的可选第三参）。
 *
 * 存在的意义是**防呆**：平板文件里不必每条都写 `cat:'tablet'` + `ff:'slate'`
 * （100 条写 100 遍必然漏，漏了就是静默错误），而是由工厂兜底，
 * 只有「可拆卸二合一」这类少数派才需要显式覆盖。
 */
export interface CategoryDefaults {
  /** 品类；缺省 'phone' */
  category?: DeviceCategory;
  /** 形态；缺省 'bar' */
  formFactor?: FormFactor;
}

/** 用默认值填充为完整的 Device 对象 */
export function mk(brand: string, seed: PhoneSeed, defaults?: CategoryDefaults): Device {
  const screen: DeviceScreen = {
    size: seed.screen?.size ?? null,
    resolution: seed.screen?.resolution ?? null,
    ppi: seed.screen?.ppi ?? null,
    material: seed.screen?.material ?? null,
    refreshRate: seed.screen?.refreshRate ?? null,
    peakBrightness: seed.screen?.peakBrightness ?? null,
    dimming: seed.screen?.dimming ?? null,
    hdr: seed.screen?.hdr ?? null,
    ratio: seed.screen?.ratio ?? null,
    // 折叠机外屏：仅折叠形态需要填，直板机保持 null
    coverSize: seed.screen?.coverSize ?? null,
    coverResolution: seed.screen?.coverResolution ?? null,
  };

  const performance: DevicePerformance = {
    soc: seed.perf?.soc ?? null,
    socBrand: seed.perf?.socBrand ?? null,
    process: seed.perf?.process ?? null,
    cpu: seed.perf?.cpu ?? null,
    gpu: seed.perf?.gpu ?? null,
    antutu: seed.perf?.antutu ?? null,
    ramType: seed.perf?.ramType ?? null,
    romType: seed.perf?.romType ?? null,
  };

  const storage: DeviceStorage = {
    ramOptions: seed.ram ?? [],
    romOptions: seed.rom ?? [],
  };

  const camera: DeviceCamera = {
    main: seed.cam?.main ?? null,
    ultraWide: seed.cam?.ultraWide ?? null,
    telephoto: seed.cam?.telephoto ?? null,
    extra: seed.cam?.extra ?? null,
    zoom: seed.cam?.zoom ?? null,
    video: seed.cam?.video ?? null,
  };

  const battery: DeviceBattery = {
    capacity: seed.bat?.capacity ?? null,
    // 双单位：mAh 与 Wh 只填其一，绝不换算
    batteryWh: seed.bat?.batteryWh ?? null,
    wiredCharge: seed.bat?.wiredCharge ?? null,
    wirelessCharge: seed.bat?.wirelessCharge ?? null,
    reverseCharge: seed.bat?.reverseCharge ?? null,
  };

  const system: DeviceSystem = {
    os: seed.sys?.os ?? null,
    ui: seed.sys?.ui ?? null,
    network: seed.sys?.network ?? null,
    wifi: seed.sys?.wifi ?? null,
    bluetooth: seed.sys?.bluetooth ?? null,
    nfc: seed.sys?.nfc ?? null,
    infrared: seed.sys?.infrared ?? null,
    satellite: seed.sys?.satellite ?? null,
  };

  const body: DeviceBody = {
    dimensions: seed.body?.dimensions ?? null,
    weight: seed.body?.weight ?? null,
    material: seed.body?.material ?? null,
    ip: seed.body?.ip ?? null,
    biometrics: seed.body?.biometrics ?? null,
    speaker: seed.body?.speaker ?? null,
    port: seed.body?.port ?? null,
    colors: seed.body?.colors ?? null,
  };

  return {
    id: seed.id,
    brand,
    name: seed.name,
    releaseDate: seed.release,
    launchPrice: seed.launch ?? null,
    currentPrice: seed.price ?? null,
    // 品类 / 形态：种子显式值 > 品类默认值 > 兜底（'phone' / 'bar'）
    category: seed.cat ?? defaults?.category ?? 'phone',
    formFactor: seed.ff ?? defaults?.formFactor ?? 'bar',
    screen,
    performance,
    storage,
    camera,
    frontCamera: seed.front ?? null,
    battery,
    system,
    body,
    tags: seed.tags ?? [],
    tablet: normalizeTablet(seed.tb),
    laptop: normalizeLaptop(seed.lx),
    // 口径存疑的条目由录入方显式标注来源（如 '官网规格页'），缺省统一文案
    source: seed.src ?? '公开参数整理',
  };
}

/** 批量构造同一品牌的机型列表 */
export function list(brand: string, seeds: PhoneSeed[]): Device[] {
  return seeds.map((seed) => mk(brand, seed));
}

/**
 * 精简录入结构（短键名版本）。
 *
 * 设备数量较多，完整键名会导致数据文件极其冗长，因此提供一份短键名结构，
 * 由 `c()` 转换成完整 Device 对象。所有字段均为可选，未填写即 null。
 */
export interface CompactSeed {
  /** id */
  i: string;
  /** 机型名 */
  n: string;
  /** 发布时间 */
  d: string;
  /** 首发价 */
  lp?: number | null;
  /** 参考现价 */
  cp?: number | null;
  /** 品类；缺省 'phone' */
  cat?: DeviceCategory;
  /** 形态；缺省 'bar' */
  ff?: FormFactor;
  /** 平板扩展块 */
  tb?: Partial<TabletExtras> | null;
  /** 笔记本扩展块（短键同 `PhoneSeed.lx`：`lp` 已被「首发价」占用） */
  lx?: Partial<LaptopExtras> | null;
  /** 折叠机外屏尺寸（英寸） */
  fsz?: number | null;
  /** 折叠机外屏分辨率 */
  fres?: string | null;
  /** 屏幕尺寸 */
  sz?: number | null;
  /** 分辨率 */
  res?: string | null;
  /** ppi */
  ppi?: number | null;
  /** 屏幕材质 */
  mat?: string | null;
  /** 刷新率 */
  rr?: number | null;
  /** 峰值亮度 */
  nit?: number | null;
  /** 调光 */
  dim?: string | null;
  /** HDR */
  hdr?: string | null;
  /** 屏占比 */
  sr?: string | null;
  /** 处理器 */
  soc?: string | null;
  /** 处理器厂商 */
  sb?: string | null;
  /** 制程 */
  pr?: string | null;
  /** CPU */
  cpu?: string | null;
  /** GPU */
  gpu?: string | null;
  /** 安兔兔跑分 */
  an?: number | null;
  /** 内存规格 */
  rt?: string | null;
  /** 闪存规格 */
  ft?: string | null;
  /** 运行内存选项 */
  ram?: number[];
  /** 机身存储选项 */
  rom?: number[];
  /** 主摄 */
  cm?: string | null;
  /** 超广角 */
  cw?: string | null;
  /** 长焦 */
  ct?: string | null;
  /** 其他镜头 */
  ce?: string | null;
  /** 变焦 */
  cz?: string | null;
  /** 视频 */
  cv?: string | null;
  /** 前置 */
  fc?: string | null;
  /** 电池容量（mAh） */
  bc?: number | null;
  /**
   * 电池容量（Wh，录入短键）；与 `bc` **二选一**，绝不换算。
   *
   * Apple 全系平板与笔记本官方只公布 Wh，填这里；安卓平板 / 手机填 `bc`。
   *
   * 注意分层：短键叫 `bwh`，落到 `Device` 上的类型字段叫 `batteryWh`
   * （类型层字段一律全拼，与 `capacity` / `wiredCharge` 保持同一风格）。
   */
  bwh?: number | null;
  /** 有线充电 */
  bw?: number | null;
  /** 无线充电 */
  bwl?: number | null;
  /** 反向充电 */
  br?: string | null;
  /** 出厂系统 */
  os?: string | null;
  /** 系统界面 */
  ui?: string | null;
  /** 网络 */
  net?: string | null;
  /** Wi-Fi */
  wf?: string | null;
  /** 蓝牙 */
  bt?: string | null;
  /** NFC */
  nfc?: boolean | null;
  /** 红外 */
  ir?: boolean | null;
  /** 卫星通信 */
  sat?: string | null;
  /** 三围 */
  bdim?: string | null;
  /** 重量 */
  wt?: number | null;
  /** 机身材质 */
  bm?: string | null;
  /** 防水 */
  ip?: string | null;
  /** 生物识别 */
  bio?: string | null;
  /** 扬声器 */
  spk?: string | null;
  /** 接口 */
  port?: string | null;
  /** 配色 */
  col?: string | null;
  /** 标签 */
  tags?: string[];
  /** 数据来源标注；缺省 '公开参数整理' */
  src?: string | null;
}

/** 将精简录入结构转换为完整 Device 对象 */
function fromCompact(brand: string, s: CompactSeed, defaults?: CategoryDefaults): Device {
  return mk(brand, {
    id: s.i,
    name: s.n,
    release: s.d,
    launch: s.lp ?? null,
    price: s.cp ?? null,
    src: s.src ?? null,
    cat: s.cat,
    ff: s.ff,
    tb: s.tb ?? null,
    lx: s.lx ?? null,
    screen: {
      size: s.sz ?? null,
      resolution: s.res ?? null,
      ppi: s.ppi ?? null,
      material: s.mat ?? null,
      refreshRate: s.rr ?? null,
      peakBrightness: s.nit ?? null,
      dimming: s.dim ?? null,
      hdr: s.hdr ?? null,
      ratio: s.sr ?? null,
      coverSize: s.fsz ?? null,
      coverResolution: s.fres ?? null,
    },
    perf: {
      soc: s.soc ?? null,
      socBrand: s.sb ?? null,
      process: s.pr ?? null,
      cpu: s.cpu ?? null,
      gpu: s.gpu ?? null,
      antutu: s.an ?? null,
      ramType: s.rt ?? null,
      romType: s.ft ?? null,
    },
    ram: s.ram ?? [],
    rom: s.rom ?? [],
    cam: {
      main: s.cm ?? null,
      ultraWide: s.cw ?? null,
      telephoto: s.ct ?? null,
      extra: s.ce ?? null,
      zoom: s.cz ?? null,
      video: s.cv ?? null,
    },
    front: s.fc ?? null,
    bat: {
      capacity: s.bc ?? null,
      batteryWh: s.bwh ?? null,
      wiredCharge: s.bw ?? null,
      wirelessCharge: s.bwl ?? null,
      reverseCharge: s.br ?? null,
    },
    sys: {
      os: s.os ?? null,
      ui: s.ui ?? null,
      network: s.net ?? null,
      wifi: s.wf ?? null,
      bluetooth: s.bt ?? null,
      nfc: s.nfc ?? null,
      infrared: s.ir ?? null,
      satellite: s.sat ?? null,
    },
    body: {
      dimensions: s.bdim ?? null,
      weight: s.wt ?? null,
      material: s.bm ?? null,
      ip: s.ip ?? null,
      biometrics: s.bio ?? null,
      speaker: s.spk ?? null,
      port: s.port ?? null,
      colors: s.col ?? null,
    },
    tags: s.tags ?? [],
  }, defaults);
}

/**
 * 批量构造（精简录入版本）。
 *
 * `defaults` 只影响**未显式写 `cat` / `ff`** 的种子，既有 455 条手机数据零影响。
 */
export function c(brand: string, seeds: CompactSeed[], defaults?: CategoryDefaults): Device[] {
  return seeds.map((seed) => fromCompact(brand, seed, defaults));
}

/**
 * 平板批量构造：默认 `cat:'tablet'` + `ff:'slate'`。
 *
 * 数据文件里**不必写品类与形态**，也不可能因漏写而错；
 * 可拆卸二合一（Surface / MatePad Edge 类）在种子里显式写 `ff:'detachable'` 覆盖即可。
 */
export function cTablet(brand: string, seeds: CompactSeed[]): Device[] {
  return c(brand, seeds, { category: 'tablet', formFactor: 'slate' });
}

/** 笔记本批量构造：默认 `cat:'laptop'` + `ff:'clamshell'` */
export function cLaptop(brand: string, seeds: CompactSeed[]): Device[] {
  return c(brand, seeds, { category: 'laptop', formFactor: 'clamshell' });
}
