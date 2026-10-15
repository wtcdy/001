# OPPO / 一加 品牌手机参数整包补齐（批次 2026-10-15）

补录人：oppo-data　｜　基线：`536/644 合规、157 必填缺失` → 交付时 `543/644 合规、140 必填缺失`
（`npx tsc -p tsconfig.app.json --noEmit` 0 错误；本轮未引入任何新的必填缺失）

改动文件：**仅** `src/data/phones/oppo.ts`、`src/data/phones/oneplus.ts`（未碰其他品牌、未提交 git）。

---

## 0. 抓取路径（踩坑记录，供后续复用）

| 来源 | URL 规律 | 可用性 |
|---|---|---|
| **OPPO 官网规格页**（首选） | `https://www.oppo.com/cn/smartphones/series-<系列>/<机型>/specs/`<br>系列段：`series-find-x` / `series-find-n` / `series-reno` / `series-k` / `series-a` | ✅ 全部命中 |
| **OPPO 官网产品页**（补 nit / 扬声器 / 芯片口径） | `https://www.oppo.com/cn/smartphones/series-find-x/<机型>/` | ✅ 命中 |
| **一加官网规格页**（首选） | `https://www.oneplus.com/cn/<数字>/specs`（`/cn/15/specs`、`/cn/13/specs`、`/cn/12/specs`、`/cn/11/specs`、`/cn/13t/specs`）<br>老机型：`/cn/9-pro/specs`、`/cn/9r/specs`、`/cn/9rt/specs`、`/cn/8t/specs`、`/cn/ace/specs` | ✅ 命中 |
| 一加已下架路径 | `/cn/9pro/specs`、`/cn/ace3/specs`、`/cn/ace5/specs`、`/cn/ace5-pro/specs`、`/cn/13/specs` 之外的 Ace 系列 | ❌ 404 |
| OPPO 商城 | `https://www.opposhop.cn/cn/web/products/<id>.html` | 未使用（官网页已足够） |

**关键坑 1（团队提示属实）**：OPPO 必须走 `series-<系列>/<机型>/specs/`，把机型塞进 `series-find` 会 404
（`find-n3-flip`、`find-n2-flip` 一开始 404，改到 `series-find-n` 才通）。

**关键坑 2**：一加和 OPPO 用的是**两套完全不同的参数模板**——
一加模板会**显式列出「无线反向充电 / 有线反向充电」两行**（有就有、没有就整行不出现），
OPPO 模板只在部分老旗舰上写「支持 10 W 反向充电」，新机型整页只有「OTG 数据传输 支持」。
因此**一加可以按「有没有反向行」判空，OPPO 不能**（详见 §2）。

---

## 1. P0 —— 4 款最新旗舰补齐（用户重点关注项）

来源统一为 OPPO 官网规格页「尺寸与重量」段，逐字核对。

| 机型 | 补的字段 | 值 | 来源 URL |
|---|---|---|---|
| **OPPO Find X9**<br>`oppo-find-x9` | `bdim`<br>`wt`<br>`ppi` | `156.98x73.93x7.99mm`<br>`203`<br>`460` | https://www.oppo.com/cn/smartphones/series-find-x/find-x9/specs/<br>（高 约156.98／宽 约73.93／厚 约7.99mm，重量 约203克；FHD+ 2760×1256，460 PPI） |
| **OPPO Find X9 Pro**<br>`oppo-find-x9-pro` | `bdim`<br>`wt`<br>`ppi`<br>`fc` | `161.26x76.46x8.25mm`<br>`224`<br>`450`<br>`5000万像素` | https://www.oppo.com/cn/smartphones/series-find-x/find-x9-pro/specs/<br>（高 约161.26／宽 约76.46／厚 约8.25mm，重量 约224克；前置 5000万 f/2.0） |
| **OPPO Find X10**<br>`oppo-find-x10` | `bdim`<br>`wt`<br>`nit`<br>`ppi`<br>`fc` / `wf` / `bt` / `spk` / `bio` | `156.51x74.29x8.35mm`<br>`216`（库里原值即 216，已核对无误）<br>`2000`<br>`462`<br>`5000万像素` / `Wi-Fi 7` / `6.2` / `立体声双扬声器` / `超声波屏下指纹 + 面部识别` | https://www.oppo.com/cn/smartphones/series-find-x/find-x10/specs/<br>+ https://www.oppo.com/cn/smartphones/series-find-x/find-x10/ |
| **OPPO Find X10 Pro Max**<br>`oppo-find-x10-pro-max` | `bdim`<br>`wt`<br>`bc` ← **任务点名**<br>`sz` / `res` / `ppi`<br>`nit`<br>`bw` / `bwl`<br>`cz` ← P2<br>`soc` / `cpu` / `pr` ← **纠错**<br>`fc` / `wf` / `bt` / `bio` / `spk` / `cm` / `cw` / `ct` | `161.32x76.57x8.40mm`<br>`235`<br>`8000`<br>`6.78` / `2772x1272` / `450`<br>`2000`<br>`80` / `50`<br>`3倍光变/120倍数字`<br>`天玑9600 Pro` / `8核 最高4.55GHz` / `2nm`<br>`5000万像素` / `Wi-Fi 7` / `6.2` / `超声波屏下指纹 + 面部识别` / `对称立体声双扬声器` | https://www.oppo.com/cn/smartphones/series-find-x/find-x10-pro-max/specs/<br>+ https://www.oppo.com/cn/smartphones/series-find-x/find-x10-pro-max/ |

