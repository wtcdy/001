# 平板缺失价格补齐批次（2026-10-15）

范围：`src/data/tablets/` 下 27 款 `currentPrice` 与 `launchPrice` 均为 null 的平板。

口径（用户拍板）：
- **渠道价（京东自营 / 拼多多百亿补贴）→ 回落官网售价 → 官网下架且渠道也无价才留空**；
- `cp` = 官网现价，`lp` = 首发价；
- 停售 / 下架机型 `cp` 保持 `null`；
- **宁可 `null`，绝不编造**；第三方来源必须在报告中标注。

补充说明：前端价格展示为 `currentPrice → launchPrice` 回落（见
`src/components/PhoneCard.tsx:176-186`、`src/pages/ComparePage.tsx:213-223`），
因此本批次补的 `lp` 同样能让界面上原本空白的「价格」一栏填上数字。

---

## 一、已填写（12 款）

| id | 机型名 | 填的字段 | 金额 | 口径 | 来源 URL |
| --- | --- | --- | --- | --- | --- |
| `ipad-air-m4-13` | iPad Air 13（M4，2026） | `cp` | 7699 | 官网现价 | https://www.apple.com/cn/shop/buy-ipad/ipad-air |
| `honor-pad-10` | 荣耀平板 10（2025） | `lp` / `cp` | 1999 / 1899 | 官网原价 / 官网现价 | https://www.honor.com/cn/tablets/ |
| `oneplus-pad-2` | 一加平板 2 | `lp` / `cp` | 2799 / 2799 | 发布会价 = 官网在售价 | https://www.opposhop.cn/cn/app/product/index?skuId=37263 |
| `iqoo-pad-ultra` | iQOO Pad Ultra | `lp` / `cp` | 6499 / 6499 | 官网上市价 = 官网在售价 | https://www.vivo.com.cn/vivo/param/iqoopadultra + https://shop.vivo.com.cn |
| `iqoo-pad5` | iQOO Pad5 | `lp` / `cp` | 2499 / 2499 | 官网上市价 = 官网在售价 | https://www.vivo.com.cn/vivo/param/iqoopad5 |
| `huawei-matepad-pro-11-2024` | 华为 MatePad Pro 11（2024） | `lp` | 4299 | 发布会首发价（第三方媒体，已标注） | https://www.xinhuanet.com/tech/20231128/6c393d41bd47416f971b8b494ba2f83e/c.html |
| `xiaomi-pad-6s-pro` | 小米平板 6S Pro 12.4 | `lp` | 3299 | 发布会首发价（第三方媒体，已标注） | https://www.cww.net.cn/article?id=587482 |
| `vivo-pad3-pro` | vivo Pad3 Pro | `lp` | 2999 | 官网「上市价格」 | https://www.vivo.com.cn/vivo/param/vivopad3pro |
| `vivo-pad3` | vivo Pad3 | `lp` | 2499 | 官网「上市价格」 | https://www.vivo.com.cn/vivo/param/vivopad3 |
| `vivo-pad-air` | vivo Pad Air | `lp` | 1799 | 官网「上市价格」 | https://www.vivo.com.cn/vivo/param/vivopadair |
| `vivo-pad2` | vivo Pad2 | `lp` | 2499 | 官网「上市价格」 | https://www.vivo.com.cn/vivo/param/vivopad2 |
| `iqoo-pad` | iQOO Pad | `lp` | 2599 | 官网「上市价格」 | https://www.vivo.com.cn/vivo/param/iqoopad |

### 关键来源说明

- **Apple**：apple.com/cn 当前在售的 iPad Air 已迭代到 **M4** 芯片（11 英寸 5999 起 / 13 英寸 7699 起）。
  `ipad-air-m4-13` 对应在售的 13 英寸 M4，取最低配 128GB 无线局域网机型 **7699**。
- **vivo / iQOO**：官网规格参数页带权威的「上市价格」字段，本批次 7 款全部取自该字段（最低配版本）。
  其中 `iqoo-pad-ultra`（6499，vivo 官方商城在售）与 `iqoo-pad5`（2499，官网「立即购买」）同时写入 `cp`；
  其余 5 款官网状态为「缺货」，按口径 `cp` 保持 `null`。
- **荣耀平板 10**：荣耀官网同时给出划线原价 1999 与现价 1899，分别落到 `lp` / `cp`。
- **一加平板 2**：发布会价 8+256 = 2799（12+256 3099 / 16+512 3599），OPPO 商城在售且未见官方降价，`cp` 取 2799。

