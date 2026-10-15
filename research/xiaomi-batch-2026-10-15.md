# 小米 / REDMI 品牌参数整包补齐（2026-10-15 批次）

执行人：xiaomi-data
改动文件：`src/data/phones/xiaomi.ts`、`src/data/phones/redmi.ts`（仅这两个文件，未动其他品牌、未提交 git）

---

## 0. 取证路径说明（纠正上一轮的错误）

小米官网参数页的正确入口是 **`https://www.mi.com/prod/<机型slug>/specs`**（概述页为 `/prod/<slug>`），
**不是** `/param`、`/specs/xxx` 等其它变体。slug 一律小写 + 连字符（如 `xiaomi-18-pro-max`、`redmi-k90-max`）。

本轮已验证：`/prod/<slug>/specs` 对 17 / 18 / K90 系列、Turbo 4 Pro、Turbo 3、Note 14 Pro、14C、15 Ultra、
MIX Fold 4、Civi 5 Pro 均有效；**2022 年及更早的机型（K40/K50/K60/K70E、Note 11/12/13、13C、A3 Pro、
小米 12X / Civi / Civi 2 / Civi 3 / 11 青春版）官网参数页已下线**（探测结果：这些 slug 的 `<title>` 为空、
页面回落 mi.com 首页），因此这些机型**没有官方一手来源可取**。

> 说明：mi.com 的 `/prod/<slug>/specs` 是纯前端渲染页面，`curl` 直取只能拿到骨架（约 210KB，无参数正文），
> 必须用带 JS 渲染的抓取器才能拿到参数正文。本文所有数值均来自渲染后的官方参数正文。

---

## 1. P0：用户点名的 6 款机型（bdim / wt / sz / res / nit）

### 1.1 xiaomi-18-pro（小米 18 Pro）— 用户原话点名的机型
来源：https://www.mi.com/prod/xiaomi-18-pro/specs

| 字段 | 补前 | 补后 | 官网原文依据 |
|---|---|---|---|
| `sz` | null | **6.4** | 「正屏 6.4英寸 超级像素2.0 智能防窥屏」 |
| `res` | null | **'2436x1120'** | 「分辨率：2436 x 1120 超级像素」 |
| `nit` | null | **4000** | 「多场景峰值亮度：4000nits」 |
| `bdim` | null | **'151.8x72x8.46mm（玻纤版）/8.56mm（玻璃版）'** | 「长度：151.8mm 宽度：72mm 厚度：玻纤（黑色、白色、冰桃粉）8.46mm；玻璃（星河蓝、透明版）8.56mm」 |
| `wt` | null | **203** | 「重量：玻纤（黑色、白色、冰桃粉）203g；玻璃（星河蓝、透明版）208g」 |
| `br` | null | **'27W有线反充/支持无线反充'** | 「27W 有线反充」「支持无线反充」（无线反充未给瓦数，照抄原文，未补瓦数） |
| `cw` | '5000万像素超广角 17mm' | '5000万像素超广角 17mm 102°' | 「徕卡超广角：50MP｜ƒ/2.4｜等效 17mm｜102° 超广视角」 |
| `fc` | null | **'5000万像素'** | 「前置 5000 万高清相机」 |

### 1.2 xiaomi-18-pro-max（小米 18 Pro Max）
来源：https://www.mi.com/prod/xiaomi-18-pro-max/specs

| 字段 | 补前 | 补后 | 官网原文依据 |
|---|---|---|---|
| `sz` | null | **6.9** | 「正屏 6.9英寸 超级像素2.0 智能防窥屏」 |
| `res` | null | **'2624x1208'** | 「分辨率：2624 x 1208 超级像素」 |
| `nit` | null | **4000** | 「多场景峰值亮度：4000nits」 |
| `bdim` | null | **'163.39x77.6x8.39mm（玻纤版）/8.47mm（玻璃版）'** | 「长度：163.39mm 宽度：77.6mm 厚度：玻纤 8.39mm；玻璃 8.47mm」 |
| `wt` | null | **235** | 「重量：玻纤 235g；玻璃 240g」 |
| `br` | null | **'27W有线反充/支持无线反充'** | 「27W 有线反充」「支持无线反充」 |
| `cw` / `fc` | 同 18 Pro | 同上 | 同 18 Pro（官网这两段文案一致） |

### 1.3 xiaomi-17-pro（小米 17 Pro）
来源：https://www.mi.com/prod/xiaomi-17-pro/specs

