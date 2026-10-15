/**
 * 从 research/socpk-battery-life.json（续航）+ research/socpk-charging.json（充电）
 * 生成 src/data/batteryBench.ts。
 *
 * 用法：node scripts/gen-battery-bench.mjs
 *
 * 数据源：极客湾 Geekerwan 官方数据库 https://www.socpk.com
 *  - 续航：/chart/battery-life-5-0（手机续航排行榜 5.0）
 *  - 充电：/chart/charge-curves（充电曲线）
 *
 * 两个 JSON 的 `rows[].ours.id` 都是**人工逐条核对**过的机型对齐结果，
 * 本脚本只做「按 id 取并集」，不做任何自动匹配（自动 fuzzy 会把「小米 17」误配到 iPhone 17 Pro Max）。
 * 同一 id 在两份数据里都出现时合并到一条；只出现在一边的，另一边字段填 null。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const LIFE_SRC = path.join(ROOT, 'research/socpk-battery-life.json');
const CHARGE_SRC = path.join(ROOT, 'research/socpk-charging.json');
const OUT = path.join(ROOT, 'src/data/batteryBench.ts');

const life = JSON.parse(fs.readFileSync(LIFE_SRC, 'utf8'));
const charge = JSON.parse(fs.readFileSync(CHARGE_SRC, 'utf8'));

const lifeRows = life.rows.filter((r) => r.ours);
const chargeRows = charge.rows.filter((r) => r.ours);
if (lifeRows.length === 0 || chargeRows.length === 0) throw new Error('两份数据缺少可写入的对齐行');

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/**
 * 规范化录像链接：源站数据里有 2 条脏值（一条尾部多一个 `.`，一条带 `?spm_id_from=...` 追踪参数）。
 * 统一成其余条目一致的 `https://www.bilibili.com/video/<BV号>/` 规范形式。
 * 只处理链接，**不触碰任何测量数值**。
 */
function normalizeVideoUrl(url) {
  if (!url) return null;
  return url.replace(/[?&]spm_id_from=.*$/, '').replace(/\.$/, '');
}

/** id -> 合并后的条目 */
const merged = new Map();

function entryOf(id) {
  if (!merged.has(id)) {
    merged.set(id, { id, name: '', brand: '', batteryLifeMin: null, systemVersion: null, videoUrl: null, ratedEnergyWh: null, chargeFullMin: null, chargeChargerW: null, chargeTotalEnergyWh: null });
  }
  return merged.get(id);
}

for (const r of lifeRows) {
  const e = entryOf(r.ours.id);
  e.brand = r.ours.brand;
  e.name = r.ours.name;
  const s = r.socpk;
  e.batteryLifeMin = s.runtimeMin;
  e.systemVersion = s.systemVersion;
  e.videoUrl = normalizeVideoUrl(s.videoUrl);
  e.ratedEnergyWh = s.ratedEnergyWh;
}

for (const r of chargeRows) {
  const e = entryOf(r.ours.id);
  // 续航那边已填过品牌/机型名就不要覆盖（两份数据机型名应一致，以续航为准）
  if (!e.name) {
    e.brand = r.ours.brand;
    e.name = r.ours.name;
  }
  const s = r.socpk;
  e.chargeFullMin = s.fullDurationMin;
  e.chargeChargerW = s.chargerPowerW;
  e.chargeTotalEnergyWh = s.totalEnergyWh;
}

const both = [...merged.values()].filter((e) => e.batteryLifeMin !== null && e.chargeFullMin !== null).length;
const lifeOnly = [...merged.values()].filter((e) => e.batteryLifeMin !== null && e.chargeFullMin === null).length;
const chargeOnly = [...merged.values()].filter((e) => e.batteryLifeMin === null && e.chargeFullMin !== null).length;

// 按品牌分组输出，便于人工核对
const byBrand = new Map();
for (const e of merged.values()) {
  if (!byBrand.has(e.brand)) byBrand.set(e.brand, []);
  byBrand.get(e.brand).push(e);
}

const num = (n) => (n === null || n === undefined ? 'null' : n);
const str = (s) => (s === null || s === undefined || s === '' ? 'null' : q(s));