---

## 二、保持 null（15 款）及原因

| id | 机型名 | 留空原因 |
| --- | --- | --- |
| `ipad-pro-m4-13` | iPad Pro 13（M4） | **官网已下架**。apple.com/cn 现售 iPad Pro 为 **M5** 芯片（11" 10799 起 / 13" 13299 起），M4 已停售；未查到京东自营有效报价，不采信第三方店铺价 |
| `ipad-air-m3-11` | iPad Air 11（M3） | **官网已下架**。现售 iPad Air 为 M4 芯片，M3 已停售 |
| `ipad-air-m3-13` | iPad Air 13（M3） | 同上，M3 已被 M4 取代，官网下架 |
| `ipad-air-m2-11` | iPad Air 11（M2） | **官网已下架**（M2 → M3 → M4 两代更替） |
| `ipad-air-m2-13` | iPad Air 13（M2） | 同上 |
| `huawei-matepad-air-12-2025` | 华为 MatePad Air 12（2025 第二代） | 华为官网现售的是「MatePad Air」（12" OLED / HarmonyOS 6.1，4499 起）与「MatePad Air 12 英寸第三代」（vmall 3999），与库中口径（LCD / HarmonyOS 5.0 / 12+256）**对不上**；为避免张冠李戴，留空 |
| `huawei-matepad-12x` | 华为 MatePad 12 X（2025） | 未查到**中国大陆**官方定价。仅查到港版 HK$4199、沙特 1999 SAR，均非中国区口径，不换算不入表 |
| `redmi-pad-se-87` | REDMI Pad SE 8.7 | 未查到**中国大陆**官方定价。该机主要面向海外（港版 HK$799、台版 NT$2999），小米中国官网未见该型号在售 |
| `honor-pad-9` | 荣耀平板 9（2023） | 荣耀官网仍在列表但**无价格 / 无购买入口**（同级荣耀平板 10 / 10 Pro 才有价），视为已下架 |
| `honor-magicpad-3` | 荣耀 MagicPad 3（2025） | 荣耀官网现售 MagicPad 4（3299 起）与 MagicPad 3 Pro（4499 起），MagicPad 3 在官网**无价格入口**，视为已下架 |
| `oppo-pad-2` | OPPO Pad 2 | OPPO 官网现售为 Pad 6 / Pad 5 Pro / Pad 5 / Pad 4 Pro / Pad Air5 / Pad SE / Pad Mini，**Pad 2 已下架** |
| `oppo-pad-air` | OPPO Pad Air | 同上，现售已是 Pad Air5，**已下架** |
| `oneplus-pad` | 一加平板 | 未查到可靠官方首发价 / 现价；OPPO 商城平板列表未见该型号，疑似已下架。不臆造 |
| `samsung-galaxy-tab-a9` | 三星 Galaxy Tab A9 | 三星中国官网现售为 Tab S12 / S11 / A11+ 等，**Tab A9 未在中国区在售**；仅查到海外价（爱尔兰 €229 等），不换算不入表 |
| `lenovo-legion-y700-2024` | 联想拯救者 Y700（2024 款） | 未查到联想官网中国区有效在售价，也无可靠京东自营报价，留空 |

---

## 三、本批次未采信的数据（记录备查）

以下数据在调研中出现，但因**不符合口径**被主动放弃，避免污染数据：

- 华为 MatePad Pro 11 2024 款：京东「中新电脑办公专营店」报价 ¥2399 —— **第三方店铺**，非京东自营，不采信。
- 小米平板 6S Pro：京东店铺报价 ¥2599 / ¥2899 —— 来源与配置对应关系不清晰，未采信。
- 一加平板 2：京东「一加平板电脑旗舰店」12+256 常卖价 ¥3199 —— 高于官方发布会价 3099，疑为套装 / 搭售价，不采信。
- iQOO Pad Ultra：京东第三方店 12+256 ¥6499 与官网一致，最终以**官网**口径入表。

---

## 四、改动清单与校验

改动文件（仅改 `lp` / `cp` 两个价格字段 + 局部注释，未动任何参数字段）：

- `src/data/tablets/apple.ts` — 1 条（`ipad-air-m4-13`）
- `src/data/tablets/huawei.ts` — 1 条（`huawei-matepad-pro-11-2024`）
- `src/data/tablets/xiaomi.ts` — 1 条（`xiaomi-pad-6s-pro`）
- `src/data/tablets/honor.ts` — 1 条（`honor-pad-10`）
- `src/data/tablets/oppo.ts` — 1 条（`oneplus-pad-2`）
- `src/data/tablets/vivo.ts` — 4 条
- `src/data/tablets/iqoo.ts` — 3 条

