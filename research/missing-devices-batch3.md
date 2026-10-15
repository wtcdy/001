# 缺失在售机型种子块（第四批 / 2026-10-14）

> 任务：补齐「官网在售、库里没有」的 14 款机型，写成可直接灌入的 `CompactSeed` 种子块。
>
> **口径**
> 1. 全部取自**厂商官网规格参数页**（不是产品营销页，营销页只有卖点没有参数表）。
> 2. 官网没写的字段一律 `null`，**不推断、不换算、不凭印象补**。
> 3. `cp`（现价）= 官网当前价格；vivo/iQOO 官网「建议零售价」即现行官方价，可直接用。
> 4. `br`（反向充电）按团队口径：官网只写 OTG → 写 OTG，不带瓦数；官网不写 → `null`。
> 5. `src` 填官方参数页 URL，方便复核。
>
> **本批结果**：14 款里 **13 款拿到了官方参数页**，**1 款（iQOO Neo12）官网尚未建参数页**（只有预约活动页）。

---

## 0. 重大口径修正：vivo / iQOO 官网**是标反向充电**的

第三批我报过「vivo 中文官网从不标反向充电」，**这条是错的，本批推翻**。

vivo 官网有两层页面：

- 产品营销页 `/vivo/<型号>/` —— 只有卖点，**确实没有反向充电**；
- **规格参数页 `/vivo/<型号>/param`** —— 参数表里有独立字段：

```
## 电池信息
  - OTG反向充电
    支持
```

我对本批 8 款 vivo/iQOO 机型逐页核对，**全部写着「OTG反向充电：支持」**，无一款例外，也**没有一款给出瓦数**。

因此修正结论：

| 品牌 | `br` 写法 | 依据 |
|---|---|---|
| vivo / iQOO（全系） | `'支持 OTG 反向充电'` | 官网规格参数页「OTG反向充电：支持」，无瓦数 |
| OPPO（Find X9 系列起） | `null` | 官网参数页全文只有「OTG 数据传输 支持」，无「反向充电」字样 |
| 华为 | 按机型分档（见下） | Mate XTs = 5W 有线 + 7.5W 无线；Mate XT 2 = 无线反向（无瓦数） |
| Apple | `null` | 官网不公布 |

**影响面**：库里 vivo 系的 `br` 应按 `'支持 OTG 反向充电'` 回填，而不是我之前建议的 `null`；OPPO 系的 `br` 仍建议 `null`。

---

## 1. iQOO 7 款（官网在售 8 款，库里只有 2 款——缺口最大）

### 1.1 iQOO 15 Ultra

官方参数页：https://www.vivo.com.cn/vivo/param/iqoo15ultra （设备型号 V2546A）

```ts
c('iQOO', {
  i: 'iqoo-15-ultra',
  n: 'iQOO 15 Ultra',
  d: '2026-02',
  lp: 6499,
  cp: 6499,
  sz: 6.85, res: '3168×1440', mat: 'AMOLED', rr: 144, nit: 8000,
  soc: '第五代骁龙 8 至尊版移动平台', sb: '高通', pr: '3nm',
  cpu: '八核 4.6GHz×2 + 3.62GHz×6', gpu: 'Adreno 840',
  rt: 'LPDDR5X Ultra Pro 四通道', ft: 'UFS 4.1',
  ram: [16, 24], rom: [256, 512, 1024],
  cm: '5000 万像素 索尼超防抖大底主摄 f/1.88 OIS',
  cw: '5000 万像素 超广角 f/2.05',
  ct: '5000 万像素 索尼超级潜望长焦 f/2.65 OIS',
  cz: '3 倍光学变焦 / 6 倍无损级变焦 / 至高 100 倍数码变焦',
  cv: '后置最高 8K；前置最高 4K',
  fc: '3200 万像素 f/2.2',
  bc: 7400, bw: 100, bwl: 40, br: '支持 OTG 反向充电',
  os: 'Android 16', ui: 'OriginOS 6',
  wt: 227, bdim: '163.65×76.80×8.70mm',
  ip: 'IP68/IP69', bio: '超声波 3D 指纹 + 面部识别',
  port: 'USB-C 3.2 Gen1', nfc: true, ir: true,
  tags: ['游戏手机', '旗舰', '潜望长焦', '无线充电'],
  src: 'https://www.vivo.com.cn/vivo/param/iqoo15ultra',
});
```

