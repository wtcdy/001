# 手机参数核查（电池容量 / 长焦变倍 / 反向充电）

核查日期：2026-10-14　核查人：数据调研员　数据源优先级：**厂商官网 > 中关村在线 / GSMArena（仅交叉核对）**
本轮只调研，**未修改 `src/data/` 下任何文件**。

---

## 0. 结论摘要

| 项 | 任务书数字 | 实测数字 | 说明 |
|---|---|---|---|
| `bc`（电池容量）缺失 | 11 | **12** | 多出 `xiaomi-17-pro` |
| `br`（反向充电）为 null | 177 | **200** | 任务书漏了近年新机（17/18 系列、Magic8/9、Mate 80 等） |
| 有长焦无 `cz`（变倍） | 14 | **14** | 一致 |
| 无 `tags` | 0 | 0 | 一致 |

实测口径：`ALL_PHONES.length = 519`，字段真名是 `battery.reverseCharge`（不是 `reverseCharging`）、`battery.capacity`、`camera.zoom`。

**本轮进展**：P1 电池 12 条查证 5 条；P0 反向充电查证 33 条（荣耀 9 + Apple 19 + 小米 1 条确证 + 品牌口径 4）；P2 变倍查证 2 条。

---

## 1. P0 —— 反向充电（`battery.reverseCharge`）

### 1.0 关键发现：用户说的「荣耀 27W 有线反向充电」**是真的，但不是荣耀全系**

荣耀官网**同一套模板**下，不同机型写法不同，我逐页核对了 6 个机型页：

| 机型 | 官网「有线快充」段 | 官网「无线充电」段 |
|---|---|---|
| 荣耀 Magic8 | `80W荣耀超级快充`（**无 27W 行**） | `80W荣耀无线超级快充，支持无线反向充电。` |
| 荣耀 Magic8 Pro | `120W荣耀超级快充`（**页面全文未出现「27W」**） | `80W荣耀无线超级快充，支持无线反向充电。` |
| 荣耀 Magic8 Pro Air | `80W荣耀超级快充`（**不含 27W**） | `50W荣耀无线超级快充，支持无线反向充电。` |
| **荣耀 500** | `80W荣耀超级快充` + **`支持27W有线反向快充`** | 页面未列无线充电 |
| **荣耀 500 Pro** | `80W荣耀超级快充` + **`支持27W有线反向快充`** | `支持50W荣耀无线超级快充，支持无线反向充电` |
| **荣耀 Magic9** | `80W荣耀超级快充` + **`最大支持27W有线反向快充`** | `50W荣耀无线超级快充` + `支持无线反向充电` |
| 荣耀 Magic V6 | `80W荣耀超级快充`（**无 27W 行**） | `66W荣耀无线超级快充`（**未提无线反向充电**） |

荣耀 500 Pro 官网备注原文（可逐字引用）：
> `最大支持27W有线反向充电，支持对通过荣耀实验室测试的设备进行反向充电。`

**结论**：用户的指责成立，但**「荣耀全系 27W」是过度概括**。库里荣耀 18 条 `br: null` 应**按机型分两档**填，不能一刀切写 27W。另外，荣耀官网**从不公布无线反向充电的瓦数**，只有「支持无线反向充电」六个字。

### 1.1 荣耀（18 条 null）—— 逐条建议

| # | id | 机型 | 官网原文依据 | 建议 `br` |
|---|---|---|---|---|
| 1 | honor-magic8 | 荣耀 Magic8 | OTG（反向供电时最大输出电流1A/5V）＋「支持无线反向充电」 | `5W有线反向（OTG）+ 支持无线反向` |
| 2 | honor-magic8-pro | 荣耀 Magic8 Pro | 同上；页面确认无 27W | `5W有线反向（OTG）+ 支持无线反向` |
| 3 | honor-magic8-pro-air | 荣耀 Magic8 Pro Air | 同上；页面确认无 27W | `5W有线反向（OTG）+ 支持无线反向` |
| 4 | honor-magic9 | 荣耀 Magic9 | `最大支持27W有线反向快充`＋`支持无线反向充电` | `27W有线反向 + 支持无线反向` |
| 5 | honor-500 | 荣耀 500 | `支持27W有线反向快充` | `27W有线反向` |
| 6 | honor-500-pro | 荣耀 500 Pro | `支持27W有线反向快充`＋`支持无线反向充电` | `27W有线反向 + 支持无线反向` |
| 7 | honor-magic-v6 | 荣耀 Magic V6 | OTG 1A/5V；无线段**未提**无线反向 | 现有值 `'支持无线反充'` **存疑**，建议改 `5W有线反向（OTG）` 或复核后再定 |
| 8 | honor-magic8-rsr | 荣耀 Magic8 RSR | 官网 `honor-magic8-rsr/spec/` 返回 **404** | 未查到 |
| 9-18 | honor-magic9-pro-max / magic9-ultra-power / win-rt / power-2 / x60-pro / x60 / x50 / x40 / magic4 / 90-pro / 80-pro | — | 本轮未逐页取到 | 未查到（批次 2） |

