#!/usr/bin/env node
/**
 * 机型数据采集脚本（适配器模式）
 * =====================================================================
 * 合规声明 / Compliance Notice
 * ---------------------------------------------------------------------
 * 1. 本脚本仅用于个人学习与自有数据的维护整理，请勿用于任何商业用途。
 * 2. 使用者需自行确保遵守目标站点的 robots.txt 与服务条款（Terms of Service），
 *    并尊重目标站点的数据版权与知识产权。
 * 3. 脚本内置请求限速（默认 ≥1000ms/请求）与可自定义的 User-Agent，
 *    请勿修改限速逻辑对目标站点造成压力。
 * 4. 本脚本不内置任何需要登录、需要绕过反爬/风控、或规避访问限制的逻辑。
 * 5. 本脚本不包含针对任何具体商业站点的结构性抓取规则（不写死 DOM 选择器 / 接口），
 *    如需扩展，请自行实现适配器并确保合法合规。
 *
 * 使用方式：
 *   npm run fetch -- --adapter csv  --input ./data.csv  --brand 小米
 *   npm run fetch -- --adapter json --input ./data.json --brand Apple --merge
 * =====================================================================
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** 默认请求间隔（毫秒），合规要求：不得低于 1000ms */
const DEFAULT_RATE_LIMIT_MS = 1000;

/** 默认 UA，使用者可自行调整为自己的标识 */
const DEFAULT_USER_AGENT =
  'PhoneSpecCompareBot/1.0 (personal learning project; +https://example.com/bot)';

// 使用 fileURLToPath 而非 URL.pathname，避免项目路径含中文/空格时被百分号编码
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHONES_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'phones');
const ADAPTERS_DIR = path.join(PROJECT_ROOT, 'scripts', 'adapters');

/* ------------------------------------------------------------------ */
/* 工具函数                                                            */
/* ------------------------------------------------------------------ */

/** 解析命令行参数 */
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

/** 限速 sleep */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** 打印帮助 */
function printHelp() {
  process.stdout.write(
    [
      '',
      '用法：npm run fetch -- --adapter <name> --input <file> [--brand <品牌>] [--merge] [--overwrite] [--dry-run]',
      '',
      '参数：',
      '  --adapter     适配器名称（对应 scripts/adapters/<name>.mjs），必填',
      '  --input       输入文件路径（csv / json），由适配器自行解析',
      '  --brand       输出品牌名，缺省时按数据中的 brand 字段分组',
      '  --merge       与已有数据按 id 去重（默认开启，传 --merge false 关闭）',
      '  --overwrite   允许覆盖已存在的品牌文件（默认写入 <brand>-imported.ts）',
      '  --dry-run     只打印校验结果，不写入文件',
      '  --help        显示本帮助',
      '',
      '安全策略：目标品牌文件已存在时，脚本不会覆盖，而是写入 <brand>-imported.ts，',
      '由人工确认后再合并，避免误删既有数据。',
      '',
      '内置适配器：',
      '  csv    从本地 CSV 导入（首行为表头，列名映射到 Phone 字段）',
      '  json   从本地 JSON 导入（数组或 { data: [] }）',
      '',
    ].join('\n'),
  );
}

