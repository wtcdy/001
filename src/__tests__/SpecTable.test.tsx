import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SpecTable } from '../components/SpecTable';

import { makePhone } from './fixtures';

/** 两款同品牌机型：处理器 / 屏幕尺寸 / 电池容量 不同，品牌 / 分辨率 / 屏幕材质 相同 */
const phoneA = makePhone({
  id: 'a',
  brand: 'Apple',
  name: 'iPhone 15 Pro',
  releaseDate: '2023-09',
  screen: { size: 6.1, resolution: '2556x1179', refreshRate: 120 },
  performance: { soc: 'A17 Pro' },
  battery: { capacity: 4441 },
  camera: { telephoto: '1200万像素' },
  frontCamera: '1200万像素',
});

const phoneB = makePhone({
  id: 'b',
  brand: 'Apple',
  name: 'iPhone 16 Pro',
  releaseDate: '2024-09',
  screen: { size: 6.3, resolution: '2556x1179', refreshRate: 120 },
  performance: { soc: 'A18 Pro' },
  battery: { capacity: 4685 },
  camera: { telephoto: null },
  frontCamera: '1200万像素',
});

describe('SpecTable 组件', () => {
  it('渲染参与对比的机型名与品牌', () => {
    render(<SpecTable phones={[phoneA, phoneB]} diffOnly={false} />);
    // 机型名会在表头与「机型名称」行各出现一次，因此用 getAllByText
    expect(screen.getAllByText('iPhone 15 Pro').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('iPhone 16 Pro').length).toBeGreaterThanOrEqual(2);
    // 表头副标题格式：品牌 · 发布时间
    expect(screen.getAllByText(/Apple · 2023-09/).length).toBe(1);
    expect(screen.getAllByText(/Apple · 2024-09/).length).toBe(1);
  });

  it('关闭「只看不同」时展示全部参数行（含取值相同的行）', () => {
    render(<SpecTable phones={[phoneA, phoneB]} diffOnly={false} />);
    // 品牌两款相同，默认仍展示
    expect(screen.getByText('品牌')).toBeInTheDocument();
    // 处理器两款不同
    expect(screen.getByText('处理器')).toBeInTheDocument();
    expect(screen.getByText('A17 Pro')).toBeInTheDocument();
    expect(screen.getByText('A18 Pro')).toBeInTheDocument();
  });

  it('开启「只看不同」后，取值相同的行被隐藏、不同的行保留', () => {
    render(<SpecTable phones={[phoneA, phoneB]} diffOnly />);
    // 相同：品牌 / 分辨率 / 刷新率 / 前置摄像头
    expect(screen.queryByText('品牌')).toBeNull();
    expect(screen.queryByText('分辨率')).toBeNull();
    expect(screen.queryByText('刷新率')).toBeNull();
    // 不同：机型名称 / 发布时间 / 处理器 / 屏幕尺寸 / 电池容量
    expect(screen.getByText('机型名称')).toBeInTheDocument();
    expect(screen.getByText('发布时间')).toBeInTheDocument();
    expect(screen.getByText('处理器')).toBeInTheDocument();
    expect(screen.getByText('屏幕尺寸')).toBeInTheDocument();
    expect(screen.getByText('电池容量')).toBeInTheDocument();
  });

  it('开启「只看不同」后，整组都无差异的分组不再渲染', () => {
    render(<SpecTable phones={[phoneA, phoneB]} diffOnly />);
    // 前置组只有一行且两款取值相同，整组应被隐藏
    expect(screen.queryByRole('button', { name: /前置/ })).toBeNull();
    // 屏幕组存在差异，仍渲染
    expect(screen.getByRole('button', { name: /屏幕/ })).toBeInTheDocument();
  });

  it('缺失值渲染为「—」', () => {
    render(<SpecTable phones={[phoneA, phoneB]} diffOnly={false} />);
    const telephotoRow = screen.getByText('长焦').closest('tr');
    expect(telephotoRow).not.toBeNull();
    expect(telephotoRow?.textContent).toContain('1200万像素');
    expect(telePhotoDash(telephotoRow)).toBe(true);
  });

  it('数值行带单位展示，并对更优/更差值做标记', () => {
    render(<SpecTable phones={[phoneA, phoneB]} diffOnly />);
    const batteryRow = screen.getByText('电池容量').closest('tr');
    const text = batteryRow?.textContent ?? '';
    // 单位
    expect(text).toContain('4441mAh');
    expect(text).toContain('4685mAh');
    // 电池容量 better='higher'：4685 为优、4441 为弱
    expect(text).toContain('优');
    expect(text).toContain('弱');
  });

  it('分组标题可折叠：点击后该组参数行不再渲染', async () => {
    render(<SpecTable phones={[phoneA, phoneB]} diffOnly />);
    expect(screen.getByText('处理器')).toBeInTheDocument();
    const groupButton = screen.getByRole('button', { name: /性能/ });
    expect(groupButton).toHaveAttribute('aria-expanded', 'true');
    // 必须用 fireEvent（内部包 act），否则 React 状态更新不会同步刷新到 DOM
    fireEvent.click(groupButton);
    expect(screen.queryByText('处理器')).toBeNull();
    expect(groupButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('单款机型也能正常渲染（不因 diff 计算而崩溃）', () => {
    render(<SpecTable phones={[phoneA]} diffOnly />);
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
  });
});

/** 断言某一行里确实渲染了占位符「—」 */
function telePhotoDash(row: Element | null | undefined): boolean {
  if (!row) return false;
  const cells = Array.from(row.querySelectorAll('td'));
  return cells.some((cell) => cell.textContent?.trim() === '—');
}
