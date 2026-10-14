import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/** 最多可同时对比的机型数量 */
export const MAX_COMPARE = 4;

const STORAGE_KEY = 'psc-compare-ids';

/** 解析 URL 中的 ids 参数，过滤空白与重复项 */
function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  const list = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return Array.from(new Set(list)).slice(0, MAX_COMPARE);
}

/** 从 localStorage 读取上次的选择 */
function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_COMPARE);
    }
  } catch {
    /* 忽略解析异常 */
  }
  return [];
}

function isSameList(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

/**
 * 对比选中状态管理：URL query(`?ids=a,b,c`) 与 localStorage 双向同步。
 *
 * - 初始化优先级：URL 参数 > localStorage
 * - 选中数量上限 MAX_COMPARE，超出时返回 false 供调用方提示
 * - 所有变更都会写回 URL（replace）便于分享与刷新恢复
 */
export function useCompare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlIds = searchParams.get('ids');

  const [ids, setIds] = useState<string[]>(() => {
    const fromUrl = parseIds(urlIds);
    return fromUrl.length > 0 ? fromUrl : readStored();
  });

  /** 将当前选择同步到 localStorage 与 URL */
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* 忽略写入失败 */
    }
    const current = parseIds(searchParams.get('ids'));
    if (isSameList(current, ids)) return;
    const next = new URLSearchParams(searchParams);
    if (ids.length > 0) {
      next.set('ids', ids.join(','));
    } else {
      next.delete('ids');
    }
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  /**
   * 始终保存最新的 ids 副本。
   * setState 的函数式更新器会在渲染阶段才执行，无法在其中可靠地返回「是否被接受」，
   * 因此这里用 ref 同步一份当前值，让 toggle() 能立即给出结果供调用方提示。
   */
  const idsRef = useRef<string[]>(ids);
  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  const commit = useCallback((next: string[]) => {
    idsRef.current = next;
    setIds(next);
  }, []);

  /** 加入/移出对比；返回 false 表示已达上限未被接受 */
  const toggle = useCallback(
    (id: string): boolean => {
      const prev = idsRef.current;
      if (prev.includes(id)) {
        commit(prev.filter((item) => item !== id));
        return true;
      }
      if (prev.length >= MAX_COMPARE) return false;
      commit([...prev, id]);
      return true;
    },
    [commit],
  );

  const add = useCallback((id: string): boolean => toggle(id), [toggle]);

  const remove = useCallback(
    (id: string) => {
      commit(idsRef.current.filter((item) => item !== id));
    },
    [commit],
  );

  const clear = useCallback(() => {
    commit([]);
  }, [commit]);

  const replaceAt = useCallback(
    (index: number, id: string) => {
      const prev = idsRef.current;
      if (index < 0 || index >= prev.length) return;
      const next = [...prev];
      // 若该机型已在其它列中，先移除避免重复
      const existing = next.indexOf(id);
      if (existing >= 0 && existing !== index) next.splice(existing, 1);
      next[Math.min(index, next.length - 1)] = id;
      commit(next);
    },
    [commit],
  );

  const setAll = useCallback(
    (nextIds: string[]) => {
      commit(Array.from(new Set(nextIds)).slice(0, MAX_COMPARE));
    },
    [commit],
  );

  const selected = useMemo(() => new Set(ids), [ids]);

  return {
    ids,
    selected,
    isFull: ids.length >= MAX_COMPARE,
    count: ids.length,
    toggle,
    add,
    remove,
    clear,
    replaceAt,
    setAll,
  };
}