### 1.2 iQOO 15T

官方参数页：https://www.vivo.com.cn/vivo/param/iqoo15t （V2564A）

```ts
c('iQOO', {
  i: 'iqoo-15t',
  n: 'iQOO 15T',
  d: '2026-05',
  lp: 4099,
  cp: 4099,
  sz: 6.82, res: '3168×1440', mat: 'AMOLED', rr: 144, nit: 4500,
  soc: '天玑 9500 Monster 版', sb: '联发科', pr: '3nm',
  cpu: '八核 4.21GHz×1 + 3.5GHz×3 + 2.7GHz×4', gpu: 'ARM G1-Ultra',
  rt: 'LPDDR5X Ultra 四通道', ft: 'UFS 4.1',
  ram: [12, 16], rom: [256, 512, 1024],
  cm: '2 亿像素 大底超级主摄 f/1.88 OIS',
  cw: '5000 万像素 旗舰超广角 f/2.0',
  ct: null,
  cz: '4 倍无损变焦 / 40 倍数码变焦',
  cv: '后置最高 8K；前置最高 1080P',
  fc: '1600 万像素 f/2.45',
  bc: 8000, bw: 100, bwl: null, br: '支持 OTG 反向充电',
  os: 'Android 16', ui: 'OriginOS 6',
  wt: 223, bdim: '163.37×76.71×8.40mm',
  ip: 'IP68/IP69', bio: '超声波 3D 指纹 + 面部识别',
  port: 'USB-C 2.0', nfc: true, ir: true,
  ce: '自研电竞芯片 Q3',
  tags: ['游戏手机', '旗舰', '长续航', '2亿像素'],
  src: 'https://www.vivo.com.cn/vivo/param/iqoo15t',
});
```

> 注：重量按配色分——赛道版 216g / 8.25mm，传奇版·青云 223g / 8.40mm；这里取玻璃后盖版。
> 规格参数页**未列出无线充电**，故 `bwl: null`（营销页也无无线充电字样）。

### 1.3 iQOO Neo11 至尊版

官方参数页：https://www.vivo.com.cn/vivo/param/iqooneo11zun （V2573A）

```ts
c('iQOO', {
  i: 'iqoo-neo11-zun',
  n: 'iQOO Neo11 至尊版',
  d: '2026-08',
  lp: 3699,
  cp: 3699,
  sz: 6.83, res: '3200×1440', ppi: 514, mat: 'AMOLED', rr: 144, nit: 4500,
  soc: '天玑 9500M', sb: '联发科', pr: '3nm',
  cpu: '八核 4.21GHz×1 + 3.5GHz×3 + 2.7GHz×4', gpu: 'ARM G1-Ultra',
  rt: 'LPDDR5X Ultra 四通道', ft: 'UFS 4.1',
  ram: [12, 16], rom: [256, 512],
  cm: '5000 万像素 超防抖 LYT700V 索尼大底主摄 f/1.88 OIS',
  cw: '800 万像素 超广角 f/2.2',
  ct: null,
  cz: '后置主摄 20 倍数字变焦',
  cv: '后置最高 8K；前置最高 1080P',
  fc: '1600 万像素 f/2.45',
  bc: 9100, bw: 100, bwl: null, br: '支持 OTG 反向充电',
  os: 'Android 16', ui: 'OriginOS 6',
  wt: 230, bdim: '163.42×75.88×8.69mm',
  ip: 'IP68/IP69', bio: '超声波 3D 指纹 + 面部识别',
  port: 'USB-C 2.0', nfc: true, ir: true,
  ce: '自研电竞芯片 Q2',
  tags: ['游戏手机', '长续航', '2K屏'],
  src: 'https://www.vivo.com.cn/vivo/param/iqooneo11zun',
});
```

> 重量按配色分：疾影黑 225g / 8.60mm；驰光白·乘风 230g / 8.69mm。

### 1.4 iQOO Z11

官方参数页：https://www.vivo.com.cn/vivo/param/iqooz11 （V2551A）

