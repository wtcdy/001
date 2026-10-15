# 中小品牌批次（realme / 摩托罗拉 / 魅族 / 索尼 / 努比亚红魔 / 其他）

- 日期：2026-10-15
- 执行人：minor-brands
- 涉及文件：`src/data/phones/realme.ts`、`motorola.ts`、`meizu.ts`、`sony.ts`、`nubia.ts`、`others.ts`
- 核心目标：`br`（反向充电）逐机型查官网补正 + 顺带补 `bdim` / `wt` / `bc` / `cz`
- 铁律：**绝不按品牌一刀切**；官网只写「支持」不给瓦数就照抄原文；官网没公布就 `null`；严禁套用同品牌其他机型的值

---

## 0. 校验结果

| 项目 | 结果 |
| --- | --- |
| `npx tsc -p tsconfig.app.json --noEmit` | **0 错误**（多次复跑均为 0） |
| `node scripts/_qa-validate.mjs` | 完全合规 **556/644（86.34%）**，违规记录 157，必填缺失 **74** |

基线说明：本批次开工时实测基线为 545/644、必填缺失 140（与工单给的 543/644、143 有差异，原因是华为/OPPO/三星等同事在并发改同一个仓库）。本轮我的改动完成后为 556/644、必填缺失 74。
再往后复跑会继续变化（同事仍在并发提交，数分钟后已到 557/644、必填缺失 63）——**这些变化来自其他品牌文件，不是我这 6 个文件引入的**。
**本轮没有引入任何新的必填缺失**——校验中出现的 `realme-gt8-pro`（lp null）、`nubia-redmagic-11-pro` / `nubia-redmagic-11s-pro`（lp null）、`nubia-redmagic-11s-pro`（cm null）经 `git show HEAD:` 比对确认**改动前就是 null**，不是本轮改出来的。

---

## 1. realme（34 款，`br` 全部 `null`）

### 取证路径
realme 中国官网规格页：`https://www.realme.com/cn/<slug>/specs`
（页面有两套模板：`realme-gt-8-pro` / `realme-gt-8` 是「参数表体」模板，`realme-gt-7-pro` / `realme-15-pro` 是「营销体 + 参数块」模板，**两套模板的电池栏都只有「电池容量 + 快充」两行**。）

实际打开并核对：
- `https://www.realme.com/cn/realme-gt-8-pro/specs`
- `https://www.realme.com/cn/realme-gt-8/specs`
- `https://www.realme.com/cn/realme-gt-7-pro/specs`
- `https://www.realme.com/cn/realme-15-pro/specs`

### 反向充电结论（关键翻案）
- realme **中国官网规格页完全不公布反向充电**：电池栏只有「容量 / 有线快充」，没有任何「反向充电」「无线反向」「OTG 反向」字段。
- 页面上确实存在的 `OTG 数据传输：支持` 指的是**接 U 盘/外设的数据传输**，不是反向充电，不能拿来当反充依据。
- 海外 realme 站**部分机型**会公布反充（例：realme C100 5G 写 6.5W、narzo 80x 写 5W OTG），这恰恰证明 realme 是**按机型分档**的，更不能一刀切；但海外页口径不适用于中国大陆在售型号，**没有跨区套用**。
- → 原库内 15 款 `br:'10W反向'` 在 realme 官网任何位置都找不到依据，属编造瓦数，**本轮全部置 `null`**。

### 本轮改动
| 机型 | 改动字段 | 来源 |
| --- | --- | --- |
| 全系 15 款 | `br:'10W反向'` → `br:null` | realme 官网规格页无该字段 |
| `realme-gt8-pro` | `res`→`3136x1440`、`ppi`→508、`dim`→`全程DC调光`、`cpu`→`8核心 最高主频4.60GHz`、`rt`→LPDDR5X、`ft`→UFS 4.1、`cm`/`cw`/`ct`/`cz`→`3倍光变/120倍数字`、`fc`、`bdim`→`161.80x76.87x8.30mm（布鲁,格林）/8.20mm（怀特,马丁绿）`、`wt`→214、`ip`→`IP66/IP68/IP69`、`bio`、`port`、`col` | realme.com/cn/realme-gt-8-pro/specs |
| `realme-gt8` | `dim`→`全程DC调光`、`cpu`→`8核心 最高主频4.32GHz`、`cz`→`3.5倍光变/120倍数字`、`bdim`→`161.80x76.87x8.20mm（怀特,纳维）/8.30mm（格林）` | realme.com/cn/realme-gt-8/specs |