来源：https://www.honor.com/cn/phones/honor-magic8/spec/ 、honor-magic8-pro/spec/ 、honor-magic8-pro-air/spec/ 、honor-magic9/spec/ 、honor-500/spec/ 、honor-500-pro/spec/ 、honor-magic-v6/spec/

### 1.2 Apple（19 条 null）

苹果官方口径（https://support.apple.com/zh-cn/HT213839）：**iPhone 15 及后续机型**可通过 USB-C 为 AirPods / Apple Watch / 小型 USB 设备充电，**最高可达 4.5 瓦**；**iPhone 14 及更早不支持**（苹果无无线反向充电）。

| 建议 | 机型（9 条） |
|---|---|
| `4.5W有线反向` | iphone-air、iphone-16e、iphone-16、iphone-16-plus、iphone-15、iphone-15-plus、**iphone-18-pro、iphone-18-pro-max、iphone-duo**（后 3 款按「15 及后续」类推，官网尚无专页） |
| `null`（确实不支持） | iphone-14、iphone-14-plus、iphone-13、iphone-13-mini、iphone-12、iphone-12-mini、iphone-se-2022、iphone-se-2020、iphone-11-pro-max、iphone-11 |

⚠️ 库里现有 Apple `br = '7.5W反向'`（30 条）——**与官网 4.5W 口径冲突**，建议一并复核（本轮未逐条核）。

### 1.3 华为（12 条 null）

华为商城（vmall.com）Pura 80 / Mate 70 系列官方原文：
> `OTG 支持（反向供电时最大输出电流1A/5V）`　`支持 5 W 有线反向充电`　`支持无线反向充电`

建议整批按 `5W有线反向 + 支持无线反向` 填，但**这 12 条里只有 nova / 畅享 / Mate 80 / Pura 90 系列，我本轮没取到各自官网页面**，因此标记为**待逐页确认**，不直接入库：
huawei-p50-pocket、huawei-nova-13、huawei-nova-12、huawei-nova-11、huawei-enjoy-70、huawei-hi-nova-11、huawei-mate-80、huawei-mate-80-pro、huawei-mate-80-pro-max、huawei-mate-80-pro-max-wind、huawei-mate-80-rs、huawei-pura-90-pro-max

### 1.4 小米 / Redmi

小米官网原文（https://www.mi.com/prod/xiaomi-17-pro/specs）：`22.5W 有线/无线反充`
（同系列交叉：https://www.mi.com/prod/xiaomi-17/specs 、https://www.mi.com/tw/support/faq/details/KA-680739 均有 22.5W 有线/无线反向）

| id | 建议 `br` |
|---|---|
| xiaomi-17-pro | `22.5W有线/无线反充`（官网确证） |
| xiaomi-17 / xiaomi-17-pro-max / xiaomi-17-ultra / xiaomi-18-pro / xiaomi-18-pro-max / xiaomi-18-fold | 大概率同为 22.5W，但**本轮未取到各自官网页** → 未查到 |
| xiaomi-12x / civi-3 / civi-2 / 11-youth / civi | 老机型，未查到 |

Redmi 21 条 null 本轮未查（批次 2）。库里 Redmi 已有 `22.5W反向` / `22.5W有线反充` / `22.5W有线/无线反充` 三种写法，**建议统一为 `22.5W有线/无线反充`**。

### 1.5 其余品牌 —— 品牌级官方口径（已取到，但**未逐机型确认**）

| 品牌 | 官方口径 | 来源 |
|---|---|---|
| OPPO | `兼容 Qi 无线快充协议，支持 10 W 反向充电` | https://www.oppo.com/cn/smartphones/series-find/find-x6-pro/specs/ |
| vivo | `10W Wireless Reverse Charging`（英文站）/ 中文站仅写 `OTG反向充电 支持` | https://www.vivo.com/hk/en/products/param/x80pro |
| 三星 | 官网商城页**未列**反向充电；库里现有 `'支持 Wireless PowerShare'` | https://www.samsung.com.cn/smartphones/galaxy-s25-ultra/buy/ |

一加（7）、realme（19）、iQOO（11）、魅族（10）、努比亚（6）、摩托罗拉（17）、索尼（8）、中兴（3）、其他（2）= **83 条本轮未查 → 批次 2**。
（一加官网 `oneplus.com/cn/oneplus-15/specs` 与 realme 官网 `realme.com/cn/realme-gt8-pro/specs` 均返回 404，需换入口。）

### 1.6 `br` 字段写法建议（统一口径）

现有库里混着 `10W反向` / `22.5W有线反充` / `支持无线反充` / `支持 Wireless PowerShare` 四种写法。建议统一为：
- 只支持一种：`5W有线反向` / `10W无线反向` / `4.5W有线反向`
- 两种都支持：`27W有线反向 + 支持无线反向`、`22.5W有线/无线反充`
- 官网只写「支持」不写瓦数：`支持无线反向（瓦数未公布）`
- 确实不支持 / 查不到：`null`

---

## 2. P1 —— 电池容量 `battery.capacity`（12 条）