```ts
c('iQOO', {
  i: 'iqoo-z11',
  n: 'iQOO Z11',
  d: '2026-03',
  lp: 2699,
  cp: 2699,
  sz: 6.83, res: '2800×1260', mat: 'AMOLED', rr: 165, nit: 5000,
  soc: '天玑 8500 满血版', sb: '联发科', pr: '4nm', an: 2625016,
  cpu: '八核 1×A725 3.4GHz + 3×A725 3.2GHz + 4×A725 2.2GHz', gpu: 'Mali-G720 MC8',
  ram: [8, 12, 16], rom: [256, 512],
  cm: '5000 万像素 主摄 f/1.79 OIS',
  cw: null, ct: null,
  ce: '200 万像素 景深镜头 f/2.4',
  cz: '后置主摄 10 倍数字变焦',
  cv: '后置最高 4K；前置最高 1080P',
  fc: '1600 万像素 f/2.45',
  bc: 9020, bw: 90, bwl: null, br: '支持 OTG 反向充电',
  os: 'Android 16', ui: 'OriginOS 6',
  wt: 217, bdim: '163.72×76.17×8.25mm',
  ip: 'IP68/IP69', bio: '屏下光学指纹 + 面部识别',
  port: 'USB-C 2.0', nfc: true, ir: true,
  tags: ['长续航', '高刷屏', '千元机'],
  src: 'https://www.vivo.com.cn/vivo/param/iqooz11',
});
```

> 重量官网写「约 216.5g」，`wt` 取整数 217。安兔兔 2625016 来自官网营销页（vivo 实验室，安兔兔 V11.0.9，16GB+512GB 版本）。

### 1.5 iQOO Z11S

官方参数页：https://www.vivo.com.cn/vivo/param/iqooz11s （V2603A）

```ts
c('iQOO', {
  i: 'iqoo-z11s',
  n: 'iQOO Z11S',
  d: '2026-08',
  lp: 1999,
  cp: 1999,
  sz: 6.83, res: '2800×1260', mat: 'AMOLED', rr: 144, nit: 2000,
  soc: '天玑 7500 满血版', sb: '联发科', pr: '4nm', an: 1309171,
  cpu: '八核 2.6GHz×4 + 2.0GHz×4', gpu: 'Mali G625',
  rt: 'LPDDR4X 双通道', ft: 'UFS 3.1',
  ram: [8, 12], rom: [128, 256, 512],
  cm: '5000 万像素 主摄 f/1.8',
  cw: null, ct: null,
  cz: '后置主摄 10 倍数字变焦',
  cv: '后置最高 4K；前置最高 1080P',
  fc: '800 万像素 f/2.05',
  bc: 10000, bw: 44, bwl: null, br: '支持 OTG 反向充电',
  os: 'Android 16', ui: 'OriginOS 6',
  wt: 225, bdim: '163.90×76.50×8.59mm',
  ip: 'IP68/IP69', bio: '屏下光学指纹 + 面部识别',
  port: 'USB-C 2.0', nfc: true, ir: true,
  tags: ['长续航', '千元机', '万毫安'],
  src: 'https://www.vivo.com.cn/vivo/param/iqooz11s',
});
```

### 1.6 iQOO Z11i

官方参数页：https://www.vivo.com.cn/vivo/param/iqooz11i （V2559UA）

```ts
c('iQOO', {
  i: 'iqoo-z11i',
  n: 'iQOO Z11i',
  d: '2026-07',
  lp: 1299,
  cp: 1299,
  sz: 6.74, res: '1600×720', mat: 'LCD', rr: 120, nit: 1200,
  soc: '第二代骁龙 4 移动平台', sb: '高通', pr: '4nm',
  cpu: '八核 2.2GHz×2 + 1.95GHz×6', gpu: 'Adreno 613',
  rt: 'LPDDR4X 双通道', ft: 'UFS 3.1',
  ram: [6, 8], rom: [128, 256],
  cm: '1300 万像素 主摄 f/2.2',
  cw: null, ct: null,
  cz: '后置主摄 10 倍数字变焦',
  cv: '前后置最高 1080P；慢动作最高 720P',
  fc: '500 万像素 f/2.2',
  bc: 6500, bw: 15, bwl: null, br: '支持 OTG 反向充电',
  os: 'Android 16', ui: 'OriginOS 6',
  wt: 209, bdim: '167.40×77.10×8.39mm',
  ip: 'IP65', bio: '侧边电容指纹 + 面部识别',
  port: 'USB-C 2.0', nfc: false, ir: true,
  tags: ['长续航', '百元机', '入门'],
  src: 'https://www.vivo.com.cn/vivo/param/iqooz11i',
});
```

### 1.7 iQOO Neo12 —— **未查到，官网只有预约页**

