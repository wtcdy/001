# 三星（Samsung）品牌参数整包补齐（2026-10-15 批次）

执行人：samsung-data
改动文件：`src/data/phones/samsung.ts`（仅此一个文件，未动其他品牌、未提交 git）

---

## 0. 取证路径说明（纠正上一轮的错误路径）

三星中国官网 **https://www.samsung.com.cn/** 是商城门户，**参数正文在机型详情页 / 规格页**：

| 入口 | 示例 URL | 是否取到参数正文 |
|---|---|---|
| 规格参数页（推荐） | `https://www.samsung.com.cn/smartphones/galaxy-s26-ultra/specs/` | ✅ 完整规格表 |
| 机型详情页 | `https://www.samsung.com.cn/smartphones/galaxy-s26/` | ✅ 亮点文案 + FAQ（充电速度等） |
| A 系列商品页 | `https://www.samsung.com.cn/smartphones/galaxy-a/galaxy-a56-5g-awesome-lightgray-256gb-sm-a5660zacchc/` | ✅ 有商品文案，**无独立 /specs/ 页**（/specs/ 返回 404） |
| 官方支持页（反向充电口径） | `https://www.samsung.com.cn/support/mobile-devices/how-to-use-the-wireless-power-sharing-feature-on-your-galaxy-device/` | ✅ 支持机型清单 |

**三个关键结论：**

1. **S26 / S26+ / S26 Ultra 共用同一张规格页**（`galaxy-s26-ultra/specs/` 与 `galaxy-s26/specs/` 是同一张表），
   页面内有 `Galaxy S26 Ultra / S26+ / S26` 机型 Tab 与 `12GB+256GB` 等版本 Tab，
   **默认只渲染 S26 Ultra (12+256)**，必须逐个点击 Tab 才能取到各机型数值。
   上一轮「S26+ 抓不到」就是因为没切 Tab。
2. 规格页是**纯前端渲染**，`curl` 直取只能拿到约 440KB 的骨架（含 `<title>` 但无参数正文），
   本轮用带 JS 渲染的浏览器取正文。
3. **Galaxy S26 FE 在三星中国官网不存在**：`/smartphones/galaxy-s26-fe/` 与 `/specs/` 均 404，
   全量机型列表（70 条结果）也无此型号 → **国行未上市**，只能用三星官方国际源（见 §1.4）。

---

## 1. P0：三款最新旗舰的三围 / 重量（+ sz / res / nit）

### 1.1 samsung-galaxy-s26（三星 Galaxy S26）
来源：https://www.samsung.com.cn/smartphones/galaxy-s26-ultra/specs/ （切到 `Galaxy S26 (12GB+256GB)` Tab）
交叉核对：三星全球新闻室 https://news.samsung.com/tw/三星發表galaxy-s26旗艦系列...

| 字段 | 改前 | 改后 | 官网原文 |
|---|---|---|---|
| `bdim` | `null` | **`'149.6x71.7x7.2mm'`** | 「尺寸 (高*宽*厚, mm) 149.6 x 71.7 x 7.2」 |
| `wt` | 167 | 167（核对一致，未改） | 「重量 (g) 167」 |
| `res` | `null` | **`'2340x1080'`** | 「分辨率 2340 x 1080 (FHD+)」 |
| `sz` | 6.3 | 6.3（核对一致） | 「6.3英寸(直角)/6.1英寸(圆角)」 |
| `nit` | `null` | **保持 null** | 中国官网规格表**无亮度字段**；新闻室只写「Vision booster」，未给 nits |
| `cv` | `null` | **`'8K30'`** | 「视频拍摄 UHD 8K (7680 x 4320)@30fps」 |
| `fc` | `null` | **`'1200万像素 F2.2'`** | 「前置摄像头 - 分辨率 1200万像素 / 光圈 F2.2」 |
| `spk` | `null` | **`'立体声双扬声器'`** | 「音频和视频 - 立体声 支持」 |

### 1.2 samsung-galaxy-s26-plus（三星 Galaxy S26+）
来源：同上规格页，切到 `Galaxy S26+ (12GB+256GB)` Tab（并用 `12GB+512GB` Tab 复核，数值一致）

