import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeft, Check, Link2, Plus, RefreshCw, Search, Smartphone, X } from 'lucide-react';

import BrandAvatar from '../components/BrandAvatar';
import EmptyState from '../components/EmptyState';
import SpecTable from '../components/SpecTable';
import { PRICE_DISCLAIMER } from '../constants';
import { ALL_PHONES, dealOfPhone, getPhonesByIds } from '../data';
import { MAX_COMPARE, useCompare } from '../hooks/useCompare';
import { formatYuan } from '../utils/price';

/** 对比页：顶部机型卡 + 参数表（只看不同 / 差异高亮 / 分享链接） */
export function ComparePage() {
  const navigate = useNavigate();
  const compare = useCompare();
  const [diffOnly, setDiffOnly] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const [copied, setCopied] = useState(false);

  const phones = useMemo(() => getPhonesByIds(compare.ids), [compare.ids]);

  /** 换机型/添加机型的可选列表 */
  const candidates = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return ALL_PHONES.filter((phone) => {
      if (compare.ids.includes(phone.id)) return false;
      if (kw === '') return true;
      return `${phone.name} ${phone.brand} ${phone.performance?.soc ?? ''}`.toLowerCase().includes(kw);
    }).slice(0, 60);
  }, [keyword, compare.ids]);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时降级：提示用户手动复制
      window.prompt('复制以下链接分享对比结果：', url);
    }
  };

  if (phones.length < 2) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-10">
        <EmptyState
          title="至少需要 2 款机型才能对比"
          description="返回机型库挑选 2-4 款机型，即可查看逐项参数对比与差异高亮。"
          icon={<Smartphone size={40} aria-hidden="true" />}
          action={
            <button type="button" onClick={() => navigate('/')} className="psc-btn-primary">
              去挑选机型
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-6">
      {/* 顶部操作区 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => navigate('/')} className="psc-btn-ghost">
          <ArrowLeft size={14} aria-hidden="true" />
          返回机型库
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-transparent dark:text-slate-200">
            <input
              type="checkbox"
              checked={diffOnly}
              onChange={(e) => setDiffOnly(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            只看不同
          </label>

          <button type="button" onClick={handleCopyLink} className="psc-btn-ghost">
            {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
            {copied ? '已复制' : '复制分享链接'}
          </button>

          <button type="button" onClick={compare.clear} className="psc-btn-danger">
            <RefreshCw size={14} aria-hidden="true" />
            清空对比
          </button>
        </div>
      </div>

      {/* 已选机型卡片区 */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {phones.map((phone, index) => {
          const deal = dealOfPhone(phone);
          return (
            <div key={phone.id} className="psc-card relative p-3">
              <button
                type="button"
                onClick={() => compare.remove(phone.id)}
                className="absolute right-2 top-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700"
                aria-label={`移除 ${phone.name}`}
              >
                <X size={14} aria-hidden="true" />
              </button>

              <div className="flex items-start gap-2.5">
                <BrandAvatar brand={phone.brand} phone={phone} sizeClass="h-10 w-10" />
                <div className="min-w-0 flex-1 pr-5">
                  <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50" title={phone.name}>
                    {phone.name}
                  </h3>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {phone.brand} · {phone.releaseDate}
                  </p>
                </div>
              </div>

              {/* 价格区：与机型库卡片口径一致 —— 渠道低价 + 国补后到手价 */}
              <div className="mt-2">
                {deal.hasPrice ? (
                  <>
                    <div className="text-sm font-bold text-brand-600 dark:text-brand-400">
                      国补后 ¥{formatYuan(deal.finalPrice)}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {deal.bestChannel === 'jd' ? '京东自营' : '拼多多百亿补贴'} ¥
                      {formatYuan(deal.bestPrice)}
                      {deal.eligible ? (
                        <span className="ml-1 text-red-600 dark:text-red-400">
                          省 ¥{formatYuan(deal.subsidy)}
                        </span>
                      ) : (
                        <span className="ml-1">超出国补范围</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-sm font-bold text-slate-400 dark:text-slate-500">暂无报价</div>
                )}
              </div>

              <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                {phone.performance?.soc ?? '—'} · {phone.screen?.size ? `${phone.screen.size}英寸` : '—'} ·{' '}
                {phone.battery?.capacity ? `${phone.battery.capacity}mAh` : '—'}
              </p>

              <button
                type="button"
                onClick={() => setPickerIndex(index)}
                className="psc-btn-ghost mt-2.5 w-full !py-1.5 !text-xs"
              >
                <RefreshCw size={12} aria-hidden="true" />
                换机型
              </button>
            </div>
          );
        })}

        {phones.length < MAX_COMPARE ? (
          <button
            type="button"
            onClick={() => setPickerIndex(phones.length)}
            className="flex min-h-[9rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-500 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-brand-300"
          >
            <Plus size={22} aria-hidden="true" />
            添加机型（还可加 {MAX_COMPARE - phones.length} 款）
          </button>
        ) : null}
      </div>

      {/* 参数对比表 */}
      <SpecTable phones={phones} diffOnly={diffOnly} />

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        数据为公开参数整理，仅供参考，以官方为准。更优项以
        <span className="mx-1 font-semibold text-red-500">红色</span>
        标记，较弱项以
        <span className="mx-1 font-semibold text-green-600">绿色</span>
        标记。
      </p>
      <p className="mt-1.5 text-center text-xs text-slate-400 dark:text-slate-500">
        {PRICE_DISCLAIMER}
      </p>

      {/* 换机型 / 添加机型弹窗 */}
      {pickerIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="选择机型"
          onClick={() => setPickerIndex(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl dark:bg-[#151822]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {pickerIndex < phones.length ? `替换「${phones[pickerIndex]?.name ?? ''}」` : '添加机型'}
              </h3>
              <button
                type="button"
                onClick={() => setPickerIndex(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="关闭"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="border-b border-slate-200 p-3 dark:border-slate-700">
              <div className="relative">
                <Search
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索机型"
                  className="psc-input !pl-9"
                  aria-label="搜索可添加的机型"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {candidates.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">没有匹配的机型</p>
              ) : (
                <ul className="space-y-1">
                  {candidates.map((phone) => (
                    <li key={phone.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (pickerIndex < phones.length) {
                            compare.replaceAt(pickerIndex, phone.id);
                          } else {
                            compare.add(phone.id);
                          }
                          setPickerIndex(null);
                          setKeyword('');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <BrandAvatar
                          brand={phone.brand}
                          phone={phone}
                          sizeClass="h-8 w-8"
                          radiusClass="rounded-lg"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-slate-800 dark:text-slate-100">
                            {phone.name}
                          </span>
                          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                            {phone.brand} · {phone.performance?.soc ?? '—'}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ComparePage;