| 字段 | 补前 | 补后 | 官网原文依据 |
|---|---|---|---|
| `bdim` | null | **'151.1x71.8x8.0mm'** | 「长度：151.1mm 宽度：71.8mm 厚度：8.0mm」 |
| `wt` | null | **192** | 「重量：192g」 |
| `res` | null | **'2656x1220'** | 「正屏 6.3″1.5K … 分辨率：2656 x 1220」 |
| `nit` | null | **3500** | 「多场景峰值亮度：3500nits」 |
| `bw` | null | **100** | 「100W 小米澎湃有线秒充」 |
| `bwl` | null | **50** | 「50W 小米澎湃无线秒充」 |
| `cw` | null | **'5000万像素超广角 17mm 102°'** | 「徕卡超广角：50MP｜ƒ/2.4｜17mm｜102°」 |
| `ct` | null | **'5000万像素浮动潜望长焦 5倍光学变焦 OIS'** | 「徕卡浮动潜望长焦：50MP｜ƒ/3.0｜5倍 光学变焦｜20cm 长焦微距｜OIS」 |
| `cz` | null | **'5倍光变'** | 同上（官网未公布数码变焦倍数，故不补「/xx倍数字」） |
| `fc` | null | **'5000万像素'** | 「前置 5000 万高清相机 50MP｜ƒ/2.2」 |
| `bio` | null | **'3D超声波指纹'** | 「指纹解锁：3D 超声波指纹」 |

### 1.4 xiaomi-17-pro-max（小米 17 Pro Max）
来源：https://www.mi.com/prod/xiaomi-17-pro-max/specs

| 字段 | 补前 | 补后 | 官网原文依据 |
|---|---|---|---|
| `bdim` | null | **'162.9x77.6x8.0mm'** | 「长度：162.9mm 宽度：77.6mm 厚度：8.0mm」 |
| `wt` | null | **219** | 「重量：219g」 |
| `res` | null | **'2608x1200'** | 「分辨率：2608 x 1200 超级像素」 |
| `nit` | null | **3500** | 「多场景峰值亮度：3500nits」 |
| `bw` / `bwl` | null / null | **100 / 50** | 「100W 小米澎湃有线秒充 / 50W 小米澎湃无线秒充」 |
| `cw` | null | **'5000万像素超广角 17mm 102°'** | 「徕卡超广角：50MP｜ƒ/2.4｜17mm｜102°」 |
| `ct` | null | **'5000万像素超聚光潜望长焦 5倍光学变焦 OIS'** | 「徕卡超聚光潜望长焦：50MP｜1/2″｜ƒ/2.6｜5倍 光学变焦｜30cm 长焦微距｜OIS」 |
| `fc` / `bio` | null | **'5000万像素' / '3D超声波指纹'** | 同上 |

### 1.5 redmi-k90（REDMI K90）
来源：https://www.mi.com/prod/redmi-k90/specs

| 字段 | 补前 | 补后 | 官网原文依据 |
|---|---|---|---|
| `bdim` | null | **'157.49x75.25x8.0mm'** | 「长度：157.49mm 宽度：75.25mm 厚度：8.0mm」 |
| `wt` | null | **206** | 「重量：206g」 |

（`sz` 6.59、`res` 2510x1156、`nit` 3500 库中已有，与官网一致，未改动）

### 1.6 redmi-k90-max（REDMI K90 Max）
来源：https://www.mi.com/prod/redmi-k90-max/specs （并用 https://www.mi.com/prod/redmi-k90-max 概述页交叉核对）

| 字段 | 补前 | 补后 | 官网原文依据 |
|---|---|---|---|
| `bdim` | null | **'162.91x77.93x8.18mm'** | 「长度：162.91mm 宽度：77.93mm 厚度：8.18mm」 |
| `wt` | 227 | 227（核对一致） | 「重量：227g」 |
| `res` | null | **'2772x1280'** | 「分辨率：2772*1280」 |
| `nit` | null | **3500** | 「多场景峰值亮度：3500nits」 |
| `br` | '22.5W反充' | **'22.5W有线反充'** | 「100W 有线快充* 22.5W 有线反充*」 |

---

## 2. P1：反向充电 `br` 分档表（逐机型取官网原文，未按品牌一刀切）