| 字段 | 改前 | 改后 | 官网原文 |
|---|---|---|---|
| `bdim` | `null` | **`'158.4x75.8x7.3mm'`** | 「尺寸 (高*宽*厚, mm) 158.4 x 75.8 x 7.3」 |
| `wt` | `null` | **`190`** | 「重量 (g) 190」 |
| `res` | `'QHD+'` | **`'3120x1440'`** | 「分辨率 3120 x 1440 (Quad HD+)」 |
| `nit` | `null` | **保持 null** | 官网规格表无亮度字段 |
| `cv` / `fc` / `spk` | `null` | **`'8K30'` / `'1200万像素 F2.2'` / `'立体声双扬声器'`** | 同 1.1 |

> 注：S26+ 的 158.4×75.8×7.3mm / 190g 与库中 S25+ 完全相同，初看可疑。
> 已用两个独立官方源交叉验证（三星中国官网规格页 + 三星全球新闻室「75.8 x 158.4 x 7.3mm, 190g」），
> 且 S26+ 的分辨率（3120x1440）、电池（4900mAh）、额定容量脚注（4755mAh）均与 S26 不同，
> 确认 Tab 切换生效、数值真实，非残留未切换的脏数据。

### 1.3 samsung-galaxy-s26-ultra（三星 Galaxy S26 Ultra）
来源：https://www.samsung.com.cn/smartphones/galaxy-s26-ultra/specs/ （默认 `S26 Ultra (12GB+256GB)` Tab）

| 字段 | 改前 | 改后 | 官网原文 |
|---|---|---|---|
| `bdim` | `'厚7.9mm'`（只有厚度，无三围） | **`'163.6x78.1x7.9mm'`** | 「尺寸 (高*宽*厚, mm) 163.6 x 78.1 x 7.9」 |
| `wt` | 214 | 214（核对一致） | 「重量 (g) 214」 |
| `res` | `'QHD+'` | **`'3120x1440'`** | 「分辨率 3120 x 1440 (Quad HD+)」 |
| `nit` | `null` | **保持 null** | 官网规格表无亮度字段 |
| `fc` | `null` | **`'1200万像素 F2.2'`** | 「前置摄像头 - 分辨率 1200万像素 / 光圈 F2.2」 |
| `spk` | `null` | **`'立体声双扬声器'`** | 「音频和视频 - 立体声 支持」 |

### 1.4 samsung-galaxy-s26-fe（三星 Galaxy S26 FE）—— **非国行口径，已逐字段标注**
来源：
- 三星全球新闻室产品规格表 https://news.samsung.com/ph/samsung-galaxy-s26-fe-delivering-the-latest-flagship-experience-focused-on-what-matters-most
  （中文版 https://news.samsung.com/tw/三星galaxy-s26-fe 同表）
- 三星英国官网产品页 https://www.samsung.com/uk/c/p/SM-S741BLGDEUB （SM-S741BLGDEUB）
- 三星新加坡 / 澳洲官网产品页同值复核

> ⚠️ **三星中国官网无此机型**（`/smartphones/galaxy-s26-fe/` 404，全量机型列表无此型号）。
> 下列数值均为**三星官方但非中国大陆口径**。
> **国行未上市，无中国大陆官方售价** —— 其 `lp`（首发价）与 `cp`（官网现价）一律保持 `null`，
> 不以第三方报价顶替；若后续国行上市需重新取数。
>
> team-lead 已拍板（2026-10-15）：**该机型保留不删**（本工具本就收录海外/小众机型，
> 国行未上市不构成排除条件），维持「官方国际源 + 双重口径标注」的处理。

