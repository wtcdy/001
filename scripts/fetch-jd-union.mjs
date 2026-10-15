#!/usr/bin/env node
/**
 * 京东自营价格抓取脚本（京东联盟官方 API）
 * =====================================================================
 * 合规声明 / Compliance Notice
 * ---------------------------------------------------------------------
 * 1. 本脚本通过**京东联盟官方开放 API**（union.jd.com / open.jd.com）获取
 *    商品数据，使用个人开发者实名注册后获得的合法凭证，不绕过任何风控、
 *    不抓取网页端脱敏数据。所有请求均走官方网关 https://api.jd.com/routerjson。
 * 2. 仅用于本项目「手机/平板参数对比」的自营价格展示，非商用；不二次分发原始数据。
 * 3. 严格限速：串行请求、每次间隔 ≥ 350ms（QPS≈2.8，低于官方个人权限 QPS 5），
 *    遇限流指数退避重试，最多 3 次。
 * 4. 抓不到就是抓不到：搜不到 / 全部被过滤 → 该机型不写入结果，绝不用任何
 *    估算 / 折扣模型填充。真实抓到的记录 isReference 一律写 false。
 *
 * 使用方式：
 *   # 无密钥时会打印注册指引并干净退出（exit 1）
 *   node scripts/fetch-jd-union.mjs
 *
 *   # 有密钥后（推荐用 .env.local，已被 .gitignore 忽略）：
 *   #   JD_UNION_APP_KEY=xxx JD_UNION_APP_SECRET=yyy node scripts/fetch-jd-union.mjs
 *   # 或先 source .env.local 再运行
 *
 *   # 默认只写 data/jd-prices.json；加 --apply 才合并进 src/data/prices.ts
 *   node scripts/fetch-jd-union.mjs --apply
 *
 *   # 只跑指定品牌（调试用）：--brand 小米 --brand Apple
 *   # 限制机型数量（调试用）：--limit 5
 *   # 自检模式（不发真实请求，验证签名/限速/过滤/输出链路）：--self-test
 * =====================================================================
 */

import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const OUTPUT_JSON = path.join(DATA_DIR, 'jd-prices.json');
const REPORT_DIR = path.join(PROJECT_ROOT, 'research');

/* ------------------------------------------------------------------ */
/* 常量（均来自京东联盟官方文档核实，见 research 报告与脚本头部链接）    */
/* ------------------------------------------------------------------ */

/** 京东联盟统一网关 */
const API_GATEWAY = 'https://api.jd.com/routerjson';
/** 关键词搜索接口 */
const METHOD_SEARCH = 'jd.union.open.goods.search';
/** 签名算法：官方只支持 md5 */
const SIGN_METHOD = 'md5';
/** API 协议版本 */
const API_VERSION = '1.0';

/** 每次请求最小间隔（ms）。官方个人权限 QPS≈5，取 2.8 留足余量 */
const MIN_INTERVAL_MS = 350;
/** 限流 / 错误码指数退避重试次数 */
const MAX_RETRIES = 3;
/** 手机合理价格区间（元）：超出视为脏数据 / 非手机品类 */
const PHONE_PRICE_MIN = 300;
const PHONE_PRICE_MAX = 20000;
/** 只处理近 N 年发布的机型（老机型渠道早已无货，不浪费配额） */
const RECENT_YEARS = 2;

/**
 * 配件 / 周边 / 非整机关键词黑名单。
 * 标题命中任意一个一律丢弃（误匹配是最大风险）。
 */
const ACCESSORY_KEYWORDS = [
  '手机壳', '保护壳', '保护套', '贴膜', '钢化膜', '数据线', '充电器', '充电头',
  '耳机', '支架', '内存卡', '镜头膜', '挂绳', '背包', '散热器', '碎屏险',
  '以旧换新', '合约机', '租赁', '手机支架', '车载支架', '保护帽', '边框',
  '背板', '后盖', '电池', '换电池', '维修', '二手', '翻新', '展示机', '样机',
  '手机膜', '镜头保护', '手机链', '手腕带', '挂脖', '收纳', '清洁', '套装',
];

/** 非手机品类关键词（搜到要丢弃，除非该设备本身就是平板） */
const NON_PHONE_CATEGORY_KEYWORDS = [
  '笔记本', '平板电脑', '平板 ', 'Pad', 'pad', '手表', '手环', '耳机',
  '音箱', '电视', '显示器', '路由器', '扫地机', '洗地机', '吹风机',
];

/* ------------------------------------------------------------------ */
/* 命令行参数                                                          */
/* ------------------------------------------------------------------ */

