# 缺失机型调研报告（2026-10）

> 调研时间：2026-10-14 ｜ 当前代码库共收录 **455 款机型**，分布在 16 个品牌文件。
> 说明：本文件只做调研产出，不修改任何代码。所有新增机型数据均附来源 URL，未查到的标注「未查到，待确认」。

## 本次交付总览（给工程师 / 架构师）

| 项 | 数量 |
|---|---|
| B 段条目总数 | **74** |
| 其中可直接录入（有完整参数块） | **72** |
| 明确「不收录 / 未查到」占位条目 | 2（#33 REDMI K90 至尊版、#74 平板占位） |
| 手机条目 | **63**（B.1~B.9） |
| 平板条目 | **113**（见独立文件 `research/tablets.md`；本文件 B.10 的 10 条仅作交叉索引） |
| 折叠机（已补 `ff` + `fsz` + `fres`） | **8** |
| 含「潜望长焦」标签的条目 | 20 |

**`ff` 形态取值说明（新增字段）**

| `ff` | 含义 | 本批命中 |
|---|---|---|
| `bar` | 直板 | 54 |
| `fold-h` | 横折叠（大折叠 / 书本式内折） | 6 |
| **`fold-mid`** | **中折叠（小米 18 Fold，展开 √2:1、合上护照形）** | 1 |
| `fold-v` | 竖折叠（小折叠） | 1 |
| `fold-wide` | 阔折叠 | 0（本批未检索到已发布的阔折叠新机） |
| `fold-triple` | 三折叠 | 0（本批未检索到已发布的三折叠新机） |
| **`slate`** | **平板（纯平板，不可拆卸键盘）** | 10 |

> ✅ 架构师 2026-10-14 拍板（本文件已按此改完）：
> 1. 形态 `ff` 与品类 `cat` 拆成两个字段 → 平板条目统一写 **`cat: 'tablet'` + `ff: 'slate'`**（两条都要写，缺 `cat` 会被 `validate:data` 报错）。
> 2. 小米 18 Fold 单列 **`ff: 'fold-mid'`**，不归 `fold-h` 也不归 `fold-wide`（`fold-wide` 已被 Pura X 的官方「阔折叠」定义占用）。
> 3. 带可拆卸键盘的二合一（Surface Pro / ThinkPad X12 等）将来补录时用 `cat: 'tablet'` + `ff: 'detachable'`。

**折叠机外屏字段 `fsz` / `fres`（均为官方规格页核实）**

| 机型 | 内屏 `sz` | 内屏 `res` | 外屏 `fsz` | 外屏 `fres` |
|---|---|---|---|---|
| iPhone Duo | 7.6" | 1878x2670 | 5.4" | 1398x2034 |
| 荣耀 Magic V6 | 7.95" | 2352x2172 | 6.52" | 2420x1080 |
| OPPO Find N6 | 8.12" | 2480x2248 | 6.62" | 2616x1140 |
| 小米 18 Fold | 7.58" | 2364x1672 | 5.38" | 1712x1168 |
| 华为 Mate X7 | 8" | 2416x2210 | 6.49" | 2444x1080 |
| 三星 Z Fold8 | 7.6" | 1848x2448 | 5.5" | 1248x1972 |
| 三星 Z Fold8 Ultra | 8" | 2504x2256 | 6.5" | 1080x2520 |
| 三星 Z Flip8 | 6.9" | 1080x2520 | 4.1" | 948x1048 |

**架构师点名机型的核实结论**

| 点名机型 | 结论 |
|---|---|
| iPhone 18 Pro / 18 Pro Max | ✅ 已收录（#1 / #2），2026-09-10 发布、09-18 发售 |
| iPhone 18 标准版 | ❌ **未发布**。苹果 2026-09-10 发布会官宣推迟到 **2027 年春季**，不收录 |
| iPhone Air 2 | ❌ **未发布**。与 iPhone 18 / 18e 一同推迟到 **2027 年春季**，不收录 |
| 荣耀 Magic9 全系列 | ✅ 已收录 3 款（#4 Magic9 / #5 Magic9 Pro Max / #6 Magic9 超能版）。**注意：官方没有「Magic9 Pro」和「Magic9 至臻版」命名**，2026-09-28 发布的就是这三款 |
| OPPO Find X10 / Find X10 Pro Max | ✅ 已收录（#19 / #20），2026-09-22 发布、09-24 开售 |
| OPPO Find X10 Pro | ❌ **未发布**。国行 Find X10 系列只有 X10 / X10 Pro Max / X10 E 三款；X10 Pro 多见于海外站，预计 2026-11 才上市，不收录 |

---

## A. 已有机型清单（从 src/data/phones/*.ts 读出）

| 品牌 | 文件 | 机型数 | 最新机型（Top 5） |
|---|---|---:|---|
| 荣耀 | `honor.ts` | 35 | 荣耀 400 Pro（2025-06）、荣耀 400（2025-06）、荣耀 GT Pro（2025-04）、荣耀 Power（2025-04）、荣耀 Magic7 RSR 保时捷设计（2024-12） |
| vivo | `vivo.ts` | 35 | vivo X Fold5（2025-06）、vivo X200 FE（2025-06）、vivo S30 Pro mini（2025-05）、vivo S30（2025-05）、vivo X200 Ultra（2025-04） |
| 华为 | `huawei.ts` | 34 | 华为 Pura 80（2025-07）、华为 Pura 80 Ultra（2025-06）、华为 Pura 80 Pro（2025-06）、华为 Mate 70 Pro+（2024-11）、华为 Mate 70 Pro（2024-11） |
| realme | `realme.ts` | 32 | realme 15 Pro（2025-07）、realme GT7 阿斯顿马丁F1限量版（2025-05）、realme GT7（2025-04）、realme 14x（2025-04）、realme V70（2025-03） |
| 三星 | `samsung.ts` | 32 | 三星 Galaxy S25 Edge（2025-05）、三星 Galaxy A56（2025-03）、三星 Galaxy S25 Ultra（2025-02）、三星 Galaxy S25+（2025-02）、三星 Galaxy S25（2025-02） |
| 小米 | `xiaomi.ts` | 32 | 小米 MIX Flip 2（2025-06）、小米 Civi 5 Pro（2025-05）、小米 15 Ultra（2025-03）、小米 15 Pro（2024-10）、小米 15（2024-10） |
| Google | `others.ts` | 31 | Google Pixel 10 Pro XL（2025-08）、Google Pixel 10 Pro（2025-08）、Google Pixel 10（2025-08）、Nothing Phone (3a) Pro（2025-03）、Nothing Phone (3a)（2025-03） |
| Redmi | `redmi.ts` | 31 | Redmi Note 15 Pro+（2025-08）、Redmi K80 至尊版（2025-06）、Redmi Turbo 4 Pro（2025-04）、Redmi Turbo 4（2025-01）、Redmi 14C（2025-01） |
| Apple | `apple.ts` | 29 | iPhone 17 Pro Max（2025-09）、iPhone 17 Pro（2025-09）、iPhone 17（2025-09）、iPhone Air（2025-09）、iPhone 16e（2025-02） |
| OPPO | `oppo.ts` | 29 | OPPO K13 Turbo Pro（2025-07）、OPPO Reno14 Pro（2025-05）、OPPO Reno14（2025-05）、OPPO Find X8 Ultra（2025-04）、OPPO Find X8s（2025-04） |
| iQOO | `iqoo.ts` | 28 | iQOO Neo10 Pro（2025-05）、iQOO Neo10（2025-05）、iQOO Z10 Turbo Pro（2025-04）、iQOO Z10 Turbo（2025-04）、iQOO 13 传奇典藏版（2025-01） |
| 摩托罗拉 | `motorola.ts` | 26 | moto edge 60 Pro（2025-04）、moto razr 60 Ultra（2025-04）、moto edge 60（2025-04）、moto G75（2024-10）、moto S50（2024-09） |
| 一加 | `oneplus.ts` | 23 | 一加 Ace 5 至尊版（2025-05）、一加 13T（2025-04）、一加 Ace 5 Pro（2024-12）、一加 Ace 5（2024-12）、一加 13（2024-10） |
| 魅族 | `meizu.ts` | 21 | 魅族 22（2025-09）、魅族 Note 16 Pro（2025-05）、魅族 Note 16（2025-05）、魅族 mblu 22 Pro（2025-03）、mblu 22（2025-03） |
| 努比亚 | `nubia.ts` | 21 | 红魔 10 Ultra（2025-06）、努比亚 Music 2（2025-04）、努比亚 Z70S Ultra（2025-04）、努比亚 Flip 2（2025-03）、红魔 10 Pro（2024-11） |
| 索尼 | `sony.ts` | 16 | 索尼 Xperia 1 VII（2025-06）、索尼 Xperia 1 VI（2024-05）、索尼 Xperia 10 VI（2024-05）、索尼 Xperia 5 V（2023-09）、索尼 Xperia 1 V（2023-06） |
| **合计** | — | **455** | — |

### A.1 各品牌完整机型清单（名称 + 发布日期，按时间倒序）

#### 荣耀（35 款，`honor.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| 荣耀 400 Pro | 2025-06 | `honor-400-pro` |
| 荣耀 400 | 2025-06 | `honor-400` |
| 荣耀 GT Pro | 2025-04 | `honor-gt-pro` |
| 荣耀 Power | 2025-04 | `honor-power` |
| 荣耀 Magic7 RSR 保时捷设计 | 2024-12 | `honor-magic7-rsr` |
| 荣耀 300 Pro | 2024-12 | `honor-300-pro` |
| 荣耀 300 | 2024-12 | `honor-300` |
| 荣耀 GT | 2024-12 | `honor-gt` |
| 荣耀 Magic7 Pro | 2024-10 | `honor-magic7-pro` |
| 荣耀 Magic7 | 2024-10 | `honor-magic7` |
| 荣耀 X60 Pro | 2024-10 | `honor-x60-pro` |
| 荣耀 X60 | 2024-10 | `honor-x60` |
| 荣耀 Magic V3 | 2024-07 | `honor-magic-v3` |
| 荣耀 Magic Vs3 | 2024-07 | `honor-magic-vs3` |
| 荣耀 Magic V Flip | 2024-06 | `honor-magic-vflip` |
| 荣耀 200 Pro | 2024-05 | `honor-200-pro` |
| 荣耀 200 | 2024-05 | `honor-200` |
| 荣耀 Magic6 RSR 保时捷设计 | 2024-03 | `honor-magic6-rsr` |
| 荣耀 Magic6 至臻版 | 2024-03 | `honor-magic6-ultimate` |
| 荣耀 Magic6 Pro | 2024-01 | `honor-magic6-pro` |
| 荣耀 Magic6 | 2024-01 | `honor-magic6` |
| 荣耀 100 Pro | 2023-11 | `honor-100-pro` |
| 荣耀 100 | 2023-11 | `honor-100` |
| 荣耀 Magic Vs2 | 2023-10 | `honor-magic-vs2` |
| 荣耀 Magic V2 | 2023-07 | `honor-magic-v2` |
| 荣耀 X50 | 2023-07 | `honor-x50` |
| 荣耀 90 Pro | 2023-05 | `honor-90-pro` |
| 荣耀 Magic5 Pro | 2023-03 | `honor-magic5-pro` |
| 荣耀 Magic5 | 2023-03 | `honor-magic5` |
| 荣耀 Magic Vs | 2022-11 | `honor-magic-vs` |
| 荣耀 80 Pro | 2022-11 | `honor-80-pro` |
| 荣耀 X40 | 2022-09 | `honor-x40` |
| 荣耀 Magic4 Pro | 2022-03 | `honor-magic4-pro` |
| 荣耀 Magic4 | 2022-03 | `honor-magic4` |
| 荣耀 Magic3 至臻版 | 2021-08 | `honor-magic3-pro` |

#### vivo（35 款，`vivo.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| vivo X Fold5 | 2025-06 | `vivo-x-fold5` |
| vivo X200 FE | 2025-06 | `vivo-x200-fe` |
| vivo S30 Pro mini | 2025-05 | `vivo-s30-pro-mini` |
| vivo S30 | 2025-05 | `vivo-s30` |
| vivo X200 Ultra | 2025-04 | `vivo-x200-ultra` |
| vivo X200s | 2025-04 | `vivo-x200s` |
| vivo S20 Pro | 2024-11 | `vivo-s20-pro` |
| vivo S20 | 2024-11 | `vivo-s20` |
| vivo X200 Pro | 2024-10 | `vivo-x200-pro` |
| vivo X200 Pro mini | 2024-10 | `vivo-x200-pro-mini` |
| vivo X200 | 2024-10 | `vivo-x200` |
| vivo Y300 Pro | 2024-09 | `vivo-y300-pro` |
| vivo X100 Ultra | 2024-05 | `vivo-x100-ultra` |
| vivo X100s | 2024-05 | `vivo-x100s` |
| vivo S19 Pro | 2024-05 | `vivo-s19-pro` |
| vivo S19 | 2024-05 | `vivo-s19` |
| vivo X Fold3 Pro | 2024-03 | `vivo-x-fold3-pro` |
| vivo X Fold3 | 2024-03 | `vivo-x-fold3` |
| vivo Y200 | 2024-01 | `vivo-y200` |
| vivo S18 Pro | 2023-12 | `vivo-s18-pro` |
| vivo S18 | 2023-12 | `vivo-s18` |
| vivo X100 Pro | 2023-11 | `vivo-x100-pro` |
| vivo X100 | 2023-11 | `vivo-x100` |
| vivo Y100 | 2023-10 | `vivo-y100` |
| vivo S17 Pro | 2023-05 | `vivo-s17-pro` |
| vivo X Flip | 2023-04 | `vivo-x-flip` |
| vivo X Fold2 | 2023-04 | `vivo-x-fold2` |
| vivo X90 Pro+ | 2022-11 | `vivo-x90-pro-plus` |
| vivo X90 Pro | 2022-11 | `vivo-x90-pro` |
| vivo X90 | 2022-11 | `vivo-x90` |
| vivo X Fold+ | 2022-09 | `vivo-x-fold-plus` |
| vivo Y77 | 2022-07 | `vivo-y77` |
| vivo X80 Pro | 2022-04 | `vivo-x80-pro` |
| vivo X80 | 2022-04 | `vivo-x80` |
| vivo X Note | 2022-04 | `vivo-x-note` |

#### 华为（34 款，`huawei.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| 华为 Pura 80 | 2025-07 | `huawei-pura-80` |
| 华为 Pura 80 Ultra | 2025-06 | `huawei-pura-80-ultra` |
| 华为 Pura 80 Pro | 2025-06 | `huawei-pura-80-pro` |
| 华为 Mate 70 Pro+ | 2024-11 | `huawei-mate-70-pro-plus` |
| 华为 Mate 70 Pro | 2024-11 | `huawei-mate-70-pro` |
| 华为 Mate 70 | 2024-11 | `huawei-mate-70` |
| 华为 Mate 70 RS 非凡大师 | 2024-11 | `huawei-mate-70-rs` |
| 华为 Mate X6 | 2024-11 | `huawei-mate-x6` |
| 华为 nova 13 Pro | 2024-10 | `huawei-nova-13-pro` |
| 华为 nova 13 | 2024-10 | `huawei-nova-13` |
| 华为 Mate XT 非凡大师 | 2024-09 | `huawei-mate-xt` |
| 华为 畅享 70 | 2024-05 | `huawei-enjoy-70` |
| 华为 Pura 70 Ultra | 2024-04 | `huawei-pura-70-ultra` |
| 华为 Pura 70 Pro+ | 2024-04 | `huawei-pura-70-pro-plus` |
| 华为 Pura 70 Pro | 2024-04 | `huawei-pura-70-pro` |
| 华为 Pura 70 | 2024-04 | `huawei-pura-70` |
| 华为 Pocket 2 | 2024-02 | `huawei-pocket-2` |
| 华为 nova 12 Pro | 2023-12 | `huawei-nova-12-pro` |
| 华为 nova 12 | 2023-12 | `huawei-nova-12` |
| 华为 Mate X5 | 2023-09 | `huawei-mate-x5` |
| 华为 Mate 60 Pro+ | 2023-09 | `huawei-mate-60-pro-plus` |
| 华为 Mate 60 RS 非凡大师 | 2023-09 | `huawei-mate-60-rs` |
| 华为 Mate 60 Pro | 2023-08 | `huawei-mate-60-pro` |
| 华为 Mate 60 | 2023-08 | `huawei-mate-60` |
| 华为 Hi nova 11 | 2023-07 | `huawei-hi-nova-11` |
| 华为 Mate X3 | 2023-04 | `huawei-mate-x3` |
| 华为 nova 11 | 2023-04 | `huawei-nova-11` |
| 华为 P60 Pro | 2023-03 | `huawei-p60-pro` |
| 华为 P60 | 2023-03 | `huawei-p60` |
| 华为 P60 Art | 2023-03 | `huawei-p60-art` |
| 华为 Mate 50 Pro | 2022-09 | `huawei-mate-50-pro` |
| 华为 Mate 50 | 2022-09 | `huawei-mate-50` |
| 华为 P50 Pocket | 2021-12 | `huawei-p50-pocket` |
| 华为 P50 Pro | 2021-07 | `huawei-p50-pro` |

#### realme（32 款，`realme.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| realme 15 Pro | 2025-07 | `realme-15-pro` |
| realme GT7 阿斯顿马丁F1限量版 | 2025-05 | `realme-gt7-dream` |
| realme GT7 | 2025-04 | `realme-gt7` |
| realme 14x | 2025-04 | `realme-14x` |
| realme V70 | 2025-03 | `realme-v70` |
| realme GT7 Pro 竞速版 | 2025-02 | `realme-gt7-pro-racing` |
| realme 14 Pro+ | 2025-01 | `realme-14-pro-plus` |
| realme 14 Pro | 2025-01 | `realme-14-pro` |
| realme Neo7 | 2025-01 | `realme-neo7` |
| realme GT7 Pro | 2024-11 | `realme-gt7-pro` |
| realme V60 Pro | 2024-11 | `realme-v60-pro` |
| realme 13 Pro+ | 2024-07 | `realme-13-pro-plus` |
| realme 13 Pro | 2024-07 | `realme-13-pro` |
| realme GT6 | 2024-06 | `realme-gt6` |
| realme GT Neo6 | 2024-05 | `realme-gt-neo6` |
| realme GT Neo6 SE | 2024-04 | `realme-gt-neo6-se` |
| realme 12x | 2024-04 | `realme-12x` |
| realme 12 Pro+ | 2024-01 | `realme-12-pro-plus` |
| realme 12 Pro | 2024-01 | `realme-12-pro` |
| realme GT5 Pro | 2023-12 | `realme-gt5-pro` |
| realme V50 | 2023-12 | `realme-v50` |
| realme GT5 | 2023-08 | `realme-gt5` |
| realme 11 Pro+ | 2023-05 | `realme-11-pro-plus` |
| realme 11 Pro | 2023-05 | `realme-11-pro` |
| realme GT Neo5 SE | 2023-04 | `realme-gt-neo5-se` |
| realme GT Neo5 | 2023-02 | `realme-gt-neo5` |
| realme GT Neo5 240W版 | 2023-02 | `realme-gt-neo5-240w` |
| realme 10 Pro+ | 2022-11 | `realme-10-pro-plus` |
| realme GT Neo3 | 2022-03 | `realme-gt-neo3` |
| realme GT2 Pro | 2022-01 | `realme-gt2-pro` |
| realme GT2 | 2022-01 | `realme-gt2` |
| realme Q3 Pro | 2021-04 | `realme-q3-pro` |

