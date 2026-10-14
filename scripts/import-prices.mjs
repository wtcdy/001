#!/usr/bin/env node
/**
 * 渠道价格导入脚本
 * =====================================================================
 * 合规声明 / Compliance Notice
 * ---------------------------------------------------------------------
 * 1. 本脚本只读取**本地** CSV / JSON 文件，不发起任何网络请求、不抓取任何站点。
 * 2. 使用者需自行确保数据来源合法（自有整理数据 / 平台公开页面的人工记录 /
 *    已获授权的数据），并尊重各平台的数据版权与知识产权。
 * 3. 本脚本不内置任何需要登录、绕过反爬/风控或规避访问限制的逻辑。
 * 4. 价格数据仅用于个人学习与价格对比展示，请以平台页面实际结算价为准。
 *
 * 使用方式：
 *   npm run import:prices -- --input ./prices.csv
 *   npm run import:prices -- --input ./prices.json --overwrite
 *   npm run import:prices -- --input ./prices.csv --updatedAt 2026-10-13 --dry-run
 * =====================================================================
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/**
 * 使用 fileURLToPath 而非 URL.pathname：
 * 项目路径含中文时，URL.pathname 会被百分号编码，导致 ENOENT。
 */
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHONES_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'phones');
const TARGET_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'prices.ts');
const IMPORTED_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'prices-imported.ts');

/** 合理价格区间（元）：低于下限或高于上限视为脏数据 */
const PRICE_MIN = 300;
const PRICE_MAX = 20000;

/* ------------------------------------------------------------------ */
/* 参数与工具                                                          */
/* ------------------------------------------------------------------ */

/** 解析命令行参数（--key value / --key） */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

/**
 * 校验 YYYY-MM-DD 是否为真实存在的日期。
 *
 * 只校验形状（正则）会放过 2026-13-45 这种「形状对但日期非法」的值，
 * 它会原样写进数据并显示在页面上，因此这里用 Date 回读做真实性校验。
 */
function isValidDate(text) {
  if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const [year, month, day] = text.split('-').map(Number);
  if (month < 1 || month > 12) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function printHelp() {
  process.stdout.write(
    [
      '',
      '用法：npm run import:prices -- --input <file> [--updatedAt YYYY-MM-DD] [--reference] [--overwrite] [--dry-run]',
      '',
      '参数：',
      '  --input       输入文件路径（.csv 或 .json），必填',
      '  --updatedAt   报价采集日期，缺省取今天（YYYY-MM-DD）',
      '  --reference   导入的数据标记为「参考价」（isReference: true）；缺省为 false',
      '  --overwrite   允许覆盖已有的 src/data/prices.ts',
      '  --dry-run     只打印校验结果，不写入文件',
      '  --help        显示本帮助',
      '',
      '列名别名（大小写不敏感）：',
      '  id      ：机型ID / id / phoneId / 机型id',
      '  jd      ：京东自营价 / jd / 京东价 / jdPrice',
      '  pdd     ：拼多多百亿补贴价 / pdd / 百亿补贴价 / 拼多多价 / pddPrice',
      '  可选列  ：更新日期 / updatedAt / date、是否参考价 / isReference',
      '',
      '安全策略：src/data/prices.ts 已存在时默认不覆盖，改为写入 src/data/prices-imported.ts，',
      '由人工确认后再合并，避免误删既有数据（历史上出现过误覆盖导致数据丢失的事故）。',
      '',
    ].join('\n'),
  );
}

/** 读取全部机型 id（紧凑格式用 `i:'...'`，详细格式用 `id:'...'`） */
async function readPhoneIds() {
  const files = (await readdir(PHONES_DIR)).filter((file) => file.endsWith('.ts'));
  const ids = new Set();
  for (const file of files) {
    const text = await readFile(path.join(PHONES_DIR, file), 'utf8');
    for (const match of text.matchAll(/\bi:\s*'([^']+)'/g)) ids.add(match[1]);
    for (const match of text.matchAll(/\bid:\s*'([^']+)'/g)) ids.add(match[1]);
  }
  return ids;
}

/** 极简 CSV 解析：支持双引号包裹与转义字段 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

/** JSON 解析：支持数组 / { data: [] } / { prices: [] } */
function parseJson(text) {
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.data)) return parsed.data;
  if (Array.isArray(parsed?.prices)) return parsed.prices;
  if (parsed && typeof parsed === 'object') {
    // { phoneId: { jd, pdd } } 或 { phoneId: 4999 } 形式
    return Object.entries(parsed).map(([id, value]) =>
      value && typeof value === 'object' ? { id, ...value } : { id, jd: value },
    );
  }
  throw new Error('JSON 结构无法识别（支持数组 / { data: [] } / id->值 字典）');
}

/* ------------------------------------------------------------------ */
/* 字段映射与校验                                                      */
/* ------------------------------------------------------------------ */