| 字段 | 改前 | 改后 | 官网原文 |
|---|---|---|---|
| `bdim` | `null` | **`'161.6x76.9x7.4mm'`** | 「Dimensions & Weight 161.6 x 76.9 x 7.4, 193g」 |
| `wt` | `null` | **`193`** | 同上 |
| `res` | `null` | **`'2340x1080'`** | 三星英国官网「Resolution (Main Display) 1080 x 2340 (FHD+)」 |
| `nit` | `null` | **`1900`** | 「6.7-inch FHD+ Dynamic AMOLED 2X Display, 120 Hz, **1,900 nits**」 |
| `sz` | 6.7 | 6.7（核对一致） | 「171.1mm (6.7" full rectangle) / 166.4mm (6.6" rounded)」 |
| `soc` / `sb` / `pr` | `null` | **`'Exynos 2500'` / `'三星'` / `'3nm'`** | 「Processor Exynos 2500 (3nm AP)」 |
| `ram` | 缺失 | **`[8]`** | 「8 + 128 GB / 8 + 256 GB」 |
| `cm` | `null` | **`'5000万像素 F1.8 OIS'`** | 「50 MP Wide Camera • OIS F1.8, FOV 84˚」 |
| `cw` | `null` | **`'1200万像素超广角 F2.2 123°'`** | 「12 MP Ultra-Wide Camera • F2.2, FOV 123˚」 |
| `ct` | `null` | **`'800万像素 3倍长焦 F2.4 OIS'`** | 「8 MP Telephoto Camera • 3x Optical Zoom, Up to 30x Digital Zoom, OIS F2.4, FOV 32˚」 |
| `cz` | `null` | **`'3倍光变/30倍数字'`** | 同上（三星英国官网：「Optical Zoom 3x, Optical quality Zoom 2x, Digital Zoom up to 30x」） |
| `cv` | `null` | **`'8K30'`** | 「Video Recording Resolution UHD 8K (7680 x 4320)@30fps」 |
| `fc` | `null` | **`'1200万像素 F2.2'`** | 「12 MP Front Camera • F2.2, FOV 85˚」 |
| `bw` / `bwl` | `null` | **`45` / `15`** | 「45 W wired charging / 15 W Fast Wireless Charging」 |
| `wf` / `bt` | `null` | **`'Wi-Fi 6E'` / `'5.4'`** | 「Wi-Fi 6E, Bluetooth® v 5.4」 |
| `os` / `ui` | `'Android 16'` / `'One UI 8.5'` | **`'Android 17'` / `'One UI 9'`**（**修正**） | 三星英国官网：「launching with One UI 9 based on Android 17」 |

---

## 2. P1：反向充电 `br`（逐机型，未按品牌一刀切）

### 2.1 三星官方口径的确立

| 官方源 | 原文 | 结论 |
|---|---|---|
| 三星中国官网支持页 | **「无线电源分享」**；支持机型：**Galaxy S20/S20+/S20 Ultra 及更高版本**、**Galaxy Z Fold2 / Flip2 及更高版本**、Galaxy Watch 及更高（Watch7/Ultra 除外）、Galaxy Buds 及后续；另含 S7~S10 系列、Note8~Note20 系列、Gear Sport / Gear S3 | 这是**三星中国官网对无线反向充电的官方中文叫法**；**未给任何瓦数** |
| 三星美国支持页 ANS00047798 | 「The speed and power of the charge will **vary by device**」；「**Galaxy A series**, XCover series, and Galaxy Tab series devices are **not compatible with wireless charging**」 | 官方**明确不公布固定瓦数**；A 系列不支持无线充电 → 不可能有无线反向充电 |

→ 因此 br 的正确写法是**照抄官方口径「支持无线电源分享（Wireless PowerShare）」，不补瓦数**；
A / M 系列 → **null**。

### 2.2 本次实际新增 br 的机型（原为 null，共 4 款）

| 机型 | 改前 | 改后 | 依据 |
|---|---|---|---|
| samsung-galaxy-s26 | `null` | `支持无线电源分享（Wireless PowerShare）` | 三星全球新闻室 S26 规格表「无线电力分享 / Wireless PowerShare」（S26 列） |
| samsung-galaxy-s26-plus | `null` | 同上 | 同上（S26+ 列） |
| samsung-galaxy-s26-ultra | `null` | 同上 | 同上（S26 Ultra 列：「无线电力分享*****」） |
| samsung-galaxy-s26-fe | `null` | 同上 | 新闻室 S26 FE 规格表「Wireless PowerShare****」 |

