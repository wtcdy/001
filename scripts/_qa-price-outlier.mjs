#!/usr/bin/env node
/**
 * QA 报价离群扫描（只读，不修改任何业务数据文件）
 * ---------------------------------------------------------------------
 * 用法：node scripts/_qa-price-outlier.mjs
 *
 * 按 4 条规则扫 `src/data/prices.ts`，找出「比首发价还贵」「跌得过分」
 * 「渠道差价比异常」「价格撞号（疑似按折扣模板批量生成）」的条目，供人工复核。
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_DIR = path.join(PROJECT_ROOT, 'node_modules', '.cache', 'qa-outlier');

async function loadData() {
  await mkdir(CACHE_DIR, { recursive: true }).catch(() => {});
  const outfile = path.join(CACHE_DIR, 'data.mjs');
  await esbuild.build({
    entryPoints: [path.join(PROJECT_ROOT, 'src', 'data', 'index.ts')],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });
  return import(pathToFileURL(outfile).href);
}

const fmt = (n) => (n === null || n === undefined ? '—' : String(n));

async function main() {
  const { ALL_PHONES, PRICES } = await loadData();
  const byId = new Map(ALL_PHONES.map((p) => [p.id, p]));

  const aboveLaunch = [];
  const deepDrop = [];
  const weirdGap = [];
  const seen = new Map();

  for (const [id, rec] of Object.entries(PRICES)) {
    const phone = byId.get(id);
    const lp = phone?.launchPrice ?? null;
    const { jd, pdd, spec } = rec;

    if (lp && (jd > lp * 1.2 || pdd > lp * 1.2)) {
      aboveLaunch.push({ id, name: phone?.name ?? '?', jd, pdd, lp, spec });
    }
    if (lp && (jd < lp * 0.45 || pdd < lp * 0.45)) {
      deepDrop.push({ id, name: phone?.name ?? '?', jd, pdd, lp, spec });
    }
    if (jd && pdd) {
      const gap = (jd - pdd) / jd;
      if (gap < 0.02 || gap > 0.15) weirdGap.push({ id, name: phone?.name ?? '?', jd, pdd, gap });
    }
    const key = `${jd}/${pdd}`;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(`${phone?.name ?? id}(${spec ?? '?'})`);
  }

  const out = [];
  out.push('===== 报价离群扫描 =====');
  out.push(`报价条目：${Object.keys(PRICES).length}`);
  const noLaunch = Object.keys(PRICES).filter((id) => !(byId.get(id)?.launchPrice > 0));
  out.push(`（其中无首发价、无法比对的条目：${noLaunch.length} 条）`);
  out.push('');
  out.push(`【1】渠道价高于首发价 20% 以上（${aboveLaunch.length} 条）`);
  for (const r of aboveLaunch.slice(0, 20)) {
    out.push(`  ${r.id} | ${r.name} | jd ${fmt(r.jd)} pdd ${fmt(r.pdd)} | 首发 ${r.lp} | ${r.spec}`);
  }
  out.push('');
  out.push(`【2】渠道价低于首发价 ×0.45（${deepDrop.length} 条）`);
  for (const r of deepDrop.slice(0, 20)) {
    out.push(`  ${r.id} | ${r.name} | jd ${fmt(r.jd)} pdd ${fmt(r.pdd)} | 首发 ${r.lp} | ${r.spec}`);
  }
  out.push('');
  out.push(`【3】渠道差价比异常（<2% 或 >15%，${weirdGap.length} 条）`);
  for (const r of weirdGap.slice(0, 20)) {
    out.push(`  ${r.id} | ${r.name} | jd ${fmt(r.jd)} pdd ${fmt(r.pdd)} | 差价 ${(r.gap * 100).toFixed(1)}%`);
  }
  out.push('');
  const dupes = [...seen.entries()].filter(([, v]) => v.length > 2);
  out.push(`【4】同一组 jd/pdd 被 3 款以上机型共用（${dupes.length} 组，疑似折扣模板生成）`);
  for (const [key, names] of dupes.slice(0, 12)) {
    out.push(`  ${key} → ${names.slice(0, 6).join('、')}${names.length > 6 ? ` …共${names.length}款` : ''}`);
  }

  process.stdout.write(`${out.join('\n')}\n`);
}

main().catch((err) => {
  process.stderr.write(`失败：${err?.stack ?? err}\n`);
  process.exitCode = 1;
});
