#!/usr/bin/env node
/**
 * QA 数据完整性校验脚本（只读，不修改任何业务数据文件）
 * ---------------------------------------------------------------------
 * 用法：node scripts/_qa-validate.mjs
 *
 * 由于机型数据是 TypeScript 模块，这里先用 esbuild 把 src/data/index.ts
 * 打包成临时 ESM 文件，再动态 import 进来做校验（不落库、不改源码）。
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

// 必须用 fileURLToPath：直接取 URL.pathname 会在中文/空格路径下被百分号编码
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** 校验规则 */
const RULES = {
  releaseYearMin: 2015,
  releaseYearMax: 2026,
  // 折叠屏展开后可达 10.2 英寸（如华为 Mate XT），区间放宽到 11
  screenSize: [3, 11],
  batteryCapacity: [1500, 12000],
  bodyWeight: [100, 400],
  wiredCharge: [0, 300],
  // 电竞屏 185Hz、夏普 IGZO 240Hz 均为真实市售规格，纳入常见值
  commonRefreshRates: [60, 90, 120, 144, 165, 185, 240],
};

/**
 * 分品类的区间覆盖（平板量级与手机不是一个数量级，混用会把平板全部误判）。
 *
 * 只列需要覆盖的键，其余沿用 `RULES`。
 */
const CATEGORY_RULES = {
  tablet: {
    // 小平板 8.8" ~ 大平板 14.6"（三星 Tab S9 Ultra）
    screenSize: [7, 15],
    // 小平板 6550mAh ~ 二合一 12900mAh（华为 MatePad Edge）
    batteryCapacity: [3000, 15000],
    // 8.8" 小平板 326g ~ 14.2" 二合一 789g
    bodyWeight: [200, 900],
  },
};

function rulesFor(device) {
  return { ...RULES, ...(CATEGORY_RULES[device?.category] ?? {}) };
}

/** 违规记录收集器 */
const violations = [];

function add(phone, field, actual, reason) {
  violations.push({
    brand: phone?.brand ?? '(未知品牌)',
    id: phone?.id ?? '(无 id)',
    name: phone?.name ?? '(无机型名)',
    field,
    actual,
    reason,
  });
}

/** 递归扫描：找出 NaN / undefined / 字符串里混入 "undefined" / "NaN" 的脏数据 */
function scanDirty(node, phone, trail) {
  if (node === undefined) {
    add(phone, trail, 'undefined', '字段值为 undefined');
    return;
  }
  if (node === null) return;
  if (typeof node === 'number') {
    if (!Number.isFinite(node)) add(phone, trail, String(node), '数值为 NaN / Infinity');
    return;
  }
  if (typeof node === 'string') {
    if (node === 'undefined' || node === 'NaN' || node === 'null') {
      add(phone, trail, node, `字符串字面量 " ${node} " 泄漏进数据`);
    } else if (/\b(undefined|NaN)\b/.test(node)) {
      add(phone, trail, node, '字符串中包含 undefined / NaN 片段');
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) => scanDirty(item, phone, `${trail}[${index}]`));
    return;
  }
  if (typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      scanDirty(value, phone, trail ? `${trail}.${key}` : key);
    }
  }
}

/** 数值区间校验（null 跳过，由必填校验负责） */
function checkRange(phone, field, value, [min, max]) {
  if (value === null || value === undefined) return;
  if (typeof value !== 'number') {
    add(phone, field, JSON.stringify(value), '数值字段不是 number 类型');
    return;
  }
  if (value < min || value > max) {
    add(phone, field, value, `超出合理区间 [${min}, ${max}]`);
  }
}

function isBlank(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  );
}

async function loadData() {
  // 输出到 node_modules/.cache（已被 gitignore），避免使用 rm 清理临时文件
  const outDir = path.join(PROJECT_ROOT, 'node_modules', '.cache', 'qa-validate');
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
  const mod = await import(pathToFileURL(outFile).href);
  return { mod, cleanup: () => Promise.resolve() };
}