### 2.3 历史错误修正（共 26 款）—— **本批最大的数据翻案**

**结论：三星官网从未公布过无线反向充电瓦数，库里的 `4.5W反向` / `10W反向` 全部无官方依据。**
按「官网只说支持而不给瓦数时，就照抄原文，不要自己补瓦数」的纪律，统一改为官方口径。

| 旧值 | 机型数 | 机型 |
|---|---|---|
| `4.5W反向` | **21** | S25 Ultra、S25+、S25、S25 Edge、S24 Ultra、S24+、S24、S23 Ultra、S23+、S23、S22 Ultra、S22、S21 Ultra、Z Fold6、Z Fold5、Z Fold4、Z Flip6、Z Flip5、Z Flip4、S21 FE、S20 Ultra |
| `10W反向` | **5** | S24 FE、S23 FE、S21、Z Fold3、**Z Flip3** |
| `支持 Wireless PowerShare` | **3** | Z Fold8、Z Fold8 Ultra、Z Flip8（口径统一为含中文官方名的同一字符串） |

**典型错误坐实 —— Z Flip3**：库中 `bwl:10`（无线充电 10W）与 `br:'10W反向'` **完全同值**，
正是 team-lead 点名的「把无线充电功率当成反向充电功率」。

### 2.4 br 仍为 null 的机型及原因（共 6 款，一律不编造）

| 机型 | 原因 |
|---|---|
| samsung-galaxy-a56 | 三星美国支持页明确「Galaxy A series … not compatible with wireless charging」；中国官网 A56 商品页（/smartphones/galaxy-a/galaxy-a56-5g-awesome-lightgray-256gb-sm-a5660zacchc/）全文无「无线充电 / 反向 / 电源分享」字样，仅有线充电；不在中国官网 PowerShare 支持机型清单内 |
| samsung-galaxy-a55 | 同上（A 系列，不支持无线充电） |
| samsung-galaxy-a54 | 同上 |
| samsung-galaxy-a35 | 同上 |
| samsung-galaxy-a15 | 同上 |
| samsung-galaxy-m55 | 三星中国官网 PowerShare 支持机型清单**只含 S 系列（S20 起）、Z Fold2/Flip2 起、Note 系列及 S7~S10 部分机型，不含 Galaxy M 系列**；M55 库中 `bwl:0`（不支持无线充电）；官网亦未列任何有线反向充电 |

> 注：A / M 系列本批已逐款查过三星中国官网商品页，不是「按品牌一刀切判 null」，
> 而是**官方支持页的机型清单 + 官方 A 系列不支持无线充电声明**双重依据。

### 2.5 修正后全量 br 分档表（39 款）

| 分档 | br 值 | 机型数 | 机型 |
|---|---|---|---|
| 支持无线电源分享（无瓦数，官方原文口径） | `支持无线电源分享（Wireless PowerShare）` | **33** | S26 / S26+ / S26 Ultra / S26 FE、S25 Ultra / S25+ / S25 / S25 Edge、S24 Ultra / S24+ / S24 / S24 FE、S23 Ultra / S23+ / S23 / S23 FE、S22 Ultra / S22、S21 Ultra / S21 / S21 FE、S20 Ultra、Z Fold8 / Fold8 Ultra / Fold6 / Fold5 / Fold4 / Fold3、Z Flip8 / Flip6 / Flip5 / Flip4 / Flip3 |
| 不支持（官方声明 / 不在支持清单内） | `null` | **6** | A56 / A55 / A54 / A35 / A15、M55 |

---

## 3. P2：变倍 `cz`（光变 + 数码变倍都要写）

