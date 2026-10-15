# 第五批：8 品牌「在售机型 vs 库里机型」差集 + 参数页 URL 规律表 + 种子块（2026-10-14）

> 任务来源：用户给了 8 个**官方商城页** URL（小米/华为/荣耀/OPPO/vivo/Apple/三星/联想）。
>
> **三层口径（本批严格执行）**
> 1. **商城页 = 只用于确认「在售状态」和「当前价格」**；
> 2. **营销页 = 卖点页，不可作规格来源**；
> 3. **参数页 = 唯一规格来源**。商城页出现的机型，必须再找到它的参数页才能写种子块。
>
> 纪律：凡是「某品牌应该都支持 XX」的结论，**必须抽查 ≥3 款不同档位机型**并写明 URL。本批的小米反向充电抽查结果正好推翻了「小米统一 22.5W」的旧假设（见 §4）。

---

## 0. 各品牌「参数页 URL 规律」表（本批整理，可长期复用）

| 品牌 | 参数页 URL 规律 | 本批实测 | 备注 |
|---|---|---|---|
| 小米 / REDMI | `https://www.mi.com/prod/<型号>/specs` | ✅ 6 款全通（xiaomi-17t-pro / xiaomi-17t / xiaomi-17-max / redmi-k100-pro-max / redmi-k100-pro / redmi-note-17-pro / redmi-note-17 / redmi-17-5g） | 型号一律小写、连字符；参数页在 `/prod/` 下，不在 `/shope/` |
| 华为 | `https://consumer.huawei.com/cn/phones/<slug>/specs/` | ✅ mate90 / mate90-pro / mate90-pro-max / mate90-rs-ultimate-design | **slug 无统一规律**：Mate 90 系是 `mate90-pro`（数字与字母间无连字符），Mate XT 系却是 `mate-xts-ultimate-design`（有连字符）。只能逐个试 |
| 荣耀 | `https://www.honor.com/cn/phones/<型号>/spec` | ✅ honor-600-pro 通；❌ honor-magic8-rsr 404 | 单数 `spec` 不是 `specs` |
| OPPO | `https://www.oppo.com/cn/smartphones/series-<系列>/<型号>/specs/` | ✅ series-reno/reno15-pro | 一加 realme 同域名不同路径，另测 |
| vivo / iQOO | `https://www.vivo.com.cn/vivo/<型号>/param` | ✅ 已验证 8 款（第四批） | 营销页是 `/vivo/<型号>/`，**两者参数完全不同** |
| Apple | `https://www.apple.com.cn/<型号>/specs/` | ✅ | 参数页是 Apple 唯一官网口径 |
| 三星 | `https://www.samsung.com.cn/smartphones/<系列>/<型号>/` | ⚠️ 本批未逐个实测参数页（商城页给的是系列页） | 中文站参数分散在机型页而非独立 specs 页 |
| 联想 / moto | `https://item.lenovo.com.cn/product/<id>.html` | ⚠️ 只有商城商品页，**未发现独立参数页** | 联想商城「手机」分类下实际只卖 moto |

**商城页入口（用于在售确认，不作规格来源）**

| 品牌 | 商城页 |
|---|---|
| 小米 | `https://www.mi.com/shop` |
| 华为 | `https://www.vmall.com/list-23`（页面需 Cookie 同意，实测取不到列表，改用 `consumer.huawei.com/cn/phones/`） |
| 荣耀 | `https://www.honor.com/cn/shop/v/search?categoryId=36` |
| OPPO | `https://www.opposhop.cn/`（列表以 `oppo.com/cn/smartphones/` 为准） |
| vivo | `https://shop.vivo.com.cn/`（列表以 `vivo.com.cn/vivo/allphone` 导航为准） |
| Apple | `https://www.apple.com.cn/iphone/` |
| 三星 | `https://www.samsung.com.cn/smartphones/all-smartphones/` |
| 联想 | `https://shop.lenovo.com.cn/mobile/index.html` |

---

## 1. P0 差集清单：8 品牌「官网在售 / 库里没有」

库里手机总数 **519**。差集合计 **87 款**。

### 1.1 小米 / REDMI —— 缺 8 款（商城在售 12 款）

