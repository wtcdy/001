import { BatteryCharging, CalendarDays, Cpu, Monitor, Plus, Tag } from 'lucide-react';

import BrandAvatar from './BrandAvatar';
import { SUBSIDY_POLICY } from '../constants';
import { dealOfPhone } from '../data';
import { MAX_COMPARE } from '../hooks/useCompare';
import { formatYuan } from '../utils/price';
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

/** 单个渠道报价块：价低渠道高亮 */
function ChannelPrice({
  label,
  price,
  best,
}: {
  label: string;
  price: number | null;
  best: boolean;
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
      <div className="truncate text-[11px] leading-tight text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div
        className={`text-sm font-semibold ${
          best ? 'text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {price !== null ? `¥${formatYuan(price)}` : '—'}
      </div>
    </div>
  );
}

/** 机型卡片：展示核心参数 + 渠道价 / 国补后到手价 + 加入对比按钮 */
export function PhoneCard({ phone, selected, onToggle, disabled = false }: PhoneCardProps) {
  const deal = dealOfPhone(phone);
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
        价格区：渠道价（价低者高亮） + 国补后到手价。
        没有渠道报价的机型（不在 PRICES 表里）显示「暂无报价」，不臆造价格。
      */}
      <div className="mt-3">
        {deal.hasPrice ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <ChannelPrice label="京东自营" price={deal.jd} best={deal.bestChannel === 'jd'} />
              <ChannelPrice
                label="拼多多百亿补贴"
                price={deal.pdd}
                best={deal.bestChannel === 'pdd'}
              />
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">国补后到手价</span>
              <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                ¥{formatYuan(deal.finalPrice)}
              </span>
              {deal.eligible ? (
                <span className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  省 ¥{formatYuan(deal.subsidy)}
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

            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              {deal.updatedAt ? `报价更新 ${deal.updatedAt}` : '报价日期未知'}
              {deal.isReference ? ' · 渠道参考价' : ''}
            </p>
          </>
        ) : (
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm text-slate-400 dark:text-slate-500">暂无报价</span>
            {launchPrice ? (
              <span className="text-xs text-slate-400 line-through dark:text-slate-500">
                首发价 ¥{launchPrice.toLocaleString('zh-CN')}
              </span>
            ) : null}
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