const ALIASES = {
  id: ['机型id', '机型编号', 'id', 'phoneid', '机型ID'],
  jd: ['京东自营价', '京东价', '京东自营', 'jd', 'jdprice'],
  pdd: ['拼多多百亿补贴价', '百亿补贴价', '拼多多价', '拼多多百亿补贴', 'pdd', 'pddprice'],
  updatedAt: ['更新日期', '采集日期', 'updatedat', 'date'],
  isReference: ['是否参考价', 'isreference', '参考价'],
};

/** 把表头/键名映射到标准字段 */
function mapKey(rawKey) {
  const key = String(rawKey ?? '').trim().toLowerCase().replace(/\s/g, '');
  for (const [field, aliases] of Object.entries(ALIASES)) {
    if (aliases.includes(key)) return field;
  }
  return null;
}

/**
 * 规范化金额：去掉货币符号、千分位与单位，非法值返回 null。
 * 非法值包括：空、非数字、小于等于 0、超出 [PRICE_MIN, PRICE_MAX] 区间。
 */
function toPrice(value) {
  if (value === null || value === undefined) return { value: null, error: null };
  const text = String(value).trim();
  if (text === '' || text === '-' || text === '—') return { value: null, error: null };
  const cleaned = text.replace(/[¥$,，\s元]/g, '');
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return { value: null, error: `非数字「${text}」` };
  if (num <= 0) return { value: null, error: `非正数「${text}」` };
  if (num < PRICE_MIN || num > PRICE_MAX) {
    return { value: null, error: `超出合理区间 ${PRICE_MIN}~${PRICE_MAX}（${text}）` };
  }
  return { value: Math.round(num), error: null };
}

/** 读入原始记录并做校验；返回 { records, skipped } */
function normalizeRecords(rows, phoneIds, defaultUpdatedAt, defaultIsReference) {
  const records = [];
  const skipped = [];

  rows.forEach((row, index) => {
    const mapped = {};
    for (const [rawKey, rawValue] of Object.entries(row)) {
      const field = mapKey(rawKey);
      if (field && mapped[field] === undefined) mapped[field] = rawValue;
    }

    const id = typeof mapped.id === 'string' ? mapped.id.trim() : '';
    if (id === '') {
      skipped.push(`第 ${index + 1} 行：缺少机型 id`);
      return;
    }
    if (!phoneIds.has(id)) {
      // 不静默写入脏数据：id 不存在于参数库中，直接跳过并提示
      skipped.push(`第 ${index + 1} 行：机型 id「${id}」不在机型库中`);
      return;
    }

    const jd = toPrice(mapped.jd);
    const pdd = toPrice(mapped.pdd);
    if (jd.error) skipped.push(`${id}：京东价 ${jd.error}，已置空`);
    if (pdd.error) skipped.push(`${id}：拼多多价 ${pdd.error}，已置空`);
    if (jd.value === null && pdd.value === null) {
      skipped.push(`${id}：两个渠道均无有效价格，整条跳过`);
      return;
    }

    const rawDate = typeof mapped.updatedAt === 'string' ? mapped.updatedAt.trim() : '';
    let updatedAt = defaultUpdatedAt;
    if (rawDate !== '') {
      if (isValidDate(rawDate)) {
        updatedAt = rawDate;
      } else {
        // 形状不对或日期非法（如 2026-13-45）都回落到默认日期，并提示
        skipped.push(`${id}：更新日期「${rawDate}」非法，已回落为 ${defaultUpdatedAt}`);
      }
    }

    let isReference = defaultIsReference;
    if (mapped.isReference !== undefined) {
      const text = String(mapped.isReference).trim().toLowerCase();
      if (['true', '1', 'yes', 'y', '是', '参考'].includes(text)) isReference = true;
      else if (['false', '0', 'no', 'n', '否'].includes(text)) isReference = false;
    }

    records.push({ id, jd: jd.value, pdd: pdd.value, updatedAt, isReference });
  });

  return { records, skipped };
}

