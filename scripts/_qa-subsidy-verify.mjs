#!/usr/bin/env node
/**
 * QA 国补计算独立验算脚本（只读，不修改任何业务文件）
 * ---------------------------------------------------------------------
 * 用法：node scripts/_qa-subsidy-verify.mjs
 *
 * 目的：不复用被测代码的任何算法，另写一套「整数分」实现按政策公式算，
 * 再与 computeDeal() 的输出逐点比对，验证计算正确性。
 *
 * 政策口径（2026 年现行）：
 *   - 单件销售价格 ≤ 6000 元才享受；
 *   - 补贴 = 扣除各环节优惠后的最终销售价格 × 15%；
 *   - 每件封顶 500 元；
 *   - 先取渠道低价，再按低价算补贴。
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(PROJECT_ROOT, 'node_modules', '.cache', 'qa-subsidy');

/* ---------------- 我的独立实现（整数分运算，不参考被测代码） ---------------- */

const CEILING_YUAN = 6000;
const RATE_PERCENT = 15;
const MAX_SUBSIDY_YUAN = 500;

/** 规范化：非法值（非数字 / 非有限 / ≤ 0）视为缺失 */
function myNorm(v) {
  if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) return null;
  return v;
}

/** 补贴额（元）：15% 用「整数分」算 —— 补贴分 = 价格(元) × 15，再封顶 50000 分 */
function mySubsidy(bestPrice) {
  if (bestPrice > CEILING_YUAN) return 0;
  const cents = Math.min(Math.round(bestPrice * RATE_PERCENT), MAX_SUBSIDY_YUAN * 100);
  return cents / 100;
}

/** 完整计算：先取低价，再算补贴 */
function myDeal(record) {
  if (!record) return { hasPrice: false, bestChannel: null, bestPrice: null, eligible: false, subsidy: 0, finalPrice: null };
  const jd = myNorm(record.jd);
  const pdd = myNorm(record.pdd);
  if (jd === null && pdd === null) {
    return { hasPrice: false, bestChannel: null, bestPrice: null, eligible: false, subsidy: 0, finalPrice: null };
  }
  let bestChannel;
  let bestPrice;
  if (jd === null) {
    bestChannel = 'pdd';
    bestPrice = pdd;
  } else if (pdd === null) {
    bestChannel = 'jd';
    bestPrice = jd;
  } else {
    // 价低者胜，相等时优先拼多多
    bestChannel = pdd <= jd ? 'pdd' : 'jd';
    bestPrice = Math.min(pdd, jd);
  }
  const subsidy = mySubsidy(bestPrice);
  const finalPrice = Math.round((bestPrice - subsidy) * 100) / 100;
  return {
    hasPrice: true,
    bestChannel,
    bestPrice,
    eligible: bestPrice <= CEILING_YUAN,
    subsidy,
    finalPrice,
  };
}

/* ---------------- 加载被测代码 ---------------- */

async function loadComputeDeal() {
  await mkdir(OUT_DIR, { recursive: true }).catch(() => {});
  const outfile = path.join(OUT_DIR, 'price.mjs');
  await esbuild.build({
    entryPoints: [path.join(PROJECT_ROOT, 'src', 'utils', 'price.ts')],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });
  return import(pathToFileURL(outfile).href);
}

/* ---------------- 比对 ---------------- */

const FIELDS = ['hasPrice', 'bestChannel', 'bestPrice', 'eligible', 'subsidy', 'finalPrice'];
const diffs = [];
let checked = 0;

function compare(name, record) {
  const mine = myDeal(record);
  const theirs = computeDeal(record);
  checked += 1;
  for (const field of FIELDS) {
    if (!Object.is(mine[field], theirs[field])) {
      diffs.push(
        `${name} · ${field}：我算 ${JSON.stringify(mine[field])}，被测 ${JSON.stringify(theirs[field])}`,
      );
    }
  }
  return { mine, theirs };
}

function showRow(name, mine) {
  process.stdout.write(
    `  ${name.padEnd(34)} → 低价 ${String(mine.bestPrice ?? '—').padStart(8)} / ` +
      `补贴 ${String(mine.subsidy ?? '—').padStart(7)} / 到手 ${String(mine.finalPrice ?? '—').padStart(8)}` +
      `${mine.eligible ? '' : '  [超上限]'}\n`,
  );
}

let computeDeal;

