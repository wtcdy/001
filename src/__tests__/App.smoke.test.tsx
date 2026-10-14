import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import App from '../App';
import { ALL_PHONES } from '../data';

/**
 * 整体冒烟测试：在 jsdom 中真实挂载 App（HashRouter + 页面 + 组件 + 数据），
 * 用来替代无法在本机沙箱完成的浏览器访问（localhost 被代理拦截，见测试报告）。
 */
describe('App 整体冒烟', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '#/';
  });

  it('首页渲染成功：顶部统计数字与机型卡片同时出现', () => {
    render(<App />);
    expect(
      screen.getByText(`全网 ${ALL_PHONES.length} 款机型 · 横向参数比对`),
    ).toBeInTheDocument();
    expect(screen.getByText(/共收录/)).toBeInTheDocument();
    // 每张卡片都有「加入对比」按钮
    expect(screen.getAllByRole('button', { name: '加入对比' })).toHaveLength(ALL_PHONES.length);
    // 未达上限时不应出现「已达上限」提示
    expect(screen.queryByText(/已达\s*\d+\s*款上限/)).toBeNull();
  });

  it('搜索关键词能收敛结果集', () => {
    render(<App />);
    const input = screen.getByLabelText('搜索机型');
    fireEvent.change(input, { target: { value: 'iPhone' } });
    const buttons = screen.getAllByRole('button', { name: '加入对比' });
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons.length).toBeLessThan(ALL_PHONES.length);
  });

  it('无结果时展示空状态与「重置全部筛选」入口', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('搜索机型'), {
      target: { value: '一定不存在的机型名称xyz' },
    });
    expect(screen.getByText('没有找到符合条件的机型')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '重置全部筛选' })).toBeInTheDocument();
  });

  it('加入对比：选中 4 款后其余卡片按钮弱化，点击弹出上限提示（MAX_COMPARE=4 生效）', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button', { name: '加入对比' });
    for (let i = 0; i < 4; i += 1) {
      fireEvent.click(buttons[i]);
    }
    expect(screen.getAllByRole('button', { name: '已加入对比' })).toHaveLength(4);
    const remaining = screen.getAllByRole('button', { name: '加入对比' });
    expect(remaining.length).toBe(ALL_PHONES.length - 4);

    /**
     * 行为变更说明（非回归）：满额按钮不再用 disabled —— disabled 会吞掉点击事件，
     * 导致移动端点下去完全没反应。现在改用 aria-disabled 保留无障碍语义，
     * 按钮本体仍然可点击，点击后由页面弹出浮层 Toast 说明原因。
     * 因此这里从 toBeDisabled() 改为断言 aria-disabled="true"。
     */
    expect(remaining[0]).not.toBeDisabled();
    expect(remaining[0]).toHaveAttribute('aria-disabled', 'true');

    /**
     * title 必须继续引用 MAX_COMPARE 常量（不能硬编码 4），否则改上限时文案会失真。
     * title 只在鼠标 hover 时可见，触屏看不到，所以它只是桌面端的补充反馈。
     */
    expect(remaining[0]).toHaveAttribute('title', '最多同时对比 4 款机型，请先移除一款');

    /**
     * 卡片上的「常驻可见」上限说明：不需要任何交互就能看到，保证用户扫一眼就明白
     * 「不是坏了，是满了」。这条断言锁住该文案，防止后人误删。
     */
    expect(screen.getAllByText('已达 4 款上限，移除一款后可加入')).toHaveLength(
      ALL_PHONES.length - 4,
    );

    /**
     * 移动端反馈闭环：点击被弱化的按钮后必须弹出浮层 Toast（不依赖 hover），
     * 且这一次点击不会改变已选集合（toggle 返回 false）。
     */
    expect(screen.queryByText('最多同时对比 4 款机型，请先移除一款')).toBeNull();
    fireEvent.click(remaining[0]);
    expect(screen.getByText('最多同时对比 4 款机型，请先移除一款')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '已加入对比' })).toHaveLength(4);
  });

  it('对比页渲染参数表，并支持「只看不同」切换', () => {
    // 取同品牌的两款机型，保证「品牌」这一行取值相同、可被「只看不同」隐藏
    const sameBrand = ALL_PHONES.filter((phone) => phone.brand === 'Apple');
    expect(sameBrand.length).toBeGreaterThanOrEqual(2);
    const [a, b] = sameBrand;
    window.location.hash = `#/compare?ids=${a.id},${b.id}`;

    render(<App />);

    // 参数表渲染成功
    expect(screen.getByText('参数项')).toBeInTheDocument();
    expect(screen.getAllByText(a.name).length).toBeGreaterThan(0);
    expect(screen.getAllByText(b.name).length).toBeGreaterThan(0);

    // 默认展示全部参数行（含取值相同的「品牌」）
    expect(screen.getByText('品牌')).toBeInTheDocument();

    // 打开「只看不同」后，取值相同的行被隐藏
    fireEvent.click(screen.getByLabelText('只看不同'));
    expect(screen.queryByText('品牌')).toBeNull();
  });

  it('对比页在不足 2 款机型时给出引导空状态', () => {
    window.location.hash = '#/compare';
    render(<App />);
    expect(screen.getByText('至少需要 2 款机型才能对比')).toBeInTheDocument();
  });
});