| 机型 | 改前 | 改后 | 官网原文 | 来源 |
|---|---|---|---|---|
| samsung-galaxy-s26 | `'3倍光变'` | **`'3倍光变/30倍数字'`** | 「光学变焦3倍，光学品质变焦2倍 (通过自适应像素传感器实现)**数码变焦高达30倍**」 | /smartphones/galaxy-s26-ultra/specs/（S26 Tab） |
| samsung-galaxy-s26-plus | `'3倍光变'` | **`'3倍光变/30倍数字'`** | 同上（S26+ Tab） | 同上 |
| samsung-galaxy-s26-ultra | `'3倍光变'` | **`'3/5倍光变/100倍数字'`** | 「光学变焦3倍和5倍，光学品质变焦2倍和10倍 (通过自适应像素传感器实现)**数码变焦高达100倍**」 | /smartphones/galaxy-s26-ultra/specs/ |
| samsung-galaxy-s26-fe | `null` | **`'3倍光变/30倍数字'`** | 「8 MP Telephoto • **3x Optical Zoom, Up to 30x Digital Zoom**, OIS」 | news.samsung.com/ph/samsung-galaxy-s26-fe-…、samsung.com/uk/c/p/SM-S741BLGDEUB |
| samsung-galaxy-z-fold8-ultra | `'3倍光变'` | **`'3倍光变/30倍数字'`** | 「光学变焦3倍，光学品质变焦2倍 (通过自适应像素传感器实现)**数码变焦高达30倍**」 | /smartphones/galaxy-z-fold8-ultra/specs/ |

**未改动的 cz（核对后确认已完整或官网无数码倍率）**：
- `z-fold8` 已有 `'2倍光学品质变焦 / 10倍数码'`（官网「光学品质变焦2倍…数码变焦高达10倍」）→ 保留
- `z-flip8` 已有 `'2倍光学品质变焦 / 10倍数码'` → 保留
- S25 Ultra / S24 Ultra / S23 Ultra / S22 Ultra / S21 Ultra / S20 Ultra 等已含「/100倍数字」→ 保留
- A / M 系列、Z Flip4/5/6、S25 Edge 无长焦，只有 `'10倍数字'` → 保留（官网未给光变倍率）

> 口径纪律：S26 / S26+ / S26 Ultra / Fold8 Ultra 的数码变焦倍数**逐机型取自各自 Tab 原文**，
> 未套用 S25 Ultra 的「100 倍」。

---

## 4. 官网未公布因而留 null 的字段清单

| 机型 | 保持 null 的字段 | 原因 |
|---|---|---|
| S26 / S26+ / S26 Ultra | **`nit`** | **三星中国官网规格表根本没有亮度字段**；新闻室只写「Vision booster」，未给 nits。严禁从第三方搬数字 |
| S26 / S26+ / S26 Ultra | `lp`（首发价） | **三星中国官网不提供「首发价」字段**（team-lead 拍板不硬补）；`cp` 已按最低配补齐，见 §8 |
| S26 FE | `lp`、`cp` | **国行未上市，无中国大陆官方售价**，一律 null |
| S26 / S26+ / S26 Ultra | `bm`（机身材质）、`col`（配色）、`gpu`、`an`、`rt`、`ft`、`dim`（调光） | 中国官网规格表未列；配色在「设计」Tab 三机共用一组色卡，无法逐机区分，故不填 |
| S26 FE | `lp`、`cp`、`bm`、`col`、`bio`、`spk`、`ppi`、`dim`、`hdr`、`cpu`、`gpu`、`an`、`rt`、`ft` | 中国官网无该机型；国际站亦未逐项公布 |
| A56 / A55 / A54 / A35 / A15 / M55 | `br` | 官方不支持无线充电、不在 PowerShare 支持清单内 |
| 全系 | `sat`（卫星通信） | 中国官网规格表未列 |

---

## 5. 修正的历史错误值汇总

