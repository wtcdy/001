/**
 * 设备（跨品类）参数数据模型定义。
 *
 * 设计要点（方案 C：Device 核心 + 品类扩展块）：
 *  - `Device` = 原 `Phone` 全部字段 + `category` + `formFactor` + `tablet?` / `laptop?` 扩展块；
 *  - `Phone` 只是 `Device` 的类型别名（见 `src/types/phone.ts`），因此 455 条手机数据与
 *    100+ 处既有 `Phone` 引用**零改动**即可编译通过；
 *  - 品类专属字段放扩展块，避免把「手写笔 / 键盘 / TDP / 独显」塞进核心造成上帝对象；
 *  - 笔记本（`laptop`）本期**只定义类型与空壳参数组、不填数据**，用于占住扩展位。
 *
 * 说明：所有「拿不准」的字段一律填 null，前端渲染时统一显示为「—」。
 * 数据均来自公开参数整理，允许存在误差。
 */

/** 设备品类 */
export type DeviceCategory = 'phone' | 'tablet' | 'laptop';

/**
 * 设备形态。
 *
 * **必须显式标注，不做运行时推导**：折叠机的展开尺寸区间与直板机重叠且反转
 * （阔折叠 Pura X 展开 6.3" < 竖折叠 6.9"），靠屏幕尺寸阈值推导必然误判。
 * 推导函数只作为 `npm run validate:data` 的录入校验器存在。
 */
export type FormFactor =
  /** 直板 */
  | 'bar'
  /** 横折叠（内折 / 外折，展开 ≥7"）：Mate X6 / Galaxy Z Fold */
  | 'fold-h'
  /**
   * 中折叠：展开 7.58" √2:1（1.41:1），合上为护照形 117.8×83.6mm（1.41:1）—— 小米 18 Fold。
   *
   * 不能归 `fold-h`：合上态是护照形 1.41:1，与横折叠细长条 2.1:1 是两种物理形态；
   * 不能归 `fold-wide`：「阔折叠」已被 Pura X 的官方定义占用（合上 3.5" 1:1 方屏）。
   */
  | 'fold-mid'
  /** 竖折叠（小折叠，展开 ~6.9"）：Pocket 2 / Flip / Razr */
  | 'fold-v'
  /** 阔折叠：展开 6.3" 16:10 + 合上 3.5" 1:1 —— 华为 Pura X */
  | 'fold-wide'
  /** 三折叠：华为 Mate XT */
  | 'fold-triple'
  /** 纯平板 */
  | 'slate'
  /** 可拆卸键盘平板：Surface / MatePad Paper 类 */
  | 'detachable'
  /** 翻盖笔记本（预留） */
  | 'clamshell';

/** 屏幕参数 */
export interface DeviceScreen {
  /** 屏幕尺寸（英寸） */
  size: number | null;
  /** 分辨率，形如 "2796x1290" */
  resolution: string | null;
  /** 像素密度 */
  ppi: number | null;
  /** 屏幕材质，如 "OLED LTPO" */
  material: string | null;
  /** 刷新率（Hz） */
  refreshRate: number | null;
  /** 峰值亮度（nit） */
  peakBrightness: number | null;
  /** 调光方式，如 "2160Hz PWM" */
  dimming: string | null;
  /** HDR 支持，如 "HDR10+ / 杜比视界" */
  hdr: string | null;
  /** 屏占比 */
  ratio: string | null;
  /** 折叠机外屏尺寸（英寸）；直板机 / 非折叠为 null */
  coverSize?: number | null;
  /** 折叠机外屏分辨率，如 "980x980" */
  coverResolution?: string | null;
}

