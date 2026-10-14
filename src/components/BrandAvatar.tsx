import { useMemo } from 'react';

import type { Phone } from '../types/phone';

/** 品牌色板：用于生成首字母色块占位图（不依赖任何外链图片资源） */
const PALETTE: string[] = [
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-blue-600',
];

/** 根据字符串生成稳定 hash，保证同一品牌每次渲染颜色一致 */
function hashString(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return hash;
}

/** 取品牌展示用的首字母（中文取首字，英文取首字母大写） */
function initialOf(brand: string): string {
  const trimmed = (brand ?? '').trim();
  if (trimmed === '') return '?';
  return trimmed.slice(0, 1).toUpperCase();
}

export interface BrandAvatarProps {
  /** 品牌名 */
  brand: string;
  /** 尺寸类名，如 "h-12 w-12" */
  sizeClass?: string;
  /** 圆角类名 */
  radiusClass?: string;
  /** 机型（可选，用于生成更稳定的渐变底纹） */
  phone?: Phone;
}

/**
 * 品牌首字母色块占位图。
 * 全部由 CSS 生成，不引用任何外部图片资源。
 */
export function BrandAvatar({
  brand,
  sizeClass = 'h-12 w-12',
  radiusClass = 'rounded-xl',
  phone,
}: BrandAvatarProps) {
  const colorClass = useMemo(() => {
    const seed = `${brand}|${phone?.id ?? ''}`;
    return PALETTE[hashString(seed) % PALETTE.length];
  }, [brand, phone?.id]);

  const textSize = sizeClass.includes('h-8') || sizeClass.includes('h-9') ? 'text-xs' : 'text-base';

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-bold text-white shadow-sm ${sizeClass} ${radiusClass} ${colorClass} ${textSize}`}
      aria-hidden="true"
    >
      {initialOf(brand)}
    </div>
  );
}

export default BrandAvatar;