### 官网未公布因而留 null 的清单
- `realme-gt8-pro`：`spk`、`bm`（官网规格页未列扬声器/机身材质）、`lp`（规格页不公布价格）
- 全系 34 款 `br`：realme 中国官网不公布反向充电

---

## 2. 摩托罗拉（26 款）

### 取证路径
1. Motorola Support 官方规格页：`https://en-us.support.motorola.com/app/answers/detail/a_id/<id>`（另有 en-emea / en-apac / id-id / hk 等区域镜像）
2. motorola.com 各区域产品页「查看所有规格」
3. motorolanews.com 官方新闻稿 + 官方技术规格 PDF

中国官网没有机型参数表，故走官方支持页/区域官网。

### 反向充电分档表（官方原文至少四种口径，逐机型）

| 官方原文 | 本库取值 | 机型 |
| --- | --- | --- |
| `10W wireless power sharing` | `10W无线反向` | moto X50 Ultra、moto edge 50 Pro、moto edge 50 Ultra |
| `5W wireless power sharing` | `5W无线反向` | moto X40、moto edge 40 Pro |
| `5W wired power sharing (Reverse charging)` | `5W有线反向` | moto edge 60 Pro |
| 官方商城写「5W 反向充电」（未区分有线/无线） | `5W反向` | razr 60 Ultra、razr 50 Ultra |
| 只写 `68W TurboPower™`，不列任何 power sharing | `null` | edge 50 / edge 40 / edge S30 / edge S30 冠军版 / edge X30 / edge 20 Pro / razr 50 / razr 40 Ultra / razr 40 / razr 5G / moto S50 / moto S30 Pro / moto G75 / G85 / G54 / G34 |
| 中国区专属机型，官方无机型参数页（第三方口径） | `10W无线反充` | moto X30 Pro（见下） |

### 修正的历史错误值（原库一刀切 `10W反向`）
| 机型 | 原值 | 新值 | 依据 |
| --- | --- | --- | --- |
| `motorola-moto-x50-ultra` | `10W反向` | `10W无线反向` | 官方 10W wireless power sharing |
| `motorola-moto-x40` | `10W反向` | `5W无线反向` | edge 40 pro 官方 5W wireless power sharing |
| `motorola-edge-60-pro` | `10W反向` | `5W有线反向` | 官方 `5W wired power sharing (Reverse charging)` |
| `motorola-edge-50-pro` | `10W反向` | `10W无线反向` | 官方 10W wireless power sharing |
| `motorola-edge-40-pro` | `10W反向` | `5W无线反向` | 官方 5W wireless power sharing |
| `motorola-razr-60-ultra` | `10W反向` | `5W反向` | 官方商城「5W 反向充电」 |
| `motorola-razr-50-ultra` | `10W反向` | `5W反向` | 官方商城「5W 反向充电」 |
| `motorola-edge-50-ultra` | `10W反向` | `10W无线反向` | 官方 10W wireless power sharing |
| `motorola-moto-x30-pro` | `10W反向` | `10W无线反充` | **第三方标注**，见下 |

### 唯一第三方来源项（已在文件头标注）
`motorola-moto-x30-pro` 是中国区专属机型，Motorola Support / motorola.com 各区域站均无机型参数页，**未取得官方原文**。多家发布会报道口径一致为「125W 有线 + 50W 无线 + 10W 无线反充」：
- IT之家产品百科 `https://ku.ithome.com/item/21468/canshu.html`（记「无线反向充电 支持」）
- 中国网科技 / 人民日报客户端发布会稿件（记「10W 无线反充」）
→ 记为 `10W无线反充` 并标注为第三方来源，**未套用同品牌其他机型的官方值**。

---

## 3. 魅族（21 款）

### 取证路径（本轮重要发现：老机型要用 `www.` 域名）
- 在售机型：`https://m.meizu.com/<型号>/spec`
- **老机型：`https://www.meizu.com/<型号>/spec`**

