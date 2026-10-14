import type { Device } from '../types/device';
import type { SpecGroup } from '../types/phone';

/**
 * 笔记本专属参数组（**空壳**，本期零数据）。
 *
 * 存在的意义是占住扩展位：类型（`LaptopExtras`）、工厂（`c()` 的 `lx` 短键）、
 * 参数组（本文件）、筛选与对比全链路现在就跑通，将来只需往 `src/data/laptops/*.ts`
 * 灌数据，核心与页面无需改动——而不是留一句 TODO 注释。
 *
 * 本期不接线到 UI（对比页只渲染 `SPEC_GROUPS`），因此不会影响任何既有行为。
 */
export const LAPTOP_SPEC_GROUPS: SpecGroup[] = [
  {
    key: 'laptop-core',
    label: '笔记本核心配置',
    icon: 'Laptop',
    defaultOpen: true,
    categories: ['laptop'],
    rows: [
      {
        key: 'laptop.cpuModel',
        label: 'CPU 型号',
        get: (device: Device) => device.laptop?.cpuModel ?? null,
      },
      {
        key: 'laptop.cpuTdp',
        label: 'CPU 功耗',
        get: (device: Device) => device.laptop?.cpuTdp ?? null,
        unit: 'W',
        numeric: true,
      },
      {
        key: 'laptop.gpuDiscrete',
        label: '独立显卡',
        get: (device: Device) => device.laptop?.gpuDiscrete ?? null,
      },
      {
        key: 'laptop.gpuVram',
        label: '显存',
        get: (device: Device) => device.laptop?.gpuVram ?? null,
        unit: 'GB',
        better: 'higher',
        numeric: true,
      },
      {
        key: 'laptop.gpuTgp',
        label: '显卡功耗',
        get: (device: Device) => device.laptop?.gpuTgp ?? null,
        unit: 'W',
        numeric: true,
      },
      {
        key: 'laptop.ports',
        label: '接口',
        get: (device: Device) => device.laptop?.ports ?? null,
      },
      {
        key: 'laptop.batteryWh',
        // 笔记本行业惯例用 Wh，不做 Wh→mAh 换算（需要电压，无法反推）
        label: '电池容量',
        get: (device: Device) => device.laptop?.batteryWh ?? null,
        unit: 'Wh',
        better: 'higher',
        numeric: true,
      },
      {
        key: 'laptop.colorGamut',
        label: '屏幕色域',
        get: (device: Device) => device.laptop?.colorGamut ?? null,
      },
      {
        key: 'laptop.ramUpgradable',
        label: '内存可扩展',
        get: (device: Device) => {
          const value: boolean | null | undefined = device.laptop?.ramUpgradable;
          if (value === null || value === undefined) return null;
          return value ? '支持' : '不支持';
        },
      },
    ],
  },
];

/** 分组 key -> 分组对象 的索引 */
export const LAPTOP_SPEC_GROUP_MAP: Record<string, SpecGroup> = LAPTOP_SPEC_GROUPS.reduce(
  (acc: Record<string, SpecGroup>, group: SpecGroup) => {
    acc[group.key] = group;
    return acc;
  },
  {} as Record<string, SpecGroup>,
);

