import { RotateCcw, SlidersHorizontal } from 'lucide-react';

import {
  BATTERY_BOUNDS,
  BRANDS,
  FORM_FACTORS_BY_CATEGORY,
  PRICE_BOUNDS,
  SCREEN_SIZE_BOUNDS,
  SOC_BRANDS,
  YEARS,
} from '../data';
import type { Filters } from '../hooks/useFilters';
import { FORM_FACTOR_LABELS } from '../constants';
import type { DeviceCategory } from '../types/device';
import type { SortKey } from '../types/phone';

import { FEATURE_DEFS } from '../utils/features';

export interface FilterPanelProps {
  /** 当前筛选条件 */
  filters: Filters;
  /** 更新单个字段 */
  update: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  /** 多选字段开关 */
  toggleInArray: (key: 'brands' | 'years' | 'socBrands' | 'formFactors' | 'features', value: string) => void;
  /** 重置全部筛选 */
  reset: () => void;
  /** 当前排序 */
  sortKey: SortKey;
  /** 修改排序 */
  setSortKey: (key: SortKey) => void;
  /** 当前品类：决定形态 / 特性 chips 展示哪些（只展示该品类下实际有数据的选项） */
  category: DeviceCategory;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'release-desc', label: '发布时间：最新' },
  { value: 'release-asc', label: '发布时间：最早' },
  { value: 'price-asc', label: '价格：从低到高' },
  { value: 'price-desc', label: '价格：从高到低' },
  { value: 'battery-desc', label: '电池容量：从大到小' },
  { value: 'name-asc', label: '名称：A → Z' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-200 py-4 first:pt-0 last:border-b-0 dark:border-slate-700/60">
      <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Chips({
  items,
  active,
  onToggle,
}: {
  items: string[];
  active: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const on = active.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`psc-chip ${on ? 'psc-chip-on' : 'psc-chip-off'}`}
            aria-pressed={on}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function RangeSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  format: (n: number) => string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span className="font-medium tabular-nums">
          {format(value[0])} — {format(value[1])}
        </span>
      </div>
      <div className="space-y-1.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
          className="w-full accent-brand-600"
          aria-label={`${label}下限`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
          className="w-full accent-brand-600"
          aria-label={`${label}上限`}
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1 text-sm text-slate-700 dark:text-slate-200">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-brand-600"
      />
    </label>
  );
}

/** 筛选面板：排序 / 品牌 / 价格 / 年份 / 处理器 / 屏幕 / 电池 / 特性开关 */
export function FilterPanel({
  filters,
  update,
  toggleInArray,
  reset,
  sortKey,
  setSortKey,
  category,
}: FilterPanelProps) {
  // 形态：只展示当前品类下实际有机型的形态（读派生索引，不硬编码），按数量降序
  const formFactorOptions = FORM_FACTORS_BY_CATEGORY[category] ?? [];

  // 特性：只展示 categories 含当前品类的特性，按 FEATURE_DEFS 的既定顺序
  const featureOptions = FEATURE_DEFS.filter((def) => def.categories.includes(category));

  return (
    <div className="psc-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <SlidersHorizontal size={15} aria-hidden="true" />
          筛选
        </div>
        <button type="button" onClick={reset} className="psc-btn-ghost !px-2 !py-1 !text-xs">
          <RotateCcw size={12} aria-hidden="true" />
          重置
        </button>
      </div>

      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
        <Section title="排序">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="psc-input"
            aria-label="排序方式"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Section>

        <Section title="品牌">
          <Chips items={BRANDS} active={filters.brands} onToggle={(v) => toggleInArray('brands', v)} />
        </Section>

        <Section title="价格区间">
          <RangeSlider
            label="价格（到手价优先）"
            min={PRICE_BOUNDS[0]}
            max={PRICE_BOUNDS[1]}
            step={100}
            value={filters.priceRange}
            onChange={(next) => update('priceRange', next)}
            format={(n) => `¥${n.toLocaleString('zh-CN')}`}
          />
          {/*
            口径说明：滑块筛的是「有效价」而不是「参考价」——
            有渠道报价的机型按国补后到手价，没有渠道报价的机型只能回落到参考现价（未计国补）。
            不说清楚的话，用户会以为所有机型都按到手价排，实际并非如此。
          */}
          <p className="mt-1 text-[11px] leading-tight text-slate-400 dark:text-slate-500">
            有渠道报价的机型按国补后到手价筛选/排序，其余机型按参考现价（未计国补）。
          </p>
        </Section>

        <Section title="发布年份">
          <Chips items={YEARS} active={filters.years} onToggle={(v) => toggleInArray('years', v)} />
        </Section>

        <Section title="处理器厂商">
          <Chips
            items={SOC_BRANDS}
            active={filters.socBrands}
            onToggle={(v) => toggleInArray('socBrands', v)}
          />
        </Section>

        <Section title="屏幕尺寸">
          <RangeSlider
            label="尺寸"
            min={SCREEN_SIZE_BOUNDS[0]}
            max={SCREEN_SIZE_BOUNDS[1]}
            step={0.1}
            value={filters.screenSizeRange}
            onChange={(next) => update('screenSizeRange', next)}
            format={(n) => `${n.toFixed(1)} 英寸`}
          />
        </Section>

        <Section title="电池容量">
          <RangeSlider
            label="容量"
            min={BATTERY_BOUNDS[0]}
            max={BATTERY_BOUNDS[1]}
            step={100}
            value={filters.batteryRange}
            onChange={(next) => update('batteryRange', next)}
            format={(n) => `${n}mAh`}
          />
        </Section>

        <Section title="形态">
          <Chips
            items={formFactorOptions.map((ff) => FORM_FACTOR_LABELS[ff] ?? ff)}
            active={filters.formFactors.map((ff) => FORM_FACTOR_LABELS[ff] ?? ff)}
            onToggle={(label) => {
              const ff = formFactorOptions.find((item) => (FORM_FACTOR_LABELS[item] ?? item) === label);
              if (ff) toggleInArray('formFactors', ff);
            }}
          />
          {formFactorOptions.length === 0 ? (
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">该品类暂无机型数据</p>
          ) : null}
        </Section>

        <Section title="特性">
          <div className="space-y-0.5">
            <Toggle
              label="支持无线充电"
              checked={filters.wirelessOnly}
              onChange={(next) => update('wirelessOnly', next)}
            />
            <Toggle
              label="IP68 及以上"
              checked={filters.ip68Only}
              onChange={(next) => update('ip68Only', next)}
            />
            <Toggle label="支持 NFC" checked={filters.nfcOnly} onChange={(next) => update('nfcOnly', next)} />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {featureOptions.map((def) => {
              const on = filters.features.includes(def.id);
              return (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => toggleInArray('features', def.id)}
                  className={`psc-chip ${on ? 'psc-chip-on' : 'psc-chip-off'}`}
                  aria-pressed={on}
                >
                  {def.label}
                </button>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}

export default FilterPanel;