| # | id | 机型 | 官网典型值 | 来源 | 状态 |
|---|---|---|---|---|---|
| 1 | xiaomi-17-pro | 小米 17 Pro | **6300 mAh**（typ）/ 6150 min | https://www.mi.com/prod/xiaomi-17-pro/specs | ✅ 官网确证 |
| 2 | oppo-find-x9-ultra | OPPO Find X9 Ultra | **7050 mAh** / 26.23 Wh（典型），6890 / 25.64 Wh（额定） | https://www.oppo.com/cn/smartphones/series-find/find-x9-ultra/specs/ | ✅ 官网确证 |
| 3 | vivo-x300s | vivo X300s | **7100 mAh**（3.74V）/ 26.56 Wh（典型） | https://www.vivo.com.cn/vivo/x300s/param | ✅ 官网确证 |
| 4 | vivo-x300-ultra | vivo X300 Ultra | **6600 mAh**（3.74V）/ 24.69 Wh（典型） | https://www.vivo.com.cn/vivo/x300ultra/param | ✅ 官网确证 |
| 5 | honor-magic8-pro-air | 荣耀 Magic8 Pro Air | **5500 mAh**（典型）/ 5370 额定 | https://www.honor.com/cn/phones/honor-magic8-pro-air/spec/ | ✅ 官网确证 |
| 6 | honor-magic8-rsr | 荣耀 Magic8 RSR | 未查到（官网 404） | — | ❌ |
| 7 | huawei-mate-80-pro-max | 华为 Mate 80 Pro Max | 未查到 | — | ❌ |
| 8 | huawei-mate-80-pro-max-wind | 华为 Mate 80 Pro Max 风驰版 | 未查到 | — | ❌ |
| 9 | huawei-mate-80-rs | 华为 Mate 80 RS 非凡大师 | 未查到 | — | ❌ |
| 10 | huawei-pura-90-pro-max | 华为 Pura 90 Pro Max | 未查到 | — | ❌ |
| 11 | oppo-find-x10-pro-max | OPPO Find X10 Pro Max | 未查到（OPPO 官网未收录该型号） | — | ❌ |
| 12 | iphone-duo | iPhone Duo | 未查到（疑似未发布 / 库里 releaseDate 2026-10） | — | ❌ |

**顺带修正的既有数据**（本轮查官网时撞见，非任务书列出的 12 条）：
- `honor-magic8` 库里 `bc` 若非 7000 → 官网为 **7000 mAh（典型）/ 6820 额定**
- `honor-magic8-pro` → 官网 **7200 mAh（典型）/ 7020 额定**
- `honor-magic-v6` → 官网 **16GB+1TB 版 7150 mAh；其他版本 6850 mAh**（分版本，建议取 6850 或拆分）
- `honor-500` / `honor-500-pro` → 官网均 **8000 mAh（典型）**
- `honor-magic9` → 官网 **8000 mAh（典型）/ 7820 额定**

---

## 3. P2 —— 长焦变倍 `camera.zoom`（14 条）

用户要求：「长焦镜头要加上支持的**光学变倍、数码变倍**的倍数」。

| # | id | 机型 | 光学变倍（官方） | 数码变倍（官方） | 来源 | 状态 |
|---|---|---|---|---|---|---|
| 1 | oppo-find-x9-ultra | OPPO Find X9 Ultra | **10 倍**（照片/视频均 10 倍） | **120 倍**（照片）/ 30 倍（视频） | https://www.oppo.com/cn/smartphones/series-find/find-x9-ultra/specs/ | ✅ 官网确证 |
| 2 | xiaomi-17-ultra | 小米 17 Ultra | **3.2–4.3 倍**（仅 0.6x / 1x / 3.2–4.3x 为光学） | **最高 120 倍** | https://www.mi.com/tw/support/faq/details/KA-680739 | ✅ 官网确证 |
| 3 | huawei-pura-90-pro-max | 华为 Pura 90 Pro Max | 未查到 | 未查到 | — | ❌ |
| 4 | honor-magic9-pro-max | 荣耀 Magic9 Pro Max | 未查到 | 未查到 | — | ❌ |
| 5 | honor-magic-v6 | 荣耀 Magic V6 | 未查到 | 未查到 | — | ❌ |
| 6 | xiaomi-17 | 小米 17 | 未查到（同系列 Pro 为 5 倍光学，见附注） | 未查到 | — | ❌ |
| 7 | xiaomi-18-fold | 小米 18 Fold | 未查到 | 未查到 | — | ❌ |
| 8 | redmi-k90 | REDMI K90 | 未查到 | 未查到 | — | ❌ |
| 9 | oppo-find-x9 | OPPO Find X9 | 未查到 | 未查到 | — | ❌ |
| 10 | oppo-find-x9-pro | OPPO Find X9 Pro | 未查到 | 未查到 | — | ❌ |
| 11 | oppo-find-x10-pro-max | OPPO Find X10 Pro Max | 未查到（官网无此型号） | 未查到 | — | ❌ |
| 12 | realme-gt8-pro | realme GT8 Pro | 未查到（官网 404） | 未查到 | — | ❌ |
| 13 | vivo-x300-pro | vivo X300 Pro | 未查到 | 未查到 | — | ❌ |
| 14 | vivo-x500 / vivo-x500-pro-max | vivo X500 / X500 Pro Max | 未查到 | 未查到 | — | ❌ |

