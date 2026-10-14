import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search, Smartphone, X } from 'lucide-react';

import CompareBar from '../components/CompareBar';
import EmptyState from '../components/EmptyState';
import FilterPanel from '../components/FilterPanel';
import PhoneCard from '../components/PhoneCard';
import { ALL_PHONES, getPhonesByIds } from '../data';
import { MAX_COMPARE, useCompare } from '../hooks/useCompare';
import { useFilters } from '../hooks/useFilters';

/** Toast 停留时长（毫秒）：移动端点击被拦下时的即时反馈 */
const TOAST_DURATION = 2400;

/** 机型库首页：搜索 + 筛选 + 卡片网格 + 底部对比栏 */
export function LibraryPage() {
  const navigate = useNavigate();
  const compare = useCompare();
  const { filters, update, toggleInArray, reset, sortKey, setSortKey, filtered, total, active } =
    useFilters(ALL_PHONES);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const selectedPhones = useMemo(() => getPhonesByIds(compare.ids), [compare.ids]);

  /** 弹出一条会自动消失的提示；重复触发时重置计时，避免连点后提示提前消失 */
  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, TOAST_DURATION);
  }, []);

  // 卸载 / 离开页面时清掉挂起的定时器，避免在已卸载组件上 setState
  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  /**
   * 加入 / 移出对比。
   * 满 4 款时 toggle() 返回 false，此时弹出浮层提示——按钮没有用 disabled，
   * 所以这个分支真正可达，移动端也能看到反馈（title 只在 hover 时可见，触屏看不到）。
   */
  const handleToggle = (id: string) => {
    const changed = compare.toggle(id);
    if (!changed) showToast(`最多同时对比 ${MAX_COMPARE} 款机型，请先移除一款`);
  };

  const handleCompare = () => {
    if (compare.ids.length < 2) return;
    navigate(`/compare?ids=${compare.ids.join(',')}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6">
      {/* 搜索栏 */}
      <div className="psc-card mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={filters.keyword}
              onChange={(e) => update('keyword', e.target.value)}
              placeholder="搜索机型名称 / 品牌 / 处理器，如「骁龙8 Elite」"
              className="psc-input !pl-9"
              aria-label="搜索机型"
            />
          </div>

          {filters.keyword ? (
            <button
              type="button"
              onClick={() => update('keyword', '')}
              className="psc-btn-ghost !py-2"
              aria-label="清空搜索"
            >
              <X size={14} aria-hidden="true" />
              清空搜索
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setShowFiltersMobile((prev) => !prev)}
            className="psc-btn-ghost !py-2 lg:hidden"
            aria-expanded={showFiltersMobile}
          >
            筛选{active ? ' · 已启用' : ''}
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          共收录 <span className="font-semibold text-slate-700 dark:text-slate-200">{total}</span> 款机型
          {active ? (
            <>
              ，当前筛选出{' '}
              <span className="font-semibold text-brand-600 dark:text-brand-400">{filtered.length}</span> 款
            </>
          ) : null}
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* 筛选侧边栏（桌面常驻 / 移动端折叠） */}
        <aside className={`w-full lg:w-72 lg:shrink-0 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
          <div className="lg:sticky lg:top-20">
            <FilterPanel
              filters={filters}
              update={update}
              toggleInArray={toggleInArray}
              reset={reset}
              sortKey={sortKey}
              setSortKey={setSortKey}
            />
          </div>
        </aside>

        {/* 机型卡片网格 */}
        <main className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <EmptyState
              title="没有找到符合条件的机型"
              description="试试放宽价格区间、取消部分品牌筛选，或换一个关键词。"
              icon={<Smartphone size={40} aria-hidden="true" />}
              action={
                <button type="button" onClick={reset} className="psc-btn-primary">
                  重置全部筛选
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((phone) => (
                <PhoneCard
                  key={phone.id}
                  phone={phone}
                  selected={compare.selected.has(phone.id)}
                  onToggle={handleToggle}
                  disabled={compare.isFull}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CompareBar
        phones={selectedPhones}
        onRemove={compare.remove}
        onClear={compare.clear}
        onCompare={handleCompare}
      />

      {/*
        浮层 Toast：fixed 定位 + z-50（高于底部对比栏的 z-40），横竖屏都居中可见，
        不依赖 hover，因此移动端点「加入对比」被上限拦下时也能立刻看到原因。
        外层 pointer-events-none，避免遮挡底部对比栏的点击。
      */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4"
        role="status"
        aria-live="polite"
      >
        {toast ? (
          <button
            type="button"
            onClick={() => setToast(null)}
            className="pointer-events-auto max-w-full rounded-full bg-slate-900/90 px-4 py-2 text-center text-sm text-white shadow-lg ring-1 ring-white/10 backdrop-blur dark:bg-slate-100/95 dark:text-slate-900 dark:ring-black/10"
          >
            {toast}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default LibraryPage;