| # | 机型 | 字段 | 错误旧值 | 正确新值 | 依据 |
|---|---|---|---|---|---|
| 1 | 21 款 S/Z 机型（见 §2.3） | `br` | `4.5W反向` | `支持无线电源分享（Wireless PowerShare）` | 三星中国官网支持页 + 三星美国支持页 ANS00047798（官方从未公布瓦数） |
| 2 | S24 FE / S23 FE / S21 / Z Fold3 / Z Flip3 | `br` | `10W反向` | 同上 | 同上；Z Flip3 的 10W 与其 `bwl:10` 同值，属无线充电功率误当反向充电功率 |
| 3 | Z Fold8 / Fold8 Ultra / Flip8 | `br` | `支持 Wireless PowerShare` | `支持无线电源分享（Wireless PowerShare）` | 统一为三星中国官网中文官方名，消除同库内同功能两种写法 |
| 4 | samsung-galaxy-s26-ultra | `bdim` | `'厚7.9mm'`（缺长宽） | `'163.6x78.1x7.9mm'` | 中国官网规格表「尺寸 (高*宽*厚, mm) 163.6 x 78.1 x 7.9」 |
| 5 | samsung-galaxy-s26-plus / s26-ultra | `res` | `'QHD+'`（非数值） | `'3120x1440'` | 官网「3120 x 1440 (Quad HD+)」 |
| 6 | samsung-galaxy-s26-fe | `os` / `ui` | `Android 16` / `One UI 8.5` | `Android 17` / `One UI 9` | 三星英国官网产品页「launching with One UI 9 based on Android 17」 |
| 7 | S26 / S26+ / S26 Ultra / Fold8 Ultra | `cz` | 只写光变 | 光变 + 数码变倍 | 各自 Tab 官网原文 |

### 5.1 发现但未改动（建议 team-lead 决定）
- **S26 / S26+ / S26 Ultra / S26 FE 的 `lp`（首发价）仍为 null**。team-lead 已拍板：
  三星中国官网**本来就没有「首发价」这个字段**，不硬补；界面真正显示的是 `cp`，已补齐（见 §8）。
  这 4 条 `launchPrice` 缺失属**有意保留**，不应再派给 price-fetcher。
- **S26 FE 已拍板保留**（见 §1.4）。建议前端对非国行机型显式标注口径：
  「国行未上市，无中国大陆官方售价」。
- S26 / S26+ / S26 Ultra 的 `bm`（机身材质）、`col`（配色）中国官网规格表未列，本批未填；
  「设计」Tab 有配色但**三机共用一组色卡无法区分**，需人工确认后再填。

---

## 6. 校验结果

| 项目 | 基线（本轮改前） | 改完参数后 | 补完 `cp` 后 | 结论 |
|---|---|---|---|---|
| `npx tsc -p tsconfig.app.json --noEmit` | — | **0 错误** | **0 错误** | ✅ |
| 完全合规机型 | 543/644 | 548/644（85.09%） | **555/644（86.18%）** | ✅ 上升 |
| 违规记录数 | — | 214 | 186 | ✅ 下降 |
| 必填缺失计数 | 143 | 131 | **103** | ✅ 下降，**未引入任何新的必填缺失** |

> 同批华为 / OPPO / 价格模块也在并行改动，合规数与必填缺失数会同步波动，上表含他人改动。
> 就三星品牌本身而言：违规清单里三星**只剩 4 条 `launchPrice | 必填字段为空`**
> （S26 / S26+ / S26 Ultra / S26 FE），这 4 条是 team-lead 拍板**不补**的：
> 三星中国官网不提供首发价字段，S26 FE 则国行未上市。除此之外三星品牌零违规。

三星品牌在违规清单中**只剩 4 条 `launchPrice | 必填字段为空`**（S26 / S26+ / S26 Ultra / S26 FE），
属 §5.1 已说明的待定价项；S26 FE 原来的 `performance.soc`、`camera.main` 两项必填缺失**已消除**。

---

## 7. 追加任务：`br` 与 `bwl` / `bw` 同值巧合复查（team-lead 拍板 2）

**方法**：取改前版本（`git show HEAD:src/data/phones/samsung.ts`）逐款比对 ——
把 `br` 里的数字与同机的 `bwl`（无线充电功率）、`bw`（有线充电功率）做等值比较，
凡完全相等即列入可疑清单。扫描覆盖**全部 39 款**。

**结果：命中 1 款。**

