import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { MAX_COMPARE, useCompare } from '../hooks/useCompare';

const STORAGE_KEY = 'psc-compare-ids';

/** 记录 MemoryRouter 内部的当前 location，用于断言 URL 同步 */
let latestSearch = '';

function LocationProbe(): null {
  latestSearch = useLocation().search;
  return null;
}

function renderCompare(initialSearch = '') {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[`/${initialSearch}`]}>
      <LocationProbe />
      {children}
    </MemoryRouter>
  );
  return renderHook(() => useCompare(), { wrapper });
}

describe('useCompare', () => {
  beforeEach(() => {
    latestSearch = '';
    window.localStorage.clear();
  });

  it('MAX_COMPARE 为 4', () => {
    expect(MAX_COMPARE).toBe(4);
  });

  it('初始状态为空', () => {
    const { result } = renderCompare();
    expect(result.current.ids).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.isFull).toBe(false);
  });

  it('从 URL 的 ids 参数恢复选择', () => {
    const { result } = renderCompare('?ids=p1,p2,p3');
    expect(result.current.ids).toEqual(['p1', 'p2', 'p3']);
  });

  it('URL 中的重复 id 与超过上限的 id 会被去重/截断', () => {
    const { result } = renderCompare('?ids=p1,p1,p2,p3,p4,p5');
    expect(result.current.ids).toEqual(['p1', 'p2', 'p3', 'p4']);
  });

  it('URL 为空时从 localStorage 恢复', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['a1', 'a2']));
    const { result } = renderCompare();
    expect(result.current.ids).toEqual(['a1', 'a2']);
  });

  it('localStorage 内容损坏时安全降级为空数组', () => {
    window.localStorage.setItem(STORAGE_KEY, '{ not json');
    const { result } = renderCompare();
    expect(result.current.ids).toEqual([]);
  });

  it('add 成功返回 true 并追加到末尾', () => {
    const { result } = renderCompare();
    let ok = false;
    act(() => {
      ok = result.current.add('p1');
    });
    expect(ok).toBe(true);
    expect(result.current.ids).toEqual(['p1']);
  });

  /**
   * 回归用例：历史上 toggle() 在函数式更新器里判断是否超限，
   * 同一批次内的多次 add 拿不到最新长度，导致第 5 款也被「接受」。
   */
  it('添加到第 5 款必须被拒绝并返回 false（同一批次连续 add）', () => {
    const { result } = renderCompare();
    const results: boolean[] = [];
    act(() => {
      results.push(result.current.add('p1'));
      results.push(result.current.add('p2'));
      results.push(result.current.add('p3'));
      results.push(result.current.add('p4'));
      results.push(result.current.add('p5'));
    });
    expect(results).toEqual([true, true, true, true, false]);
    expect(result.current.ids).toEqual(['p1', 'p2', 'p3', 'p4']);
    expect(result.current.isFull).toBe(true);
    expect(result.current.count).toBe(MAX_COMPARE);
  });

  it('已满时跨渲染周期再次 add 同样被拒绝', () => {
    const { result } = renderCompare('?ids=p1,p2,p3,p4');
    let ok: boolean = true;
    act(() => {
      ok = result.current.add('p5');
    });
    expect(ok).toBe(false);
    expect(result.current.ids).toEqual(['p1', 'p2', 'p3', 'p4']);
  });

  it('toggle 已选中的机型会移除它', () => {
    const { result } = renderCompare('?ids=p1,p2');
    act(() => {
      result.current.toggle('p1');
    });
    expect(result.current.ids).toEqual(['p2']);
  });

  it('remove 后长度减一；移除未选中的 id 不影响列表', () => {
    const { result } = renderCompare('?ids=p1,p2,p3');
    act(() => result.current.remove('p2'));
    expect(result.current.ids).toEqual(['p1', 'p3']);
    act(() => result.current.remove('not-exist'));
    expect(result.current.ids).toEqual(['p1', 'p3']);
  });

  it('clear 清空选择', () => {
    const { result } = renderCompare('?ids=p1,p2');
    act(() => result.current.clear());
    expect(result.current.ids).toEqual([]);
  });

  it('selection 变化会同步写入 localStorage', () => {
    const { result } = renderCompare();
    act(() => {
      result.current.add('p1');
      result.current.add('p2');
    });
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual(['p1', 'p2']);
  });

  it('selection 变化会同步到 URL query（?ids=...）', () => {
    const { result } = renderCompare();
    act(() => {
      result.current.add('p1');
      result.current.add('p2');
    });
    expect(latestSearch).toContain('ids=p1%2Cp2');
  });

  it('清空后 URL 中的 ids 参数被移除', () => {
    const { result } = renderCompare('?ids=p1,p2');
    act(() => result.current.clear());
    expect(latestSearch).not.toContain('ids=');
  });

  describe('replaceAt', () => {
    it('替换指定下标的机型', () => {
      const { result } = renderCompare('?ids=p1,p2,p3');
      act(() => result.current.replaceAt(1, 'p9'));
      expect(result.current.ids).toEqual(['p1', 'p9', 'p3']);
    });

    it('替换的目标已存在于其它列时先去重，避免重复', () => {
      const { result } = renderCompare('?ids=p1,p2,p3');
      act(() => result.current.replaceAt(2, 'p1'));
      expect(result.current.ids).toEqual(['p2', 'p1']);
    });

    it('越界下标不做任何改动', () => {
      const { result } = renderCompare('?ids=p1,p2');
      act(() => result.current.replaceAt(5, 'p9'));
      act(() => result.current.replaceAt(-1, 'p9'));
      expect(result.current.ids).toEqual(['p1', 'p2']);
    });
  });

  it('setAll 去重并截断到 MAX_COMPARE', () => {
    const { result } = renderCompare();
    act(() => result.current.setAll(['p1', 'p1', 'p2', 'p3', 'p4', 'p5']));
    expect(result.current.ids).toEqual(['p1', 'p2', 'p3', 'p4']);
  });

  it('selected 集合与 ids 保持一致', () => {
    const { result } = renderCompare('?ids=p1,p2');
    expect(result.current.selected.has('p1')).toBe(true);
    expect(result.current.selected.has('p3')).toBe(false);
  });
});
