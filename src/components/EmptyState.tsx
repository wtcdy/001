import type { ReactNode } from 'react';

import { SearchX } from 'lucide-react';

export interface EmptyStateProps {
  /** 主标题 */
  title: string;
  /** 描述文案 */
  description?: string;
  /** 自定义图标（默认放大镜） */
  icon?: ReactNode;
  /** 操作按钮区 */
  action?: ReactNode;
}

/** 通用空状态 / 无结果状态组件 */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-800/30">
      <div className="mb-4 text-slate-400 dark:text-slate-500">
        {icon ?? <SearchX size={40} aria-hidden="true" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