| 机型 | 改前 `br` | `bw` | `bwl` | 命中项 | 判定 |
|---|---|---|---|---|---|
| samsung-galaxy-z-flip3 | `10W反向` | 15 | **10** | `br == bwl` | ✅ 确认为历史错误（无线充电功率被当成反向充电功率），已改为官方口径 |

**未命中的说明（不是漏扫，是逐款比过）**：

| 改前 `br` 档位 | 机型数 | 与 `bwl` / `bw` 的关系 |
|---|---|---|
| `4.5W反向` | 21 | 这些机型 `bwl` 全为 15、`bw` 为 25 或 45，**无一相等** → 不是「同值搬运」，但仍属**无官方依据的自造瓦数**，已一并改为官方口径 |
| `10W反向` 中的 S24 FE / S23 FE / S21 / Z Fold3 | 4 | `bwl` 分别为 15 / 15 / 15 / 11、`bw` 均为 25，**无一相等** → 同样是无依据的自造瓦数，已改 |
| `支持 Wireless PowerShare`（Z Fold8 系列） | 3 | 非数值，无同值问题；仅统一中文写法 |
| `null` | 10 | 见 §2.4 |

> 补充判据：反向充电功率**几乎不可能与正向充电功率同值**（三星 PowerShare 是低效的线圈反充，
> 官方口径也从不给瓦数），所以「同值」是强可疑信号；但**「不同值」不等于「正确」**——
> `4.5W` / `10W` 虽然不与 `bwl`/`bw` 撞值，仍是凭空补的瓦数，本批已按同一纪律全部纠正。

---

## 8. 追加任务：S26 系列 `cp`（官网现价）

team-lead 判断：**三星中国官网不提供「首发价」字段，`lp` 保持 null 不硬补**，
真正影响界面的是 `cp`（官网现价）。已按最低配（12GB+256GB）取三星中国官网购买页官方售价。

| 机型 | `cp`（改前 → 改后） | 对应配置 | 来源 URL | 页面结构化数据原文 |
|---|---|---|---|---|
| Galaxy S26 | `null` → **7799** | 12GB+256GB（SM-S9420） | https://www.samsung.com.cn/smartphones/galaxy-s26/buy/ | `displayName:"256GB \| 12GB"`, `modelName:"SM-S9420"`, `price:"7799"`, `promotionPrice:"7799"` |
| Galaxy S26+ | `null` → **8999** | 12GB+256GB（SM-S9470） | https://www.samsung.com.cn/smartphones/galaxy-s26/buy/ | `displayName:"256GB \| 12GB"`, `modelName:"SM-S9470"`, `price:"8999"` |
| Galaxy S26 Ultra | `null` → **10999** | 12GB+256GB（SM-S9480） | https://www.samsung.com.cn/smartphones/galaxy-s26-ultra/buy/ | `displayName:"256GB \| 12GB"`, `modelName:"SM-S9480"`, `price:"10999"`；页面渲染「256GB \| 12GB ¥10,999.00」 |
| Galaxy S26 FE | `null` → **保持 null** | — | — | **国行未上市，无中国大陆官方售价** |

**同期可见的其他配置价（仅记录，未入库）**：S26+ 12+512 = ¥10,599；S26 Ultra 12+512 = ¥12,599、16+1TB = ¥15,799。
（S26 中国官网购买页只列出 12GB+256GB 一档。）

**取证方法**：购买页是前端渲染，价格不出现在首屏 HTML；
从页面内嵌的商品 JSON 中按 `modelName` + `englishName` + `price` 精确取各配置价，
并用页面渲染文本（「256GB | 12GB ¥10,999.00」）交叉核对一致。

---

## 9. 文件头「数据来源与口径」注释

已在 `src/data/phones/samsung.ts` 头部追加完整注释块，写明：
① 官网取证 URL 与「S26 三机共用规格页需切 Tab」的坑；
② 国行口径声明与 S26 FE 的唯一例外（国行未上市，取官方国际源）；
③ 反向充电分档依据（三星中国官网「无线电源分享」+ 美国支持页「不公布瓦数 / A 系列不支持无线充电」）；
④ 历史错误修正说明；⑤ 官网未公布故留 null 的字段清单。