| 机型 | 在售 | 库里 | 参数页 URL |
|---|---|---|---|
| 小米 17T Pro | 在售 | ❌ | https://www.mi.com/prod/xiaomi-17t-pro/specs |
| 小米 17T | 在售 | ❌ | https://www.mi.com/prod/xiaomi-17t/specs |
| 小米 17 Max | 在售 | ❌ | https://www.mi.com/prod/xiaomi-17-max/specs |
| REDMI K100 Pro Max | 在售 | ❌ | https://www.mi.com/prod/redmi-k100-pro-max/specs |
| REDMI K100 Pro | 在售 | ❌ | https://www.mi.com/prod/redmi-k100-pro/specs |
| REDMI Note 17 Pro | 在售 | ❌ | https://www.mi.com/prod/redmi-note-17-pro/specs |
| REDMI Note 17 | 在售 | ❌ | https://www.mi.com/prod/redmi-note-17/specs |
| REDMI 17 5G | 在售 | ❌ | https://www.mi.com/prod/redmi-17-5g/specs |
| REDMI Note 17 Pro 焕新版 | 在售 | ❌ | **未查到**（商城有售，无独立参数页） |

### 1.2 华为 —— 缺 29 款（官网列表 50 款，库里 47 款，重叠仅 21 款）

| 机型 | 在售 | 库里 | 参数页 URL |
|---|---|---|---|
| HUAWEI Mate 90 Pro Max | 在售 | ❌ | https://consumer.huawei.com/cn/phones/mate90-pro-max/specs/ |
| HUAWEI Mate 90 RS 非凡大师 | 在售 | ❌ | https://consumer.huawei.com/cn/phones/mate90-rs-ultimate-design/specs/ |
| HUAWEI Mate 90 Pro | 在售 | ❌ | https://consumer.huawei.com/cn/phones/mate90-pro/specs/ |
| HUAWEI Mate 90 | 在售 | ❌ | https://consumer.huawei.com/cn/phones/mate90/specs/ |
| HUAWEI Mate 70 Air | 在售 | ❌ | 待补 |
| HUAWEI Mate 70 Pro 优享版 | 在售 | ❌ | 待补 |
| HUAWEI Pura X View | 在售 | ❌ | 待补 |
| HUAWEI Pura 80 Pro+ | 在售 | ❌ | 待补 |
| HUAWEI nova 16 Ultra / 16 Pro / 16 / 16 SE / 16z | 在售 | ❌ ×5 | 待补 |
| HUAWEI nova 15 Ultra / 15 Pro / 15 | 在售 | ❌ ×3 | 待补 |
| HUAWEI nova 14 Ultra / 14 活力版 / 14 Pro / 14 | 在售 | ❌ ×4 | 待补 |
| 华为畅享 90 Pro Max / 90 Plus / 90 / 90m Plus / 80 / 70X 尊享版 / 70X / 70S | 在售 | ❌ ×8 | 待补 |
| HUAWEI Pocket 2 优享版 | 在售 | ❌ | 待补 |

> **华为是 8 品牌里缺口最大的**，Mate 90 全系（4 款）库里一台都没有。本批已把 Mate 90 全系参数页抓全（见 §2）。

### 1.3 荣耀 —— 缺 13 款

| 机型 | 在售 | 库里 | 参数页 URL |
|---|---|---|---|
| 荣耀 600 Pro | 在售 | ❌ | https://www.honor.com/cn/phones/honor-600-pro/spec/ |
| 荣耀 600 超级版 | 在售 | ❌ | 待补 |
| 荣耀 600 元气版 | 在售 | ❌ | 待补 |
| 荣耀 X80 Pro Max | 在售 | ❌ | 待补 |
| 荣耀 X80i | 在售 | ❌ | 待补 |
| 荣耀 X70 Pro Max | 在售 | ❌ | 待补 |
| 荣耀 Play11 | 在售 | ❌ | 待补 |
| 荣耀 Play11T | 在售 | ❌ | 待补 |
| 荣耀 WIN | 在售 | ❌ | 待补 |
| 荣耀 WIN2 | 订金预售 | ❌ | 待补 |
| 荣耀 WIN RT2 | 订金预售 | ❌ | 待补 |
| 荣耀 WIN Turbo2 | 订金预售 | ❌ | 待补 |
| 荣耀 Robot Phone | 在售 | ❌ | 待补 |

### 1.4 OPPO —— 缺 21 款