#### 三星（32 款，`samsung.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| 三星 Galaxy S25 Edge | 2025-05 | `samsung-galaxy-s25-edge` |
| 三星 Galaxy A56 | 2025-03 | `samsung-galaxy-a56` |
| 三星 Galaxy S25 Ultra | 2025-02 | `samsung-galaxy-s25-ultra` |
| 三星 Galaxy S25+ | 2025-02 | `samsung-galaxy-s25-plus` |
| 三星 Galaxy S25 | 2025-02 | `samsung-galaxy-s25` |
| 三星 Galaxy S24 FE | 2024-10 | `samsung-galaxy-s24-fe` |
| 三星 Galaxy Z Fold6 | 2024-07 | `samsung-galaxy-z-fold6` |
| 三星 Galaxy Z Flip6 | 2024-07 | `samsung-galaxy-z-flip6` |
| 三星 Galaxy M55 | 2024-04 | `samsung-galaxy-m55` |
| 三星 Galaxy A55 | 2024-03 | `samsung-galaxy-a55` |
| 三星 Galaxy A35 | 2024-03 | `samsung-galaxy-a35` |
| 三星 Galaxy S24 Ultra | 2024-01 | `samsung-galaxy-s24-ultra` |
| 三星 Galaxy S24+ | 2024-01 | `samsung-galaxy-s24-plus` |
| 三星 Galaxy S24 | 2024-01 | `samsung-galaxy-s24` |
| 三星 Galaxy A15 | 2024-01 | `samsung-galaxy-a15` |
| 三星 Galaxy S23 FE | 2023-10 | `samsung-galaxy-s23-fe` |
| 三星 Galaxy Z Fold5 | 2023-08 | `samsung-galaxy-z-fold5` |
| 三星 Galaxy Z Flip5 | 2023-08 | `samsung-galaxy-z-flip5` |
| 三星 Galaxy A54 | 2023-03 | `samsung-galaxy-a54` |
| 三星 Galaxy S23 Ultra | 2023-02 | `samsung-galaxy-s23-ultra` |
| 三星 Galaxy S23+ | 2023-02 | `samsung-galaxy-s23-plus` |
| 三星 Galaxy S23 | 2023-02 | `samsung-galaxy-s23` |
| 三星 Galaxy Z Fold4 | 2022-08 | `samsung-galaxy-z-fold4` |
| 三星 Galaxy Z Flip4 | 2022-08 | `samsung-galaxy-z-flip4` |
| 三星 Galaxy S22 Ultra | 2022-02 | `samsung-galaxy-s22-ultra` |
| 三星 Galaxy S22 | 2022-02 | `samsung-galaxy-s22` |
| 三星 Galaxy S21 FE | 2022-01 | `samsung-galaxy-s21-fe` |
| 三星 Galaxy Z Fold3 | 2021-08 | `samsung-galaxy-z-fold3` |
| 三星 Galaxy Z Flip3 | 2021-08 | `samsung-galaxy-z-flip3` |
| 三星 Galaxy S21 Ultra | 2021-01 | `samsung-galaxy-s21-ultra` |
| 三星 Galaxy S21 | 2021-01 | `samsung-galaxy-s21` |
| 三星 Galaxy S20 Ultra | 2020-03 | `samsung-galaxy-s20-ultra` |

#### 小米（32 款，`xiaomi.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| 小米 MIX Flip 2 | 2025-06 | `xiaomi-mix-flip-2` |
| 小米 Civi 5 Pro | 2025-05 | `xiaomi-civi-5-pro` |
| 小米 15 Ultra | 2025-03 | `xiaomi-15-ultra` |
| 小米 15 Pro | 2024-10 | `xiaomi-15-pro` |
| 小米 15 | 2024-10 | `xiaomi-15` |
| 小米 MIX Fold 4 | 2024-07 | `xiaomi-mix-fold-4` |
| 小米 MIX Flip | 2024-07 | `xiaomi-mix-flip` |
| 小米 Civi 4 Pro | 2024-03 | `xiaomi-civi-4-pro` |
| 小米 14 Ultra | 2024-02 | `xiaomi-14-ultra` |
| 小米 14 Pro | 2023-10 | `xiaomi-14-pro` |
| 小米 14 | 2023-10 | `xiaomi-14` |
| 小米 MIX Fold 3 | 2023-08 | `xiaomi-mix-fold-3` |
| 小米 Civi 3 | 2023-05 | `xiaomi-civi-3` |
| 小米 13 Ultra | 2023-04 | `xiaomi-13-ultra` |
| 小米 13 Pro | 2022-12 | `xiaomi-13-pro` |
| 小米 13 | 2022-12 | `xiaomi-13` |
| 小米 Civi 2 | 2022-09 | `xiaomi-civi-2` |
| 小米 MIX Fold 2 | 2022-08 | `xiaomi-mix-fold-2` |
| 小米 12S Ultra | 2022-07 | `xiaomi-12s-ultra` |
| 小米 12S Pro | 2022-07 | `xiaomi-12s-pro` |
| 小米 12S | 2022-07 | `xiaomi-12s` |
| 小米 12 Pro | 2021-12 | `xiaomi-12-pro` |
| 小米 12 | 2021-12 | `xiaomi-12` |
| 小米 12X | 2021-12 | `xiaomi-12x` |
| 小米 Civi | 2021-09 | `xiaomi-civi` |
| 小米 MIX 4 | 2021-08 | `xiaomi-mix-4` |
| 小米 11 青春版 | 2021-04 | `xiaomi-11-youth` |
| 小米 11 Ultra | 2021-03 | `xiaomi-11-ultra` |
| 小米 11 Pro | 2021-03 | `xiaomi-11-pro` |
| 小米 11 | 2021-01 | `xiaomi-11` |
| 小米 10 Pro | 2020-02 | `xiaomi-10-pro` |
| 小米 10 | 2020-02 | `xiaomi-10` |

#### Google（31 款，`others.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| Google Pixel 10 Pro XL | 2025-08 | `google-pixel-10-pro-xl` |
| Google Pixel 10 Pro | 2025-08 | `google-pixel-10-pro` |
| Google Pixel 10 | 2025-08 | `google-pixel-10` |
| Nothing Phone (3a) Pro | 2025-03 | `nothing-phone-3a-pro` |
| Nothing Phone (3a) | 2025-03 | `nothing-phone-3a` |
| 中兴 Axon 60 Ultra | 2025-01 | `zte-nubia-z60-ultra-lead` |
| ROG Phone 9 Pro | 2024-11 | `asus-rog-phone-9-pro` |
| 夏普 AQUOS R9 Pro | 2024-11 | `sharp-aquos-r9-pro` |
| Google Pixel 9 Pro XL | 2024-08 | `google-pixel-9-pro-xl` |
| Google Pixel 9 Pro | 2024-08 | `google-pixel-9-pro` |
| Google Pixel 9 | 2024-08 | `google-pixel-9` |
| 传音 Camon 30 Pro | 2024-04 | `tecno-camon-30-pro` |
| Nothing Phone (2a) | 2024-03 | `nothing-phone-2a` |
| 华硕 Zenfone 11 Ultra | 2024-03 | `asus-zenfone-11-ultra` |
| 中兴 Axon 50 | 2024-01 | `zte-axon-50` |
| ROG Phone 8 Pro | 2024-01 | `asus-rog-phone-8-pro` |
| 8848 钛金手机 M6 | 2023-11 | `8848-titanium-m6` |
| Google Pixel 8 Pro | 2023-10 | `google-pixel-8-pro` |
| Google Pixel 8 | 2023-10 | `google-pixel-8` |
| 联想拯救者 Y900 | 2023-08 | `lenovo-legion-y900` |
| Nothing Phone (2) | 2023-07 | `nothing-phone-2` |
| 夏普 AQUOS R8 Pro | 2023-07 | `sharp-aquos-r8-pro` |
| 华硕 Zenfone 10 | 2023-06 | `asus-zenfone-10` |
| 传音 Phantom V Fold | 2023-05 | `tecno-phantom-v-fold` |
| ROG Phone 7 Ultimate | 2023-04 | `asus-rog-phone-7-ultimate` |
| Google Pixel 7 Pro | 2022-10 | `google-pixel-7-pro` |
| Nothing Phone (1) | 2022-07 | `nothing-phone-1` |
| ROG Phone 6 Pro | 2022-07 | `asus-rog-phone-6-pro` |
| 中兴 Axon 40 Ultra | 2022-05 | `zte-nubia-axon-40-ultra` |
| 中兴 Axon 30 | 2021-08 | `zte-axon-30` |
| 中兴 Axon 30 Pro | 2021-04 | `zte-nubia-z30-pro` |

#### Redmi（31 款，`redmi.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| Redmi Note 15 Pro+ | 2025-08 | `redmi-note-15-pro-plus` |
| Redmi K80 至尊版 | 2025-06 | `redmi-k80-ultra` |
| Redmi Turbo 4 Pro | 2025-04 | `redmi-turbo-4-pro` |
| Redmi Turbo 4 | 2025-01 | `redmi-turbo-4` |
| Redmi 14C | 2025-01 | `redmi-14c` |
| Redmi K80 Pro | 2024-11 | `redmi-k80-pro` |
| Redmi K80 | 2024-11 | `redmi-k80` |
| Redmi Note 14 Pro+ | 2024-09 | `redmi-note-14-pro-plus` |
| Redmi Note 14 Pro | 2024-09 | `redmi-note-14-pro` |
| Redmi Note 14 | 2024-09 | `redmi-note-14` |
| Redmi A3 Pro | 2024-05 | `redmi-a3-pro` |
| Redmi Turbo 3 | 2024-04 | `redmi-turbo-3` |
| Redmi 13C | 2023-12 | `redmi-13c` |
| Redmi K70 Pro | 2023-11 | `redmi-k70-pro` |
| Redmi K70 | 2023-11 | `redmi-k70` |
| Redmi K70E | 2023-11 | `redmi-k70e` |
| Redmi Note 13 Pro+ | 2023-09 | `redmi-note-13-pro-plus` |
| Redmi Note 13 Pro | 2023-09 | `redmi-note-13-pro` |
| Redmi Note 13 | 2023-09 | `redmi-note-13` |
| Redmi K60 Pro | 2022-12 | `redmi-k60-pro` |
| Redmi K60 | 2022-12 | `redmi-k60` |
| Redmi K60E | 2022-12 | `redmi-k60e` |
| Redmi Note 12 Pro | 2022-10 | `redmi-note-12-pro` |
| Redmi Note 12 | 2022-10 | `redmi-note-12` |
| Redmi K50 至尊版 | 2022-08 | `redmi-k50-ultra` |
| Redmi Note 11T Pro | 2022-05 | `redmi-note-11t-pro` |
| Redmi K50 Pro | 2022-03 | `redmi-k50-pro` |
| Redmi K50 | 2022-03 | `redmi-k50` |
| Redmi Note 11 Pro | 2021-10 | `redmi-note-11-pro` |
| Redmi K40 Pro | 2021-02 | `redmi-k40-pro` |
| Redmi K40 | 2021-02 | `redmi-k40` |

#### Apple（29 款，`apple.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| iPhone 17 Pro Max | 2025-09 | `iphone-17-pro-max` |
| iPhone 17 Pro | 2025-09 | `iphone-17-pro` |
| iPhone 17 | 2025-09 | `iphone-17` |
| iPhone Air | 2025-09 | `iphone-air` |
| iPhone 16e | 2025-02 | `iphone-16e` |
| iPhone 16 Pro Max | 2024-09 | `iphone-16-pro-max` |
| iPhone 16 Pro | 2024-09 | `iphone-16-pro` |
| iPhone 16 | 2024-09 | `iphone-16` |
| iPhone 16 Plus | 2024-09 | `iphone-16-plus` |
| iPhone 15 Pro Max | 2023-09 | `iphone-15-pro-max` |
| iPhone 15 Pro | 2023-09 | `iphone-15-pro` |
| iPhone 15 | 2023-09 | `iphone-15` |
| iPhone 15 Plus | 2023-09 | `iphone-15-plus` |
| iPhone 14 Plus | 2022-10 | `iphone-14-plus` |
| iPhone 14 Pro Max | 2022-09 | `iphone-14-pro-max` |
| iPhone 14 Pro | 2022-09 | `iphone-14-pro` |
| iPhone 14 | 2022-09 | `iphone-14` |
| iPhone SE (第3代) | 2022-03 | `iphone-se-2022` |
| iPhone 13 Pro Max | 2021-09 | `iphone-13-pro-max` |
| iPhone 13 Pro | 2021-09 | `iphone-13-pro` |
| iPhone 13 | 2021-09 | `iphone-13` |
| iPhone 13 mini | 2021-09 | `iphone-13-mini` |
| iPhone 12 mini | 2020-11 | `iphone-12-mini` |
| iPhone 12 Pro Max | 2020-10 | `iphone-12-pro-max` |
| iPhone 12 Pro | 2020-10 | `iphone-12-pro` |
| iPhone 12 | 2020-10 | `iphone-12` |
| iPhone SE (第2代) | 2020-04 | `iphone-se-2020` |
| iPhone 11 Pro Max | 2019-09 | `iphone-11-pro-max` |
| iPhone 11 | 2019-09 | `iphone-11` |

#### OPPO（29 款，`oppo.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| OPPO K13 Turbo Pro | 2025-07 | `oppo-k13-turbo-pro` |
| OPPO Reno14 Pro | 2025-05 | `oppo-reno14-pro` |
| OPPO Reno14 | 2025-05 | `oppo-reno14` |
| OPPO Find X8 Ultra | 2025-04 | `oppo-find-x8-ultra` |
| OPPO Find X8s | 2025-04 | `oppo-find-x8s` |
| OPPO Find N5 | 2025-02 | `oppo-find-n5` |
| OPPO A5 Pro | 2025-02 | `oppo-a5-pro` |
| OPPO Find X8 Pro | 2024-11 | `oppo-find-x8-pro` |
| OPPO Find X8 | 2024-11 | `oppo-find-x8` |
| OPPO Reno13 Pro | 2024-11 | `oppo-reno13-pro` |
| OPPO Reno13 | 2024-11 | `oppo-reno13` |
| OPPO K12 Plus | 2024-10 | `oppo-k12-plus` |
| OPPO Reno12 Pro | 2024-05 | `oppo-reno12-pro` |
| OPPO Reno12 | 2024-05 | `oppo-reno12` |
| OPPO K12 | 2024-04 | `oppo-k12` |
| OPPO A3 Pro | 2024-04 | `oppo-a3-pro` |
| OPPO Find X7 Ultra | 2024-01 | `oppo-find-x7-ultra` |
| OPPO Find X7 | 2024-01 | `oppo-find-x7` |
| OPPO Reno11 Pro | 2023-11 | `oppo-reno11-pro` |
| OPPO Reno11 | 2023-11 | `oppo-reno11` |
| OPPO Find N3 | 2023-10 | `oppo-find-n3` |
| OPPO Find N3 Flip | 2023-09 | `oppo-find-n3-flip` |
| OPPO A2 Pro | 2023-09 | `oppo-a2-pro` |
| OPPO K11 | 2023-07 | `oppo-k11` |
| OPPO Reno10 Pro+ | 2023-05 | `oppo-reno10-pro-plus` |
| OPPO Find X6 Pro | 2023-03 | `oppo-find-x6-pro` |
| OPPO Find X6 | 2023-03 | `oppo-find-x6` |
| OPPO Find N2 Flip | 2022-12 | `oppo-find-n2-flip` |
| OPPO Find N2 | 2022-12 | `oppo-find-n2` |

#### iQOO（28 款，`iqoo.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| iQOO Neo10 Pro | 2025-05 | `iqoo-neo10-pro` |
| iQOO Neo10 | 2025-05 | `iqoo-neo10` |
| iQOO Z10 Turbo Pro | 2025-04 | `iqoo-z10-turbo-pro` |
| iQOO Z10 Turbo | 2025-04 | `iqoo-z10-turbo` |
| iQOO 13 传奇典藏版 | 2025-01 | `iqoo-pad5-pro` |
| iQOO 13 | 2024-10 | `iqoo-13` |
| iQOO Neo9S Pro | 2024-07 | `iqoo-neo9s-pro` |
| iQOO Neo9S Pro+ | 2024-07 | `iqoo-neo9s-pro-plus` |
| iQOO Z9 Turbo | 2024-04 | `iqoo-z9-turbo` |
| iQOO Z9 | 2024-04 | `iqoo-z9` |
| iQOO Neo9 Pro | 2024-01 | `iqoo-neo9-pro` |
| iQOO Neo9 | 2023-12 | `iqoo-neo9` |
| iQOO 12 Pro | 2023-11 | `iqoo-12-pro` |
| iQOO 12 | 2023-11 | `iqoo-12` |
| iQOO Z8 | 2023-07 | `iqoo-z8` |
| iQOO 11S | 2023-07 | `iqoo-11s` |
| iQOO Neo8 Pro | 2023-05 | `iqoo-neo8-pro` |
| iQOO Neo8 | 2023-05 | `iqoo-neo8` |
| iQOO Z7 | 2023-03 | `iqoo-z7` |
| iQOO 11 Pro | 2022-12 | `iqoo-11-pro` |
| iQOO 11 | 2022-12 | `iqoo-11` |
| iQOO Neo7 SE | 2022-12 | `iqoo-neo7-se` |
| iQOO Neo7 | 2022-10 | `iqoo-neo7` |
| iQOO 10 Pro | 2022-07 | `iqoo-10-pro` |
| iQOO 10 | 2022-07 | `iqoo-10` |
| iQOO Neo6 | 2022-04 | `iqoo-neo6` |
| iQOO 9 Pro | 2022-01 | `iqoo-9-pro` |
| iQOO Neo5 | 2021-03 | `iqoo-neo5` |

#### 摩托罗拉（26 款，`motorola.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| moto edge 60 Pro | 2025-04 | `motorola-edge-60-pro` |
| moto razr 60 Ultra | 2025-04 | `motorola-razr-60-ultra` |
| moto edge 60 | 2025-04 | `motorola-edge-60` |
| moto G75 | 2024-10 | `motorola-moto-g75` |
| moto S50 | 2024-09 | `motorola-moto-s50` |
| moto edge 50 | 2024-08 | `motorola-edge-50` |
| moto G85 | 2024-07 | `motorola-moto-g85` |
| moto razr 50 Ultra | 2024-06 | `motorola-razr-50-ultra` |
| moto razr 50 | 2024-06 | `motorola-razr-50` |
| moto X50 Ultra | 2024-05 | `motorola-moto-x50-ultra` |
| moto edge 50 Pro | 2024-04 | `motorola-edge-50-pro` |
| moto edge 50 Ultra | 2024-04 | `motorola-edge-50-ultra` |
| moto G34 | 2024-01 | `motorola-moto-g34` |
| moto razr 40 | 2023-09 | `motorola-razr-40` |
| moto G54 | 2023-09 | `motorola-moto-g54` |
| moto razr 40 Ultra | 2023-06 | `motorola-razr-40-ultra` |
| moto edge 40 | 2023-05 | `motorola-edge-40` |
| moto edge 40 Pro | 2023-04 | `motorola-edge-40-pro` |
| moto X40 | 2022-12 | `motorola-moto-x40` |
| moto X30 Pro | 2022-08 | `motorola-moto-x30-pro` |
| moto S30 Pro | 2022-08 | `motorola-moto-s30-pro` |
| moto edge S30 冠军版 | 2022-03 | `motorola-edge-s30-champion` |
| moto edge S30 | 2021-12 | `motorola-edge-s30` |
| moto edge X30 | 2021-12 | `motorola-edge-x30` |
| moto edge 20 Pro | 2021-08 | `motorola-edge-20-pro` |
| moto razr 5G | 2020-09 | `motorola-razr-5g` |

