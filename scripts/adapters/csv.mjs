/**
 * CSV 导入适配器（示例）
 * ---------------------------------------------------------------------
 * 合规提示：本适配器只读取**本地**文件，不发起任何网络请求。
 * 请勿将其改造为针对第三方站点的高频抓取工具。
 *
 * 输入：本地 CSV 文件，首行为表头，列名支持中英文（见 fetch-phones.mjs 的 mapRecordToPhone）。
 * 输出：原始记录数组。
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

/** 极简 CSV 解析：支持双引号包裹与转义的 "" */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
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
      field = '';
      rows.push(row);
      row = [];
    } else if (char === '\r') {
      // 忽略 CR（兼容 CRLF）
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

const adapter = {
  name: 'csv',
  description: '从本地 CSV 文件导入机型数据（首行为表头）',

  /** @param {{input?: string, userAgent?: string, rateLimitMs?: number, sleep?: Function}} options */
  async load(options) {
    const input = options?.input;
    if (!input) {
      throw new Error('csv 适配器需要 --input 参数指定 CSV 文件路径');
    }

    const filePath = path.isAbsolute(input) ? input : path.resolve(process.cwd(), input);
    const text = await readFile(filePath, 'utf8');
    const rows = parseCsv(text);

    if (rows.length === 0) return [];

    const headers = rows[0].map((h) => h.trim());
    return rows.slice(1).map((cells) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = cells[index] ?? '';
      });
      return record;
    });
  },
};

export default adapter;
export { adapter };