附注（**第三方口径，不可直接入库**，仅供交叉参考，官网未确认）：
- 小米 17 Pro 官网 `徕卡浮动潜望长焦：50MP｜ƒ/3.0｜5倍光学变焦` → 推断小米 17 同系列可能同为 5 倍，但**没有官网原文，不写入**。
- vivo X300 Ultra 官网只给「85mm 等效焦距」，**不公布变焦倍数**；外接增距镜 G2 = 2.35x、G2 Ultra = 4.7x（这是外接镜，不是机身变焦）。
- vivo X300s 官网：蔡司 APO 超级长焦 70mm 等效焦距、`100x 蔡司超清变焦`（数码）；光学倍数官网未直接标注（70mm/23mm ≈ 3x，属推断）。
- 三星 S25 Ultra 官网可作为「好写法」的样板：`光学变焦3倍和5倍，光学品质变焦2倍和10倍，数码变焦高达100倍`。

---

## 4. 未查到清单（需批次 2 补齐）

| 类别 | 条数 | 明细 |
|---|---|---|
| P0 反向充电 | **167** | 荣耀未查 11、Apple 待复核既有 30、华为 12、小米 11、Redmi 21、OPPO 12、一加 7、realme 19、vivo 13、iQOO 11、三星 10、魅族 10、努比亚 6、摩托罗拉 17、索尼 8、中兴 3、其他 2 |
| P1 电池容量 | **7** | honor-magic8-rsr、huawei-mate-80-pro-max、huawei-mate-80-pro-max-wind、huawei-mate-80-rs、huawei-pura-90-pro-max、oppo-find-x10-pro-max、iphone-duo |
| P2 长焦变倍 | **12** | 见 §3 表格 #3–#14 |

华为 4 条电池为最该优先补的缺口（用户点名「电池容量都没有」），建议下批直接爬 vmall 商品页。

---

## 5. 给工程的落地提醒

1. 字段真名：`battery.reverseCharge`（**不是** `reverseCharging`）、`battery.capacity`、`camera.zoom`。
2. `br` 是 `string | null`，没有就 `null`，**不要写「不支持」中文串代替 null**（现有库里有 `'支持无线反充'` 这类写法，建议统一到 §1.6 口径）。
3. 荣耀 `magic-v6` 现有的 `'支持无线反充'` 与官网不一致（官网无线段未提反向），**优先复核**。
4. Apple 现有 30 条 `'7.5W反向'` 与官网 4.5W 冲突，**需整批复核**。
5. 本轮未改 `src/data/`，等 team-lead 拍板口径后再统一落库。

---

# 6. 第二批增量（2026-10-14 晚）—— 华为官网专场

数据源：华为官网 consumer.huawei.com/cn/phones/<型号>/specs/（一手官网，非第三方）

## 6.1 ⚠️ 重要修正：华为反向充电也分档，不是统一 5W

我第一批写「华为官方口径 5W 有线反向」是**基于老机型（Pura 80 / Mate 70）**的，本批查了 Mate 80 / Pura 90 系列后发现**新一代已升级到 18W**：

| 机型 | 官网「有线充电」原文 | 官网「无线充电」原文 | 建议 `br` |
|---|---|---|---|
| 华为 Mate 80 | `…兼容 9V/2A 快充，支持 5 W 有线反向充电。` | `支持 50 W 华为无线超级快充，支持无线反向充电。` | `5W有线反向 + 支持无线反向` |
| 华为 Mate 80 Pro | `…支持 18 W 有线反向充电。` | `支持 80 W 华为无线超级快充，支持无线反向充电。` | `18W有线反向 + 支持无线反向` |
| 华为 Mate 80 Pro Max | `…支持 18 W 有线反向充电。` | `支持 80 W 华为无线超级快充，支持无线反向充电。` | `18W有线反向 + 支持无线反向` |
| 华为 Pura 90 Pro Max | `…支持 18 W 有线反向充电。` | `支持 80 W 华为无线超级快充，支持无线反向充电。` | `18W有线反向 + 支持无线反向` |

来源：
- https://consumer.huawei.com/cn/phones/mate80/specs/
- https://consumer.huawei.com/cn/phones/mate80-pro/specs/
- https://consumer.huawei.com/cn/phones/mate80-pro-max/specs/
- https://consumer.huawei.com/cn/phones/pura90-pro-max/specs/

**规律**：标准版 5W，Pro / Pro Max / Ultra 档 18W。**不能按品牌一刀切**（和荣耀 27W 的教训完全一致）。
华为官网同样**不公布无线反向充电的瓦数**，只有「支持无线反向充电」六个字 → 按 team-lead 口径 2，写「支持无线反向」不带瓦数。

华为 12 条 null 中本批确证 **4 条**（mate-80 / mate-80-pro / mate-80-pro-max / pura-90-pro-max），剩余 8 条（p50-pocket、nova-13/12/11、enjoy-70、hi-nova-11、mate-80-pro-max-wind、mate-80-rs）未查到。
（`mate80-rs` 官网返回「没有找到相关页面」；风驰版无独立 spec 页。）