### 1.1 顺带补齐：OPPO Find X9 Ultra（原为 4 字段残桩，是 `screen.size` 必填缺失）

原记录只有 `bc / br / cz / tags`，本轮按官网整包补齐：
`sz:6.82`、`res:'3168x1440'`、`ppi:510`、`rr:144`、`bdim:'163.16x76.97x8.65mm'`、`wt:235`、
`bw:100`、`bwl:50`、`cm/cw/ct/ce`、`fc:'5000万像素'`、`soc:'第五代骁龙8至尊版'`、`cpu:'8核 最高4.608GHz'`、
`rt:'LPDDR5X'`、`ft:'UFS 4.1'`、`ram/rom`、`wf:'Wi-Fi 7'`、`bt:'6.0'`、`ui:'ColorOS 16'`、
`bio:'屏下超声波指纹 + 面部识别'`、`port`、`col`。
来源：https://www.oppo.com/cn/smartphones/series-find-x/find-x9-ultra/specs/

### 1.2 ⚠️ 口径警告：`nit` 峰值亮度，OPPO 官网两套页面给的不是同一个数

| 机型 | 规格页（全局激发最高亮度） | 产品页（局部峰值亮度） | 库里最终取值 |
|---|---|---|---|
| Find X9 / X9 Pro | 1800 尼特 | **3600 nits** | **3600**（沿用库里原值，来源=产品页） |
| Find X10 / X10 Pro Max | 2000 尼特 | 产品页也只写「2000nits **全局峰值**亮度」 | **2000** |
| Find X9 Ultra | 1800 尼特 | 产品页未取到 | **null**（保持官网未公布） |

即 **Find X9 的 3600 与 Find X10 的 2000 不是同一测量口径**（局部峰值 vs 全局峰值），
直接横向排序会误导。本轮**没有强行统一**（统一需先拿到 X10 系列的局部峰值官方值）。
已在两个数据文件头注释里写明，建议后续整体拉平口径时一并处理。

---

## 2. P1 —— 反向充电 `br`（逐机型查官网，**未做品牌一刀切**）

### 2.1 一加：官网模板会显式列反向充电行 → 有行照抄、无行判空

| 机型 | 官网原文（一加官网 `/cn/<n>/specs`） | 本轮 `br` | 说明 |
|---|---|---|---|
| 一加 13 | `无线反向充电：支持（最大功率 10W）`<br>`有线反向充电：支持（最大功率 5W）` | **`10W无线反向 + 5W有线反向`** | 原 `'10W反向'` → 按官网补全（同时有无线与有线两路） |
| 一加 12 | `无线反向充电：10W` | **`10W无线反向`** | 原 `'10W反向'` → 按官网明确为无线 |
| 一加 15 | 只有 `快速充电 120W`、`无线充电 最大支持 50W 无线闪充`，**无反向行** | **null（保持）** | 官网未公布 |
| 一加 13T | 只有 `有线快充 80W`、`电池 6260mAh`，**无无线、无反向行** | **null（纠错：原 `'10W反向'`）** | 同模板下一加 12/13 有反向行，13T 没有 |
| 一加 11 | 只有 `有线快充 100W`、`电池 5000mAh`，**无无线、无反向行** | **null（纠错：原 `'10W反向'`）** | 同上 |
| 一加 9 Pro | `Warp 闪充 65T`、`50W 无线闪充`，**无反向行** | null（保持） | https://www.oneplus.com/cn/9-pro/specs |
| 一加 9 | `Warp 闪充 65T`，**无反向行** | null（保持） | https://www.oneplus.com/cn/9/specs |
| 一加 9R | `Warp 闪充 65`，**无反向行** | null（保持） | https://www.oneplus.com/cn/9r/specs |
| 一加 9RT | 页面参数段未列反向充电 | null（保持） | https://www.oneplus.com/cn/9rt/specs |
| 一加 8T | `Warp 闪充 65`，**无反向行** | null（保持） | https://www.oneplus.com/cn/8t/specs |
| 一加 Ace | `有线快充 150W`，**无反向行** | null（保持） | https://www.oneplus.com/cn/ace/specs |

**一加 P1 结论：7 款 null 全部逐页查证完毕，官网均未公布反向充电 → 全部保持 null；另修正 2 款历史错误值（一加 11 / 13T），补全 2 款口径（一加 12 / 13）。**

### 2.2 OPPO：官网标注不统一，只能「有明确原文才填，其余留 null」

官网**明确写了反向充电**的只有 2 款（均为老旗舰）：

| 机型 | 官网原文 | `br` |
|---|---|---|
| Find X8 Ultra | `50 W 无线闪充`、`10 W 无线反向充电` | **`10W无线反向`**（原 `'10W反向'` → 按官网明确为无线） |
| Find X6 Pro | `50 W 无线闪充。兼容 Qi 无线快充协议，支持 10 W 反向充电` | `10W反向`（沿用，与原文一致） |

官网**完全没有反向充电行**（只有「OTG 数据传输 支持」——OTG 是数据传输，不是供电）
→ 一律**保持 null，绝不补瓦数**（共 13 款，全部逐页查证）：