#### 一加（23 款，`oneplus.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| 一加 Ace 5 至尊版 | 2025-05 | `oneplus-ace-5-ultra` |
| 一加 13T | 2025-04 | `oneplus-13t` |
| 一加 Ace 5 Pro | 2024-12 | `oneplus-ace-5-pro` |
| 一加 Ace 5 | 2024-12 | `oneplus-ace-5` |
| 一加 13 | 2024-10 | `oneplus-13` |
| 一加 Ace 3 Pro 高达版 | 2024-08 | `oneplus-ace-3-pro-gundam` |
| 一加 Ace 3 Pro | 2024-06 | `oneplus-ace-3-pro` |
| 一加 Ace 3V | 2024-03 | `oneplus-ace-3v` |
| 一加 Ace 3 | 2024-01 | `oneplus-ace-3` |
| 一加 12 | 2023-12 | `oneplus-12` |
| 一加 Ace 2 Pro | 2023-08 | `oneplus-ace-2-pro` |
| 一加 Ace 2V | 2023-03 | `oneplus-ace-2v` |
| 一加 Ace 2 | 2023-02 | `oneplus-ace-2` |
| 一加 11 | 2023-01 | `oneplus-11` |
| 一加 Ace Pro | 2022-08 | `oneplus-ace-pro` |
| 一加 Ace | 2022-04 | `oneplus-ace` |
| 一加 10 Pro | 2022-01 | `oneplus-10-pro` |
| 一加 9RT | 2021-10 | `oneplus-9rt` |
| 一加 9R | 2021-04 | `oneplus-9r` |
| 一加 9 Pro | 2021-03 | `oneplus-9-pro` |
| 一加 9 | 2021-03 | `oneplus-9` |
| 一加 8T | 2020-10 | `oneplus-8t` |
| 一加 8 Pro | 2020-04 | `oneplus-8-pro` |

#### 魅族（21 款，`meizu.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| 魅族 22 | 2025-09 | `meizu-22` |
| 魅族 Note 16 Pro | 2025-05 | `meizu-note-16-pro` |
| 魅族 Note 16 | 2025-05 | `meizu-note-16` |
| 魅族 mblu 22 Pro | 2025-03 | `meizu-mblu-22-pro` |
| mblu 22 | 2025-03 | `meizu-mblu-22` |
| 魅族 Lucky 08 | 2024-09 | `meizu-lucky-08` |
| 魅族 21 Note | 2024-05 | `meizu-21-note` |
| 魅族 21 Pro | 2024-02 | `meizu-21-pro` |
| 魅族 21 | 2023-11 | `meizu-21` |
| 魅族 20 Classic | 2023-10 | `meizu-20-classic` |
| 魅族 20 Infinity | 2023-06 | `meizu-20-infinity` |
| 魅族 20 Pro | 2023-03 | `meizu-20-pro` |
| 魅族 20 | 2023-03 | `meizu-20` |
| 魅族 18s | 2021-11 | `meizu-18s` |
| 魅族 18s Pro | 2021-09 | `meizu-18s-pro` |
| 魅族 18X | 2021-09 | `meizu-18x` |
| 魅族 18 Pro | 2021-03 | `meizu-18-pro` |
| 魅族 18 | 2021-03 | `meizu-18` |
| 魅族 17 Pro | 2020-05 | `meizu-17-pro` |
| 魅族 17 | 2020-05 | `meizu-17` |
| 魅族 16s Pro | 2019-08 | `meizu-16s-pro` |

#### 努比亚（21 款，`nubia.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| 红魔 10 Ultra | 2025-06 | `nubia-redmagic-10-ultra` |
| 努比亚 Music 2 | 2025-04 | `nubia-music-2` |
| 努比亚 Z70S Ultra | 2025-04 | `nubia-z70s-ultra` |
| 努比亚 Flip 2 | 2025-03 | `nubia-flip-2` |
| 红魔 10 Pro | 2024-11 | `nubia-redmagic-10-pro` |
| 努比亚 Z70 Ultra | 2024-11 | `nubia-z70-ultra` |
| 努比亚 Flip 5G | 2024-10 | `nubia-flip-5g` |
| 努比亚 Music | 2024-08 | `nubia-music` |
| 红魔 9S Pro | 2024-07 | `nubia-redmagic-9s-pro` |
| 努比亚 Z60S Pro | 2024-07 | `nubia-z60s-pro` |
| 努比亚 Z60 Ultra | 2023-12 | `nubia-z60-ultra` |
| 红魔 9 Pro | 2023-11 | `nubia-redmagic-9-pro` |
| 红魔 8S Pro | 2023-07 | `nubia-redmagic-8s-pro` |
| 努比亚 Z50S Pro | 2023-07 | `nubia-z50s-pro` |
| 努比亚 Z50 Ultra | 2023-03 | `nubia-z50-ultra` |
| 红魔 8 Pro | 2022-12 | `nubia-redmagic-8-pro` |
| 努比亚 Z50 | 2022-12 | `nubia-z50` |
| 红魔 7 Pro | 2022-02 | `nubia-redmagic-7-pro` |
| 红魔 7 | 2022-02 | `nubia-redmagic-7` |
| 努比亚 Z40 Pro | 2022-02 | `nubia-z40-pro` |
| 红魔 6 Pro | 2021-03 | `nubia-redmagic-6-pro` |

#### 索尼（16 款，`sony.ts`）

| 机型 | 发布日期 | id |
|---|---|---|
| 索尼 Xperia 1 VII | 2025-06 | `sony-xperia-1-vii` |
| 索尼 Xperia 1 VI | 2024-05 | `sony-xperia-1-vi` |
| 索尼 Xperia 10 VI | 2024-05 | `sony-xperia-10-vi` |
| 索尼 Xperia 5 V | 2023-09 | `sony-xperia-5-v` |
| 索尼 Xperia 1 V | 2023-06 | `sony-xperia-1-v` |
| 索尼 Xperia 10 V | 2023-05 | `sony-xperia-10-v` |
| 索尼 Xperia 5 IV | 2022-09 | `sony-xperia-5-iv` |
| 索尼 Xperia 1 IV | 2022-06 | `sony-xperia-1-iv` |
| 索尼 Xperia 10 IV | 2022-06 | `sony-xperia-10-iv` |
| 索尼 Xperia PRO-I | 2021-12 | `sony-xperia-pro-i` |
| 索尼 Xperia 1 III | 2021-08 | `sony-xperia-1-iii` |
| 索尼 Xperia 5 III | 2021-06 | `sony-xperia-5-iii` |
| 索尼 Xperia 10 III | 2021-06 | `sony-xperia-10-iii` |
| 索尼 Xperia 5 II | 2020-10 | `sony-xperia-5-ii` |
| 索尼 Xperia 10 II | 2020-05 | `sony-xperia-10-ii` |
| 索尼 Xperia 1 II | 2020-02 | `sony-xperia-1-ii` |

---

## B. 缺失机型数据（联网核实，2026-10-14）

**填写说明（供录入同学参考）**
- 字段块使用 `_factory.ts` 的 `CompactSeed` 短键名，未核实的字段写 `null`，**不要猜**。
- 已有机型的最晚发布日期约为 **2025-08/09**，因此本清单主要覆盖 **2025-09 ~ 2026-10** 之间发布的机型。
- 价格口径：`lp`=国行首发价（最低配），`cp`=参考现价（2026-10 前后）。受 2026 年存储涨价影响，多个系列官方已上调价格，已在备注中说明。
- 所有条目均附来源 URL。

**新增字段（架构师要求，2026-10-14 补充）**
- `ff`：形态，`bar` / `fold-h` / `fold-v` / `fold-wide` / `fold-triple` / `tablet`（平板建议新增）。**每条都有，无需推导。**
- `fsz` / `fres`：折叠机**外屏**尺寸（英寸）与分辨率，`sz` / `res` 指**内屏（展开态）**。直板机与平板不填。
  - 竖折叠（Z Flip8）同理：`sz` 为展开后的内屏，`fsz` 为合盖后的智能外屏（FlexWindow）。
- `ct`（长焦）文本中凡潜望结构**均已写明「潜望」二字**，可直接用于「潜望长焦」筛选项的自动派生。
- 折叠机外屏数据来源（官方规格页 / ZOL）：
  - 荣耀 Magic V6：https://www.honor.com/cn/shop/product/10086002156362.html 、https://www.hihonor.com/ae-en/phones/honor-magic-v6/spec
  - OPPO Find N6：https://support.oppo.com/vn/answer?aid=2279938 、https://wap.zol.com.cn/2159/2158778/index.html
  - 小米 18 Fold：https://www.mi.com/prod/xiaomi-18-fold 、https://mobile.pconline.com.cn/2183/21830805.html
  - 华为 Mate X7：https://consumer.huawei.com/cn/phones/mate-x7 、https://wap.zol.com.cn/2150/2149094/index.html
  - 三星 Z Fold8 / Fold8 Ultra / Flip8：https://news.samsung.com/global/samsung-galaxy-z-fold8-ultra-fold8-and-flip8foldables-perfected-for-every-way-of-living 、https://www.samsung.com/uk/smartphones/galaxy-z-flip8/specs/
  - iPhone Duo：https://www.apple.com.cn/iphone-duo/specs/

---

### B.1 Apple（2 款手机 + 1 款折叠）

> 重要：iPhone 18 标准版、iPhone 18e、iPhone Air 2 **尚未发布**，**不收录**。
> 核实结论：2026-09-09/10 苹果秋季发布会**只推出 iPhone 18 Pro、iPhone 18 Pro Max 与首款折叠 iPhone Duo**，标准版缺席；苹果改「秋季高端 / 春季主流」一年两更策略，iPhone 18 标准版、18e、iPhone Air 2 统一推迟到 **2027 年春季**（约 3 月）。
> 因此「iPhone 18」「iPhone Air 2」目前**无官方参数、无官方价格**，任何数字都是爆料，本文件一条不填。
> 来源：https://baike.baidu.com/item/iPhone%2018标准版/68190271 、https://news.tvbs.com.tw/world/4020084 、https://www.toutiao.com/article/7683653107766608420

#### 1. iPhone 18 Pro ｜ 建议 id：`iphone-18-pro` ｜ 建议 tags：`['旗舰','影像旗舰','潜望长焦']`

```
d: '2026-09'   lp: 9999   cp: 9999
ff: 'bar'
sz: 6.3   res: '2622x1206'   ppi: 460   mat: 'OLED 超视网膜 XDR（ProMotion LTPO）'
rr: 120   nit: 3000   dim: null   hdr: 'HDR10 / 杜比视界 / HDR10+'
soc: 'A20 Pro'   sb: 'Apple'   pr: '2nm'   cpu: '6核(2性能+4能效)'
gpu: 'Apple 7核GPU（神经网络加速器）'   an: null   rt: null   ft: 'NVMe'
ram: [12]   rom: [256,512,1024,2048]
cm: '4800万像素 融合式主摄 24mm 可变光圈 f/1.48-f/4.0 二代传感器位移OIS'
cw: '4800万像素 融合式超广角 13mm f/2.2 120°'
ct: '4800万像素 融合式潜望长焦（四重反射棱镜）100mm(4倍) f/2.8 3D传感器位移OIS'
ce: '激光雷达扫描仪'
cz: '8倍光学品质变焦 / 40倍数码'   cv: '4K120 杜比视界 / ProRes RAW / Apple Log 2'
fc: '1800万像素 Center Stage f/1.9'
bc: 4056   bw: 40   bwl: 15   br: null
os: 'iOS 27'   ui: 'iOS'   net: '5G双模'   wf: 'Wi-Fi 7(802.11be, Apple N1)'
bt: '6.0'   nfc: true   ir: false   sat: null
bdim: '150.0x71.9x8.75mm'   wt: 211   bm: '铝合金一体成型 + 超瓷晶面板2'
ip: 'IP68(6米/30分钟)'   bio: '3D人脸识别(面容ID)'   spk: '立体声双扬声器'
port: 'USB-C（USB 3，10Gb/s）'   col: '黑色,银色,冰川蓝,勃艮第酒红'
```
- 发布：2026-09-10 发布，2026-09-12 预购，2026-09-18 发售
- 价格：256GB 9999 / 512GB 11999 / 1TB 15499 / 2TB 20499
- 备注 1：**有线充电功率口径冲突**——爱思助手标 40W，新浪报道称 Pro Max 最高 52W，苹果官方仅写「15 分钟充至 50%，需 60W 及以上 AVS 适配器」。建议 `bw` 先填 40 并在数据说明中标注口径。
- 备注 2：无线充电由上一代 25W **降为** MagSafe 15W / Qi2 15W。
- 来源：
  - https://www.apple.com.cn/iphone-18-pro/specs/
  - https://support.apple.com/en-gb/148591
  - https://baike.baidu.com/item/iPhone%2018%20Pro/65669764
  - https://www.i4.cn/firmware_device-iPhone19,7.html

#### 2. iPhone 18 Pro Max ｜ 建议 id：`iphone-18-pro-max` ｜ 建议 tags：`['旗舰','影像旗舰','大屏','潜望长焦']`

```
d: '2026-09'   lp: 10999   cp: 10999
ff: 'bar'
sz: 6.9   res: '2868x1320'   ppi: 460   mat: 'OLED 超视网膜 XDR（ProMotion LTPO）'
rr: 120   nit: 3000   dim: null   hdr: 'HDR10 / 杜比视界 / HDR10+'
soc: 'A20 Pro'   sb: 'Apple'   pr: '2nm'   cpu: '6核(2性能+4能效)'
gpu: 'Apple 7核GPU（神经网络加速器）'   an: null   rt: null   ft: 'NVMe'
ram: [12]   rom: [256,512,1024,2048]
cm: '4800万像素 融合式主摄 24mm 可变光圈 f/1.48-f/4.0 二代传感器位移OIS'
cw: '4800万像素 融合式超广角 13mm f/2.2 120°'
ct: '4800万像素 融合式潜望长焦（四重反射棱镜）100mm(4倍) f/2.8 3D传感器位移OIS'
ce: '激光雷达扫描仪'
cz: '8倍光学品质变焦 / 40倍数码'   cv: '4K120 杜比视界 / ProRes RAW / Apple Log 2'
fc: '1800万像素 Center Stage f/1.9'
bc: 5391   bw: 40   bwl: 15   br: null
os: 'iOS 27'   ui: 'iOS'   net: '5G双模'   wf: 'Wi-Fi 7(802.11be, Apple N1)'
bt: '6.0'   nfc: true   ir: false   sat: null
bdim: '163.4x78.0x8.75mm'   wt: 249   bm: '铝合金一体成型 + 超瓷晶面板2'
ip: 'IP68(6米/30分钟)'   bio: '3D人脸识别(面容ID)'   spk: '立体声双扬声器'
port: 'USB-C（USB 3，10Gb/s）'   col: '黑色,银色,冰川蓝,勃艮第酒红'
```
- 价格：256GB 10999 / 512GB 12999 / 1TB 16499 / 2TB 21499
- 来源：https://support.apple.com/en-gb/148591 、https://www.compareelectronic.com/blog/iphone-18-pro-vs-iphone-18-pro-max 、https://www.apfelpatient.com/generally/iphone-18-pro-all-rumors-at-a-glance

#### 3. iPhone Duo（苹果首款折叠） ｜ 建议 id：`iphone-duo` ｜ 建议 tags：`['折叠屏','旗舰']`

```
d: '2026-10'   lp: 15999   cp: 15999
ff: 'fold-h'   fsz: 5.4   fres: '1398x2034'
sz: 7.6   res: '1878x2670（内屏，430ppi）'   ppi: 430   mat: 'OLED 可折叠（纳米纹理）+ 外屏超视网膜XDR'
rr: 120   nit: 3000   dim: null   hdr: 'HDR10 / 杜比视界 / HDR10+'
soc: 'A20 Pro'   sb: 'Apple'   pr: '2nm'   cpu: '6核(2性能+4能效)'
gpu: 'Apple 7核GPU'   an: null   rt: null   ft: 'NVMe'
ram: [12]   rom: [256,512,1024,2048]
cm: '4800万像素 融合式主摄 26mm f/1.6 传感器位移OIS'
cw: '4800万像素 融合式超广角 13mm f/2.2 120°'
ct: null   ce: null
cz: '2倍光学品质变焦 / 10倍数码'   cv: '4K120 杜比视界'
fc: '外屏1200万 Center Stage f/2.2 + 内屏屏下 FaceTime'
bc: null   bw: null   bwl: 15   br: null
os: 'iOS 27'   ui: 'iOS'   net: '5G双模(双eSIM)'   wf: 'Wi-Fi 7(802.11be, Apple N1)'
bt: '6.0'   nfc: true   ir: false   sat: null
bdim: null   wt: 254   bm: '钛金属可折叠 + 超瓷晶面板2'
ip: 'IP68(6米/30分钟)'   bio: '侧边按钮触控ID指纹'   spk: '立体声双扬声器'
port: 'USB-C（USB 3，10Gb/s）'   col: '夜空色,星光白'
```
- 外屏：5.4 英寸 1398x2034，460ppi。展开厚度 4.5mm。
- 价格：256GB 15999 / 512GB 17999 / 1TB 21499 / 2TB 26499
- 发布：2026-09-10 发布，10-16 预购，**10-23 上市**（故 `d` 建议 2026-10）
- 注意：`bc`（双电池，官方未公布总容量）、`bdim`（官方规格页未列）、`bw`（仅写 20 分钟充至 50% / 60W 适配器）均**保持 null**
- 来源：https://www.apple.com.cn/iphone-duo/specs/ 、https://www.sctv.com/news/2097764781822251010

---

### B.2 荣耀（12 款）

> **Magic9 系列命名核实（2026-09-28 北京发布）**：官方只发了 **荣耀 Magic9 / 荣耀 Magic9 Pro Max / 荣耀 Magic9 超能版** 三款。
> **不存在「荣耀 Magic9 Pro」，也不存在「Magic9 至臻版」**——网上流传的 Magic9 Pro（6.85" / 7500mAh）来自 smartprix 等第三方站的「Expected」页，与国内发布会口径不一致，**未收录**。
> 系列起售价 4499 元（超能版国补价），Magic9 4999 元起，Pro Max 6499 元起。
> 来源：https://new.qq.com/rain/a/20260928A0AZEO00 、https://dy.163.com/article/L7UGCS7R05119TAN.html 、https://app.cqrb.cn/zhiqiyinqing/2026-09-28/2785954_pc.html

#### 4. 荣耀 Magic9 ｜ id：`honor-magic9` ｜ tags：`['旗舰','影像旗舰','小屏','长续航','潜望长焦']`

```
d: '2026-09'   lp: 4999   cp: 4999
ff: 'bar'
sz: 6.37   res: null   ppi: null   mat: 'OLED 2.5D直屏（绿洲护眼屏）'
rr: 120   nit: 10000   dim: null   hdr: null
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 1英寸 三星HP9 f/1.6 OIS（十六合一 2.24μm）'
cw: '5000万像素超广角'
ct: '2亿像素 3.5倍潜望长焦'
ce: '荣耀驭光H1 影像芯片'   cz: '3.5倍光变'   cv: 'ARRI LogC3'
fc: '5500万像素'
bc: 8000   bw: 80   bwl: 50   br: null
os: null   ui: 'MagicOS 11'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null
ip: 'IP68/IP69/IP69K'   bio: '3D超声波指纹 + 3D人脸识别'   spk: null
port: 'USB-C'   col: '银盐,影黑,苔青,爆米黄,橄榄青'
```
- 发布即开售：2026-09-28。价格 12+256=4999 / 12+512=5499 / 16+512=5999 / 16+1T=6999（国补到手 4499 起）
- 来源：https://g.pconline.com.cn/x/2182/21828807.html 、https://news.hubeidaily.net/pc/c_6028909.html 、https://www.sina.cn/gc/article/nitktpc3649284.html

#### 5. 荣耀 Magic9 Pro Max ｜ id：`honor-magic9-pro-max` ｜ tags：`['旗舰','影像旗舰','长续航','潜望长焦']`

```
d: '2026-09'   lp: 6499   cp: 6499
ff: 'bar'
sz: 6.8   res: null   ppi: null   mat: 'OLED LTPO 直屏'
rr: 120   nit: 10000   dim: null   hdr: null
soc: '第六代骁龙8超级至尊版'   sb: '高通'   pr: '2nm'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 阿莱云台级主摄 1/1.28英寸 CIPA 8.0+3°'
cw: '5000万像素超广角'
ct: '2亿像素 阿莱超夜神潜望长焦 CIPA 8.0'
ce: '荣耀驭光H1 影像芯片'   cz: null   cv: 'ARRI LogC3 + 87款阿莱Look'
fc: null   bc: 8800   bw: 100   bwl: 80   br: null
os: null   ui: 'MagicOS 11'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null
ip: 'IP68/IP69/IP69K'   bio: '3D超声波指纹 + 3D人脸识别'   spk: null
port: 'USB-C'   col: '银盐,影黑,苔青,爆米黄,橄榄青'
```
- 价格 12+256=6499 / 12+512=6999 / 16+512=7499 / 16+1T=8499；大师摄影套装 10999
- 来源：同上 + https://cj.sina.cn/articles/view/7879996425/1d5af340906803zq8c