校验：

```
npx tsc -p tsconfig.app.json --noEmit   # 0 错误
```

未触碰 `src/data/phones/` 与 `src/data/prices.ts`。

---

# 追加任务：平板必填缺失 36 款补齐（2026-10-15）

## 口径

必填四项：`screen.size`、`performance.soc`、`battery.capacity` **或** `battery.batteryWh`（二选一）、`camera.main`。
四项全有才算「必填齐全」。

扫描脚本（本次新增，只读，不改业务数据）：`scripts/_qa-tablet-gap.mjs`

```
node scripts/_qa-tablet-gap.mjs
```

## 结果

| 指标 | 补齐前 | 补齐后 |
| --- | --- | --- |
| 平板总数 | 113 | 113 |
| 必填齐全 | 77（68.14%） | **93（82.30%）** |
| 缺失款数 | 36 | **20** |

单项缺失变化：`sz` 2 → 0，`soc` 18 → 12，`bat` 15 → 10，`cm` 30 → 15。

## 一、已补齐 16 款（全部四项齐全）

**vivo / iQOO（4 款，来源：vivo 官网规格参数页 `vivo.com.cn/vivo/param/<model>`）**

| id | 补的字段 | 值 | 来源 URL |
| --- | --- | --- | --- |
| `iqoo-pad-ultra` | `soc` / `cm` | 第六代骁龙8超级至尊版 / 1300万像素 | https://www.vivo.com.cn/vivo/param/iqoopadultra |
| `iqoo-pad5` | `soc` / `bc` / `cm` | 天玑9300+ / 10000mAh / 800万像素 | https://www.vivo.com.cn/vivo/param/iqoopad5 |
| `vivo-pad3` | `cm` | 800万像素 | https://www.vivo.com.cn/vivo/param/vivopad3 |
| `vivo-pad6-pro` | `cm` | 1300万像素 | https://www.vivo.com.cn/vivo/param/vivopad6pro |

**小米（6 款，来源：小米官网 `mi.com/prod/<slug>/specs`）**

| id | 补的字段 | 值 | 来源 URL |
| --- | --- | --- | --- |
| `xiaomi-pad-7` | `cm` | 1300万像素 f/2.2（13MP 1/3.06" PDAF） | https://mi.com/prod/xiaomi-pad-7/specs |
| `xiaomi-pad-7-pro` | `cm` | 5000万像素 f/1.8（50MP JN1 1/2.76" PDAF） | https://www.mi.com/tw/product/xiaomi-pad-7-pro/specs/ |
| `xiaomi-pad-7-ultra` | `cm` | 5000万像素 f/1.8（JN1 1/2.76" PDAF） | https://www.mi.com/prod/xiaomi-pad-7-ultra/specs |
| `xiaomi-pad-7s-pro` | `cm` | 5000万像素 f/1.8（JN1 1/2.76" PDAF） | https://www.mi.com/prod/xiaomi-pad-7s-pro/specs |
| `xiaomi-pad-8` | `cm` | 1300万像素 f/2.2（1/3.06" PDAF） | https://mi.com/prod/xiaomi-pad-8/specs |
| `xiaomi-pad-8-pro` | `cm` | 5000万像素 f/1.8（1/2.76" PDAF） | https://mi.com/prod/xiaomi-pad-8-pro/specs |
| `xiaomi-pad-6s-pro` | `cm` | 5000万像素 f/1.8（1/2.76" PDAF） | https://www.mi.com/prod/xiaomi-pad-6s-pro/specs |

**荣耀（4 款，来源：荣耀官网规格页 `honor.com/cn/tablets/<model>/spec/`）**

| id | 补的字段 | 值 | 来源 URL |
| --- | --- | --- | --- |
| `honor-pad-10` | `soc` / `cm` | 骁龙7 Gen3 / 800万像素 f/2.0 AF | https://www.honor.com/cn/tablets/honor-pad-10/spec/ |
| `honor-pad-10-pro` | `bc` | 10100mAh | https://www.honor.com/cn/tablets/honor-pad-10-pro/spec/ |
| `honor-pad-x10` | `sz` / `soc` / `bc` / `cm` | 11 英寸 / 骁龙680 / 10100mAh / 500万像素 f/2.2 AF | https://www.honor.com/cn/tablets/honor-pad-x10/spec/ |
| `honor-pad-20` | `sz` / `soc` / `bc` / `cm` | 12.1 英寸 / 骁龙7 Gen3 / 10100mAh / 800万像素 f/2.0 AF | https://www.honor.com/cn/tablets/honor-pad-20/spec/ |

