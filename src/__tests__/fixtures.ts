import type {
  Phone,
  PhoneBattery,
  PhoneBody,
  PhoneCamera,
  PhonePerformance,
  PhoneScreen,
  PhoneStorage,
  PhoneSystem,
} from '../types/phone';

/**
 * 机型覆写参数：嵌套分组允许只写关心的字段（深 Partial），
 * 避免每个用例都要补全 PhoneScreen / PhoneBattery 等一整组字段。
 */
export interface PhoneOverrides
  extends Partial<
    Omit<Phone, 'screen' | 'performance' | 'storage' | 'camera' | 'battery' | 'system' | 'body'>
  > {
  screen?: Partial<PhoneScreen>;
  performance?: Partial<PhonePerformance>;
  storage?: Partial<PhoneStorage>;
  camera?: Partial<PhoneCamera>;
  battery?: Partial<PhoneBattery>;
  system?: Partial<PhoneSystem>;
  body?: Partial<PhoneBody>;
}

/**
 * 测试用机型工厂。
 * 默认所有可空字段为 null，测试只覆盖自己关心的字段，避免测试数据互相干扰。
 */
export function makePhone(overrides: PhoneOverrides = {}): Phone {
  const base: Phone = {
    id: 'test-phone',
    brand: '测试品牌',
    name: '测试机型',
    releaseDate: '2024-01',
    launchPrice: 3999,
    currentPrice: 3599,
    // 与 `c()` / `mk()` 工厂默认值保持一致（品类抽象的向后兼容默认值）
    category: 'phone',
    formFactor: 'bar',
    screen: {
      size: 6.7,
      resolution: '2796x1290',
      ppi: 460,
      material: 'OLED',
      refreshRate: 120,
      peakBrightness: 2000,
      dimming: '2160Hz PWM',
      hdr: 'HDR10+',
      ratio: '90%',
    },
    performance: {
      soc: 'Test SoC',
      socBrand: '测试厂商',
      process: '4nm',
      cpu: '8核',
      gpu: 'Test GPU',
      antutu: 1000000,
      ramType: 'LPDDR5X',
      romType: 'UFS 4.0',
    },
    storage: { ramOptions: [8, 12], romOptions: [128, 256] },
    camera: {
      main: '5000万像素',
      ultraWide: '1200万像素',
      telephoto: null,
      extra: null,
      zoom: '3倍光学变焦',
      video: '4K60',
    },
    frontCamera: '1200万像素',
    battery: {
      capacity: 5000,
      wiredCharge: 80,
      wirelessCharge: 50,
      reverseCharge: '支持',
    },
    system: {
      os: 'Test OS 1.0',
      ui: 'TestUI 1.0',
      network: '5G双模',
      wifi: 'Wi-Fi 7',
      bluetooth: '5.4',
      nfc: true,
      infrared: false,
      satellite: null,
    },
    body: {
      dimensions: '160x75x8mm',
      weight: 200,
      material: '玻璃',
      ip: 'IP68',
      biometrics: '屏下指纹',
      speaker: '立体声双扬声器',
      port: 'USB-C',
      colors: '黑 / 白',
    },
    tags: ['旗舰'],
    source: '测试数据',
  };

  const { screen, performance, storage, camera, battery, system, body, ...rest } = overrides;

  return {
    ...base,
    ...rest,
    screen: { ...base.screen, ...(screen ?? {}) },
    performance: { ...base.performance, ...(performance ?? {}) },
    storage: { ...base.storage, ...(storage ?? {}) },
    camera: { ...base.camera, ...(camera ?? {}) },
    battery: { ...base.battery, ...(battery ?? {}) },
    system: { ...base.system, ...(system ?? {}) },
    body: { ...base.body, ...(body ?? {}) },
  };
}