| 机型 | 在售 | 库里 | 参数页 URL |
|---|---|---|---|
| OPPO Reno15 Pro | 在售 | ❌ | https://www.oppo.com/cn/smartphones/series-reno/reno15-pro/specs/ |
| OPPO Reno15 / Reno15c / Reno16 / Reno16 Pro | 在售 | ❌ ×4 | 待补 |
| OPPO Find X10 E | 在售 | ❌ | 待补 |
| OPPO K15 Pro+ / K15 Pro / K15 / K15x / K15s | 在售 | ❌ ×5 | 待补 |
| OPPO K13 Turbo / K12s | 在售 | ❌ ×2 | 待补 |
| OPPO A7 Pro Max / A7 Pro / A6s Pro / A6 Pro / A6k / A6t / A6m / A6 | 在售 | ❌ ×8 | 待补 |

> 「Find X9 Pro 卫星通信版」是同机型的网络制式版本，**不算新机型**，不入差集。

### 1.5 vivo —— 缺 12 款（iQOO 已全部在库）

| 机型 | 在售 | 库里 | 参数页 URL |
|---|---|---|---|
| vivo S60 / S60 元气版 / S50 Pro mini / S50 | 在售 | ❌ ×4 | 待补（`https://www.vivo.com.cn/vivo/<型号>/param`） |
| vivo Y600i / Y600 Turbo / Y600 Pro / Y6 / Y60 | 在售 | ❌ ×5 | 待补 |
| vivo Y500 Pro / Y500 / Y50 5G | 在售 | ❌ ×3 | 待补 |

> iQOO 8 款官网在售机型库里**全部已有**（含第四批补录的 7 款）。Neo12 仍只有预约页，未发布。

### 1.6 三星 / Apple / 联想

| 品牌 | 机型 | 在售 | 库里 | 参数页 |
|---|---|---|---|---|
| 三星 | Galaxy A57 5G（4399） | 在售 | ❌ | 待补 |
| Apple | — | 在售 6 款 | ✅ 全部已有 | — |
| 联想/moto | moto razr 60（3899） | 在售 | ❌ | 商城商品页 https://item.lenovo.com.cn/product/1045234.html |
| 联想/moto | moto g100（1499） | 在售 | ❌ | https://item.lenovo.com.cn/product/1049835.html |
| 联想/moto | moto razr Fold（14999） | 在售 | ❌ | https://item.lenovo.com.cn/product/1054352.html |

> **Apple 官网在售只有 6 款**：iPhone Duo 15999 / 18 Pro 9999 / Air 8799 / 17 6799 / 17e 5299 / 16 5999。
> **iPhone 18 Pro Max、17 Pro、17 Pro Max 已不在官网在售列表** —— 按第三批口径「停售机型 `cp` 置 `null`」，这三台的 `cp` 需要处理（请工程师确认）。
> **联想品牌在库机型数 = 0**；联想商城「手机」分类下卖的其实是 moto，摩托罗拉在库 26 款但缺 razr 60 / g100 / razr Fold。

---

## 2. P2 种子块（已抓到官方参数页的 13 款）

> 官网没写的字段一律 `null`。`d`（发布日期）官网参数页不列的一律 `null`，**不猜**。
> `lp`/`cp` 商城价未逐个核实的一律 `null`。

### 2.1 小米 / REDMI 8 款

