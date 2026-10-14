import { Moon, Sun } from 'lucide-react';

import { useTheme } from '../hooks/useTheme';

/** 深色 / 浅色主题切换按钮 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="psc-btn-ghost"
      aria-label={isDark ? '切换到浅色主题' : '切换到深色主题'}
      title={isDark ? '切换到浅色主题' : '切换到深色主题'}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
      <span className="hidden sm:inline">{isDark ? '浅色' : '深色'}</span>
    </button>
  );
}

export default ThemeToggle;