/** 性能参数 */
export interface DevicePerformance {
  /** 处理器型号，如 "A17 Pro" */
  soc: string | null;
  /** 处理器厂商：Apple / 高通 / 联发科 / 海思 / 三星 / 紫光展锐 */
  socBrand: string | null;
  /** 制程工艺，如 "3nm" */
  process: string | null;
  /** CPU 规格，如 "6核" */
  cpu: string | null;
  /** GPU 型号 */
  gpu: string | null;
  /** 安兔兔跑分 */
  antutu: number | null;
  /** 内存规格，如 "LPDDR5X" */
  ramType: string | null;
  /** 闪存规格，如 "UFS 4.0" */
  romType: string | null;
}

/** 存储组合 */
export interface DeviceStorage {
  /** 可选运行内存（GB） */
  ramOptions: number[];
  /** 可选机身存储（GB） */
  romOptions: number[];
}

/** 后置影像 */
export interface DeviceCamera {
  /** 主摄 */
  main: string | null;
  /** 超广角 */
  ultraWide: string | null;
  /** 长焦 */
  telephoto: string | null;
  /** 附加镜头（微距 / 景深 / 第四摄） */
  extra: string | null;
  /** 变焦能力 */
  zoom: string | null;
  /** 视频拍摄能力 */
  video: string | null;
  /**
   * 影像联名调教，如「徕卡 Leica」「蔡司 ZEISS」「哈苏 Hasselblad」「阿莱 ARRI」「理光 GR」。
   *
   * 口径：**只填官方（品牌官网规格页 / 官方发布会）明确标注的联名**，
   * 自媒体口径一律不采信。官网未标注联名的机型**不填该字段**（undefined），
   * 严禁填「无」或空串——「没写」和「没有」是两回事。
   * 华为 XMAGE 属**自研**影像品牌，不算联名，故不填。
   */
  coBranding?: string | null;
  /**
   * 自研影像品牌，如华为 "XMAGE"。
   *
   * 与 `coBranding` 的区别：`coBranding` 是**第三方联名**（徕卡 / 蔡司 / 哈苏…），
   * 本字段是**厂商自己的影像品牌**（华为 XMAGE），两者语义不同，不可混填。
   * 官网未标注的机型不填该字段（undefined），严禁填「无」或空串。
   */
  imagingBrand?: string | null;
}

/**
 * 电池与充电。
 *
 * 双单位并存、**绝不换算**：
 *  - `capacity`（mAh）：手机 / 安卓平板用；
 *  - `batteryWh`（Wh）：Apple 全系平板与笔记本用（这两类官方只公布 Wh，不公布 mAh）。
 *
 * 一台设备**只填其中一个**，另一个留 null。Wh→mAh 需要电压才能反推，换算等于制造假精度，
 * 且估算值会与官方 mAh 混在同一列比较，用户无从分辨。
 */
export interface DeviceBattery {
  /** 电池容量（mAh）；官方未公布 mAh 时为 null */
  capacity: number | null;
  /** 电池容量（Wh）；官方未公布 Wh 时为 null */
  batteryWh?: number | null;
  /** 有线充电功率（W） */
  wiredCharge: number | null;
  /** 无线充电功率（W） */
  wirelessCharge: number | null;
  /** 反向充电描述 */
  reverseCharge: string | null;
  /**
   * 第三方实测续航（分钟）：极客湾 Geekerwan 续航测试 5.0，非官方口径。
   *
   * 与 `capacity` / `batteryWh`（官方容量）是两回事，不可换算、不可互相替代：
   * 这是零售机满电连续使用**至关机**的实测总时长，站点未公布测试项目明细。
   * 数据落在 `src/data/batteryBench.ts`，未收录机型为 undefined（界面显示「—」）。
   */
  batteryLifeMin?: number | null;
  /** 实测续航对应的测试系统版本（同机型换版本重测会更新） */
  batteryBenchSystemVersion?: string | null;
  /** 实测续航全程录像（B 站），用于溯源 */
  batteryBenchVideoUrl?: string | null;
  /**
   * 第三方实测充满耗时（分钟）：极客湾充电测试，原装充电头 0→100%，非官方口径。
   * 与 `wiredCharge`（官方标称充电功率 W）是两回事：一个是实测耗时，一个是厂商标称功率。
   */
  chargeFullMin?: number | null;
  /** 该次充电测试所用充电头功率（W，官网标称值），用于说明测试条件 */
  chargeChargerW?: number | null;
  /** 充满全程累计充入能量（Wh，电源端口径，含电路损耗，不等于电池容量） */
  chargeTotalEnergyWh?: number | null;
}