```ts
c('小米', {
  i: 'xiaomi-17t-pro',
  n: '小米 17T Pro',
  d: null, lp: null, cp: null,
  sz: 6.83, res: '2772×1280', mat: 'AMOLED', rr: 144, nit: 3500,
  soc: '天玑 9500', sb: '联发科', pr: '3nm',
  bc: 7000, bw: 100, bwl: 50, br: '22.5W 有线反向快充',
  cm: '5000 万像素 主摄',
  ct: '5000 万像素 潜望长焦（等效 115mm，5 倍光学变焦）',
  cw: '1200 万像素 超广角',
  cz: '5 倍光学变焦',
  wt: 219, bdim: '162.28×77.51×8.25mm',
  ip: 'IP68', os: 'Xiaomi HyperOS 3',
  tags: ['旗舰', '潜望长焦', '无线充电'],
  src: 'https://www.mi.com/prod/xiaomi-17t-pro/specs',
});

c('小米', {
  i: 'xiaomi-17t',
  n: '小米 17T',
  d: null, lp: null, cp: null,
  sz: 6.59, res: '2756×1268', mat: 'AMOLED', rr: 120,
  soc: '天玑 8500-Ultra', sb: '联发科', pr: '4nm',
  bc: 7000, bw: 67, bwl: null, br: '22.5W 有线反向快充',
  cm: '5000 万像素 主摄',
  ct: '5000 万像素 潜望长焦（等效 115mm，5 倍光学变焦）',
  cw: '1200 万像素 超广角',
  cz: '5 倍光学变焦',
  wt: 203, bdim: '157.63×75.19×8.17mm',
  ip: 'IP68', os: 'Xiaomi HyperOS 3',
  tags: ['中高端', '潜望长焦'],
  src: 'https://www.mi.com/prod/xiaomi-17t/specs',
});

c('小米', {
  i: 'xiaomi-17-max',
  n: '小米 17 Max',
  d: null, lp: null, cp: null,
  sz: 6.9, res: '2608×1200', mat: 'AMOLED', rr: 120,
  soc: '第五代骁龙 8 至尊版', sb: '高通', pr: '3nm',
  bc: 8000, bw: 100, bwl: 50, br: '22.5W 有线反向快充 / 支持无线反向充电',
  cm: '2 亿像素 主摄',
  ct: '5000 万像素 潜望长焦（3 倍光学变焦）',
  cw: '5000 万像素 超广角',
  cz: '3 倍光学变焦',
  wt: 225, bdim: '162.9×77.6×8.20mm',
  ip: 'IP68', os: 'Xiaomi HyperOS 3',
  tags: ['旗舰', '大电池', '潜望长焦', '无线充电'],
  src: 'https://www.mi.com/prod/xiaomi-17-max/specs',
});

c('Redmi', {
  i: 'redmi-k100-pro-max',
  n: 'REDMI K100 Pro Max',
  d: null, lp: null, cp: null,
  sz: 6.9, res: '2608×1200', mat: 'AMOLED', rr: 185, nit: 4500,
  soc: '第五代骁龙 8 至尊版', sb: '高通', pr: '3nm',
  rt: 'LPDDR5X Ultra', ft: 'UFS 4.1',
  ram: [12, 16], rom: [256, 512],
  bc: 9070, bw: 100, bwl: 50, br: '27W 有线反向快充 / 22.5W 无线反向充电',
  cm: '2 亿像素 主摄 1/1.56" f/1.68 OIS',
  ct: '5000 万像素 潜望长焦（5 倍光学变焦，OIS）',
  cw: '5000 万像素 超广角',
  cz: '5 倍光学变焦',
  fc: '3200 万像素',
  wt: 238, bdim: '163.49×77.94×8.45mm',
  os: 'Xiaomi HyperOS 3', wf: 'Wi-Fi 7', bt: '6.0', nfc: true, ir: true,
  tags: ['旗舰', '电竞屏', '潜望长焦', '无线充电'],
  src: 'https://www.mi.com/prod/redmi-k100-pro-max/specs',
});

c('Redmi', {
  i: 'redmi-k100-pro',
  n: 'REDMI K100 Pro',
  d: null, lp: null, cp: null,
  sz: 6.59, res: '2510×1156', mat: 'AMOLED 直屏', rr: 185, nit: 4500,
  soc: '第五代骁龙 8 至尊版 V Series（SM8850-1-AB）', sb: '高通', pr: '3nm（台积电第三代）',
  cpu: '第三代高通 Oryon CPU，最高主频 4.6GHz', gpu: 'Adreno GPU',
  rt: 'LPDDR5X Ultra', ft: 'UFS 4.1',
  ram: [12, 16], rom: [256, 512],
  bc: 8580, bw: 100, bwl: 50, br: '27W 有线反向快充 / 22.5W 无线反向充电',
  cm: '2 亿像素 旗舰主摄 1/1.56" f/1.68 OIS',
  ct: '5000 万像素 2.5X 黄金长焦 1/2.75" f/2.0 OIS（2.5 倍光学变焦 / 5 倍无损变焦）',
  cw: '800 万像素 超广角（112°）',
  cz: '2.5 倍光学变焦 / 5 倍无损变焦 / 60 倍最高变焦',
  fc: '3200 万像素',
  wt: 218, bdim: '157.49×75.25×8.55mm',
  os: 'Xiaomi HyperOS 3', wf: 'Wi-Fi 7', bt: '6.0', nfc: true, ir: true,
  bio: '3D 超声波指纹',
  tags: ['旗舰', '电竞屏', '长焦微距', '无线充电'],
  src: 'https://www.mi.com/prod/redmi-k100-pro/specs',
});

c('Redmi', {
  i: 'redmi-note-17-pro',
  n: 'REDMI Note 17 Pro',
  d: null, lp: null, cp: null,
  sz: 6.83, res: '2772×1280', mat: 'AMOLED 直屏', rr: 120, nit: 3500,
  soc: null, sb: null, pr: '4nm',
  cpu: '八核处理器，最高主频 2.4GHz', gpu: 'Adreno GPU',
  rt: 'LPDDR4X', ft: 'UFS 3.1（256/512GB）/ UFS 2.2（128GB）',
  ram: [8, 12], rom: [128, 256, 512],
  bc: 9000, bw: 67, bwl: null, br: '22.5W 有线反向快充',
  cm: '5000 万像素 高清主摄 1/2.76" f/1.8',
  ce: '200 万像素 景深镜头 f/2.4',
  cz: null,
  fc: '800 万像素',
  wt: 226, bdim: '163.45×78.27×8.46mm',
  os: 'Xiaomi HyperOS 3', nfc: true, ir: true,
  bio: '光学屏下指纹',
  tags: ['中端', '大电池', '长续航'],
  src: 'https://www.mi.com/prod/redmi-note-17-pro/specs',
});

c('Redmi', {
  i: 'redmi-note-17',
  n: 'REDMI Note 17',
  d: null, lp: null, cp: null,
  sz: 7.0, res: '2396×1080', mat: 'OLED 直屏', rr: 120, nit: 1800,
  soc: '第四代骁龙 4 移动平台', sb: '高通', pr: '4nm',
  cpu: '八核处理器，最高主频 2.3GHz', gpu: 'Adreno GPU',
  rt: 'LPDDR4X', ft: 'UFS 2.2',
  ram: [6, 8], rom: [128, 256],
  bc: 8000, bw: 45, bwl: null, br: '22.5W 有线反向快充',
  cm: '5000 万像素 高清主摄 f/1.8',
  cz: null,
  fc: '800 万像素',
  wt: 225, bdim: '169.70×79.14×8.26mm',
  os: 'Xiaomi HyperOS 3', nfc: true, ir: true,
  bio: '光学屏下指纹', spk: '单扬声器',
  tags: ['入门', '大电池', '大屏'],
  src: 'https://www.mi.com/prod/redmi-note-17/specs',
});

c('Redmi', {
  i: 'redmi-17-5g',
  n: 'REDMI 17 5G',
  d: null, lp: null, cp: null,
  sz: 6.9, res: '1600×720', mat: 'LCD', rr: 120, nit: 800,
  soc: '紫光展锐 T8300', sb: '紫光展锐', pr: '6nm',
  cpu: '八核 CPU，最高主频 2.2GHz', gpu: 'Mali-G57 双核',
  rt: 'LPDDR4X', ft: 'UFS 2.2',
  ram: [4, 6, 8], rom: [128, 256],
  bc: 6300, bw: 15, bwl: null, br: '7.5W 有线反向快充',
  cm: '1300 万像素 高清主摄',
  cz: null,
  fc: '800 万像素',
  wt: 210, bdim: '171.56×79.47×8.15mm',
  os: 'Xiaomi HyperOS 3', nfc: false, ir: false,
  tags: ['入门', '5G', '3.5mm 耳机孔'],
  src: 'https://www.mi.com/prod/redmi-17-5g/specs',
});
```