坑：老机型在 `m.` 域名下会**静默回落到商城首页**（HTTP 200 但内容不是规格页），必须用 `www.` 域名才能拿到「电池」栏原文。上一轮据此误判「20 Infinity 官网已下线」，本轮用 `www.` 域名成功取证。

实际打开并取证的页面：
`/22/spec`、`/21pro/spec`、`/21note/spec`、`/21/spec`、`/20pro/spec`、`/20/spec`、`/note16pro/spec`、`/20infinity/spec`、`/18pro/spec`、`/18spro/spec`、`/17pro/spec`

### 反向充电分档表（反充完全跟随无线充电栏的写法）

| 官网「无线充电」栏原文 | 本库取值 | 机型 |
| --- | --- | --- |
| 「66W Super Wireless mCharge 无线超充，**支持最高 10W 反向无线充电**」 | `10W无线反向` | 魅族 22 |
| 「50W Super Wireless mCharge 无线超充，**支持最高 10W 反向无线充电**」 | `10W无线反向` | 魅族 21 Pro |
| 「最大支持 50W    **10W 无线反充**」 | `10W无线反向` | 魅族 20 Infinity |
| 「80W 有线超充 + 50W 无线超充」（**无线栏无反充字样**） | `null` | 魅族 20 Pro |
| 「无线充电 **不支持**」 | `null` | 魅族 21 Note、魅族 21、魅族 Note 16 Pro |
| 「67W 有线超充，**不支持无线充电**」 | `null` | 魅族 20 |
| 「无线充电 **支持 40 W**」（无反充字样） | `null` | 魅族 18 Pro、魅族 18s Pro |
| 「无线充电 **支持 27W**」（无反充字样） | `null` | 魅族 17 Pro |

**20 Infinity 与 18 Pro/18s Pro 同为「有 50W/40W 无线充电」，但前者官网写了 10W 无线反充、后两者没写——这是「不能按品牌一刀切」的直接证据。**

### 修正的历史错误值（原库一刀切 `10W反向`）
| 机型 | 原值 | 新值 | 依据 |
| --- | --- | --- | --- |
| `meizu-22` | `10W反向` | `10W无线反向` | /22/spec 原文；同时 `bwl` 50→66、`cz`→`3倍光变/100倍数字`、`bdim`→`152x71x8.15mm`、`wt`→190 |
| `meizu-21-pro` | `10W反向` | `10W无线反向` | /21pro/spec 原文；同时 `bdim`→`164.98x74.42x7.98mm` |
| `meizu-21-note` | `10W反向` | `null` | 官网「无线充电不支持」 |
| `meizu-21` | `10W反向` | `null` | 官网「无线充电不支持」 |
| `meizu-20-pro` | `10W反向` | `null` | 官网只写「80W 有线 + 50W 无线」，**未写反向无线充电**——不能因为 22/21 Pro 有 10W 就套给它 |
| `meizu-20` | `10W反向` | `null` | 官网「不支持无线充电」 |
| `meizu-note-16-pro` | `10W反向` | `null` | 官网「无线充电不支持」 |
| `meizu-20-infinity` | `10W反向` | `10W无线反向` | www.meizu.com/20infinity/spec「最大支持 50W  10W 无线反充」 |
| `meizu-18-pro` | `10W反向` | `null` | www.meizu.com/18pro/spec「无线充电 支持 40 W」，无反充字样 |
| `meizu-18s-pro` | `10W反向` | `null` | www.meizu.com/18spro/spec「无线充电 支持 40 W」，无反充字样 |
| `meizu-17-pro` | `10W反向` | `null` | www.meizu.com/17pro/spec「无线充电 支持 27W」，无反充字样 |

### 官网未公布因而留 null 的清单
- 上述 8 款 `br`
- 魅族 20 Pro：官网摄像头栏未标光学/数字变焦倍数，`cz` 不动
- 全系 `an`（安兔兔）：魅族官网从不公布跑分，保持历史值

---

## 4. 索尼（16 款）

### 取证路径
- `store.sony.com.tw` Xperia 产品详情页：Xperia 1 VII 写「電池容量 5000mAh、支援快速充電、無線充電及**無線反向充電**」
- `sony.com.tw` 支持规格页：「Qi 無線充電、**電量共享功能**」
- `helpguide.sony.net` Xperia 1 VI 官方说明：「用您裝置的電池為另一個裝置無線充電（**電量共享功能**）」
- `sony.jp`：「**おすそわけ充電**」

