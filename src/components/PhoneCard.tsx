import { BatteryCharging, CalendarDays, Cpu, Monitor, Plus, Tag } from 'lucide-react';

import BrandAvatar from './BrandAvatar';
import { SUBSIDY_POLICY } from '../constants';
import { dealOfPhone } from '../data';
import { MAX_COMPARE } from '../hooks/useCompare';
import { formatYuan } from '../utils/price';
import { storageSpecOf } from '../utils/storageSpec';
import type { Phone } from '../types/phone';

export interface PhoneCardProps {
  /** 机型数据 */
  phone: Phone;
  /** 是否已加入对比 */
  selected: boolean;
  /** 点击「加入对比」按钮 */
  onToggle: (id: string) => void;
  /**
   * 对比栏已满（达到 MAX_COMPARE）。
   * 未选中的卡片会进入「弱化 + aria-disabled」状态：仍然可点击，
   * 点击后由父组件给出浮层提示，而不是静默吞掉。
   */
  disabled?: boolean;
}

function InfoItem({
  icon,
  text,
  title,
}: {
  icon: React.ReactNode;
  text: string | null;
  title: string;
}) {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400" title={title}>
      {icon}
      <span className="truncate">{text ?? '—'}</span>
    </div>
  );
}

/**
 * 渠道报价块：主视觉是渠道价本身，有价时高亮并打「更低」角标。
 * `tag` 是渠道性质角标（京东自营 = 自营），与渠道名分开展示。
 * `spec` 是该价格对应的内存配置（如 '12+256'），跟在价格后以全角括号展示；null 时不追加。
 */
