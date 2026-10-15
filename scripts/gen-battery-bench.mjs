/**
 * 从 research/socpk-battery-life.json 生成 src/data/batteryBench.ts。
 *
 * 用法：node scripts/gen-battery-bench.mjs
 *
 * 数据源：https://www.socpk.com/chart/battery-life-5-0（极客湾 Geekerwan 续航测试 5.0）
 * 该 JSON 由抓站脚本产出，`rows[].ours.id` 是人工逐条核对过的机型对齐结果，
 * 本脚本只做「取 ours 非空的行 → 生成 TS 常量」，不做任何自动匹配（自动匹配会误配）。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'research/socpk-battery-life.json');
const OUT = path.join(ROOT, 'src/data/batteryBench.ts');

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const rows = data.rows.filter((r) => r.ours);
if (rows.length === 0) throw new Error('没有可写入的对齐行');

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/**
 * 规范化录像链接：源站数据里有 2 条脏值（一条尾部多一个 `.`，一条带 `?spm_id_from=...` 追踪参数）。
 * 统一成其余 60 条一致的 `https://www.bilibili.com/video/<BV号>/` 规范形式。
 * 只处理链接，**不触碰任何测量数值**。
 */
function normalizeVideoUrl(url) {
  if (!url) return null;
  return url.replace(/[?&]spm_id_from=.*$/, '').replace(/\.$/, '');
}

// 按品牌分组输出，便于人工核对
const byBrand = new Map();
for (const r of rows) {
  const brand = r.ours.brand;
  if (!byBrand.has(brand)) byBrand.set(brand, []);
  byBrand.get(brand).push(r);
}

const lines = [];
for (const [brand, list] of byBrand) {
  lines.push(`  /* ---------- ${brand} ---------- */`);
  for (const r of list) {
    const s = r.socpk;
    const videoUrl = normalizeVideoUrl(s.videoUrl);
    lines.push(
      `  ${q(r.ours.id)}: { batteryLifeMin: ${s.runtimeMin}, systemVersion: ${q(s.systemVersion)}, videoUrl: ${videoUrl ? q(videoUrl) : 'null'}, ratedEnergyWh: ${s.ratedEnergyWh === null ? 'null' : s.ratedEnergyWh} }, // ${r.ours.name}`
    );
  }
}

const header = `/**
 * 第三方实测续航数据（与官方参数解耦，可独立更新）。
 *
 * 数据来源与口径：
 *  - 来源：极客湾 Geekerwan 官方数据库 https://www.socpk.com/chart/battery-life-5-0
 *  - 标准：极客湾「手机续航测试 5.0」，参测机均为自购零售机（站点原文：「均使用自购零售机测试」）
 *  - \`batteryLifeMin\`：满电连续使用**至关机**的实测总时长（分钟）。
 *    **这是第三方实测值，不是官方参数**——站点未公布测试项目/亮度/条件明细，
 *    只能表述为「实测至关机时长」，绝不可写成官方口径（如「视频播放 20 小时」）。
 *  - \`systemVersion\`：测试时该机的系统版本（同一机型换版本重测会更新，故一并保留）
 *  - \`videoUrl\`：该次测试的 B 站全程录像，作为溯源依据
 *  - \`ratedEnergyWh\`：极客湾标注的电池**额定**能量（Wh），与我们库中官方 mAh 容量是两回事
 *  - 数值：整数分钟。站点原始值带 1e-6 级浮点误差，已四舍五入取整
 *
 * 覆盖范围说明：
 *  - 共 ${data.total} 款参测机型，其中 ${rows.length} 款能对齐到本库机型，其余 ${data.total - rows.length} 款
 *    为本库尚未收录的 2026 年新机（如小米 17T 系列、一加 Ace6 系列、华为 nova 15/16），不臆造、不入表；
 *  - 未收录机型的 \`batteryLifeMin\` 一律 undefined，界面显示「—」；
 *  - 平板 / 笔记本无实测数据。
 *
 * 更新方式：
 *   node scripts/gen-battery-bench.mjs       # 重新从 research/socpk-battery-life.json 生成本文件
 *   （该 JSON 由 socpk 抓站脚本产出，dataVersion: ${data.dataVersion}，抓取日期 ${data.fetchedAt}）
 */
`;

const body = `export interface BatteryBench {
  /** 极客湾续航测试 5.0 实测至关机时长（分钟）。第三方口径，非官方参数 */
  batteryLifeMin: number | null;
  /** 测试时系统版本 */
  systemVersion: string | null;
  /** B 站全程录像 */
  videoUrl: string | null;
  /** 电池额定能量（Wh），极客湾实测标注值 */
  ratedEnergyWh: number | null;
}

/** 机型 id -> 第三方实测续航 */
export const BATTERY_BENCH: Record<string, BatteryBench> = {
${lines.join('\n')}
};
`;

fs.writeFileSync(OUT, header + body);
console.log(`写入 ${OUT}，共 ${rows.length} 条（${byBrand.size} 个品牌）`);