### 结论
索尼官方**一律只写功能名，从不给瓦数**。原库内一批 `br:'10W反向'` 的「10W」属编造瓦数 → 统一改为官方原文口径 `支持无线反向充电（电量共享）`。

| 机型组 | 新值 |
| --- | --- |
| Xperia 1 系列 / 5 系列（有无线充电的 8 款） | `支持无线反向充电（电量共享）` |
| Xperia 10 系列 / 5 III（官方无无线充电） | `null` |

留 `null` 的：8 款本身不支持无线充电的机型。
未改动：`sony-xperia-pro-i` 的 `bwl:15` 与第三方说法冲突，保持原值待复核。

---

## 5. 努比亚 / 红魔（23 款）

### 取证路径（本轮重要发现：红魔全球站有完整规格表）
- **红魔全球站规格页：`https://us.redmagic.gg/pages/<机型>-specs`**（另有 global.redmagic.gg / eu.redmagic.gg / na.redmagic.com 同内容镜像）
  - 坑：`us.redmagic.gg` 连续请求会返回 **HTTP 429**，需逐页取
- 努比亚国内官网 `https://www.nubia.com` 是**纯营销站**，没有规格参数表，`/param`、`/specs` 均不存在 → Z 系列 / Flip / Music 拿不到官方一手参数

### 反向充电分档表

| 来源 | 官网原文 | 本库取值 | 机型 |
| --- | --- | --- | --- |
| 官方（11S Pro） | 「Supports up to 80W Wired and Wireless Fast Charging, **with Reverse Charging Support**」 | `支持反向充电` | 红魔 11S Pro |
| 官方（11 Pro） | 「Battery 7,500mAh / Wired 80W / Wireless up to 80W」——**整页没有 reverse charging** | `null` | 红魔 11 Pro |
| 第三方 IT之家 | 「无线充电：不支持」+「OTG反向充电：**支持**」（无瓦数） | `支持OTG反向充电` | 红魔 10 Pro / 10 Ultra / 9 Pro / 9S Pro / 8S Pro / 8 Pro / 7 Pro / 7 / 6 Pro，努比亚 Z70 Ultra / Z60 Ultra / Z50 Ultra / Z50S Pro / Z50 / Z40 Pro / Z60S Pro / Z70S Ultra（共 17 款） |
| 无任何依据 | — | `null` | 努比亚 Flip 5G、Flip 2、Music 2、Music、红魔 11 Pro |

**红魔 11 Pro 与 11S Pro 同代，官方一个写反充、一个不写——又一次证明必须逐机型查。**

### 修正的历史错误值
原库内 19 款 `br:'10W反向'`：「10W」无任何出处（努比亚全系无线充电不支持，不可能是 10W 无线反充），属编造瓦数 → 改为 `支持OTG反向充电`（沿用本项目 vivo 批次的同一口径：来源只写「支持」不写瓦数就照抄、不补瓦数）。

### 本轮补齐的其他字段（红魔 11 Pro / 11S Pro，官方规格页）
| 机型 | 字段 | 新值 |
| --- | --- | --- |
| `nubia-redmagic-11-s-pro` | `bdim` | `163.82x76.54x8.9mm` |
| | `bc` | 6500 → **7500**（原值有误） |
| | `bwl` | null → **80** |
| | `br` | null → `支持反向充电` |
| | `cm` / `cw` / `ce` / `fc` | 5000万 OV50E40 F1.88 OIS / 5000万超广角 OV50D40 F2.0 / 200万像素 / 1600万 OV16A F2.0 |
| | `res` / `nit` / `cpu` / `rt` / `ft` | `2688x1216`（原 `1216x2688` 写反）/ 1800 / `2+6 Oryon 最高4.74GHz` / LPDDR5X / UFS 4.1 |
| | `bm` / `ip` / `bio` / `spk` / `port` / `wf` / `bt` / `os` | 金属中框+康宁玻璃背板 / IPX8 / 3D超声波屏下指纹+面部识别 / 1015+1115E 立体声双扬声器 / USB-C 3.2 Gen2 / Wi-Fi 6 / 5.4 / Android 16 |
| `nubia-redmagic-11-pro` | `bc` | 8000 → **7500**（原值有误） |
| | `bdim` | `163.8x76.5x8.9mm` → `163.82x76.54x8.9mm` |
| | `res` / `nit` / `rt` / `ft` | `2688x1216`（原写反）/ 1800 / LPDDR5T / UFS 4.1 Pro |
| | `bm` / `ip` / `bio` / `spk` / `col` | 金属中框+康宁玻璃背板 / IPX8 / 3D超声波屏下指纹+面部识别 / 1015+1115E 立体声双扬声器 / Cryo,Subzero,Nightfreeze |
| | `br` | **保持 null**（官方规格页未列反向充电） |