#### 6. 荣耀 Magic9 超能版 ｜ id：`honor-magic9-ultra-power` ｜ tags：`['旗舰','长续航','游戏手机','大屏']`

```
d: '2026-09'   lp: 4499   cp: 4499
ff: 'bar'
sz: 6.81   res: null   ppi: null   mat: 'OLED 直屏'   rr: 120   nit: 10000
dim: null   hdr: null
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512]
cm: '2亿像素主摄'   cw: '1200万像素超广角'
ct: '5000万像素 3倍长焦'   ce: '主动散热风扇（30000转/分）'
cz: '3倍光变'   cv: null   fc: '5000万像素'
bc: 11000   bw: null   bwl: null   br: null
os: null   ui: 'MagicOS 11'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null
ip: 'IP68/IP69/IP69K'   bio: '3D超声波指纹 + 3D人脸识别'   spk: null
port: 'USB-C'   col: '大地回声,晴天,晨曦,摄夜（系列配色，本机以官方为准）'
```
- 价格 12+256=4499 / 12+512=4999 / 16+512=5999（国补到手 3999 起）
- 亮点：安卓旗舰唯一主动散热；11000mAh 为旗舰最大电池
- 来源：https://share.hntv.tv/news/0/2104863883929247745 、https://www.cjrbapp.cjn.cn/p/46950822.html

#### 7. 荣耀 Magic8 ｜ id：`honor-magic8` ｜ tags：`['旗舰','长续航','潜望长焦']`

```
d: '2025-10'   lp: 4499   cp: 4799
ff: 'bar'
sz: 6.58   res: null   ppi: null   mat: 'OLED 直屏（绿洲护眼屏）'
rr: 120   nit: 6000   dim: '4320Hz PWM'   hdr: 'HDR Vivid'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 f/1.9 OIS'   cw: '5000万像素超广角 f/2.0'
ct: '6400万像素 3倍潜望长焦 f/2.5 OIS'   cz: '3倍光变'   cv: '4K60'
fc: '5000万像素 f/2.0'
bc: 7000   bw: 90   bwl: null   br: null
os: null   ui: 'MagicOS 10'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: '北斗卫星短信'
bdim: '157.12x74.03x7.95mm'   wt: 205   bm: null
ip: 'IP68/IP69'   bio: '屏下指纹'   spk: null   port: 'USB-C'
col: '旭日金,天青釉,雪域白,绒黑色'
```
- 发布 2025-10-15，开售 2025-10-23。价格 12+256=4499 / 12+512=4799 / 16+512=4999 / 16+1T=5499
- **2026-09 官方上调价**：12+256→4799，12+512→5199（故 `cp` 填 4799）
- 来源：https://baike.baidu.com/item/%E8%8D%A3%E8%80%80Magic8/67535684 、https://news.qq.com/rain/a/20260720A06AWZ00

#### 8. 荣耀 Magic8 Pro ｜ id：`honor-magic8-pro` ｜ tags：`['旗舰','影像旗舰','潜望长焦']`

```
d: '2025-10'   lp: 5699   cp: 4999
ff: 'bar'
sz: 6.71   res: null   ppi: null   mat: 'OLED LTPO 等深四曲屏'
rr: 120   nit: 6000   dim: '4320Hz PWM'   hdr: 'HDR Vivid'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 超夜神主摄 1/1.3英寸 f/1.6 OIS'
cw: '5000万像素超广角 f/2.0'
ct: '2亿像素 超夜神潜望长焦 85mm 1/1.4英寸 f/2.6 OIS CIPA 5.5'
ce: 'AiMAGE 夜神引擎'   cz: '3.7倍光变 / 100倍数字'   cv: '4K60'
fc: '5000万像素 f/2.0'
bc: 7200   bw: 120   bwl: 80   br: null
os: null   ui: 'MagicOS 10'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: '北斗卫星短信'
bdim: '161.15x75.0x8.32mm'   wt: 219   bm: null
ip: 'IP68/IP69'   bio: '3D超声波指纹 + 3D人脸识别'   spk: null
port: 'USB-C'   col: '旭日金砂,天青色,雪域白,绒黑色'
```
- 价格 12+256=5699 / 12+512=5999 / 16+512=6199 / 16+1T=6699
- 来源：https://cj.sina.cn/articles/view/7880068406/1d5b04d3606801iso8 、https://baike.baidu.com/item/%E8%8D%A3%E8%80%80Magic8/67535684

#### 9. 荣耀 Magic8 Pro Air ｜ id：`honor-magic8-pro-air` ｜ tags：`['旗舰','轻薄','小屏']`

```
d: '2026-01'   lp: null   cp: null
ff: 'bar'
sz: 6.31   res: null   ppi: null   mat: 'OLED'   rr: 120   nit: null
dim: null   hdr: null
soc: '天玑9500'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: null   br: null
os: null   ui: 'MagicOS 10'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: null
```
- 发布 2026-01-19。**价格与详细参数未查到**，仅确认屏幕尺寸与处理器。
- 来源：https://baike.baidu.com/item/%E8%8D%A3%E8%80%80Magic8/67535684

#### 10. 荣耀 Magic8 RSR 保时捷设计 ｜ id：`honor-magic8-rsr` ｜ tags：`['旗舰','奢华']`

```
d: '2026-01'   lp: 7999   cp: 7999
ff: 'bar'
sz: 6.71   res: null   ppi: null   mat: 'OLED LTPO'   rr: 120   nit: null
dim: null   hdr: null
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'
cpu: null   gpu: null   an: null   rt: null   ft: null
ram: [16,24]   rom: [512,1024]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: null   br: null
os: null   ui: 'MagicOS 10'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: null
```
- 发布 2026-01-19，起售 7999 元（`ram`/`rom` 为推断，**待确认**，未查到官方配置表）
- 来源：https://cj.sina.cn/articles/view/7880068406/1d5b04d3606801iso8 、https://baike.baidu.com/item/%E8%8D%A3%E8%80%80Magic8/67535684

#### 11. 荣耀 Magic V6 ｜ id：`honor-magic-v6` ｜ tags：`['折叠屏','旗舰','长续航','潜望长焦']`

```
d: '2026-03'   lp: 8999   cp: 8999
ff: 'fold-h'   fsz: 6.52   fres: '2420x1080'
sz: 7.95   res: '2352x2172（内屏，403ppi）'   ppi: 403
mat: '柔性OLED LTPO（内）+ OLED LTPO（外，6.52英寸 2420x1080 406ppi）'
rr: 120   nit: 5000   dim: '4320Hz PWM'   hdr: 'HDR Vivid / 杜比视界'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'
cpu: '2×4.6GHz + 6×3.62GHz 八核'   gpu: 'Adreno 840'
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 广角 f/1.6 OIS'   cw: '5000万像素超广角 f/2.2'
ct: '6400万像素 潜望长焦 1/2英寸 f/2.5 OIS'   cz: null   cv: '4K60'
fc: '2000万像素（内屏）+ 2000万像素（外屏） f/2.2'
bc: 6850   bw: 80   bwl: 66   br: '支持无线反充'
os: 'Android 16'   ui: 'MagicOS 10.0'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: '北斗卫星通信'
bdim: '展开156.7x145.6x4.1mm / 折叠156.7x74.5x9.0mm'   wt: 224
bm: '素皮/绒马环保皮革 + 铝合金中框'
ip: 'IP68/IP69'   bio: '侧边指纹 + 面部识别'   spk: '对称式立体声双扬声器'
port: 'USB-C（USB 3.1 Gen1，DP1.2）'   col: '绒黑色,雪域白,旭日金,赤兔红'
```
- 发布 2026-03-10（MWC 2026 于 3-1 首发），开售 2026-03-13
- 价格 12+256=8999 / 12+512=9999 / 16+512=10999 / 16+1T=11999（国补 8499 起）
- 注：16+1T 版本电池为 7150mAh；雪域白版本 219g / 折叠 8.75mm
- 冲突提示：ZOL 标有线 120W，荣耀官方与多方报道为 **80W 有线 + 66W 无线**，建议采用 80W
- 来源：https://wap.zol.com.cn/2159/2158917/index.html 、https://www.cet.com.cn/xwsd/10423206.shtml 、https://zinggadget.com/honor-magic-v6%E5%8F%91%E5%B8%83-2/

#### 12. 荣耀 500 ｜ id：`honor-500` ｜ tags：`['中端','影像','长续航']`

```
d: '2025-11'   lp: 2699   cp: 2999
ff: 'bar'
sz: 6.55   res: '2736x1264'   ppi: 460   mat: 'AMOLED 直屏'
rr: 120   nit: 6000   dim: '3840Hz PWM'   hdr: 'HDR'
soc: '骁龙8s Gen4'   sb: '高通'   pr: '4nm'
cpu: '1×X4 3.2GHz + 3×A720 3.0GHz + 2×A720 2.8GHz + 2×A720 2.0GHz'
gpu: 'Adreno 825'   an: null   rt: 'LPDDR5X'   ft: 'UFS 4.0'
ram: [12,16]   rom: [256,512]
cm: '2亿像素 1/1.4英寸 f/1.9 OIS'   cw: '1200万像素超广角微距 f/2.2 112°（2.5cm）'
ct: null   cz: '30倍数字'   cv: '4K30'   fc: '5000万像素 f/2.0'
bc: 8000   bw: 80   bwl: 0   br: null
os: 'Android 16'   ui: 'MagicOS 10.0'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: null
bdim: '155.8x74.2x7.75mm'   wt: 198   bm: '金属中框+玻璃后壳'
ip: 'IP68/IP69/IP69K'   bio: '屏下指纹 + 面部识别'   spk: '立体声双扬声器'
port: 'USB 2.0 Type-C'   col: '星光粉,海蓝宝,月光银,曜石黑'
```
- 发布 2025-11-24，上市 2025-11-27。价格 12+256=2699 / 12+512=3299 / 16+512=3599（ZOL 在售价 2999/3299/3599，已涨价）
- 来源：https://wap.zol.com.cn/2149/2148022/index.html 、https://www.sina.cn/gc/article/nitmkkp8224718.html

#### 13. 荣耀 500 Pro ｜ id：`honor-500-pro` ｜ tags：`['中端','影像','长续航']`

```
d: '2025-11'   lp: 3599   cp: 3599
ff: 'bar'
sz: 6.55   res: '2736x1264'   ppi: 460   mat: 'AMOLED 直屏'
rr: 120   nit: 6000   dim: '3840Hz PWM'   hdr: 'HDR'
soc: '骁龙8s Gen4'   sb: '高通'   pr: '4nm'   cpu: null   gpu: 'Adreno 825'
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.0'
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 1/1.4英寸 f/1.9 OIS'   cw: '1200万像素超广角微距 f/2.2'
ct: null   cz: '30倍数字'   cv: '4K30'   fc: '5000万像素 f/2.0'
bc: 8000   bw: 80   bwl: 50   br: null
os: 'Android 16'   ui: 'MagicOS 10.0'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: 'IP68/IP69/IP69K'
bio: '屏下指纹'   spk: null   port: 'USB-C'   col: null
```
- 价格 3599 起，顶配 16+1T=4799。**三围/重量未查到**
- 来源：https://www.sina.cn/gc/article/nitmkkp8224718.html

#### 14. 荣耀 WIN RT ｜ id：`honor-win-rt` ｜ tags：`['游戏手机','长续航','中端']`

```
d: null   lp: 2699   cp: 2699
ff: 'bar'
sz: 6.83   res: null   ppi: null   mat: 'AMOLED 直屏'
rr: 185   nit: null   dim: '5920Hz PWM'   hdr: null
soc: '骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10000   bw: 100   bwl: 0   br: null
os: null   ui: 'MagicOS'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: 225   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: null
```
- **发布日期未查到**（仅确认已在售、2699 元、与荣耀 500 同期在官网并列）。`d` 保持 null，待确认后录入。
- 亮点：东风涡轮主动散热、无独立长焦、无无线充电
- 来源：https://www.toutiao.com/a7692403769115509282

#### 15. 荣耀 Power 2 ｜ id：`honor-power-2` ｜ tags：`['长续航','三防','卫星通信']`

```
d: null   lp: 2699   cp: 2699
ff: 'bar'
sz: null   res: null   ppi: null   mat: null   rr: null   nit: null
dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10080   bw: null   bwl: null   br: null
os: null   ui: 'MagicOS'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: '双向卫星通信'
bdim: null   wt: null   bm: null   ip: 'IP68/IP69K'
bio: null   spk: null   port: 'USB-C'   col: null
```
- **大部分参数未查到**（仅确认 2699 元、10080mAh、双向卫星、IP68/IP69K、25 根天线）
- 来源：https://www.toutiao.com/a7692403769115509282

---

### B.3 OPPO / 一加（7 款）

> **Find X10 系列命名核实（2026-09-22 发布 / 09-24 开售）**：国行三款为 **Find X10（5499 起）/ Find X10 Pro Max（6799 起）/ Find X10 E（4999 起）**，全系 8000mAh 冰川电池 + IP66/68/69。
> **Find X10 Pro（非 Max）国行未发布**，海外站（gadgets360 / mobileinto）标注为 2026-11 上市的 Upcoming 机型，**不收录**。
> 来源：https://baike.baidu.com/item/OPPO%20Find%20X10%20系列/68622108 、https://www.sina.cn/gc/article/niswezm5666821.html 、https://www.gadgets360.com/mobiles-oppo-phones

#### 16. OPPO Find X9 ｜ id：`oppo-find-x9` ｜ tags：`['旗舰','影像旗舰','长续航','潜望长焦']`

```
d: '2025-10'   lp: 4399   cp: 4399
ff: 'bar'
sz: 6.59   res: '2760x1256'   ppi: null   mat: 'AMOLED 柔性直屏'
rr: 120   nit: 3600   dim: '3840Hz PWM'   hdr: 'HDR10+ / 杜比视界'
soc: '天玑9500'   sb: '联发科'   pr: '3nm'
cpu: '8核全大核 最高4.21GHz'   gpu: 'Arm Mali Drage MC12'
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 索尼LYT-808 主摄'
cw: '5000万像素超广角'
ct: '5000万像素潜望长焦'
ce: '200万像素黑白 + 丹霞色彩还原镜头'
cz: null   cv: '4K120 杜比视界'
fc: '3200万像素'
bc: 7025   bw: 80   bwl: 50   br: null
os: 'Android 16'   ui: 'ColorOS 16'   net: '5G'   wf: 'Wi-Fi 7'   bt: '5.4'
nfc: true   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: 'IP66/IP68/IP69'
bio: '超声波屏下指纹 + 面部识别'   spk: null
port: 'USB 2.0 Type-C'   col: '追光红,绒光钛,霜白,雾黑'
```
- 发布 2025-10-16，开售 2025-10-22；2025-10-28 巴塞罗那全球发布
- 来源：https://store.oppo.com/cn/app/product/index?skuId=36848 、https://baike.baidu.com/item/OPPO%20Find%20X9%E7%B3%BB%E5%88%97/68610018

#### 17. OPPO Find X9 Pro ｜ id：`oppo-find-x9-pro` ｜ tags：`['旗舰','影像旗舰','潜望长焦']`

```
d: '2025-10'   lp: null   cp: null
ff: 'bar'
sz: 6.78   res: '2772x1272'   ppi: null   mat: 'AMOLED 柔性屏 LTPO'
rr: 120   nit: 3600   dim: '4320Hz PWM'   hdr: 'HDR10+ / 杜比视界'
soc: '天玑9500'   sb: '联发科'   pr: '3nm'   cpu: '8核全大核 最高4.21GHz'
gpu: null   an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素主摄'   cw: '5000万像素超广角'
ct: '2亿像素 哈苏超清潜望长焦'   ce: '丹霞色彩还原镜头'
cz: null   cv: '4K120 杜比视界'   fc: null
bc: 7500   bw: 80   bwl: 50   br: null
os: 'Android 16'   ui: 'ColorOS 16'   net: '5G'   wf: 'Wi-Fi 7'   bt: '5.4'
nfc: true   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: 'IP66/IP68/IP69'
bio: '超声波屏下指纹'   spk: null   port: 'USB-C'   col: null
```
- **首发价未查到**（系列起售价 4399 为 Find X9 标准版，Pro 版具体价格待确认）
- 另：2025-11-07 推出 Find X9 Pro 卫星通信版（支持三大运营商 eSIM）
- 来源：https://baike.baidu.com/item/OPPO%20Find%20X9%E7%B3%BB%E5%88%97/68610018 、https://news.qq.com/rain/a/20260228A038LZ00

#### 18. OPPO Find X9 Ultra ｜ id：`oppo-find-x9-ultra` ｜ tags：`['旗舰','影像旗舰']`

```
d: '2026-04'   lp: null   cp: null
ff: 'bar'
（其余字段均未查到，保持 null）
```
- **仅确认**：2026-04-21 发布，定位系列超大杯。**详细参数与价格未查到**
- 来源：https://baike.baidu.com/item/OPPO%20Find%20X9%E7%B3%BB%E5%88%97/68610018

#### 19. OPPO Find X10 ｜ id：`oppo-find-x10` ｜ tags：`['旗舰','影像旗舰','长续航']`

```
d: '2026-09'   lp: 5499   cp: 5499
ff: 'bar'
sz: 6.59   res: '2768x1272'   ppi: null   mat: 'AMOLED 1nit明眸护眼屏'
rr: 144   nit: null   dim: '3840Hz PWM'   hdr: 'BT.2020'
soc: '天玑9600M'   sb: '联发科'   pr: '3nm'
cpu: '8核全大核 最高4.21GHz'   gpu: null   an: null
rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 哈苏超清主摄 1/1.4英寸 f/1.6 CIPA 6.0 两轴OIS'
cw: '5000万像素超广角 120°'
ct: '2亿像素 哈苏超清长焦 1/1.56英寸 65mm f/2.6 CIPA 7.0 两轴OIS'
ce: '第二代丹霞色彩还原镜头 + LUMO 原生光影引擎'
cz: '2.8倍光变 / 120倍数字'   cv: '4K实况 + 舞台模式'
fc: null
bc: 8000   bw: 80   bwl: 50   br: null
os: null   ui: 'ColorOS 17'   net: '5G'   wf: null   bt: null
nfc: true   ir: false   sat: null
bdim: null   wt: 216   bm: '微光金属中框 + 绒光玻璃背板'
ip: 'IP66/IP68/IP69'   bio: '屏下指纹 + 面部识别'   spk: null
port: 'USB-C'   col: '冰蓝,清橙,浅钛'
```
- 发布 2026-09-22，开售 2026-09-24。价格 5499/5999/6499/7499
- 来源：https://www.163.com/dy/article/L7F744PK0511B8LM.html 、https://dy.163.com/article/L7F77F360556I485.html 、https://www.cet.com.cn/wzsy/cyzx/10599787.shtml

#### 20. OPPO Find X10 Pro Max ｜ id：`oppo-find-x10-pro-max` ｜ tags：`['旗舰','影像旗舰','潜望长焦']`

```
d: '2026-09'   lp: 6799   cp: 6799
ff: 'bar'
sz: null   res: null   ppi: null   mat: 'OLED 明眸护眼屏'
rr: 144   nit: null   dim: '3840Hz PWM'   hdr: null
soc: '天玑9600M'   sb: '联发科'   pr: '3nm'   cpu: '8核 最高4.21GHz'
gpu: null   an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素主摄'   cw: '2亿像素超广角'
ct: '2亿像素潜望长焦'
ce: '第二代丹霞色彩还原镜头（行业首发三2亿镜头群 + DeepPix 传感器）'
cz: null   cv: '8K全焦段Log + 全焦段4K120 杜比视界'
fc: null
bc: null   bw: null   bwl: null   br: null
os: null   ui: 'ColorOS 17'   net: '5G'   wf: null   bt: null
nfc: true   ir: false   sat: null
bdim: null   wt: null   bm: '哈苏影像印迹背板'
ip: 'IP66/IP68/IP69'   bio: null   spk: null   port: 'USB-C'
col: '月白,暖橙,浅钛'
```
- 12+256=6799。**屏幕尺寸/电池/充电/三围/重量未查到**
- 来源：https://dy.163.com/article/L7F77F360556I485.html

