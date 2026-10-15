import { CATEGORIES } from '../constants';
import { CATEGORY_COUNTS } from '../data';
import type { DeviceCategory } from '../types/device';

/**
 * 品类切换（手机 / 平板 / 笔记本）。
 *
 * 单一数据源是 `constants.ts` 的 `CATEGORIES`：中文名、展示顺序、是否上线
 * 全部读那里，组件里不出现任何硬编码中文，新增品类只改常量即可。
 *
 * `enabled: false` 的品类（笔记本）灰显不可点，并带「即将上线」提示——
 * 不做隐藏：让用户知道有这个规划，比切换后空白页更容易理解。
 */
export interface CategoryTabsProps {
  /** 当前品类 */
  value: DeviceCategory;
  /** 切换品类；由调用方负责连带重置按品类派生的筛选项 */
  onChange: (next: DeviceCategory) => void;
}

/** 品类切换控件 */
export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="设备品类"
      className="flex flex-wrap items-center gap-1.5"
    >
      {CATEGORIES.map((category) => {
        const selected = category.id === value;
        const count = CATEGORY_COUNTS[category.id] ?? 0;

        if (!category.enabled) {
          return (
            <button
              key={category.id}
              type="button"
              disabled
              role="tab"
              aria-selected={false}
              title="即将上线"
              className="psc-chip cursor-not-allowed border-dashed opacity-45 dark:opacity-40"
            >
              {category.label}
              <span className="text-[10px] font-normal opacity-80">即将上线</span>
            </button>
          );
        }

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(category.id)}
            className={`psc-chip ${selected ? 'psc-chip-on' : 'psc-chip-off'}`}
          >
            {category.label}
            <span
              className={`text-[10px] font-normal tabular-nums ${
                selected ? 'opacity-80' : 'opacity-60'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;