**一加（1 款，来源：OPPO 商城官方参数）**

| id | 补的字段 | 值 | 来源 URL |
| --- | --- | --- | --- |
| `oneplus-pad-2` | `bc` / `cm` | 10420mAh / 800万像素 | https://www.opposhop.cn/cn/app/product/index?skuId=37263 |

**部分补齐 1 款（未达四项齐全）**

| id | 补的字段 | 值 | 说明 |
| --- | --- | --- | --- |
| `redmi-pad-2-pro` | `soc` | 骁龙7s Gen4 | 小米官网海外规格页与京东自营商品参数一致指向第四代骁龙 7s；`cm` 口径冲突留空（见下） |

## 二、剩余 20 款未补齐及原因

### 华为 10 款 —— 卡在 `soc`，官网不公布芯片型号

华为中国官网的产品页/规格页**不公布具体麒麟芯片型号**（只写「麒麟」或不写），
因此这 10 款里的 9 款缺 `soc` 无法从官网补齐；只有补上 `soc` 才算齐全，故整批未动。

| id | 缺 | 说明 |
| --- | --- | --- |
| `huawei-matepad-pro-max-2026` | soc, bat | 华为官网不公布麒麟型号；电池未在本次查到官方值 |
| `huawei-matepad-air-12-2025` | soc | 同上；且该条与官网现售 Air 口径不一致（见上节价格部分） |
| `huawei-matepad-115s-2025` | soc, bat | 同上 |
| `huawei-matepad-115s-lingdong` | soc, bat, cm | 同上 |
| `huawei-matepad-115-2026` | soc, cm | 同上 |
| `huawei-matepad-air-z` | soc, bat, cm | 同上 |
| `huawei-matepad-se-11` | soc, bat, cm | 同上 |
| `huawei-matepad-mini` | soc, bat | 同上 |
| `huawei-matepad-12x` | soc, bat | 同上 |
| `huawei-matepad-paper` | cm | 墨水屏机型，后置摄像头参数未查到官方口径 |

> 若要推进这一批，需要拍板：**华为麒麟型号是否允许用第三方（如 Geekbench 识别值 / 中关村在线）标注来源后录入**。
> 按目前「官网优先」口径不能填。

### 联想 5 款 —— 官网规格页未抓到 / 未查到

| id | 缺 | 说明 |
| --- | --- | --- |
| `lenovo-legion-y700-2024` | soc, cm | 联想中国官网未查到该型号有效规格页 |
| `lenovo-legion-y700-2023` | cm | 同上 |
| `lenovo-xiaoxin-pad-pro-127` | cm | 同上 |
| `lenovo-xiaoxin-pad-pro-127-2025` | cm | 同上 |
| `lenovo-xiaoxin-pad-plus` | soc, bat, cm | 同上 |

### Redmi 3 款

| id | 缺 | 说明 |
| --- | --- | --- |
| `redmi-k-pad-2` | bat, cm | 2026 新品，小米官网规格页未收录该 slug，未查到官方值 |
| `redmi-pad-2-pro` | cm | **口径冲突**：小米官网海外规格页（5G 版）标 13MP f/2.2，京东第三方店（乐学版）标 800 万。国行 Wi-Fi 版对应哪个不确定，按「宁可留空」不动 |
| `redmi-pad-2` | soc, cm | 未查到小米官网中国区规格页 |

### 小米 2 款

| id | 缺 | 说明 |
| --- | --- | --- |
| `xiaomi-pad-9-pro-max` | bat, cm | 2026-09 新品，官网规格页 slug 未收录（抓取落到首页），未查到官方值 |
| `xiaomi-pad-6-max` | cm | 2023 老款，官网规格页已下线（抓取落到首页），未查到官方值 |

## 三、改动与校验

改动文件（只补必填字段 + 局部注释，未动其他参数）：`src/data/tablets/` 下
`vivo.ts`、`iqoo.ts`、`xiaomi.ts`、`honor.ts`、`oppo.ts`。

校验：

```
npx tsc -p tsconfig.app.json --noEmit   # 0 错误
node scripts/_qa-tablet-gap.mjs         # 平板必填齐全 93/113 = 82.30%
```