function ChannelPrice({
  label,
  tag,
  price,
  best,
  spec,
}: {
  label: string;
  tag: string;
  price: number | null;
  best: boolean;
  spec: string | null;
}) {
  return (
    <div
      className={`rounded-lg border px-2 py-1.5 ${
        best
          ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10'
          : 'border-slate-200 bg-transparent dark:border-slate-700'
      }`}
      title={best ? '两渠道中的低价渠道' : undefined}
    >
      <div className="flex items-center gap-1">
        <span className="truncate text-[11px] leading-tight text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="shrink-0 rounded bg-slate-100 px-1 text-[10px] leading-tight text-slate-500 dark:bg-slate-700/60 dark:text-slate-400">
          {tag}
        </span>
        {best ? (
          <span className="ml-auto shrink-0 rounded bg-brand-500 px-1 text-[10px] leading-tight font-medium text-white">
            更低
          </span>
        ) : null}
      </div>
      <div
        className={`text-base font-semibold ${
          best ? 'text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {price !== null ? (
          <>
            ¥{formatYuan(price)}
            {spec ? <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">（{spec}）</span> : null}
          </>
        ) : (
          '—'
        )}
      </div>
    </div>
  );
}

/** 机型卡片：展示核心参数 + 京东自营渠道价（含配置）+ 加入对比按钮 */
export function PhoneCard({ phone, selected, onToggle, disabled = false }: PhoneCardProps) {
  const deal = dealOfPhone(phone);
  /** 渠道价对应的最低配配置（如 12+256），来自 PRICES[id].spec */
  const channelSpec = deal.hasPrice ? deal.spec.trim() || null : null;
  /** 官网价对应的最低配配置，来自机型 ram/rom 数组 */
  const officialSpec = storageSpecOf(phone);
  const launchPrice = phone.launchPrice ?? null;
  /** 对比栏已满且本卡未选中 —— 此时「加入对比」不可用，但按钮仍可点击 */
  const limitReached = disabled && !selected;

  return (
    <div
      className={`psc-card flex flex-col p-4 ${selected ? 'ring-2 ring-brand-500 dark:ring-brand-400' : ''}`}
    >
      <div className="flex items-start gap-3">
        <BrandAvatar brand={phone.brand} phone={phone} sizeClass="h-11 w-11" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50" title={phone.name}>
            {phone.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {phone.brand} · {phone.releaseDate}
          </p>
        </div>
      </div>

      {/*
        价格区：主视觉是京东自营价（单渠道口径，拼多多已下线），
        价格后直接带内存配置（如 ¥5999（12+256）），国补后到手价作辅助信息。
        没有渠道报价的机型（不在 PRICES 表里）回落到官网售价——
        官网价是真实可买的价格，目的是给出能买到的最低价；
        只有官网下架且渠道也无货时才显示「暂无报价」。
      */}
      <div className="mt-3">
        {deal.hasPrice ? (
          <>
            <ChannelPrice
              label="京东自营"
              tag="自营"
              price={deal.jd}
              best={deal.bestChannel === 'jd'}
              spec={channelSpec}
            />

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              {deal.eligible ? (
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  国补后 ¥{formatYuan(deal.finalPrice)}（省 ¥{formatYuan(deal.subsidy)}）
                </span>
              ) : (
                <span
                  className="text-[11px] text-slate-400 dark:text-slate-500"
                  title={SUBSIDY_POLICY.source}
                >
                  超出国补范围（≤{SUBSIDY_POLICY.priceCeiling}元）
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {deal.updatedAt ? `报价更新 ${deal.updatedAt}` : '报价日期未知'}
              </span>
              {deal.isReference ? (
                <span
                  className="cursor-help rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                  title="该价格为参考估算（官网价 × 折扣模型推导），非平台实时抓取，实际购买请以平台页面结算价为准。"
                >
                  参考价 · 非实时抓取
                </span>
              ) : null}
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-baseline gap-2">
            {phone.currentPrice != null ? (
              <>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  官网价 ¥{formatYuan(phone.currentPrice)}
                  {officialSpec ? `（${officialSpec}）` : ''}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">暂无渠道报价</span>
              </>
            ) : launchPrice ? (
              <>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  官网价 ¥{launchPrice.toLocaleString('zh-CN')}
                  {officialSpec ? `（${officialSpec}）` : ''}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">首发价 · 暂无渠道报价</span>
              </>
            ) : (
              <span className="text-sm text-slate-400 dark:text-slate-500">暂无报价</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-y-1.5">
        <InfoItem
          icon={<Cpu size={13} aria-hidden="true" />}
          text={phone.performance?.soc ?? null}
          title="处理器"
        />
        <InfoItem
          icon={<Monitor size={13} aria-hidden="true" />}
          text={phone.screen?.size ? `${phone.screen.size}英寸` : null}
          title="屏幕尺寸"
        />
        <InfoItem
          icon={<BatteryCharging size={13} aria-hidden="true" />}
          text={phone.battery?.capacity ? `${phone.battery.capacity}mAh` : null}
          title="电池容量"
        />
        <InfoItem
          icon={<CalendarDays size={13} aria-hidden="true" />}
          text={phone.releaseDate ?? null}
          title="发布时间"
        />
      </div>

      {phone.camera?.main ? (
        <p className="mt-2 line-clamp-1 text-xs text-slate-500 dark:text-slate-400" title={phone.camera.main}>
          主摄：{phone.camera.main}
        </p>
      ) : null}

      {phone.tags && phone.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {phone.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
            >
              <Tag size={10} aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {/*
        满 4 款且本卡未选中时，**不**使用 disabled：
        disabled 会吞掉点击事件，上层就收不到「用户想加但已经满了」这个信号，
        页面无法给出任何反馈（移动端没有 hover，连 title 都看不到，等于点了没反应）。
        正确做法是：视觉弱化 + aria-disabled 保留无障碍语义 + title 继续引用 MAX_COMPARE，
        点击照常冒泡到父组件，由 LibraryPage 弹出浮层 Toast。
      */}
      <button
        type="button"
        onClick={() => onToggle(phone.id)}
        aria-disabled={limitReached ? 'true' : undefined}
        title={limitReached ? `最多同时对比 ${MAX_COMPARE} 款机型，请先移除一款` : undefined}
        className={`mt-4 w-full ${selected ? 'psc-btn-primary' : 'psc-btn-ghost'} ${
          limitReached ? 'cursor-not-allowed opacity-60' : ''
        }`}
      >
        <Plus size={14} aria-hidden="true" className={selected ? 'rotate-45' : ''} />
        {selected ? '已加入对比' : '加入对比'}
      </button>

      {/*
        常驻可见的上限说明：点击后的 Toast 是瞬时反馈，卡片上保留一行静态说明，
        用户扫一眼就能知道「不是坏了，是满了」。
        文案放在按钮之外（不改按钮的可访问名称），避免影响既有用例按名称统计按钮。
      */}
      {limitReached ? (
        <p className="mt-1.5 text-center text-[11px] leading-tight text-amber-600 dark:text-amber-400">
          已达 {MAX_COMPARE} 款上限，移除一款后可加入
        </p>
      ) : null}
    </div>
  );
}

export default PhoneCard;