### 2.2 华为 Mate 90 全系 4 款

```ts
c('华为', {
  i: 'huawei-mate-90-pro-max',
  n: '华为 Mate 90 Pro Max',
  d: null, lp: null, cp: null,
  sz: 6.9, res: '2848×1320', mat: '双层 OLED', rr: 120, dim: '1440Hz 高频 PWM',
  soc: '麒麟 9050 Pro', sb: '海思', pr: null,
  ram: [12, 16], rom: [512, 1024],
  cm: '5000 万像素 超高动态摄像头 F1.4-F4.0 OIS RYYB',
  cw: '4000 万像素 超广角摄像头 F2.2 RYYB',
  ct: '2 亿像素 超大底长焦摄像头 F2.6 OIS RYYB（长焦微距）',
  cz: '4 倍光学变焦（24mm / 13mm / 89mm）/ 8 倍光学品质变焦 / 100 倍数字变焦',
  fc: '1300 万像素 超广角 F2.0 + 3D 深感摄像头',
  bc: 6800, bw: 100, bwl: 50, br: '18W 有线反向充电 / 支持无线反向充电',
  os: 'HarmonyOS 7.0',
  wt: 234, bdim: '164.5×78.7×8.15mm',
  ip: 'IP68 / IP69', bio: '3D 人脸识别 + 侧边指纹',
  sat: '北斗卫星消息', port: 'USB-C 3.1 Gen1', nfc: true,
  tags: ['旗舰', '潜望长焦', '卫星通信', '无线充电'],
  src: 'https://consumer.huawei.com/cn/phones/mate90-pro-max/specs/',
});

c('华为', {
  i: 'huawei-mate-90-pro',
  n: '华为 Mate 90 Pro',
  d: null, lp: null, cp: null,
  sz: 6.75, res: '2832×1280', mat: '双层 OLED', rr: 120, dim: '1440Hz 高频 PWM',
  soc: '麒麟 9035', sb: '海思', pr: null,
  ram: [12, 16], rom: [256, 512, 1024],
  cm: '5000 万像素 超聚光摄像头 F1.4-F4.0 OIS RYYB',
  cw: '4000 万像素 超广角摄像头 F2.2 RYYB',
  ct: '5000 万像素 超聚光微距长焦摄像头 F2.1 OIS RYYB',
  cz: '4 倍光学变焦（24mm / 13mm / 90mm）/ 8 倍光学品质变焦 / 100 倍数字变焦',
  fc: '1300 万像素 超广角 F2.0 + 3D 深感摄像头',
  bc: 6600, bw: 100, bwl: 50, br: '18W 有线反向充电 / 支持无线反向充电',
  os: 'HarmonyOS 7.0',
  wt: 222, bdim: '161.9×75.7×7.95mm',
  ip: 'IP68 / IP69', bio: '3D 人脸识别 + 侧边指纹',
  sat: '北斗卫星消息', port: 'USB-C 3.1 Gen1', nfc: true,
  tags: ['旗舰', '潜望长焦', '卫星通信', '无线充电'],
  src: 'https://consumer.huawei.com/cn/phones/mate90-pro/specs/',
});

c('华为', {
  i: 'huawei-mate-90',
  n: '华为 Mate 90',
  d: null, lp: null, cp: null,
  sz: 6.75, res: '2832×1280', mat: 'OLED', rr: 120, dim: '1440Hz 高频 PWM',
  soc: '麒麟 9030', sb: '海思', pr: null,
  ram: [12], rom: [256, 512, 1024],
  cm: '5000 万像素 超光变摄像头 F1.4-F4.0 OIS RYYB',
  cw: '4000 万像素 超广角摄像头 F2.2 RYYB',
  ct: '5000 万像素 超聚光长焦摄像头 F2.2 OIS RYYB',
  cz: '4 倍光学变焦（24mm / 13mm / 88mm）/ 8 倍光学品质变焦 / 100 倍数字变焦',
  fc: '1300 万像素 超广角 F2.0 + 3D 深感摄像头',
  bc: 6600, bw: 66, bwl: 50, br: '5W 有线反向充电 / 支持无线反向充电',
  os: 'HarmonyOS 7.0',
  wt: 217, bdim: '161.9×75.7×7.95mm',
  ip: 'IP68 / IP69', bio: '3D 人脸识别 + 侧边指纹',
  sat: '北斗卫星消息', port: 'USB-C 3.1 Gen1', nfc: true,
  tags: ['旗舰', '潜望长焦', '卫星通信', '无线充电'],
  src: 'https://consumer.huawei.com/cn/phones/mate90/specs/',
});

c('华为', {
  i: 'huawei-mate-90-rs-ultimate-design',
  n: '华为 Mate 90 RS 非凡大师',
  d: null, lp: null, cp: null,
  sz: 6.9, res: '2848×1320', mat: '双层 OLED', rr: 120, dim: '1440Hz 高频 PWM',
  soc: '麒麟 9050 Pro', sb: '海思', pr: null,
  ram: [16], rom: [512, 1024, 2048],
  cm: '5000 万像素 超高动态摄像头 F1.4-F4.0 OIS RYYB',
  cw: '4000 万像素 超广角摄像头 F2.2 RYYB',
  ct: '2 亿像素 超大底长焦摄像头 F2.6 OIS RYYB（长焦微距）',
  cz: '4 倍光学变焦（24mm / 13mm / 89mm）/ 8 倍光学品质变焦 / 100 倍数字变焦',
  fc: '1300 万像素 超广角 F2.0 + 3D 深感摄像头',
  bc: 6800, bw: 100, bwl: 50, br: '18W 有线反向充电 / 支持无线反向充电',
  os: 'HarmonyOS 7.0',
  wt: 248, bdim: '164.5×78.7×8.4mm',
  bm: '高亮钛中框',
  ip: 'IP68 / IP69', bio: '3D 人脸识别 + 侧边指纹',
  sat: '天通卫星通信 / 北斗卫星消息', port: 'USB-C 3.1 Gen1', nfc: true,
  tags: ['旗舰', '高端', '潜望长焦', '卫星通信', '无线充电'],
  src: 'https://consumer.huawei.com/cn/phones/mate90-rs-ultimate-design/specs/',
});
```