| 机型 | 来源 URL | 官网电池段实际内容 |
|---|---|---|
| Find X9 | `.../find-x9/specs/` | 80W 超级闪充 + 50W 无线闪充 |
| Find X9 Pro | `.../find-x9-pro/specs/` | 80W 超级闪充 + 50W 无线闪充 |
| Find X9 Ultra | `.../find-x9-ultra/specs/` | 100W 超级闪充 + 50W 无线闪充 |
| Find X9s Pro | `.../find-x9s-pro/specs/` | 80W + 50W 无线（前批次已注明） |
| Find X10 | `.../find-x10/specs/` | 80W 超级闪充 + 50W 无线闪充 |
| Find X10 Pro Max | `.../find-x10-pro-max/specs/` | 80W 超级闪充 + 50W 无线闪充 |
| Find N6 | `.../series-find-n/find-n6/specs/` | 80W 超级闪充 + 50W 无线闪充 |
| Find N3 Flip | `.../series-find-n/find-n3-flip/specs/` | 44W 超级闪充（无无线） |
| Find N2 Flip | `.../series-find-n/find-n2-flip/specs/` | 44W 超级闪充（无无线） |
| Reno11 | `.../series-reno/reno11/specs/` | 67W 超级闪充 |
| K11 | `.../series-k/k11/specs/` | 长寿版 100W 超级闪充 |
| A3 Pro | `.../series-a/a3-pro/specs/` | 67W 超级闪充 |
| A2 Pro | `.../series-a/a2-pro/specs/` | 67W 超级闪充 |

### 2.3 历史错误值修正清单（本轮实际改动）

| # | 机型 | 原值 | 新值 | 修正依据 |
|---|---|---|---|---|
| 1 | **OPPO A5 Pro** | `'5W反向'` | **null** | 官网 `.../series-a/a5-pro/specs/`「电池」段只有 `80 W 超级闪充…`，**无线充电与反向充电均未列**，本机也不支持无线充电，5W 无出处 |
| 2 | **一加 11** | `'10W反向'` | **null** | 官网 `/cn/11/specs`「电池与充电」只有 100W 有线，无无线、无反向（同模板一加 12/13 有反向行） |
| 3 | **一加 13T** | `'10W反向'` | **null** | 官网 `/cn/13t/specs` 只有 80W 有线，无无线、无反向 |
| 4 | 一加 13 | `'10W反向'` | `'10W无线反向 + 5W有线反向'` | 官网同时给出无线 10W 与有线 5W 两路，原值漏了有线 |
| 5 | 一加 12 | `'10W反向'` | `'10W无线反向'` | 官网原文 `无线反向充电：10W` |
| 6 | OPPO Find X8 Ultra | `'10W反向'` | `'10W无线反向'` | 官网原文 `10 W 无线反向充电` |

> 未按错误处理的：`Find X8 / X8 Pro / Find N5 / Reno14 Pro` 等官网页面同样**不列**反向充电，
> 但这些机型**硬件上支持 50W 无线闪充**，而 OPPO 官网对该项的标注本身就不统一
> （X6 Pro、X8 Ultra 写，X8、X8 Pro、N5 不写），**「页面没写」≠「不支持」**，
> 因此本轮不据此判空，保留原 `'10W反向'` 并标记为**待复核**（见 §5）。

### 2.4 反向充电分档表（本轮最终口径）

| 档 | 判定标准 | `br` 写法 | 涉及机型 |
|---|---|---|---|
| A | 官网写明瓦数 | 照抄原文（含「无线 / 有线」限定） | Find X8 Ultra `10W无线反向`；Find X6 Pro `10W反向`；一加 13 `10W无线反向 + 5W有线反向`；一加 12 `10W无线反向` |
| B | 官网只写「支持 OTG 数据传输」或无反向行 | **null**（不补瓦数） | Find X9 / X9 Pro / X9 Ultra / X9s Pro / X10 / X10 Pro Max / Find N6 / N3 Flip / N2 Flip / Reno11 / K11 / A3 Pro / A2 Pro / A5 Pro；一加 15 / 11 / 13T / 9 / 9 Pro / 9R / 9RT / 8T / Ace |
| C | 官网未取到页面 | 保留原值 + 标记存疑 | 一加 Ace 全系（见 §5） |

---

## 3. P2 —— 变倍 `cz`（光学变倍 + 数码变倍）

| 机型 | 原 `cz` | 本轮 | 官网原文 |
|---|---|---|---|
| **OPPO Find X10 Pro Max** | **`null`** | **`3倍光变/120倍数字`** | 「照片拍摄最高支持 3 倍光学变焦，最高支持 120 倍数码变焦」（`find-x10-pro-max/specs/`） |
| OPPO Find X9 Ultra | `10倍光变/120倍数字` | 复核通过，未改 | 「照片拍摄最高支持 10 倍光学变焦，最高支持 120 倍数码变焦」 |
| OPPO Find X9 / X9 Pro | `3倍光学/120倍数码` | 复核通过，未改 | 同上口径 |
| OPPO Find X10 | `2.8倍光变 / 120倍数字` | 复核通过，未改 | 「最高支持 2.8 倍光学变焦，最高支持 120 倍数码变焦」 |
| OPPO Find X9s Pro | `2.8倍光学变焦 / 120倍数码变焦` | 复核通过，未改 | 前批次已注明 |
| 一加 15 | `3.5倍光变 / 120倍数字` | 复核通过，未改 | 「照片拍摄最高支持 3.5 倍光学变焦，最高支持 120 倍数码变焦」（`/cn/15/specs`） |
| 一加 13 / 12 / 11 | `3倍光变/120倍数字`、`2倍光变/20倍数字` | 复核通过，未改 | 一加官网「变焦」段 |

