import { useMemo } from 'react';

import { RotateCcw, SlidersHorizontal } from 'lucide-react';

import {
  BOUNDS_BY_CATEGORY,
  BRANDS_BY_CATEGORY,
  DEVICES_BY_CATEGORY,
  FORM_FACTORS_BY_CATEGORY,
  SOC_BRANDS_BY_CATEGORY,
  YEARS_BY_CATEGORY,
} from '../data';
import type { Filters } from '../hooks/useFilters';
import { FORM_FACTOR_LABELS } from '../constants';
import type { Device } from '../types/device';
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
  onClear,
  cleared,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  format: (n: number) => string;
  /** 提供时显示「不限」按钮：把区间置回 null（不参与筛选） */
  onClear?: () => void;
  /** 当前是否处于「不限」状态 */
  cleared?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span className="flex items-center gap-1.5 font-medium tabular-nums">
          {cleared ? (
            <span className="text-slate-400 dark:text-slate-500">不限</span>
          ) : (
            <span>
              {format(value[0])} — {format(value[1])}
            </span>
          )}
          {onClear && !cleared ? (
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] font-normal text-slate-400 underline-offset-2 hover:text-brand-600 hover:underline dark:text-slate-500 dark:hover:text-brand-400"
              aria-label={`清除${label}筛选`}
            >
              不限
            </button>
          ) : null}
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

  // 品牌 / 年份 / 处理器厂商 / 三条滑块边界：全部按当前品类取，
  // 否则切到平板后看到的还是手机的品牌与年份，且滑块边界会把平板全筛掉。
  const bounds = BOUNDS_BY_CATEGORY[category];
  const brandOptions = BRANDS_BY_CATEGORY[category] ?? [];
  const yearOptions = YEARS_BY_CATEGORY[category] ?? [];
  const socBrandOptions = SOC_BRANDS_BY_CATEGORY[category] ?? [];

  /**
   * 厚度 / 重量的边界：**必须按当前品类从数据派生**。
   *
   * 手机 6-10mm / 150-250g，平板 5-8mm / 300-900g，用一套固定区间
   * 不是「筛不准」，而是会直接把整个品类筛成 0 条。
   */
  const bodyBounds = useMemo(() => {
    const devices: Device[] = DEVICES_BY_CATEGORY[category] ?? [];
    const numbers = (pick: (device: Device) => number | null): number[] =>
      devices
        .map(pick)
        .filter((value): value is number => typeof value === 'number' && value > 0);

    const thicknesses = numbers((device) => device.body?.thickness ?? null);
    const weights = numbers((device) => device.body?.weight ?? null);

    const round = (value: number, step: number, fn: (n: number) => number): number =>
      Number((fn(value / step) * step).toFixed(1));

    return {
      thickness: thicknesses.length
        ? ([round(Math.min(...thicknesses), 0.1, Math.floor), round(Math.max(...thicknesses), 0.1, Math.ceil)] as [number, number])
        : ([4, 20] as [number, number]),
      weight: weights.length
        ? ([round(Math.min(...weights), 10, Math.floor), round(Math.max(...weights), 10, Math.ceil)] as [number, number])
        : ([100, 1000] as [number, number]),
    };
  }, [category]);

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
          <Chips
            items={brandOptions}
            active={filters.brands}
            onToggle={(v) => toggleInArray('brands', v)}
          />
        </Section>

        <Section title="价格区间">
          <RangeSlider
            label="价格（渠道低价）"
            min={bounds.price[0]}
            max={bounds.price[1]}
            step={100}
            value={filters.priceRange}
            onChange={(next) => update('priceRange', next)}
            format={(n) => `¥${n.toLocaleString('zh-CN')}`}
          />
          {/*
            口径说明：滑块筛的是「渠道低价（京东 / 拼多多取低）」而不是「参考价」，
            与卡片上主视觉展示的渠道价一致。
            不用国补后到手价的原因：单价 > 6000 元的机型不享受国补，
            用国补价排序会让这批机型的顺序与展示价格对不上。
          */}
          <p className="mt-1 text-[11px] leading-tight text-slate-400 dark:text-slate-500">
            按京东 / 拼多多的渠道低价筛选与排序（国补不计入）；没有渠道报价的机型回落到参考现价。
          </p>
        </Section>

        <Section title="发布年份">
          <Chips
            items={yearOptions}
            active={filters.years}
            onToggle={(v) => toggleInArray('years', v)}
          />
        </Section>

        <Section title="处理器厂商">
          <Chips
            items={socBrandOptions}
            active={filters.socBrands}
            onToggle={(v) => toggleInArray('socBrands', v)}
          />
        </Section>

        <Section title="屏幕尺寸">
          <RangeSlider
            label="尺寸"
            min={bounds.screenSize[0]}
            max={bounds.screenSize[1]}
            step={0.1}
            value={filters.screenSizeRange}
            onChange={(next) => update('screenSizeRange', next)}
            format={(n) => `${n.toFixed(1)} 英寸`}
          />
        </Section>

        <Section title="电池容量">
          <RangeSlider
            label="容量"
            min={bounds.battery[0]}
            max={bounds.battery[1]}
            step={100}
            value={filters.batteryRange}
            onChange={(next) => update('batteryRange', next)}
            format={(n) => `${n}mAh`}
          />
        </Section>

        <Section title="机身厚度">
          <RangeSlider
            label="厚度"
            min={bodyBounds.thickness[0]}
            max={bodyBounds.thickness[1]}
            step={0.1}
            value={filters.thicknessRange ?? bodyBounds.thickness}
            onChange={(next) => update('thicknessRange', next)}
            onClear={() => update('thicknessRange', null)}
            cleared={filters.thicknessRange === null}
            format={(n) => `${n.toFixed(1)}mm`}
          />
          {/*
            口径说明：厚度由工厂从三围串（'163.37x76.71x8.13mm'）第三段解析回填，
            没写三围或格式不规整的机型厚度为空，这类机型不会被厚度筛选排除
            ——否则「数据缺失」会被误当成「不符合条件」。
          */}
          <p className="mt-1 text-[11px] leading-tight text-slate-400 dark:text-slate-500">
            厚度取自官方三围标注；未标注三围的机型不参与该筛选。
          </p>
        </Section>

        <Section title="重量">
          <RangeSlider
            label="重量"
            min={bodyBounds.weight[0]}
            max={bodyBounds.weight[1]}
            step={10}
            value={filters.weightRange ?? bodyBounds.weight}
            onChange={(next) => update('weightRange', next)}
            onClear={() => update('weightRange', null)}
            cleared={filters.weightRange === null}
            format={(n) => `${n}g`}
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
