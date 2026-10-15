#!/usr/bin/env node
/**
 * 平板必填缺口扫描（只读，不改业务数据）
 * 用法：node scripts/_qa-tablet-gap.mjs
 *
 * 必填口径（team-lead 拍板）：screen.size、performance.soc、
 * battery.capacity 或 battery.batteryWh（二选一）、camera.main。
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function isBlank(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  );
}

async function loadData() {
  const outDir = path.join(PROJECT_ROOT, 'node_modules', '.cache', 'qa-tablet-gap');
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `data-${Date.now()}.mjs`);
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

const mod = await loadData();
const tablets = mod.ALL_DEVICES.filter((d) => d.category === 'tablet');

const gaps = [];
for (const d of tablets) {
  const miss = [];
  if (isBlank(d.screen?.size)) miss.push('sz');
  if (isBlank(d.performance?.soc)) miss.push('soc');
  if (isBlank(d.battery?.capacity) && isBlank(d.battery?.batteryWh)) miss.push('bat');
  if (isBlank(d.camera?.main)) miss.push('cm');
  if (miss.length > 0) gaps.push({ brand: d.brand, id: d.id, name: d.name, miss });
}

const ok = tablets.length - gaps.length;
console.log(`平板总数：${tablets.length}，必填齐全：${ok}（${((ok / tablets.length) * 100).toFixed(2)}%），缺：${gaps.length}`);
console.log('');

const byBrand = new Map();
for (const g of gaps) {
  if (!byBrand.has(g.brand)) byBrand.set(g.brand, []);
  byBrand.get(g.brand).push(g);
}
for (const [brand, list] of [...byBrand.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`### ${brand}（${list.length} 款）`);
  for (const g of list) {
    console.log(`  ${g.id}  ${g.name}  缺：${g.miss.join(',')}`);
  }
  console.log('');
}

// 单项统计
const counter = { sz: 0, soc: 0, bat: 0, cm: 0 };
for (const g of gaps) for (const m of g.miss) counter[m]++;
console.log(`单项缺失：sz(屏幕尺寸)=${counter.sz}  soc(处理器)=${counter.soc}  bat(电池)=${counter.bat}  cm(主摄)=${counter.cm}`);