**扫描结果**：oppo.ts / oneplus.ts 中**已无「有长焦但 `cz` 为 null」**的机型，
也**已无「只写光变没写数码变倍」**的机型（本轮 P2 实际新增 1 条：Find X10 Pro Max）。

---

## 4. 官网未公布 → 保持 null 的字段清单（不编造）

| 机型 | 字段 | 官网实际情况 |
|---|---|---|
| Find X9 / X9 Pro / X10 / X10 Pro Max / Find N6 | `an`（安兔兔） | 官网从不公布跑分 |
| Find X9 / X9 Pro / X10 / X10 Pro Max / X9 Ultra | `gpu` | 规格页「芯片」段只给平台与 CPU 主频 |
| Find X10 / X10 Pro Max | `os` | 只写 `ColorOS 17.0`，未标 Android 版本 |
| Find X10 Pro Max | `hdr`、`spk`（已由产品页补为「对称立体声双扬声器」）、`sat` | 规格页未列 |
| Find X9 Ultra | `nit`、`ip`、`dim`、`gpu` | 规格页未列局部峰值亮度与防尘防水等级 |
| Find X9 Pro / Find X10 Pro Max | `col` | 部分配色官方未在产品页列全 |
| Find X9 全系 / X10 全系 / 一加 15 / 一加 11 / 13T | `br` | 见 §2 |

---

## 5. 存疑 / 后续待办（本轮未改，建议下一批跟进）

1. **一加 Ace 全系 `br:'10W反向'` 存疑**（11 款）：
   Ace 5 Pro / Ace 5 / Ace 5 至尊版 / Ace 3 Pro / Ace 3 / Ace 3V / Ace 2 Pro / Ace 2 / Ace 2V / Ace Pro / Ace 3 Pro 高达版。
   一加官网已下架这些机型的 `/specs` 路径（`/cn/ace3/specs`、`/cn/ace5/specs`、`/cn/ace5-pro/specs` 均 404），
   唯一可访问的 `/cn/ace/specs`（一加 Ace 初代）**确认只有 150W 有线、无反向行**。
   按「同模板无行即无」推理，这 11 条很可能是套用值；但**没有逐页实证，本轮不动**，建议后续用
   一加商城 / 京东自营详情页交叉核对后再批量判空。

2. **OPPO 中高端 `br:'10W反向'` 存疑**（Find X8 / X8 Pro / Find N5 / Reno14 Pro / Reno13 Pro / Reno12 Pro / Reno11 Pro / Reno10 Pro+ / K13 Turbo Pro / K12 Plus / K12）：
   官网参数页均不列反向充电，但其中 Find X8 / X8 Pro / N5 硬件支持 50W 无线闪充。
   不能反向推断为「不支持」（OPPO 官网标注本身不统一），保留原值。

3. **OPPO 部分机型的 `bwl`（无线充电）与官网矛盾，超出本轮范围，仅记录**：
   - Reno14 Pro：官网 `.../reno14-pro/specs/`「快速充电」只写 `80 W 超级闪充…`，**无无线充电行**，库里 `bwl:50` 存疑；
   - 同类需复核：Reno13 Pro（`bwl:50`）、Find N5 之外的 Reno/K 系列无线值。
   - A5 Pro：官网重量 186g（新年红/砂岩紫）/ 180g（石英白/磐石黑）、厚 7.67/7.55mm，
     库里为 194g / 7.7mm（疑为海外版口径）；`ft:'UFS 2.2'`（官网写 UFS 3.1）。本轮只改了 `br`，其余未动。

4. **`nit` 口径统一**（§1.2）：需要拿到 Find X10 系列的「局部峰值亮度」官方值，才能与 Find X9 的 3600 对齐。

---

## 6. 第二轮（team-lead 拍板后执行，2026-10-15）

### 6.1 峰值亮度 nit —— 最终选**规格页「全局激发最高亮度」口径**

第一步复查结果：**Find X10 / X10 Pro Max 查不到官方局部峰值亮度**。

| 渠道 | 是否给出 X10 系列局部峰值 |
|---|---|
| OPPO 官网产品页 `.../series-find-x/find-x10/` | ❌ 只写「**2000nits 全局峰值亮度**」 |
| OPPO 官网规格页 `.../find-x10/specs/` | ❌ 只有「全局激发最高亮度：2000 尼特典型值」 |
| OPPO 商城 `opposhop.cn/cn/web/products/45211.html` | ❌ 只有「全局激发最高亮度：2000 尼特典型值」 |
| OPPO 台湾站 / 新加坡站 `find-x10` | ❌ 404（X10 海外 10-22 才发布） |
| 媒体稿（iXBT 发布会直播、新浪科技、太平洋电脑网、腾讯新闻） | ⚠️ 有「局部峰值 3600nits」，但**非官网出处，按数据优先级不采用** |