/* ------------------------------------------------------------------ */
/* 字段映射：把适配器的原始记录映射为 Phone                            */
/* ------------------------------------------------------------------ */

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(String(value).replace(/[^\d.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function toBool(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return value;
  const text = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y', '支持', '是'].includes(text)) return true;
  if (['false', '0', 'no', 'n', '不支持', '否'].includes(text)) return false;
  return null;
}

function toNumberArray(value) {
  if (Array.isArray(value)) return value.map(toNumber).filter((n) => n !== null);
  if (typeof value === 'string') {
    return value
      .split(/[,/、\s]+/)
      .map(toNumber)
      .filter((n) => n !== null);
  }
  return [];
}

function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** 稳定哈希：当 slug 为空（如纯中文机型名）时用于兜底生成 id */
function stableHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

/**
 * 将一行原始记录映射为 Phone 对象。
 * 支持中英文列名，缺失字段统一置为 null / 空数组。
 */
export function mapRecordToPhone(record, fallbackBrand) {
  const get = (...keys) => {
    for (const key of keys) {
      if (record[key] !== undefined && record[key] !== null && record[key] !== '') return record[key];
    }
    return null;
  };

  const brand = get('brand', '品牌') ?? fallbackBrand ?? '其他';
  const name = get('name', '机型名', '机型', '机型名称', '型号', '名称');
  // id 生成优先级：显式 id/slug 列 > 品牌+机型名 slug > 稳定哈希兜底
  // （中文机型名无法直接 slug 化，此时务必在数据里提供 id 列，否则会用哈希 id）
  const idSource = get('id', 'slug') || `${brand}-${name ?? ''}`;
  const slug = slugify(idSource);
  const brandSlug = slugify(brand);
  let id = slug;
  if (brandSlug && !slug.startsWith(`${brandSlug}-`)) {
    id = `${brandSlug}-${slug}`;
  }
  if (!id) id = `phone-${stableHash(idSource)}`;

  return {
    id,
    brand,
    name: name ?? '未命名机型',
    releaseDate: get('releaseDate', 'release', '发布时间', '上市时间') ?? '',
    launchPrice: toNumber(get('launchPrice', '首发价', '上市价格')),
    currentPrice: toNumber(get('currentPrice', 'price', '参考价', '现价')),
    screen: {
      size: toNumber(get('screen.size', '屏幕尺寸', '屏幕大小')),
      resolution: get('screen.resolution', '分辨率'),
      ppi: toNumber(get('screen.ppi', 'ppi', '像素密度')),
      material: get('screen.material', '屏幕材质'),
      refreshRate: toNumber(get('screen.refreshRate', '刷新率')),
      peakBrightness: toNumber(get('screen.peakBrightness', '峰值亮度')),
      dimming: get('screen.dimming', '调光'),
      hdr: get('screen.hdr', 'HDR'),
      ratio: get('screen.ratio', '屏占比'),
    },
    performance: {
      soc: get('performance.soc', 'soc', '处理器', 'cpu型号'),
      socBrand: get('performance.socBrand', '处理器厂商'),
      process: get('performance.process', '制程'),
      cpu: get('performance.cpu', 'CPU'),
      gpu: get('performance.gpu', 'GPU'),
      antutu: toNumber(get('performance.antutu', '安兔兔', '安兔兔跑分')),
      ramType: get('performance.ramType', '内存规格'),
      romType: get('performance.romType', '闪存规格'),
    },
    storage: {
      ramOptions: toNumberArray(get('storage.ramOptions', '运行内存', 'ram')),
      romOptions: toNumberArray(get('storage.romOptions', '机身存储', 'rom')),
    },
    camera: {
      main: get('camera.main', '主摄'),
      ultraWide: get('camera.ultraWide', '超广角'),
      telephoto: get('camera.telephoto', '长焦'),
      extra: get('camera.extra', '其他镜头'),
      zoom: get('camera.zoom', '变焦'),
      video: get('camera.video', '视频'),
    },
    frontCamera: get('frontCamera', '前置摄像头', '前置'),
    battery: {
      capacity: toNumber(get('battery.capacity', '电池容量', '电池')),
      wiredCharge: toNumber(get('battery.wiredCharge', '有线充电', '充电功率')),
      wirelessCharge: toNumber(get('battery.wirelessCharge', '无线充电')),
      reverseCharge: get('battery.reverseCharge', '反向充电'),
    },
    system: {
      os: get('system.os', 'os', '操作系统', '出厂系统'),
      ui: get('system.ui', 'ui', '系统界面'),
      network: get('system.network', '网络', '网络制式'),
      wifi: get('system.wifi', 'wifi'),
      bluetooth: get('system.bluetooth', '蓝牙'),
      nfc: toBool(get('system.nfc', 'nfc', 'NFC')),
      infrared: toBool(get('system.infrared', '红外', '红外遥控')),
      satellite: get('system.satellite', '卫星通信'),
    },
    body: {
      dimensions: get('body.dimensions', '尺寸', '机身尺寸'),
      weight: toNumber(get('body.weight', '重量')),
      material: get('body.material', '机身材质'),
      ip: get('body.ip', '防水', '防尘防水'),
      biometrics: get('body.biometrics', '生物识别'),
      speaker: get('body.speaker', '扬声器'),
      port: get('body.port', '接口'),
      colors: get('body.colors', '配色'),
    },
    tags: Array.isArray(record.tags)
      ? record.tags
      : typeof record.tags === 'string'
        ? record.tags.split(/[,、\s]+/).filter(Boolean)
        : [],
    source: get('source', '数据来源') ?? '脚本导入',
  };
}

/** 必填字段校验 */
export function validatePhone(phone) {
  const errors = [];
  if (!phone.id) errors.push('缺少 id');
  if (!phone.brand) errors.push('缺少 brand');
  if (!phone.name) errors.push('缺少 name');
  if (!phone.releaseDate) errors.push('缺少 releaseDate');
  if (!phone.performance?.soc) errors.push('缺少 performance.soc');
  if (phone.screen && phone.screen.size === null) errors.push('缺少 screen.size');
  if (phone.battery && phone.battery.capacity === null) errors.push('缺少 battery.capacity');
  if (!phone.camera?.main) errors.push('缺少 camera.main');
  if (phone.currentPrice === null && phone.launchPrice === null) errors.push('缺少价格');
  return errors;
}

/* ------------------------------------------------------------------ */
/* 输出：生成 src/data/phones/<brand>.ts                               */
/* ------------------------------------------------------------------ */

/** 安全地序列化字符串，用于生成 TS 字面量 */
function tsString(value) {
  if (value === null || value === undefined) return 'null';
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function tsNumber(value) {
  return value === null || value === undefined ? 'null' : String(value);
}

function tsBool(value) {
  return value === null || value === undefined ? 'null' : value ? 'true' : 'false';
}

function tsArray(list) {
  if (!list || list.length === 0) return '[]';
  return `[${list.join(', ')}]`;
}

/** 把 Phone 数组渲染成使用 `c()` 工厂的 TS 模块源码 */
export function renderBrandModule(brandExportName, brand, phones) {
  const lines = [];
  lines.push(`import { c, type CompactSeed } from './_factory';`);
  lines.push('');
  lines.push(`/** ${brand} 机型（由 scripts/fetch-phones.mjs 生成，请勿手工大改） */`);
  lines.push('const SEEDS: CompactSeed[] = [');

  for (const p of phones) {
    const fields = [
      `i:${tsString(p.id)}`,
      `n:${tsString(p.name)}`,
      `d:${tsString(p.releaseDate)}`,
      `lp:${tsNumber(p.launchPrice)}`,
      `cp:${tsNumber(p.currentPrice)}`,
      `sz:${tsNumber(p.screen?.size ?? null)}`,
      `res:${tsString(p.screen?.resolution ?? null)}`,
      `ppi:${tsNumber(p.screen?.ppi ?? null)}`,
      `mat:${tsString(p.screen?.material ?? null)}`,
      `rr:${tsNumber(p.screen?.refreshRate ?? null)}`,
      `nit:${tsNumber(p.screen?.peakBrightness ?? null)}`,
      `dim:${tsString(p.screen?.dimming ?? null)}`,
      `hdr:${tsString(p.screen?.hdr ?? null)}`,
      `soc:${tsString(p.performance?.soc ?? null)}`,
      `sb:${tsString(p.performance?.socBrand ?? null)}`,
      `pr:${tsString(p.performance?.process ?? null)}`,
      `cpu:${tsString(p.performance?.cpu ?? null)}`,
      `gpu:${tsString(p.performance?.gpu ?? null)}`,
      `an:${tsNumber(p.performance?.antutu ?? null)}`,
      `rt:${tsString(p.performance?.ramType ?? null)}`,
      `ft:${tsString(p.performance?.romType ?? null)}`,
      `ram:${tsArray(p.storage?.ramOptions ?? [])}`,
      `rom:${tsArray(p.storage?.romOptions ?? [])}`,
      `cm:${tsString(p.camera?.main ?? null)}`,
      `cw:${tsString(p.camera?.ultraWide ?? null)}`,
      `ct:${tsString(p.camera?.telephoto ?? null)}`,
      `ce:${tsString(p.camera?.extra ?? null)}`,
      `cz:${tsString(p.camera?.zoom ?? null)}`,
      `cv:${tsString(p.camera?.video ?? null)}`,
      `fc:${tsString(p.frontCamera ?? null)}`,
      `bc:${tsNumber(p.battery?.capacity ?? null)}`,
      `bw:${tsNumber(p.battery?.wiredCharge ?? null)}`,
      `bwl:${tsNumber(p.battery?.wirelessCharge ?? null)}`,
      `br:${tsString(p.battery?.reverseCharge ?? null)}`,
      `os:${tsString(p.system?.os ?? null)}`,
      `ui:${tsString(p.system?.ui ?? null)}`,
      `net:${tsString(p.system?.network ?? null)}`,
      `wf:${tsString(p.system?.wifi ?? null)}`,
      `bt:${tsString(p.system?.bluetooth ?? null)}`,
      `nfc:${tsBool(p.system?.nfc ?? null)}`,
      `ir:${tsBool(p.system?.infrared ?? null)}`,
      `sat:${tsString(p.system?.satellite ?? null)}`,
      `bdim:${tsString(p.body?.dimensions ?? null)}`,
      `wt:${tsNumber(p.body?.weight ?? null)}`,
      `bm:${tsString(p.body?.material ?? null)}`,
      `ip:${tsString(p.body?.ip ?? null)}`,
      `bio:${tsString(p.body?.biometrics ?? null)}`,
      `spk:${tsString(p.body?.speaker ?? null)}`,
      `port:${tsString(p.body?.port ?? null)}`,
      `col:${tsString(p.body?.colors ?? null)}`,
      `tags:${tsArray((p.tags ?? []).map((t) => tsString(t)))}`,
    ];
    lines.push(`  { ${fields.join(', ')} },`);
  }

  lines.push('];');
  lines.push('');
  lines.push(`export const ${brandExportName} = c(${tsString(brand)}, SEEDS);`);
  lines.push(`export default ${brandExportName};`);
  lines.push('');
  return lines.join('\n');
}

/** 生成导出常量名，如 "小米" -> "XIAOMI_PHONES"（中文品牌退化为拼音不可靠，使用安全标识） */
function exportNameOf(brand, index) {
  const ascii = String(brand)
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();
  return `${ascii || `BRAND${index}`}_PHONES`;
}

/**
 * 从已存在的品牌文件中提取 id 列表，用于合并去重。
 * 同时兼容精简格式（`i:'...'`）与详细格式（`id: '...'`）；
 * 使用 \b 边界避免误匹配 `ui:'iOS'`、`ip:'IP68'` 等字段。
 */
async function readExistingIds(filePath) {
  if (!existsSync(filePath)) return [];
  const content = await readFile(filePath, 'utf8');
  const ids = new Set();
  for (const regex of [/\bi:\s*'([^']+)'/g, /\bid:\s*'([^']+)'/g]) {
    let match = regex.exec(content);
    while (match !== null) {
      ids.add(match[1]);
      match = regex.exec(content);
    }
  }
  return Array.from(ids);
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

  const adapterName = typeof args.adapter === 'string' ? args.adapter : null;
  if (!adapterName) {
    process.stderr.write('错误：缺少 --adapter 参数。使用 --help 查看用法。\n');
    process.exitCode = 1;
    return;
  }

  const adapterPath = path.join(ADAPTERS_DIR, `${adapterName}.mjs`);
  if (!existsSync(adapterPath)) {
    const available = (await readdir(ADAPTERS_DIR)).filter((f) => f.endsWith('.mjs'));
    process.stderr.write(
      `错误：未找到适配器 ${adapterName}（${adapterPath}）。可用适配器：${available.join(', ')}\n`,
    );
    process.exitCode = 1;
    return;
  }

  const adapterModule = await import(pathToFileURL(adapterPath).href);
  const adapter = adapterModule.default ?? adapterModule.createAdapter?.();
  if (!adapter || typeof adapter.load !== 'function') {
    process.stderr.write('错误：适配器必须导出 default，且实现 load(options) 方法。\n');
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`[fetch] 使用适配器：${adapterName}\n`);
  process.stdout.write(`[fetch] 限速：${DEFAULT_RATE_LIMIT_MS}ms/请求，UA：${DEFAULT_USER_AGENT}\n`);

  const rawRecords = await adapter.load({
    input: typeof args.input === 'string' ? args.input : undefined,
    userAgent: DEFAULT_USER_AGENT,
    rateLimitMs: DEFAULT_RATE_LIMIT_MS,
    sleep,
  });

  if (!Array.isArray(rawRecords)) {
    process.stderr.write('错误：适配器的 load() 必须返回数组。\n');
    process.exitCode = 1;
    return;
  }

  const fallbackBrand = typeof args.brand === 'string' ? args.brand : undefined;
  const phones = rawRecords.map((record) => mapRecordToPhone(record, fallbackBrand));

  // 校验
  let invalid = 0;
  for (const phone of phones) {
    const errors = validatePhone(phone);
    if (errors.length > 0) {
      invalid += 1;
      process.stdout.write(`[校验] ${phone.id}：${errors.join('、')}\n`);
    }
  }
  process.stdout.write(`[fetch] 共解析 ${phones.length} 条，其中必填缺失 ${invalid} 条。\n`);

  // 按品牌分组
  const grouped = new Map();
  for (const phone of phones) {
    const list = grouped.get(phone.brand) ?? [];
    list.push(phone);
    grouped.set(phone.brand, list);
  }

  if (args['dry-run']) {
    process.stdout.write('[fetch] --dry-run 模式，跳过写入。\n');
    return;
  }

  let index = 0;
  for (const [brand, list] of grouped.entries()) {
    index += 1;
    let exportName = exportNameOf(brand, index);
    const baseName =
      String(brand).replace(/[^A-Za-z0-9]/g, '').toLowerCase() || `brand${index}`;
    let filePath = path.join(PHONES_DIR, `${baseName}.ts`);

    let merged = list;

    // 安全策略：默认绝不覆盖已有品牌文件（避免误删既有数据），
    // 改为写入 `<brand>-imported.ts`，由人工确认后再合并。
    if (existsSync(filePath)) {
      const existingIds = await readExistingIds(filePath);
      const existingSet = new Set(existingIds);
      if (args.merge !== false) {
        merged = list.filter((phone) => !existingSet.has(phone.id));
      }
      process.stdout.write(
        `[合并] ${baseName}.ts 已存在 ${existingIds.length} 条，去重后待写入 ${merged.length} 条。\n`,
      );
      if (!args.overwrite) {
        filePath = path.join(PHONES_DIR, `${baseName}-imported.ts`);
        exportName = `${exportName.replace(/_PHONES$/, '')}_IMPORTED_PHONES`;
        process.stdout.write(
          `[安全] 目标文件已存在，改为写入 ${baseName}-imported.ts（如需覆盖请加 --overwrite）。\n`,
        );
      }
    }

    if (merged.length === 0) {
      process.stdout.write(`[跳过] ${baseName}：没有新增数据。\n`);
      continue;
    }

    const source = renderBrandModule(exportName, brand, merged);
    await writeFile(filePath, source, 'utf8');
    process.stdout.write(`[写入] ${path.relative(PROJECT_ROOT, filePath)}（${merged.length} 条）\n`);
  }

  process.stdout.write('[fetch] 完成。请检查生成的文件，并在 src/data/index.ts 中注册新品牌。\n');
}

main().catch((error) => {
  process.stderr.write(`[fetch] 执行失败：${error?.stack ?? String(error)}\n`);
  process.exitCode = 1;
});