| 分档 | 机型 | `br` 值 | 官网原文 | 来源 URL |
|---|---|---|---|---|
| 27W 有线反充 + 支持无线反充 | xiaomi-18-pro | `27W有线反充/支持无线反充` | 「27W 有线反充」「支持无线反充」 | /prod/xiaomi-18-pro/specs |
| 27W 有线反充 + 支持无线反充 | xiaomi-18-pro-max | `27W有线反充/支持无线反充` | 同上 | /prod/xiaomi-18-pro-max/specs |
| 22.5W 有线/无线反充 | xiaomi-17 / 17-pro / 17-pro-max | `22.5W有线/无线反充` | 「22.5W 有线/无线反充」 | /prod/xiaomi-17-pro/specs 、/prod/xiaomi-17-pro-max/specs |
| 22.5W 有线反充 + 支持无线反充 | xiaomi-17-ultra | `22.5W有线反充/支持无线反充` | 「22.5W 有线反充」「支持无线反充」 | /prod/xiaomi-17-ultra/specs |
| 22.5W 有线反充 | redmi-k90 | `22.5W有线反充` | 「100W 有线快充 / 22.5W 有线反充」 | /prod/redmi-k90/specs |
| 22.5W 有线反充 | redmi-k90-max | `22.5W有线反充` | 「100W 有线快充 / 22.5W 有线反充」 | /prod/redmi-k90-max/specs |
| 22.5W 有线/无线反充 | redmi-k90-pro-max | `22.5W有线/无线反充`（原值保留） | 官网同口径 | 库中已有 |
| 22.5W 有线反充 | redmi-turbo-4-pro | `22.5W有线反充`（原 `22.5W反向`，口径统一） | 「90W 小米澎湃有线秒充 / 22.5W 有线反向快充」「最大支持 22.5W 有线反向充电」 | /prod/redmi-turbo-4-pro/specs |
| 18W 有线反充 | **xiaomi-15-ultra** | `18W有线反充`（**修正**） | 「90W 小米澎湃有线秒充 / 80W 小米澎湃无线秒充 / 支持18W有线反充」 | /prod/xiaomi-15-ultra/specs |

### 2.1 br 本次实际新增/修正的机型（共 5 款）
| 机型 | 改前 | 改后 | 性质 |
|---|---|---|---|
| xiaomi-18-pro | null | `27W有线反充/支持无线反充` | 新增 |
| xiaomi-18-pro-max | null | `27W有线反充/支持无线反充` | 新增 |
| xiaomi-17-ultra | null | `22.5W有线反充/支持无线反充` | 新增 |
| redmi-k90-max | `22.5W反充` | `22.5W有线反充` | 口径统一 |
| redmi-turbo-4-pro | `22.5W反向` | `22.5W有线反充` | 口径统一 |
| **xiaomi-15-ultra** | `10W反向` | **`18W有线反充`** | **历史错误修正（官网确证）** |

### 2.2 br 仍为 null 的机型及原因（共 27 款，一律不编造）
**xiaomi.ts（7 款）**
| 机型 | 原因 |
|---|---|
| xiaomi-18-fold | 官网「续航与充电」段只有「67W 有线秒充 / 50W 无线秒充」，**未列任何反充项** → 保持 null（来源 /prod/xiaomi-18-fold/specs） |
| xiaomi-12x | mi.com 该机型参数页已下线 |
| xiaomi-civi-3 | 同上 |
| xiaomi-civi-2 | 同上 |
| xiaomi-civi | 同上 |
| xiaomi-11-youth | 同上 |

**redmi.ts（20 款）**
| 机型 | 原因 |
|---|---|
| redmi-turbo-3 | 官网参数页存在，「充电与电池」段只列「90W 有线快充」，未列反充 → 保持 null（/prod/redmi-turbo-3/specs） |
| redmi-note-14-pro | 官网参数页存在，只列「45W 有线快充」，未列反充 → 保持 null（/prod/redmi-note-14-pro/specs） |
| redmi-note-14 | 官网参数页存在，本轮渲染未拿到充电段，暂不填（待复核） |
| redmi-14c | 官网参数页存在，只列「最高支持18W快充」，未列反充 → 保持 null（/prod/redmi-14c/specs） |
| redmi-k70e / k60e / k50-ultra / k50-pro / k50 / k40-pro / k40 | mi.com 参数页已下线 |
| redmi-note-14-pro-plus / note-13-pro-plus / note-13-pro / note-13 / note-12-pro / note-12 / note-11t-pro / note-11-pro | mi.com 参数页已下线 |
| redmi-13c / redmi-a3-pro | mi.com 参数页已下线 |

