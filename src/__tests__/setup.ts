/**
 * 单元测试全局初始化。
 *
 * - 引入 @testing-library/jest-dom 的断言扩展（toBeInTheDocument 等）
 * - 补齐 jsdom 缺失的浏览器 API（matchMedia 等），避免组件测试报错
 */
import '@testing-library/jest-dom/vitest';

import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// jsdom 未实现 matchMedia，useTheme 等 Hook 会用到
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}