/** 系统与网络 */
export interface DeviceSystem {
  /** 出厂系统，如 "iOS 17" */
  os: string | null;
  /** UI / 系统界面，如 "ColorOS 14" */
  ui: string | null;
  /** 网络制式，如 "5G双模"（平板可填「Wi-Fi 版 / 5G 版」区分蜂窝版） */
  network: string | null;
  /** Wi-Fi 规格 */
  wifi: string | null;
  /** 蓝牙版本 */
  bluetooth: string | null;
  /** 是否支持 NFC */
  nfc: boolean | null;
  /** 是否支持红外遥控 */
  infrared: boolean | null;
  /** 卫星通信能力 */
  satellite: string | null;
}

/** 机身（重量统一存 g，展示层按品类格式化为 g / kg） */
export interface DeviceBody {
  /** 三围尺寸 */
  dimensions: string | null;
  /**
   * 机身厚度（mm）。
   *
   * 库里原本只有 `dimensions` 这个字符串（形如 `'163.37x76.71x8.13mm'`），
   * 没有可供筛选的数值字段，因此单独抽出厚度：
   *  - 种子里显式写了 `th` 就以它为准；
   *  - 没写则由工厂从 `dimensions` 的第三段解析回填（解析不出来保持 null，绝不猜）。
   */
  thickness?: number | null;
  /** 重量（g） */
  weight: number | null;
  /** 机身材质 */
  material: string | null;
  /** 防尘防水等级 */
  ip: string | null;
  /** 生物识别 */
  biometrics: string | null;
  /** 扬声器 */
  speaker: string | null;
  /** 接口 */
  port: string | null;
  /** 配色 */
  colors: string | null;
}

/** 手写笔规格 */
export interface StylusSpec {
  /** 是否支持手写笔 */
  supported: boolean;
  /** 笔的型号，如 "Apple Pencil Pro" */
  name?: string | null;
  /** 是否随机附赠 */
  bundled?: boolean | null;
  /** 延迟（ms） */
  latencyMs?: number | null;
  /** 压感级数 */
  pressureLevels?: number | null;
}

/** 外接键盘规格 */
export interface KeyboardSpec {
  /** 是否支持外接键盘 */
  supported: boolean;
  /** 键盘型号，如 "妙控键盘" */
  name?: string | null;
  /** 连接方式 */
  attach?: 'pogo' | 'magnetic' | 'bluetooth' | 'none' | null;
  /** 是否随机附赠 */
  bundled?: boolean | null;
}

/** 平板专属扩展块（仅 `category === 'tablet'` 时有值） */
export interface TabletExtras {
  /** 是否有蜂窝数据版（LTE / 5G） */
  cellular: boolean | null;
  /** 手写笔 */
  stylus: StylusSpec | null;
  /** 外接键盘 */
  keyboard: KeyboardSpec | null;
  /** 桌面 / 生产力模式：Samsung DeX / 华为桌面模式 / iPadOS 台前调度 */
  desktopMode: string | null;
  /** 扬声器数量（平板 2/4/8 是硬指标） */
  speakerCount: number | null;
  /** 是否支持 microSD 扩展 */
  microSd: boolean | null;
}

/**
 * 笔记本专属扩展块（仅 `category === 'laptop'` 时有值）。
 *
 * 本期**零数据**，只定义类型并在工厂 / 参数组里接线，用于占住扩展位：
 * 将来只需往 `src/data/laptops/*.ts` 灌数据，核心与页面无需改动。
 */