#### 21. OPPO Find N6 ｜ id：`oppo-find-n6` ｜ tags：`['折叠屏','旗舰','影像旗舰','潜望长焦']`

```
d: '2026-03'   lp: 9999   cp: 9999
ff: 'fold-h'   fsz: 6.62   fres: '2616x1140'
sz: 8.12   res: '2480x2248（内屏，412ppi）'   ppi: 412   mat: 'OLED LTPO 折叠屏（内）+ 柔性AMOLED（外，431ppi）'
rr: 120   nit: 1800   dim: '2160Hz PWM'   hdr: '杜比视界 / HDR10+ / HDR Vivid'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'
cpu: '7核（2×4.6GHz + 5×3.62GHz）'   gpu: 'Adreno 840'
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 哈苏广角 f/1.8 23mm 两轴OIS'
cw: '5000万像素 超广角 f/2.0 15mm 120°'
ct: '5000万像素 哈苏潜望长焦 f/2.7 70mm 两轴OIS'
ce: '丹霞色彩还原镜头'
cz: '3倍光变 / 120倍数码'   cv: '4K120 杜比视界'
fc: '2000万像素（主屏 f/2.4）+ 2000万像素（副屏 f/2.4）'
bc: 6000   bw: 80   bwl: 50   br: null
os: 'Android 16'   ui: 'ColorOS 16'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: '北斗卫星短信（仅卫星通信版）'
bdim: '展开159.87x145.58x4.21mm / 折叠159.87x74.12x8.93mm'   wt: 225
bm: '钛合金天穹铰链 + 晶盾超瓷晶玻璃'
ip: 'IP56/IP58/IP59'   bio: '侧边指纹 + 面部识别'   spk: '立体声双扬声器'
port: 'USB-C（USB 3.2 Gen1）'   col: '深黑,原钛,金橙'
```
- 发布 2026-03-17，开售 2026-03-20。价格 12+256=9999 / 16+512=10999 / 16+1TB卫星通信版=11999
- 来源：https://wap.zol.com.cn/2159/2158778/index.html 、https://support.oppo.com/vn/answer?aid=2279938 、https://store.oppo.com/cn/web/products/39271.html

#### 22. 一加 15 ｜ id：`oneplus-15` ｜ tags：`['旗舰','游戏手机','长续航']`

```
d: '2025-10'   lp: 3999   cp: 4499
ff: 'bar'
sz: 6.78   res: '2772x1272'   ppi: 450   mat: '柔性AMOLED（第三代东方屏，京东方）'
rr: 165   nit: 1800   dim: '全亮度低频闪'   hdr: 'HDR10+ / 杜比视界'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'
cpu: '八核 最高4.608GHz'   gpu: 'Adreno 840'
an: null   rt: 'LPDDR5X Ultra'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 索尼IMX906 24mm f/1.8 两轴OIS'
cw: '5000万像素超广角 16mm f/2.0 116°'
ct: '5000万像素长焦 80mm f/2.8 两轴OIS'
cz: '3.5倍光变 / 120倍数字'
cv: '8K30 / 4K120 杜比视界'
fc: '3200万像素 21mm f/2.4'
bc: 7300   bw: 120   bwl: 50   br: null
os: 'Android 16'   ui: 'ColorOS 16（海外 OxygenOS 16）'   net: '5G'
wf: 'Wi-Fi 7'   bt: '6.0'   nfc: true   ir: true   sat: null
bdim: '161.42x76.67x8.1mm'   wt: 211   bm: '铝合金中框 + 玻纤增强复合材料后壳'
ip: 'IP66/IP68/IP69/IP69K'   bio: '超声波屏下指纹 + 面部识别'
spk: '对称式双立体声扬声器'   port: 'USB-C（USB 3.2 Gen1）'
col: '原色沙丘,绝对黑,雾光紫'
```
- 发布 2025-10-27，开售 2025-10-28。首发 3999 起（最高 5399）；ZOL 在售价 4499~5899
- 来源：https://wap.zol.com.cn/2146/2145479/index.html 、https://baike.baidu.com/item/%E4%B8%80%E5%8A%A015/66300840

---

### B.4 小米 / REDMI（11 款）

#### 23. 小米 17 ｜ id：`xiaomi-17` ｜ tags：`['旗舰','小屏','长续航']`

```
d: '2025-09'   lp: 4499   cp: 3799
ff: 'bar'
sz: 6.3   res: '2656x1220'   ppi: null   mat: 'CrystalRes OLED（小米龙晶玻璃）'
rr: 120   nit: 3500   dim: null   hdr: 'HDR10+ / 杜比视界'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm(N3P)'
cpu: '2+6全大核 最高4.6GHz'   gpu: null   an: null
rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 光影猎人950 1/1.31英寸 OIS'
cw: '5000万像素超广角 102°'
ct: '5000万像素浮动长焦 60mm OIS'
cz: null   cv: null   fc: '5000万像素'
bc: 7000   bw: 100   bwl: 50   br: null
os: null   ui: 'Xiaomi HyperOS 3'   net: '5G'   wf: 'Wi-Fi 7'   bt: null
nfc: true   ir: true   sat: null
bdim: '151.1x71.8x8.06mm'   wt: 191   bm: null
ip: 'IP68'   bio: '屏下指纹'   spk: null   port: 'USB-C'
col: '雪山粉,冰融蓝,黑,白'
```
- 发布 2025-09-25（部分口径 09-26），首销 2025-09-27。2026-08-02 起全系上调 300~500 元
- 来源：https://baike.baidu.com/item/%E5%B0%8F%E7%B1%B317%E7%B3%BB%E5%88%97/66765113 、https://www.sina.cn/gc/article/niufhfr2374761.html

#### 24. 小米 17 Pro ｜ id：`xiaomi-17-pro` ｜ tags：`['旗舰','小屏','影像旗舰']`

```
d: '2025-09'   lp: 4999   cp: 4999
ff: 'bar'
sz: 6.3   res: null   ppi: null   mat: 'OLED 直屏（8T LTPO）'
rr: 120   nit: null   dim: null   hdr: '杜比视界'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm(N3P)'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '光影猎人950L（首發，LOFIC 16.5EV）'   cw: null   ct: null
ce: '妙享背屏'   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: null   br: null
os: null   ui: 'Xiaomi HyperOS 3'   net: '5G'   wf: 'Wi-Fi 7'   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: 'IP68'   bio: null   spk: null
port: 'USB-C'   col: null
```
- **详细参数（分辨率/电池/三围/重量/影像副摄）未查到**，仅确认定位、处理器、妙享背屏、起售价 4999
- 来源：https://baike.baidu.com/item/%E5%B0%8F%E7%B1%B317%E7%B3%BB%E5%88%97/66765113

#### 25. 小米 17 Pro Max ｜ id：`xiaomi-17-pro-max` ｜ tags：`['旗舰','大屏','影像旗舰']`

```
d: '2025-09'   lp: 5999   cp: 5999
ff: 'bar'
sz: 6.9   res: null   ppi: null   mat: 'OLED 直屏'
rr: 120   nit: null   dim: null   hdr: '杜比视界'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm(N3P)'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素主摄'   cw: null   ct: null
ce: '妙享背屏 + L形异形叠片电池'
cz: null   cv: null   fc: null
bc: 8000   bw: null   bwl: null   br: null
os: null   ui: 'Xiaomi HyperOS 3'   net: '5G'   wf: 'Wi-Fi 7'   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: 'IP68'   bio: null   spk: null
port: 'USB-C'   col: null
```
- 起售价 5999。**分辨率/充电功率/三围/重量未查到**
- 来源：https://news.qq.com/rain/a/20260706A02EN400 、https://www.sina.cn/gc/article/niufhfr2374761.html

#### 26. 小米 17 Ultra ｜ id：`xiaomi-17-ultra` ｜ tags：`['旗舰','影像旗舰']`

```
d: null   lp: null   cp: null
ff: 'bar'
（全部字段未查到，保持 null）
```
- **仅确认**：属于小米 17 系列顶配，2026-10-09 全系上调售价 1000 元；截至 2026 年第 32 周销量约 24 万台。**发布日期、首发价、参数均未查到，待确认**
- 来源：https://baike.baidu.com/item/%E5%B0%8F%E7%B1%B317%E7%B3%BB%E5%88%97/66765113 、https://news.qq.com/rain/a/20260706A02EN400

#### 27. 小米 18 Pro ｜ id：`xiaomi-18-pro` ｜ tags：`['旗舰','影像旗舰','潜望长焦']`

```
d: '2026-09'   lp: 5999   cp: 5999
ff: 'bar'
sz: null   res: null   ppi: null   mat: 'RGB OLED 小直屏（M11发光材料，BT.2020，硬件级防窥屏）'
rr: 120   nit: null   dim: null   hdr: 'BT.2020'
soc: '第六代骁龙8至尊版'   sb: '高通'   pr: '2nm'
cpu: '最高主频5GHz'   gpu: null   an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 1/1.28英寸 主摄（徕卡）'
cw: '5000万像素超广角 17mm'
ct: '2亿像素 1/1.56英寸 3.2倍潜望长焦（12cm长焦微距）'
ce: 'AI百变背屏 + 徕卡光学三摄'   cz: '3.2倍光变'   cv: null   fc: null
bc: 7000   bw: 100   bwl: 50   br: null
os: null   ui: 'Xiaomi HyperOS（超级小爱2.0 / MiMo）'   net: '5G'
wf: null   bt: null   nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null
ip: 'IP66/IP68/IP69'   bio: '3D超声波指纹'   spk: null
port: 'USB-C'   col: '星河蓝,冰桃粉,黑,白'
```
- 发布 2026-09-23（发布即开售）。价格 5999/6999/7999/8999，透明特别版 16+1T=9999，国补到手 5499 起
- 来源：https://www.news.cn/tech/20260924/1dcd469b76984a5b946abcb6f92508bf/c.html 、https://www.toutiao.com/article/7688715221754233378 、https://www.toutiao.com/article/7688746987402936859

#### 28. 小米 18 Pro Max ｜ id：`xiaomi-18-pro-max` ｜ tags：`['旗舰','大屏','影像旗舰','潜望长焦']`

```
d: '2026-09'   lp: 6999   cp: 6999
ff: 'bar'
sz: null   res: null   ppi: null   mat: 'RGB OLED 大直屏（M11发光材料，BT.2020，硬件级防窥屏）'
rr: 120   nit: null   dim: null   hdr: 'BT.2020'
soc: '第六代骁龙8超级至尊版'   sb: '高通'   pr: '2nm'
cpu: '最高主频5GHz'   gpu: null   an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 1/1.28英寸 主摄（徕卡）'
cw: '5000万像素超广角 17mm'
ct: '2亿像素 1/1.56英寸 3.2倍潜望长焦（12cm长焦微距）'
ce: 'AI百变背屏 + Offset PoP 高导热封装'   cz: '3.2倍光变'   cv: null   fc: null
bc: 8500   bw: 100   bwl: 50   br: null
os: null   ui: 'Xiaomi HyperOS（超级小爱2.0 / MiMo）'   net: '5G'
wf: null   bt: null   nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null
ip: 'IP66/IP68/IP69'   bio: '3D超声波指纹'   spk: null
port: 'USB-C'   col: '星河蓝,冰桃粉,黑,白'
```
- 价格 6999/7999/8999/9999，透明特别版 16+1T=10999
- 注：小米 18 标准版**未发布**（卢伟冰称后续单独发布），不收录
- 来源：同上

#### 29. 小米 18 Fold ｜ id：`xiaomi-18-fold` ｜ tags：`['折叠屏','旗舰','潜望长焦']`

```
d: '2026-09'   lp: 10999   cp: 10999
ff: 'fold-mid'   fsz: 5.38   fres: '1712x1168'
sz: 7.58   res: '2364x1672（内屏，超级像素屏）'   ppi: null   mat: '可折叠AMOLED LTPO（内，双层UTG 50μm+30μm）+ 龙晶玻璃3.0（外）'
rr: 120   nit: 4000   dim: null   hdr: null
soc: '玄戒 O3'   sb: '小米'   pr: '3nm'
cpu: '10核全大核（2超大核+4Premium+4Pro）'   gpu: 'G2-Ultra NX 16核'
an: 5610000   rt: 'LPDDR6'   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 光影猎人HP5 1/1.56英寸 f/1.7 23mm OIS'
cw: '5000万像素 超广角 OV50M f/2.4 17mm 102°'
ct: '5000万像素 潜望长焦 JN5 f/2.8 80mm'
ce: '徕卡三摄 + AI灵感球'   cz: null   cv: null   fc: '1600万像素'
bc: 6000   bw: 67   bwl: 50   br: null
os: null   ui: 'Xiaomi HyperOS 4（澎湃OS）'   net: '5G（23个频段）'   wf: 'Wi-Fi 7'   bt: null
nfc: true   ir: true   sat: null
bdim: '展开163.8x117.8x5.02mm / 折叠117.8x83.6x10.68mm'   wt: 219
bm: '航天级7系铝合金中框 + 小米龙晶玻璃3.0'
ip: 'IP58/IP59'   bio: null   spk: null
port: 'USB-C'   col: null
```
- 发布 2026-09-07，开售 2026-09-10。价格 12+256=10999 / 12+512=11999 / 16+512=12999 / 16+1T=14999 / 陶瓷特别版16+1T=15999（限量）
- 形态：官方定义为 **「中折叠」**（折叠后护照大小），`ff` 先按 `fold-h` 归类，**是否单列为 fold-wide 请架构师确认**
- 来源：https://www.mi.com/prod/xiaomi-18-fold 、https://www.mi.com/global/discover/article?id=6357 、https://mobile.pconline.com.cn/2183/21830805.html 、https://www.itbear.com.cn/html/2026-10/1570646.html

#### 30. REDMI K90 ｜ id：`redmi-k90` ｜ tags：`['性价比','游戏手机','长续航']`

```
d: '2025-10'   lp: 2599   cp: 2599
ff: 'bar'
sz: 6.59   res: '2510x1156'   ppi: null   mat: '华星M10 OLED 直屏（超级像素 Real RGB）'
rr: 120   nit: 3500   dim: '全亮度类DC调光'   hdr: 'HDR10+'
soc: '骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 光影猎人800 1/1.55英寸 OIS'
cw: '800万像素超广角（OV08F）'
ct: '5000万像素长焦（OV50M 1/2.88英寸）'
cz: null   cv: null   fc: '2000万像素（OV20B40）'
bc: 7100   bw: 100   bwl: 0   br: '22.5W有线反充'
os: null   ui: 'Xiaomi HyperOS 3.0'   net: '5G'   wf: 'Wi-Fi 7'   bt: '5.4'
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: 'IP68/IP69'
bio: '超声波指纹'   spk: '双扬声器（BOSE联合调音）'
port: 'USB 3.2 Gen1 Type-C'   col: '白色,黑色,水蓝色,浅紫色'
```
- 发布 2025-10-23。价格 2599/2899/3199/3499/3999
- 来源：https://news.mydrivers.com/1/1081/1081976.htm 、https://baike.baidu.com/item/redmi%20K90

#### 31. REDMI K90 Pro Max ｜ id：`redmi-k90-pro-max` ｜ tags：`['性价比','旗舰','潜望长焦','长续航']`

```
d: '2025-10'   lp: 3999   cp: 3999
ff: 'bar'
sz: 6.9   res: '2K'   ppi: null   mat: 'OLED 直屏（2K Real RGB）'
rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 光影猎人950 1/1.31英寸 OIS'
cw: '5000万像素超广角'
ct: '5000万像素 5倍潜望长焦（OV50Q）'
ce: 'AI独显芯片D2 + BOSE 2.1声道（115F×2 + 1620低音）'
cz: '5倍光变'   cv: null   fc: '5000万像素'
bc: 7560   bw: 100   bwl: 50   br: '22.5W有线/无线反充'
os: null   ui: 'Xiaomi HyperOS 3'   net: '5G'   wf: 'Wi-Fi 7'   bt: '5.4'
nfc: true   ir: true   sat: null
bdim: '厚7.9mm'   wt: 218   bm: '玻纤后盖'
ip: 'IP68/IP69'   bio: '超声波指纹'   spk: '2.1立体声（BOSE联合调音）'
port: 'USB 3.2 Gen1 Type-C'   col: '黑色,白色,丹宁色,兰博基尼定制白'
```
- 来源：https://news.mydrivers.com/1/1081/1081976.htm 、https://www.yohohongkong.com/en-us/post/2088-Redmi-K90

#### 32. REDMI K90 Max ｜ id：`redmi-k90-max` ｜ tags：`['游戏手机','长续航','性价比']`

```
d: '2026-04'   lp: 2999   cp: 2999
ff: 'bar'
sz: 6.83   res: null   ppi: null   mat: 'OLED'
rr: 165   nit: null   dim: null   hdr: null
soc: '天玑9500'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 光影猎人800'   cw: '800万像素超广角'
ct: null   ce: 'D2独显芯片'   cz: null   cv: null   fc: '2000万像素'
bc: 8550   bw: 100   bwl: 0   br: '22.5W反充'
os: null   ui: 'Xiaomi HyperOS 3'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: 227   bm: null   ip: 'IP66/IP68/IP69'
bio: null   spk: null   port: 'USB-C'   col: null
```
- 发布 2026-04-21。价格 2999/3499/3999/4699。定位游戏性能旗舰（`Max > 至尊`）
- 来源：https://baike.baidu.com/item/redmi%20K90 、https://www.yohohongkong.com/en-us/post/2088-Redmi-K90

#### 33. REDMI K90 至尊版 ｜ id：`redmi-k90-ultra` ｜ tags：`['游戏手机']`

- **未查到，待确认**。官方（卢伟冰）仅透露「K90 至尊版也还有」，截至 2026-10 未检索到发布信息。

---

### B.5 vivo / iQOO（10 款）

#### 34. vivo X300 ｜ id：`vivo-x300` ｜ tags：`['旗舰','影像旗舰','小屏','潜望长焦']`

```
d: '2025-10'   lp: 4399   cp: 4599
ff: 'bar'
sz: 6.31   res: '2640x1216'   ppi: null   mat: 'AMOLED 直屏（京东方 1.5K）'
rr: 120   nit: null   dim: null   hdr: null
soc: '天玑9500'   sb: '联发科'   pr: '3nm'
cpu: '1×C1-Ultra 4.21GHz + 3×C1-Premium 3.5GHz + 4×C1-Pro 2.7GHz'
gpu: 'G1-Ultra'   an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 蔡司超级主摄（三星HPB）'
cw: '5000万像素超广角'
ct: '5000万像素 蔡司APO 3倍潜望长焦'
ce: '蓝图影像芯片 V3+'   cz: '3倍光变'   cv: '4K60 电影级人像'   fc: null
bc: 6040   bw: 90   bwl: 40   br: null
os: 'Android 16'   ui: 'OriginOS 6'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: '厚7.95mm'   wt: 190   bm: null   ip: 'IP68/IP69'
bio: '屏下指纹'   spk: null   port: 'USB-C'
col: '幸运彩,自在蓝,惬意紫,纯粹黑'
```
- 发布 2025-10-13，开售 2025-10-17。价格 4399（12+256）→ 2026-03 起渠道回涨至 4599
- 来源：https://cj.sina.com.cn/articles/view/7857141524/1d452771401901lvrm 、https://geekchamp.com/vivo-x300-and-x300-pro-launch-price-and-specifications/ 、https://www.sina.cn/gc/article/niuirnu6496723.html