## 6.2 P1 电池容量 —— 本批补 4 条，华为缺口基本闭合

| # | id | 机型 | 官网典型值 | 额定值 | 来源 | 状态 |
|---|---|---|---|---|---|---|
| 7 | huawei-mate-80-pro-max | 华为 Mate 80 Pro Max | **6000 mAh** | 5870 | mate80-pro-max/specs/ | ✅ |
| 10 | huawei-pura-90-pro-max | 华为 Pura 90 Pro Max | **6000 mAh** | 5850 | pura90-pro-max/specs/ | ✅ |
| — | huawei-mate-80-pro | 华为 Mate 80 Pro | **5750 mAh** | 5620 | mate80-pro/specs/ | ✅（顺带） |
| — | huawei-mate-80 | 华为 Mate 80 | **5750 mAh** | 5620 | mate80/specs/ | ✅（顺带） |

剩余仍缺：`honor-magic8-rsr`（荣耀官网 404）、`huawei-mate-80-pro-max-wind`（风驰版，无独立官网页）、`huawei-mate-80-rs`（官网 404）、`oppo-find-x10-pro-max`（OPPO 官网未收录）、`iphone-duo`。

**`iphone-duo` 的 bc 建议保持 null，不要补。** 苹果官网只公布「使用外屏的视频播放最长可达 44 小时 / 内屏 31 小时」，**从不公布 mAh**。目前该机刚发布、无拆解数据，任何 mAh 数字都是编造。

## 6.3 P3 长焦变倍 —— 本批补 2 条（华为官网原文）

| # | id | 机型 | 光学变倍 | 数码变倍 | 官网原文 | 状态 |
|---|---|---|---|---|---|---|
| 3 | huawei-pura-90-pro-max | 华为 Pura 90 Pro Max | **4 倍**光学（24/13/89mm） | **100 倍** | `支持 4 倍光学变焦（4 倍变焦为近似值，镜头焦段分别为 24 mm，13 mm，89 mm）、100 倍数字变焦` | ✅ |
| — | huawei-mate-80-pro-max | 华为 Mate 80 Pro Max | **4 倍和 6.2 倍**光学（24/13/90.5/140mm）、12.4 倍光学品质变焦 | **100 倍** | `支持 4 倍和 6.2 倍光学变焦…、12.4 倍光学品质变焦、100 倍数字变焦` | ✅（顺带） |

华为官网的写法很规范（「光学变焦 + 光学品质变焦 + 数字变焦」三段式），**建议作为 `cz` 字段的标准写法样板**，其他品牌也照这个结构写。

剩余未查 12 条：见 §3 表格 #4–#14（`honor-magic9-pro-max`、`honor-magic-v6`、`xiaomi-17`、`xiaomi-18-fold`、`redmi-k90`、`oppo-find-x9`、`oppo-find-x9-pro`、`oppo-find-x10-pro-max`、`realme-gt8-pro`、`vivo-x300-pro`、`vivo-x500`、`vivo-x500-pro-max`）。

## 6.4 顺带在华为官网撞见的可修正数据

| id | 项 | 官网值 |
|---|---|---|
| huawei-mate-80 | 变焦 | 5.5 倍光学 / 50 倍数字 |
| huawei-mate-80-pro | 变焦 | 4 倍光学 / 8 倍光学品质 / 100 倍数字 |
| huawei-mate-80-pro / pro-max | 有线 / 无线充电 | 100W / 80W |
| huawei-mate-80 | 有线 / 无线充电 | 66W / 50W |
| huawei-mate-80-pro-max | SoC / 屏幕 | 麒麟 9030 Pro / 6.9″ 双层 OLED 2848×1320 |
| huawei-pura-90-pro-max | SoC / 屏幕 | 麒麟 9030S / 6.9″ OLED 2880×1308 460ppi |

## 6.5 第二批未查到清单

| 类别 | 条数 | 明细 |
|---|---|---|
| P0 反向充电 | **约 163** | 荣耀 11、Apple 30 条既有值待复核、华为 8、小米 11、Redmi 21、OPPO 12、一加 7、realme 19、vivo 13、iQOO 11、三星 10、魅族 10、努比亚 6、摩托罗拉 17、索尼 8、中兴 3、其他 2 |
| P1 电池容量 | **5** | honor-magic8-rsr、huawei-mate-80-pro-max-wind、huawei-mate-80-rs、oppo-find-x10-pro-max、iphone-duo（建议保持 null） |
| P3 长焦变倍 | **12** | 见 §6.3 |

## 6.6 本批最该让工程知道的三句话

1. **华为反向充电不要一刀切**：标准版 5W，Pro/Pro Max 18W（官网原文 `支持 18 W 有线反向充电`）。
2. **华为变焦写法可当标准**：`4 倍光学变焦 + 12.4 倍光学品质变焦 + 100 倍数字变焦` 三段式。
3. **`iphone-duo` 的电池容量别补**：苹果从不公布 mAh，补了就是编造。

---