async function main() {
  ({ computeDeal } = await loadComputeDeal());

  process.stdout.write('===== V1-1 门槛边界（5999 / 6000 含 / 6001 不含）=====\n');
  for (const price of [5999, 6000, 6001]) {
    const { mine } = compare(`jd=${price}`, { jd: price, pdd: null });
    showRow(`jd=${price}`, mine);
  }

  process.stdout.write('\n===== V1-2 封顶（2000 未封顶 / 3334 微超 / 5000 明显超）=====\n');
  for (const price of [2000, 3333, 3334, 4000, 5000, 5999]) {
    const { mine } = compare(`pdd=${price}`, { jd: null, pdd: price });
    showRow(`pdd=${price}`, mine);
  }

  process.stdout.write('\n===== V1-3 精度：非整数价格（保留到分）=====\n');
  for (const price of [3333.33, 5999.99, 1234.56, 0.01, 2999.995]) {
    const { mine } = compare(`jd=${price}`, { jd: price, pdd: null });
    showRow(`jd=${price}`, mine);
  }

  process.stdout.write('\n===== V1-4 渠道取值 =====\n');
  const channelCases = [
    ['仅京东 4599', { jd: 4599, pdd: null }],
    ['仅拼多多 4299', { jd: null, pdd: 4299 }],
    ['都有：jd 4299 / pdd 3999', { jd: 4299, pdd: 3999 }],
    ['都有：jd 3899 / pdd 3999', { jd: 3899, pdd: 3999 }],
    ['相等 3999 / 3999', { jd: 3999, pdd: 3999 }],
    ['都无', { jd: null, pdd: null }],
    ['undefined 记录', undefined],
  ];
  for (const [name, rec] of channelCases) {
    const { mine } = compare(name, rec);
    showRow(name, mine);
  }

  process.stdout.write('\n===== V1-5 脏数据（0 / 负数 / NaN / Infinity / undefined）=====\n');
  const dirtyCases = [
    ['jd=0', { jd: 0, pdd: 3999 }],
    ['jd=-100', { jd: -100, pdd: null }],
    ['jd=NaN', { jd: Number.NaN, pdd: null }],
    ['jd=Infinity', { jd: Number.POSITIVE_INFINITY, pdd: null }],
    ['两渠道都脏 0/-1', { jd: 0, pdd: -1 }],
    ['字段缺失', {}],
  ];
  for (const [name, rec] of dirtyCases) {
    const { mine } = compare(name, rec);
    showRow(name, mine);
  }

  process.stdout.write('\n===== V1-6 顺序陷阱：先取低价再算补贴 vs 分别算补贴再取低 =====\n');
  // 若实现是「分别算两渠道补贴再取最低」，则 jd 超上限、pdd 未超时结果会不同
  const orderCases = [
    ['jd=7000(超上限) / pdd=5999', { jd: 7000, pdd: 5999 }],
    ['jd=6500(超上限) / pdd=3000', { jd: 6500, pdd: 3000 }],
    ['jd=6001 / pdd=5999', { jd: 6001, pdd: 5999 }],
  ];
  for (const [name, rec] of orderCases) {
    const { mine, theirs } = compare(name, rec);
    showRow(name, mine);
    // 独立算一遍「错误顺序」的结果，确认它与正确结果确实不同（否则这条用例没有区分力）
    const wrongOrder = (() => {
      const cand = [];
      if (rec.jd > 0) cand.push({ ch: 'jd', base: rec.jd, sub: mySubsidy(rec.jd) });
      if (rec.pdd > 0) cand.push({ ch: 'pdd', base: rec.pdd, sub: mySubsidy(rec.pdd) });
      const best = cand.reduce((a, b) => (b.base - b.sub < a.base - a.sub ? b : a));
      return Math.round((best.base - best.sub) * 100) / 100;
    })();
    process.stdout.write(
      `     └ 正确顺序到手 ${mine.finalPrice}，错误顺序（分别补贴后取低）到手 ${wrongOrder}` +
        `${Object.is(wrongOrder, mine.finalPrice) ? ' —— 两者相同，无区分力' : ' —— 有区分力'}` +
        `，被测输出 ${theirs.finalPrice}\n`,
    );
  }

  process.stdout.write('\n===== V1-7 随机对拍（1000 组，价格 300~20000 含两位小数）=====\n');
  let seed = 20261013;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 1000; i += 1) {
    const mk = () => (rand() < 0.15 ? null : Math.round((300 + rand() * 19700) * 100) / 100);
    const jd = mk();
    const pdd = mk();
    compare(`随机#${i} jd=${jd} pdd=${pdd}`, { jd, pdd });
  }
  process.stdout.write(`  已比对 1000 组随机输入。\n`);

  process.stdout.write('\n===== 汇总 =====\n');
  process.stdout.write(`比对点总数：${checked}\n`);
  process.stdout.write(`不一致数量：${diffs.length}\n`);
  for (const d of diffs.slice(0, 20)) process.stdout.write(`  ✗ ${d}\n`);
  if (diffs.length === 0) process.stdout.write('  ✓ 我的独立实现与 computeDeal() 输出完全一致\n');
}

main().catch((error) => {
  process.stderr.write(`[qa-subsidy-verify] 执行失败：${error?.stack ?? String(error)}\n`);
  process.exitCode = 1;
});