#### 35. vivo X300 Pro ｜ id：`vivo-x300-pro` ｜ tags：`['旗舰','影像旗舰','潜望长焦']`

```
d: '2025-10'   lp: 5299   cp: 5299
ff: 'bar'
sz: 6.78   res: '2800x1260'   ppi: null   mat: 'AMOLED'
rr: 120   nit: null   dim: null   hdr: null
soc: '天玑9500'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: 'G1-Ultra'
an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 蔡司云台级主摄'
cw: '5000万像素超广角'
ct: '2亿像素 蔡司APO超级潜望长焦'
ce: '蓝图影像芯片 V3+ / VS1'   cz: null   cv: '4K60 电影级人像'   fc: null
bc: 6510   bw: 90   bwl: 40   br: null
os: 'Android 16'   ui: 'OriginOS 6'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: '北斗卫星通信（卫星通信版）'
bdim: null   wt: 226   bm: null   ip: 'IP68/IP69'
bio: '屏下指纹'   spk: null   port: 'USB-C'
col: '旷野棕,自在蓝,纯粹黑,简单白'
```
- 价格 5299 起（12+256），另有 16+1T 卫星通信版
- 来源：同上

#### 36. vivo X300s ｜ id：`vivo-x300s` ｜ tags：`['旗舰','影像旗舰','大屏']`

```
d: '2026-03'   lp: null   cp: null
ff: 'bar'
（其余字段均未查到，保持 null）
```
- **仅确认**：2026-03-30 发布，04-03 开售，定位大屏影像旗舰。**价格与参数未查到**
- 来源：https://hd.3bi0.com/wikipedia/w/index.php?oldid=92707096&title=Vivo_X300%E7%B3%BB%E5%88%97

#### 37. vivo X300 Ultra ｜ id：`vivo-x300-ultra` ｜ tags：`['旗舰','影像旗舰']`

```
d: '2026-03'   lp: null   cp: null
ff: 'bar'
（其余字段均未查到，保持 null）
```
- **仅确认**：与 X300s 同期（2026-03-30）亮相。**价格与参数未查到**
- 来源：同上

#### 38. vivo X500 ｜ id：`vivo-x500` ｜ tags：`['旗舰','影像旗舰','长续航']`

```
d: '2026-09'   lp: 5499   cp: 5499
ff: 'bar'
sz: 6.59   res: '1.5K'   ppi: null   mat: '蔡司大师色彩屏'
rr: 144   nit: null   dim: null   hdr: null
soc: '天玑9600M'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12]   rom: [256,512,1024]
cm: '蓝图×索尼 LYTIA-828 1/1.28英寸 云台级防抖'
cw: null
ct: '6400万像素 蓝图×索尼 LYTIA-610（CIPA 5.5）'
ce: '蔡司增距镜G2（等效200mm）+ vivo随拍屏'
cz: null   cv: '4K120fps 慢动作 / 4K120 10bit Log / 8K原生Live'
fc: null
bc: 7500   bw: 90   bwl: 40   br: null
os: null   ui: 'OriginOS 7'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: null
bio: null   spk: null   port: 'USB-C'
col: '大地回声,晴天,晨曦,摄夜'
```
- 发布 2026-09-21，09-24 开售。价格 5499/5999/6999
- 来源：https://www.cjrbapp.cjn.cn/p/46950822.html 、https://cj.sina.cn/articles/view/7879996425/1d5af340906803zq8c

#### 39. vivo X500 Pro ｜ id：`vivo-x500-pro` ｜ tags：`['旗舰','影像旗舰','小屏']`

```
d: '2026-09'   lp: 6499   cp: 6499
ff: 'bar'
sz: 6.36   res: null   ppi: null   mat: '蔡司大师色彩屏'
rr: 120   nit: null   dim: null   hdr: null
soc: '天玑9600 Pro'   sb: '联发科'   pr: '2nm'   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12]   rom: [256,512,1024]
cm: '蓝图光御900 蔡司超动态主摄（全球首发）'
cw: null   ct: null
ce: '电影模式 / 自动运镜 / AI一键高光'
cz: null   cv: '4K120fps'   fc: null
bc: 6510   bw: 90   bwl: 40   br: null
os: null   ui: 'OriginOS 7'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: 192   bm: null   ip: 'IP68/IP69'
bio: '3D超声波屏下指纹'   spk: null   port: 'USB-C'
col: '大地回声,晴天,览霞,摄夜'
```
- 发布 2026-09-21，09-29 开售。价格 6499/7499/8499
- 来源：https://www.toutiao.com/article/7688213463025402406/ 、https://www.cet.com.cn/wzsy/cyzx/10599787.shtml

#### 40. vivo X500 Pro Max ｜ id：`vivo-x500-pro-max` ｜ tags：`['旗舰','影像旗舰','大屏','长续航']`

```
d: '2026-09'   lp: 6999   cp: 6999
ff: 'bar'
sz: 6.85   res: '2K'   ppi: null   mat: '京东方Q11 2K 蔡司大师色彩屏'
rr: 120   nit: null   dim: null   hdr: null
soc: '天玑9600 Pro'   sb: '联发科'   pr: '2nm'   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '蓝图光御900 蔡司超动态主摄'
cw: null
ct: '2亿像素 蔡司APO超级长焦（三星HPO）'
ce: '10bit 422 APV / ACES / Log'
cz: null   cv: '4K240fps 电影级慢动作 / 8K原生Live'   fc: null
bc: 8000   bw: null   bwl: null   br: null
os: null   ui: 'OriginOS 7'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: '卫星通信（创作者套装版）'
bdim: null   wt: null   bm: null   ip: 'IP68/IP69'
bio: '3D超声波屏下指纹'   spk: null   port: 'USB-C'
col: '大地回声,晴天,览霞,摄夜'
```
- 发布 2026-09-21，09-24 开售。价格 6999/7999/8499/8999；创作者套装（16+1T 卫星通信版）12999
- 来源：https://news.hubeidaily.net/pc/c_6004632.html 、https://view.inews.qq.com/a/20260922A03WRL00

#### 41. iQOO 15 ｜ id：`iqoo-15` ｜ tags：`['游戏手机','旗舰','潜望长焦']`

```
d: '2025-10'   lp: 4599   cp: 4599
ff: 'bar'
sz: 6.85   res: '3168x1440'   ppi: 508   mat: 'AMOLED 直屏（2K三星珠峰屏）'
rr: 144   nit: null   dim: null   hdr: 'HDR10+'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'
cpu: '2×4.6GHz + 6×3.62GHz'   gpu: 'Adreno 840'
an: null   rt: 'LPDDR5X Ultra 四通道'   ft: 'UFS 4.1'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 索尼超防抖大底主摄 f/1.88 OIS'
cw: '5000万像素超广角 f/2.05'
ct: '5000万像素 索尼超级潜望长焦 f/2.65 OIS'
ce: '自研电竞芯片Q3 + 战锤MAX双轴马达'
cz: '100倍数字变焦'   cv: '8K'   fc: '3200万像素 f/2.2'
bc: 7000   bw: 100   bwl: 40   br: '支持无线反充'
os: 'Android 16'   ui: 'OriginOS 6'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: null
bdim: '163.65x76.8x8.1mm'   wt: 215   bm: '铝合金中框 + 玻纤/玻璃后盖'
ip: null   bio: '超声波3D指纹 + Face Wake'   spk: '立体声双扬声器'
port: 'USB-C'   col: '传奇版,赛道版,凌云,旷野,王者典藏版'
```
- 发布/上市 2025-10-20。ZOL 在售价 12+256=4599
- 来源：https://wap.zol.com.cn/2145/2144224/index.html

#### 42. iQOO 16 ｜ id：`iqoo-16` ｜ tags：`['游戏手机','旗舰','长续航']`

```
d: '2026'   lp: null   cp: null
ff: 'bar'
sz: 6.85   res: '2K'   ppi: null   mat: '三星M16 发光材料直屏'
rr: 165   nit: null   dim: null   hdr: null
soc: '第六代骁龙8超级至尊版'   sb: '高通'   pr: '2nm'   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null
ce: '自研电竞芯片Q4 + 8500mm² 单层VC冰穹散热'
cz: null   cv: null   fc: null
bc: 8400   bw: 100   bwl: 40   br: null
os: null   ui: 'OriginOS'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: null
```
- 定位 6000 元左右价位，**具体价格与影像参数未查到**；《王者荣耀》原生 165FPS 首发
- 来源：https://finance.sina.com.cn/tjhz/2026-09-30/doc-initqquz7024496.shtml

#### 43. iQOO Z11 Turbo ｜ id：`iqoo-z11-turbo` ｜ tags：`['游戏手机','性价比','轻薄']`

```
d: '2026-01'   lp: 2849   cp: 2849
ff: 'bar'
sz: null   res: null   ppi: null   mat: 'AMOLED'   rr: null   nit: null
dim: null   hdr: null
soc: '骁龙8 Gen5'   sb: '高通'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   ce: 'OIS防抖'
cz: null   cv: null   fc: null
bc: 5500   bw: 120   bwl: 0   br: null
os: null   ui: 'OriginOS'   net: '5G'   wf: null   bt: null
nfc: true   ir: true   sat: null
bdim: null   wt: 190   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: null
```
- 2026-01 发布，2849 元起，约 190g。**屏幕/影像/三围未查到**
- 来源：https://www.sina.cn/news/article/comos_niuksym4741619.html

---

### B.6 华为（9 款）

#### 44. 华为 Mate 80 ｜ id：`huawei-mate-80` ｜ tags：`['旗舰','长续航']`

```
d: '2025-11'   lp: 4699   cp: 5499
ff: 'bar'
sz: 6.75   res: null   ppi: null   mat: 'OLED'
rr: 120   nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟9020'   sb: '海思'   pr: '7nm级'   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 超光变摄像头'   cw: null   ct: null
ce: '第二代红枫原色摄像头'   cz: null   cv: '4K60'   fc: '1300万像素超广角'
bc: 5750   bw: 66   bwl: null   br: null
os: 'HarmonyOS 6'   ui: 'HarmonyOS'   net: '5G双模'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: '北斗卫星消息'
bdim: null   wt: null   bm: null   ip: null   bio: '3D人脸识别 + 屏下指纹'
spk: '立体声扬声器'   port: 'USB-C'
col: '晨曦金,云杉绿,雪域白,曜石黑'
```
- 发布 2025-11-25。价格 12+256=4699 / 12+512=5199 / 16+512=5499 / 16+1T=7299
- **2026-09 官方调价后 5499 元起**（故 `cp` 填 5499）
- 来源：https://baike.baidu.com/item/华为%20Mate%2080/67673447 、https://tech.ifeng.com/c/8wFjbYv0mCK

#### 45. 华为 Mate 80 Pro ｜ id：`huawei-mate-80-pro` ｜ tags：`['旗舰','影像旗舰']`

```
d: '2025-11'   lp: 5999   cp: 5999
ff: 'bar'
sz: 6.75   res: null   ppi: null   mat: 'OLED'   rr: 120   nit: null
dim: null   hdr: 'HDR Vivid'
soc: '麒麟9030（12GB）/ 麒麟9030 Pro（16GB）'   sb: '海思'   pr: null
cpu: null   gpu: null   an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 超光变摄像头'   cw: null   ct: null
ce: '第二代红枫原色摄像头'   cz: null   cv: '4K60'   fc: '1300万像素超广角'
bc: 5750   bw: 100   bwl: null   br: null
os: 'HarmonyOS 6'   ui: 'HarmonyOS'   net: '5G双模'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: '北斗卫星消息'
bdim: null   wt: null   bm: null   ip: null   bio: '3D人脸识别 + 屏下指纹'
spk: '立体声扬声器'   port: 'USB-C'   col: '晨曦金,云杉绿,雪域白,曜石黑'
```
- 价格 12+256=5999 / 12+512=6499 / 16+512=6999 / 16+1T=7999
- 来源：同上

#### 46. 华为 Mate 80 Pro Max ｜ id：`huawei-mate-80-pro-max` ｜ tags：`['旗舰','影像旗舰','大屏']`

```
d: '2025-11'   lp: 7999   cp: 7999
ff: 'bar'
sz: 6.9   res: null   ppi: null   mat: 'OLED 超透亮灵珑屏'
rr: 120   nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟9030 Pro'   sb: '海思'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [16]   rom: [512,1024]
cm: '5000万像素 超高动态摄像头'   cw: null   ct: null
ce: '第二代红枫原色摄像头'   cz: null   cv: '4K60'   fc: '1300万像素超广角'
bc: null   bw: 100   bwl: null   br: null
os: 'HarmonyOS 6'   ui: 'HarmonyOS'   net: '5G双模'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: '北斗卫星消息'
bdim: null   wt: null   bm: null   ip: null   bio: '3D人脸识别 + 屏下指纹'
spk: '立体声扬声器'   port: 'USB-C'
col: '极昼金,极光青,极地银,极夜黑'
```
- 价格 16+512=7999 / 16+1T=8999。**电池容量未查到**（系列口径 5750mAh，Pro Max 待确认）
- 来源：同上

#### 47. 华为 Mate 80 Pro Max 风驰版 ｜ id：`huawei-mate-80-pro-max-wind` ｜ tags：`['旗舰','影像旗舰']`

```
d: null   lp: 8499   cp: 8499
ff: 'bar'
sz: 6.9   res: null   ppi: null   mat: 'OLED 超透亮灵珑屏'   rr: 120
nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟9030 Pro'   sb: '海思'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: [16]   rom: [512,1024]
cm: '5000万像素 超高动态摄像头'   cw: null   ct: null   cz: null
cv: '4K60'   fc: '1300万像素超广角'
bc: null   bw: 100   bwl: null   br: null
os: 'HarmonyOS 6'   ui: 'HarmonyOS'   net: '5G双模'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: '极昼金,极夜黑'
```
- 后期增补机型，价格 16+512=8499 / 16+1T=9499。**发布日期未查到**
- 来源：https://tech.ifeng.com/c/8wFjbYv0mCK

#### 48. 华为 Mate 80 RS 非凡大师 ｜ id：`huawei-mate-80-rs` ｜ tags：`['旗舰','奢华']`

```
d: '2025-11'   lp: 11999   cp: 11999
ff: 'bar'
sz: 6.9   res: null   ppi: null   mat: 'OLED（第三代玄武钢化昆仑玻璃）'
rr: 120   nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟9030 Pro'   sb: '海思'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [20]   rom: [512,1024]
cm: '5000万像素 超高动态摄像头'   cw: null   ct: null
ce: '第二代红枫原色摄像头'   cz: null   cv: '4K60'   fc: '1300万像素超广角'
bc: null   bw: 100   bwl: null   br: null
os: 'HarmonyOS 6'   ui: 'HarmonyOS'   net: '5G双模'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: '北斗卫星消息 / 天通卫星通话'
bdim: null   wt: null   bm: '钛合金中框 + 陶瓷背板'   ip: null
bio: '3D人脸识别 + 屏下指纹'   spk: '立体声扬声器'
port: 'USB-C'   col: '玄黑,皓白,槿紫'
```
- 20GB 运存为行业首例。价格 20+512=11999 / 20+1T=12999
- 来源：https://tech.ifeng.com/c/8wFjbYv0mCK

#### 49. 华为 Mate X7 ｜ id：`huawei-mate-x7` ｜ tags：`['折叠屏','旗舰','影像旗舰']`

```
d: '2025-11'   lp: 12999   cp: 12999
ff: 'fold-h'   fsz: 6.49   fres: '2444x1080'
sz: 8   res: '2416x2210（内屏，412ppi）'   ppi: 412   mat: 'OLED LTPO 内折 + 第二代昆仑玻璃外屏'
rr: 120   nit: 3000   dim: '1440Hz PWM'   hdr: 'HDR Vivid'
soc: '麒麟9030 Pro'   sb: '海思'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 超光变摄像头 f/1.4-f/4.0 十档可变光圈 OIS'
cw: '4000万像素超广角 f/2.2'
ct: '5000万像素 长焦微距 f/2.2 OIS'
ce: '第二代红枫原色摄像头'
cz: '3.5倍光变 / 100倍数字'   cv: '4K30'   fc: '800万像素（内屏 f/2.2 + 外屏 f/2.4）'
bc: 5600   bw: 66   bwl: 50   br: '支持无线反充'
os: 'HarmonyOS 6.0'   ui: 'HarmonyOS'   net: '5G双模'
wf: 'Wi-Fi 7(802.11be)'   bt: '6.0'   nfc: true   ir: true
sat: '双向北斗卫星消息 / 天通卫星通话 / 卫星寻呼'
bdim: '展开156.8x144.2x4.5mm / 折叠156.8x73.8x9.5mm'   wt: 235
bm: '铝合金边框 + 素皮后壳'
ip: 'IP58/IP59'   bio: '屏幕指纹 + 面部识别'
spk: '立体声扬声器'   port: 'USB-C（USB 3.1 Gen1，DP1.2）'
col: '云锦白,云锦蓝,寰宇红,幻影紫,曜石黑'
```
- 发布 2025-11-25，上市 2025-12-05。价格 12+256=12999 / 12+512=13999 / 16+512典藏=14999 / 16+1T典藏=15999
- 来源：https://wap.zol.com.cn/2150/2149094/index.html

#### 50. 华为 Pura 90 ｜ id：`huawei-pura-90` ｜ tags：`['旗舰','影像旗舰','轻薄']`

```
d: '2026-04'   lp: 4699   cp: 4699
ff: 'bar'
sz: 6.8   res: '2856x1320'   ppi: 460   mat: 'OLED 直面屏（昆仑玻璃）'
rr: 120   nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟9010S'   sb: '海思'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512]
cm: '5000万像素 超聚光摄像头 f/1.8 OIS'
cw: '1250万像素超广角 f/2.2'
ct: '5000万像素 超聚光微距长焦 f/2.2 OIS'
ce: '红枫原色摄像头'
cz: '3.7倍光变 / 100倍数字'   cv: '4K60'   fc: '5000万像素 超聚光人像 f/2.0'
bc: 6500   bw: 100   bwl: 50   br: '5W无线反充'
os: 'HarmonyOS 6.1'   ui: 'HarmonyOS'   net: '5G双模'
wf: 'Wi-Fi 7(802.11be)'   bt: '6.0'   nfc: true   ir: true   sat: null
bdim: '163.1x78.1x7.0mm'   wt: 210   bm: '铝合金边框 + 锦纤后盖'
ip: 'IP68/IP69'   bio: '侧边指纹 + 面部识别'
spk: '立体声扬声器'   port: 'USB-C'   col: '丝绒黑,雪域白,罗兰紫'
```
- 发布 2026-04-20。价格 12+256=4699 / 12+512=5199 / 16+512=5699
- 来源：https://wap.zol.com.cn/2163/2162693/index.html 、https://baike.baidu.com/item/HUAWEI%20Pura%2090%E7%B3%BB%E5%88%97

#### 51. 华为 Pura 90 Pro ｜ id：`huawei-pura-90-pro` ｜ tags：`['旗舰','影像旗舰']`

```
d: '2026-04'   lp: 5499   cp: 5499
ff: 'bar'
sz: 6.6   res: '2760x1256'   ppi: 460   mat: 'OLED 直面屏（第二代昆仑玻璃）'
rr: 120   nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟9030S'   sb: '海思'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 超聚光摄像头 f/1.4-f/4.0 OIS'
cw: '1250万像素超广角 f/2.2'
ct: '5000万像素 超聚光微距长焦 f/2.1 OIS（5cm微距）'
ce: '第二代红枫原色摄像头'
cz: '4倍光变 / 100倍数字'   cv: '4K60'   fc: '1300万像素超广角 f/2.0'
bc: 6000   bw: 66   bwl: 50   br: '支持无线反充'
os: 'HarmonyOS 6.1'   ui: 'HarmonyOS'   net: '5G双模'
wf: 'Wi-Fi 7(802.11be)'   bt: '6.0'   nfc: true   ir: true   sat: null
bdim: '157.8x74.5x8.2mm'   wt: 213.5   bm: '铝合金边框 + 铝硅玻璃后盖'
ip: 'IP68/IP69'   bio: '侧边指纹 + 面部识别'
spk: '立体声扬声器'   port: 'USB-C'
col: '桑果黑,椰青白,橘子汽水,粉红芭乐'
```
- 上市 2026-04-22。价格 12+256=5499 / 12+512=5999 / 16+512=6499 / 16+1T=7499
- 来源：https://wap.zol.com.cn/2163/2162804/index.html

