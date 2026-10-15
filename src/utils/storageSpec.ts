import { dealOfPhone } from '../data';
import type { Device } from '../types/device';

/**
 * 价格展示用的「内存配置后缀」工具。
 *
 * 背景：用户要求所有价格后面标注对应配置，形如 `¥5999（12+256）`。
 *  - 官网价 `currentPrice` 的口径就是**最低配价**（用户此前拍板并验收过），
 *    因此配置取 `min(ramOptions) + '+' + min(romOptions)`。
 *  - 渠道价（京东自营）自带 `spec`（见 `src/data/prices.ts` 每条的 `spec` 字段），
 *    渠道最低配配置可能与官网不同，**优先用它**。
 *
 * 禁止编造：ram/rom 任一缺失就返回 null，价格照常显示、不带括号。
 */

/**
 * 从机型的 ram/rom 数组取「最低配组合」，返回 `"12+256"` 格式。
 * ramOptions 或 romOptions 缺失 / 为空 → null。
 */
export function storageSpecOf(device: Device): string | null {
  const ram = device.storage?.ramOptions;
  const rom = device.storage?.romOptions;
  if (!ram || ram.length === 0 || !rom || rom.length === 0) return null;
  const minRam = Math.min(...ram);
  const minRom = Math.min(...rom);
  return `${minRam}+${minRom}`;
}

/** 把 deal.spec（可能为空串）规范成可展示的配置串；空 / 空白 → null */
function dealSpecText(spec: string): string | null {
  const trimmed = typeof spec === 'string' ? spec.trim() : '';
  return trimmed === '' ? null : trimmed;
}

/**
 * 对比表价格行在单元格追加的配置后缀（不含括号，渲染层负责包全角括号）。
 *
 * 口径：
 *  - `price.jd`（京东自营价）：有渠道价时用渠道 `spec`；无价 → null（单元格本就是「—」，不加后缀）。
 *  - `price.best`（最低可购价）：有渠道价时用渠道 `spec`，否则回落 `storageSpecOf`（官网配置）。
 *  - `currentPrice`（官网售价）/ `launchPrice`（首发价）：用 `storageSpecOf`。
 *  - 其余行：null（不加后缀）。
 *
 * 返回 null 时渲染层不追加括号，保证「配置为 null 时只显示价格，不留空括号」。
 */
export function priceRowSpecSuffix(rowKey: string, device: Device): string | null {
  switch (rowKey) {
    case 'price.jd': {
      const deal = dealOfPhone(device);
      return deal.hasPrice ? dealSpecText(deal.spec) : null;
    }
    case 'price.best': {
      const deal = dealOfPhone(device);
      return deal.hasPrice ? dealSpecText(deal.spec) : storageSpecOf(device);
    }
    case 'currentPrice':
    case 'launchPrice':
      return storageSpecOf(device);
    default:
      return null;
  }
}