因此执行拍板第二条分支 —— **统一退回规格页口径**：

| 机型 | 原值 | 最终 `nit` | 官网原文 |
|---|---|---|---|
| Find X9 | 3600（产品页局部峰值） | **1800** | 规格页「全局激发最高亮度：1800 尼特典型值」 |
| Find X9 Pro | 3600（产品页局部峰值） | **1800** | 同上 |
| Find X9 Ultra | null | **1800** | 规格页「全局激发最高亮度：1800 尼特典型值」 |
| Find X10 | 2000 | **2000**（不变） | 规格页「全局激发最高亮度：2000 尼特典型值」 |
| Find X10 Pro Max | 2000 | **2000**（不变） | 同上 |

两个文件头均已写明「nit 统一取官网规格页全局激发最高亮度口径」。
补充一句防误伤：Find X8 及更早机型的 `nit:4500` 是**旧版规格页直接印的「峰值亮度 APL1% 4500 尼特」**，
属于官方原文，不受本次拉平影响，未改动。

### 6.2 一加 Ace 全系 `br` —— 已判空清除 **11 款**

按「无官网依据即清除」铁律，以下 11 款 `br:'10W反向'` → `null`：
Ace 5 Pro、Ace 5、Ace 5 至尊版、Ace 3 Pro、Ace 3、Ace 3V、Ace 2 Pro、Ace 2、Ace 2V、Ace Pro、Ace 3 Pro 高达版。
依据：官网 `/cn/ace3/specs`、`/cn/ace5/specs`、`/cn/ace5-pro/specs` 全 404；唯一可访问的初代
`/cn/ace/specs`「充电」段只有 `150W 超级闪充`，**无反向充电行**。已写入 `oneplus.ts` 文件头注释。

### 6.3 三条存疑的处理

| # | 事项 | 处理 |
|---|---|---|
| 1 | Reno14 Pro `bwl:50` | **已改 `null`** —— 官网 `.../reno14-pro/specs/`「快速充电」段只有 `80 W 超级闪充…`，无无线充电行。同条 `br` 也一并按铁律清为 `null`。 |
| 2 | A5 Pro 重量 194g | **已按官网改为 186g**，三围厚度同步改 7.67mm。官网原文：厚 `约 7.67 毫米（新年红，砂岩紫）/ 约 7.55 毫米（石英白，磐石黑）`，重量 `约 186 克（新年红，砂岩紫）/ 约 180 克（石英白，磐石黑）`，取覆盖两款配色的 186g / 7.67mm，两个值均写进注释。 |
| 3 | Find X8 / X8 Pro / Find N5 | **`br` 已清为 `null`** —— 官网参数页均不列反向充电（X8 / X8 Pro 只有 80W 有线 + 50W 无线；Find N5 只有 80W 有线 + 50W 无线），不因「硬件支持无线充电」推断填值。 |

另外顺带按同一铁律清除了两款已实证的：
- **OPPO K12 Plus** `br:'10W反向'` → `null`（官网只有 80W 超级闪充，无无线、无反向）；
- **OPPO Reno14 Pro** `br:'10W反向'` → `null`（同上）。

### 6.4 第二轮后仍存的 `br` 值（未取到官网页，未动）

| 机型 | 现值 | 状态 |
|---|---|---|
| 一加 10 Pro、一加 8 Pro | `10W反向` | 官网参数页未取到；两者硬件分别支持 50W / 30W 无线，建议下轮查 opposhop 商城页后决定 |
| OPPO Find X8s / X7 / X7 Ultra / X6 | `10W反向` | Find X6 Pro 官网确证 `支持 10 W 反向充电`，同代其余未逐页查 |
| OPPO Reno13 Pro / Reno12 Pro / Reno11 Pro / Reno10 Pro+ / Reno14 / K13 Turbo Pro / K12 | `10W反向` | 未逐页查，建议下轮按同一铁律批量清理 |
| OPPO Find N2 / N3 | `10W反向` | 未逐页查（N3 Flip / N2 Flip 已查证为 null） |

## 7. 第三轮：剩余 `'10W反向'` 全量逐页实证（2026-10-15）

原则：**每一款都真的打开官网页面看过**；页面 404 / 取不到 → **不判空**，单列「官网无一手来源，保留未核验」。

### 7.1 逐款结果表