export interface LaptopExtras {
  /** CPU 型号，如 "Core Ultra 7 155H" */
  cpuModel: string | null;
  /** CPU 功耗（W） */
  cpuTdp: number | null;
  /** 独立显卡型号 */
  gpuDiscrete: string | null;
  /** 独显显存（GB） */
  gpuVram: number | null;
  /** 独显功耗（W） */
  gpuTgp: number | null;
  /** 接口清单，如 "雷电4 x2 / USB-A x2 / HDMI 2.1 / SD" */
  ports: string | null;
  /** 屏幕色域，如 "100% DCI-P3" */
  colorGamut: string | null;
  /** 内存是否可扩展 */
  ramUpgradable: boolean | null;
}

/** 一款设备的完整参数 */
export interface Device {
  /** 英文 slug 唯一标识，如 "iphone-15-pro-max"（跨品类全局唯一） */
  id: string;
  /** 品牌，如 "Apple" */
  brand: string;
  /** 机型名，如 "iPhone 15 Pro Max" */
  name: string;
  /** 发布时间，形如 "2023-09" */
  releaseDate: string;
  /** 首发价（元，取最低配） */
  launchPrice?: number | null;
  /** 参考现价（元） */
  currentPrice?: number | null;
  /** 品类 */
  category: DeviceCategory;
  /** 形态（显式标注，不推导） */
  formFactor: FormFactor;
  /** 屏幕 */
  screen: DeviceScreen;
  /** 性能 */
  performance: DevicePerformance;
  /** 存储组合 */
  storage: DeviceStorage;
  /** 后置影像 */
  camera: DeviceCamera;
  /** 前置摄像头 */
  frontCamera: string | null;
  /** 电池与充电 */
  battery: DeviceBattery;
  /** 系统与网络 */
  system: DeviceSystem;
  /** 机身 */
  body: DeviceBody;
  /** 标签，如 ["旗舰","影像旗舰"]（只放人工主观标注，可推导的一律走特性派生） */
  tags?: string[];
  /** 平板扩展块（非平板为 null） */
  tablet?: TabletExtras | null;
  /** 笔记本扩展块（非笔记本为 null） */
  laptop?: LaptopExtras | null;
  /** 数据来源标注 */
  source?: string;
}

/**
 * 特性 id。
 *
 * 特性一律**派生、不落地**（见 `src/utils/features.ts`），本联合类型与 `FEATURE_DEFS`
 * 的 id 一一对应；改规则改一处，改名单改这里。
 */
export type FeatureId =
  | 'small-screen'
  | 'periscope'
  | 'long-battery'
  | 'fast-charge'
  | 'wireless-charge'
  | 'ip68'
  | 'satellite'
  | 'nfc'
  | 'infrared'
  | 'high-refresh'
  | 'flagship-soc'
  | 'light-weight'
  | 'stylus'
  | 'keyboard'
  | 'cellular'
  | 'large-screen-tablet'
  | 'gaming'
  | 'camera-flagship';

/* ------------------------------------------------------------------ */
/* 向后兼容别名：老代码继续写 Phone*，新代码一律写 Device*              */
/* ------------------------------------------------------------------ */

/** @deprecated 用 `DeviceScreen` */
export type PhoneScreen = DeviceScreen;
/** @deprecated 用 `DevicePerformance` */
export type PhonePerformance = DevicePerformance;
/** @deprecated 用 `DeviceStorage` */
export type PhoneStorage = DeviceStorage;
/** @deprecated 用 `DeviceCamera` */
export type PhoneCamera = DeviceCamera;
/** @deprecated 用 `DeviceBattery` */
export type PhoneBattery = DeviceBattery;
/** @deprecated 用 `DeviceSystem` */
export type PhoneSystem = DeviceSystem;
/** @deprecated 用 `DeviceBody` */
export type PhoneBody = DeviceBody;