# 7. 第三批：小米 / OPPO / vivo 官网专场（2026-10-14 晚）

URL 规律（已验证可用）：
- 小米 `https://www.mi.com/prod/<型号>/specs`
- OPPO `https://www.oppo.com/cn/smartphones/series-find/<型号>/specs/`
- vivo `https://www.vivo.com.cn/vivo/<型号>/param`

## 7.1 小米（mi.com）

| id | 项 | 官网原文 / 值 | 状态 |
|---|---|---|---|
| xiaomi-17 | 电池 | `7000mAh(typ) / 6860mAh(min)` | ✅ 顺带 |
| xiaomi-17 | **br** | `有线充电：100W 小米澎湃有线秒充 / PPS 协议 100W 快充 / **22.5W 有线反向快充**；无线充电：50W 小米澎湃无线秒充 / **22.5W 无线反向快充**` | ✅ |
| xiaomi-17-pro-max | 电池 | `7500mAh(typ) / 7330mAh(min)` | ✅ 顺带 |
| xiaomi-17-pro-max | **br** | `22.5W 有线/无线反充` | ✅ |
| xiaomi-17-pro-max | **cz** | `徕卡超聚光潜望长焦：50MP｜1/2″超大底｜ƒ/2.6｜**5倍 光学变焦**｜30cm 长焦微距｜OIS` | ✅ |
| xiaomi-17 | **cz** | 官网只给 `5000万 徕卡浮动长焦：ƒ/2.0｜等效60mm焦距`，**未标光学变焦倍数** | ❌ 未查到 |
| xiaomi-17-pro | br | `22.5W 有线/无线反充`（第一批已查） | ✅ |
| xiaomi-17-ultra / 18-pro / 18-pro-max / 18-fold | br | 本批未取到各自官网页 | ❌ 未查到 |
| xiaomi-12x / civi / civi-2 / civi-3 / 11-youth | br | 老机型，未查 | ❌ 未查到 |

**小米规律：明确标「22.5W 有线/无线反充」，17 全系口径一致。** 小米是三家里唯一把反向充电瓦数写全的。

## 7.2 OPPO（oppo.com）

| id | 项 | 官网原文 / 值 | 状态 |
|---|---|---|---|
| oppo-find-x9 | 电池 | `7025 mAh/26.35 Wh（典型值）；6840 mAh/25.65 Wh（额定值）` | ✅ 顺带 |
| oppo-find-x9 | **cz** | `照片拍摄最高支持 **3 倍光学变焦**，最高支持 **120 倍数码变焦`；视频 `最高 3 倍光学变焦，最高 18 倍数码变焦` | ✅ |
| oppo-find-x9-pro | 电池 | `7500 mAh/28.13 Wh（典型值）；7290 mAh/27.34 Wh（额定值）` | ✅ 顺带 |
| oppo-find-x9-pro | **cz** | `照片拍摄最高支持 **3 倍光学变焦**，最高支持 **120 倍数码变焦`；视频 3x / 18x | ✅ |
| oppo-find-x9 / x9-pro | **br** | 充电段只有 `最大支持：80 W 超级闪充…最大支持：50 W 无线闪充`，**全文无「反向充电」**；仅有 `OTG 数据传输 支持` | ❌ 官网未标 → null |

**⚠️ OPPO 新规律：从 Find X9 起，OPPO 官网不再标反向充电。**
对比：Find X6 Pro 官网有 `兼容 Qi 无线快充协议，支持 10 W 反向充电`；Find X9 / X9 Pro / X9 Ultra 三页**都没有**。按 team-lead 口径 2（宁缺勿编），这三款 `br` 应写 **null**，不能沿用库里 OPPO 既有的 `10W反向`。

## 7.3 vivo（vivo.com.cn）

| id | 项 | 官网原文 / 值 | 状态 |
|---|---|---|---|
| vivo-x300-pro | 电池 | `典型容量：6510mAh（3.77V），典型能量 24.55Wh；额定 6375mAh` | ✅ 顺带 |
| vivo-x500-pro-max | 电池 | `典型容量：8000mAh（3.71V）`；`90W 有线充电器 / 40W 无线闪充` | ✅ 顺带 |
| vivo-x300-pro / x500-pro-max / x300s / x300-ultra | **br** | 四页**均未出现「反向充电」** | ❌ 官网未标 → null |
| vivo-x300-pro | **cz** | 官网只给 `85mm 等效焦距｜长焦微距至高 20x`、`480mm+ 超远距运动抓拍`，**未直接标光学/数码变焦倍数** | ❌ 未查到 |
| vivo-x500 / x500-pro-max | **cz** | 官网未列 | ❌ 未查到 |

**vivo 规律：中文官网从不标反向充电瓦数。** 只有英文站（vivo.com/hk/en）X80 Pro 时代写过 `10W Wireless Reverse Charging`，中文站连「OTG 反向供电」都只在部分老机型出现。按口径 2 写 null。
⚠️ `vivo-x300-pro` 的光学倍数是可推断的（85mm ÷ 24mm ≈ 3.5x），但**官网没直说，属推断，不入库**。

## 7.4 三家变焦口径差异（给 `cz` 定写法用）