> 重要提醒：上一轮「小米 = 10W 反向」的一刀切口径已被证伪。小米 15 Ultra 官网是 **18W 有线反充**，
> 17/17 Ultra/K90 系列是 **22.5W**，18 系列是 **27W**。库中剩余 `br:'10W反向'` 的机型（14 Ultra 及更早、
> Civi 全系）**官网参数页均已下线，无法复核**，本轮未改动，建议后续用其它官方渠道（如小米客服 KA 文档）复核。

---

## 3. P2：变倍 `cz`

| 机型 | 改前 | 改后 | 官网原文 | 来源 |
|---|---|---|---|---|
| xiaomi-17-pro | null | **`5倍光变`** | 「徕卡浮动潜望长焦：50MP｜ƒ/3.0｜5倍 光学变焦」 | /prod/xiaomi-17-pro/specs |
| xiaomi-18-fold | null | **`3.5倍光变`** | 「徕卡潜望长焦：50MP｜ƒ/2.8｜3.5倍 光学变焦｜7倍 光学质感变焦｜OIS」 | /prod/xiaomi-18-fold/specs |
| xiaomi-18-pro / 18-pro-max | `3.2倍光变` | 保留 | 「徕卡2亿超大底潜望长焦：3.2倍光学变焦」——**官网未公布数码变焦倍数** | /prod/xiaomi-18-pro/specs |
| xiaomi-17-pro-max | `5倍光学变焦` | 保留 | 「5倍 光学变焦」——官网未公布数码变焦倍数 | /prod/xiaomi-17-pro-max/specs |
| xiaomi-17-ultra | `3.2–4.3倍光变/120倍数字` | 保留 | 官网「3.2-4.3倍 光学变焦」+ KA-680739「数码最高 120 倍」 | /prod/xiaomi-17-ultra/specs、KA-680739 |

**未补 `cz` 的机型及原因**：
- `redmi-k90`：官网长焦只给「5000万像素｜5P｜f/2.2」，**未标光学变焦倍率，也未标数码变焦倍率** → 保持 null
- `redmi-k90-max`：官网影像段**只有主摄 + 800 万超广角，无长焦镜头**；概述页的「2X 无损变焦」是主摄裁切，
  不是光学变焦 → `ct` / `cz` 均保持 null
- `xiaomi-17`：官网长焦只给「5000万像素浮动长焦 60mm OIS」，**未标光学变焦倍率** → 保持 null
- `redmi-k90-pro-max`：`5倍光变` 已有，官网未给数码变焦倍数 → 保留

> 口径纪律：小米 18 系列 / 17 Pro / 17 Pro Max / 18 Fold 的官网参数页**没有数码变焦倍数**，
> 因此不套用 17 Ultra 的「120 倍数字」，避免把别机型的数码变焦搬到本机。

---

## 4. 前后对比：本轮所有字段改动一览

### xiaomi.ts
- `xiaomi-15-ultra`：`br` `10W反向` → `18W有线反充`（历史错误修正）
- `xiaomi-17-pro`：`res`/`nit`/`bw`/`bwl`/`cw`/`ct`/`cz`/`fc`/`bio`/`bdim`/`wt` 共 11 项补齐
- `xiaomi-17-pro-max`：`res`/`nit`/`bw`/`bwl`/`cw`/`ct`/`fc`/`bio`/`bdim`/`wt` 共 10 项补齐
- `xiaomi-17-ultra`：`ppi`/`nit`/`rt`/`ft`/`ram`/`rom`/`br`/`bdim`/`bio` 共 9 项补齐（ram/rom 原为空数组，属 QA 必填缺失）
- `xiaomi-18-pro`：`sz`/`res`/`nit`/`cw`/`fc`/`br`/`bdim`/`wt` 共 8 项补齐
- `xiaomi-18-pro-max`：`sz`/`res`/`nit`/`cw`/`fc`/`br`/`bdim`/`wt` 共 8 项补齐
- `xiaomi-18-fold`：`cz` 补齐

### redmi.ts
- `redmi-k90`：`bdim`/`wt` 补齐
- `redmi-k90-max`：`bdim`/`res`/`nit` 补齐，`br` 口径统一
- `redmi-turbo-4-pro`：`br` 口径统一

---

## 5. 修正的历史错误值