未触碰 `src/data/phones/` 与 `src/data/prices.ts`。

---

# 第三批：解锁剩余 20 款必填缺失（2026-10-15）

起手基线：**平板 113 款，必填齐全 93（82.30%），缺 20**。收尾：**111（98.23%），缺 2**。
本批共补齐 **18 款**（华为 8、联想 5、小米/Redmi 5）。

## 一、关键发现：麒麟型号其实有官方来源

前一轮把「华为不公布麒麟型号」当成死结。这次发现 **华为商城（vmall.com）官方商品详情页
「主要参数」区块明文列出 `CPU型号`**（麒麟 T93 / T92B / T92C / T82B / 9010B …），
**华为消费者业务官网（consumer.huawei.com/cn/.../specs）规格页也列处理器**。
因此本批华为 8 款**全部走的是第一档官网口径，没有用第三方**，team-lead 那三条
「允许第三方但必须满足三条件」的限制条件**没有触发**——不需要 Geekbench、不需要拆解报道、
不需要「第三方来源字段清单」那一节（下面 §四 只列真正走了非官网的条目）。

## 二、华为 8 款（全部官网口径）

| id | 补的字段 | 值 | 来源 |
| --- | --- | --- | --- |
| `huawei-matepad-pro-max-2026` | soc, bat | 麒麟 T93（悦享款 GEM-W40）/ 麒麟 T93 Pro（GEM-W00）；10400mAh（双电池等效 39.84Wh） | [vmall 商详 prdId=10086127502687](https://www.vmall.com/product/comdetail/index.html?prdId=10086127502687)、[prdId=10086722719405](https://www.vmall.com/product/comdetail/index.html?prdId=10086722719405) |
| `huawei-matepad-115s-2025` | soc, bat | 麒麟 T92B（柔光版 SLG-W10）/ 麒麟 T92C（灵动款 SLG-W50）；8800mAh | [vmall 商详 prdId=10086518319242](https://www.vmall.com/product/comdetail/index.html?prdId=10086518319242) |
| `huawei-matepad-115s-lingdong` | soc, bat, cm（+fc, ram, rom, wt） | 麒麟 T92C；8800mAh；后置 1300 万 f/1.8 AF、前置 800 万 f/2.0 | [vmall 商详 prdId=10086693978514](https://www.vmall.com/product/comdetail/index.html?prdId=10086693978514) |
| `huawei-matepad-115-2026` | soc, cm（+fc, res, ppi, ram, rom, wt） | 麒麟 T82B（标准版）/ 麒麟 T82（柔光版）；后置 1300 万 f/1.8 AF、前置 800 万 f/2.0 | [华为官网规格页](https://consumer.huawei.com/cn/tablets/matepad-11-5-2026/specs) |
| `huawei-matepad-air-z` | soc, bat, cm（+fc, res, ppi, ram, rom, wt） | **麒麟 T93SD**（单值，见下方裁决）；10100mAh；后置 5000 万 f/1.8 AF、前置 800 万 f/2.2 | [vmall 商详 prdId=10086966141469](https://www.vmall.com/product/comdetail/index.html?prdId=10086966141469)、[华为官网规格对比](https://consumer.huawei.com/cn/support/content/zh-cn16118536/) |
| `huawei-matepad-se-11` | soc, bat, cm（+sb, cpu, gpu, fc, res, ppi, ram, rom, wt） | **骁龙 685（高通，非麒麟）**；7700mAh；后置 800 万 f/2.0 AF、前置 500 万 f/2.2 | [vmall 商详 prdId=10086426290126](https://www.vmall.com/product/comdetail/index.html?prdId=10086426290126) |
| `huawei-matepad-mini` | soc, bat（+cpu） | 麒麟 9010B 六核；6400mAh（额定 6350mAh） | [vmall 商详 prdId=10086287244006](https://item.vmall.com/product/comdetail/index.html?cid=353007&prdId=10086287244006)、[华为海外官网规格页](https://consumer.huawei.com/za/tablets/matepad-mini/specs/) |
| `huawei-matepad-12x` | soc, bat（+fc, bdim） | 麒麟 T92B；10100mAh（额定 10000mAh，66W） | [华为官网 HK 规格页](https://consumer.huawei.com/hk/tablets/matepad-12-x-2025/specs/)、[sa-en 规格页](https://consumer.huawei.com/sa-en/tablets/matepad-12-x-2025/specs/) |

### 两处需要你确认的处置

1. **`huawei-matepad-se-11` 是高通平台不是麒麟**。原记录 `sb` 留空、注释默许按麒麟家族理解。
   华为商城官方商详写明 `CPU型号 高通骁龙™ 685 / 八核 4×A73@2.8GHz + 4×A53@1.9GHz / Adreno 610`，
   已把 `sb` 改判为 `高通`。这是全库华为平板里唯一的非麒麟款，筛选器按 SoC 品牌过滤时会体现出来。
2. **`huawei-matepad-air-z` 的芯片分配口径两处官网互相打架**：vmall 商详给「悦享款 = 麒麟 T93SD」，
   华为官网规格对比页给「Air Z = T93SD、Air Z 悦享款 = T93S（比 T93SD 提升 12%）」。
   ~~初版我写成 `'麒麟 T93SD / 麒麟 T93S'` 并列。~~
   **2026-10-15 后续裁决（team-lead）**：按来源优先级——`consumer.huawei.com/cn` 品牌官网规格页
   高于 vmall 商城商品页，且规格对比页给出的是明确映射，本条是 Air Z **本体**（非悦享款），
   → **`soc` 改为单值 `麒麟 T93SD`**，冲突保留在代码行内注释里。理由：界面显示「麒麟 T93SD / 麒麟 T93S」
   会被用户读成「两种配置」，可读性比保守并列更差。

### 顺手更正的 3 处旧错误（同一份官网来源）

- `huawei-matepad-12x` 屏幕 **12.2 → 12 英寸**（官网：12 吋 2800×1840 280ppi 270×183×5.9mm，
  原录的分辨率/ppi 与这块 12 吋屏完全吻合）。
- `huawei-matepad-12x` 重量 **512 → 555g**（官网约 555g）。
- `huawei-matepad-12x` 的 `cw: '800万像素 f/2.2'` 撤下改记 `fc`——官网写明 800 万 f/2.2 是**前置**单摄，
  本款后置只有 5000 万单摄，不存在后置副摄。

## 三、联想 5 款

| id | 补的字段 | 值 | 来源档位 |
| --- | --- | --- | --- |
| `lenovo-xiaoxin-pad-plus` | soc, bat, cm（+sb, fc, mat） | 骁龙 750G（高通）；7700mAh；后置 1300 万、前置 800 万 | **第一档**：[联想官网商城商品页规格参数区](https://mitem.lenovo.com.cn/product/1017181.html) |
| `lenovo-xiaoxin-pad-pro-127-2025` | cm（+fc, bw） | 后置 1300 万、前置 800 万 | **第一档**：[联想官网商品文档页](https://www.lenovo.com.cn/wiki/product-doc-32736.html) + 京东自营规格参数区一致 |
| `lenovo-xiaoxin-pad-pro-127` | cm（+fc, bw） | 后置 800 万、前置 1300 万超广角 | **第三档**：[IT之家发布会规格报道](https://www.ithome.com/0/709/032.htm)（联想官网该页已下架） |
| `lenovo-legion-y700-2023` | cm（+fc） | 后置 1300 万（+200 万微距）、前置 800 万 | **第三档**：[GSMArena 机型库](https://mobile.gsmarena.com/lenovo_legion_y700_(2023)-12476.php) + 太平洋科技参数库口径一致 |
| ~~`lenovo-legion-y700-2024`~~ | soc, cm（+lp, fc, ppi, bw, wt） | 骁龙 8 Gen3；后置 1300 万、前置 800 万 | **第三档**：[腾讯新闻上市报道](https://news.qq.com/rain/a/20241028A080IG00) —— **该条目已于 2026-10-15 后续去重删除** |

### `lenovo-legion-y700-2024` 去重：删了，但结论跟预判不一样

删除前按 team-lead 要求做了「四代是否存在」的验证，结果**推翻了原来的假设**：

**联想中国官网同时挂着两台不同的 Y700**（[联想商城活动页](https://mactivity.lenovo.com.cn/xiaofei/ZongHe/jythdp.html) 两行并列）：

| 官方 SKU 名 | SoC | 分辨率 | 电池 | 重量 | 主摄 | 系统 |
| --- | --- | --- | --- | --- | --- | --- |
| 「拯救者 Y700 **2025**」 | **骁龙 8 Gen3** | 2560×1600 165Hz | 6550mAh | 350g | 1300 万 | Android 14 |
| 「拯救者平板 Y700 **四代**」 | **骁龙 8 至尊版（8 Elite）** | 3040×1904 165Hz 408ppi | 7600mAh | 340g | 5000 万 | Android 15 |

即：**「四代」是真实存在的独立机型且 SoC 不同（8 Elite），但它在联想官方命名里叫「四代」、不叫「2025 款」**；
「2025 款」反而是 Gen3（8 Gen3）那台的官方名字。

由此得出三条处置：

1. **删 `lenovo-legion-y700-2024`** ✅ 已删。判定依据：它与 `lenovo-legion-y700-2025` 同为
   8.8" 2560×1600 / 骁龙8 Gen3 / 6550mAh / 350g / 1300 万 / 2899 元起，
   外部资料里的「Legion Y700 2024 / 第三代」就是联想官方「Y700 2025」这台的另一种叫法，确认同一台。
2. **`lenovo-legion-y700-2025` 的 SoC 不改** —— 它记录骁龙 8 Gen3 是**正确**的，
   与联想官方 SKU「拯救者 Y700 2025」（骁龙 8 Gen3）吻合。原预判「2025 款 = 四代 = 8 Elite」不成立。
3. **新增 `lenovo-legion-y700-gen4`** —— 真正的四代（骁龙 8 至尊版）**此前全库根本没有**，
   是本轮验证顺带发现的真实缺漏。已按联想官方商城商品页补齐录入：
   8.8" 3040×1904 408ppi 165Hz 600nit / 骁龙 8 至尊版 3nm / 12~16GB + 256GB~1TB UFS 4.1 /
   后置 5000 万 + 前置 800 万 / 7600mAh 68W（支持旁路充电）/ 340g / 207.6×128.5×7mm /
   Android 15 / 首发 3299（12+256）、联想商城现参考价 3099。
   来源：[联想商城商详](https://m.lenovo.com.cn/wiki/product-1050505.html)、
   [百度百科配置表](https://baike.baidu.com/item/拯救者Y700/59672899)、
   [GSMArena](https://www.gsmarena.com/lenovo_legion_y700_(gen_4)-13993.php)

**净效果**：平板总数仍是 113，必填齐全仍是 111（98.23%）——删掉 1 条重复的、补进 1 条真实缺失的。

## 四、小米 / Redmi 4 款 —— 全部突破（含用户点名的 REDMI K Pad）

| id | 补的字段 | 值 | 来源 |
| --- | --- | --- | --- |
| `redmi-k-pad-2` | bat, cm（+fc, res, rr） | 9100mAh（整机等效 typ）；后置 1300 万 OV13B 1/3.06" f/2.2 PDAF、前置 800 万 OV08F | [mi.com 官方规格页 `redmi-kpad2`](https://www.mi.com/prod/redmi-kpad2/specs)（**slug 无连字符**）+ [小米商城商详 23974](https://m.mi.com/commodity/detail/23974) |
| `xiaomi-pad-9-pro-max` | bat, cm（+fc, pr） | 12000mAh（typ）/11740mAh（min）；主摄 5000 万、前置 3200 万超广 | [mi.com 官方规格页](https://www.mi.com/prod/xiaomi-pad-9-pro-max/specs) |
| `xiaomi-pad-6-max` | cm（+cw, fc, bdim, wt） | 主摄 50MP 1/2.76" 1.28μm f/1.8 PDAF + 景深副摄；前置 2000 万 IMX596 f/2.2 | [mi.com 官方规格页](https://www.mi.com/xiaomi-pad-6-max/specs)（**注意是 `/xiaomi-pad-6-max/specs`，不是 `/prod/...`**） |
| `redmi-pad-2` | soc, cm（+sb, pr, fc, res, ppi, bdim, wt） | Helio G100 Ultra（联发科，6nm）；后置 8MP 1/4" f/2.0、前置 5MP f/2.2 | [mi.com 新加坡官方规格页](https://www.mi.com/sg/product/redmi-pad-2/specs/) + 京东自营「小米移动京东自营旗舰店」规格参数区，两处口径一致 |

**上一轮的 `redmi-pad-2-pro` 主摄冲突也解开了**（这条上一批我主动留空）：
小米商城官方商详页明确写「后置摄像头 800W / 前置摄像头 800W」，
mi.com/global 规格页（Wi-Fi 版）同为 8MP 1/4" f/2。
之前看到的 **13MP 是 5G 版口径**，本条是国行 Wi-Fi 版，取 800 万。
→ 已补 `cm: '800万像素 f/2.0'`、`fc: '800万像素'`，并顺带补了 `ram/rom/bdim/wt/bw`。
来源：[小米商城商详 22535](https://m.mi.com/commodity/detail/22535)、
[mi.com/global 规格页](https://www.mi.com/global/product/redmi-pad-2-pro/specs/)

**`xiaomi-pad-6-max` 的突破路径**：不拼 `/prod/<slug>/specs`（会 302 到官网首页），
正确形态是 `mi.com/<slug>/specs`。这条对以后补小米老款通用。

## 五、第三方（非官网）来源字段清单

只有下面 4 条走了非官网来源，全部标注如下。华为 8 款**不在此列**（均为 vmall / consumer.huawei.com 官方）。

| id | 字段 | 值 | 第三方来源 | 为什么没走官网 |
| --- | --- | --- | --- | --- |
| `lenovo-xiaoxin-pad-pro-127` | `cm` / `fc` | 800 万 / 1300 万 | [IT之家](https://www.ithome.com/0/709/032.htm) | 2023 老款，联想官网商品页已下架 |
| `lenovo-legion-y700-2023` | `cm` / `fc` | 1300 万 / 800 万 | [GSMArena](https://mobile.gsmarena.com/lenovo_legion_y700_(2023)-12476.php)、[太平洋科技](https://g.pconline.com.cn/product/tabletpc/lenovo/1891327_detail.html) | 2023 老款，联想官网商品页已下架 |
| ~~`lenovo-legion-y700-2024`~~ | `soc` / `cm` / `fc` / `lp` | 骁龙 8 Gen3 / 1300 万 / 800 万 / 2899 | [腾讯新闻](https://news.qq.com/rain/a/20241028A080IG00) | 联想官网该页已下架（**该条目已去重删除，本行仅留档**） |
| `redmi-pad-2` | `soc` / `cm` / `fc` | Helio G100 Ultra / 8MP f/2.0 / 5MP f/2.2 | mi.com 新加坡站官方规格页（境外区域站）+ 京东自营规格参数区 | 国行 `/prod/redmi-pad-2/specs` 未收录；境外 mi.com 官网站 + 京东自营双向互证 |

**全程未使用中关村在线（ZOL）**——上一批起就把 ZOL 列为本项目禁用源。

## 六、还剩 2 款没补、为什么

| id | 缺 | 原因 |
| --- | --- | --- |
| `huawei-matepad-air-12-2025` | soc | 你已拍板「保持 null，不用再挖」——该款官网同时存在 HarmonyOS 5 / 6 两个版本页，芯片口径不一致，硬填风险大于收益 |
| `huawei-matepad-paper` | cm | **E-Ink 墨水屏阅读器，整机不带摄像头**。华为官网规格页本就没有摄像头条目，属任务 2 定的「平板特例：官网确实不公布就保持 null」，已在代码里加行内注释说明，不补 0 |

## 七、改动与校验

改动文件（均在 `src/data/tablets/` 下）：`huawei.ts`、`lenovo.ts`、`xiaomi.ts`。

```
npx tsc -p tsconfig.app.json --noEmit   # ✅ 0 错误
node scripts/_qa-tablet-gap.mjs         # 平板必填齐全 93 → 111 / 113（82.30% → 98.23%）
npm run validate:data                   # 必填缺失计数 62（其中平板只剩上面 2 条）
                                        # romOptions 空数组 15 → 10 条（顺带补了 5 款 ram/rom）
                                        # 违规记录数 145 → 134，通过率 86.49% → 86.65%
```

## 八、收尾裁决后的复跑（2026-10-15）

- `huawei-matepad-air-z` 的 `soc` 由并列 `'麒麟 T93SD / 麒麟 T93S'` 改为单值 **`麒麟 T93SD`**。
- 删除重复的 `lenovo-legion-y700-2024`，新增真实缺失的 `lenovo-legion-y700-gen4`（骁龙 8 至尊版）。

```
npx tsc -p tsconfig.app.json --noEmit   # ✅ 0 错误
node scripts/_qa-tablet-gap.mjs         # 平板总数 113、必填齐全 111（98.23%），缺 2（同 §六）
npm run validate:data                   # 违规记录数 145 → 134，通过率 86.49% → 86.65%
                                        # 联想品牌 6 款，无一进入违规列表
```

字段级收敛：soc 11 → 1，bat 8 → 0，cm 11 → 1，sz 0 → 0。

未触碰 `src/data/phones/` 与 `src/data/prices.ts`。
