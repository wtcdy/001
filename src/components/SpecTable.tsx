import { Fragment, useMemo, useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import { computeRowDiff, shouldRenderRow, SPEC_GROUPS } from '../data';
import type { RowDiffResult } from '../data';
import type { Phone } from '../types/phone';

import { positioningOf } from '../utils/positioning';
import { priceRowSpecSuffix } from '../utils/storageSpec';

export interface SpecTableProps {
  /** 参与对比的机型（2-4 款） */
  phones: Phone[];
  /** 是否开启「只看不同」 */
  diffOnly: boolean;
}

interface GroupState {
  [groupKey: string]: boolean;
}

/**
 * 参数对比表。
 *
 * 配色遵循国际通用直觉（与交通信号灯一致）：
 * - 数值更优 → 绿色系（psc-cell-better）
 * - 数值更差 → 红色系（psc-cell-worse）
 * - 仅取值不同 → 中性琥珀色底（psc-cell-diff）
 *
 * 优劣方向由 `specGroups.ts` 里每行的 `better: 'higher' | 'lower'` 决定，
 * 本组件只负责把 `computeRowDiff` 算出的 `bestIndexes` / `worstIndexes` 映射到颜色。
 */
export function SpecTable({ phones, diffOnly }: SpecTableProps) {
  const [openMap, setOpenMap] = useState<GroupState>(() => {
    const initial: GroupState = {};
    for (const group of SPEC_GROUPS) initial[group.key] = group.defaultOpen;
    return initial;
  });

  const toggleGroup = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /** 按品类 / 形态裁剪后的分组：外屏等形态专属行只在折叠机上出现 */
  const visibleGroups = useMemo(
    () =>
      SPEC_GROUPS.map((group) => ({
        group,
        rows: group.rows.filter((row) => shouldRenderRow(row, phones)),
      })),
    [phones],
  );

  /** 预先计算每个分组每一行的差异信息，避免重复计算 */
  const diffMap = useMemo(() => {
    const map: Record<string, RowDiffResult[]> = {};
    for (const item of visibleGroups) {
      map[item.group.key] = item.rows.map((row) => computeRowDiff(row, phones));
    }
    return map;
  }, [visibleGroups, phones]);

  const columnWidth = phones.length >= 4 ? 'min-w-[150px]' : 'min-w-[180px]';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#151822]">
      <div className="psc-scroll-x overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-28 min-w-[7rem] border-b border-r border-slate-200 bg-slate-100 px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                参数项
              </th>
              {phones.map((phone) => {
                const positioning = positioningOf(phone);
                return (
                  <th
                    key={phone.id}
                    className={`${columnWidth} border-b border-slate-200 px-3 py-3 text-left align-top dark:border-slate-700`}
                  >
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{phone.name}</div>
                    <div className="mt-0.5 text-xs font-normal text-slate-500 dark:text-slate-400">
                      {phone.brand} · {phone.releaseDate}
                    </div>
                    {/* 主打方向徽章：派生自参数，不落地数据 */}
                    <div className="mt-1.5">
                      <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                        {positioning}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {visibleGroups.map(({ group, rows: groupRows }) => {
              const isOpen = openMap[group.key] !== false;
              const rows = groupRows.map((row, index) => ({
                row,
                diff: diffMap[group.key][index],
              }));
              const visibleRows = diffOnly ? rows.filter((item) => !item.diff.allSame) : rows;

              if (diffOnly && visibleRows.length === 0) return null;

              return (
                <Fragment key={group.key}>
                  <tr>
                    <td
                      colSpan={phones.length + 1}
                      className="psc-group-title sticky left-0 z-10 border-y border-slate-200 px-3 py-2 dark:border-slate-700"
                    >
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.key)}
                        className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-300"
                        aria-expanded={isOpen}
                      >
                        {isOpen ? (
                          <ChevronDown size={14} aria-hidden="true" />
                        ) : (
                          <ChevronRight size={14} aria-hidden="true" />
                        )}
                        {group.label}
                        <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">
                          （{visibleRows.length}）
                        </span>
                      </button>
                    </td>
                  </tr>

                  {isOpen
                    ? visibleRows.map(({ row, diff }) => (
                        <tr key={row.key} className="border-b border-slate-100 dark:border-slate-800">
                          <th
                            scope="row"
                            className="sticky left-0 z-10 w-28 min-w-[7rem] border-r border-slate-200 bg-white px-3 py-2.5 text-left align-top text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-[#151822] dark:text-slate-400"
                          >
                            <span className="inline-flex items-center gap-1">
                              {row.label}
                              {row.title ? (
                                <span
                                  className="cursor-help rounded bg-amber-50 px-1 text-[10px] font-normal text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                  title={row.title}
                                >
                                  {row.titleBadge ?? '参考'}
                                </span>
                              ) : null}
                            </span>
                          </th>

                          {phones.map((phone, index) => {
                            const value = diff.displayValues[index];
                            const isBest = diff.bestIndexes.includes(index);
                            const isWorst = diff.worstIndexes.includes(index);
                            const isDiff = diff.diffIndexes.includes(index);
                            // 价格行追加内存配置后缀（如 5999元（12+256））；非价格行或无配置时为 null
                            const specSuffix = priceRowSpecSuffix(row.key, phone);

                            let cellClass = 'text-slate-800 dark:text-slate-100';
                            if (isBest) cellClass = 'psc-cell-better font-semibold';
                            else if (isWorst) cellClass = 'psc-cell-worse';
                            else if (isDiff) cellClass = 'psc-cell-diff';

                            return (
                              <td
                                key={`${row.key}-${phone.id}`}
                                className={`${columnWidth} px-3 py-2.5 align-top ${cellClass}`}
                              >
                                {value ?? <span className="text-slate-400 dark:text-slate-600">—</span>}
                                {value != null && specSuffix ? (
                                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                                    （{specSuffix}）
                                  </span>
                                ) : null}
                                {isBest ? (
                                  <span className="ml-1 text-[10px] font-bold">优</span>
                                ) : null}
                                {isWorst ? (
                                  <span className="ml-1 text-[10px] font-bold">弱</span>
                                ) : null}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpecTable;