#### 52. 华为 Pura 90 Pro Max ｜ id：`huawei-pura-90-pro-max` ｜ tags：`['旗舰','影像旗舰','潜望长焦']`

```
d: '2026-04'   lp: null   cp: null
ff: 'bar'
sz: 6.9   res: null   ppi: null   mat: 'OLED 直面屏（抗反光耐刮昆仑玻璃）'
rr: 120   nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟9030S'   sb: '海思'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: null
cm: '5000万像素 超聚光摄像头'   cw: null
ct: '2亿像素 潜望长焦'
ce: '第二代红枫原色摄像头'   cz: null   cv: '4K60'   fc: null
bc: null   bw: 100   bwl: 80   br: null
os: 'HarmonyOS 6.1'   ui: 'HarmonyOS'   net: '5G双模'   wf: 'Wi-Fi 7'
bt: '6.0'   nfc: true   ir: true   sat: null
bdim: null   wt: null   bm: null   ip: 'IP68/IP69'   bio: null
spk: null   port: 'USB-C'   col: null
```
- 2026-04-20 发布，顶配机型（系列取消 Pro+ / Ultra，由 Pro Max 担纲）。
- **首发价、电池、三围/重量未查到**；仅确认 6.9 英寸、2 亿像素长焦、100W 有线 + 80W 无线
- 来源：https://baike.baidu.com/item/HUAWEI%20Pura%2090%E7%B3%BB%E5%88%97

---

### B.7 三星（7 款）

> 说明：三星 2026 年新品国行价格口径较乱（多为美元/卢比/卢布报价），下表中国行价仅在明确检索到时填写，其余 **保持 null**。

#### 53. 三星 Galaxy S26 ｜ id：`samsung-galaxy-s26` ｜ tags：`['旗舰','小屏']`

```
d: '2026-02'   lp: null   cp: null
ff: 'bar'
sz: 6.3   res: null   ppi: null   mat: 'Dynamic AMOLED 2X'   rr: 120
nit: null   dim: null   hdr: 'HDR10+'
soc: '骁龙8 Elite Gen5 for Galaxy'   sb: '高通'   pr: '3nm'
cpu: '八核（4.74GHz + 3.6GHz）'   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256,512]
cm: '5000万像素主摄'   cw: '1200万像素超广角'
ct: '1000万像素 3倍长焦'
cz: '3倍光变'   cv: null   fc: null
bc: 4300   bw: 25   bwl: 15   br: null
os: 'Android 16'   ui: 'One UI 8.5'   net: '5G'   wf: 'Wi-Fi 7'   bt: '5.4'
nfc: true   ir: false   sat: null
bdim: null   wt: 167   bm: null   ip: 'IP68'   bio: '超声波屏下指纹'
spk: null   port: 'USB-C'   col: null
```
- 2026-02 发布。**国行价格未查到**（美版 $899.99 起）
- 来源：https://geekblog.net/tech-news/the-best-samsung-phones-of-2026-tested-and-reviewed/ 、https://pakistanpost.pk/latest-samsung-galaxy-phones-in-pakistan-prices-specs

#### 54. 三星 Galaxy S26+ ｜ id：`samsung-galaxy-s26-plus` ｜ tags：`['旗舰','大屏']`

```
d: '2026-02'   lp: null   cp: null
ff: 'bar'
sz: 6.7   res: 'QHD+'   ppi: null   mat: 'Dynamic AMOLED 2X'   rr: 120
nit: null   dim: null   hdr: 'HDR10+'
soc: '骁龙8 Elite Gen5 for Galaxy'   sb: '高通'   pr: '3nm'
cpu: null   gpu: null   an: null   rt: null   ft: null
ram: [12]   rom: [256,512]
cm: '5000万像素主摄'   cw: '1200万像素超广角'   ct: '1000万像素 3倍长焦'
cz: '3倍光变'   cv: null   fc: null
bc: 4900   bw: 45   bwl: 15   br: null
os: 'Android 16'   ui: 'One UI 8.5'   net: '5G'   wf: 'Wi-Fi 7'   bt: '5.4'
nfc: true   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: 'IP68'   bio: '超声波屏下指纹'
spk: null   port: 'USB-C'   col: null
```
- 来源：同上

#### 55. 三星 Galaxy S26 Ultra ｜ id：`samsung-galaxy-s26-ultra` ｜ tags：`['旗舰','影像旗舰','大屏']`

```
d: '2026-02'   lp: null   cp: null
ff: 'bar'
sz: 6.9   res: 'QHD+'   ppi: null   mat: 'Dynamic AMOLED 2X（Privacy Display，康宁大猩猩Armor 2）'
rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '骁龙8 Elite Gen5 for Galaxy'   sb: '高通'   pr: '3nm'
cpu: null   gpu: null   an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素主摄 可变光圈 f/1.4-f/4.0'
cw: '5000万像素超广角'
ct: '5000万像素长焦'
ce: 'S Pen 支持'
cz: '3倍光变'   cv: '8K'   fc: null
bc: 5000   bw: 60   bwl: 25   br: null
os: 'Android 16'   ui: 'One UI 8.5'   net: '5G（支持eSIM）'   wf: 'Wi-Fi 7'
bt: '5.4'   nfc: true   ir: false   sat: null
bdim: '厚7.9mm'   wt: 214   bm: null   ip: 'IP68'   bio: '超声波屏下指纹'
spk: null   port: 'USB-C'   col: null
```
- **国行价格未查到**（媒体预估约 10000-12000 元，非官方口径，不填）。美版 $1299.99 起
- 来源：https://geekblog.net/tech-news/the-best-samsung-phones-of-2026-tested-and-reviewed/ 、https://www.sina.cn/news/article/comos_nisvytp5745555.html

#### 56. 三星 Galaxy S26 FE ｜ id：`samsung-galaxy-s26-fe` ｜ tags：`['旗舰','性价比']`

```
d: '2026-09'   lp: null   cp: null
ff: 'bar'
sz: 6.7   res: null   ppi: null   mat: 'Dynamic AMOLED 2X'   rr: 120
nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [128,256]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 4900   bw: null   bwl: null   br: null
os: 'Android 16'   ui: 'One UI 8.5'   net: '5G'   wf: null   bt: null
nfc: true   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: 'IP68'   bio: null
spk: null   port: 'USB-C'   col: null
```
- 2026-09-04 上市（美版 $699.99 起）。**处理器与国行价格未查到**
- 来源：https://geekblog.net/tech-news/the-best-samsung-phones-of-2026-tested-and-reviewed/

#### 57. 三星 Galaxy Z Fold8 ｜ id：`samsung-galaxy-z-fold8` ｜ tags：`['折叠屏','旗舰']`

```
d: '2026-07'   lp: 12999   cp: 12999
ff: 'fold-h'   fsz: 5.5   fres: '1248x1972'
sz: 7.6   res: '1848x2448（内屏，403ppi）'   ppi: 403   mat: 'Dynamic AMOLED 2X 内折'   rr: 120
nit: 3000   dim: null   hdr: 'HDR10+'
soc: '第五代骁龙8至尊版 for Galaxy'   sb: '高通'   pr: '3nm'
cpu: null   gpu: null   an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 广角 f/1.8 Dual Pixel AF OIS（2倍光学品质变焦）'
cw: '5000万像素 超广角 f/1.9 120°'   ct: null
cz: '2倍光学品质变焦 / 10倍数码'   cv: '8K'   fc: '1000万像素（外屏 f/2.2）+ 1000万像素（内屏 f/2.2）'
bc: 4800   bw: 45   bwl: 20   br: '支持 Wireless PowerShare'
os: 'Android 17'   ui: 'One UI 9'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: false   sat: null
bdim: '展开161.4x123.9x4.5mm / 折叠81.9x123.9x9.7mm'   wt: 201
bm: null   ip: 'IP48'
bio: '侧边指纹'   spk: null   port: 'USB-C'   col: '石墨灰,奶油白,薰衣紫'
```
- 2026-07 发布，国行 12999 元
- 来源：https://news.samsung.com/global/samsung-galaxy-z-fold8-ultra-fold8-and-flip8foldables-perfected-for-every-way-of-living 、https://www.sina.cn/news/article/comos_nisvytp5745555.html

#### 58. 三星 Galaxy Z Fold8 Ultra ｜ id：`samsung-galaxy-z-fold8-ultra` ｜ tags：`['折叠屏','旗舰']`

```
d: '2026-07'   lp: 15999   cp: 15999
ff: 'fold-h'   fsz: 6.5   fres: '1080x2520'
sz: 8   res: '2504x2256（内屏，422ppi）'   ppi: 422   mat: 'Dynamic AMOLED 2X 内折'   rr: 120
nit: 3000   dim: null   hdr: 'HDR10+'
soc: '第五代骁龙8至尊版 for Galaxy'   sb: '高通'   pr: '3nm'
cpu: null   gpu: null   an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '2亿像素 广角 f/1.7 Quad Pixel AF OIS（2倍光学品质变焦）'
cw: '5000万像素 超广角 f/1.9 120°'
ct: '1000万像素 3倍长焦 f/2.4 PDAF OIS'
cz: '3倍光变'   cv: '8K / APV编解码'   fc: '1000万像素（外屏 f/2.2）+ 1000万像素（内屏 f/2.2）'
bc: 5000   bw: 45   bwl: 20   br: '支持 Wireless PowerShare'
os: 'Android 17'   ui: 'One UI 9'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: false   sat: null
bdim: '展开143.2x158.4x4.1mm / 折叠72.8x158.4x8.9mm'   wt: 215
bm: null   ip: 'IP48'   bio: '侧边指纹'   spk: null
port: 'USB-C'   col: '石墨灰,奶油白,鸢尾紫'
```
- 国行 15999 元
- 来源：https://news.samsung.com/global/samsung-galaxy-z-fold8-ultra-fold8-and-flip8foldables-perfected-for-every-way-of-living 、https://www.sina.cn/news/article/comos_nisvytp5745555.html

#### 59. 三星 Galaxy Z Flip8 ｜ id：`samsung-galaxy-z-flip8` ｜ tags：`['折叠屏','小屏']`

```
d: '2026-07'   lp: 8999   cp: 8999
ff: 'fold-v'   fsz: 4.1   fres: '948x1048'
sz: 6.9   res: '1080x2520（内屏，400ppi）'   ppi: 400   mat: 'Dynamic AMOLED 2X 竖折'   rr: 120
nit: null   dim: null   hdr: 'HDR10+'
soc: 'Exynos 2600'   sb: '三星'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256,512]
cm: '5000万像素 广角 f/1.8 Dual Pixel AF OIS（2倍光学品质变焦）'
cw: '1200万像素 超广角 f/2.2 123°'   ct: null
cz: '2倍光学品质变焦 / 10倍数码'   cv: '4K60'   fc: '1000万像素 f/2.2'
bc: 4300   bw: 25   bwl: 15   br: '支持 Wireless PowerShare'
os: 'Android 17'   ui: 'One UI 9'   net: '5G'   wf: 'Wi-Fi 7'   bt: '5.4'
nfc: true   ir: false   sat: null
bdim: '展开75.4x166.9x6.1mm / 折叠75.4x85.7x13.1mm'   wt: 180
bm: null   ip: 'IP48'   bio: '侧边指纹'
spk: null   port: 'USB-C（USB 3.2 Gen1）'   col: '石墨灰,奶油白,樱花粉'
```
- 国行 8999 元，智能外屏（FlexWindow）支持 AI 即时简报
- 冲突提示：三星官方新闻稿标 **Exynos 2600**，部分零售页写「骁龙 8 Elite Gen 5 for Galaxy」，已按官方采信
- 来源：https://news.samsung.com/global/samsung-galaxy-z-fold8-ultra-fold8-and-flip8foldables-perfected-for-every-way-of-living 、https://www.samsung.com/uk/smartphones/galaxy-z-flip8/specs/ 、https://www.sina.cn/news/article/comos_nisvytp5745555.html

---

### B.8 realme（2 款）

#### 60. realme GT8 ｜ id：`realme-gt8` ｜ tags：`['游戏手机','性价比','影像']`

```
d: '2025-10'   lp: 2899   cp: 2899
ff: 'bar'
sz: 6.79   res: '3136x1440'   ppi: 508   mat: 'AMOLED 直屏'
rr: 144   nit: 7000   dim: null   hdr: 'HDR10+'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'
cpu: '八核 最高4.32GHz'   gpu: 'Adreno 830'
an: null   rt: 'LPDDR5X'   ft: 'UFS 4.0'
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 理光GR防眩光主摄 索尼IMX896 1/1.56英寸 24mm f/1.8 两轴OIS'
cw: '800万像素超广角 16mm 112°'
ct: '5000万像素长焦 80mm f/2.8 两轴OIS'
cz: '3.5倍光变 / 120倍数字'   cv: '8K30 / 4K120'
fc: '1600万像素 23mm f/2.4'
bc: 7000   bw: 100   bwl: 0   br: null
os: 'Android 15'   ui: 'realme UI 6.0'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: null
bdim: '161.8x76.87x8.2mm'   wt: 214   bm: null   ip: null
bio: '超声波屏下指纹 + 面部识别'   spk: '超线性双扬声器'
port: 'USB Type-C'   col: '怀特,纳维,格林'
```
- 发布/上市 2025-10-21。价格 2899/3199/3399/3599/4099
- 来源：https://wap.zol.com.cn/2146/2145214/index.html

#### 61. realme GT8 Pro ｜ id：`realme-gt8-pro` ｜ tags：`['游戏手机','旗舰','潜望长焦']`

```
d: '2025-10'   lp: null   cp: 3999
ff: 'bar'
sz: 6.79   res: 'QHD+ 2K'   ppi: null   mat: '京东方Q10+ 直屏'
rr: 144   nit: 7000   dim: '全亮度DC调光'   hdr: 'HDR10+'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: null   ft: null
ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 理光GR主摄'   cw: '超广角'
ct: '2亿像素 潜望长焦'
ce: '电竞独显芯片R1 + 7000mm² VC液冷'
cz: null   cv: null   fc: null
bc: 7000   bw: 120   bwl: 50   br: null
os: 'Android 16'   ui: 'realme UI 7.0'   net: '5G'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: true   ir: true   sat: null
bdim: null   wt: 210   bm: null   ip: 'IP68/IP69'
bio: '超声波屏下指纹'   spk: null   port: 'USB-C'   col: null
```
- **首发价未查到**（ZOL/新浪口径参考价 3999 元，已写入 `cp`；`lp` 保持 null）
- 来源：https://t.cj.sina.com.cn/articles/view/6256359551/174e8787f00101dz9a 、https://finance.sina.com.cn/tjhz/2026-09-30/doc-initqquz7024496.shtml

---

### B.9 努比亚 / 红魔（2 款）

#### 62. 红魔 11 Pro ｜ id：`nubia-redmagic-11-pro` ｜ tags：`['游戏手机','长续航','全面屏']`

```
d: '2025-10'   lp: null   cp: 4999
ff: 'bar'
sz: 6.85   res: '1216x2688'   ppi: 431   mat: 'AMOLED 无孔全面屏（京东方X10 悟空屏2.0）'
rr: 144   nit: null   dim: null   hdr: 'HDR10+'
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'
cpu: '2×4.6GHz + 6×3.62GHz'   gpu: 'Adreno 840'
an: null   rt: null   ft: null
ram: [12,16,24]   rom: [256,512,1024]
cm: '5000万像素主摄 OIS'   cw: '5000万像素超广角'
ct: null   ce: '自研红芯R4 + ICE魔冷散热'
cz: null   cv: '8K30 / 4K120'   fc: '1600万像素屏下'
bc: 8000   bw: 80   bwl: 80   br: null
os: 'Android 16'   ui: 'RedMagic OS 11'   net: '5G'   wf: 'Wi-Fi 7'   bt: '5.4'
nfc: true   ir: false   sat: null
bdim: '163.8x76.5x8.9mm'   wt: 230   bm: null   ip: null
bio: '屏下超声波指纹'   spk: null
port: 'USB-C 3.2 Gen2（含配件接口/DP）'   col: null
```
- 发布 2025-10-17。**首发价未查到**（新浪口径参考价 4999 元，写入 `cp`）
- 来源：https://whatmobilepk.com/compare/realme-gt-8-vs-redmagic-11-pro 、https://t.cj.sina.com.cn/articles/view/6256359551/174e8787f00101dz9a

#### 63. 红魔 11S Pro ｜ id：`nubia-redmagic-11s-pro` ｜ tags：`['游戏手机','长续航']`

```
d: '2026-05'   lp: null   cp: 5849
ff: 'bar'
sz: 6.85   res: '1216x2688'   ppi: null   mat: 'AMOLED 无孔全面屏'   rr: 144
nit: null   dim: null   hdr: 'HDR10+'
soc: '第五代骁龙8至尊版领先版'   sb: '高通'   pr: '3nm'
cpu: null   gpu: null   an: null   rt: null   ft: null
ram: [12,16,24]   rom: [256,512,1024]
cm: null   cw: null   ct: null   ce: '12000mm² 散热'
cz: null   cv: '8K30'   fc: null
bc: 6500   bw: 80   bwl: null   br: null
os: null   ui: 'RedMagic OS'   net: '5G'   wf: null   bt: null
nfc: true   ir: false   sat: null
bdim: null   wt: 230   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: null
```
- 2026-05 发布，参考价 5849 元。**首发价与影像参数未查到**
- 来源：https://www.sina.cn/news/article/comos_niuksym4741619.html

---

### B.10 平板（新品类，10 款 + 1 条占位）

> **平板与手机在参数字段上的差异说明（给工程同学）**
>
> 1. **可直接复用**的字段：`sz`(屏幕尺寸)、`res`、`ppi`、`mat`、`rr`、`nit`、`dim`、`hdr`、`soc`、`sb`、`pr`、`cpu`、`gpu`、`an`、`rt`、`ft`、`ram`、`rom`、`cm`(后置主摄)、`fc`(前置)、`bc`、`bw`、`bwl`、`os`、`ui`、`net`、`wf`、`bt`、`bdim`、`wt`、`bm`、`ip`、`bio`、`spk`、`port`、`col`。
> 2. **意义不同 / 需注意**：
>    - `net`：多数平板为 Wi-Fi 版，少数有 5G 版 → 建议写成「Wi-Fi版」/「Wi-Fi+5G」。
>    - `sat`：平板基本不支持 → 一律 `null`。
>    - `ir`（红外遥控）：平板不支持 → `false`。
>    - `nfc`：多数平板不支持（支付/门禁）→ 多数 `false`，少数支持。
>    - `wt`：平板重量普遍 400~700g，量级与手机不同，**对比表中的「重量排序/筛选」需注意量纲**，不要和手机混排。
>    - `bdim`：平板建议写「长x宽x厚」，与手机一致。
> 3. **现有字段缺失、建议新增**（当前 `CompactSeed` 没有对应键，暂用 `null` 或写入 `tags` 备注）：
>    - **手写笔支持**（Apple Pencil Pro / 小米焦点触控笔Pro / HUAWEI M-Pencil 等）→ 大部分平板的关键卖点，建议后续加 `pen` 字段。
>    - **键盘支持**（妙控键盘 / 官方磁吸键盘）→ 建议加 `kbd` 字段。
>    - **外屏尺寸**（仅折叠屏手机有，平板无此项；反之折叠屏需 `sz2`）。
>    - **扬声器数量**（平板常见 4/6/8 扬声器）→ 现有 `spk` 是字符串，可写「六扬声器（杜比全景声）」。
>    - **是否有蜂窝版 / SIM**：建议加 `cellular` 布尔字段。
> 4. **建议的分类方式**：平板建议新增一个 `category: 'tablet'` 维度（或用 `tags` 加「平板」标记），否则会与手机混在同一列表里按重量/尺寸排序，体验会很怪。
> 5. `cz`(变焦)、`ct`(长焦)、`cw`(超广角)：平板基本无多摄，一律 `null`。