> 注意：红魔 11 Pro / 11S Pro 官方明确写 **80W 无线充电**，与「努比亚全系不支持无线充电」的旧印象冲突，因此这两款 `bwl` 已按官网改为 80，不再沿用旧口径。

`cz` 仍为 null：官方后摄写法是「50MP+50MP+2MP」，**没有长焦、也没标任何变焦倍数**。

---

## 6. others.ts（31 款，Pixel / Nothing / 中兴 / 华硕 / 8848 / 夏普 等）

> **更新**：本节是**第一轮**的结论（只审计、不改值）。同日第二轮已复核 Pixel 与 Nothing 并落值，见 **第 9 节**。

### 第一轮处理：**审计，未改任何数值**

原因：`store.google.com` 的 Pixel 规格页被**地区选择重定向**拦截（返回 "Change your region and language"），Pixel 官方一手证据取不到；Nothing / 华硕 / 中兴 / Tecno 本轮也未逐个取到官方原文。按「不编造、不套用」优先于「看起来补上了」的原则，保持原值。

- 5 款 `br:null` 保持 null：zte-axon-30、zte-nubia-z30-pro、zte-axon-50、tecno-phantom-v-fold、tecno-camon-30-pro（中兴 / Tecno 官网为纯营销站无参数表，第三方也无明确「支持反向充电」表述）
- 已有值未改动：Pixel `10W反向`（21 款记法中的一部分）、Nothing `7.5W/5W反向`、ROG / Zenfone / Y900 / 8848 / 夏普 `10W反向`

### 待复核提醒（已写入文件头）
Pixel 官方术语是 **Battery Share**，Google **从不公布瓦数**。若后续规格页能打开，Pixel 应按「只写支持、不写 10W」重做——现有 `10W反向` 很可能是又一个一刀切的历史错误值。

---

## 7. 取不到页面的清单（需要换路径的）

| 品牌 / 机型 | URL | 现象 |
| --- | --- | --- |
| ~~Google Pixel 全系~~ | ~~`https://store.google.com/product/pixel_10_pro_specs?hl=en-US`~~ | ~~被地区选择重定向拦截~~ → **第二轮已用 support.google.com/pixelphone/answer/10107702 绕过，见第 9 节** |
| 索尼 Xperia 1 VI 规格页 | `https://www.sony.com.tw/zh/.../xperia-1-vi/specifications` | 404（已改用 store.sony.com.tw + helpguide PDF 取证） |
| 索尼日站 | `https://sony.jp/xperia/products/xperia1m6` | 404 |
| moto X30 Pro | Motorola Support / motorola.com 各区域 | 无机型参数页（中国区专属机型），已用第三方并标注 |
| 努比亚 Z 系列 / Flip / Music | `https://www.nubia.com/...` | 纯营销站，无参数表，`/param` `/specs` 不存在 |
| 红魔老机型规格页批量抓取 | `https://us.redmagic.gg/pages/<机型>-specs` | 连续请求返回 **HTTP 429**（单页 WebFetch 可用） |

---

## 8. 本批次「反向充电」总账