### 2.3 荣耀 / OPPO 各 1 款

```ts
c('荣耀', {
  i: 'honor-600-pro',
  n: '荣耀 600 Pro',
  d: null, lp: null, cp: null,
  sz: 6.57, res: '2728×1264', mat: 'AMOLED', rr: null, nit: 8000, dim: '3840Hz 高频 PWM',
  soc: '天玑 8550 Elite', sb: '联发科', pr: null,
  cpu: '1×Cortex-A725 3.4GHz + 3×Cortex-A725 3.2GHz + 4×Cortex-A725 2.2GHz',
  gpu: 'Mali-G720 MC8',
  cm: '2 亿像素 广角摄像头 f/1.9 OIS',
  ct: '5000 万像素 潜望长焦摄像头 f/2.8 OIS',
  cw: '1200 万像素 超广角微距摄像头 f/2.2',
  cz: '最大 120 倍数字变焦（光学变焦倍数官网未标注）',
  bc: 8000, bw: 80, bwl: 50, br: '支持无线反向充电 / OTG 有线反向供电 5V1A（约 5W）',
  os: 'Android 16', ui: 'MagicOS 10',
  wt: 202, bdim: '156.1×74.8×7.88mm',
  ip: 'IP68 / IP69 / IP69K',
  tags: ['中高端', '大电池', '潜望长焦', '无线充电'],
  src: 'https://www.honor.com/cn/phones/honor-600-pro/spec/',
});

c('OPPO', {
  i: 'oppo-reno15-pro',
  n: 'OPPO Reno15 Pro',
  d: null, lp: null, cp: null,
  sz: 6.78, res: '2772×1272', mat: '直面屏', rr: 120, ppi: 450, nit: 1800,
  soc: '天玑 8450', sb: '联发科', pr: null,
  cpu: '8 核心，最高主频 3.25GHz',
  rt: 'LPDDR5X', ft: 'UFS 3.1',
  ram: [12, 16], rom: [256, 512, 1024],
  cm: '2 亿像素 广角摄像头 f/1.8（等效 24mm）OIS',
  cw: '5000 万像素 超广角摄像头 f/2.0（等效 16mm，116°）',
  ct: '5000 万像素 长焦摄像头 f/2.8（等效 80mm）OIS',
  cz: '3.5 倍光学变焦 / 120 倍数码变焦',
  fc: '5000 万像素 f/2.0（等效 18mm）AF',
  bc: 6500, bwh: 25.48, bw: 80, bwl: 50, br: null,
  os: 'ColorOS 16.0',
  wt: 205, bdim: '161.26×76.46×7.65mm',
  bio: '屏下指纹 + 面部识别', nfc: true, ir: true,
  tags: ['中高端', '潜望级长焦', '无线充电'],
  src: 'https://www.oppo.com/cn/smartphones/series-reno/reno15-pro/specs/',
});
```