| 品牌 | 官网写法 |
|---|---|
| 华为 | `支持 4 倍和 6.2 倍光学变焦…、12.4 倍光学品质变焦、100 倍数字变焦`（**最规范，推荐当样板**）|
| OPPO | `照片拍摄最高支持 3 倍光学变焦，最高支持 120 倍数码变焦` |
| 小米 | 只在 Pro/Pro Max 标 `5倍 光学变焦`，标准版不标 |
| vivo | 只标等效焦距（85mm）+「480mm+ 超远距」，**不标变焦倍数** |
| 三星 | `光学变焦3倍和5倍，光学品质变焦2倍和10倍，数码变焦高达100倍` |

## 7.5 第三批计数

| 项 | 本批查证 | 本批未查到 |
|---|---|---|
| br（反向充电） | **6**（xiaomi-17、xiaomi-17-pro-max 确证；OPPO X9/X9 Pro、vivo 4 款确认官网未标 → null） | 约 157 |
| 电池 | **5** 条顺带补（小米17 7000、17 Pro Max 7500、Find X9 7025、X9 Pro 7500、X300 Pro 6510、X500 Pro Max 8000） | 5 |
| cz（变倍） | **4**（X9、X9 Pro、17 Pro Max 确证；小米17、X300 Pro 确认官网未标） | 8 |

---

# 8. P1：当前官网在售但库里缺失的机型

## 8.1 已核实（有官网/主流电商在售证据）

| 机型 | 证据 | 关键参数 |
|---|---|---|
| **iPhone 17e** | https://www.apple.com.cn/shop/buy-iphone/iphone-17e | RMB **5299** 起，6.1″，A19（6核CPU/4核GPU），4800 万融合式主摄，1200 万原深感前摄，光学变焦 1x/2x，**不支持** ProMotion / 全天候显示 / 灵动岛（工程师正在补，供交叉核对） |
| **华为 Mate XTs 非凡大师** | 京东在售（ZOL 导购 https://mobile.zol.com.cn/1259/12597531.html） | 16+256 原价 **17999**（京东 9 折到手 15231.6）；16+1TB 首发 21999，现拼多多百亿补贴 15899–16099、京东 9 折 19439 |
| **华为 Mate XT 2 非凡大师** | https://www.toutiao.com/article/7682698277402083880 | 16+256 **19999** / 512GB 21999 / 1TB 23999 / 1TB 灵盾防窥屏版 24999；麒麟 9050 Pro；HarmonyOS 7；5600mAh；66W 有线 / 50W 无线 |
| **OPPO Find X9s Pro** | OPPO 官网产品对比链接 `cn_series-find-x_find-x9s-pro`（出现在 find-x9-ultra 页面） | 官网确认存在，参数未取 |
| **vivo X300 E** | vivo 官网 X 系列导航 https://www.vivo.com.cn/vivo/x300e/ | 在售，参数未取 |
| **vivo X Fold6** | vivo 官网 X 系列导航 https://www.vivo.com.cn/vivo/xfold6/ | 在售；库里最新只到 X Fold5（2025-06） |
| **iQOO 7 款** | vivo 官网 iQOO 导航 https://www.vivo.com.cn/products-iqoo.html | iQOO Neo12（预约中）、iQOO 16、Neo11 至尊版、Z11S、Z11i、15T、Z11、15 Ultra；库里只有 iqoo-16 与 iqoo-z11-turbo |

## 8.2 按命名规律推测存在、**但本轮未逐款核实**（不要直接补录，需先查证）

`xiaomi-18`（标准版）、`redmi-k90-pro`、`honor-magic8-ultra`、`huawei-pura-90-ultra`、`nubia-z80-ultra`、`meizu-23`、`samsung-galaxy-z-fold7`、`samsung-galaxy-z-flip7`

## 8.3 结论

用户投诉「数据不全」，根子在**近半年发布的新机没跟上**：iPhone 17e、Mate XTs、Mate XT 2、OPPO Find X9s Pro、vivo X300 E / X Fold6、iQOO 7 款，共 **14 款有在售证据**。这批补上后，「数据不全」的抱怨能消掉大半。
iQOO 是最严重的缺口 —— 官网在售 8 款，库里只有 2 款。

---

## 9.（第四批）缺失机型种子块 与 vivo 反向充电口径翻案

完整种子块见 **`research/missing-devices-batch3.md`**，本节只记结论。

### 9.1 【翻案】vivo / iQOO 官网**是标反向充电**的

第三批我报的「vivo 中文官网从不标反向充电」**是错的**。原因是只看了产品营销页 `/vivo/<型号>/`。
真正的参数表在 **`https://www.vivo.com.cn/vivo/<型号>/param`**，其中「电池信息」下有独立字段：

```
- OTG反向充电
  支持
```

本批 8 款 vivo/iQOO 机型逐页核对，**全部写着「支持」，且都无瓦数**。

修正后的 `br` 口径：

| 品牌 | `br` |
|---|---|
| vivo / iQOO 全系 | `'支持 OTG 反向充电'` |
| OPPO（Find X9 系列起） | `null` |
| 华为 | 按机型分档（Mate XTs 5W 有线 + 7.5W 无线；Mate XT 2 仅无线反向无瓦数） |
| Apple | `null` |