- vivo 官网 iQOO 机型导航里，Neo12 的入口是**预约活动页**，不是产品页：
  `https://wukongapi.vivo.com.cn/wukongtopic/activity/link/neo12`
- `https://www.vivo.com.cn/vivo/iqooneo12` 与 `https://www.vivo.com.cn/vivo/param/iqooneo12` 均**跳回官网首页**（页面不存在）。
- 结论：**尚未发布 / 仅有预约，官网没有参数页**，本批不写种子块。等正式发布后按
  `https://www.vivo.com.cn/vivo/param/iqooneo12` 补。

---

## 2. 华为 2 款

### 2.1 华为 Mate XTs 非凡大师

官方参数页：https://consumer.huawei.com/cn/phones/mate-xts-ultimate-design/specs/

```ts
c('华为', {
  i: 'huawei-mate-xts',
  n: '华为 Mate XTs 非凡大师',
  d: '2025-09-04',
  lp: 17999,
  cp: 17999,
  ff: 'fold-triple',
  sz: 10.2, res: '2232×3184', mat: 'OLED（LTPO）', rr: 120,
  fsz: 6.4, fres: '2232×1008',
  soc: '麒麟 9020', sb: '海思',
  ram: [16], rom: [256, 512, 1024],
  cm: '5000 万像素 超光变摄像头 F1.4-F4.0 十档物理可变光圈 RYYB OIS',
  cw: '4000 万像素 超广角 F2.2 RYYB',
  ct: '1200 万像素 潜望式长焦 F3.4 RYYB OIS',
  ce: '150 万 多光谱通道红枫原色摄像头',
  cz: '5.5 倍光学变焦 / 50 倍数字变焦',
  cv: '最高 3840×2160；1080p@960fps 超级慢动作',
  fc: '800 万像素 超广角 F2.2',
  bc: 5600, bw: 66, bwl: 50, br: '5W 有线反向充电 / 7.5W 无线反向充电',
  os: 'HarmonyOS 5.1', ui: 'HarmonyOS',
  sat: '天通卫星通信',
  wt: 298,
  bdim: '三屏态 156.7×219.0×3.6mm；单屏态 156.7×73.5×12.8mm',
  ip: '不支持',
  bio: '侧边指纹 + 面部识别',
  port: 'USB-C 3.1 Gen1（支持 DP1.2）', nfc: true,
  tags: ['折叠屏', '三折叠', '旗舰', '卫星通信'],
  src: 'https://consumer.huawei.com/cn/phones/mate-xts-ultimate-design/specs/',
});
```

> 官网「防尘抗水」明确写 **不支持** —— 这是官方口径，不要填 IP 值。
> 反向充电官网原文：`支持 5 W 有线反向充电` / `支持 7.5 W 无线反向充电`。

### 2.2 华为 Mate XT 2 非凡大师

官方参数页：https://consumer.huawei.com/cn/phones/mate-xt-2-ultimate-design/specs/

```ts
c('华为', {
  i: 'huawei-mate-xt-2',
  n: '华为 Mate XT 2 非凡大师',
  d: '2026-09-07',
  lp: 19999,
  cp: 19999,
  ff: 'fold-triple',
  sz: 10.2, res: '2232×3184', ppi: 382, mat: 'OLED（LTPO）', rr: 120,
  fsz: 6.5, fres: '2442×1140',
  soc: '麒麟 9050 Pro', sb: '海思',
  ram: [16], rom: [256, 512, 1024],
  cm: '5000 万像素 超高动态范围摄像头 F1.49-F4.0 连续可变光圈 OIS RYYB 1/1.28"',
  cw: '4000 万像素 超广角 F2.2 RYYB',
  ct: '5000 万像素 超大光圈潜望式长焦 F2.2 RYYB OIS',
  ce: '第三代红枫原色摄像头',
  cz: '3.5 倍光学变焦 / 7 倍光学品质变焦 / 100 倍数字变焦',
  cv: '最高 4K（3840×2160）；1080p@960fps 超级慢动作',
  fc: '800 万像素 超广角 F2.4（内外屏各一颗）',
  bc: 5600, bw: 66, bwl: 50, br: '支持无线反向充电',
  os: 'HarmonyOS 7.0', ui: 'HarmonyOS',
  sat: '天通卫星通话 / 卫星寻呼 / 双向北斗卫星消息',
  wt: 299,
  bdim: '三屏态 157.2×219.2×3.5mm；折叠态 157.2×77.0×12.3mm',
  ip: 'IP58/IP59',
  bio: '侧边指纹 + 面部识别',
  port: 'USB-C 3.1 Gen1', nfc: true,
  tags: ['折叠屏', '三折叠', '旗舰', '卫星通信'],
  src: 'https://consumer.huawei.com/cn/phones/mate-xt-2-ultimate-design/specs/',
});
```