/** 渲染 prices.ts 模块源码 */
function renderModule(records, isReferenceDefault) {
  const lines = records.map((record) => {
    const flags = [`updatedAt: '${record.updatedAt}'`];
    if (record.isReference) flags.push('isReference: true');
    return `  '${record.id}': { jd: ${record.jd ?? 'null'}, pdd: ${record.pdd ?? 'null'}, ${flags.join(
      ', ',
    )} },`;
  });

  return `import { computeDeal } from '../utils/price';
import type { DealResult } from '../utils/price';
import type { Phone, PriceRecord } from '../types/phone';

/**
 * 渠道价格数据（与参数数据解耦，可独立更新）。
 *
 * 数据来源与口径：
 *  - \`jd\`  ：京东自营价（元）
 *  - \`pdd\` ：拼多多百亿补贴价（元）
 *  - \`updatedAt\`：该条报价的采集日期
 *  - \`isReference\`：true 表示参考价，非平台实时抓取值
 *
 * 覆盖范围：只收录近 2-3 年仍在售的热门机型，其余机型不出现在表中，前端显示「暂无报价」。
 *
 * 更新方式：
 *   npm run import:prices -- --input prices.csv            # 输出 prices-imported.ts
 *   npm run import:prices -- --input prices.csv --overwrite # 直接覆盖本文件
 *
 * 本文件由 \`npm run import:prices\` 生成${isReferenceDefault ? '（标记为参考价）' : ''}，请以平台页面实际结算价为准。
 *
 * 注意：价格口径函数（国补计算、有效价）不在这里，见 \`src/utils/price.ts\`
 * 与 \`src/utils/effectivePrice.ts\` —— 本文件被重新生成时它们不受影响。
 */

/** 机型 id -> 渠道报价 */
export const PRICES: Record<string, PriceRecord> = {
${lines.join('\n')}
};

/** 已收录报价的机型数量 */
export const PRICE_COUNT: number = Object.keys(PRICES).length;

/** 取某一机型的渠道报价（未收录返回 undefined） */
export function getPriceRecord(phoneId: string | undefined): PriceRecord | undefined {
  if (!phoneId) return undefined;
  return PRICES[phoneId];
}

/** 取某一机型的「成交价计算结果」（含国补），未收录报价时返回 hasPrice: false */
export function dealOfPhone(phone: Phone): DealResult {
  return computeDeal(getPriceRecord(phone.id));
}

export type { PriceRecord };
`;
}

/* ------------------------------------------------------------------ */
/* 主流程                                                              */
/* ------------------------------------------------------------------ */

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printHelp();
    return;
  }

  const input = typeof args.input === 'string' ? args.input : null;
  if (!input) {
    process.stderr.write('错误：缺少 --input 参数。使用 --help 查看用法。\n');
    process.exitCode = 1;
    return;
  }
  const inputPath = path.isAbsolute(input) ? input : path.join(process.cwd(), input);
  if (!existsSync(inputPath)) {
    process.stderr.write(`错误：输入文件不存在：${inputPath}\n`);
    process.exitCode = 1;
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const updatedAt = typeof args.updatedAt === 'string' ? args.updatedAt : today;
  if (!isValidDate(updatedAt)) {
    process.stderr.write(
      `错误：--updatedAt 需为真实存在的日期（YYYY-MM-DD），当前为 ${updatedAt}\n`,
    );
    process.exitCode = 1;
    return;
  }

  const isReferenceDefault = Boolean(args.reference);

  const raw = await readFile(inputPath, 'utf8');
  let rows;
  if (inputPath.toLowerCase().endsWith('.json')) {
    rows = parseJson(raw);
  } else {
    const table = parseCsv(raw);
    if (table.length < 2) {
      process.stderr.write('错误：CSV 至少需要表头 + 1 行数据。\n');
      process.exitCode = 1;
      return;
    }
    const [header, ...body] = table;
    rows = body.map((cells) => {
      const record = {};
      header.forEach((key, i) => {
        record[key] = cells[i] ?? '';
      });
      return record;
    });
  }

  const phoneIds = await readPhoneIds();
  process.stdout.write(`[import:prices] 机型库共 ${phoneIds.size} 个 id\n`);

  const { records, skipped } = normalizeRecords(rows, phoneIds, updatedAt, isReferenceDefault);
  for (const message of skipped) process.stdout.write(`[跳过] ${message}\n`);
  process.stdout.write(
    `[import:prices] 解析 ${rows.length} 条，有效 ${records.length} 条，跳过 ${skipped.length} 条。\n`,
  );

  // 同一 id 出现多次时，后出现的覆盖先出现的（与「后导入的数据更新」直觉一致）
  const deduped = new Map();
  for (const record of records) deduped.set(record.id, record);
  const finalRecords = Array.from(deduped.values());

  if (finalRecords.length === 0) {
    process.stderr.write('[import:prices] 没有有效数据，终止写入。\n');
    process.exitCode = 1;
    return;
  }

  if (args['dry-run']) {
    process.stdout.write('[import:prices] --dry-run 模式，跳过写入。\n');
    return;
  }

  const source = renderModule(finalRecords, isReferenceDefault);

  let outputPath = TARGET_FILE;
  if (existsSync(TARGET_FILE) && !args.overwrite) {
    outputPath = IMPORTED_FILE;
    process.stdout.write(
      '[安全] src/data/prices.ts 已存在，改为写入 src/data/prices-imported.ts（如需覆盖请加 --overwrite）。\n',
    );
  }

  await writeFile(outputPath, source, 'utf8');
  process.stdout.write(
    `[写入] ${path.relative(PROJECT_ROOT, outputPath)}（${finalRecords.length} 条，采集日期 ${updatedAt}）\n`,
  );
  process.stdout.write('[import:prices] 完成。\n');
}

main().catch((error) => {
  process.stderr.write(`[import:prices] 执行失败：${error?.stack ?? String(error)}\n`);
  process.exitCode = 1;
});