#### 64. iPad Pro（M5，11/13 英寸）｜ id：`ipad-pro-m5-13` ｜ tags：`['平板','旗舰','生产力']`

```
d: null   lp: 10799   cp: 10799
cat: 'tablet'
ff: 'slate'
sz: 13   res: null   ppi: null   mat: '超精视网膜 XDR（ProMotion 自适应刷新率）'
rr: 120   nit: null   dim: null   hdr: '杜比视界 / HDR10'
soc: 'Apple M5'   sb: 'Apple'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: [256,512,1024,2048]
cm: '1200万像素广角'   cw: null   ct: null   cz: null
cv: '4K ProRes'   fc: '1200万像素 Center Stage（横向）+ 原深感'
bc: null   bw: null   bwl: null   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 7'
bt: '6.0'   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null
bio: '面容ID（原深感）'   spk: '四扬声器'   port: 'USB-C（雷雳）'
col: null
```
- 另有 11 英寸版本（建议 id `ipad-pro-m5-11`）。支持 Apple Pencil Pro / Apple Pencil(USB-C) / 妙控键盘
- **发布日期未查到**（苹果官网仅列在售，M5 款为 2025 年秋季更新；`d` 保持 null，待确认）
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-pro/ME6J4CH/A

#### 65. iPad Air（M4，11/13 英寸）｜ id：`ipad-air-m4-11` ｜ tags：`['平板','主流']`

```
d: '2026'   lp: 5999   cp: 5999
cat: 'tablet'
ff: 'slate'
sz: 11   res: null   ppi: null   mat: 'Liquid 视网膜显示屏（不支持 ProMotion）'
rr: 60   nit: null   dim: null   hdr: null
soc: 'Apple M4'   sb: 'Apple'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: [128,256,512,1024]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'
fc: '1200万像素 Center Stage（横向）'
bc: null   bw: null   bwl: null   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'
bt: '5.3'   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null
bio: '触控ID'   spk: '双扬声器'   port: 'USB-C'   col: null
```
- 认证型号 A3459（京东标注「2026年新款」）；11 英寸 512GB 京东 ¥8199、1TB ¥11799
- 另有 13 英寸版本（建议 id `ipad-air-m4-13`）
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-air/MM9N3CH/A

#### 66. iPad（A16，11 英寸）｜ id：`ipad-a16-11` ｜ tags：`['平板','入门']`

```
d: null   lp: 3799   cp: 3799
cat: 'tablet'
ff: 'slate'
sz: 11   res: null   ppi: null   mat: 'Liquid 视网膜显示屏（sRGB，无 ProMotion）'
rr: 60   nit: null   dim: null   hdr: null
soc: 'Apple A16'   sb: 'Apple'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: [128,256,512]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'
fc: '1200万像素 Center Stage（横向）'
bc: null   bw: null   bwl: null   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6'
bt: '5.3'   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: '触控ID'
spk: '双扬声器'   port: 'USB-C'   col: null
```
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-pro/ME6J4CH/A

#### 67. iPad mini（A17 Pro，8.3 英寸）｜ id：`ipad-mini-a17pro` ｜ tags：`['平板','小屏']`

```
d: null   lp: 4799   cp: 4799
cat: 'tablet'
ff: 'slate'
sz: 8.3   res: null   ppi: null   mat: 'Liquid 视网膜显示屏'
rr: 60   nit: null   dim: null   hdr: null
soc: 'Apple A17 Pro'   sb: 'Apple'   pr: '3nm'   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: [128,256,512]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'
fc: '1200万像素 Center Stage'
bc: null   bw: null   bwl: null   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'
bt: '5.3'   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: '触控ID'
spk: '双扬声器'   port: 'USB-C'   col: null
```
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-pro/ME6J4CH/A

#### 68. 小米平板 9 ｜ id：`xiaomi-pad-9` ｜ tags：`['平板','主流','长续航']`

```
d: '2026-09'   lp: 2999   cp: 2999
cat: 'tablet'
ff: 'slate'
sz: 11.2   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: 1000
dim: null   hdr: null
soc: '骁龙8s Gen4'   sb: '高通'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: 'UFS 4.1'
ram: [8,12]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null
fc: '800万像素'
bc: 9720   bw: 45   bwl: 0   br: '支持有线反充'
os: null   ui: 'HyperOS 4'   net: 'Wi-Fi'   wf: 'Wi-Fi 7'   bt: '6.0'
nfc: false   ir: false   sat: null
bdim: '厚5.75mm'   wt: 485   bm: null   ip: null
bio: '侧边指纹'   spk: '四扬声器（杜比全景声）'   port: 'USB-C'
col: '黑,冰桃粉,银,云杉绿'
```
- 发布 2026-09-23。价格 8+128=2999 / 8+256=3299 / 柔光版 8+256=3499 / 12+256=3799
- 支持小米焦点触控笔 Pro + 键盘配件
- 来源：https://gsmarena.com/newsdetail.php3?idNews=74740&c=10001 、https://www.gizmochina.com/page/11

#### 69. 小米平板 9 Pro ｜ id：`xiaomi-pad-9-pro` ｜ tags：`['平板','旗舰','生产力']`

```
d: '2026-09'   lp: 3799   cp: 3799
cat: 'tablet'
ff: 'slate'
sz: 12.5   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: 1000
dim: '全亮度DC调光'   hdr: null
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null
an: 3400000   rt: null   ft: 'UFS 4.1'
ram: [8,12,16]   rom: [128,256]
cm: '5000万像素'   cw: null   ct: null   cz: null   cv: null
fc: '3200万像素'
bc: 11000   bw: 67   bwl: 0   br: '22.5W有线反充'
os: null   ui: 'HyperOS 4（PC级 WPS / CapCut Pro）'   net: 'Wi-Fi'
wf: 'Wi-Fi 7'   bt: '6.0'   nfc: false   ir: false   sat: null
bdim: '厚5.8mm'   wt: 580   bm: null   ip: null
bio: '侧边指纹'   spk: '六扬声器 + 四麦克风'   port: 'USB-C'
col: '黑,银,云杉绿'
```
- 价格 8+128=3799 / 8+256=4099 / 12+256=4599 / 12+256 柔光版 / 16GB 顶配 4999
- 来源：同上

#### 70. 小米平板 9 Pro Max ｜ id：`xiaomi-pad-9-pro-max` ｜ tags：`['平板','旗舰','大屏']`

```
d: '2026-09'   lp: null   cp: null
cat: 'tablet'
ff: 'slate'
sz: 13.3   res: null   ppi: null   mat: 'LCD'   rr: null   nit: null
dim: null   hdr: null
soc: '玄戒 O3'   sb: '小米'   pr: null   cpu: null   gpu: null
an: null   rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: null   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null
nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: null
```
- 2026-09 上旬发布，小米首款自研芯片平板。**价格与详细参数未查到**
- 来源：https://www.gizmochina.com/page/11 、https://www.androidpure.com/xiaomi-pad-9-pro-price-specs/

#### 71. 华为 MatePad Pro 2026（12 英寸）｜ id：`huawei-matepad-pro-2026` ｜ tags：`['平板','旗舰','轻薄','生产力']`

```
d: '2026-08'   lp: 5999   cp: 5999
cat: 'tablet'
ff: 'slate'
sz: 12   res: '3036x1952'   ppi: null   mat: '柔性OLED'   rr: 144
nit: 1600   dim: null   hdr: 'HDR Vivid'
soc: '麒麟T93（标准版）/ 麒麟T93A（悦享版）'   sb: '海思'   pr: null
cpu: null   gpu: null   an: null   rt: null   ft: null
ram: [12]   rom: [256,512]
cm: '5000万像素 f/1.8 AF'   cw: null   ct: null   cz: null   cv: '1080p'
fc: '1200万像素 f/2.4'
bc: 10400   bw: 66   bwl: 0   br: '40W有线反充'
os: 'HarmonyOS 6.1'   ui: 'HarmonyOS'   net: 'Wi-Fi（无蜂窝版）'
wf: 'Wi-Fi 7+'   bt: '6.0'   nfc: false   ir: false   sat: null
bdim: '264.2x172.9x4.7mm'   wt: 439   bm: '金属一体成型'
ip: null   bio: '指纹识别'
spk: '四扬声器（HUAWEI Sound）+ 四麦克风'   port: 'USB-C'
col: '浮白,凝蓝,樱花粉,深空灰,明月银'
```
- 2026-08-05 国内发布，09-02 IFA 全球发布。价格：标准版 12+256=5999 / PaperMatte 版 7199；悦享版 5699 / PaperMatte 6499 / 12+512+键盘 7699
- 支持 HUAWEI M-Pencil（第二代低延迟）+ 键盘；Soft Light（柔光）版采用纳米蚀刻
- 来源：https://gsmarena.com/newsdetail.php3?idNews=74030&c=10001 、https://trotons.com/?p=44640

#### 72. 华为 MatePad Pro Max（13.2 英寸，2026 款）｜ id：`huawei-matepad-pro-max-2026` ｜ tags：`['平板','旗舰','大屏']`

```
d: '2026'   lp: null   cp: 7699
cat: 'tablet'
ff: 'slate'
sz: 13.2   res: null   ppi: null   mat: 'OLED'   rr: 144   nit: null
dim: null   hdr: 'HDR Vivid'
soc: null   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: null   br: null
os: 'HarmonyOS 6.1'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null
nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: null
```
- 电商在售价 7699 元（历史最低 7499）。**首发价、芯片型号、电池等未查到**，规格与 MatePad Pro 2026 高度接近
- 来源：https://s.click.taobao.com/t?e=...（华为华亲专卖店，MatePad Pro Max 13.2 英寸 2026 款）

#### 73. 三星 Galaxy Tab S11 ｜ id：`samsung-galaxy-tab-s11` ｜ tags：`['平板','旗舰']`

```
d: '2025-09'   lp: null   cp: 5799
cat: 'tablet'
ff: 'slate'
sz: 11   res: '2560x1600'   ppi: null   mat: 'AMOLED'   rr: 120
nit: null   dim: null   hdr: 'HDR10+'
soc: '天玑9400+'   sb: '联发科'   pr: '3nm'
cpu: '八核 3.73GHz'   gpu: null   an: null   rt: null   ft: null
ram: [12]   rom: [128,256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null
fc: '1200万像素'
bc: null   bw: null   bwl: null   br: null
os: 'Android'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 7'   bt: null
nfc: false   ir: false   sat: null
bdim: '厚5.5mm'   wt: null   bm: null   ip: null   bio: null   spk: null
port: 'USB-C'   col: '钛影灰,星熠银'
```
- 上市 2025-09-19。电商常卖价 5799（官方标价 6999），**首发价未查到**
- 另有 Tab S11 Ultra（更大屏），本次未检索到中国区具体规格
- 来源：https://s.click.taobao.com/t?e=...（三星官方旗舰店 Galaxy Tab S11）

#### 74. 荣耀平板 / OPPO Pad / vivo Pad / 一加平板 / REDMI K Pad

- ✅ **本条占位已作废，改为独立专项文件 `research/tablets.md`（113 款平板）**。
- 上一轮结论「这几家无可核实的已发布平板参数」是**错的**，本轮按「品牌+平板+年份+参数」逐代重搜后已全部补实：
  - **REDMI K Pad**：真实存在，2025-06-26 上市，8.8" 3K LCD 165Hz / 天玑9400+ / 7500mAh / 326g，小米商城在售 ¥3099（`research/tablets.md` #52）
  - 荣耀平板 8 / 9 / 9 Pro / 10 / 10 Pro / GT / GT Pro / V9 + MagicPad 2 / 3 / 3 Pro：共 14 条（#58-#71）
  - OPPO Pad 2 / 3 / 3 Pro / 4 Pro / 5 Pro / Pad Air + 一加平板 / Pro / 2 / 2 Pro / 3 Pro：共 11 条（#72-#82）
  - vivo Pad Air / Pad2 / Pad3 / Pad3 Pro / Pad5 Pro / Pad SE + iQOO Pad / Pad5 / Pad5 Pro / Pad5e / Pad Ultra：共 12 条（#83-#94）
- 平板调研窗口已从「2025-09 起」放宽到 **2023-01 ~ 2026-10**（平板是新品类，代码库现有 0 款，需覆盖约 3 年）。
- **平板数据请一律从 `research/tablets.md` 取，本文件的 #64-#73 仅作交叉索引。**

---

## C. 汇总与遗留问题

### C.1 数量统计

按分组统计（2026-10-14 复核后）：

| 分组 | 条目数 | 含 `ff` 字段 | 其中折叠机 |
|---|---:|---:|---:|
| B.1 Apple | 3 | 3 | 1（iPhone Duo） |
| B.2 荣耀 | 12 | 12 | 1（Magic V6） |
| B.3 OPPO / 一加 | 7 | 7 | 1（Find N6） |
| B.4 小米 / REDMI | 11 | 10（#33 无参数块） | 1（小米 18 Fold） |
| B.5 vivo / iQOO | 10 | 10 | 0 |
| B.6 华为 | 9 | 9 | 1（Mate X7） |
| B.7 三星 | 7 | 7 | 3（Fold8 / Fold8 Ultra / Flip8） |
| B.8 realme | 2 | 2 | 0 |
| B.9 努比亚 / 红魔 | 2 | 2 | 0 |
| **手机小计** | **63** | **62** | **8** |
| B.10 平板 | 10（另有 1 条占位 #74，已作废） | 10 | 0 |
| **合计** | **74** | **72** | **8** |
| 另有独立文件 | `research/tablets.md` **113 款平板** | 113 | 0 |

数据完整度（按是否已补齐官方参数）：

| 分组 | 参数较完整 | 大量 null（建议先留白） |
|---|---:|---|
| Apple | 3 | 0 |
| 荣耀 | 10 | 2（WIN RT / Power 2） |
| OPPO / 一加 | 6 | 1（Find X9 Ultra） |
| 小米 / REDMI | 10（18 Fold 本次已补齐） | 1（小米 17 Ultra） |
| vivo / iQOO | 9 | 1（iQOO 16） |
| 华为 | 9 | 0 |
| 三星 | 7（Fold8 / Fold8 Ultra / Flip8 本次已按官方新闻稿补齐） | 0 |
| realme | 2 | 0 |
| 努比亚 / 红魔 | 2 | 0 |
| 平板 | 8 | 2（MatePad Pro Max / Tab S11） |

### C.2 明确「不收录」的项（未发布 / 无可靠信源）

| 机型 | 状态 |
|---|---|
| iPhone 18（标准版）、iPhone 18e、iPhone Air 2 | 苹果 2026-09-10 秋季发布会**只发了 18 Pro / 18 Pro Max / iPhone Duo**，这三款官宣推迟至 **2027 年春季** |
| OPPO Find X10 Pro（非 Max） | 国行未发布，海外站标注 2026-11 上市（Upcoming） |
| 荣耀 Magic9 Pro / Magic9 至臻版 | **官方不存在这两款命名**，2026-09-28 发布的是 Magic9 / Magic9 Pro Max / Magic9 超能版 |
| 小米 18（标准版） | 卢伟冰称「后面会单独发布」，截至 2026-10 未发布 |
| 一加 16 | 未发布 |
| REDMI K90 至尊版 | 官方仅透露存在，未检索到发布信息 |
| vivo X400 系列 | 经核实 vivo 从 X300 直接跳到 **X500 系列**（2026-09-21），X400 不存在 |
| 小米 16 系列 | 小米已跳过 16 直接命名 17 系列 |
| ~~荣耀平板 / OPPO Pad / vivo Pad / 一加平板 / REDMI K Pad~~ | ❌ **此条已被推翻**。第二平板专项调研（2026-10-14）证明这五家均有大量已发布、可核实的在售平板，共补出 **113 款**，见 `research/tablets.md`。上一轮的错误原因是把调研窗口照搬了手机的「2025-09 起」，而平板是新品类、需要覆盖 2023-2026 |

### C.3 口径冲突（需要团队拍板的几处）

1. **iPhone 18 Pro / Pro Max 有线充电功率**：爱思助手标 40W；新浪报道称 Pro Max 最高 52W；苹果官方只给「15 分钟充至 50%（60W AVS 适配器）」。本报告统一填 40W，建议加数据说明。
2. **荣耀 Magic V6 有线充电**：ZOL 标 120W，荣耀官方与多家海外媒体标 **80W 有线 + 66W 无线**。本报告采用 80W。
3. **荣耀 Magic8 / Magic8 Pro 主摄光圈**：百度百科（标准版 f/1.9、Pro f/1.6）与 CNMO 报道（标准版 f/1.6、Pro 长焦 f/1.4）冲突。本报告采用百度百科口径。
4. **荣耀 Magic8 Pro 电池**：国行官方 7200mAh，海外电商库（mobile.bd）标 7100mAh。本报告采用国行 7200mAh。
5. **荣耀 500 起售价**：新浪口径 2699 元起（首发），ZOL 在售价 2999 元起。本报告 `lp`=2699、`cp`=2999。
6. **一加 15 起售价**：百度百科 3999 元起，ZOL 在售 4499 元起。本报告 `lp`=3999、`cp`=4499。
7. **三星 S26 系列国行价格**：仅检索到美元/卢比/卢布报价与媒体「预估 10000-12000 元」，**一律留 null**，不建议写预估价。

### C.3-bis 本次新增字段的落地要求（架构师 2026-10-14 提出）

1. `CompactSeed` / `PhoneSeed` / `Phone` 需要新增字段：
   - `cat`（品类，`'phone' | 'tablet' | 'laptop'`）—— 平板必填，缺了会报 `validate:data` 错
   - `ff`（形态，`bar` / `fold-h` / `fold-mid` / `fold-v` / `fold-wide` / `fold-triple` / `slate` / `detachable` / `clamshell`）
   - `fsz`（外屏尺寸，number | null）
   - `fres`（外屏分辨率，string | null）
   - `pen` / `kbd` / `cell`（平板三件套，见 `research/tablets.md` 第 2 节）
2. `ff` 必须**显式录入**，不要靠 `sz` 阈值推导——阔折叠 6.3" 比竖折叠展开态 6.9" 还小，阈值必然误判。
3. 「潜望长焦」筛选项的派生规则：`ct` 或 `cz` 文本含「潜望」即命中。本文件已保证：凡 tag 带「潜望长焦」的 20 条，`ct` 里都写了「潜望」二字。
4. 平板本批已按架构师拍板改完：**`cat: 'tablet'` + `ff: 'slate'` 双字段**（10 条全部改完）；#29 小米 18 Fold 已改为 `ff: 'fold-mid'`。
5. **平板完整数据请见独立文件 `research/tablets.md`（113 款，2023-2026）**，本文件 B.10 的 10 条仅作交叉索引，不再作为平板录入来源。

### C.4 给工程同学的落地建议

1. **优先补录顺序**：Apple（3）→ 华为 Mate 80 系列 + Mate X7 + Pura 90 系列（9）→ 小米 17/18 系列 + REDMI K90 系列（9）→ 荣耀 Magic8/9 系列 + 荣耀 500 + Magic V6（11）→ OPPO Find X9/X10 + 一加 15（7）→ vivo X300/X500 + iQOO 15（9）→ 三星（6）→ realme/红魔（4）。
2. **新增文件建议**：`src/data/phones/` 下新增 `tablets.ts`（或 `ipad.ts` / `tablet-android.ts`），并在机型上加「平板」tag；`src/data/prices.ts` 同步补 `jd` / `pdd` 参考价。
3. **平板字段**：当前 `CompactSeed` 缺手写笔/键盘/蜂窝版三个平板关键维度，建议先写进 `tags`（如「支持手写笔」「支持键盘」），后续再扩字段，避免动 `Phone` 类型。
4. **不要改现有代码**：本次只产出 markdown，录入由软件工程同学执行。