> 反向充电官网原文只有一句「支持无线反向充电」，**未给瓦数**，故不带数字。
> 注意与 Mate XTs 的差异：XTs 明确给了 5W 有线 + 7.5W 无线，XT 2 只说无线反向。
> 另有灵盾防窥屏版（16GB+1TB 24999）与手写笔套装（16GB+2TB 29999），参数基本相同，是否单列请团队定。

---

## 3. vivo 2 款

### 3.1 vivo X Fold6

官方参数页：https://www.vivo.com.cn/vivo/param/xfold6 （V2545A）

```ts
c('vivo', {
  i: 'vivo-x-fold6',
  n: 'vivo X Fold6',
  d: '2026-06',
  lp: 7999,
  cp: 7999,
  ff: 'fold-h',
  sz: 8.02, res: '2504×2312', mat: 'AMOLED', rr: 120,
  fsz: 6.51, fres: '2528×1120',
  soc: '天玑 9500 超能版', sb: '联发科', pr: '3nm',
  cpu: '八核 4.21GHz×1 + 3.5GHz×3 + 2.7GHz×4', gpu: 'ARM G1-Ultra',
  rt: 'LPDDR5X Ultra', ft: 'UFS 4.1',
  ram: [12, 16], rom: [256, 512, 1024],
  cm: '2 亿像素 蔡司超级主摄 f/1.68 OIS',
  cw: '5000 万像素 蔡司超视野超广角 f/2.05',
  ct: '5000 万像素 蔡司 APO 超级长焦 f/2.57 OIS',
  ce: '蓝图影像芯片 V3+',
  cz: '后置长焦最大 100 倍数字变焦',
  cv: '最高 8K；慢镜头最高 4K',
  fc: '2000 万像素 f/2.4（内外屏各一颗）',
  bc: 7000, bw: 80, bwl: 40, br: '支持 OTG 反向充电',
  os: 'Android 16', ui: 'OriginOS 6 Fold',
  wt: 228,
  bdim: '展开 157.16×145.66×4.4mm；折叠 157.16×74.26×9.4mm',
  ip: 'IPX8/IPX9（IP5X 防尘）',
  bio: '侧边电容指纹 + 面部识别',
  port: 'USB-C 3.2 Gen2（支持 DP 投屏）', nfc: true, ir: true,
  tags: ['折叠屏', '旗舰', '蔡司', '影像旗舰'],
  src: 'https://www.vivo.com.cn/vivo/param/xfold6',
});
```

> 电池官网写的是**双电芯并联**：2946mAh + 4054mAh（等效于 7000mAh 单电池，3.78V，26.47Wh）。
> 这里按等效值填 `bc: 7000`，并在备注里说明是双电芯。
> 重量/厚度按配色分：蓝洞 235g / 展开 4.8mm·折叠 9.9mm；盐湖·极夜 228g / 4.4mm·9.4mm。

### 3.2 vivo X300 E

官方参数页：https://www.vivo.com.cn/vivo/param/x300e （V2612A）

```ts
c('vivo', {
  i: 'vivo-x300-e',
  n: 'vivo X300 E',
  d: '2026-07',
  lp: 4799,
  cp: 4799,
  sz: 6.59, res: '2750×1260', mat: 'AMOLED', rr: 144,
  soc: '第五代骁龙 8 移动平台', sb: '高通', pr: '3nm',
  cpu: '八核 3.80GHz×2 + 3.32GHz×6', gpu: 'Adreno 829',
  rt: 'LPDDR5X 四通道', ft: 'UFS 4.1',
  ram: [12], rom: [256, 512],
  cm: '5000 万像素 蔡司超感光大底主摄 f/1.88 OIS',
  cw: '800 万像素 超视野超广角 f/2.2',
  ct: '5000 万像素 蔡司超级长焦 f/2.65 OIS',
  cz: '后置长焦最大 100 倍数字变焦',
  cv: '最高 4K；慢镜头最高 4K',
  fc: '5000 万像素 f/2.0',
  bc: 7200, bw: 90, bwl: null, br: '支持 OTG 反向充电',
  os: 'Android 16', ui: 'OriginOS 6',
  wt: 200, bdim: '157.52×74.33×7.79mm',
  ip: null,
  bio: '3D 超声波单点指纹 + 面部识别',
  port: 'USB-C 2.0', nfc: true, ir: true,
  tags: ['影像旗舰', '蔡司', '小屏旗舰'],
  src: 'https://www.vivo.com.cn/vivo/param/x300e',
});
```