| # | 机型 | 查证 URL | 官网充电段原文 | 结论 |
|---|---|---|---|---|
| 1 | OPPO Find X8s | `.../series-find-x/find-x8s/specs/` | `80 W 超级闪充…` / `50 W 无线闪充` / **`10 W 无线反向充电`** | **改值 → `10W无线反向`**（官网写了，只是写法要区分无线） |
| 2 | OPPO Find X7 Ultra | `.../series-find-x/find-x7-ultra/specs/` | `50 W 无线闪充，兼容 Qi 无线快充协议，支持 10 W 反向充电` | **保留 `10W反向`**（官网原文确证） |
| 3 | OPPO Find X7 | `.../series-find-x/find-x7/specs/` | `100 W 超级闪充。兼容 80 W…33 W，33 W UFCS，13.5 W PD`（无无线、无反向） | **判 null** |
| 4 | OPPO Find X6 | `.../series-find-x/find-x6/specs/` | `80 W 超级闪充。兼容 67 W…18 W PD` | **判 null** |
| 5 | OPPO Reno13 Pro | `.../series-reno/reno13-pro/specs/` | `80 W 超级闪充…` / `50 W 无线闪充`（无反向行） | **判 null** |
| 6 | OPPO Reno13 | `.../series-reno/reno13/specs/` | `80 W 超级闪充…33 W PPS，13.5 W PD` | **判 null** |
| 7 | OPPO Reno12 Pro | `.../series-reno/reno12-pro/specs/` | `80 W 超级闪充…PD（9V/1.5A）` | **判 null** |
| 8 | OPPO Reno12 | `.../series-reno/reno12/specs/` | `80 W 超级闪充…PD（9V/1.5A）` | **判 null** |
| 9 | OPPO Reno11 Pro | `.../series-reno/reno11-pro/specs/` | `80 W 超级闪充…UFCS（11V/3A）` | **判 null** |
| 10 | OPPO Reno10 Pro+ | `.../series-reno/reno10-pro-plus/specs/` | `长寿版 100 W 超级闪充。支持 SUPERVOOC 2.0…` | **判 null** |
| 11 | OPPO Reno14 | `.../series-reno/reno14/specs/` | `80 W 超级闪充，80 W 融合快充…33 W PPS，13.5 W PD` | **判 null** |
| 12 | OPPO K13 Turbo Pro | `.../series-k/k13-turbo-pro/specs/` | `最大支持 80 W 超级闪充…13.5 W PD，13.5 W QC` | **判 null** |
| 13 | OPPO K12 | `.../series-k/k12/specs/` | `100 W 超级闪充` | **判 null** |
| 14 | OPPO Find N2 | `.../series-find-n/find-n2/specs/` | `67 W 超级闪充。兼容 50 W，33 W，18 W PD，18 W QC` | **判 null** |
| 15 | OPPO Find N3 | `.../series-find-n/find-n3/specs/` | `67 W 超级闪充。兼容 50 W，33 W，18 W PD，18 W QC` | **判 null** |
| 16 | 一加 10 Pro | `https://www.oneplus.com/cn/10-pro/specs` | `有线快充 80W 超级闪充` / **`反向无线充电：支持`** / `无线快充 50W 无线闪充` | **改值 → `支持无线反向充电`**（官网只写「支持」不给瓦数，照抄原文，**不补 10W**） |
| 17 | 一加 8 Pro | `https://www.oneplus.com/cn/8-pro/specs` | `Warp 闪充 30T` / **`30W 无线充电，支持无线反向充电`** | **改值 → `支持无线反向充电`**（同上） |

（`...` = `https://www.oppo.com/cn/smartphones`）

### 7.2 统计

- **判 null：13 款**（Find X7、Find X6、Reno13 Pro、Reno13、Reno12 Pro、Reno12、Reno11 Pro、Reno10 Pro+、Reno14、K13 Turbo Pro、K12、Find N2、Find N3）
- **改成其他值：3 款**（Find X8s → `10W无线反向`；一加 10 Pro、一加 8 Pro → `支持无线反向充电`）
- **官网无一手来源、保留未核验：0 款** —— 本轮 17 款全部取到了官网页面，没有一例是靠推断或靠 404 判空的。
- 另有 **2 款经查证官网确证、原值正确、保持不动**：Find X7 Ultra（`支持 10 W 反向充电`）、Find X6 Pro（`兼容 Qi 无线快充协议，支持 10 W 反向充电`）。

### 7.3 清理后的 OPPO / 一加 `br` 全景（仅这些仍非空，全部有官网原文）

| 机型 | `br` | 官网原文 |
|---|---|---|
| OPPO Find X8 Ultra | `10W无线反向` | `10 W 无线反向充电` |
| OPPO Find X8s | `10W无线反向` | `10 W 无线反向充电` |
| OPPO Find X7 Ultra | `10W反向` | `支持 10 W 反向充电` |
| OPPO Find X6 Pro | `10W反向` | `兼容 Qi 无线快充协议，支持 10 W 反向充电` |
| 一加 13 | `10W无线反向 + 5W有线反向` | `无线反向充电：支持（最大功率 10W）` + `有线反向充电：支持（最大功率 5W）` |
| 一加 12 | `10W无线反向` | `无线反向充电：10W` |
| 一加 10 Pro | `支持无线反向充电` | `反向无线充电：支持`（无瓦数） |
| 一加 8 Pro | `支持无线反向充电` | `支持无线反向充电`（无瓦数） |

其余 OPPO / 一加机型 `br` 全部为 `null`（官网未公布）。`others.ts` / `realme.ts` 未触碰（minor-brands 批次负责）。

## 8. 交付自检

- `npx tsc -p tsconfig.app.json --noEmit` → **0 错误** ✅
- `node scripts/_qa-validate.mjs` → 第二轮交付时 **545/644 合规（84.63%）、必填缺失 140**，
  与上一轮持平，**本轮（nit 降级 / br 判空 / bwl 判空 / 重量订正）未引入任何新的必填缺失** ✅
  （基线 536/644、157；同批华为/vivo 也在改，本轮 OPPO/一加方向上是净减少）