| # | 机型 | 字段 | 错误旧值 | 正确新值 | 官网依据 |
|---|---|---|---|---|---|
| 1 | xiaomi-15-ultra | `br` | `10W反向` | **`18W有线反充`** | /prod/xiaomi-15-ultra/specs：「90W 有线秒充 / 80W 无线秒充 / 支持18W有线反充」 |
| 2 | xiaomi-17-pro-max | `bc` | `8000` | `7500`（官网典型值） | /prod/xiaomi-17-pro-max/specs：「7500mAh(typ) / 7330mAh(min)」（上一轮已改，本轮复核确认） |
| 3 | redmi-k90-max | `br` | `22.5W反充` | `22.5W有线反充` | 官网「22.5W 有线反充」 |
| 4 | redmi-turbo-4-pro | `br` | `22.5W反向` | `22.5W有线反充` | 官网「22.5W 有线反向快充」 |

### 5.1 发现但未改动的问题（不在本批范围，建议 team-lead 决定）
- `redmi-note-14-pro` 的 `bc` 库中为 5110，官网为 **5500mAh(typ)**；`wt` 库中 180g，官网 **190g**；
  `bdim` 库中 162.33x74.21x8.24，官网 162.33x74.42x8.24。来源 /prod/redmi-note-14-pro/specs
- `redmi-14c` 的 `cm` 库中为「5000万像素」，官网为 **1300万像素**；`bdim` 库中 171.88x77.16x8.22，
  官网 171.88x77.8x8.22。来源 /prod/redmi-14c/specs
- `redmi-turbo-3` 的 `bdim` 库中 160.95x75.24x7.8，官网 160.5x74.4x7.8。来源 /prod/redmi-turbo-3/specs
- `xiaomi-15-ultra` 的 `bc` 库中 5410（国际版口径），中国官网为 **6000mAh(typ)/5860mAh(min)**，
  建议明确标注版本口径后再定
- `xiaomi-civi-5-pro` 现有 `br:'10W反向'`，但官网「充电续航」段只列 6000mAh / 67W 有线秒充，
  **未列反充项**，该值无官方依据，属待复核（本轮未改）

---

## 6. 官网未公布因而留 null 的字段清单

| 机型 | 保持 null 的字段 | 原因 |
|---|---|---|
| xiaomi-18-pro | `ppi` `gpu` `an` `rt` `ft` `os` `wf` `bt` `spk` `bm` `dim` | 官网参数页未公布（页面只给「USB 3.2 Gen1」、Wi-Fi 7 / BT 6.0 在数据连接段有值但字段口径未同步） |
| xiaomi-18-pro-max | 同上 | 同上 |
| xiaomi-18-fold | `br` `cz`（数码部分） `os` `bt` `spk` | 官网未列反充项；未列数码变焦倍数 |
| xiaomi-17-pro / 17-pro-max | `cz` 的数码变焦部分、`gpu` `an` `os` `bt` `spk` `bm` | 官网未公布数码变焦倍数 |
| xiaomi-17 | `cz` | 官网只给 60mm 等效焦距，未标光学变焦倍率 |
| xiaomi-15-ultra 等 14 系及更早 | `br`（多数已有历史值但未复核） | 官网参数页已下线 |
| redmi-k90 | `ppi` `cpu` `gpu` `an` `os`；`cz` | 官网未公布 |
| redmi-k90-max | `ct` `cz`（无长焦）`hdr` `wf` `bt` `bm` `bio` `spk` `col` | 官网未公布 / 机型本身无长焦 |
| redmi Turbo 3 / Note 14 Pro / Note 14 / 14C 等 | `br` | 官网只列有线快充，未列反充项 |

---

## 7. 校验结果

| 项目 | 基线（改前） | 本轮改后 | 结论 |
|---|---|---|---|
| `npx tsc -p tsconfig.app.json --noEmit` | — | **0 错误**（无任何输出） | ✅ |
| `node scripts/_qa-validate.mjs` — 完全合规机型 | 532/644（82.61%） | **535/644（83.07%）** | ✅ +3 |
| 违规记录数 | 266 | **262** | ✅ −4 |
| 必填缺失计数 | 166 | **164** | ✅ −2，**未引入任何新的必填缺失** |

`screen.size | 必填字段为空` 清单中，「小米 18 Pro」「小米 18 Pro Max」两项已消失；
剩余的小米/REDMI 条目全部是**平板**（xiaomi-pad-*、redmi-pad-*、redmi-k-pad-2），与本次手机批次无关。

---

## 8. 文件头「数据来源与口径」注释

已在两个文件头部追加完整注释块，写明：官网取证 URL 清单、反向充电分档依据与逐机型原文、
官网未公布故留 null 的字段及原因、bdim 双厚度口径说明。
