#!/usr/bin/env node
/**
 * QA 价格模块独立审计脚本（只读，不修改任何业务数据文件）
 * ---------------------------------------------------------------------
 * 用法：node scripts/_qa-price-audit.mjs
 *
 * 独立于工程师自带的价格单测，从「源文件文本」与「运行期数据」两侧交叉核对，
 * 重点查：对象字面量重复 key（会静默覆盖）、id 是否真实存在、价格口径一致性。
 */

import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

// 必须用 fileURLToPath：直接取 URL.pathname 会在中文路径下被百分号编码
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(PROJECT_ROOT, 'node_modules', '.cache', 'qa-price');
const PRICES_TS = path.join(PROJECT_ROOT, 'src', 'data', 'prices.ts');

/** 直接用正则从源文件文本里抽出所有 key，用来发现「重复 key 静默覆盖」 */
async function keysFromSource() {
  const text = await readFile(PRICES_TS, 'utf8');
  const keys = [...text.matchAll(/^\s*'([^']+)':\s*\{/gm)].map((m) => m[1]);
  return keys;
}

async function loadDataModule() {
  await mkdir(OUT_DIR, { recursive: true }).catch(() => {});
  const outfile = path.join(OUT_DIR, 'data.mjs');
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

function pct(n, total) {
  return total === 0 ? '0.00' : ((n / total) * 100).toFixed(2);
}

async function main() {
  const sourceKeys = await keysFromSource();
  const data = await loadDataModule();
  const { ALL_PHONES, PRICES, PRICE_BOUNDS, PRICE_COUNT, effectivePriceOf, dealOfPhone } = data;

  const runtimeKeys = Object.keys(PRICES);
  const dupes = sourceKeys.filter((k, i) => sourceKeys.indexOf(k) !== i);
  const idSet = new Set(ALL_PHONES.map((p) => p.id));

  process.stdout.write('===== 报价数据审计 =====\n');
  process.stdout.write(`源文件字面量条数      : ${sourceKeys.length}\n`);
  process.stdout.write(`运行期 Object.keys    : ${runtimeKeys.length}\n`);
  process.stdout.write(`PRICE_COUNT           : ${PRICE_COUNT}\n`);
  process.stdout.write(`重复 key（静默覆盖）  : ${dupes.length}${dupes.length ? ` → ${[...new Set(dupes)].join(', ')}` : ''}\n`);
  process.stdout.write(`id 不在机型库中的条数 : ${runtimeKeys.filter((id) => !idSet.has(id)).length}\n`);

  let nonInteger = 0;
  let outOfRange = 0;
  let bothEmpty = 0;
  let badDate = 0;
  let notReference = 0;
  let pddHigherThanJd = 0;
  for (const [id, item] of Object.entries(PRICES)) {
    for (const v of [item.jd, item.pdd]) {
      if (v === null || v === undefined) continue;
      if (!Number.isInteger(v)) nonInteger += 1;
      if (v < 300 || v > 20000) outOfRange += 1;
    }
    if ((item.jd == null || item.jd <= 0) && (item.pdd == null || item.pdd <= 0)) bothEmpty += 1;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(item.updatedAt ?? ''))) badDate += 1;
    if (item.isReference !== true) notReference += 1;
    if (item.jd != null && item.pdd != null && item.pdd > item.jd) pddHigherThanJd += 1;
  }
  process.stdout.write(`非整数价格            : ${nonInteger}\n`);
  process.stdout.write(`越界价格(<300/>20000) : ${outOfRange}\n`);
  process.stdout.write(`两渠道均无价          : ${bothEmpty}\n`);
  process.stdout.write(`updatedAt 格式错误    : ${badDate}\n`);
  process.stdout.write(`isReference !== true  : ${notReference}\n`);
  process.stdout.write(`pdd 高于 jd 的条目    : ${pddHigherThanJd}\n`);

  process.stdout.write('\n===== 价格口径一致性 =====\n');
  const withQuote = ALL_PHONES.filter((p) => dealOfPhone(p).hasPrice);
  const withoutQuote = ALL_PHONES.filter((p) => !dealOfPhone(p).hasPrice);
  const noQuoteButHasRef = withoutQuote.filter(
    (p) => (p.currentPrice ?? 0) > 0 || (p.launchPrice ?? 0) > 0,
  );
  process.stdout.write(`有渠道报价            : ${withQuote.length}（${pct(withQuote.length, ALL_PHONES.length)}%）\n`);
  process.stdout.write(`无渠道报价            : ${withoutQuote.length}（其中 ${noQuoteButHasRef.length} 款仍有参考现价/首发价，会参与价格筛选与排序但**未计国补**）\n`);

  const eligible = withQuote.filter((p) => dealOfPhone(p).eligible);
  process.stdout.write(`享受国补              : ${eligible.length} / 超上限不享受：${withQuote.length - eligible.length}\n`);

  const allEffective = ALL_PHONES.map((p) => effectivePriceOf(p)).filter(
    (v) => typeof v === 'number' && v > 0,
  );
  const min = Math.min(...allEffective);
  const max = Math.max(...allEffective);
  process.stdout.write(`有效价最小值          : ${min}\n`);
  process.stdout.write(`有效价最大值          : ${max}\n`);
  process.stdout.write(`PRICE_BOUNDS          : [${PRICE_BOUNDS[0]}, ${PRICE_BOUNDS[1]}]\n`);
  const outside = ALL_PHONES.filter((p) => {
    const v = effectivePriceOf(p);
    return v !== null && (v < PRICE_BOUNDS[0] || v > PRICE_BOUNDS[1]);
  });
  process.stdout.write(`默认筛选会漏掉的机型  : ${outside.length}${outside.length ? ` → ${outside.map((p) => `${p.id}=${effectivePriceOf(p)}`).join(', ')}` : ''}\n`);

  // 口径混用影响面：无报价机型按「未计国补的参考价」参与排序，
  // 与有报价机型的「国补后到手价」不可直接比较，量化一下有多少款会被系统性排高
  const subsidized = withQuote.filter((p) => dealOfPhone(p).eligible);
  const avgDiscount =
    subsidized.length === 0
      ? 0
      : subsidized.reduce((sum, p) => sum + dealOfPhone(p).subsidy, 0) / subsidized.length;
  process.stdout.write(`有报价机型的平均补贴  : ¥${avgDiscount.toFixed(2)}（无报价机型为 ¥0，排序时系统性吃亏）\n`);

  process.stdout.write('\n===== 边界抽查（独立重算，不依赖被测代码） =====\n');
  const cases = [
    { price: 3333, expectSubsidy: 499.95, expectFinal: 2833.05 },
    { price: 5000, expectSubsidy: 500, expectFinal: 4500 },
    { price: 5999, expectSubsidy: 500, expectFinal: 5499 },
    { price: 6000, expectSubsidy: 500, expectFinal: 5500 },
    { price: 6001, expectSubsidy: 0, expectFinal: 6001 },
    { price: 4000, expectSubsidy: 500, expectFinal: 3500 },
    { price: 2000, expectSubsidy: 300, expectFinal: 1700 },
  ];
  for (const c of cases) {
    const subsidy = c.price <= 6000 ? Math.min(Math.round(c.price * 0.15 * 100) / 100, 500) : 0;
    const final = Math.round((c.price - subsidy) * 100) / 100;
    process.stdout.write(
      `${String(c.price).padStart(5)} 元 → 补贴 ${String(subsidy).padStart(7)} / 到手 ${String(final).padStart(8)}` +
        `（期望 ${c.expectSubsidy} / ${c.expectFinal}）${subsidy === c.expectSubsidy && final === c.expectFinal ? ' ✓' : ' ✗ 不一致'}\n`,
    );
  }
}

main().catch((error) => {
  process.stderr.write(`[qa-price-audit] 执行失败：${error?.stack ?? String(error)}\n`);
  process.exitCode = 1;
});
