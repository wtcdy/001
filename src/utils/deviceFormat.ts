import type { Device, DeviceCategory, FormFactor } from '../types/device';

import { CATEGORIES, FORM_FACTOR_LABELS } from '../constants';

/**
 * 跨品类展示格式化。
 *
 * 只做「按品类选单位 / 选中文名」这一件事，不含业务判断：
 *  - 重量：手机 / 平板用 g，笔记本用 kg（数据统一存 g，展示层换算）
 *  - 电池：手机 / 平板用 mAh，笔记本用 Wh（**不做换算**：Wh→mAh 需要电压，无法反推）
 *
 * 本文件是手写逻辑，任何脚本都不会重写它。
 */

/** 重量展示文本；无数据返回 null（前端渲染为「—」） */
export function formatWeight(device: Device): string | null {
  const weight = device.body?.weight ?? null;
  if (typeof weight !== 'number' || !Number.isFinite(weight) || weight <= 0) return null;

  // 笔记本惯例用 kg；手机 / 平板即使超过 1000g（大尺寸平板）也沿用 g
  if (device.category === 'laptop' && weight >= 1000) {
    const kg = weight / 1000;
    const text = Number.isInteger(kg) ? String(kg) : String(Number(kg.toFixed(2)));
    return `${text}kg`;
  }
  return `${Math.round(weight)}g`;
}

/** 电池容量展示文本；无数据返回 null（前端渲染为「—」） */
export function formatBattery(device: Device): string | null {
  if (device.category === 'laptop') {
    const wh = device.laptop?.batteryWh ?? null;
    if (typeof wh !== 'number' || !Number.isFinite(wh) || wh <= 0) return null;
    return `${Math.round(wh)}Wh`;
  }

  const capacity = device.battery?.capacity ?? null;
  if (typeof capacity !== 'number' || !Number.isFinite(capacity) || capacity <= 0) return null;
  return `${Math.round(capacity)}mAh`;
}

/** 形态中文名；未知形态原样返回，避免显示 undefined */
export function formFactorLabel(formFactor: FormFactor | null | undefined): string {
  if (!formFactor) return '—';
  return FORM_FACTOR_LABELS[formFactor] ?? formFactor;
}

/** 品类中文名 */
export function categoryLabel(category: DeviceCategory | null | undefined): string {
  if (!category) return '—';
  return CATEGORIES.find((item) => item.id === category)?.label ?? category;
}