- OPPO / 一加 在本轮后**已无 `screen.size`、`bc`、`bdim`、`wt` 类必填缺失**；
  剩余 OPPO 违规项为 `launchPrice` 为空（Find X9 Pro / X9 Ultra，属定价域，非本轮范围）
  与 `releaseDate` 格式（Find X9s Pro `2026-04-21`，前批次录入），均**非本轮引入**。
- 两个文件头已追加「数据来源与口径」注释；关键机型行上方补充了逐条来源说明。

---

## 9. 价格补录（2026-10-15，第四轮）

### 背景

全库价格扫描发现 OPPO 两款在售旗舰 `launchPrice` 与 `currentPrice` 同时为 `null`，界面显示「暂无报价」：

| id | 机型 | 补录前 |
|---|---|---|
| `oppo-find-x9-pro` | OPPO Find X9 Pro | `lp:null, cp:null` |
| `oppo-find-x9-ultra` | OPPO Find X9 Ultra | `lp:null, cp:null` |

补录口径（按 team-lead 指令）：**只填 `cp`（OPPO 官网 / OPPO 商城在售价），取最低配（12GB+256GB 官方标配）**；
不用任何第三方报价（含 JD 自营以外的店铺价）；官网查不到在售价才退而填 `lp`。

### 抓取路径（可复用）

1. OPPO 官网产品页 HTML 里带 `opposhop.cn/cn/web/products/<id>.html?utm_source=guanwang` 的「立即购买」链接 → 拿到商城 SPU/SKU id。
   - `find-x9-pro/` → `36880`（默认选中 16GB+512GB）
   - `find-x9-ultra/` → `39826` / `39829`
   - `find-x9/` → `36846`；`find-x10/` → `45215`；`find-x10-pro-max/` → `45203`
2. 商城商详页是 Nuxt SSR：HTML 内 `window.__NUXT__=` 后面是 `(function(...){...}(...))`，
   用 `node` 直接 `eval` 即可还原 JSON；价格字段在 `data[0].resData.priceTag`：
   - `price` = 商城价（页面标签「商城价」）→ **本项目 `cp` 采用此口径**
   - `buyPrice` / `prefix:"到手价"` = 券后到手价（随活动浮动，不采用）
3. 同 SPU 的 `attributes.configs` + `skuItems` 给出「颜色 × 版本(12GB+256GB…) × 类型」→ `skuId` 映射，
   用最低配 SKU 单独开一次商详页即可拿到该配置的准确价。

### 补录结果

| id | 字段 | 值 | 配置 | 来源 URL | 原文/口径 |
|---|---|---|---|---|---|
| `oppo-find-x9-pro` | `cp` | **5599** | 12GB+256GB 官方标配 | `https://www.opposhop.cn/cn/web/products/36873.html`（绒砂钛；追光红 36872 / 霜白 36874 同价） | `priceTag.price="5599"`，`goodsDetailPricePrefix="商城价"`，`buyPrice="5039"（到手价，未采用）` |
| `oppo-find-x9-ultra` | `cp` | **7499** | 12GB+256GB 官方标配 | `https://www.opposhop.cn/cn/web/products/39821.html`（大地苔原；极地冰川 39822 同价） | `priceTag.price="7499"`，`buyPrice="6999"（到手价，未采用）` |
| `oppo-find-x9-pro` | `lp` | 保持 `null` | — | — | OPPO 官网/商城均未见首发价；发布会价仅见媒体（荆楚网、ZOL：12+256 = 5299），属第三方来源，按「不用第三方报价」规则不填 |
| `oppo-find-x9-ultra` | `lp` | 保持 `null` | — | — | 同上，官网无首发价公示 |

### 顺手核对：Find X9 标准版 / Find X10 系列

| id | 库内值 | 商城在售价（最低配 12GB+256GB） | 结论 |
|---|---|---|---|
| `oppo-find-x9` | `lp:4399, cp:4399` | **4599**（`https://www.opposhop.cn/cn/web/products/36847.html`，绒光钛；36848 霜白 / 36849 雾黑同价；到手价 4039） | **不一致，未改，待裁决**（见下） |
| `oppo-find-x10` | `lp:5499, cp:5499` | 5499（`.../products/45210.html`，清橙 12GB+256GB） | ✅ 一致 |
| `oppo-find-x10-pro-max` | `lp:6799, cp:6799` | 6799（`.../products/45199.html`，浅钛 12GB+256GB） | ✅ 一致 |

⚠️ **Find X9 标准版待裁决项**：库内 4399 恰为 2025-10-16 发布会公布的 12GB+256GB 首发价（媒体口径），
而 OPPO 商城当前「商城价」为 4599（同系列其它配置也普遍比发布会价高 200–300：
12+512 发布会 4999 → 商城 5299；16+256 发布会 4699 → 商城 4999；16+512 发布会 5299 → 商城 5599）。
即**「发布会首发价」与「商城标价」两个口径本身就差 200–300**，不是录入错误。
本轮未擅自改动（`cp` 若改 4599 会出现 `cp > lp` 的「涨价」显示），建议 team-lead 统一裁决：
(a) `cp` 全库统一用商城标价 → Find X9 `cp` 改 4599；或 (b) `cp` 用首发价/到手价口径 → 则本次补录的 5599/7499 需同步改。

### 交付自检

