# socpk.com 数据调研报告（2026-10-15）

> 调研人：socpk-data。任务：摸清 https://www.socpk.com 的数据结构与口径，评估接入「全网手机参数比对」工具。
> 硬性约束：全部数据来自实际抓取（API + WASM 解码），无任何凭印象补充。

## 一、结论速览

| 问题 | 答案 |
| --- | --- |
| 数据拿到了吗 | **拿到了**。socpk 是 Vite+Vue SPA，但有公开 JSON API：`/api/site`、`/api/pages/{slug}`、`/api/pages/{slug}/data`。数据点用内联 WASM 编解码（base64 blob → Float64），已在本地 Node 中复现解码 |
| 续航榜单规模 | **80 款手机**（手机续航排行榜 5.0，`battery-life-5-0`） |
| 出品方 | **极客湾 Geekerwan**。站内 tagline「极客湾芯片数据库」，首页挂 B 站（space.bilibili.com/25876945）、YouTube（@geekerwan1024）、抖音官方链接；品牌目录含 `geekerwan-logo-*.svg` |
| 测试口径 | **站点原文只有一句**：「均使用自购零售机测试。点击机型或系统版本可观看全程录像。」——具体测试项目/亮度/条件站点**没有文字说明**，但每台机器都有 B 站全程录像（标题如「极客湾手机续航测试5.0全程录像 荣耀WIN RT 12小时6分钟 2026.7.1」），且附**额定电池能量 Wh** 与**系统版本**。数值含义 = 从满电持续跑至关机的总时长（分钟），范围 300~726 min（5h~12h6min） |
| 对齐率 | **62/80 = 77.5%** 可直接对齐到我们库里已有机型 |
| 版权说明 | 站点**没有任何版权/转载声明**（页脚仅「沪ICP备2024064919号」备案链接，无 robots.txt/sitemap）。属第三方实测数据，引用必须注明来源 |

## 二、怎么拿到的（技术路径，可复用）

1. 首页 HTML 仅 565B，入口 `/assets/index-DKgb512s.js`（222KB）。
2. 在主包中提取到 API 封装：`/api/site`（全站目录）、`/api/pages/{slug}`（图表元数据 + series 列表）、`/api/pages/{slug}/data`（各 series 的 base64 数据点）。
3. 数据点 `p` 是 base64 blob，由一段 **984 字节的内联 WASM**（`data:application/wasm;base64,AGFzbQE...`，exports: `inputPtr/outputPtr/inputCap/decode/memory`）解码为 Float64 数组；首字节 `1` 表示 (x,y) 点对（曲线），否则为标量（榜单值）。
4. 用 Node `WebAssembly.instantiate` 实例化该 WASM，按站点同款逻辑解码（脚本见本文附录）。
5. 请求间隔 600ms，全站 14 个图表页一次抓完，无报错。

**全部 14 个页面清单**（`research/socpk-raw/_summary.json`）：

| slug | 类型 | 条数 | 单位 |
| --- | --- | --- | --- |
| mobile-soc-spec26 | 折线 | 88 | W / 分数 |
| mobile-soc-efficiency-gb7 | 折线 | 57 | W / 分数 |
| mobile-soc-efficiency-snl | 折线 | 31 | W / fps |
| **battery-life-5-0** | **柱状** | **80** | **min** |
| charge-curves | 折线 | 74 | 分钟 / 充入能量 |
| laptop-gpu-efficiency | 折线 | 37 | — |
| geekbench-6 / geekbench-5 / gfxbench-5 / 3dmark-wle | 柱状 | 82/147/143/82 | 分/fps |
| chip-overall / chip-cpu / chip-gpu / chip-cpu-efficiency | 柱状 | 158×3/51 | 分 |

原始解码数据已归档：`research/socpk-raw/*.json`（含 _site.json 全站配置、battery-life-5-0、charge-curves、三条能效曲线）。

## 三、续航榜单数据结构（重点）

- 页面：https://www.socpk.com/chart/battery-life-5-0
- API meta：`config = { modes:[{id:"minutes",valueIndex:0,label_zh:"续航时长"}], unit:"min", axisMax:14, barColor:"#1ED76D" }`
- 每条 series 完整字段（`/api/pages/battery-life-5-0`）：

