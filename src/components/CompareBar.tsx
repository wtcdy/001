import { ArrowRightLeft, Trash2, X } from 'lucide-react';

import BrandAvatar from './BrandAvatar';
import { MAX_COMPARE } from '../hooks/useCompare';
import type { Phone } from '../types/phone';

export interface CompareBarProps {
  /** 已选机型（按选择顺序） */
  phones: Phone[];
  /** 移除某一款 */
  onRemove: (id: string) => void;
  /** 清空 */
  onClear: () => void;
  /** 开始对比 */
  onCompare: () => void;
}

/** 底部悬浮对比栏：展示已选机型、清空与开始对比入口 */
export function CompareBar({ phones, onRemove, onClear, onCompare }: CompareBarProps) {
  if (phones.length === 0) return null;
  const isFull = phones.length >= MAX_COMPARE;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-[#11141d]/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        {/*
          计数里的上限取自 MAX_COMPARE，改常量时文案不会失真。
          满额时整段变琥珀色，和卡片上的「已达上限」提示、点击后的 Toast 形成同一套反馈。
        */}
        <div
          className={`flex items-center gap-1.5 text-sm font-medium ${
            isFull ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'
          }`}
          title={isFull ? `最多同时对比 ${MAX_COMPARE} 款机型，请先移除一款` : undefined}
        >
          <ArrowRightLeft size={16} aria-hidden="true" />
          已选 <span className="font-bold text-brand-600 dark:text-brand-400">{phones.length}</span> /{' '}
          {MAX_COMPARE}
          {isFull ? <span className="text-xs">（已满）</span> : null}
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          {phones.map((phone) => (
            <div
              key={phone.id}
              className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-50 py-1 pl-1 pr-2 dark:border-slate-600 dark:bg-slate-800"
            >
              <BrandAvatar brand={phone.brand} phone={phone} sizeClass="h-6 w-6" radiusClass="rounded-full" />
              <span className="max-w-[9rem] truncate text-xs text-slate-700 dark:text-slate-200" title={phone.name}>
                {phone.name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(phone.id)}
                className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                aria-label={`移除 ${phone.name}`}
              >
                <X size={12} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onClear} className="psc-btn-ghost !px-2.5 !py-1.5 !text-xs">
            <Trash2 size={13} aria-hidden="true" />
            清空
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={phones.length < 2}
            title={phones.length < 2 ? '至少选择 2 款机型才能对比' : undefined}
            className="psc-btn-primary !py-1.5"
          >
            开始对比
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompareBar;
