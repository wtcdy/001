/**
 * JSON 导入适配器（示例）
 * ---------------------------------------------------------------------
 * 合规提示：本适配器只读取**本地**文件，不发起任何网络请求。
 * 请勿将其改造为针对第三方站点的高频抓取工具。
 *
 * 支持的文件结构（任选其一）：
 *   1) [ { ... }, { ... } ]                      顶层为数组
 *   2) { "data": [ { ... } ] }                   顶层对象的 data 字段为数组
 *   3) { "phones": [ { ... } ] } / { "list": [] } 常见别名字段
 *   4) { "品牌名": [ { ... } ], "品牌名2": [...] }  以品牌名为 key 的字典
 *
 * 输出：原始记录数组（字段名见 fetch-phones.mjs 的 mapRecordToPhone）。
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

/** 顶层对象中可能承载数组的字段名（按优先级排序） */
const ARRAY_KEYS = ['data', 'phones', 'list', 'items', 'results', 'records'];

/**
 * 将任意受支持的 JSON 结构归一化为记录数组。
 * @param {unknown} parsed 已解析的 JSON 数据
 * @returns {Array<Record<string, unknown>>} 记录数组
 */
export function normalizeRecords(parsed) {
  if (Array.isArray(parsed)) {
    return parsed.filter((item) => item !== null && typeof item === 'object');
  }

  if (parsed === null || typeof parsed !== 'object') {
    return [];
  }

  const container = /** @type {Record<string, unknown>} */ (parsed);

  for (const key of ARRAY_KEYS) {
    if (Array.isArray(container[key])) {
      return container[key].filter((item) => item !== null && typeof item === 'object');
    }
  }

  // 以品牌名为 key 的字典：{ "小米": [ ... ], "Apple": [ ... ] }
  const merged = [];
  for (const value of Object.values(container)) {
    if (Array.isArray(value)) {
      merged.push(...value.filter((item) => item !== null && typeof item === 'object'));
    }
  }
  return merged;
}

const adapter = {
  name: 'json',
  description: '从本地 JSON 文件导入机型数据（支持数组 / {data:[]} / 品牌字典）',

  /** @param {{input?: string, userAgent?: string, rateLimitMs?: number, sleep?: Function}} options */
  async load(options) {
    const input = options?.input;
    if (!input) {
      throw new Error('json 适配器需要 --input 参数指定 JSON 文件路径');
    }

    const filePath = path.isAbsolute(input) ? input : path.resolve(process.cwd(), input);
    const text = await readFile(filePath, 'utf8');

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw new Error(`JSON 解析失败（${filePath}）：${error?.message ?? String(error)}`);
    }

    const records = normalizeRecords(parsed);
    if (records.length === 0) {
      process.stdout.write('[json] 警告：未在文件中找到任何记录。\n');
    }
    return records;
  },
};

export default adapter;
export { adapter };