---

## 3. 本批「官网不给」的字段（一律 null，不猜）

| 机型 | 缺失字段 | 说明 |
|---|---|---|
| 全部 13 款 | `d`（发布日期） | 参数页不列发布日期；小米/华为/荣耀/OPPO 参数页均无此字段 |
| 全部 13 款 | `lp` / `cp` | 本批只用参数页，商城价未逐个核实 |
| REDMI Note 17 Pro | `soc` | 参数页只写「4nm 八核 2.4GHz Adreno GPU」，**未点名芯片型号** |
| 荣耀 600 Pro | `rr`（刷新率） | 参数页只写「3840Hz PWM 调光」，全篇无刷新率数值 |
| 荣耀 600 Pro | `cz` 的光学变焦倍数 | 只写「最大 120 倍数字变焦」，未写光学倍数（**不推断**） |
| 华为 Mate 90 全系 | `pr`（制程） | 华为从不公布制程 |
| OPPO Reno15 Pro | `br` | 参数页全文只有「OTG 数据传输 支持」，无反向充电 |

---

## 4. P1 反向充电：小米/Redmi 抽查 8 款 —— 推翻「小米统一 22.5W」

按新纪律「某品牌应该都支持 XX 必须抽查 ≥3 款不同档位」，本批对小米/Redmi 抽了 **8 款、覆盖旗舰 / 中端 / 入门三档**：