```json
{
  "id": 14290,
  "name": "WIN RT",
  "name_en": "",
  "group": "荣耀",
  "color": "",
  "meta": {
    "systemVersion": "MagicOS 10.0.0.160",
    "ratedEnergyWh": 36.88,
    "videoUrl": "https://www.bilibili.com/video/BV1z83G6hEAj/"
  }
}
```

- `/data` 返回 `{v:1, dataVersion:"7ddf4f90e2c1", series:[{id:14290, p:"Ak5CpzkBiZi6Cg=="}]}`，`p` 经 WASM 解码得标量 **725.999972（分钟）**，页面渲染为「12h6min」（admin 文案证实：坐标轴配置「分钟（min）类图表按小时计」）。
- **前 5 行样例（原样，分钟 → 页面显示）**：

| # | 品牌 | 机型 | 分钟 | 显示 | 系统版本 | 额定能量 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 荣耀 | WIN RT | 725.999972 | 12h6min | MagicOS 10.0.0.160 | 36.88 Wh |
| 2 | 荣耀 | WIN | 713.000014 | 11h53min | MagicOS 10.0.0.160 | 36.88 Wh |
| 3 | 红米 | K90 至尊版 | 706.99998 | 11h47min | HyperOS 3.0.306.0 | 31.85 Wh |
| 4 | 红米 | Turbo 5 Max | 685.999973 | 11h26min | HyperOS 3.0.304.0 | 33.53 Wh |
| 5 | 红米 | K90 Max | 684.00001 | 11h24min | HyperOS 3.0.310.0 | 31.85 Wh |

（全 80 行见 `research/socpk-battery-life.json`，含对齐结果。）

- **口径注意**：
  1. 站点未文字说明测试项目，只有「自购零售机 + 全程录像」。B 站录像标题证实这是「极客湾手机续航测试 5.0」标准、单机连续测试至关机的总时长（非官方「视频播放 xx 小时」口径）。
  2. 每条数据附 `ratedEnergyWh`（**额定**能量，非典型容量），如小米 17 = 25.94 Wh。
  3. `dataVersion = 7ddf4f90e2c1`，抓取时间 2026-10-15；榜单会持续更新（末尾两条 iPhone 18 Pro / Pro Max 为后补，页面已按值重新排序展示）。
  4. 数值带 1e-6 级浮点误差（725.999972），入库应取整分钟或换算小时保留 1 位。

## 四、对齐率：62/80 = 77.5%

用 esbuild 打包 `src/data/index.ts` 导出 `ALL_DEVICES`（644 台，手机 531）逐条人工核对。

**品牌名映射**（socpk → 我们）：红米→Redmi、红魔→努比亚（子品牌）、苹果→Apple、Realme→realme、谷歌→Google；三星无「Galaxy」前缀（socpk 写「S26 Ultra」我们写「三星 Galaxy S26 Ultra」）。

**18 款对不上的机型及原因**（全部是我们库里**没有该机型**，非命名问题）：

| socpk 机型 | 情况 |
| --- | --- |
| 荣耀 WIN | 库里只有 WIN RT |
| 红米 K90 至尊版 | 库里只有 K90 / K90 Max / K90 Pro Max |
| 红米 Turbo 5 Max | 无 Turbo 5 系列（最新 Turbo 4） |
| 小米 17 Max | 无（有 17/17 Pro/17 Pro Max/17 Ultra） |
| 小米 17T / 17T Pro | 无 |
| 小米 15s Pro | 无（有 15/15 Pro/15 Ultra） |
| iQOO Z10 Turbo+ | 只有 Z10 Turbo |
| iQOO Neo 10 Pro+ | 只有 Neo10 Pro |
| iQOO Neo 11 | 只有 Neo11 至尊版（非同款，注意别混） |
| 一加 Ace6 / Ace6 至尊版 / Ace6T | 无 Ace6 系列（最新 Ace 5 至尊版） |
| 一加 15T | 无（有 13T/15） |
| 华为 Nova 16 / Nova 16 Pro / Nova 15 Pro | nova 系列只到 13 |
| 努比亚 Z80 Ultra | 最新 Z70S Ultra |

> 这批缺口集中在 2026 年新机，与 T03 批次补录任务高度重合，可直接作为补录清单参考。
> 反向覆盖：我们 531 款手机中 socpk 仅测 80 款（极客湾按热度选机），中低端与老机型覆盖为零——续航列会是稀疏字段。

## 五、入库方案建议（未改任何 src 代码）

### 1. 字段设计