const lines = [];
for (const [brand, list] of byBrand) {
  lines.push(`  /* ---------- ${brand} ---------- */`);
  for (const e of list) {
    lines.push(
      `  ${q(e.id)}: {\n` +
        `    batteryLifeMin: ${num(e.batteryLifeMin)},\n` +
        `    systemVersion: ${str(e.systemVersion)},\n` +
        `    videoUrl: ${str(e.videoUrl)},\n` +
        `    ratedEnergyWh: ${num(e.ratedEnergyWh)},\n` +
        `    chargeFullMin: ${num(e.chargeFullMin)},\n` +
        `    chargeChargerW: ${num(e.chargeChargerW)},\n` +
        `    chargeTotalEnergyWh: ${num(e.chargeTotalEnergyWh)},\n` +
        `  }, // ${e.name}`
    );
  }
}

const header = `/**
 * 第三方实测电池数据（与官方参数解耦，可独立更新）。
 *
 * 数据来源与口径：
 *  - 来源：极客湾 Geekerwan 官方数据库 https://www.socpk.com
 *    · 续航 /chart/battery-life-5-0，dataVersion ${life.dataVersion}，抓取 ${life.fetchedAt}
 *    · 充电 /chart/charge-curves，  dataVersion ${charge.dataVersion}，抓取 ${charge.fetchedAt}
 *
 *  —— 续航字段 ——
 *  - \`batteryLifeMin\`：极客湾「手机续航测试 5.0」，满电连续使用**至关机**的实测总时长（分钟）。
 *    **第三方实测值，不是官方参数**——站点未公布测试项目/亮度/条件明细，
 *    只能表述为「实测至关机时长」，绝不可写成官方口径（如「视频播放 20 小时」）。
 *  - \`systemVersion\`：测试时该机系统版本（同机型换版本重测会更新，故一并保留）
 *  - \`videoUrl\`：该次测试的 B 站全程录像，作为溯源依据
 *  - \`ratedEnergyWh\`：极客湾标注的电池**额定**能量（Wh），与我们库中官方 mAh 容量是两回事
 *
 *  —— 充电字段 ——
 *  - \`chargeFullMin\`：原装充电头实测 0→100% 充满耗时（分钟，保留 1 位小数）
 *  - \`chargeChargerW\`：该次测试所用充电头功率（W，官网标称值），用于说明测试条件
 *  - \`chargeTotalEnergyWh\`：充满全程的**电源端输入**能量（Wh），含充电器/线材/机内电路损耗，
 *    **不等于电池容量**——实测总输入能量 / 额定电池能量 = 1.057 ~ 1.286（中位 1.181）。
 *  - ❗ 未入库 \`energy15MinSharePct\`（15 分钟充入能量占比）：该值是「能量占比」不是「电量百分比」，
 *    因高功率阶段损耗更大，会系统性高于真实电量百分比，展示时极易被误读为「15 分钟充至 X%」。
 *    宁可 null 不编造，该字段不进库、不展示。
 *
 * 覆盖范围说明：
 *  - 续航榜 ${life.total} 款中 ${lifeRows.length} 款、充电榜 ${charge.total} 款中 ${chargeRows.length} 款能对齐到本库机型；
 *    其余为我们尚未收录的新机，不臆造、不入表。
 *  - 按 id 取并集共 **${merged.size}** 条：续航+充电都有 ${both} 条，只有续航 ${lifeOnly} 条，只有充电 ${chargeOnly} 条。
 *    缺失的那一半字段一律 null，界面显示「—」。
 *  - 平板 / 笔记本无实测数据。
 *
 * 更新方式：
 *   node scripts/gen-battery-bench.mjs       # 重新从 research/ 下两个 JSON 整文件生成本文件
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
  /** 实测 0→100% 充满耗时（分钟）。极客湾充电测试，含电路损耗的电源端口径 */
  chargeFullMin: number | null;
  /** 该次充电测试使用的充电头功率（W），用于说明测试条件 */
  chargeChargerW: number | null;
  /** 全程累计充入能量（Wh，电源端口径） */
  chargeTotalEnergyWh: number | null;
}

/** 机型 id -> 第三方实测电池数据 */
export const BATTERY_BENCH: Record<string, BatteryBench> = {
${lines.join('\n')}
};
`;

fs.writeFileSync(OUT, header + body);
console.log(`写入 ${OUT}`);
console.log(`  总条目 ${merged.size}（${byBrand.size} 个品牌）：续航+充电 ${both}，只有续航 ${lifeOnly}，只有充电 ${chargeOnly}`);