### 9.2 13 款种子块已产出

`research/missing-devices-batch3.md` 含 13 个可直接灌入的 `CompactSeed`：
iQOO 15 Ultra / 15T / Neo11 至尊版 / Z11 / Z11S / Z11i（6 款）、
华为 Mate XTs / Mate XT 2、vivo X Fold6 / X300 E、OPPO Find X9s Pro、iPhone 17e。
每块都带官方参数页 URL 作为 `src`。

**唯一未查到：iQOO Neo12** —— 官网只有预约活动页，`/vivo/iqooneo12` 与 `/vivo/param/iqooneo12` 均跳回首页，尚未发布。

### 9.3 顺带发现：`iqoo-16` 在库但数据严重不全

releaseDate 仅「2026」、launchPrice null、三摄/前置/系统/防水全 null。
官网参数页（V2606A）已抓全：2026 年 9 月上市、5999 起、8400mAh、100W+40W、
6.85" 3168×1440 165Hz、5000 万三摄、OriginOS 7（Android 17）、超声波 3D 指纹、USB-C 3.2 Gen1。

### 9.4 iPhone 17e 的 4 个「官网不给」字段

`bc`（Apple 不公布 mAh）、`bw`（只说「20 瓦或更大适配器」，未标本机瓦数）、
`bdim`（官网「尺寸与重量」只给了 170g）、`rr`（官网未标）—— 一律 `null`，不硬填。
另：库里 `iphone-17` 的 `br: "7.5W反向"` 应属想当然值，建议一并清理。

---

## 10. 第五批：8 品牌「在售 vs 库里」差集 + 参数页 URL 规律（2026-10-14）

用户给了 8 个官方**商城页** URL。口径：**商城页只用于确认在售状态与当前价格，规格一律取自参数页**。

### 10.1 差集规模：87 款（库里 519 款手机）

| 品牌 | 官网在售 | 库里有 | **差集** |
|---|---|---|---|
| 华为 | 50 | 21 | **29**（含 Mate 90 全系 4 款） |
| OPPO | 57 | 36 | **21** |
| 荣耀 | 21 | 8 | **13** |
| vivo | 24 | 12 | **12**（iQOO 已全部在库） |
| 小米 / REDMI | 12 | 4 | **8** |
| 联想 / moto | 4 | 1 | **3** |
| 三星 | 7 | 6 | **1**（Galaxy A57 5G） |
| Apple | 6 | 6 | **0** |

完整清单见 `research/missing-devices-batch4.md` §1。

### 10.2 参数页 URL 规律表（已实测）

| 品牌 | 规律 | 坑 |
|---|---|---|
| 小米/REDMI | `mi.com/prod/<型号>/specs` | 全部小写连字符，通 |
| 华为 | `consumer.huawei.com/cn/phones/<slug>/specs/` | **slug 无统一规律**：Mate 90 系是 `mate90-pro`，Mate XT 系是 `mate-xts-ultimate-design`，只能逐个试 |
| 荣耀 | `honor.com/cn/phones/<型号>/spec` | 单数 `spec`；部分机型 404 |
| OPPO | `oppo.com/cn/smartphones/series-<系列>/<型号>/specs/` | 需先定位系列 |
| vivo/iQOO | `vivo.com.cn/vivo/<型号>/param` | 营销页 `/vivo/<型号>/` **没有参数** |
| Apple | `apple.com.cn/<型号>/specs/` | — |
| 三星 | 中文站无独立 specs 页，参数在机型页 | — |
| 联想/moto | 只有商城商品页 `item.lenovo.com.cn/product/<id>.html` | **未发现独立参数页** |

### 10.3 【第二次翻案】小米/Redmi 反向充电**不是统一 22.5W**

抽查 8 款、覆盖三档（URL 见 batch4 §4）：
- 旗舰 K100 Pro Max / K100 Pro → **27W 有线 + 22.5W 无线**
- 旗舰 17 Max / 17T Pro、中端 17T / Note 17 Pro / Note 17 → 22.5W 有线
- **入门 REDMI 17 5G → 7.5W 有线**

→ 小米/Redmi 的 `br` **必须按机型逐个回填**，不能用品牌默认值。

### 10.4 华为反向充电口径（Mate 90 系列第二次验证，可定为稳定口径）

Mate 90 标准版 **5W** 有线反向；Pro / Pro Max / RS 非凡大师 **18W** 有线反向。全系「支持无线反向充电」但**无瓦数**。
加上 Mate 80 系列同样规律（第三批已验），合计 8 款，**可以按档位定口径了**。

### 10.5 Apple 在售观察

官网在售只剩 6 款：iPhone Duo 15999 / 18 Pro 9999 / Air 8799 / 17 6799 / 17e 5299 / 16 5999。
**iPhone 18 Pro Max、17 Pro、17 Pro Max 已不在官网在售列表** —— 按「停售机型 `cp` 置 `null`」口径，这三台的 `cp` 需要处理（转工程师确认）。