建议在 `DeviceBattery` 新增独立字段，**不要**塞进 `capacity`/`batteryWh`（口径完全不同：容量 vs 实测时长）：

```ts
// src/types/device.ts · DeviceBattery
/** 实测续航时长（分钟）；来自极客湾续航测试 5.0，null = 未收录 */
batteryLifeMin?: number | null;
```

展示层在电池分组新增一行「实测续航（极客湾 5.0）」，格式化为 `12小时06分`（`min` → `Xh Ymin`）。
用户「放在电池那里」的诉求即由 `specGroups.ts` 的 `battery` 分组新增 row 实现（现 4 行：容量/有线/无线/反向，插在容量之后最自然）。

- 命名带 `Min` 后缀避免歧义（未来若收录平板续航或不同口径可扩展）。
- 存分钟整数，展示时格式化，避免浮点脏数据（源数据 725.999972）。

### 2. 口径标注（必须）

数据是第三方实测而非官网参数，且站点无文字版测试条件，建议：

- 行 label 写「实测续航*」，value 后缀角标，tooltip/脚注：「极客湾续航测试 5.0（socpk.com），零售机连续测试至关机，非官方口径；未收录机型不显示」。
- 详情页对比表中该行与官方参数行做视觉区分（如灰字/角标），与现有「参考价·非实时抓取」的诚实标注风格一致。
- 有 `videoUrl`（每台机器的 B 站全程录像），可放 tooltip「观看测试录像」，既标注来源又增强可信度。

### 3. 命名对齐规则（给写库脚本）

- 品牌：`红米→Redmi`、`红魔→努比亚`、`苹果→Apple`、`Realme→realme`、`谷歌→Google`。
- 机型名：socpk 三星无 `Galaxy` 前缀；大小写不敏感（我们库内 `REDMI K90`/`Redmi K90` 混用）；`至尊版`=Ultra 但**两库用法不一致**（socpk 有「K90 至尊版」我们没有），对齐必须逐条人工核对，纯字符串 fuzzy 匹配会产生 `小米 17 → iPhone 17 Pro Max` 这类误配（本次脚本先自动后人工复核修正）。
- 建议把本次 `research/socpk-battery-life.json` 里 62 条 `ours.id` 映射直接作为写库依据，不要重新跑自动匹配。

### 4. 录入范围建议

- 62 条可直接入库；剩余 18 条等对应机型补录（T03 批次）后再回填。
- 部分对上机型在我们库中可能尚未拆出（如 iqoo-15t 已存在，确认 62 条均真实存在，脚本已校验 id 全部有效）。

## 六、版权 / 引用注意

- 站点**无版权声明、无转载条款、无 about 页**；页脚仅 ICP 备案（沪ICP备2024064919号）；robots.txt 不存在（SPA fallback 返回首页）。
- 无 robots 限制 ≠ 授权转载。数据是极客湾自购设备的实测成果，**入库必须显著标注「数据来源：极客湾 Geekerwan（socpk.com）」**，建议同时链接其 B 站主页。
- 规模化、定期抓取建议保持 ≥500ms 间隔（本次 600ms）；如需定期同步（dataVersion 变更检测），频率建议 ≤ 每周一次。

## 七、交付物

- `research/socpk-data-2026-10-15.md`（本文）
- `research/socpk-battery-life.json`：80 条续航数据 + 对齐结果（机器可读，可直接驱动写库脚本）
- `research/socpk-raw/`：原始解码数据（site 配置 + 续航榜 + 充电曲线 + 3 条能效曲线）

## 附录：解码脚本要点

```js
// 1) 从 /assets/index-DKgb512s.js 提取 data:application/wasm;base64,... 存为 socpk_codec.wasm
// 2) Node 中实例化并按站点逻辑解码：
const { instance } = await WebAssembly.instantiate(wasmBuf, {});
const w = instance.exports;               // inputPtr/outputPtr/inputCap/decode/memory
const buf = Buffer.from(b64, 'base64');
new Uint8Array(w.memory.buffer, w.inputPtr(), buf.length).set(buf);
const n = w.decode(buf.length);           // 返回 Float64 个数，<0 为失败
const out = new Float64Array(w.memory.buffer, w.outputPtr(), n);
// buf[0]===1 → (x,y) 点对曲线；否则标量（续航榜单位分钟）
// 3) GET /api/pages/{slug} 取 series 元数据，GET /api/pages/{slug}/data 取 {id, p}
```