| 档位 | 机型 | 官网 `br` 原文 | URL |
|---|---|---|---|
| 旗舰 | REDMI K100 Pro Max | `27W 有线反充｜22.5W 无线反充` | /prod/redmi-k100-pro-max/specs |
| 旗舰 | REDMI K100 Pro | `27W 有线反充｜22.5W 无线反充` | /prod/redmi-k100-pro/specs |
| 旗舰 | 小米 17 Max | `22.5W 有线反充` + 支持无线反充（无瓦数） | /prod/xiaomi-17-max/specs |
| 旗舰 | 小米 17T Pro | `22.5W 有线反向快充` | /prod/xiaomi-17t-pro/specs |
| 中端 | 小米 17T | `22.5W 有线反向快充`（无无线充电） | /prod/xiaomi-17t/specs |
| 中端 | REDMI Note 17 Pro | `22.5W 有线反充` | /prod/redmi-note-17-pro/specs |
| 入门 | REDMI Note 17 | `22.5W 有线反充` | /prod/redmi-note-17/specs |
| 入门 | REDMI 17 5G | **`7.5W 有线反充`** | /prod/redmi-17-5g/specs |

**结论：小米/Redmi 的反向充电不能一刀切写 22.5W。** 入门档（REDMI 17 5G）是 **7.5W**；旗舰档 K100 系列 **有线 27W + 无线 22.5W**。据此建议：库里小米/Redmi 的 `br` **必须按机型逐个回填**，不能用品牌默认值。

**华为 Mate 90 全系 4 款（第二次验证「按机型分档」）**：

| 机型 | 官网 `br` | URL |
|---|---|---|
| Mate 90 | `支持 5 W 有线反向充电` + 无线反向（无瓦数） | /phones/mate90/specs/ |
| Mate 90 Pro | `支持 18 W 有线反向充电` + 无线反向（无瓦数） | /phones/mate90-pro/specs/ |
| Mate 90 Pro Max | `支持 18 W 有线反向充电` + 无线反向（无瓦数） | /phones/mate90-pro-max/specs/ |
| Mate 90 RS 非凡大师 | `支持 18 W 有线反向充电` + 无线反向（无瓦数） | /phones/mate90-rs-ultimate-design/specs/ |

与第三批 Mate 80 系列的口径完全一致（标准版 5W / Pro 及以上 18W）——**这条已经抽了 8 款（Mate 80 + Mate 90 各 4 款），可以定为华为的稳定口径**。

---

## 5. 待补录（差集里本批未抓参数页的，共 74 款）

华为 25、OPPO 20、荣耀 12、vivo 12、三星 1、联想/moto 3、REDMI Note 17 Pro 焕新版 1。
按优先级建议：**华为 Mate 90 之外的 nova 16 / 畅享 90 系列 → OPPO Reno16 / K15 → 荣耀 600 / X80 → vivo S50 / Y500 → 三星 A57 5G → moto razr 60 / g100 / razr Fold**。

**未查到**：REDMI Note 17 Pro 焕新版（商城有售、无独立参数页）。