- `npx tsc -p tsconfig.app.json --noEmit` → **0 错误** ✅
- `node scripts/_qa-validate.mjs` → **558/644 合规（86.65%）、必填缺失 62**（全库，含其它同事并行修改）；
  OPPO / 一加 侧无新增违规，Find X9 Pro / X9 Ultra 仅剩 `launchPrice` 为空（已按规则留空并说明）✅
- 只改 `src/data/phones/oppo.ts` 两行数值 + 两行来源注释，未触碰其它品牌文件，未提交 git。

---

## 9.1 价格口径裁决 + 12+256 复核（2026-10-15 追加）

### team-lead 裁决：`cp` 全库统一用「商城标价（在售价）」，不用券后到手价

- `cp` 语义 =「官网现价」= 用户现在去官网买要付的钱 → **商城标价**；发布会价属于 `lp`，塞进 `cp` 是字段语义错位。
- 与 Find X10 系列现有口径一致（5499 / 6799 均等于商城价），不引入第二套标准。
- 券后到手价（X9 Pro 5039 / X9 Ultra 6999）依赖领券、随时变化、不可复现，**不采用**。

### 12+256 配置再复核（team-lead 指出的 +200 不一致点）

按「颜色 × 版本 × 类型 → skuId」映射，把 Find X9 的 **12GB+256GB 官方标配** 四个配色全部单独开页取价：

| skuId | 页面 SKU 全名 | 商城价 | 到手价 |
|---|---|---|---|
| 36846 | OPPO Find X9 **追光红** 12GB+256GB 官方标配（缺货） | 4599 | 4039 |
| 36847 | OPPO Find X9 **绒光钛** 12GB+256GB 官方标配 | 4599 | 4039 |
| 36848 | OPPO Find X9 **霜白** 12GB+256GB 官方标配 | 4599 | 4039 |
| 36849 | OPPO Find X9 **雾黑** 12GB+256GB 官方标配 | 4599 | 4039 |

四配色同价 **4599**，非单配色/单活动临时价。**结论：商城 12+256 标价确为 4599（不是 4699）**，
与发布会首发价 4399 的 +200 是真实差值（其它配置是 +300，12+256 这档就是 +200，不是配置错位）。
也没有 8GB+256GB 这类更低配置——12GB+256GB 就是 Find X9 的最低配。

Find X9 完整商城价阶梯（供后续核对）：

| 配置 | 发布会首发价 | 商城标价 | 差值 | 商城 skuId |
|---|---|---|---|---|
| 12GB+256GB | 4399 | **4599** | +200 | 36846~36849 |
| 16GB+256GB | 4699 | 4999 | +300 | 36850 / 36851 |
| 12GB+512GB | 4999 | 5299 | +300 | 36852~36855 |
| 16GB+512GB | 5299 | 5599 | +300 | 36856~36859 |
| 16GB+1TB | 5799 | 6299（缺货） | +500 | 36860~36862 |

### 落值

| id | 改动 | 说明 |
|---|---|---|
| `oppo-find-x9` | `cp: 4399 → 4599`；`lp` 保持 4399 | lp 4399 本就是首发价，放 `lp` 正确；cp 改商城标价 4599 |
| `oppo-find-x9-pro` | `cp` 保持 5599；`lp` 保持 null | 商城标价口径不变 |
| `oppo-find-x9-ultra` | `cp` 保持 7499；`lp` 保持 null | 同上 |

### X9 Pro / X9 Ultra 的 `lp`：未找到 OPPO 官方出处，继续留空

已尝试的官方渠道，均无首发价公示：

- OPPO 官网发布会页 `https://www.oppo.com/cn/events/find-x9-series-launch/`（200，标题
  「【OPPO Find X9 系列 暨 智能生态旗舰新品发布会】…」）——只有直播/预约信息，**全文无任何价格**；
- OPPO 官网产品页 / 规格参数页：不含价格字段；
- 商城商详页 `priceTag.originalPrice` 对 X9 Pro / X9 Ultra 均为 `null`（没有划线原价）；
- `bbs.oppo.com` 官方帖路径 404，未取到。

发布会价只在媒体见到（荆楚网、ZOL：X9 12+256 = 4399 / X9 Pro 12+256 = 5299），
按「不采信第三方报价」规则，**`lp` 保持 null**。

### 🔒 口径规律（影响后续所有 OPPO 价格录入，已同步写入 `oppo.ts` 文件头注释）

> **OPPO 商城标价整体高于发布会首发价 200~300 元**（Find X9：12+256 +200，16+256 / 12+512 / 16+512 各 +300）。
> 因此 **`cp > lp` 是 OPPO 的真实情况，不是录错，不要改回成 `lp`。**
> `cp` 一律取商城标价（`priceTag.price`），不取 `buyPrice`（到手价）。

### 自检

- `npx tsc -p tsconfig.app.json --noEmit` → **0 错误** ✅
- `node scripts/_qa-validate.mjs` → 558/644 合规（86.65%）、必填缺失 62；OPPO 侧无新增违规，
  仅 Find X9 Pro / X9 Ultra 的 `launchPrice` 为空（无官方出处，按规则留空）✅
- 改动：`src/data/phones/oppo.ts`（Find X9 一行数值 + 三行来源注释 + 文件头新增「价格口径」段），未提交 git。