| 品牌 | 机型数 | 有值 | null | 主要口径 |
| --- | --- | --- | --- | --- |
| realme | 34 | 0 | 34 | 官网不公布 → 全部 null（删除 15 款编造的 10W） |
| 摩托罗拉 | 26 | 9 | 17 | 4 种官方原文口径 + 1 款第三方标注 |
| 魅族 | 21 | 3 | 18 | 官网无线充电栏带反充字样才有值 |
| 索尼 | 16 | 8 | 8 | 统一 `支持无线反向充电（电量共享）`（官网从不给瓦数） |
| 努比亚/红魔 | 23 | 18 | 5 | 第三方 `支持OTG反向充电`（17 款）+ 官方 `支持反向充电`（11S Pro，1 款） |
| others | 31 | 23 | 8 | 第一轮未动；第二轮（第 9 节）复核后改为 23 有值 / 8 null |
| **合计** | **151** | **61** | **90** | |

**删除的编造「10W」共 15（realme）+ 11（魅族）+ 8（索尼）+ 19（努比亚/红魔）+ 9（Pixel）= 62 款。**

---

# 9. 追加复查：Pixel / Nothing 反向充电（第二轮，同日）

- 范围：**只改 `src/data/phones/others.ts` 一个文件**
- 触发：team-lead 全库扫描发现两处嫌疑 —— (A) Pixel 全系 9 款都是 `10W反向`，而其 `bwl` 分别 25/15/15/23/21/15/23/18/23，无一等于 10，躲过了「br 与 bwl 同值」检查；(B) Nothing 3a Pro / 3a / 2a 的 `bwl=0`（无无线充电）却标了无线反向瓦数，物理上矛盾。
- 校验：`npx tsc -p tsconfig.app.json --noEmit` → **0 错误**；`node scripts/_qa-validate.mjs` → **558/644（86.65%）**，违规 134，必填缺失 **62**（数字仍随同事并发提交波动）

## 9.1 Google Pixel（9 款）

### 取证路径（绕开了 store.google.com 的地区拦截）
`store.google.com` 的规格页仍被地区选择重定向拦截，改用 **Google 官方帮助中心**：
- `https://support.google.com/pixelphone/answer/10107702?hl=en`（"Charge other devices with Pixel"）
- 中文版 `?hl=zh-Hans`（「使用 Pixel 为其他设备充电」）

### 官方原文
> Use Battery Share to wirelessly charge Qi-certified phones or accessories, like Pixel Buds by setting your accessory or other phone on the back of your Pixel phone.
> **Battery Share is available on Pixel 5, Pixel 6, Pixel 6 Pro, Pixel 7, Pixel 7 Pro, Pixel 8, Pixel 8 Pro, Pixel 9, Pixel 9 Pro, Pixel 9 Pro XL.**

两个关键事实：
1. **整页没有任何瓦数** —— 对全文做 `\d+ W` 正则扫描，命中 **0 次**。所以原库 9 款 `10W反向` 的「10W」是编造的。
2. **官方名单里没有 Pixel 10 系列**。Google 已就此事公开说明：Pixel 10 采用 Qi2 磁体阵列，「the array of magnets creates a strong connection with the charger but presents a **physical limitation for reverse wireless charging**… Battery Share is **not currently available** on the Pixel 10」（Google 给媒体的官方声明，经 Android Authority / Android Central / 9to5Google 转述）。官方支持页名单不含 Pixel 10 与这条声明互相印证。

### 逐机型最终值

| 机型 | 原值 | 新值 | 依据 |
| --- | --- | --- | --- |
| `google-pixel-10-pro-xl` | `10W反向` | **`null`** | 不在官方 Battery Share 名单；官方确认 Pixel 10 无 Battery Share |
| `google-pixel-10-pro` | `10W反向` | **`null`** | 同上 |
| `google-pixel-10` | `10W反向` | **`null`** | 同上 |
| `google-pixel-9-pro-xl` | `10W反向` | **`支持无线反向充电（Battery Share）`** | 在官方名单；官方不给瓦数，照抄功能名 |
| `google-pixel-9-pro` | `10W反向` | **`支持无线反向充电（Battery Share）`** | 同上 |
| `google-pixel-9` | `10W反向` | **`支持无线反向充电（Battery Share）`** | 同上 |
| `google-pixel-8-pro` | `10W反向` | **`支持无线反向充电（Battery Share）`** | 同上 |
| `google-pixel-8` | `10W反向` | **`支持无线反向充电（Battery Share）`** | 同上 |
| `google-pixel-7-pro` | `10W反向` | **`支持无线反向充电（Battery Share）`** | 同上 |