> 重量按配色分：月光白 203g / 7.99mm；辰夜黑·日光橙 199.5g / 7.79mm。
> **防水等级**：vivo 规格参数页未列防水项，营销页也未提 IP 等级 → `ip: null`（不推断）。

---

## 4. OPPO Find X9s Pro

官方参数页：https://www.oppo.com/cn/smartphones/series-find/find-x9s-pro/specs/ （入网型号 PME110）
发布日期来自新华网/央广网发布会报道：2026-04-21 成都发布，4-24 开售，起售价 5299。

```ts
c('OPPO', {
  i: 'oppo-find-x9s-pro',
  n: 'OPPO Find X9s Pro',
  d: '2026-04-21',
  lp: 5299,
  cp: 5299,
  sz: 6.32, res: '2640×1216', ppi: 460, mat: 'AMOLED', rr: 144, nit: 1800,
  soc: '天玑 9500', sb: '联发科', pr: '3nm',
  cpu: '八核 最高主频 4.21GHz',
  rt: 'LPDDR5X', ft: 'UFS 4.1',
  ram: [12, 16], rom: [256, 512, 1024],
  cm: '2 亿像素 广角 f/1.6 等效 23mm 7P 两轴 OIS',
  cw: '5000 万像素 超广角 f/2.0 等效 15mm 120°',
  ct: '2 亿像素 长焦 f/2.6 等效 65mm 5P 两轴 OIS',
  ce: '第二代丹霞色彩还原镜头 f/2.4 等效 19mm',
  cz: '2.8 倍光学变焦 / 120 倍数码变焦',
  cv: '8K 30fps；4K 120fps 杜比视界',
  fc: '3200 万像素 f/2.4 等效 21mm',
  bc: 7025, bw: 80, bwl: 50, br: null,
  os: 'Android 16', ui: 'ColorOS 16',
  wt: 198, bdim: '150.46×71.72×8.40mm',
  ip: 'IP66/IP68/IP69',
  bio: '屏下超声波指纹 + 面部识别',
  port: 'USB-C', nfc: true, ir: true,
  ce: '第二代丹霞色彩还原镜头 f/2.4 等效 19mm；AI 通信芯片 R100B',
  tags: ['影像旗舰', '哈苏', '潜望长焦', '小屏旗舰'],
  src: 'https://www.oppo.com/cn/smartphones/series-find/find-x9s-pro/specs/',
});
```

> **反向充电 `br: null`**：官网参数页只有「OTG 数据传输 支持」，全文无「反向充电」字样。
> 与第三批核实的 Find X9 / X9 Pro / X9 Ultra 一致——**OPPO Find X9 系列官网一律不标反向充电**。
> 重量按配色分：乘风青 200g / 8.60mm；元气橙·原生钛·自在白 198g / 8.40mm。
> `cp` 取发布价 5299（刘作虎发布会明确「起售价与上代持平不涨价」）；若官网商城后续调价需工程师复核。

---

## 5. iPhone 17e

官方参数页：https://www.apple.com.cn/iphone-17e/specs/
发布/发售与首发价来自 Apple 官方新闻稿：https://www.apple.com.cn/cn/newsroom/2026/03/apple-introduces-iphone-17e/ （2026-03-02 发布，3-11 发售，256GB 售 RMB 4499）
现价 5299 = Apple 官网当前标注「RMB 5299 起」。