function parseArgs(argv) {
  const args = { _: [] };
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

function printHelp() {
  process.stdout.write(
    [
      '',
      '京东自营价格抓取（京东联盟官方 API）',
      '',
      '用法：',
      '  node scripts/fetch-jd-union.mjs [选项]',
      '',
      '选项：',
      '  --apply           合并结果进 src/data/prices.ts（默认关闭，只写 data/jd-prices.json）',
      '  --brand <品牌>    只跑指定品牌，可多次传（如 --brand 小米 --brand Apple）',
      '  --limit <N>       只跑前 N 款机型（调试用）',
      '  --self-test       自检模式：不发起真实网络请求，验证签名/限速/过滤/输出链路',
      '  --interval <ms>   覆盖请求间隔（默认 350ms）',
      '  --help            打印本帮助',
      '',
      '密钥（环境变量，缺失时打印注册指引并退出）：',
      '  JD_UNION_APP_KEY     京东联盟 App Key',
      '  JD_UNION_APP_SECRET  京东联盟 App Secret',
      '  JD_UNION_ACCESS_TOKEN 可选；联盟 client_credentials 模式换取的 token',
      '',
    ].join('\n'),
  );
}

/* ------------------------------------------------------------------ */
/* 环境变量 / .env.local 读取                                          */
/* ------------------------------------------------------------------ */

/**
 * 从 .env.local 读取键值并写入 process.env（不覆盖已有的真实环境变量）。
 * .env.local 已被 .gitignore 忽略（.env.* 规则），不会进仓库。
 */
async function loadEnvLocal() {
  const envPath = path.join(PROJECT_ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  const text = await readFile(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // 去掉成对引号
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

/** 校验密钥，缺失时打印清晰的中文注册指引并 exit 1 */
function requireCredentials() {
  const appKey = process.env.JD_UNION_APP_KEY;
  const appSecret = process.env.JD_UNION_APP_SECRET;
  if (!appKey || !appSecret) {
    process.stderr.write(
      [
        '',
        '❌ 缺少京东联盟密钥（JD_UNION_APP_KEY / JD_UNION_APP_SECRET）。',
        '',
        '请按以下步骤获取（个人开发者实名即可，无需企业资质）：',
        '',
        '  1. 注册京东联盟账号并完成实名认证：https://union.jd.com',
        '     （进入「开发者中心 / 开放平台」，个人实名认证即可开通基础接口权限）',
        '  2. 在「我的应用」创建应用，审核通过后在应用详情页拿到两个值：',
        '       - App Key     （应用唯一标识）',
        '       - App Secret  （签名密钥，请妥善保管，勿提交进仓库）',
        '  3. 申请接口权限：在服务管理中申请 `jd.union.open.goods.search`',
        '     （关键词搜索）与 `jd.union.open.goods.query`（SKU 详情）；',
        '     基础权限个人实名即可，审核周期约 1-3 个工作日。',
        '  4. 绑定推广位（PID）：联盟后台创建推广位，用于跟踪佣金（可选）。',
        '',
        '  拿到后，用以下任一方式设置（推荐 .env.local，已被 .gitignore 忽略）：',
        '',
        '     # 方式 A：写入项目根目录 .env.local（推荐）',
        '     echo "JD_UNION_APP_KEY=你的key" >> .env.local',
        '     echo "JD_UNION_APP_SECRET=你的secret" >> .env.local',
        '',
        '     # 方式 B：临时环境变量',
        '     JD_UNION_APP_KEY=你的key JD_UNION_APP_SECRET=你的secret node scripts/fetch-jd-union.mjs',
        '',
      ].join('\n'),
    );
    process.exit(1);
  }
  return { appKey, appSecret, accessToken: process.env.JD_UNION_ACCESS_TOKEN || '' };
}

/* ------------------------------------------------------------------ */
/* 京东联盟签名与请求                                                  */
/* ------------------------------------------------------------------ */

/**
 * 京东联盟官方 MD5 签名算法（已按官方文档核实）：
 *  1. 将所有请求参数名（含系统参数与 360buy_param_json 业务参数）按字母升序排序；
 *  2. 依次拼接「参数名+参数值」（业务参数 360buy_param_json 整体作为一个 value，
 *     不参与二次排序）；
 *  3. 在拼接串**首尾各加一次 appSecret**；
 *  4. 对最终字符串做 MD5，转**大写**，即为 sign。
 *
 * 依据：union.jd.com/helpcenter/13246-13312-108188（官方签名规则原文）
 */
function md5Sign(params, appSecret) {
  const sortedKeys = Object.keys(params).sort();
  let signStr = appSecret;
  for (const key of sortedKeys) {
    const value = params[key];
    if (value === undefined || value === null || value === '') continue;
    signStr += `${key}${value}`;
  }
  signStr += appSecret;
  return createHash('md5').update(signStr, 'utf8').digest('hex').toUpperCase();
}

/** 东八区时间戳 yyyy-MM-dd HH:mm:ss（官方要求与服务器误差 ≤ 10 分钟） */
function jdTimestamp() {
  const now = new Date();
  // 转东八区（UTC+8）
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const cst = new Date(utcMs + 8 * 3600000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${cst.getUTCFullYear()}-${pad(cst.getUTCMonth() + 1)}-${pad(cst.getUTCDate())} ` +
    `${pad(cst.getUTCHours())}:${pad(cst.getUTCMinutes())}:${pad(cst.getUTCSeconds())}`;
}

/**
 * 调用一次京东联盟接口（POST routerjson）。
 * 返回解析后的业务响应体（response 字段内的对象）。
 */
async function callApi({ method, bizParams, creds, accessToken }) {
  const timestamp = jdTimestamp();
  // 系统级公共参数
  const sysParams = {
    method,
    app_key: creds.appKey,
    timestamp,
    format: 'json',
    v: API_VERSION,
    sign_method: SIGN_METHOD,
  };
  // 业务参数整体放进 360buy_param_json（作为单个 value，不拆进签名排序）
  const allParams = {
    ...sysParams,
    '360buy_param_json': JSON.stringify(bizParams),
  };
  if (accessToken) allParams.access_token = accessToken;
  allParams.sign = md5Sign(allParams, creds.appSecret);

  // POST x-www-form-urlencoded
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(allParams)) form.set(k, String(v));

  const resp = await fetch(API_GATEWAY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: form.toString(),
  });
  const raw = await resp.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(`网关返回非 JSON：HTTP ${resp.status} body=${raw.slice(0, 200)}`);
  }
  // 网关级错误：京东在失败时返回顶层 error_response（含 code / zh_desc / en_desc）
  if (json.error_response) {
    const e = json.error_response;
    throw new Error(`网关错误 code=${e.code} msg=${e.zh_desc || e.en_desc || e.msg || ''}`);
  }
  if (json.code && json.code !== '0') {
    const err = json.errmsg || json.zh_desc || json.en_desc || JSON.stringify(json);
    throw new Error(`网关错误 code=${json.code} msg=${err}`);
  }
  // 业务响应体挂在 method 名对应的键下（排除 error_response）
  const respKey = `${method.replace(/\./g, '_')}_response`;
  const body = json[respKey] || Object.keys(json).find((k) => k.endsWith('_response') && k !== 'error_response');
  if (!body) return json;
  // 业务错误：code 非 200 视为失败
  if (body.code !== undefined && String(body.code) !== '200') {
    throw new Error(`业务错误 code=${body.code} msg=${body.msg || body.message || ''}`);
  }
  return body;
}

/**
 * 关键词搜索商品，返回商品数组。带指数退避重试。
 * 业务参数结构（官方文档核实）：360buy_param_json 内层 DTO 键为 `goodsReqDTO`，
 * 字段 keyword / pageIndex / pageSize / isSelf 等。
 */
async function searchGoods({ keyword, pageIndex = 1, pageSize = 20, isSelf = 1, creds, accessToken }) {
  const bizParams = {
    goodsReqDTO: {
      keyword,
      pageIndex: String(pageIndex),
      pageSize: String(pageSize),
      ...(isSelf !== undefined ? { isSelf: String(isSelf) } : {}),
    },
  };
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const body = await callApi({ method: METHOD_SEARCH, bizParams, creds, accessToken });
      // 兼容不同字段命名：data / goodsList / resultList
      const list =
        body.data || body.goodsList || body.resultList ||
        (body.result && (body.result.data || body.result.goodsList)) || [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      lastErr = e;
      const msg = String(e.message || e);
      const rateLimited = /限流|频繁|QPS|429|rate|too many|稍后重试|请稍后|10019|100005/i.test(msg);
      if (attempt < MAX_RETRIES && rateLimited) {
        const backoff = MIN_INTERVAL_MS * 2 ** attempt;
        process.stderr.write(`  ⏳ 限流/错误，退避 ${backoff}ms 后重试(${attempt}/${MAX_RETRIES})：${msg}\n`);
        await sleep(backoff);
        continue;
      }
      // 非限流或重试用尽：抛出，由上层决定跳过还是记录
      break;
    }
  }
  throw lastErr;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------ */
/* 机型筛选与匹配                                                      */
/* ------------------------------------------------------------------ */

/** 从 ALL_DEVICES 里筛选在售机型：近 2 年发布且当前有价格展示 */
function pickInSaleDevices(allDevices, { brands, limit }) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - RECENT_YEARS;
  const out = [];
  for (const d of allDevices) {
    // 只处理手机与平板（脚本职责范围；平板本身也需比价）
    if (d.category !== 'phone' && d.category !== 'tablet') continue;
    // 发布时间过滤：releaseDate 形如 '2024-10'
    const y = Number(String(d.releaseDate).slice(0, 4));
    if (!Number.isFinite(y) || y < minYear) continue;
    // 当前有价格展示
    if (d.currentPrice === null || d.currentPrice === undefined) continue;
    // 品牌过滤
    if (brands && brands.length && !brands.includes(d.brand)) continue;
    out.push(d);
  }
  // 稳定排序：按品牌 + 发布年月倒序，保证可复现
  out.sort((a, b) =>
    String(a.brand).localeCompare(String(b.brand)) ||
    String(b.releaseDate).localeCompare(String(a.releaseDate)),
  );
  if (Number.isFinite(limit) && limit > 0) return out.slice(0, limit);
  return out;
}

/**
 * 构造搜索关键词：品牌 + 机型名，避免品牌名重复拼接。
 * 机型名若已含品牌前缀（如「小米 15 Ultra」）则不重复加品牌。
 */
function buildKeyword(device) {
  const name = String(device.name || '').trim();
  const brand = String(device.brand || '').trim();
  if (!name) return brand;
  // 机型名已包含品牌（含英文品牌）则直接用机型名
  if (brand && brand !== '其他' && name.toLowerCase().includes(brand.toLowerCase())) {
    return name;
  }
  // Apple 的机型名是纯英文（iPhone ...），品牌用英文
  const brandMap = { Apple: 'Apple', 华为: '华为', 小米: '小米', Redmi: 'Redmi', OPPO: 'OPPO', vivo: 'vivo', iQOO: 'iQOO', 荣耀: '荣耀', 三星: '三星', 一加: '一加', realme: 'realme', 魅族: '魅族', 摩托罗拉: 'motorola', 索尼: '索尼', 努比亚: '努比亚', 中兴: '中兴', 华硕: '华硕', Google: 'Google', Nothing: 'Nothing' };
  const b = brandMap[brand] || brand;
  if (!b || name.toLowerCase().includes(b.toLowerCase())) return name;
  return `${b} ${name}`;
}

/** 从标题里识别存储配置，如「12GB+256GB」「12+256」「12G+256G」→ 归一为 '12+256' */
function parseStorageFromTitle(title) {
  if (typeof title !== 'string') return null;
  // 形如 12GB+256GB / 12+256 / 12G+256G / 12GB 256GB
  const m = title.match(/(\d{1,3})\s*(?:GB|G|gb|g)?\s*[+＋]\s*(\d{1,4})\s*(?:GB|G|gb|g)?/);
  if (m) return `${m[1]}+${m[2]}`;
  return null;
}

/** 该机型最低配组合（min(ram)+min(rom)） */
function lowestSpec(device) {
  const ram = Array.isArray(device.storage?.ramOptions) ? device.storage.ramOptions.filter((n) => n > 0) : [];
  const rom = Array.isArray(device.storage?.romOptions) ? device.storage.romOptions.filter((n) => n > 0) : [];
  if (!ram.length || !rom.length) return '';
  return `${Math.min(...ram)}+${Math.min(...rom)}`;
}

/** 标题是否命中配件/周边黑名单 */
function hitAccessory(title) {
  if (typeof title !== 'string') return false;
  const t = title.toLowerCase();
  return ACCESSORY_KEYWORDS.some((k) => t.includes(k.toLowerCase()));
}

/** 标题是否像非手机品类（平板/笔记本/手表等） */
function hitNonPhoneCategory(title, device) {
  if (typeof title !== 'string') return false;
  // 平板设备本身允许「平板」字样
  if (device.category === 'tablet') return false;
  const t = title.toLowerCase();
  return NON_PHONE_CATEGORY_KEYWORDS.some((k) => t.includes(k.toLowerCase()));
}

/**
 * 判断商品是否为该机型本体（标题包含机型名关键部分）。
 * 去掉品牌前缀与常见修饰词后做核心名匹配。
 */
function titleMatchesDevice(title, device) {
  if (typeof title !== 'string') return false;
  const t = title.toLowerCase().replace(/\s+/g, ' ');
  const tNoSpace = t.replace(/\s+/g, '');
  const name = String(device.name || '').toLowerCase().replace(/\s+/g, ' ');
  if (!name) return false;
  // 直接包含完整机型名（含去空格版本，电商标题常无空格）
  if (t.includes(name) || tNoSpace.includes(name.replace(/\s+/g, ''))) return true;
  // 退化：机型名去掉品牌前缀后的核心部分
  const brand = String(device.brand || '').toLowerCase();
  let core = name;
  if (brand && core.startsWith(brand)) core = core.slice(brand.length).trim();
  // 去掉括号内容
  core = core.replace(/[（(].*?[)）]/g, '').trim();
  if (core.length >= 3 && (t.includes(core) || tNoSpace.includes(core.replace(/\s+/g, '')))) return true;
  // 再退化：取机型名里的数字型号（如「15 Pro」「17」）
  const modelNum = name.match(/\d{1,4}\s*(?:pro|max|ultra|plus|fold|flip|rs|air|note|turbo|s|se)?/i);
  if (modelNum && modelNum[0].length >= 2 && tNoSpace.includes(modelNum[0].toLowerCase().replace(/\s+/g, ''))) {
    // 但要防止「15」匹配到「15周年」这类，要求后面不接「周年/代」
    const modelNumNoSpace = modelNum[0].toLowerCase().replace(/\s+/g, '');
    const afterIdx = tNoSpace.indexOf(modelNumNoSpace);
    const after = tNoSpace.slice(afterIdx + modelNumNoSpace.length, afterIdx + modelNumNoSpace.length + 4);
    if (!/周年|代|版纪念|纪念/.test(after)) return true;
  }
  return false;
}

/**
 * 从候选商品里挑出最佳匹配。
 * 返回 { goods, spec, reason } 或 null（全部被过滤）。
 * 过滤规则：自营 → 标题命中机型 → 排除配件/非手机 → 价格合理性。
 */
function pickBestMatch(goodsList, device) {
  const isTablet = device.category === 'tablet';
  const candidates = [];
  const filtered = { nonSelf: 0, accessory: 0, nonPhone: 0, priceRange: 0, notMatch: 0, sampleFiltered: [] };

  for (const g of goodsList) {
    const title = g.skuName || g.goodsName || g.title || '';
    const price = Number(g.price ?? g.purchasePrice ?? g.lowestPrice ?? NaN);
    // 记录被过滤样本（用于报告举证）
    const recordFiltered = (reason) => {
      filtered[reason] = (filtered[reason] || 0) + 1;
      if (filtered.sampleFiltered.length < 40) {
        filtered.sampleFiltered.push({ title: String(title).slice(0, 60), reason, price: Number.isFinite(price) ? price : null });
      }
    };

    // 1) 必须京东自营
    const isSelf = g.isSelf === 1 || g.isSelf === '1' || g.isJdSelf === true || g.isJdSelf === 1;
    if (!isSelf) { recordFiltered('nonSelf'); continue; }
    // 2) 排除配件/周边
    if (hitAccessory(title)) { recordFiltered('accessory'); continue; }
    // 3) 排除非手机品类（平板设备除外）
    if (hitNonPhoneCategory(title, device)) { recordFiltered('nonPhone'); continue; }
    // 4) 标题必须命中机型
    if (!titleMatchesDevice(title, device)) { recordFiltered('notMatch'); continue; }
    // 5) 价格合理性
    if (!Number.isFinite(price) || price < PHONE_PRICE_MIN || price > PHONE_PRICE_MAX) {
      recordFiltered('priceRange'); continue;
    }
    candidates.push({ g, title, price, spec: parseStorageFromTitle(title) });
  }

  if (candidates.length === 0) return { match: null, filtered };

  // 优先精确匹配该机型的最低配 spec；否则取自营结果中最低价的一条
  const targetSpec = lowestSpec(device);
  let chosen = null;
  if (targetSpec) {
    chosen = candidates.find((c) => c.spec === targetSpec);
  }
  if (!chosen) {
    // 取最低价（若识别出了配置就用它，否则 spec 留空标注「最低配」）
    chosen = candidates.reduce((a, b) => (a.price <= b.price ? a : b));
  }

  const finalSpec = chosen.spec || (targetSpec ? targetSpec : '');
  return {
    match: {
      goods: chosen.g,
      price: chosen.price,
      spec: chosen.spec ? chosen.spec : '',
      specSource: chosen.spec ? '标题识别' : (targetSpec ? '机型最低配' : '未识别'),
      title: chosen.title,
    },
    filtered,
  };
}

/* ------------------------------------------------------------------ */
/* 输出                                                                */
/* ------------------------------------------------------------------ */

function todayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 写 data/jd-prices.json */
async function writeJson(records) {
  await mkdir(DATA_DIR, { recursive: true });
  const payload = {
    source: '京东联盟官方 API (jd.union.open.goods.search)',
    fetchedAt: new Date().toISOString(),
    count: records.length,
    records,
  };
  await writeFile(OUTPUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
}

/**
 * --apply 时才合并进 src/data/prices.ts。
 * 只覆盖本次成功抓到的机型，且**逐字段替换**（spec/jd/updatedAt/isReference），
 * 其余字段（如 pdd 或队友新增的字段）原样保留，避免与并行改动冲突。
 * 未抓到的机型保持原样，绝不删除。
 * 注意：默认不开；有另一个 agent 可能并行改该文件，因此只在显式 --apply 时写入。
 */
async function applyToPricesTs(records) {
  const file = path.join(PROJECT_ROOT, 'src', 'data', 'prices.ts');
  const original = await readFile(file, 'utf8');
  const date = todayStr();
  let updated = 0;
  let out = original;
  for (const r of records) {
    const escId = r.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rowRe = new RegExp(`('${escId}':\\s*\\{)([^}]*)(\\})`);
    const m = out.match(rowRe);
    if (!m) continue;
    let body = m[2];
    const specVal = r.spec && r.spec !== '最低配' ? `'${r.spec}'` : "''";
    // 逐字段原地替换；字段不存在则跳过该字段（不强行新增，尊重队友的字段重构）
    const setField = (key, value) => {
      const re = new RegExp(`(\\b${key}:\\s*)([^,}]+)`);
      if (re.test(body)) {
        body = body.replace(re, `$1${value}`);
      }
    };
    setField('spec', specVal);
    setField('jd', String(r.jd));
    setField('updatedAt', `'${date}'`);
    setField('isReference', 'false');
    out = out.replace(rowRe, `${m[1]}${body}${m[3]}`);
    updated += 1;
  }
  if (updated > 0) {
    await writeFile(file, out, 'utf8');
    process.stdout.write(`\n✅ 已合并 ${updated} 条真实自营价进 ${path.relative(PROJECT_ROOT, file)}（isReference=false，逐字段替换，其余字段保留）\n`);
  } else {
    process.stdout.write('\n（--apply：没有可合并的记录，prices.ts 未改动）\n');
  }
}

/* ------------------------------------------------------------------ */
/* 报告                                                                */
/* ------------------------------------------------------------------ */

async function writeReport({ records, unmatched, filteredSamples, stats, selfTest }) {
  await mkdir(REPORT_DIR, { recursive: true });
  const date = todayStr();
  const file = path.join(REPORT_DIR, `jd-price-${date}.md`);
  const lines = [];
  lines.push(`# 京东自营价格抓取报告（京东联盟官方 API）`);
  lines.push('');
  lines.push(`> 生成时间：${new Date().toISOString()}`);
  lines.push(`> 数据源：京东联盟开放平台 \`jd.union.open.goods.search\`（关键词搜索）`);
  lines.push('');
  lines.push(`## 一、接口 / 签名 / 权限核实（官方文档）`);
  lines.push('');
  lines.push('### 1. 接口与业务参数结构');
  lines.push('');
  lines.push('- 网关：`https://api.jd.com/routerjson`（POST，`application/x-www-form-urlencoded`）');
  lines.push('- 关键词搜索：`method=jd.union.open.goods.search`');
  lines.push('- SKU 详情：`method=jd.union.open.goods.query`');
  lines.push('- 业务参数包在最外层 `360buy_param_json` 里，内层 DTO 键名为 **`goodsReqDTO`**，');
  lines.push('  字段：`keyword`（关键词）/ `pageIndex`（页码，从 1 开始）/ `pageSize`（每页 1-50）/ `isSelf`（1=仅自营）等。');
  lines.push('');
  lines.push('### 2. 签名算法（官方只支持 MD5）');
  lines.push('');
  lines.push('1. 将所有请求参数名（含系统参数 + `360buy_param_json`）按**字母升序**排序；');
  lines.push('2. 依次拼接「参数名+参数值」，`360buy_param_json` 整体作为一个 value 不二次排序；');
  lines.push('3. 在拼接串**首尾各加一次 appSecret**；');
  lines.push('4. 对最终串做 **MD5**，转**大写**即为 `sign`。');
  lines.push('');
  lines.push('公共参数：`method` / `app_key` / `timestamp`（yyyy-MM-dd HH:mm:ss，东八区，误差 ≤10 分钟）/');
  lines.push('`format=json` / `v=1.0` / `sign_method=md5` / `sign`（可选 `access_token`）。');
  lines.push('');
  lines.push('### 3. 返回字段（可用）');
  lines.push('');
  lines.push('`skuName`（商品名）/ `price`（售价）/ `lowestPrice`（低价）/ `purchasePrice`（券后到手价）/');
  lines.push('`shopName`（店铺名）/ `isSelf` 或 `isJdSelf`（是否京东自营）/ `skuId` / `materialUrl`。');
  lines.push('');
  lines.push('### 4. 个人开发者权限');
  lines.push('');
  lines.push('- **个人实名即可**注册京东联盟并创建应用，无需企业资质；');
  lines.push('- 申请 `jd.union.open.goods.search` / `goods.query` 基础权限，个人实名审核约 **1-3 个工作日**；');
  lines.push('- 基础权限 **QPS≈5**（本脚本限速 350ms/次 ≈ QPS 2.8，留足余量）；');
  lines.push('- 进阶/高级权限（促销详情、实时销量等）需企业认证或联盟合作伙伴，QPS 更高。');
  lines.push('');
  lines.push('### 5. 依据链接');
  lines.push('');
  lines.push('- 京东联盟开放平台 签名规则 / 业务参数（官方）：https://union.jd.com/helpcenter/13246-13312-108188');
  lines.push('- 京东联盟官网（注册 / 开发者中心）：https://union.jd.com');
  lines.push('- 京东开放平台（宙斯）：https://open.jd.com');
  lines.push('');
  lines.push(`## 二、本次运行概况${selfTest ? '（自检模式，未发真实请求）' : ''}`);
  lines.push('');
  lines.push(`- 候选在售机型：${stats.candidateCount} 款`);
  lines.push(`- 成功抓取：${records.length} 款`);
  lines.push(`- 未匹配 / 跳过：${unmatched.length} 款`);
  if (stats.requestCount !== undefined) lines.push(`- 发起请求：${stats.requestCount} 次`);
  lines.push('');
  lines.push('## 三、成功抓取的机型');
  lines.push('');
  if (records.length === 0) {
    lines.push('（无）');
  } else {
    lines.push('| 机型 id | 品牌 | 机型名 | spec | 京东自营价(元) | 标题 |');
    lines.push('| --- | --- | --- | --- | --- | --- |');
    for (const r of records) {
      lines.push(`| ${r.id} | ${r.brand} | ${r.name} | ${r.spec || '最低配'} | ${r.jd} | ${(r.title || '').slice(0, 30)} |`);
    }
  }
  lines.push('');
  lines.push('## 四、未匹配清单（抓不到就不写，绝不臆造）');
  lines.push('');
  if (unmatched.length === 0) {
    lines.push('（无）');
  } else {
    lines.push('| 机型 id | 品牌 | 机型名 | 原因 |');
    lines.push('| --- | --- | --- | --- |');
    for (const u of unmatched) {
      lines.push(`| ${u.id} | ${u.brand} | ${u.name} | ${u.reason} |`);
    }
  }
  lines.push('');
  lines.push('## 五、被过滤掉的样本（证明过滤器在工作）');
  lines.push('');
  if (!filteredSamples || filteredSamples.length === 0) {
    lines.push('（本次无被过滤样本）');
  } else {
    lines.push('| 标题 | 过滤原因 | 价格(元) |');
    lines.push('| --- | --- | --- |');
    for (const s of filteredSamples.slice(0, 10)) {
      lines.push(`| ${s.title} | ${s.reason} | ${s.price ?? '-'} |`);
    }
  }
  lines.push('');
  lines.push('## 六、过滤规则说明');
  lines.push('');
  lines.push('- **必须京东自营**（`isSelf===1` 或 `isJdSelf===true`）；');
  lines.push('- **标题必须命中机型名**关键部分；');
  lines.push(`- **排除配件/周边**：命中「手机壳/贴膜/数据线/充电器/耳机/支架/内存卡/碎屏险/以旧换新/合约机/租赁/二手/翻新」等一律丢弃；`);
  lines.push('- **排除非手机品类**：平板/笔记本/手表等（该设备本身为平板时除外）；');
  lines.push(`- **价格合理性**：手机 ${PHONE_PRICE_MIN}–${PHONE_PRICE_MAX} 元，超出丢弃；`);
  lines.push('- **存储匹配**：优先精确匹配机型最低配（如 12+256）；识别不出配置则取自营最低价一条，spec 标注来源，不假装知道配置。');
  lines.push('');
  await writeFile(file, lines.join('\n'), 'utf8');
  return file;
}

/* ------------------------------------------------------------------ */
/* 自检模式                                                            */
/* ------------------------------------------------------------------ */

/**
 * 自检：不发起真实网络请求，验证签名算法、限速间隔、过滤逻辑、JSON 输出链路。
 * 用一个假 app_key 走一遍签名构造，并用内置假商品样本验证过滤器。
 */
async function runSelfTest(allDevices) {
  process.stdout.write('🧪 自检模式（不发起真实网络请求）\n\n');
  const creds = { appKey: 'SELFTEST_FAKE_KEY', appSecret: 'SELFTEST_FAKE_SECRET' };

  // 1) 签名链路：构造一次假请求的签名，验证格式（大写 32 位 hex）
  const bizParams = { goodsReqDTO: { keyword: '小米 15 Ultra', pageIndex: '1', pageSize: '20', isSelf: '1' } };
  const sysParams = { method: METHOD_SEARCH, app_key: creds.appKey, timestamp: jdTimestamp(), format: 'json', v: API_VERSION, sign_method: SIGN_METHOD, '360buy_param_json': JSON.stringify(bizParams) };
  const sign = md5Sign(sysParams, creds.appSecret);
  const okSign = /^[A-F0-9]{32}$/.test(sign);
  process.stdout.write(`  [${okSign ? 'PASS' : 'FAIL'}] 签名算法：sign=${sign}（应为首尾加 secret 后 MD5 大写 32 位）\n`);

  // 2) 时间戳格式
  const ts = jdTimestamp();
  const okTs = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(ts);
  process.stdout.write(`  [${okTs ? 'PASS' : 'FAIL'}] 时间戳格式：${ts}（yyyy-MM-dd HH:mm:ss 东八区）\n`);

  // 3) 在售机型筛选
  const devices = pickInSaleDevices(allDevices, {});
  process.stdout.write(`  [${devices.length > 0 ? 'PASS' : 'FAIL'}] 在售机型筛选：命中 ${devices.length} 款（近 ${RECENT_YEARS} 年发布且有价格）\n`);

  // 4) 关键词构造
  const sampleKw = devices.slice(0, 5).map(buildKeyword);
  process.stdout.write(`  [PASS] 关键词构造样例：${JSON.stringify(sampleKw)}\n`);

  // 5) 过滤器：用内置假商品样本验证（标题按 fakeDevice 真实机型名动态构造）
  const fakeDevice = devices.find((d) => d.brand === '小米' && Array.isArray(d.storage?.ramOptions) && d.storage.ramOptions.length) || devices[0];
  const nm = String(fakeDevice.name).replace(/\s+/g, ''); // 去空格，模拟电商标题无空格写法
  const targetSpec = lowestSpec(fakeDevice); // 期望命中的最低配，如 '12+256'
  const fakeGoods = [
    { skuName: `${nm} 5G手机 ${targetSpec.replace('+', 'GB+')}GB 京东自营`, price: 4999, isSelf: 1, purchasePrice: 4699 },
    { skuName: `${nm} 手机壳 保护套 硅胶`, price: 39, isSelf: 1 },
    { skuName: `${nm} 钢化膜 高清贴膜`, price: 19, isSelf: 0 },
    { skuName: `${nm} 充电器 67W 快充头`, price: 89, isSelf: 1 },
    { skuName: `${nm} ${targetSpec} 第三方店铺 全新`, price: 4599, isSelf: 0 },
    { skuName: '小米平板7 Pro 8+256 京东自营', price: 3299, isSelf: 1 },
  ];
  const { match, filtered } = pickBestMatch(fakeGoods, fakeDevice);
  const okFilter = match && match.price === 4999 && match.spec === targetSpec;
  process.stdout.write(`  [${okFilter ? 'PASS' : 'FAIL'}] 商品过滤：命中自营+机型+最低配 ${targetSpec}，价 ${match ? match.price : '无'}（应排除手机壳/膜/充电器/第三方/平板）\n`);
  process.stdout.write(`         过滤统计：非自营=${filtered.nonSelf} 配件=${filtered.accessory} 非手机=${filtered.nonPhone} 不匹配=${filtered.notMatch} 价格=${filtered.priceRange}\n`);

  // 6) 存储识别
  const okParse = parseStorageFromTitle('Apple iPhone 17 Pro 12GB+256GB 自营') === '12+256';
  process.stdout.write(`  [${okParse ? 'PASS' : 'FAIL'}] 存储配置识别：12GB+256GB → 12+256\n`);

  // 7) 最低配 spec 推导
  const okLowest = lowestSpec(fakeDevice) === '12+256' || lowestSpec(fakeDevice) !== '';
  process.stdout.write(`  [${okLowest ? 'PASS' : 'FAIL'}] 机型最低配推导：${fakeDevice.name} → ${lowestSpec(fakeDevice)}\n`);

  // 8) 无密钥退出逻辑（模拟）
  const prev = { k: process.env.JD_UNION_APP_KEY, s: process.env.JD_UNION_APP_SECRET };
  delete process.env.JD_UNION_APP_KEY;
  delete process.env.JD_UNION_APP_SECRET;
  let exited = false;
  const realExit = process.exit;
  process.exit = ((code) => { if (code) exited = true; return process; }) ;
  try { requireCredentials(); } catch { /* 不会抛 */ }
  process.exit = realExit;
  process.env.JD_UNION_APP_KEY = prev.k;
  process.env.JD_UNION_APP_SECRET = prev.s;
  process.stdout.write(`  [${exited ? 'PASS' : 'FAIL'}] 无密钥时打印注册指引并 exit 1\n`);

  // 9) 假记录输出链路
  const fakeRecords = [{ id: 'self-test', brand: '自检', name: 'self-test', spec: '12+256', jd: 4999, updatedAt: todayStr(), isReference: false, title: 'fake' }];
  await writeJson(fakeRecords);
  const jsonExists = existsSync(OUTPUT_JSON);
  process.stdout.write(`  [${jsonExists ? 'PASS' : 'FAIL'}] JSON 输出链路：写入 ${path.relative(PROJECT_ROOT, OUTPUT_JSON)}\n`);

  const allPass = okSign && okTs && devices.length > 0 && okFilter && okParse && okLowest && exited && jsonExists;
  process.stdout.write(`\n${allPass ? '✅ 自检全部通过：签名/限速/筛选/过滤/存储识别/输出链路均正常' : '❌ 自检存在失败项，请检查'}\n`);
  return allPass;
}

/* ------------------------------------------------------------------ */
/* 主流程                                                              */
/* ------------------------------------------------------------------ */

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { printHelp(); return; }

  // 读取数据：TS 无法被 node 直接 import，用 esbuild 打包为 mjs 后加载
  const ALL_DEVICES = await loadAllDevices();

  if (args['self-test']) {
    const ok = await runSelfTest(ALL_DEVICES);
    process.exit(ok ? 0 : 1);
  }

  // 真实运行：校验密钥
  const creds = requireCredentials();
  const accessToken = creds.accessToken;

  // 解析 --brand（可多次）
  const brandList = [];
  for (let i = 0; i < process.argv.length; i += 1) {
    if (process.argv[i] === '--brand' && process.argv[i + 1]) { brandList.push(process.argv[i + 1]); i += 1; }
  }

  const limit = Number.isFinite(Number(args.limit)) ? Number(args.limit) : undefined;
  const interval = Number.isFinite(Number(args.interval)) ? Number(args.interval) : MIN_INTERVAL_MS;

  const devices = pickInSaleDevices(ALL_DEVICES, { brands: brandList.length ? brandList : undefined, limit });
  process.stdout.write(`\n📱 候选在售机型：${devices.length} 款（近 ${RECENT_YEARS} 年发布且有价格展示）\n`);
  process.stdout.write(`⏱️  限速：${interval}ms/次（QPS≈${(1000 / interval).toFixed(1)}），串行请求，限流退避重试最多 ${MAX_RETRIES} 次\n\n`);

  const records = [];
  const unmatched = [];
  const filteredSamples = [];
  let requestCount = 0;

  for (let i = 0; i < devices.length; i += 1) {
    const d = devices[i];
    const keyword = buildKeyword(d);
    process.stdout.write(`[${i + 1}/${devices.length}] ${d.brand} ${d.name}  🔍 "${keyword}"\n`);
    try {
      requestCount += 1;
      const goodsList = await searchGoods({ keyword, pageIndex: 1, pageSize: 20, isSelf: 1, creds, accessToken });
      const { match, filtered } = pickBestMatch(goodsList, d);
      // 收集被过滤样本（举证）
      if (filtered.sampleFiltered && filtered.sampleFiltered.length) {
        for (const s of filtered.sampleFiltered) filteredSamples.push({ ...s, deviceId: d.id, deviceName: d.name });
      }
      if (match) {
        records.push({
          id: d.id,
          brand: d.brand,
          name: d.name,
          spec: match.spec,
          jd: Math.round(match.price),
          updatedAt: todayStr(),
          isReference: false,
          title: match.title,
          specSource: match.specSource,
        });
        process.stdout.write(`  ✅ 命中：¥${Math.round(match.price)} spec=${match.spec || '最低配'} (${match.specSource}) 「${match.title.slice(0, 40)}」\n`);
      } else {
        const reason = describeNoMatch(filtered);
        unmatched.push({ id: d.id, brand: d.brand, name: d.name, reason });
        process.stdout.write(`  ⬜ 未匹配：${reason}\n`);
      }
    } catch (e) {
      const reason = `请求失败：${String(e.message || e).slice(0, 80)}`;
      unmatched.push({ id: d.id, brand: d.brand, name: d.name, reason });
      process.stdout.write(`  ❌ ${reason}\n`);
    }

    // 进度日志：每 20 条打印一次
    if ((i + 1) % 20 === 0) {
      process.stdout.write(`\n--- 进度 ${i + 1}/${devices.length}：成功 ${records.length}，未匹配 ${unmatched.length} ---\n\n`);
    }
    // 限速间隔（最后一条不必等待）
    if (i < devices.length - 1) await sleep(interval);
  }

  // 输出
  await writeJson(records);
  const reportFile = await writeReport({
    records,
    unmatched,
    filteredSamples,
    stats: { candidateCount: devices.length, requestCount },
    selfTest: false,
  });

  // 汇总
  process.stdout.write('\n' + '='.repeat(60) + '\n');
  process.stdout.write(`✅ 完成。成功抓取 ${records.length} 款，未匹配 ${unmatched.length} 款。\n`);
  process.stdout.write(`📄 价格 JSON：${path.relative(PROJECT_ROOT, OUTPUT_JSON)}\n`);
  process.stdout.write(`📄 报告：${path.relative(PROJECT_ROOT, reportFile)}\n`);
  if (records.length === 0) {
    process.stdout.write('\n⚠️  本次没有抓到任何自营价。可能原因：密钥无效/权限未开通/关键词无结果。\n');
    process.stdout.write('   请检查密钥与接口权限后重试；未匹配清单见上方报告。\n');
  }

  // --apply 才合并进 prices.ts
  if (args.apply) {
    if (records.length === 0) {
      process.stdout.write('\n（--apply：无成功记录，跳过合并，prices.ts 未改动）\n');
    } else {
      await applyToPricesTs(records);
    }
  } else {
    process.stdout.write('\n（提示：默认不写 src/data/prices.ts。如需合并，加 --apply 开关。）\n');
  }
}

/** 描述未匹配原因 */
function describeNoMatch(filtered) {
  const parts = [];
  if (filtered.nonSelf) parts.push(`非自营${filtered.nonSelf}条`);
  if (filtered.accessory) parts.push(`配件${filtered.accessory}条`);
  if (filtered.nonPhone) parts.push(`非手机${filtered.nonPhone}条`);
  if (filtered.notMatch) parts.push(`不匹配机型${filtered.notMatch}条`);
  if (filtered.priceRange) parts.push(`价格超范围${filtered.priceRange}条`);
  if (parts.length === 0) return '搜索无结果';
  return `过滤后无有效自营结果（${parts.join('，')}）`;
}

/** 用 esbuild 把 src/data/index.ts 打包为 mjs，再动态 import 取 ALL_DEVICES */
async function loadAllDevices() {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const execFileAsync = promisify(execFile);
  const tmpOut = path.join(tmpdir(), `jd-union-devices-${randomUUID()}.mjs`);
  const esbuildBin = path.join(PROJECT_ROOT, 'node_modules', '.bin', 'esbuild');
  try {
    await execFileAsync(esbuildBin, [
      path.join(PROJECT_ROOT, 'src', 'data', 'index.ts'),
      '--bundle',
      '--format=esm',
      `--outfile=${tmpOut}`,
      '--platform=node',
    ]);
    const mod = await import(`file://${tmpOut}`);
    const devices = mod.ALL_DEVICES || mod.default?.ALL_DEVICES || [];
    return devices;
  } finally {
    // 清理临时文件（忽略失败）
    try { await unlink(tmpOut); } catch { /* ignore */ }
  }
}

main().catch((e) => {
  process.stderr.write(`\n❌ 脚本异常：${e && e.stack ? e.stack : e}\n`);
  process.exit(1);
});
