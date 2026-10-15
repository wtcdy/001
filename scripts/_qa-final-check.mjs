#!/usr/bin/env node
/** 临时上线前数据校验脚本（跑完即删）：完整性 + 抽查正确性 */

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(PROJECT_ROOT, 'node_modules', '.cache', '_qa-final-check.mjs');

await esbuild.build({
  entryPoints: [path.join(PROJECT_ROOT, 'src', 'data', 'index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: OUT,
  logLevel: 'error',
});

const { ALL_DEVICES, DUPLICATE_IDS } = await import(pathToFileURL(OUT).href);

const out = [];
const log = (s) => out.push(s);

/* ---------- 4. 数据完整性 ---------- */
log('=== 4. 数据完整性 ===');
log(`总数: ${ALL_DEVICES.length}`);
const byCat = {};
for (const d of ALL_DEVICES) byCat[d.category] = (byCat[d.category] ?? 0) + 1;
log(`按品类: ${JSON.stringify(byCat)}`);

const seen = new Set();
const dups = new Set();
for (const d of ALL_DEVICES) {
  if (seen.has(d.id)) dups.add(d.id);
  seen.add(d.id);
}
log(`重复 id (${dups.size}): ${dups.size ? [...dups].join(', ') : '无'}`);
log(`DUPLICATE_IDS 导出一致: ${JSON.stringify([...dups].sort()) === JSON.stringify([...DUPLICATE_IDS].sort())}`);

const cats = new Set(ALL_DEVICES.map((d) => d.category));
log(`category 取值: ${[...cats].join(', ')} | 仅 phone/tablet: ${[...cats].every((c) => c === 'phone' || c === 'tablet')}`);

const noForm = ALL_DEVICES.filter((d) => !d.formFactor);
log(`formFactor 空值 (${noForm.length}): ${noForm.slice(0, 10).map((d) => d.id).join(', ') || '无'}`);

const bothBattery = ALL_DEVICES.filter(
  (d) => d.battery?.capacity != null && d.battery?.batteryWh != null,
);
log(`同时有 mAh 和 Wh (${bothBattery.length}): ${bothBattery.slice(0, 10).map((d) => `${d.id}(${d.battery.capacity}mAh/${d.battery.batteryWh}Wh)`).join(', ') || '无'}`);

/* ---------- 5. 抽查 ---------- */
log('');
log('=== 5. 抽查数据正确性 ===');

const find = (kw) => ALL_DEVICES.filter((d) => `${d.brand} ${d.name} ${d.id}`.includes(kw));

// Apple 平板（iPad）：bc 必须 null + bwh 必须匹配 research/apple-battery-wh.md 官方表
const APPLE_WH = {
  'ipad-pro-m5-11': 31.29, 'ipad-pro-m5-13': 38.99, 'ipad-pro-m4-11': 31.29,
  'ipad-pro-m4-13': 38.99, 'ipad-pro-m2-11': 28.65, 'ipad-pro-m2-129': 40.88,
  'ipad-air-m3-11': 28.93, 'ipad-air-m3-13': 36.59, 'ipad-air-m2-11': 28.93,
  'ipad-air-m2-13': 36.59, 'ipad-air-m1': 28.6, 'ipad-air-m4-11': 28.93,
  'ipad-air-m4-13': 36.59, 'ipad-a16-11': 28.93, 'ipad-10': 28.6,
  'ipad-9': 32.4, 'ipad-mini-a17pro': 19.3, 'ipad-mini-6': 19.3,
};
const appleTabs = ALL_DEVICES.filter((d) => d.brand === 'Apple' && d.category === 'tablet');
log(`Apple 平板数: ${appleTabs.length} (research 表 ${Object.keys(APPLE_WH).length} 条)`);
const tabWithMah = appleTabs.filter((d) => d.battery?.capacity != null);
log(`[必须 0] Apple 平板仍有 mAh: ${tabWithMah.length} -> ${tabWithMah.map((d) => `${d.id}=${d.battery.capacity}`).join(', ') || '无'}`);
const tabNoWh = appleTabs.filter((d) => d.battery?.batteryWh == null);
log(`[必须 0] Apple 平板缺 Wh: ${tabNoWh.length} -> ${tabNoWh.map((d) => d.id).join(', ') || '无'}`);
const whMismatch = appleTabs.filter((d) => {
  const exp = APPLE_WH[d.id];
  return exp != null && d.battery?.batteryWh !== exp;
});
log(`[必须 0] Wh 与官方表不符: ${whMismatch.length} -> ${whMismatch.map((d) => `${d.id}: 库=${d.battery?.batteryWh} 表=${APPLE_WH[d.id]}`).join(', ') || '无'}`);
const unlisted = appleTabs.filter((d) => APPLE_WH[d.id] == null);
log(`  不在官方表中的 Apple 平板: ${unlisted.map((d) => `${d.id}=${d.battery?.batteryWh}Wh`).join(', ') || '无'}`);

// iPhone（手机）：mAh 为真值，不应被换算成 Wh
const applePhones = ALL_DEVICES.filter((d) => d.brand === 'Apple' && d.category === 'phone');
log(`Apple 手机数: ${applePhones.length}，其中缺少 mAh 的: ${applePhones.filter((d) => d.battery?.capacity == null).length}`);

const HIST = [10290, 10210, 10340];
const histHit = ALL_DEVICES.filter((d) => HIST.includes(d.battery?.capacity));
log(`[必须 0] 历史错误折算值 10290/10210/10340 命中: ${histHit.length} -> ${histHit.map((d) => `${d.name}=${d.battery.capacity}`).join(', ') || '无'}`);

// vivo / iQOO 手机全系
const vivoPh = ALL_DEVICES.filter((d) => (d.brand === 'vivo' || d.brand === 'iQOO') && d.category === 'phone');
const vivoBad = vivoPh.filter((d) => d.battery?.reverseCharge !== '支持 OTG 反向充电');
log(`vivo/iQOO 手机数: ${vivoPh.length}`);
log(`[必须 0] br 不符合: ${vivoBad.length} -> ${vivoBad.slice(0, 15).map((d) => `${d.name}=${JSON.stringify(d.battery?.reverseCharge)}`).join(', ') || '无'}`);

// OPPO Find X9 系列
const x9 = find('Find X9');
log(`OPPO Find X9 系列 (${x9.length}): ${x9.map((d) => `${d.name}=${JSON.stringify(d.battery?.reverseCharge)}`).join(' | ') || '未找到'}`);

// 荣耀
const honor = ALL_DEVICES.filter((d) => d.brand === '荣耀');
const honorTargets = ['Magic9', '荣耀500', '荣耀 500'];
log(`荣耀设备数: ${honor.length}`);
for (const t of ['Magic9', '荣耀500', '荣耀 500', 'Magic8', 'V6']) {
  const hit = honor.filter((d) => d.name.includes(t));
  if (hit.length) {
    log(`  荣耀 ${t}: ${hit.map((d) => `${d.name}=${JSON.stringify(d.battery?.reverseCharge)}`).join(' | ')}`);
  }
}

// 华为 Mate 80
const mate80 = find('Mate 80');
log(`华为 Mate 80 (${mate80.length}): ${mate80.map((d) => `${d.name}=${JSON.stringify(d.battery?.reverseCharge)}`).join(' | ') || '未找到'}`);

// iPhone 17 / Air
const ip17 = find('iPhone 17');
log(`iPhone 17 系列 (${ip17.length}): ${ip17.map((d) => `${d.name} lp=${d.launchPrice} cp=${d.currentPrice}`).join(' | ')}`);
const ipAir = find('iPhone Air');
log(`iPhone Air (${ipAir.length}): ${ipAir.map((d) => `${d.name} lp=${d.launchPrice} cp=${d.currentPrice}`).join(' | ')}`);

// 停售 iPhone
const cpNullButOld = applePhones.filter((d) => d.currentPrice == null);
log(`Apple 中 cp=null 的设备 (${cpNullButOld.length}): ${cpNullButOld.slice(0, 20).map((d) => d.name).join(', ') || '无'}`);

console.log(out.join('\n'));