```ts
c('Apple', {
  i: 'iphone-17e',
  n: 'iPhone 17e',
  d: '2026-03-11',
  lp: 4499,
  cp: 5299,
  sz: 6.1, res: '2532×1170', ppi: 460, mat: 'OLED（超视网膜 XDR）', rr: 60, nit: 1200,
  soc: 'A19', sb: 'Apple',
  cpu: '6 核（2 性能核 + 4 能效核）', gpu: '4 核图形处理器（含神经网络加速器）',
  ram: [], rom: [256, 512],
  cm: '4800 万像素 融合式主摄 26mm f/1.6 OIS',
  cw: null,
  ct: '1200 万像素 2 倍长焦 52mm f/1.6 OIS',
  cz: '2 倍光学品质长焦 / 最高 10 倍数码变焦',
  cv: '4K 杜比视界 60fps；慢动作 1080p 240fps',
  fc: '1200 万像素 原深感摄像头 f/1.9',
  bc: null, bw: null, bwl: 15, br: null,
  os: 'iOS 26', ui: 'iOS',
  wt: 170, bdim: null,
  ip: 'IP68',
  bio: '面容 ID',
  port: 'USB-C 2.0', nfc: true, ir: false,
  tags: ['入门', '小屏', '长续航'],
  src: 'https://www.apple.com.cn/iphone-17e/specs/',
});
```

**本条有 4 个字段官网确实没给，写 null，不要硬填：**

| 字段 | 情况 |
|---|---|
| `bc` | Apple 从不公布 mAh，官网只给「视频播放最长 26 小时 / 流媒体 21 小时」 |
| `bw` | 官网只写「30 分钟最多充至 50%，需使用 20 瓦或更大功率适配器」——未标本机充电瓦数。库内 iPhone 17 填的是 40，是否沿用请工程师定 |
| `bdim` | 官网「尺寸与重量」节只给了 170g，**未列高/宽/厚**。ZOL 为 146.7×71.5×7.8mm（非官网，需标注来源） |
| `rr` | 官网未标刷新率（媒体普遍报 60Hz）。ZOL 写 60Hz，非官网值 |

另注：`os` 我填 `iOS 26`（与库内 iPhone 17 口径一致）；Apple 官网今日「包装内容」写的是「装有 iOS 27 的 iPhone」，那是当前出厂系统，不是发布时系统。

---

## 6. 顺带修正：库内已有的 `iqoo-16` 数据严重不全

`iqoo-16` 已在库里，但字段大面积缺失（releaseDate 只有年份「2026」、launchPrice null、三摄/前置/系统/防水全 null）。
官方参数页已抓到：https://www.vivo.com.cn/vivo/param/iqoo16 （V2606A）

```
上市时间：2026 年 9 月
建议零售价：12+256GB 5999 / 12+512GB 6799 / 16+512GB 7499 / 16+1TB 8499
三围重量：163.75 × 76.90 × 8.30mm（赛道）/8.40mm（传奇）/8.55mm（逐光）；222.5g / 227.9g / 229.8g
处理器：第六代骁龙 8 超级至尊版  2nm  八核 5.01GHz×2 + 4.03GHz×3 + 3.74GHz×3
存储：12/16GB  LPDDR5X Ultra（16+1TB 为 Ultra Pro）；256/512/1TB  UFS 4.1
屏幕：6.85" 3168×1440 AMOLED 最高 165Hz
电池：典型 8400mAh（3.73V / 31.34Wh）；100W 有线 + 40W 无线；OTG 反向充电 支持
前置：3200 万 f/2.2
后置三摄：5000 万 超感光 1/1.3" 大底主摄 f/1.68 + 5000 万 索尼超级潜望长焦 f/2.65 + 5000 万 超广角 f/2.05
变焦：最大 100x 数字变焦；视频：后置最高 8K，前置最高 4K
系统：基于 Android 17 的 OriginOS 7
指纹：超声波 3D 指纹；接口：USB-C 3.2 Gen1；NFC 支持；红外遥控 支持
```

建议工程师按此补全（本批不改 `src/data/`）。

---

## 7. 未查到清单（本批）

| 机型 | 状态 | 说明 |
|---|---|---|
| **iQOO Neo12** | ❌ 官网无参数页 | 只有预约活动页 `wukongapi.vivo.com.cn/wukongtopic/activity/link/neo12`；`/vivo/iqooneo12` 与 `/vivo/param/iqooneo12` 均跳回首页。尚未发布 |
| iPhone 17e 三围 | ⚠️ 官网未列 | Apple 官网「尺寸与重量」只给了 170g |
| iPhone 17e 电池 mAh / 有线瓦数 | ⚠️ Apple 不公布 | 见 §5 表格 |
| vivo X300 E 防水等级 | ⚠️ 官网未列 | 参数页与营销页均无 IP 等级，未推断 |
| iQOO Z11 / Z11S / Z11i / 15T / Neo11 至尊版 无线充电 | ⚠️ 官网未列 | 参数页「充电规格」只有有线，故 `bwl: null` |
| OPPO Find X9s Pro 官网现价 | ⚠️ 参数页不含价格 | `cp` 暂用发布价 5299，需从 OPPO 商城复核 |
| 8 款「推测存在」机型 | ⛔ 按要求未查 | xiaomi-18 / redmi-k90-pro / honor-magic8-ultra / pura-90-ultra / nubia-z80-ultra / meizu-23 / Z Fold7 / Z Flip7 |