> 注：Pixel 10 系列改 `null` 只针对**无线**反向（Battery Share）。Google 官方未公布 Pixel 10 的有线 OTG 反向输出，按「官网没公布就 null」保留。

## 9.2 Nothing（3 款嫌疑 + 2 款未动）

### 取证路径（第一轮没找到，这轮找到了）
- **官方规格页：`https://intl.nothing.tech/pages/phone-<型号>`**（SPECS 完整参数表；eu / in / sg 等区域站同内容）
  - 坑 1：`eu.nothing.tech/pages/phone-3a-pro` 是 **404**，要用 `intl.` 域名
  - 坑 2：连续请求返回 **HTTP 429**，需逐个放慢
  - 坑 3：页面是 Shopify Hydrogen 的 RSC 编码，HTML 里标签与值分离，需按 `Reverse (wired )?charging` 定位后取相邻字符串
- **官方支持中心**：`https://support.nothing.tech/hc/zh-cn/sections/32977167969041-产品特色?page=2`（Phone (3a) Pro）、`.../32978102120849-产品特色?page=2`（Phone (3a)）

### 官方原文
Phone (3a) Pro / Phone (3a) SPECS › Battery：
> 50% charge time — 19 minutes / 100% charge time — 56 minutes / **Reverse wired charging — 7.5 W** / Charging speed — 50 W / 5,000 mAh

Phone (2a) SPECS › Battery & Charging › Charging：
> 0 - 100% charge time — 56 minutes / **Reverse charging — 5 W** / Fast charging

官方支持中心（Phone (3a) Pro / (3a)）：
> 这款手机支持无线充电吗？**这款手机不支持无线充电。**
> 我可以使用无线充电器给手机充电吗？**不，这款手机不支持无线充电。**

### 结论：team-lead 的「物理矛盾」判断被官方数据推翻，但结论仍要改
`bwl=0`（无无线充电）与「7.5W 反向」**并不矛盾** —— 官方写的就是 **Reverse _wired_ charging**（有线反向）。所以问题是**原值漏了「有线」限定**，容易被读成无线反充，而不是瓦数编造。

| 机型 | 原值 | 新值 | 依据 |
| --- | --- | --- | --- |
| `nothing-phone-3a-pro` | `7.5W反向` | **`7.5W有线反向`** | intl.nothing.tech/pages/phone-3a-pro「Reverse wired charging 7.5 W」 |
| `nothing-phone-3a` | `7.5W反向` | **`7.5W有线反向`** | intl.nothing.tech/pages/phone-3a「Reverse wired charging 7.5 W」 |
| `nothing-phone-2a` | `5W反向` | **`5W反向`（保持不动）** | intl.nothing.tech/pages/phone-2a「Reverse charging 5 W」，官方**未写 wired**，照抄原文 |
| `nothing-phone-2` | `5W反向` | 未动 | bwl=15，官方 5W 无线反向，team-lead 已确认可信 |
| `nothing-phone-1` | `5W反向` | 未动 | 同上 |

> 第三方 IT之家（`ku.ithome.com/item/46352/canshu.html`）对 Phone (3a) Pro 记「无线充电 不支持 / OTG反向充电 支持」，与官方「无无线充电 + 有线反向」口径一致，可作旁证。

## 9.3 本轮仍未核实、保持原值的

| 项 | 现状 | 原因 |
| --- | --- | --- |
| ROG / Zenfone / 拯救者 Y900 / 8848 / 夏普 的 `10W反向` | 未动 | 本轮未逐个取证，按「不编造不套用」保持原值，列为待复核 |
| zte-axon-30 / zte-nubia-z30-pro / zte-axon-50 / tecno-phantom-v-fold / tecno-camon-30-pro | `br:null` | 中兴 / 传音官网为营销站无机型规格表，第三方亦无明确表述 |

## 9.4 第二轮之后的 `others.ts` br 分布

| 值 | 款数 |
| --- | --- |
| `10W反向`（ROG / Zenfone / Y900 / 8848 / 夏普，待复核） | 12 |
| `支持无线反向充电（Battery Share）` | 6 |
| `7.5W有线反向` | 2 |
| `5W反向` | 3 |
| `null` | 8（5 款中兴/传音 + Pixel 10 三款） |

**第二轮删除的编造「10W」：9 款（Pixel 全系）。**