async function main() {
  const { mod, cleanup } = await loadData();
  const { ALL_PHONES, ALL_DEVICES, DUPLICATE_IDS, PHONES_BY_BRAND, CATEGORY_COUNTS } = mod;

  const total = ALL_DEVICES.length;

  /* ---------------- 1. 品牌分布 ---------------- */
  const byBrand = new Map();
  for (const phone of ALL_DEVICES) {
    byBrand.set(phone.brand, (byBrand.get(phone.brand) ?? 0) + 1);
  }
  const brandLines = [...byBrand.entries()].sort((a, b) => b[1] - a[1]);

  /* ---------------- 2. id 唯一性 ---------------- */
  const idCounter = new Map();
  for (const phone of ALL_DEVICES) {
    idCounter.set(phone.id, (idCounter.get(phone.id) ?? 0) + 1);
  }
  const dupIds = [...idCounter.entries()].filter(([, n]) => n > 1);

  /* ---------------- 3. 逐条字段校验 ---------------- */
  const requiredMissing = [];
  for (const phone of ALL_DEVICES) {
    const rules = rulesFor(phone);
    // 必填字段
    const required = [
      ['id', phone.id],
      ['brand', phone.brand],
      ['name', phone.name],
      ['releaseDate', phone.releaseDate],
      ['performance.soc', phone.performance?.soc ?? null],
      ['screen.size', phone.screen?.size ?? null],
      ['battery.capacity', phone.battery?.capacity ?? null],
      ['camera.main', phone.camera?.main ?? null],
      ['launchPrice', phone.launchPrice ?? null],
    ];
    for (const [field, value] of required) {
      if (isBlank(value)) {
        requiredMissing.push({ id: phone.id, brand: phone.brand, name: phone.name, field });
        add(phone, field, String(value), '必填字段为空');
      }
    }

    // releaseDate 格式
    const rd = phone.releaseDate ?? '';
    if (!/^\d{4}-\d{2}$/.test(rd)) {
      add(phone, 'releaseDate', rd, "格式不符合 YYYY-MM");
    } else {
      const year = Number(rd.slice(0, 4));
      const month = Number(rd.slice(5, 7));
      if (year < rules.releaseYearMin || year > rules.releaseYearMax) {
        add(phone, 'releaseDate', rd, `年份不在 ${RULES.releaseYearMin}-${RULES.releaseYearMax}`);
      }
      if (month < 1 || month > 12) {
        add(phone, 'releaseDate', rd, '月份不在 01-12');
      }
    }

    // 数值区间（按品类取口径）
    checkRange(phone, 'screen.size', phone.screen?.size ?? null, rules.screenSize);
    checkRange(phone, 'battery.capacity', phone.battery?.capacity ?? null, rules.batteryCapacity);
    checkRange(phone, 'body.weight', phone.body?.weight ?? null, rules.bodyWeight);
    checkRange(phone, 'battery.wiredCharge', phone.battery?.wiredCharge ?? null, rules.wiredCharge);

    // 刷新率常见值
    const rr = phone.screen?.refreshRate ?? null;
    if (rr !== null && rr !== undefined) {
      if (!rules.commonRefreshRates.includes(rr)) {
        add(phone, 'screen.refreshRate', rr, `不是常见刷新率 ${rules.commonRefreshRates.join('/')}`);
      }
    }

    // 存储组合
    if (!Array.isArray(phone.storage?.ramOptions) || phone.storage.ramOptions.length === 0) {
      add(phone, 'storage.ramOptions', JSON.stringify(phone.storage?.ramOptions ?? null), '运行内存选项为空数组');
    }
    if (!Array.isArray(phone.storage?.romOptions) || phone.storage.romOptions.length === 0) {
      add(phone, 'storage.romOptions', JSON.stringify(phone.storage?.romOptions ?? null), '机身存储选项为空数组');
    }

    // 脏数据扫描
    scanDirty(phone, phone, '');
  }

  /* ---------------- 4. 导出常量一致性 ---------------- */
  const exportedKeys = Object.keys(PHONES_BY_BRAND ?? {});
  const exportedCount = exportedKeys.reduce(
    (sum, key) => sum + (PHONES_BY_BRAND[key]?.length ?? 0),
    0,
  );

  await cleanup();

  /* ---------------- 报告 ---------------- */
  const out = [];
  out.push('');
  out.push('=============== 数据完整性校验报告 ===============');
  out.push(`机型总数：${total}（跨品类）`);
  for (const [category, count] of Object.entries(CATEGORY_COUNTS ?? {})) {
    if (count > 0) out.push(`  ${category.padEnd(8, ' ')} ${count}`);
  }
  out.push('');
  out.push('--- 品牌分布（共 ' + byBrand.size + ' 个品牌） ---');
  for (const [brand, count] of brandLines) {
    out.push(`  ${brand.padEnd(12, ' ')} ${count}`);
  }
  out.push(`  ${'(合计)'.padEnd(10, ' ')} ${brandLines.reduce((s, [, c]) => s + c, 0)}`);
  out.push('');
  out.push(`PHONES_BY_BRAND 导出品牌数：${exportedKeys.length}，条目合计：${exportedCount}（含 others 子集合，可能大于总数）`);
  out.push('');

  out.push('--- id 唯一性 ---');
  out.push(`重复 id 数量：${dupIds.length}（模块内 DUPLICATE_IDS 自检结果：${DUPLICATE_IDS.length}）`);
  for (const [id, n] of dupIds.slice(0, 50)) {
    out.push(`  重复 ${n} 次：${id}`);
  }
  out.push('');

  out.push('--- 违规条目 ---');
  if (violations.length === 0) {
    out.push('  无');
  } else {
    const grouped = new Map();
    for (const item of violations) {
      const key = `${item.field} | ${item.reason}`;
      grouped.set(key, (grouped.get(key) ?? []).concat(item));
    }
    for (const [key, list] of [...grouped.entries()].sort((a, b) => b[1].length - a[1].length)) {
      out.push(`  [${key}] 共 ${list.length} 条`);
      for (const item of list.slice(0, 20)) {
        out.push(`      - ${item.brand} / ${item.name} (${item.id}) = ${item.actual}`);
      }
      if (list.length > 20) out.push(`      ... 另外 ${list.length - 20} 条省略`);
    }
  }
  out.push('');

  const cleanPhones = total - new Set(violations.map((v) => v.id)).size;
  const passRate = total === 0 ? 0 : (cleanPhones / total) * 100;
  out.push('--- 汇总 ---');
  out.push(`违规记录数：${violations.length}`);
  out.push(`受影响机型数：${new Set(violations.map((v) => v.id)).size}`);
  out.push(`完全合规机型：${cleanPhones}/${total}，通过率 ${passRate.toFixed(2)}%`);
  out.push(`必填缺失计数：${requiredMissing.length}`);
  out.push('');

  process.stdout.write(out.join('\n'));
  return violations.length;
}

main()
  .then((count) => {
    process.exitCode = count > 0 ? 1 : 0;
  })
  .catch((error) => {
    process.stderr.write(`[qa-validate] 执行失败：${error?.stack ?? String(error)}\n`);
    process.exitCode = 2;
  });
