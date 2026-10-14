#!/usr/bin/env node
/**
 * QA 影响面分析：「缺失也算差异」这一行为变更对「只看不同」的实际影响。
 * ---------------------------------------------------------------------
 * 用法：node scripts/_qa-diffimpact.mjs
 *
 * 背景：computeRowDiff 修复前，allSame 只比较非空取值，导致
 *      「A 有长焦、B 没有」这类差异被「只看不同」隐藏（P2-2）。
 * 修复后缺失本身也参与比较。本脚本量化：这一改动会让「只看不同」
 * 多显示多少行、其中多少是真正有价值的「有值 vs 缺失」差异。
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadData() {
  const outDir = path.join(PROJECT_ROOT, 'node_modules', '.cache', 'qa-validate');
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `data-impact-${Date.now()}.mjs`);
  await esbuild.build({
    entryPoints: [path.join(PROJECT_ROOT, 'src', 'data', 'index.ts')],
    outfile: outFile,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    logLevel: 'silent',
  });
  return import(pathToFileURL(outFile).href);
}

/** 修复前的 allSame 语义（只比较非空取值） */
function oldAllSame(displayValues) {
  const nonNull = displayValues.filter((t) => t !== null);
  return nonNull.length > 0 ? nonNull.every((t) => t === nonNull[0]) : displayValues.every((t) => t === null);
}

function analyze(SPEC_GROUPS, computeRowDiff, phones, label) {
  let total = 0;
  let newShown = 0;
  let oldShown = 0;
  let partialNull = 0; // 展示行里既有值又有缺失（本次修复新暴露的差异）
  let allMissing = 0;

  for (const group of SPEC_GROUPS) {
    for (const row of group.rows) {
      total += 1;
      const diff = computeRowDiff(row, phones);
      const isSameNew = diff.allSame;
      const isSameOld = oldAllSame(diff.displayValues);
      if (!isSameNew) newShown += 1;
      if (!isSameOld) oldShown += 1;

      const hasValue = diff.displayValues.some((t) => t !== null);
      const hasNull = diff.displayValues.some((t) => t === null);
      if (hasValue && hasNull) partialNull += 1;
      if (!hasValue) allMissing += 1;
    }
  }

  return { label, count: phones.length, total, oldShown, newShown, partialNull, allMissing };
}

async function main() {
  const { ALL_PHONES, SPEC_GROUPS, computeRowDiff } = await loadData();

  const byId = (id) => ALL_PHONES.find((p) => p.id === id);
  const pick = (kw) => ALL_PHONES.find((p) => p.name.includes(kw) || p.id.includes(kw));

  const sets = [
    { label: 'iPhone 16 Pro Max vs 小米15 Ultra', phones: [pick('16 Pro Max'), pick('15 Ultra')].filter(Boolean) },
    { label: '华为Mate70 系列 vs 三星S25Ultra', phones: [pick('Mate 70'), pick('S25 Ultra')].filter(Boolean) },
    { label: '同品牌 iPhone 15/16 Pro（2款）', phones: ALL_PHONES.filter((p) => p.brand === 'Apple').slice(0, 2) },
    { label: '随机 3 款', phones: [byId(ALL_PHONES[7].id), byId(ALL_PHONES[120].id), byId(ALL_PHONES[300].id)] },
    { label: '随机 4 款', phones: [byId(ALL_PHONES[3].id), byId(ALL_PHONES[80].id), byId(ALL_PHONES[200].id), byId(ALL_PHONES[400].id)] },
  ];

  const out = [];
  out.push('');
  out.push('=========== 「只看不同」影响面分析（修复后 vs 修复前）===========');
  out.push(`总参数行数：${SPEC_GROUPS.reduce((s, g) => s + g.rows.length, 0)}`);
  out.push('');
  out.push('对比组'.padEnd(42) + '款数  修复前显示  修复后显示  新增  其中「有值vs缺失」  全缺失行');
  out.push('-'.repeat(108));

  let sumOld = 0;
  let sumNew = 0;
  let sumPartial = 0;
  let n = 0;

  for (const set of sets) {
    if (set.phones.length < 2) continue;
    const r = analyze(SPEC_GROUPS, computeRowDiff, set.phones, set.label);
    sumOld += r.oldShown;
    sumNew += r.newShown;
    sumPartial += r.partialNull;
    n += 1;
    out.push(
      `${r.label.padEnd(40)}  ${String(r.count).padStart(2)}  ${String(r.oldShown).padStart(8)}  ${String(r.newShown).padStart(10)}  ${String(r.newShown - r.oldShown).padStart(4)}  ${String(r.partialNull).padStart(14)}  ${String(r.allMissing).padStart(8)}`,
    );
  }

  out.push('-'.repeat(108));
  out.push(`平均：修复前显示 ${(sumOld / n).toFixed(1)} 行 → 修复后 ${(sumNew / n).toFixed(1)} 行（+${((sumNew - sumOld) / n).toFixed(1)}）`);
  out.push(`平均每组的「有值 vs 缺失」差异行：${(sumPartial / n).toFixed(1)}`);
  out.push('');
  out.push('结论提示：新增显示的行全部来自「一侧有值、另一侧缺失」，属于用户真正关心的差异；');
  out.push('「全缺失」行仍然被正确隐藏（不会灌水）。');
  out.push('');

  process.stdout.write(out.join('\n'));
}

main().catch((error) => {
  process.stderr.write(`[qa-diffimpact] 执行失败：${error?.stack ?? String(error)}\n`);
  process.exitCode = 2;
});
