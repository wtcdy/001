#!/usr/bin/env node
/**
 * 为 `src/data/prices.ts` 的每条报价回填 `spec`（该价格对应的配置，形如 '12+256'）。
 * ---------------------------------------------------------------------
 * 用法：
 *   node scripts/fill-price-spec.mjs            # 回填并写回 prices.ts
 *   node scripts/fill-price-spec.mjs --check    # 只体检，不写文件
 *
 * 取值口径：**最低配组合** = min(ram) + min(rom)。
 * 机型参数数据里没有 ram/rom 的条目取不到，保持不写 spec（UI 降级为不显示配置），
 * 不臆造、不用同品牌其他机型兜底。
 *
 * 可复用：新增机型后重跑即可补齐；已存在 `spec:` 的条目会被跳过（幂等）。
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

// 必须用 fileURLToPath：直接取 URL.pathname 会在中文路径下被百分号编码
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRICES_TS = path.join(PROJECT_ROOT, 'src', 'data', 'prices.ts');
const CACHE_DIR = path.join(PROJECT_ROOT, 'node_modules', '.cache', 'fill-price-spec');

/** 用 esbuild 打包参数数据，拿到运行期的机型列表（含 storage.ramOptions / romOptions） */
async function loadPhones() {
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
  const mod = await import(pathToFileURL(outfile).href);
  return mod.ALL_PHONES;
}

/** 最低配组合：min(ram) + min(rom)；任一侧缺失返回 null */
function lowestSpec(phone) {
  const nums = (list) =>
    Array.isArray(list) ? list.filter((n) => typeof n === 'number' && Number.isFinite(n) && n > 0) : [];
  const ram = nums(phone?.storage?.ramOptions);
  const rom = nums(phone?.storage?.romOptions);
  if (ram.length === 0 || rom.length === 0) return null;
  return `${Math.min(...ram)}+${Math.min(...rom)}`;
}

async function main() {
  const checkOnly = process.argv.includes('--check');
  const phones = await loadPhones();
  const specById = new Map(phones.map((p) => [p.id, lowestSpec(p)]));

  const text = await readFile(PRICES_TS, 'utf8');
  const lines = text.split('\n');

  let filled = 0;
  let skipped = 0;
  let noSpec = 0;
  const missing = [];

  const next = lines.map((line) => {
    const m = /^(\s*)'([^']+)':\s*\{(.*)\}(,?)\s*$/.exec(line);
    if (!m) return line;

    const [, indent, id, body, comma] = m;
    // 幂等：已经有 spec 的条目原样保留
    if (/\bspec:/.test(body)) {
      skipped += 1;
      return line;
    }

    const spec = specById.get(id);
    if (!spec) {
      noSpec += 1;
      missing.push(id);
      return line;
    }

    filled += 1;
    const bodyText = body.trim().length > 0 ? ` spec: '${spec}',${body}` : ` spec: '${spec}'`;
    return `${indent}'${id}': {${bodyText}}${comma}`;
  });

  const total = filled + skipped + noSpec;
  process.stdout.write('===== 报价配置（spec）回填 =====\n');
  process.stdout.write(`报价条目总数    : ${total}\n`);
  process.stdout.write(`本次回填 spec   : ${filled}\n`);
  process.stdout.write(`已有 spec 跳过  : ${skipped}\n`);
  process.stdout.write(`取不到配置      : ${noSpec}\n`);
  if (missing.length > 0) {
    process.stdout.write(`取不到的机型 id : ${missing.join(', ')}\n`);
  }

  if (checkOnly) {
    process.stdout.write('\n--check 模式：不写回文件\n');
    return;
  }
  if (filled === 0) {
    process.stdout.write('\n无需写回\n');
    return;
  }
  await writeFile(PRICES_TS, next.join('\n'), 'utf8');
  process.stdout.write(`\n已写回 ${PRICES_TS}\n`);
}

main().catch((err) => {
  process.stderr.write(`失败：${err?.stack ?? err}\n`);
  process.exitCode = 1;
});
