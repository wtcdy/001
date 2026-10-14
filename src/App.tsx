import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { Github, LayoutGrid } from 'lucide-react';

import { DATA_UPDATED_AT, PRICE_DISCLAIMER, REPO_URL } from './constants';
import ThemeToggle from './components/ThemeToggle';
import ComparePage from './pages/ComparePage';
import LibraryPage from './pages/LibraryPage';
import { ALL_PHONES } from './data';

/** 顶部导航 + 页脚外壳 */
function Shell() {
  const location = useLocation();
  const onCompare = location.pathname.startsWith('/compare');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-[#0d1017]/90">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3">
          <a href="#/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              机
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-50">手机参数对比</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                全网 {ALL_PHONES.length} 款机型 · 横向参数比对
              </span>
            </span>
          </a>

          <nav className="flex items-center gap-2">
            {onCompare ? (
              <a href="#/" className="psc-btn-ghost !py-1.5 !text-xs">
                <LayoutGrid size={13} aria-hidden="true" />
                机型库
              </a>
            ) : null}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="psc-btn-ghost !py-1.5 !text-xs"
              title="在 GitHub 上查看本项目"
            >
              <Github size={13} aria-hidden="true" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-700 dark:bg-[#0d1017]">
        <div className="mx-auto max-w-[1400px] px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>数据为公开参数整理，仅供参考，以官方为准。</p>
          <p className="mt-1">本站为纯静态工具，不采集任何个人信息，所有数据均内置于前端包中。</p>
          <p className="mt-1">数据更新日期：{DATA_UPDATED_AT}（静态快照，非实时更新）</p>
          <p className="mt-1">{PRICE_DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
}

/** 应用根组件：使用 HashRouter 以适配 GitHub Pages 子路径部署 */
export function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}

export default App;