---

## 8. P2：第三批已核实、可直接灌入的清单

### 8.1 电池 `bc`（6 条）

| id | `bc` | 来源 |
|---|---|---|
| `xiaomi-17-pro` | 6300 | 小米官网 |
| `oppo-find-x9-ultra` | 7050 | OPPO 官网 |
| `vivo-x300s` | 7100 | vivo 官网 |
| `vivo-x300-ultra` | 6600 | vivo 官网 |
| `honor-magic8-pro-air` | 5500 | 荣耀官网 |
| `huawei-mate-80-pro-max` | 6000（额定 5870） | 华为官网 |

（另有 §6.2 的 Mate 80 / Mate 80 Pro / Pura 90 Pro Max 共 4 条，见 `param-audit-2026-10-14.md`）

### 8.2 变倍 `cz`（4 条）

| id | `cz` | 来源 |
|---|---|---|
| `oppo-find-x9-ultra` | `10 倍光学变焦 / 120 倍数码变焦` | OPPO 官网 |
| `xiaomi-17-ultra` | `3.2–4.3 倍光学变焦 / 120 倍数码变焦` | 小米官网 |
| `huawei-pura-90-pro-max` | `4 倍光学变焦 / 100 倍数字变焦` | 华为官网 |
| `huawei-mate-80-pro-max` | `4 倍 + 6.2 倍光学变焦 / 12.4 倍光学品质变焦 / 100 倍数字变焦` | 华为官网 |

### 8.3 本批新增变倍（可直接灌）

| id | `cz`（官网原文） |
|---|---|
| `iqoo-15-ultra` | `3 倍光学变焦 / 6 倍无损级变焦 / 至高 100 倍数码变焦` |
| `iqoo-15t` | `4 倍无损变焦 / 40 倍数码变焦` |
| `huawei-mate-xts` | `5.5 倍光学变焦 / 50 倍数字变焦` |
| `huawei-mate-xt-2` | `3.5 倍光学变焦 / 7 倍光学品质变焦 / 100 倍数字变焦` |
| `oppo-find-x9s-pro` | `2.8 倍光学变焦 / 120 倍数码变焦` |
| `iphone-17e` | `2 倍光学品质长焦 / 最高 10 倍数码变焦` |

> vivo 系（X Fold6 / X300 E / Z11 系列 / Neo11 至尊版）官网**只给「最大 N 倍数字变焦」，不给光学倍数** —— 按「官网没直说就不写」的口径，光学倍数留空，不反推。

---

## 9. P1：反向充电收尾（本批推进）

| 品牌 | 本批结论 | 待办 |
|---|---|---|
| **vivo / iQOO** | ✅ 官网规格参数页明确「OTG反向充电：支持」→ 写 `'支持 OTG 反向充电'` | 库内 vivo/iQOO 现有条目按此回填（**推翻第三批的 null 结论**） |
| **OPPO** | ✅ Find X9 / X9 Pro / X9 Ultra / X9s Pro 官网全无「反向充电」→ `null` | OPPO 老机型（Find X8 及更早、Reno/K 系列）需逐页核 |
| **华为** | ✅ 按机型分档：Mate XTs 5W 有线 + 7.5W 无线；Mate XT 2 无线反向（无瓦数）；Mate 80 标准版 5W / Pro 及以上 18W | 已核实完毕 |
| **Apple** | ✅ 官网不公布 → `null` | 库里 iPhone 17 现有 `"7.5W反向"` 应为想当然值，建议一并清理 |
| **小米 / Redmi 老机型** | ⏳ 未核 | 约 22 条，需逐机型查 `mi.com/prod/<型号>/specs` |
| **三星** | ⏳ 未核 | 需查三星中国官网 |
| **一加 / realme / 努比亚 / 魅族 / 摩托罗拉** | ⏳ 未核 | 一加官网 `oneplus.com/cn/.../specs` 曾 404，需要换路径 |
