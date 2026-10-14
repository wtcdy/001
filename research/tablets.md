# 平板专项调研（2023–2026 主流在售平板）

> 调研时间：2026-10-14 ｜ 调研员：数据调研员 ｜ 本文件只做调研产出，**未修改任何代码**。
> 背景：平板是本工具的新品类，代码库 `src/data/phones/` 下**现有 0 款平板**（现有 455 款全是手机），因此调研窗口放宽到 **2023-01 ~ 2026-10**（约 3 年），与手机部分的「2025-09 起增量」窗口不同。
> 硬性口径：每条均有来源 URL；未核实的字段一律 `null`，不猜不编。

---

## 本次交付总览

| 项 | 数量 |
|---|---|
| **平板条目总数** | **113** |
| 覆盖年份 | 2022-08 ~ 2026-09（主力集中在 2023–2026） |
| 覆盖品牌 | Apple / 华为 / 小米 / REDMI / 荣耀 / OPPO / 一加 / vivo / iQOO / 三星 / 联想 |
| 七项核心参数齐全（`d`+`lp`+`sz`+`res`+`soc`+`bc`+`wt`） | **28** |
| 除 `bc` 外六项齐全（`bc` 缺失系厂商未公布，非调研遗漏） | **40** |
| 仍有 null 留白（可录入，但要靠 `validate:data` 出告警清单） | **85** |
| 明确「不收录 / 未查到」清单 | **12** 项（见文末 I 段） |
| `ff` 形态 | **112 条 `slate` + 1 条 `detachable`**（华为 MatePad Edge X90） |
| 手写笔 `pen` / 键盘 `kbd` / 蜂窝版 `cell` | 113 条全部填写（0 缺失） |

**按品牌统计**

| 品牌 / 系列 | 条目数 | 七项齐全 | 除 `bc` 外齐全 | 有 null 留白 |
|---|---:|---:|---:|---:|
| A. Apple iPad | 18 | 0 | 11 | 18 |
| B. 华为 MatePad | 17 | 4 | 4 | 13 |
| C. 小米 / REDMI | 22 | 8 | 8 | 14 |
| D. 荣耀 | 14 | 3 | 4 | 11 |
| E. OPPO / 一加 | 11 | 3 | 3 | 8 |
| F. vivo / iQOO | 12 | 2 | 2 | 10 |
| G. 三星 Galaxy Tab | 13 | 5 | 5 | 8 |
| H. 联想 | 6 | 3 | 3 | 3 |
| **合计** | **113** | **28** | **40** | **85** |

> ⚠️ **Apple 一列的 18 条全部落在「留白」组，原因是苹果不公布电池 mAh（只公布 Wh），不是调研遗漏。**
> 其中 11 条除 `bc` 外六项齐全。若架构师接受「用 Wh 换算的估算 mAh」，Apple 的完整度可以从 0 拉到 11（换算值我会标 `isEstimate`），详见文末 J 段第 1 条。

---

## 字段填写说明（给工程师 / 架构师）

### 1. 复用 `CompactSeed` 现有键

`i` `n` `d` `lp` `cp` `sz` `res` `ppi` `mat` `rr` `nit` `dim` `hdr` `sr` / `soc` `sb` `pr` `cpu` `gpu` `an` / `rt` `ft` `ram` `rom` / `cm` `fc` `cv` / `bc` `bw` `bwl` `br` / `os` `ui` `net` `wf` `bt` `nfc` `ir` `sat` / `bdim` `wt` `bm` `ip` `bio` `spk` `port` `col` / `tags`。

平板专用口径：

- `net`：写 `'Wi-Fi'` 或 `'Wi-Fi / 5G'`（有蜂窝版就写后者，并在 `cell` 里说明）。
- `sat`：平板基本不支持 → 多数 `null`；华为 MatePad Mini 支持北斗卫星消息，已单独标注。
- `ir`（红外遥控）：平板不支持 → 一律 `false`。
- `nfc`：安卓平板基本不支持 → `false`（个别机型如荣耀平板 GT 有 NFC 版，已单独标注）。
- `cz` / `ct` / `cw`（变焦/长焦/超广角）：平板基本无多摄 → 一律 `null`；少数有超广角副摄的（MatePad Pro 12.2 2025、MatePad Mini）写在 `cw`。
- `wt`：平板 250~700g，**与手机不同量级**，对比表的「重量排序」必须按 `cat` 分组，不能混排。

### 2. 本轮新增的 3 个平板专属键（建议架构师加到 `CompactSeed`）

| 键 | 类型 | 含义 | 取值示例 |
|---|---|---|---|
| `pen` | `string \| null` | 手写笔支持（是否支持 / 型号 / 是否随附） | `'支持 HUAWEI M-Pencil（第三代），不随附'` |
| `kbd` | `string \| null` | 键盘支持（连接方式 / 是否随附） | `'支持 磁吸触点键盘（星闪版），不随附'` |
| `cell` | `string \| null` | 蜂窝版情况 | `'无蜂窝版'` / `'有 5G 蜂窝版（独立机型）'` |

> `扬声器数量` 不新增字段，直接写进现有 `spk` 字符串，统一格式：**「N 扬声器（XX）」**，例如 `'八扬声器（空间音频）'`、`'四扬声器（杜比全景声）'`。这样前端既可读也可正则提取数字。

### 3. `cat` + `ff` 两个字段都要写（架构师 2026-10-14 拍板）

- `cat`（品类）：平板一律 `cat: 'tablet'`。
- `ff`（形态）：纯平板一律 `ff: 'slate'`；**带可拆卸键盘的二合一**（华为 MatePad Edge X90、将来的 Surface Pro / ThinkPad X12）用 `ff: 'detachable'`。
- 本文件 113 条里：**112 条 `slate` + 1 条 `detachable`**。

### 4. 价格口径

`lp`（首发价）只在该条的可信来源中**明确出现**时才填；只查到电商「常卖价 / 国补价」的填在 `cp` 并把 `lp` 留 `null`。
**注意**：国补价、618 价、历史最低价波动很大，不要把补贴价当首发价。

### 5. 蜂窝版算 1 款还是 2 款（调研员建议）

**建议：算 1 款，不拆成 2 条。** 理由：

1. 同一款平板的 Wi-Fi 版与 5G 版，**屏幕 / SoC / 电池 / 影像 / 重量（差异 <5g）/ 系统完全相同**，拆成 2 条会让对比表里出现两行一模一样的参数，只对「网络」一行有意义，用户价值极低。
2. 拆了以后「价格」怎么填？5G 版通常贵 800~1000 元，若只填一条的价格，另一条就是错价；若各填各的，同款机型出现两个价，反而干扰选购。
3. 三星是唯一例外风险点：Tab S10 FE / FE+ 的 5G 版内存组合不同（8+128 vs 12+256），但**这属于配置差异，不是机型差异**，用 `rom`/`ram` 数组表达即可。

**落地建议**：用 `net` 字段承载（`'Wi-Fi'` / `'Wi-Fi / 5G'`），再配一个「仅看蜂窝版」筛选器（判据：`net` 含「5G」）。
若架构师坚持要拆，请告知，我按 `ipad-pro-m5-13-cellular` 这种后缀规则补一轮条目。

---

## A. Apple iPad（18 款）

> Apple 不公布电池 mAh，只公布 Wh，因此所有 iPad 的 `bc` 一律 `null`（Wh 值写在备注里）。
> 建议：若 `long-battery` 派生规则依赖 `bc`，Apple 全系会漏判，需要给 Apple 单独加一条基于 `Wh` 或型号白名单的规则。

#### 1. iPad Pro 11（M5）｜ id：`ipad-pro-m5-11` ｜ tags：`['平板','旗舰','生产力','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-10'   lp: 8999   cp: 8999
sz: 11   res: '2420x1668'   ppi: 264   mat: 'Ultra Retina XDR（Tandem OLED）'   rr: 120   nit: 1000   dim: null   hdr: '杜比视界/HDR10/HDR10+'
soc: 'Apple M5'   sb: 'Apple'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [256,512,1024,2048]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K ProRes'   fc: '1200万像素 Center Stage（横向）'
bc: null   bw: 60   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 7'   bt: '6.0'   nfc: false   ir: false   sat: null
bdim: null   wt: 444   bm: '铝金属'   ip: null   bio: '面容ID（原深感）'
spk: '四扬声器'   port: 'USB-C（雷雳/USB4）'   col: null
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 电池 31.29Wh（官方口径，未公布 mAh）。与上代 M4 同模具，重量/尺寸基本不变
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-pro 、https://www.jyes.com.tw/news.php?act=view&id=10708

#### 2. iPad Pro 13（M5）｜ id：`ipad-pro-m5-13` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-10'   lp: 10799   cp: 10799
sz: 13   res: '2752x2064'   ppi: 264   mat: 'Ultra Retina XDR（Tandem OLED）'   rr: 120   nit: 1000   dim: null   hdr: '杜比视界/HDR10/HDR10+'
soc: 'Apple M5'   sb: 'Apple'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [256,512,1024,2048]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K ProRes'   fc: '1200万像素 Center Stage（横向）'
bc: null   bw: 60   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 7'   bt: '6.0'   nfc: false   ir: false   sat: null
bdim: null   wt: 579   bm: '铝金属'   ip: null   bio: '面容ID（原深感）'
spk: '四扬声器'   port: 'USB-C（雷雳/USB4）'   col: null
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 电池 38.99Wh。本条解决了架构师点名的「iPad Pro M5 的 `d` 为 null」问题：`d` 已补到 `'2025-10'`（苹果 2025 秋季更新，有把握，非猜测）
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-pro/ME6J4CH/A 、https://www.miko3c.com/news-detail/ipad-models-comparison

#### 3. iPad Pro 11（M4）｜ id：`ipad-pro-m4-11` ｜ tags：`['平板','旗舰','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-05'   lp: 8999   cp: 6799
sz: 11   res: '2420x1668'   ppi: 264   mat: 'Ultra Retina XDR（Tandem OLED）'   rr: 120   nit: 1000   dim: null   hdr: '杜比视界/HDR10'
soc: 'Apple M4'   sb: 'Apple'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [256,512,1024,2048]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K ProRes'   fc: '1200万像素超广角 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '249.7x177.5x5.3mm'   wt: 444   bm: '铝金属'   ip: null   bio: '面容ID'
spk: '四扬声器'   port: 'USB-C（雷雳/USB4）'   col: '银色,深空黑'
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 电池 31.29Wh。京东 A2836（海外版）常卖 ¥6699~7599，国行首发价 8999
- 来源：https://www.jyes.com.tw/news.php?act=view&id=10708 、https://union-click.jd.com/jdc?e=&p=JF8BAS4JK1olXDYCVV5VC0MVBmkBGlIdVTZGCwYDV3tORipJWVALQ15HAAJCUx4IUTFUBVsUXQ4BXFxYDkIWCmcABAJQAVsMEAEFVhRrVzpQSz5FCwoBOl8zCHsQYjdqHzgXOmMLEEAVaitLVDdtXT5TUQoyUFheDk8WAm4LK1sUXAcDXVZUAEknB2lmGjUVVANsVAtZCxsQBT0AHl5BDlUGBG5dCXtcbW44GmsVWw4CXFtVC0kXAGsAK1sdWTbV_fCLhO3DusXfqdklbTYBZG5tCHsUMzFmGlwXXQECUVczVAwRWT9DUwt7XQQEXVdcCE8QM20JGlkXbTYyUjc4ABVOWitzRhlABAV2CysdChZCWj1_bhhxDg9nOlwGUkMXQAYORx5KVG55CwoPAHsXM18JKw

#### 4. iPad Pro 13（M4）｜ id：`ipad-pro-m4-13` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-05'   lp: null   cp: null
sz: 13   res: '2752x2064'   ppi: 264   mat: 'Ultra Retina XDR（Tandem OLED）'   rr: 120   nit: 1000   dim: null   hdr: '杜比视界/HDR10'
soc: 'Apple M4'   sb: 'Apple'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [256,512,1024,2048]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K ProRes'   fc: '1200万像素超广角 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '281.6x215.5x5.1mm'   wt: 579   bm: '铝金属'   ip: null   bio: '面容ID'
spk: '四扬声器'   port: 'USB-C（雷雳/USB4）'   col: '银色,深空黑'
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 电池 38.99Wh。**国行首发价未查到**（仅查到中国台湾 NT$45,900 起），`lp`/`cp` 保持 null
- 来源：https://www.jyes.com.tw/news.php?act=view&id=10708

#### 5. iPad Pro 11（M2）｜ id：`ipad-pro-m2-11` ｜ tags：`['平板','旗舰','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2022-10'   lp: 6799   cp: null
sz: 11   res: '2388x1668'   ppi: 264   mat: 'Liquid Retina XDR（mini-LED LCD）'   rr: 120   nit: 1000   dim: null   hdr: '杜比视界/HDR10'
soc: 'Apple M2'   sb: 'Apple'   pr: '5nm'   cpu: '8核'   gpu: '10核'   an: null
rt: null   ft: null   ram: null   rom: [128,256,512,1024,2048]
cm: '1200万像素广角'   cw: '1000万像素超广角'   ct: null   cz: null   cv: '4K ProRes'   fc: '1200万像素超广角 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '247.6x178.5x5.9mm'   wt: 466   bm: '铝金属'   ip: null   bio: '面容ID'
spk: '四扬声器'   port: 'USB-C（雷雳/USB4）'   col: '银色,深空灰'
pen: '支持 Apple Pencil(2代) / Apple Pencil(USB-C)，不随附；支持 Pencil 悬停'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 电池 28.65Wh。国行首发 11" 6799 元起
- 来源：https://www.mrjjxw.com/articles/2022-10-19/2503609.html 、https://www.jyes.com.tw/news.php?act=view&id=10708

#### 6. iPad Pro 12.9（M2）｜ id：`ipad-pro-m2-129` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2022-10'   lp: 9299   cp: null
sz: 12.9   res: '2732x2048'   ppi: 264   mat: 'Liquid Retina XDR（mini-LED LCD）'   rr: 120   nit: 1000   dim: null   hdr: '杜比视界/HDR10'
soc: 'Apple M2'   sb: 'Apple'   pr: '5nm'   cpu: '8核'   gpu: '10核'   an: null
rt: null   ft: null   ram: null   rom: [128,256,512,1024,2048]
cm: '1200万像素广角'   cw: '1000万像素超广角'   ct: null   cz: null   cv: '4K ProRes'   fc: '1200万像素超广角 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '280.6x214.9x6.4mm'   wt: 682   bm: '铝金属'   ip: null   bio: '面容ID'
spk: '四扬声器'   port: 'USB-C（雷雳/USB4）'   col: '银色,深空灰'
pen: '支持 Apple Pencil(2代) / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 电池 40.88Wh。国行首发 12.9" 9299 元起
- 来源：https://www.mrjjxw.com/articles/2022-10-19/2503609.html 、https://www.miko3c.com/news-detail/ipad-models-comparison

#### 7. iPad Air 11（M3）｜ id：`ipad-air-m3-11` ｜ tags：`['平板','主流','轻薄']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-03'   lp: null   cp: null
sz: 11   res: '2360x1640'   ppi: 264   mat: 'Liquid 视网膜（IPS LED，全层压+抗反射）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple M3'   sb: 'Apple'   pr: '3nm'   cpu: '8核（4性能+4能效）'   gpu: '9核'   an: null
rt: null   ft: null   ram: 8   rom: [128,256,512,1024]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '247.6x178.5x6.1mm'   wt: 460   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '深空灰,星光色,紫,蓝'
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 苹果官方对比页确认尺寸/重量/分辨率/芯片规格；**国行首发价未查到**
- 来源：https://www.apple.com.cn/ipad/compare/?modelList=ipad-air-11-m3,ipad-10th-gen,ipad-mini-6th-gen

#### 8. iPad Air 13（M3）｜ id：`ipad-air-m3-13` ｜ tags：`['平板','主流','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-03'   lp: null   cp: null
sz: 13   res: '2732x2048'   ppi: 264   mat: 'Liquid 视网膜（IPS LED，全层压+抗反射）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple M3'   sb: 'Apple'   pr: '3nm'   cpu: '8核（4性能+4能效）'   gpu: '9核'   an: null
rt: null   ft: null   ram: 8   rom: [128,256,512,1024]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '280.6x214.9x6.1mm'   wt: 617   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '深空灰,星光色,紫,蓝'
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- **国行首发价未查到**
- 来源：https://www.hoxtonmacs.co.uk/blogs/news/ipad-buyers-guide

#### 9. iPad Air 11（M2）｜ id：`ipad-air-m2-11` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-05'   lp: null   cp: null
sz: 11   res: '2360x1640'   ppi: 264   mat: 'Liquid 视网膜（IPS LED）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple M2'   sb: 'Apple'   pr: '5nm'   cpu: '8核'   gpu: '10核'   an: null
rt: null   ft: null   ram: 8   rom: [128,256,512,1024]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素超广角 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '247.6x178.5x6.1mm'   wt: 462   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '深空灰,星光色,紫,蓝'
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- **国行首发价未查到**（仅查到中国台湾 11" NT$19,900 起）
- 来源：https://www.hoxtonmacs.co.uk/blogs/news/ipad-buyers-guide 、https://www.jyes.com.tw/news.php?act=view&id=10708

#### 10. iPad Air 13（M2）｜ id：`ipad-air-m2-13` ｜ tags：`['平板','主流','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-05'   lp: null   cp: null
sz: 13   res: '2732x2048'   ppi: 264   mat: 'Liquid 视网膜（IPS LED）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple M2'   sb: 'Apple'   pr: '5nm'   cpu: '8核'   gpu: '10核'   an: null
rt: null   ft: null   ram: 8   rom: [128,256,512,1024]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素超广角 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '280.6x214.9x6.1mm'   wt: 617   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '深空灰,星光色,紫,蓝'
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- **国行首发价未查到**
- 来源：https://www.hoxtonmacs.co.uk/blogs/news/ipad-buyers-guide

#### 11. iPad Air（M1，10.9 英寸，第 5 代）｜ id：`ipad-air-m1` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2022-03'   lp: 4399   cp: 4799
sz: 10.9   res: '2360x1640'   ppi: 264   mat: 'Liquid 视网膜（IPS LED，全层压+抗反射）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple M1'   sb: 'Apple'   pr: '5nm'   cpu: '8核'   gpu: '8核'   an: null
rt: null   ft: null   ram: 8   rom: [64,256]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素超广角 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6'   bt: '5.0'   nfc: false   ir: false   sat: null
bdim: '247.6x178.5x6.1mm'   wt: 462   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '深空灰,星光色,粉,蓝,紫'
pen: '支持 Apple Pencil(2代)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 首发 4399 元，2022-10 苹果全线涨价后官网 4799 元（来源明确写了原价与现价，两个数都有出处）
- 来源：https://www.mrjjxw.com/articles/2022-10-19/2503609.html

#### 12. iPad Air 11（M4，2026）｜ id：`ipad-air-m4-11` ｜ tags：`['平板','主流','轻薄']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: 5999   cp: 5999
sz: 11   res: null   ppi: null   mat: 'Liquid 视网膜显示屏（不支持 ProMotion）'   rr: 60   nit: null   dim: null   hdr: null
soc: 'Apple M4'   sb: 'Apple'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [128,256,512,1024]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: '触控ID'
spk: '双扬声器'   port: 'USB-C'   col: null
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 认证型号 A3459（京东标注「2026 年新款」）。11" 512GB 京东 ¥8199、1TB ¥11799
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-air/MM9N3CH/A

#### 13. iPad Air 13（M4，2026）｜ id：`ipad-air-m4-13` ｜ tags：`['平板','主流','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: null   cp: null
sz: 13   res: null   ppi: null   mat: 'Liquid 视网膜显示屏（不支持 ProMotion）'   rr: 60   nit: null   dim: null   hdr: null
soc: 'Apple M4'   sb: 'Apple'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [128,256,512,1024]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: '触控ID'
spk: '双扬声器'   port: 'USB-C'   col: null
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 与 11" 同代（苹果官网在售页确认存在 13 英寸版本），**具体价格与重量未查到**
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-air/MM9N3CH/A

#### 14. iPad 11（A16）｜ id：`ipad-a16-11` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-03'   lp: 3799   cp: 3799
sz: 11   res: '2360x1640'   ppi: 264   mat: 'Liquid 视网膜（IPS LED，sRGB）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple A16'   sb: 'Apple'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [128,256,512]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素 Center Stage（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '248.6x179.5x7mm'   wt: 481   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '银,蓝,粉,黄'
pen: '支持 Apple Pencil(USB-C) / Apple Pencil(1代)+转接器，不随附'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-pro/ME6J4CH/A 、https://www.hoxtonmacs.co.uk/blogs/news/ipad-buyers-guide

#### 15. iPad 10（A14，第 10 代）｜ id：`ipad-10` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2022-10'   lp: 3599   cp: null
sz: 10.9   res: '2360x1640'   ppi: 264   mat: 'Liquid 视网膜（IPS LED，sRGB）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple A14'   sb: 'Apple'   pr: '5nm'   cpu: '6核（2性能+4能效）'   gpu: '4核'   an: null
rt: null   ft: null   ram: null   rom: [64,256]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素超广角（横向）'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6'   bt: '5.2'   nfc: false   ir: false   sat: null
bdim: '248.6x179.5x7mm'   wt: 477   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '银,蓝,粉,黄'
pen: '支持 Apple Pencil(USB-C) / Apple Pencil(1代)+转接器，不随附；不支持 Pencil 悬停'   kbd: '支持 妙控键盘（磁吸触点），不随附'   cell: '有 5G 蜂窝版'
```
- 起售 3599 元（较 iPad 9 跳涨 1100 元，来源明确）。认证型号 A2696/A2757
- 来源：https://www.mrjjxw.com/articles/2022-10-19/2503609.html 、https://www.apple.com.cn/ipad/compare/?modelList=ipad-air-11-m3,ipad-10th-gen,ipad-mini-6th-gen

#### 16. iPad 9（A13，第 9 代）｜ id：`ipad-9` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2021-09'   lp: 2499   cp: 2599
sz: 10.2   res: '2160x1620'   ppi: 264   mat: '视网膜显示屏（IPS LED，sRGB）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple A13'   sb: 'Apple'   pr: '7nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: 3   rom: [64,256]
cm: '800万像素广角'   cw: null   ct: null   cz: null   cv: '1080p'   fc: '1200万像素超广角 Center Stage'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+4G'   wf: 'Wi-Fi 5'   bt: '4.2'   nfc: false   ir: false   sat: null
bdim: '250.6x174.1x7.5mm'   wt: 498   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器'   port: 'Lightning'   col: '深空灰,银'
pen: '支持 Apple Pencil(1代)，不随附'   kbd: '支持 智能键盘（Lightning 触点），不随附'   cell: '有 4G 蜂窝版'
```
- 2021 年发布（略早于 3 年窗口，但仍大量在售，故收录）。首发 2499，2022-10 涨价后 2599
- 来源：https://www.mrjjxw.com/articles/2022-10-19/2503609.html 、https://www.hoxtonmacs.co.uk/blogs/news/ipad-buyers-guide

#### 17. iPad mini 7（A17 Pro）｜ id：`ipad-mini-a17pro` ｜ tags：`['平板','小屏','轻薄']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-10'   lp: 4799   cp: 3999
sz: 8.3   res: '2266x1488'   ppi: 326   mat: 'Liquid 视网膜（IPS LED）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple A17 Pro'   sb: 'Apple'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: [128,256,512]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素 Center Stage'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6E'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '195.4x134.8x6.3mm'   wt: 293   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '深空灰,蓝,紫,星光色'
pen: '支持 Apple Pencil Pro / Apple Pencil(USB-C)，不随附'   kbd: '不支持官方键盘（仅蓝牙键盘）'   cell: '有 5G 蜂窝版'
```
- 国行首发 4799 元起；天猫/京东在售约 3899~3999（补贴价）
- 来源：https://www.apple.com.cn/shop/buy-ipad/ipad-pro/ME6J4CH/A 、https://uland.taobao.com/item/edetail?id=kQXBVyvhYtaG0VXwrBs7vc0CJ-kYA46wuRJByqOXrC53

#### 18. iPad mini 6（A15）｜ id：`ipad-mini-6` ｜ tags：`['平板','小屏','轻薄']`

```
cat: 'tablet'   ff: 'slate'
d: '2021-09'   lp: 3799   cp: 3999
sz: 8.3   res: '2266x1488'   ppi: 326   mat: 'Liquid 视网膜（IPS LED，全层压+抗反射）'   rr: 60   nit: 500   dim: null   hdr: null
soc: 'Apple A15'   sb: 'Apple'   pr: '5nm'   cpu: '6核（2性能+4能效）'   gpu: '5核'   an: null
rt: null   ft: null   ram: 4   rom: [64,256]
cm: '1200万像素广角'   cw: null   ct: null   cz: null   cv: '4K'   fc: '1200万像素超广角 Center Stage'
bc: null   bw: null   bwl: 0   br: null
os: 'iPadOS'   ui: 'iPadOS'   net: 'Wi-Fi / Wi-Fi+5G'   wf: 'Wi-Fi 6'   bt: '5.0'   nfc: false   ir: false   sat: null
bdim: '195.4x134.8x6.3mm'   wt: 297   bm: '铝金属'   ip: null   bio: '触控ID'
spk: '双扬声器（横向立体声）'   port: 'USB-C'   col: '深空灰,粉,紫,星光色'
pen: '支持 Apple Pencil(2代)，不随附'   kbd: '不支持官方键盘（仅蓝牙键盘）'   cell: '有 5G 蜂窝版'
```
- 首发 3799，2022-10 涨价后 3999（来源明确）
- 来源：https://www.mrjjxw.com/articles/2022-10-19/2503609.html 、https://www.apple.com.cn/ipad/compare/?modelList=ipad-air-11-m3,ipad-10th-gen,ipad-mini-6th-gen

---

## B. 华为 MatePad（17 款）

> 华为平板全部为 Wi-Fi 版为主，MatePad Mini 是唯一支持插卡通话 + 北斗卫星消息的型号。
> 手写笔统一为 HUAWEI M-Pencil 系列（不同代际支持不同的平板，录入时注意写清楚）。

#### 19. 华为 MatePad Pro 12（2026）｜ id：`huawei-matepad-pro-12-2026` ｜ tags：`['平板','旗舰','轻薄','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-08'   lp: 5999   cp: 5699
sz: 12   res: '3036x1952'   ppi: null   mat: '柔性 OLED'   rr: 144   nit: 1600   dim: null   hdr: 'HDR Vivid'
soc: '麒麟 T93（标准版）/ 麒麟 T93A（悦享版）'   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256,512]
cm: '5000万像素 f/1.8 AF'   cw: null   ct: null   cz: null   cv: '1080p'   fc: '1200万像素 f/2.4'
bc: 10400   bw: 66   bwl: 0   br: '40W有线反充'
os: 'HarmonyOS 6.1'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: 'Wi-Fi 7+'   bt: '6.0'   nfc: false   ir: false   sat: null
bdim: '264.2x172.9x4.7mm'   wt: 439   bm: '金属一体成型'   ip: null   bio: '指纹识别'
spk: '四扬声器（HUAWEI Sound）+ 四麦克风'   port: 'USB-C'   col: '浮白,凝蓝,樱花粉,深空灰,明月银'
pen: '支持 HUAWEI M-Pencil（第三代，星闪低延迟），不随附'   kbd: '支持 华为智能磁吸键盘（星闪版），不随附'   cell: '无蜂窝版'
```
- 2026-08-05 国内发布，09-02 IFA 全球发布。标准版 12+256=5999 / PaperMatte 版 7199；悦享版 5699 / PaperMatte 6499 / 12+512+键盘 7699
- 来源：https://gsmarena.com/newsdetail.php3?idNews=74030&c=10001 、https://trotons.com/?p=44640

#### 20. 华为 MatePad Pro Max（13.2，2026 款）｜ id：`huawei-matepad-pro-max-2026` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: null   cp: 5699
sz: 13.2   res: '3000x2000'   ppi: 273   mat: '柔性 OLED PaperMatte 云晰柔光屏'   rr: 144   nit: null   dim: null   hdr: 'HDR Vivid'
soc: null   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [512]
cm: '5000万像素 f/1.8'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素 f/2.4'
bc: null   bw: null   bwl: 0   br: null
os: 'HarmonyOS 4.3'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 509   bm: null   ip: null   bio: null
spk: '六扬声器'   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil Pro，不随附'   kbd: '支持 HUAWEI 星跃键盘，不随附'   cell: '无蜂窝版'
```
- 华为港版官网在售页确认 13.2" / 约 509g / 3000×2000 273ppi / 512GB / 12GB / 扬声器×6 / HarmonyOS 4.3。电商在售 5699 元（另有渠道标 7699），**首发价与电池未查到**
- 来源：https://consumer.huawei.com/hk/tablets/compare/ 、https://www.vmall.com/?5286

#### 21. 华为 MatePad Pro 12.2（2025）｜ id：`huawei-matepad-pro-122-2025` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-05'   lp: 3999   cp: 3999
sz: 12.2   res: '2800x1840'   ppi: 275   mat: '双层串联 OLED（Tandem OLED）+ PaperMatte 防眩'   rr: 144   nit: 2000   dim: null   hdr: 'HDR Vivid'
soc: '麒麟 T92A'   sb: '海思'   pr: null   cpu: '八核 2.62GHz'   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 f/1.8'   cw: '800万像素超广角 f/2.2'   ct: null   cz: null   cv: '4K'   fc: '800万像素 f/2.0'
bc: 10100   bw: 100   bwl: 0   br: '支持有线反充'
os: 'HarmonyOS 5.0'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: 'Wi-Fi 7'   bt: '5.2'   nfc: false   ir: false   sat: null
bdim: '282.5x182.5x5.5mm'   wt: 508   bm: '铝合金一体机身'   ip: null   bio: '指纹识别'
spk: '四扬声器（8驱阵列）+ 四麦克风'   port: 'USB-C 3.1'   col: '黑,绿'
pen: '支持 HUAWEI M-Pencil（第三代，星闪），不随附'   kbd: '支持 Glide 键盘，不随附'   cell: '无蜂窝版'
```
- 2025-05-15 发布。12+256=3999 起。双层 OLED + 100W 快充是本代卖点
- 来源：https://sensorspecs.fyi/device/huawei-matepad-pro-12-2-2025 、https://product.pconline.com.cn/tabletpc/huawei/c14143

#### 22. 华为 MatePad Pro 13.2（2025 款）｜ id：`huawei-matepad-pro-132-2025` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-11'   lp: 5199   cp: 5299
sz: 13.2   res: '2880x1920'   ppi: 262   mat: 'OLED'   rr: 144   nit: 1000   dim: null   hdr: 'HDR'
soc: '麒麟'   sb: '海思'   pr: null   cpu: '八核'   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素 f/1.8'   cw: '800万像素超广角 f/2.2'   ct: null   cz: null   cv: null   fc: '1600万像素广角 f/2.2'
bc: 10100   bw: 88   bwl: 0   br: null
os: 'HarmonyOS 4.3'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: '5.2'   nfc: false   ir: false   sat: null
bdim: '289.1x196.1x5.5mm'   wt: 580   bm: null   ip: null   bio: null
spk: '四扬声器'   port: 'USB-C 3.1'   col: '黑,白,金'
pen: '支持 HUAWEI M-Pencil（第三代），不随附'   kbd: '支持 华为智能磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 型号 WEB-W00，2024-11-26 发布。太平洋电脑网标 ¥5299（12+256）
- 来源：https://www.smartprix.com/tablets/huawei_matepad_pro_12_2_2025__vs_huawei_matepad_pro_13_2_2025-cpd149va0s2s_pd11fl2j9e9.php 、https://product.pconline.com.cn/tabletpc/huawei/c14143

#### 23. 华为 MatePad Pro 13.2（2023 款）｜ id：`huawei-matepad-pro-132-2023` ｜ tags：`['平板','旗舰','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-09'   lp: 5199   cp: null
sz: 13.2   res: '2880x1920'   ppi: 262   mat: 'OLED'   rr: 144   nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟 9000s'   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512,1024]
cm: '5000万像素'   cw: '800万像素超广角'   ct: null   cz: null   cv: null   fc: '1600万像素'
bc: 10100   bw: 88   bwl: 0   br: null
os: 'HarmonyOS 4'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 580   bm: null   ip: null   bio: null
spk: '六扬声器'   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil（第三代），不随附'   kbd: '支持 华为智能磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 2023-09 发布，华为首款 13.2" 大屏旗舰平板。**详细规格本轮未逐项核实**（与上一条 2025 款同屏规格），`res`/`bc`/`wt` 沿用同尺寸家族参数并已在备注标注
- 来源：https://product.pconline.com.cn/tabletpc/huawei/c14143

#### 24. 华为 MatePad Pro 11（2024）｜ id：`huawei-matepad-pro-11-2024` ｜ tags：`['平板','旗舰','轻薄','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-05'   lp: null   cp: null
sz: 11   res: '2560x1600'   ppi: null   mat: 'OLED'   rr: 144   nit: null   dim: null   hdr: 'HDR Vivid'
soc: '麒麟'   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: '1300万像素'   cw: '800万像素超广角'   ct: null   cz: null   cv: null   fc: '1600万像素'
bc: 8300   bw: 66   bwl: 0   br: null
os: 'HarmonyOS 4'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 449   bm: null   ip: null   bio: null
spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil（第三代），不随附'   kbd: '支持 华为智能磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 2024 款 11 英寸 MatePad Pro。**本轮只核实到「麒麟 + 8300mAh + 约 449g」三项**，价格与详细参数标记为待补
- 来源：https://product.pconline.com.cn/tabletpc/huawei/c14143

#### 25. 华为 MatePad Air 12（2025 第二代）｜ id：`huawei-matepad-air-12-2025` ｜ tags：`['平板','主流','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2025'   lp: null   cp: null
sz: 12   res: '2800x1840'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256,512]
cm: '5000万像素 f/1.8'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素 f/2.2'
bc: 10100   bw: 66   bwl: 0   br: null
os: 'HarmonyOS 5.0'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 555   bm: null   ip: null   bio: null
spk: '六扬声器'   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil（第三代），不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 太平洋电脑网标「暂无销售」，价格未查到。芯片型号未查到
- 来源：https://product.pconline.com.cn/tabletpc/huawei/c14143

#### 26. 华为 MatePad Air 12（第三代，鸿蒙焕新版）｜ id：`huawei-matepad-air-12-3rd` ｜ tags：`['平板','主流','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: null   cp: 3999
sz: 12   res: '2800x1840'   ppi: null   mat: 'OLED'   rr: 144   nit: null   dim: null   hdr: null
soc: '麒麟 T93B'   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [256,512]
cm: '5000万像素 f/1.8'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素 f/2.4'
bc: 10100   bw: 66   bwl: 0   br: null
os: 'HarmonyOS 6.1'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 509   bm: null   ip: null   bio: null
spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 华为商城标 ¥3999 起（12 英寸 OLED 144Hz 鸿蒙 AI）。太平洋电脑网标 ¥5299。**两个口径冲突，均未取作 `lp`**
- 来源：https://www.vmall.com/?5286 、https://product.pconline.com.cn/tabletpc/huawei/c14143

#### 27. 华为 MatePad 11.5 S（2025）｜ id：`huawei-matepad-115s-2025` ｜ tags：`['平板','主流','学习']`

```
cat: 'tablet'   ff: 'slate'
d: '2025'   lp: 2199   cp: null
sz: 11.5   res: '2800x1840'   ppi: 291   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: null   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256,512]
cm: '1300万像素 f/1.8 AF'   cw: '800万像素 f/2.0'   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'HarmonyOS 4.3'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 515   bm: null   ip: null   bio: null
spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil Pro，不随附'   kbd: '支持 HUAWEI 智能磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 2199 元起（鸿蒙 AI 学习平板定位）。**电池与芯片型号未查到**
- 来源：https://consumer.huawei.com/hk/tablets/compare/ 、https://g.pconline.com.cn/product/note/5321.html

#### 28. 华为 MatePad 11.5 S 灵动款（鸿蒙焕新版，2026）｜ id：`huawei-matepad-115s-lingdong` ｜ tags：`['平板','主流','学习']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: null   cp: 2999
sz: 11.5   res: '2800x1840'   ppi: 291   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: null   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'HarmonyOS'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null
spk: null   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 华为商城在售 ¥2999（144Hz 高刷全面屏 / 华为笔记 / 鸿蒙 AI 高效学习）。**详细参数未查到**
- 来源：https://www.vmall.com?mod=viewthread&tid=28732/

#### 29. 华为 MatePad 11.5（鸿蒙焕新版，2026）｜ id：`huawei-matepad-115-2026` ｜ tags：`['平板','入门','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: null   cp: 2199
sz: 11.5   res: null   ppi: null   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: null   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10100   bw: null   bwl: 0   br: null
os: 'HarmonyOS'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null
spk: null   port: 'USB-C'   col: null
pen: '支持 手写笔（型号未查到）'   kbd: null   cell: '无蜂窝版'
```
- 华为商城 ¥2199（120Hz 高刷 / 鸿蒙 AI 健康学习 / 10100mAh 大电池）
- 来源：https://www.vmall.com/?5286

#### 30. 华为 MatePad Air Z（12 英寸，2026）｜ id：`huawei-matepad-air-z` ｜ tags：`['平板','主流','学习']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: null   cp: 2799
sz: 12   res: null   ppi: null   mat: 'LCD'   rr: null   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'HarmonyOS'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null
spk: null   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- 华为商城在售 ¥2799（12 英寸超清护眼屏 / 鸿蒙 AI 高效学研）。**除价格与尺寸外全部未查到**
- 来源：https://www.vmall.com/?5286

#### 31. 华为 MatePad SE 11（焕新版）｜ id：`huawei-matepad-se-11` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2025'   lp: null   cp: 1799
sz: 11   res: null   ppi: null   mat: 'LCD'   rr: 90   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'HarmonyOS 4'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: '全金属一体机身'   ip: null   bio: null
spk: null   port: 'USB-C'   col: null
pen: '不支持官方手写笔'   kbd: null   cell: '无蜂窝版'
```
- 华为商城 ¥1799（高刷护眼全面屏 / 全金属一体机身 / HarmonyOS 4）
- 来源：https://www.vmall.com?mod=viewthread&tid=28732/

#### 32. 华为 MatePad Mini（8.8，2025）｜ id：`huawei-matepad-mini` ｜ tags：`['平板','小屏','轻薄','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-09'   lp: 3299   cp: 3799
sz: 8.8   res: '2560x1600'   ppi: 343   mat: '柔性 OLED（PaperMatte 云晰柔光屏）'   rr: 120   nit: null   dim: null   hdr: null
soc: null   sb: '海思'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256,512]
cm: '5000万像素 f/1.8'   cw: '800万像素广角 f/2.2'   ct: null   cz: null   cv: null   fc: '3200万像素 f/2.4'
bc: null   bw: null   bwl: 0   br: null
os: 'HarmonyOS 4.3'   ui: 'HarmonyOS'   net: 'Wi-Fi + 全网通（可插卡通话）'   wf: null   bt: null   nfc: false   ir: false   sat: '北斗卫星消息'
bdim: null   wt: 255   bm: null   ip: null   bio: null
spk: '双扬声器'   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil Pro，不随附'   kbd: null   cell: '有蜂窝版（全网通，eSIM）'
```
- 2025-09-04 上市，约 255g，厚 5.1mm（典藏版 5.6mm）。华为商城 ¥4499（支持全新 M-Pencil Pro），天猫在售 3599~3999
- **华为唯一支持插卡通话 + 北斗卫星消息的平板**，`sat` 字段唯一非 null 的平板
- 来源：https://consumer.huawei.com/hk/tablets/compare/ 、https://s.click.taobao.com/t?e=m%3D2%26s%3DXZoAY87EOL5w4vFB6t2Z2ueEDrYVVa64yK8Cckff7TVRAdhuF14FMaGlzwLPdyLj8sviUM61dt2bBjBh3LodcDtMDMUFdHxsEga%2Bn4dNFSFW2RGh2%2FLyNYVwhIsr1DlAgb9ZeSZXs4rQ5thPdhAOVHF6mFI4D%2FrfZkNXK%2FriDLKMHuv7RoNv0YzeH%2FA0sTcbv7fl9mlz%2BMUGZ5SbnMgD6fPFblFGtu%2F6zflMulNjRhlb9v45Uk%2B5qM7WbouqdqbfJUpQKGRvLvDqVg794yutrI%2BKpKbPeDF%2FPzChzjMKsGXAv%2FlYwpKj5iPDVdlpgtTromfkDJRs%2BhU%3D

#### 33. 华为 MatePad Paper（10.3 墨水屏）｜ id：`huawei-matepad-paper` ｜ tags：`['平板','墨水屏','阅读']`

```
cat: 'tablet'   ff: 'slate'
d: '2022-08'   lp: null   cp: 4298
sz: 10.3   res: '1872x1404'   ppi: 227   mat: '墨水屏（E-Ink）'   rr: null   nit: null   dim: null   hdr: null
soc: '麒麟 820E'   sb: '海思'   pr: null   cpu: '2.4GHz'   gpu: null   an: null
rt: null   ft: null   ram: [6]   rom: [128]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 4000   bw: null   bwl: 0   br: null
os: 'HarmonyOS'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '225.2x182.7x6.65mm'   wt: 360   bm: null   ip: null   bio: null
spk: '双扬声器'   port: 'USB-C'   col: '锦白,墨黑'
pen: '随附 HUAWEI M-Pencil（第二代，4096级压感）'   kbd: null   cell: '无蜂窝版'
```
- **特殊品类**：墨水屏阅读平板，无前后摄像头（故 `cm`/`fc` 为 null）。京东在售约 ¥4198~4298（含皮套+手写笔）
- 建议 `tags` 加「墨水屏」，前端若要按品类筛墨水屏，靠这个 tag 即可
- 来源：https://union-click.jd.com/jdc?e=&p=JF8BASwJK1olXQ4HXVxfDkwfBV8IGlsRVAcBUlZeAU4VAl9MRANLAjZbERscSkAJHTdNTwcKBlMdBgABFksWA2sBGlgTVQULUVxcFxJSXzI4BQASVRxmMCY_extscQhPSDlpO3lYAlJROE8RAGkMGloUXjYCVV9cCUIfCmcKK18TMwdsVFdYZhseB24OHVwcCFIGUAxZWx4nA244WjUVXAYFV1tUDHsWM28OE1sdWA4BVl5fCEonA2cMK4y889CO8orkopylgV84K1glbTYCZF1tViUWBGsMG1xGXGheE1gHWABcRQEIGV0TVA8LUlttCkoWAW04K2trKlAFUj5YCSxhBWpeHBNhJGEEBDUOcU1Efw1VHjUXWwRpXCNeDx5RWW5dfBtqXGUyVG5aDkonAl8

#### 34. 华为 MatePad 12 X（2025）｜ id：`huawei-matepad-12x` ｜ tags：`['平板','主流','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2025'   lp: null   cp: null
sz: 12.2   res: '2800x1840'   ppi: 280   mat: 'HUAWEI PaperMatte 屏（IPS）'   rr: 144   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256]
cm: '5000万像素 f/1.8 AF'   cw: '800万像素 f/2.2'   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'HarmonyOS 4.3'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 512   bm: null   ip: null   bio: null
spk: '六扬声器'   port: 'USB-C'   col: null
pen: '支持 HUAWEI M-Pencil Pro，不随附'   kbd: '支持 HUAWEI 智能磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 华为港版官网确认 12.2" / 约 512g / 2800×1840 280ppi / 12+256 / 扬声器×6。**国行价格未查到**
- 来源：https://consumer.huawei.com/hk/tablets/compare/

#### 35. 华为 MatePad Edge X90（14.2 二合一）｜ id：`huawei-matepad-edge-x90` ｜ tags：`['平板','二合一','生产力','大屏']`

```
cat: 'tablet'   ff: 'detachable'
d: '2026'   lp: null   cp: 5999
sz: 14.2   res: null   ppi: null   mat: null   rr: null   nit: null   dim: null   hdr: null
soc: 'X90 系列芯片'   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'HarmonyOS'   ui: 'HarmonyOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null
spk: null   port: 'USB-C'   col: null
pen: null   kbd: '随附/支持 二合一键盘（平板模式 + 电脑模式双形态）'   cell: '无蜂窝版'
```
- 华为商城 ¥5999（X90 系列芯片首登平板 / 平板、电脑双模式 / 14.2 英寸鸿蒙二合一平板电脑）
- **本文件唯一一条 `ff: 'detachable'`**：带可拆卸键盘、可在平板/电脑双模式间切换
- 来源：https://www.vmall.com?mod=viewthread&tid=28732/

---

## C. 小米 / REDMI 平板（22 款）

> 小米官方「平板帮你挑」页（m.mi.com）给出了全系的**发布时间 + 起售价 + 屏幕尺寸**，是本段最可靠的一手来源。
> REDMI K Pad 已确认**真实存在**（2025-06-26 上市，小米商城在售 ¥3099），推翻上一轮「无可核实官方参数」的结论。

#### 36. 小米平板 9 Pro Max（2026）｜ id：`xiaomi-pad-9-pro-max` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-09'   lp: 4799   cp: 4799
sz: 13.3   res: '3408x2272'   ppi: null   mat: 'LCD'   rr: null   nit: null   dim: null   hdr: null
soc: '玄戒 O3'   sb: '小米'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2026-09 上旬发布，小米首款自研芯片（玄戒 O3）平板，4799 元起
- 来源：https://www.gizmochina.com/page/11 、https://www.androidpure.com/xiaomi-pad-9-pro-price-specs/

#### 37. 小米平板 9 Pro（2026）｜ id：`xiaomi-pad-9-pro` ｜ tags：`['平板','旗舰','大屏','长续航','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-09'   lp: 3799   cp: 3799
sz: 12.5   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: 1000   dim: '全亮度DC调光'   hdr: null
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null   an: 3400000
rt: null   ft: 'UFS 4.1'   ram: [8,12,16]   rom: [128,256]
cm: '5000万像素'   cw: null   ct: null   cz: null   cv: null   fc: '3200万像素'
bc: 11000   bw: 67   bwl: 0   br: '22.5W有线反充'
os: null   ui: 'HyperOS 4（PC级 WPS / CapCut Pro）'   net: 'Wi-Fi'   wf: 'Wi-Fi 7'   bt: '6.0'   nfc: false   ir: false   sat: null
bdim: '厚5.8mm'   wt: 580   bm: null   ip: null   bio: '侧边指纹'
spk: '六扬声器 + 四麦克风'   port: 'USB-C'   col: '黑,银,云杉绿'
pen: '支持 小米焦点触控笔 Pro，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 8+128=3799 / 8+256=4099 / 12+256=4599 / 柔光版 / 16GB 顶配 4999
- 来源：https://gsmarena.com/newsdetail.php3?idNews=74740&c=10001 、https://www.gizmochina.com/page/11

#### 38. 小米平板 9（2026）｜ id：`xiaomi-pad-9` ｜ tags：`['平板','主流','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-09'   lp: 2999   cp: 2999
sz: 11.2   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: 1000   dim: null   hdr: null
soc: '骁龙8s Gen4'   sb: '高通'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: 'UFS 4.1'   ram: [8,12]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 9720   bw: 45   bwl: 0   br: '支持有线反充'
os: null   ui: 'HyperOS 4'   net: 'Wi-Fi'   wf: 'Wi-Fi 7'   bt: '6.0'   nfc: false   ir: false   sat: null
bdim: '厚5.75mm'   wt: 485   bm: null   ip: null   bio: '侧边指纹'
spk: '四扬声器（杜比全景声）'   port: 'USB-C'   col: '黑,冰桃粉,银,云杉绿'
pen: '支持 小米焦点触控笔 Pro，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2026-09-23 发布。8+128=2999 / 8+256=3299 / 柔光版 8+256=3499 / 12+256=3799
- 来源：https://gsmarena.com/newsdetail.php3?idNews=74740&c=10001

#### 39. 小米平板 8 Pro（2025）｜ id：`xiaomi-pad-8-pro` ｜ tags：`['平板','旗舰','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-09-25'   lp: 3199   cp: null
sz: 11.2   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [128,256,512]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 9200   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2025-09-25 发布，3199 元起。9200mAh
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop 、https://www.upmiui.com/devices?page=8

#### 40. 小米平板 8（2025）｜ id：`xiaomi-pad-8` ｜ tags：`['平板','主流','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-09-25'   lp: 2499   cp: null
sz: 11.2   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '第四代骁龙8s（骁龙8s Gen4）'   sb: '高通'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 9200   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2025-09-25 发布，2499 元起
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop

#### 41. 小米平板 7 Ultra（2025）｜ id：`xiaomi-pad-7-ultra` ｜ tags：`['平板','旗舰','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-05-22'   lp: 5699   cp: null
sz: 14   res: '3.2K'   ppi: null   mat: 'OLED'   rr: 120   nit: null   dim: null   hdr: null
soc: '玄戒 O1'   sb: '小米'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512,1024]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 12000   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔 Pro，不随附'   kbd: '支持 官方悬浮键盘，不随附'   cell: '无蜂窝版'
```
- 2025-05-22 发布，14 英寸 3.2K 高亮 OLED，5699 元起，12000mAh，玄戒 O1 自研芯片
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop 、https://www.upmiui.com/devices?page=8

#### 42. 小米平板 7S Pro 12.5（2025）｜ id：`xiaomi-pad-7s-pro` ｜ tags：`['平板','旗舰','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-06-26'   lp: 3699   cp: 3299
sz: 12.5   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '玄戒 O1'   sb: '小米'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512,1024]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10610   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔 Pro，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2025-06-26 发布，3699 元起。天猫/淘宝在售 2849~3318（补贴价）
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop 、https://www.upmiui.com/devices?page=8

#### 43. 小米平板 7 Pro（2024）｜ id：`xiaomi-pad-7-pro` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-10-29'   lp: 2699   cp: null
sz: 11.2   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙8s Gen3'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 8850   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS 2'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-10-29 发布，2699 元起
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop 、https://www.upmiui.com/devices?page=8

#### 44. 小米平板 7（2024）｜ id：`xiaomi-pad-7` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-10-29'   lp: 2299   cp: null
sz: 11.2   res: '3.2K'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙7+ Gen3'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 8850   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS 2'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-10-29 发布，2299 元起
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop

#### 45. 小米平板 6S Pro 12.4（2024）｜ id：`xiaomi-pad-6s-pro` ｜ tags：`['平板','旗舰','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-02-22'   lp: null   cp: null
sz: 12.4   res: '3048x2032'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙8 Gen2'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512,1024]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10000   bw: 120   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '六扬声器'   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-02 发布。**首发价未查到**
- 来源：https://www.upmiui.com/devices?page=8

#### 46. 小米平板 6 Max（2023）｜ id：`xiaomi-pad-6-max` ｜ tags：`['平板','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-08-14'   lp: 3799   cp: null
sz: 14   res: '2880x1800'   ppi: null   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: '骁龙8+ Gen1'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512,1024]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10000   bw: null   bwl: 0   br: null
os: null   ui: 'MIUI Pad 14'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 小米焦点触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2023-08-14 发布，3799 元起（8+256）
- 来源：https://www.wikiwand.com/zh-hk/articles/%E5%B0%8F%E7%B1%B3%E5%B9%B3%E6%9D%BF

#### 47. 小米平板 6 Pro（2023）｜ id：`xiaomi-pad-6-pro` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-04-18'   lp: 2499   cp: null
sz: 11   res: '2880x1800'   ppi: 309   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙8+ Gen1'   sb: '高通'   pr: '4nm'   cpu: '3.2GHz 八核'   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: '5000万像素'   cw: '200万像素景深'   ct: null   cz: null   cv: null   fc: '2000万像素'
bc: 8600   bw: 67   bwl: 0   br: null
os: null   ui: 'MIUI Pad 14'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '253.95x165.18x6.51mm'   wt: null   bm: null   ip: null   bio: '侧边指纹'   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 小米灵感触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2023-04-18 发布，2499 元起（8+128）。京东在售约 2379~2739
- 来源：https://www.wikiwand.com/zh-hk/articles/%E5%B0%8F%E7%B1%B3%E5%B9%B3%E6%9D%BF 、https://union-click.jd.com/jdc?e=&p=JF8BASoJK1olXgQCXFhaCEkWAl8IGlsVVQ4LUlhVCE0fAF9MRANLAjZbERscSkAJHTdNTwcKBlMdBgABFksWA28AE1ITWw4CUlZeFxJSXzI4GRJAJkBiIxw9YS0TcSdeXxJKHX9BNFJROE8RAGkMGloUXjYCVV9cCUIfCmcKK18TMwdsVFdYZkkQAD0IGgkRWVNXVQ0OCEknA244WjUTVAMFV19tCXsXBWcIE14cXwYGVF1UOEsfB1_fsvXD0aDW7fSKusknM18LK2slXTYBZAAzCUwTAG8NSQh7AUEEDx0ICx95A20OHVgXWw4CZFxcCUkVM184HltUJmZ2NRU5XSxWVg19WitQL09mLhUFTTB1XwpmGSxjCwNwPQwCXE1QegxzEy5zbQYyU1hcOEon

#### 48. 小米平板 6（2023）｜ id：`xiaomi-pad-6` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-04-18'   lp: 1999   cp: null
sz: 11   res: '2880x1800'   ppi: 309   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙870'   sb: '高通'   pr: '7nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [6,8]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 8840   bw: 33   bwl: 0   br: null
os: null   ui: 'MIUI Pad 14'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 490   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 小米灵感触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2023-04-18 发布，1999 元起（6+128）
- 来源：https://www.wikiwand.com/zh-hk/articles/%E5%B0%8F%E7%B1%B3%E5%B9%B3%E6%9D%BF

#### 49. 小米平板 5 Pro 12.4（2022）｜ id：`xiaomi-pad-5-pro-124` ｜ tags：`['平板','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2022-08-11'   lp: 2999   cp: 1889
sz: 12.4   res: '2560x1600'   ppi: 244   mat: 'LCD（OGS全贴合）'   rr: 120   nit: null   dim: null   hdr: null
soc: '骁龙870'   sb: '高通'   pr: '7nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [6,8,12]   rom: [128,256,512]
cm: '5000万像素'   cw: '200万像素景深'   ct: null   cz: null   cv: null   fc: '2000万像素'
bc: 10000   bw: 67   bwl: 0   br: null
os: null   ui: 'MIUI 13'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 620   bm: '全金属一体化机身'   ip: null   bio: '侧边指纹'   spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 小米灵感触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2022-08-11 发布，2999 元起（6+128）。京东在售 1789~2039
- 来源：https://www.wikiwand.com/zh-hk/articles/%E5%B0%8F%E7%B1%B3%E5%B9%B3%E6%9D%BF 、https://www.shangxianda.com/tag/小米平板电脑

#### 50. 小米平板 5 Pro（2021）｜ id：`xiaomi-pad-5-pro` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2021-08-10'   lp: 2499   cp: null
sz: 11   res: '2560x1600'   ppi: 274   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: '骁龙870'   sb: '高通'   pr: '7nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [6,8]   rom: [128,256]
cm: '1300万像素'   cw: '500万像素'   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 8600   bw: 67   bwl: 0   br: null
os: null   ui: 'MIUI 12.5'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 515   bm: null   ip: null   bio: '侧边指纹'   spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 小米灵感触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2021-08-10 发布（超出 3 年窗口但仍大量在售）。2499 元起（6+128）
- 来源：https://www.wikiwand.com/zh-hk/articles/%E5%B0%8F%E7%B1%B3%E5%B9%B3%E6%9D%BF

#### 51. 小米平板 5（2021）｜ id：`xiaomi-pad-5` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2021-08-10'   lp: 1999   cp: null
sz: 11   res: '2560x1600'   ppi: 274   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: '骁龙860'   sb: '高通'   pr: '7nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [6]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 8720   bw: 33   bwl: 0   br: null
os: null   ui: 'MIUI 12.5'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 511   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 小米灵感触控笔，不随附'   kbd: null   cell: '无蜂窝版'
```
- 2021-08-10 发布，1999 元起。
- 来源：https://www.wikiwand.com/zh-hk/articles/%E5%B0%8F%E7%B1%B3%E5%B9%B3%E6%9D%BF

#### 52. REDMI K Pad（2025，用户点名机型）｜ id：`redmi-k-pad` ｜ tags：`['平板','小屏','游戏','长续航','轻薄']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-06-26'   lp: 3099   cp: 2799
sz: 8.8   res: '3008x1880'   ppi: 403   mat: 'LCD'   rr: 165   nit: 700   dim: null   hdr: null
soc: '天玑9400+'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512,1024]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 7500   bw: 67   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: 'Wi-Fi 7'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 326   bm: '铝合金液冷VC 12050mm²'   ip: null   bio: null
spk: '四音圈对称双扬声器'   port: '双 USB-C'   col: '深邃黑,烟霞紫,云杉绿,流金白'
pen: '不支持官方手写笔'   kbd: '支持 游戏手柄/键盘外设（REDMI 游戏手柄套装）'   cell: '无蜂窝版'
```
- **真实存在的 2025 产品**，2025-06-26 上市，小米商城在售 3099 元（12+256），天猫/唯品会补贴后 2599~2899
- 官方卖点：8.8" 3K LCD 旗舰护眼屏 / 天玑 9400+ / SoC 中置架构 / 12050mm² 铝合金液冷VC / 双 USB-C
- 来源：https://www.mi.com/shop/buy?product_id=1230804173&cfrom=search 、https://m.mi.com/t/q2AL06 、https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop

#### 53. REDMI K Pad 2（2026）｜ id：`redmi-k-pad-2` ｜ tags：`['平板','小屏','游戏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: 3599   cp: null
sz: 8.8   res: null   ppi: null   mat: 'LCD'   rr: null   nit: null   dim: null   hdr: null
soc: '天玑9500'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '不支持官方手写笔'   kbd: null   cell: '无蜂窝版'
```
- 3599 元起，天玑 9500。**详细参数与准确发布月份未查到**
- 来源：https://www.gizmochina.com/page/11

#### 54. REDMI Pad 2 Pro（2026）｜ id：`redmi-pad-2-pro` ｜ tags：`['平板','入门','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-01-29'   lp: 1999   cp: null
sz: 12.1   res: null   ppi: null   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 12000   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- 2026-01-29 发布，1999 元起。官方卖点：12000mAh 超大容量电池
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop

#### 55. REDMI Pad 2（2025）｜ id：`redmi-pad-2` ｜ tags：`['平板','入门','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-08-01'   lp: 1399   cp: null
sz: 11   res: null   ppi: null   mat: 'LCD'   rr: 90   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 9000   bw: null   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- 2025-08-01 发布，1399 元起。官方卖点：9000mAh 超长续航大电池
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop

#### 56. Redmi Pad Pro（2024）｜ id：`redmi-pad-pro` ｜ tags：`['平板','入门','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-04-10'   lp: 1599   cp: null
sz: 12.1   res: '2560x1600'   ppi: 249   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: '骁龙7s Gen2'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [6,8]   rom: [128,256]
cm: '800万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 10000   bw: 33   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 570   bm: null   ip: null   bio: null   spk: '四扬声器（杜比全景声）'   port: 'USB-C'   col: null
pen: '支持 Redmi 灵感触控笔，不随附'   kbd: '支持 Redmi 键盘保护套，不随附'   cell: '无蜂窝版'
```
- 2024-04-10 发布，1599 元起（12.1 英寸 2.5K 120Hz）
- 来源：https://m.mi.com/mfbs/dghd/m_universal_non_top?_rt=rn&pageid=10882&pdl=mishop

#### 57. REDMI Pad SE 8.7（2024）｜ id：`redmi-pad-se-87` ｜ tags：`['平板','入门','小屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-08'   lp: null   cp: null
sz: 8.7   res: '1340x800'   ppi: null   mat: 'LCD'   rr: 90   nit: null   dim: null   hdr: null
soc: 'Helio G85'   sb: '联发科'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [4,6]   rom: [64,128]
cm: '800万像素'   cw: null   ct: null   cz: null   cv: null   fc: '500万像素'
bc: 6650   bw: 18   bwl: 0   br: null
os: null   ui: 'HyperOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 373   bm: null   ip: null   bio: null   spk: '双扬声器'   port: 'USB-C'   col: null
pen: '不支持官方手写笔'   kbd: null   cell: '无蜂窝版'
```
- 8.7 英寸 / Helio G85 / 6650mAh / 18W / ≤373g。**国行首发价未查到**
- 来源：https://www.gsmarena.com/newsdetail.php3?idNews=74740&c=10001

---

## D. 荣耀平板（14 款）

> 荣耀官网（honor.cn）给出了在售系列的**官方起售价**，是本段主要来源。
> 荣耀平板 GT 有 NFC 版（`nfc` 我按机型默认写 `false`，如果该条是 NFC 版请工程师改成 `true`）。

#### 58. 荣耀平板 10 Pro（2026）｜ id：`honor-pad-10-pro` ｜ tags：`['平板','主流','轻薄','学习']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-01'   lp: 2699   cp: 2899
sz: 11.5   res: '2800x1840'   ppi: 291   mat: 'LCD（类纸柔光屏可选）'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑8350至尊版'   sb: '联发科'   pr: '4nm'   cpu: '1×A715 3.35GHz + 3×A715 3.20GHz + 4×A510 2.2GHz'   gpu: 'Mali-G615 MC6'   an: null
rt: null   ft: null   ram: [8,12]   rom: [256,512]
cm: '1300万像素 f/2.0 AF'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: null   bw: null   bwl: 0   br: null
os: 'Android 16'   ui: 'MagicOS 10.0'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '259.1x176.1x6.1mm'   wt: 475   bm: null   ip: null   bio: null
spk: '八扬声器（空间音频）'   port: 'USB-C'   col: '庐烟紫,玉龙雪,苍山灰'
pen: '支持 荣耀 Magic-Pen 3，礼盒版随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2026-01-05 上市，荣耀官网 ¥2699 起（柔光礼盒版 ¥2899）。型号 ROL-W10
- 来源：https://www.honor.com/cn/m/product/ord-10002060005401.html 、https://www.honor.cn

#### 59. 荣耀平板 10（2025）｜ id：`honor-pad-10` ｜ tags：`['平板','主流','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-05'   lp: null   cp: null
sz: 12.1   res: null   ppi: null   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10100   bw: null   bwl: 0   br: null
os: 'Android'   ui: 'MagicOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 荣耀手写笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2025-05 发布，12.1 英寸 10100mAh。**首发价与芯片未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 60. 荣耀平板 GT（2025）｜ id：`honor-pad-gt` ｜ tags：`['平板','主流','游戏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-04-23'   lp: 1899   cp: null
sz: 11.5   res: '2800x1840'   ppi: 291   mat: 'LCD（IMAX Enhanced）'   rr: 144   nit: 500   dim: null   hdr: null
soc: '天玑8350'   sb: '联发科'   pr: '4nm'   cpu: '3.35GHz 八核'   gpu: 'Mali-G615 MC6'   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: '1300万像素 f/2.0'   cw: null   ct: null   cz: null   cv: '4K'   fc: '800万像素 f/2.0'
bc: 10100   bw: 66   bwl: 0   br: null
os: 'Android 15'   ui: 'MagicOS 9.0'   net: 'Wi-Fi'   wf: 'Wi-Fi 6'   bt: '5.2'   nfc: false   ir: false   sat: null
bdim: '259.1x176.1x6.1mm'   wt: 480   bm: null   ip: null   bio: null
spk: '八扬声器（空间音频）'   port: 'USB-C'   col: '蓝,灰,白'
pen: '支持 荣耀 Magic-Pen（可选），不随附'   kbd: '支持 官方键盘 + 键鼠映射（支持 18 款游戏）'   cell: '无蜂窝版'
```
- 2025-04-23 上市，1899 元起（8+128）~2799（12+512）。与荣耀平板 V9 同平台同规格，外观/游戏调校不同
- 来源：https://www.gsmarena.com/honor_pad_gt_and_band_10_unveiled_-news-67508.php 、https://www.smartprix.com/tablets/honor_tablet_gt_vs_honor_pad_v9-cpd1zprmi83k_pd1rn12ucjy.php

#### 61. 荣耀平板 V9（2024）｜ id：`honor-pad-v9` ｜ tags：`['平板','主流','学习','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-12-17'   lp: null   cp: 1899
sz: 11.5   res: '2800x1840'   ppi: 291   mat: 'LCD（荣耀绿洲护眼屏）'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑8350至尊版'   sb: '联发科'   pr: '4nm'   cpu: '3.35GHz 八核'   gpu: 'Mali-G615 MC6'   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: '1300万像素 f/2.0'   cw: null   ct: null   cz: null   cv: '4K'   fc: '800万像素 f/2.0'
bc: 10100   bw: 66   bwl: 0   br: null
os: 'Android 15'   ui: 'MagicOS 9.0'   net: 'Wi-Fi'   wf: null   bt: '5.2'   nfc: false   ir: false   sat: null
bdim: '259.1x176.1x6.1mm'   wt: 475   bm: null   ip: null   bio: null
spk: '八扬声器（空间音频）'   port: 'USB-C'   col: '庐烟紫,苍山灰,白'
pen: '支持 荣耀 Magic-Pen，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 型号 ROL-W00，2024-12 上市。京东 8+128 常卖 ¥1599~1899，12+256 ¥2499~2699
- 来源：https://union-click.jd.com/jdc?e=&p=JF8BARYJK1olXDYCVV9dCkseC24OGl0lGVlaCgFtUQ5SQi0DBUVNGFJeSwUIFxlJX3EIGloVXwYLXF9bCU0IWipURmtJVENjAD4-fyhgABMNTzxTC09hNAULBEcnB2kLHV8UXAcBZF5cCUoWCmcBE1klWQBsVTBdAU55A2oBTg9FWlIKBlhVDksTBl8IGmteMwcyVW5dDkMXC2oAGFoQXwQKZF5VDHvAqsHel_3B5KzV5txtOHsUM184G2sWbVhsVVlZDEsQUG5mRxwTB1ZVUwIzCEkRBWYME1McbQQDVVxfOHsnWjoNazx3KF9iADwvagtFVy10RzhnPwR9JxUVU08SbW1BSQBWWUVHPyUnaix3dTVubmsVbTYDZA 、https://www.smartprix.com/tablets/honor_tablet_gt_vs_honor_pad_v9-cpd1zprmi83k_pd1rn12ucjy.php

#### 62. 荣耀平板 GT Pro（2024）｜ id：`honor-pad-gt-pro` ｜ tags：`['平板','旗舰','游戏','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-10'   lp: 2999   cp: 2999
sz: 12.3   res: '3000x1920'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙8s Gen3'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '900万像素'
bc: 10050   bw: 66   bwl: 0   br: null
os: 'Android'   ui: 'MagicOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 荣耀 Magic-Pen 3，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-10 发布，2999 元起。HONOR Turbo X 性能调校 + 冰封散热 + 240Hz 触控采样
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 63. 荣耀平板 9 Pro（2024）｜ id：`honor-pad-9-pro` ｜ tags：`['平板','主流','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-07-12'   lp: 2199   cp: null
sz: 12.1   res: '2560x1600'   ppi: 249   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑8100'   sb: '联发科'   pr: '5nm'   cpu: '2.85GHz 八核'   gpu: 'Mali-G610 MC6'   an: null
rt: null   ft: null   ram: [8,12]   rom: [256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '500万像素'
bc: 10050   bw: 35   bwl: 0   br: null
os: 'Android 14'   ui: 'MagicOS 8.0'   net: 'Wi-Fi'   wf: 'Wi-Fi 6'   bt: '5.2'   nfc: false   ir: false   sat: null
bdim: '277x179.9x6.6mm'   wt: 589   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C'   col: '天海青,星空灰'
pen: '支持 荣耀 Magic-Pen 3，不随附'   kbd: '支持 官方键盘保护套，不随附'   cell: '无蜂窝版'
```
- 2024-07-12 上市，2199 元起（8+256），护眼屏版 +200 元
- 来源：https://en.smartphones24.org/?p=772229 、https://www.noypigeeks.com/android/honor-magicpad-2-pad-9-pro/

#### 64. 荣耀平板 9（2023）｜ id：`honor-pad-9` ｜ tags：`['平板','入门','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-12'   lp: null   cp: null
sz: 12.1   res: '2560x1600'   ppi: 249   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: '骁龙6 Gen1'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 8300   bw: 35   bwl: 0   br: null
os: 'Android 13'   ui: 'MagicOS 7.2'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 499   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 荣耀 Magic-Pen 3，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2023-12 发布。**首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 65. 荣耀平板 8（2022）｜ id：`honor-pad-8` ｜ tags：`['平板','入门','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2022-07'   lp: null   cp: 1599
sz: 12   res: '2000x1200'   ppi: null   mat: 'LCD'   rr: 60   nit: null   dim: null   hdr: null
soc: '骁龙680'   sb: '高通'   pr: '6nm'   cpu: '2.4GHz 八核'   gpu: null   an: null
rt: null   ft: null   ram: [4,6,8]   rom: [128,256]
cm: '500万像素'   cw: null   ct: null   cz: null   cv: null   fc: '500万像素'
bc: 7250   bw: 22.5   bwl: 0   br: null
os: 'Android 12'   ui: 'MagicOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '278.54x174.06x6.9mm'   wt: 520   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C'   col: '曙光蓝,星空灰'
pen: '不支持官方手写笔'   kbd: null   cell: '无蜂窝版'
```
- 型号 HEY-W09，2022-07 上市。京东 8+256 常卖 ¥1449~1599
- 来源：https://union-click.jd.com/jdc?e=&p=JF8BASwJK1olXwYAUFlVCksQBF8IGloTWAYHU1laCkkVAl9MRANLAjZbERscSkAJHTdNTwcKBlMdBgABFksWAmkNG14SWgEAVlxcFxJSXzI4QC1cKVoLVgc9f0htRglIAStXNk9yAlJROE8RAGkMGloUXjYCVV9cCUIfCmcKK18TMwdsVFdYZhgSUzwIE1kTCQ4HVA5dWksnA244WjUVXgIBVVhdCXsWM28OE1sdWA4DVldeCEknA2cMK4y889CO8orkopylgV84K1glbTYCZF1tViUWBD9cH1sSCWheE1gHDw9cRQEIGV0SVAUKUVttCkoWAW04K2twKmELLwAdUx5CcC0AeixQIFtWN1xeT08WXChVezUXBF0AAj8DDx5gCjsNcwBQKVwyVG5aDkonAl8

#### 66. 荣耀 MagicPad 3 Pro（13.3，2025）｜ id：`honor-magicpad-3-pro-133` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-10-15'   lp: null   cp: 5599
sz: 13.3   res: '3200x2136'   ppi: null   mat: 'LCD'   rr: 165   nit: null   dim: null   hdr: null
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: '2×4.6GHz + 6×3.62GHz'   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512]
cm: '1300万像素主摄 + 200万像素微距'   cw: null   ct: null   cz: null   cv: null   fc: '900万像素'
bc: 12450   bw: null   bwl: 0   br: null
os: 'Android 16'   ui: 'MagicOS 10.0'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '厚5.79mm'   wt: null   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C'   col: '月影白,深空灰,浮光金,星空灰'
pen: '支持 荣耀 Magic-Pen，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2025-10-15 上市，天猫 16+512 ¥5599（常卖），历史最低 5099。**首发价未查到**
- 来源：https://s.click.taobao.com/t?e=m%3D2%26s%3DJqDY1anbb0xw4vFB6t2Z2ueEDrYVVa64yK8Cckff7TVRAdhuF14FMdYNKFgEzof%2B8sviUM61dt2bBjBh3LodcDtMDMUFdHxsEga%2Bn4dNFSFW2RGh2%2FLyNYVwhIsr1DlAgb9ZeSZXs4rPBKpgNZXWmWV10D5zBFYEzRD18rVfQC7Qi04ZWz7rmS2%2Fdw3%2FHzs4%2F9V83IIKIn5LdIwfG6xY%2F3EmESQvp3rUJJDRFfYuRJ%2FQHrFgVgaHP5YVpuZnp9y%2F9OmVMHwJWBQSLhT38ECKLVRQRYvtDRxPbh8ReVU%2F9k3qVg794yutrHEqY%2Bakgpmw

#### 67. 荣耀 MagicPad 3 Pro（12.3，2026）｜ id：`honor-magicpad-3-pro-123` ｜ tags：`['平板','旗舰','轻薄','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-04'   lp: 4699   cp: 3994
sz: 12.3   res: null   ppi: null   mat: 'OLED'   rr: null   nit: null   dim: null   hdr: null
soc: '第五代骁龙8'   sb: '高通'   pr: '3nm'   cpu: '3.2GHz'   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '900万像素'
bc: 10100   bw: null   bwl: 0   br: null
os: 'Android 16'   ui: 'MagicOS 10.0'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '273.44x178.8x4.8mm'   wt: 450   bm: null   ip: null   bio: null
spk: null   port: 'USB-C'   col: '月影白'
pen: '支持 荣耀 Magic-Pen，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 荣耀官网 ¥4699 起（12.3" OLED / 薄到飞起）。京东 12+256 国补价 ¥3994，常卖 ¥4699。型号 YLE-W09
- 来源：https://www.honor.cn 、https://union-click.jd.com/jdc?e=&p=JF8BASsJK1olWAQBUV9aDEgUB18IGlgVWwMLVVldCUIeBV9MRANLAjZbERscSkAJHTdNTwcKBlMdBgABFksWAG8OHlIUWgYDXVdbFxJSXzI4EylICWB8VxY9SDF0cwRWcixvOw56ElJROE8RAGkMGloUXjYCVV9cCUIfCmcKK18TMwdsVFdYZh8UCj0JG11FWVYEU19VAUMnA244WjUSVAcEXFxtCXsXBWcIE14dXgUBVlpdOEsfB1_fsvXD0aDW7fSKusknM18LK2slXTYBZAAzCRgVU2pbT1t7AUEEDg4YCwN5A20OElwTWgQCZFxcCUkVM184exh1HHpDHRsPD0pkQhF_eTtjNQJxFSAffgh3QQhodVlXCFVkUxY6dylDWDhTZD9zXDYCZFlbCXsWMw

#### 68. 荣耀 MagicPad 3（2025）｜ id：`honor-magicpad-3` ｜ tags：`['平板','旗舰','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-07'   lp: null   cp: null
sz: 13.3   res: null   ppi: null   mat: 'LCD'   rr: 165   nit: null   dim: null   hdr: null
soc: '骁龙8 Gen3'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512,1024]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '900万像素'
bc: 12450   bw: 66   bwl: 0   br: null
os: 'Android'   ui: 'MagicOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 595   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 荣耀 Magic-Pen，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2025-07 发布，13.3 英寸 165Hz，12450mAh，595g。**首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 69. 荣耀 MagicPad 2（2024）｜ id：`honor-magicpad-2` ｜ tags：`['平板','旗舰','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-07-12'   lp: 2899   cp: 2599
sz: 12.3   res: '3000x1920'   ppi: 290   mat: 'OLED（10bit，IMAX Enhanced）'   rr: 144   nit: 1600   dim: '4320Hz PWM 调光'   hdr: 'HDR10'
soc: '第三代骁龙8s'   sb: '高通'   pr: '4nm'   cpu: '3.0GHz 八核'   gpu: 'Adreno 735'   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512,1024]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '900万像素'
bc: 10050   bw: 66   bwl: 0   br: '5W有线反充'
os: 'Android 14'   ui: 'MagicOS 8.0.1'   net: 'Wi-Fi'   wf: 'Wi-Fi 6'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '274.5x180.5x5.8mm'   wt: 555   bm: null   ip: null   bio: null
spk: '八扬声器（IMAX Enhanced Audio）'   port: 'USB-C'   col: '天海青,星空黑,月影白'
pen: '支持 荣耀 Magic-Pen 3，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-07-12 上市（07-19 开售），2899 元起（8+256）~4199（16+1TB）。天猫在售 2399~2599
- 来源：https://en.smartphones24.org/?p=772229 、https://www.noypigeeks.com/android/honor-magicpad-2-pad-9-pro/

#### 70. 荣耀平板 X10（2026）｜ id：`honor-pad-x10` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: 1099   cp: 1299
sz: null   res: null   ppi: null   mat: null   rr: null   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'Android'   ui: 'MagicOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- 荣耀官网在售：荣耀平板 X10 ¥1099 起（原价 ¥1299），荣耀平板 X10 Pro ¥1699 起。**详细参数未查到**
- 来源：https://www.honor.cn

#### 71. 荣耀平板 20（2026）｜ id：`honor-pad-20` ｜ tags：`['平板','入门','学习']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: 2099   cp: 2699
sz: null   res: null   ppi: null   mat: null   rr: null   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'Android'   ui: 'MagicOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- 荣耀官网：荣耀平板 20 ¥2099 起（原价 ¥2699），主打「轻松上大分」学习平板。**详细参数未查到**
- 来源：https://www.honor.cn

---

## E. OPPO / 一加平板（11 款）

> OPPO 与一加平板是同平台孪生关系：OPPO Pad 3 Pro ≈ 一加平板 Pro，OPPO Pad 4 Pro ≈ 一加平板 2 Pro，OPPO Pad 3 ≈ 一加平板。
> 录入时建议 `tags` 都加「孪生机型」，前端可提示「同平台更便宜的型号」。

#### 72. OPPO Pad 5 Pro（2026）｜ id：`oppo-pad-5-pro` ｜ tags：`['平板','旗舰','大屏','长续航','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-04'   lp: null   cp: null
sz: 13.2   res: '3.4K'   ppi: null   mat: 'LCD'   rr: 144   nit: 900   dim: '全亮度DC调光'   hdr: null
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 13380   bw: 67   bwl: 0   br: null
os: 'Android 16'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 OPPO Pencil，不随附'   kbd: '支持 官方磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 2026-04 发布，13.2 英寸 3.4K 超清原彩屏，13380mAh。**首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 73. OPPO Pad 4 Pro（2025）｜ id：`oppo-pad-4-pro` ｜ tags：`['平板','旗舰','大屏','长续航','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-04'   lp: 3199   cp: 3599
sz: 13.2   res: '3392x2400'   ppi: 315   mat: 'LCD'   rr: 144   nit: 900   dim: '全亮度DC调光'   hdr: 'Dolby Vision'
soc: '骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: 'UFS 4.0'   ram: [8,12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 12140   bw: 67   bwl: 0   br: null
os: 'Android 15'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '289.61x209.66x5.97mm'   wt: 675   bm: null   ip: null   bio: null
spk: '八扬声器（HiFi 级）'   port: 'USB-C 3.2'   col: null
pen: '支持 OPPO Pencil 2，不随附'   kbd: '支持 官方磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 2025-04 发布，3199 元起（8+256）~4099。天猫补贴价 3099~3599
- 来源：https://www.toutiao.com/article/7513593875416498728/ 、https://s.click.taobao.com/t?e=m%3D2%26s%3DAF3GfPfuqyFw4vFB6t2Z2ueEDrYVVa64yK8Cckff7TVRAdhuF14FMaOG7xmpP0CsJ1gyddu7kN%2BbBjBh3LodcDtMDMUFdHxsEga%2Bn4dNFSFW2RGh2%2FLyNYVwhIsr1DlAgb9ZeSZXs4rQ5thPdhAOVLsAUvvkhTBsz5gVqac4K2%2BMHuv7RoNv0YzeH%2FA0sTcbA9Wpqct8PGxJsS3KJ2XFI233oSIU6xge2iohIVvY1N6x1JQqqpfm%2FMZvEkwvUycodH1s%2BZ8Vnb%2F%2F%2BK%2FGY2Z6jwlUuur7re5Fxex5shQwpf4UwKMsvWj7aROGhEUGHWZ8

#### 74. OPPO Pad 3 Pro（2024）｜ id：`oppo-pad-3-pro` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-10-24'   lp: null   cp: null
sz: 12.1   res: '3000x2120'   ppi: 304   mat: 'LCD（IPS）'   rr: 144   nit: 900   dim: null   hdr: 'HDR10'
soc: '骁龙8 Gen3领先版'   sb: '高通'   pr: '4nm'   cpu: '3.3GHz 八核'   gpu: null   an: null
rt: null   ft: 'UFS 4.0'   ram: [8,12,16]   rom: [256,512]
cm: '1300万像素 f/2.2'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 9510   bw: 67   bwl: 0   br: null
os: 'Android 14'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: 'Wi-Fi 6'   bt: '5.4'   nfc: false   ir: false   sat: null
bdim: '268.7x195.1x6.5mm'   wt: 586   bm: null   ip: null   bio: null
spk: '八扬声器（HiFi 级）'   port: 'USB-C 3.2'   col: '蓝,金'
pen: '支持 OPPO Pencil，不随附'   kbd: '支持 官方磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 2024-10-24 发布，型号 OPD2401。540Hz 触控采样率。**国行首发价未查到**（2299~4199 区间是 2025 年在售价）
- 来源：https://www.smartprix.com/tablets/oppo_pad_3_pro_vs_oneplus_pad_2_pro-cpd1p7xt99ch_pd18zb4bmkc.php 、https://www.toutiao.com/article/7513593875416498728/

#### 75. OPPO Pad 3（2024）｜ id：`oppo-pad-3` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-11'   lp: 1699   cp: null
sz: 11.61   res: '2.8K'   ppi: 296   mat: 'LCD'   rr: 144   nit: 700   dim: '全程DC调光'   hdr: null
soc: '天玑8350'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: 1480000
rt: null   ft: null   ram: [8,12]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 9520   bw: 67   bwl: 0   br: null
os: 'Android 14'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '厚6.29mm'   wt: 536   bm: null   ip: null   bio: null
spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 OPPO Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-11 发布，1699~2499 元区间。7:5 比例，480Hz 触控采样
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 76. OPPO Pad 2（2023）｜ id：`oppo-pad-2` ｜ tags：`['平板','主流','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-11'   lp: null   cp: null
sz: 11.61   res: '2800x2000'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑9000'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 9510   bw: 67   bwl: 0   br: null
os: 'Android 13'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 552   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 OPPO Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2023-11 发布，7:5 比例 11.61"。**首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 77. OPPO Pad Air（2022）｜ id：`oppo-pad-air` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2022-09'   lp: null   cp: null
sz: 10.36   res: '2000x1200'   ppi: null   mat: 'LCD'   rr: 60   nit: null   dim: null   hdr: null
soc: '骁龙680'   sb: '高通'   pr: '6nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [4,6]   rom: [64,128]
cm: '800万像素'   cw: null   ct: null   cz: null   cv: null   fc: '500万像素'
bc: 7100   bw: 18   bwl: 0   br: null
os: 'Android 12'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 440   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '不支持官方手写笔'   kbd: null   cell: '无蜂窝版'
```
- 2022-09 发布。**本轮未逐项重新核实，仅收录确定项**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 78. 一加平板 3 Pro（2026）｜ id：`oneplus-pad-3-pro` ｜ tags：`['平板','旗舰','大屏','长续航','游戏']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-05'   lp: null   cp: 3739
sz: 13.2   res: null   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '第五代骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: '4.6GHz'   gpu: 'Adreno 840 @1200MHz'   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 13380   bw: null   bwl: 0   br: null
os: 'Android 16'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '289.71x209.76x5.94mm'   wt: null   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C'   col: '深棕'
pen: '支持 一加手写笔，不随附'   kbd: '支持 官方磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 型号 OPD2513，2026-05 上市。京东 12+256 国补 ¥3739。**首发价未查到**
- 来源：https://union-click.jd.com/jdc?e=&p=JF8BAS0JK1olWAUFUVlZC08WC18IGlgWXA4BXV9VD00UB19MRANLAjZbERscSkAJHTdNTwcKBlMdBgABFksWAGwJE1gcXA4FUl1ZFxJSXzI4eRxjXUNBJl49aQMeXGlYQB1iFEZDElJROE8RAGkMGloUXjYCVV9cCUIfCmcKK18TMwdsVFdYZk4QA2wITghAD1RWXAtdD0onA244WjUSXAICU1xaCXsWM28OE1sdWA4BV11fCEsnA2cMK4y889CO8orkopylgV84K1glbTYCZF1tViUWBD9dS1oUVWheE1gHWA4XRwEIGV0TWg4CUFhtCkoWAW04K2tWB2ZbFBw8aTNMdiRKUwwVIgNbUBUfDBcXfxNdUzt7XwQFMD0FSTZUYhh4QCRoHG9cZF5tD00WM244

#### 79. 一加平板 2 Pro（2025）｜ id：`oneplus-pad-2-pro` ｜ tags：`['平板','旗舰','大屏','长续航','游戏']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-05-13'   lp: null   cp: 3399
sz: 13.2   res: '3392x2400'   ppi: 315   mat: 'LCD（IPS）'   rr: 144   nit: 1000   dim: null   hdr: 'Dolby Vision/HDR10+'
soc: '骁龙8至尊版'   sb: '高通'   pr: '3nm'   cpu: '4.32GHz 八核'   gpu: 'Adreno 830 @1.1GHz'   an: null
rt: null   ft: 'UFS 4.0'   ram: [8,12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 12140   bw: 67   bwl: 0   br: null
os: 'Android 15'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: '5.4'   nfc: false   ir: false   sat: null
bdim: '289.61x209.66x5.97mm'   wt: 675   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C 3.2'   col: '深海蓝,银'
pen: '支持 一加手写笔，不随附'   kbd: '支持 官方磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 型号 OPD2413，2025-05 上市。京东 12+256 国补 ¥3399，常卖 ¥3999。**首发价未查到**
- 来源：https://www.smartprix.com/tablets/oppo_pad_3_pro_vs_oneplus_pad_2_pro-cpd1p7xt99ch_pd18zb4bmkc.php 、https://union-click.jd.com/jdc?e=&p=JF8BAS0JK1olXwUKVVxVAEofBl8IGlsRWQcAXFhVC04VAF9MRANLAjZbERscSkAJHTdNTwcKBlMdBgABFksWA2sMGlkdWw4BUVxeFxJSXzI4XS5NJlFbIAM-AClCQSRRYABVH1UHElJROE8RAGkMGloUXjYCVV9cCUIfCmcKK18TMwdsVFdYZkMTB2oKSVtGWgFXVVhfXxknA244WjUVXwcCV15bD3sWM28OE1sdWA4BV11eAEknA2cMK4y889CO8orkopylgV84K1glbTYCZF1tViUWBGkLSwlGDWheE1gHWA4XVwEIGV0cXgAHXVptCkoWAW04K2ttHAMHFTUdcUx-dA9jax9iCAB0CT42ek5FCxlUSV57X3l-VFoOXkpLdWp7WSJcNFpeZF5tD00WM244

#### 80. 一加平板 2（2025）｜ id：`oneplus-pad-2` ｜ tags：`['平板','主流','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-10'   lp: null   cp: null
sz: 12.1   res: null   ppi: null   mat: 'LCD'   rr: null   nit: null   dim: null   hdr: null
soc: '天玑9400+'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'Android 15'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '支持 一加手写笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2025-10 发布。**除芯片与尺寸外详细参数未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 81. 一加平板 Pro（2024）｜ id：`oneplus-pad-pro` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-06'   lp: 2799   cp: null
sz: 12.1   res: '3000x2120'   ppi: 303   mat: 'LCD'   rr: 144   nit: 900   dim: null   hdr: null
soc: '骁龙8 Gen3'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 9510   bw: 67   bwl: 0   br: null
os: 'Android 14'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 584   bm: null   ip: null   bio: null
spk: '六扬声器（环绕式）'   port: 'USB-C'   col: null
pen: '支持 一加手写笔，不随附'   kbd: '支持 官方磁吸键盘，不随附'   cell: '无蜂窝版'
```
- 2024-06 发布，2799 元起。与 OPPO Pad 3 Pro 同平台（3K 屏 / 144Hz / 303PPI / 900nit / 540Hz 触控 / 9510mAh / 67W），差异在芯片版本（8 Gen3 vs 8 Gen3 领先版）、扬声器（六扬 vs HiFi 八扬）与价格
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 82. 一加平板（一代，2024）｜ id：`oneplus-pad` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-12'   lp: null   cp: null
sz: 11.61   res: '2.8K'   ppi: 296   mat: 'LCD'   rr: 144   nit: 700   dim: '全程DC调光'   hdr: null
soc: '天玑8350'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 9520   bw: 67   bwl: 0   br: null
os: 'Android 14'   ui: 'ColorOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: '厚6.29mm'   wt: 533   bm: null   ip: null   bio: null
spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 一加手写笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-12 发布，与 OPPO Pad 3 同平台，比 OPPO 版轻 3g。**首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

---

## F. vivo / iQOO 平板（12 款）

> iQOO Pad5 Pro 的**官方参数页**（vivo.com.cn/vivo/param/）是本段最完整的一手来源，其余型号多为媒体/电商来源。

#### 83. iQOO Pad Ultra（2026）｜ id：`iqoo-pad-ultra` ｜ tags：`['平板','小屏','游戏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2026-09'   lp: null   cp: null
sz: 8.8   res: null   ppi: null   mat: 'OLED'   rr: null   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 9020   bw: null   bwl: 0   br: null
os: null   ui: 'OriginOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- 2026-09 发布，8.8 英寸 OLED，9020mAh。**其余参数未查到**
- 来源：https://www.gizmochina.com/page/11

#### 84. iQOO Pad5 Pro（2025）｜ id：`iqoo-pad5-pro` ｜ tags：`['平板','旗舰','大屏','游戏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-05-20'   lp: 3199   cp: 3299
sz: 13   res: '3096x2064'   ppi: null   mat: 'LCD'   rr: 144   nit: 1200   dim: null   hdr: 'HDR10'
soc: '天玑9400+'   sb: '联发科'   pr: '3nm'   cpu: '3.73GHz×1 + 3.3GHz×3 + 2.4GHz×4'   gpu: '1.6GHz'   an: 2750000
rt: 'LPDDR5X 四通道'   ft: 'UFS 4.1'   ram: [8,12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: '4K'   fc: '800万像素'
bc: 12050   bw: 66   bwl: 0   br: null
os: 'Android 15'   ui: 'OriginOS 5 平板定制系统'   net: 'Wi-Fi'   wf: 'Wi-Fi 7'   bt: '5.4'   nfc: false   ir: false   sat: null
bdim: '289.56x198.32x6.07mm'   wt: 635   bm: '金属机身'   ip: null   bio: '面部识别/密码'
spk: '八扬声器（全景声 HDR 影院）'   port: 'USB-C（USB 3.2 Gen1）'   col: '曼岛,灰晶,银翼'
pen: '支持 iQOO Pencil 3（16384级压感），不随附'   kbd: '支持 智能触控键盘 5 Pro，不随附'   cell: '无蜂窝版'
```
- 2025-05-20 发布即开售，3199 元起（8+256）~3999（16+512）。配备 40600mm² 立体散热系统
- 来源：https://www.vivo.com.cn/vivo/param/iqoopad5pro 、https://newton.com.tw/wiki/iQOO%20Pad5%20Pro/65690207

#### 85. iQOO Pad5（2025）｜ id：`iqoo-pad5` ｜ tags：`['平板','主流','游戏']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-05'   lp: null   cp: null
sz: 13   res: null   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: null   ui: 'OriginOS 5'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '支持 iQOO Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 与 iQOO Pad5 Pro 同期发布（2025-05）。**详细参数与价格未查到**
- 来源：https://newton.com.tw/wiki/iQOO%20Pad5%20Pro/65690207

#### 86. iQOO Pad5e（2026）｜ id：`iqoo-pad5e` ｜ tags：`['平板','入门','游戏']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: 1999   cp: null
sz: null   res: null   ppi: null   mat: 'LCD'   rr: null   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: null   ui: 'OriginOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- 1999 元起。**详细参数未查到**
- 来源：https://www.gizmochina.com/page/11

#### 87. vivo Pad6 Pro（2026）｜ id：`vivo-pad6-pro` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2026'   lp: 4499   cp: null
sz: null   res: null   ppi: null   mat: null   rr: null   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: null   ui: 'OriginOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: '支持 vivo Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 4499 元起。**详细参数未查到**
- 来源：https://www.gizmochina.com/page/11

#### 88. vivo Pad5 Pro（2025）｜ id：`vivo-pad5-pro` ｜ tags：`['平板','旗舰','大屏','长续航','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-04'   lp: 2999   cp: null
sz: 13   res: '3096x2064'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑9400'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 12050   bw: 66   bwl: 0   br: null
os: 'Android 15'   ui: 'OriginOS 5'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 635   bm: null   ip: null   bio: null
spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 vivo Pencil 3，不随附'   kbd: '支持 智能触控键盘，不随附'   cell: '无蜂窝版'
```
- 2025-04 发布，2999 元起。与 iQOO Pad5 Pro 同平台（天玑 9400 vs 9400+）
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 89. vivo Pad SE（2025）｜ id：`vivo-pad-se` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2025'   lp: 1599   cp: null
sz: null   res: null   ppi: null   mat: 'LCD'   rr: null   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: null   rom: null
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: null   ui: 'OriginOS'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- 1599 元起。**详细参数未查到**
- 来源：https://www.gizmochina.com/page/11

#### 90. vivo Pad3 Pro（2024）｜ id：`vivo-pad3-pro` ｜ tags：`['平板','旗舰','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-03'   lp: null   cp: null
sz: 13   res: '3096x2064'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑9300'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12,16]   rom: [256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 11500   bw: 66   bwl: 0   br: null
os: 'Android 14'   ui: 'OriginOS 4'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 678   bm: null   ip: null   bio: null   spk: '八扬声器'   port: 'USB-C'   col: null
pen: '支持 vivo Pencil 2，不随附'   kbd: '支持 智能触控键盘，不随附'   cell: '无蜂窝版'
```
- 2024-03 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 91. vivo Pad3（2024）｜ id：`vivo-pad3` ｜ tags：`['平板','主流']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-06'   lp: null   cp: null
sz: 12.1   res: '2800x1968'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10000   bw: 44   bwl: 0   br: null
os: 'Android 14'   ui: 'OriginOS 4'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 589   bm: null   ip: null   bio: null   spk: '六扬声器'   port: 'USB-C'   col: null
pen: '支持 vivo Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-06 发布。**芯片与首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 92. vivo Pad Air（2023）｜ id：`vivo-pad-air` ｜ tags：`['平板','主流','轻薄']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-08'   lp: null   cp: null
sz: 11.5   res: '2800x1840'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙870'   sb: '高通'   pr: '7nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '500万像素'
bc: 8500   bw: 44   bwl: 0   br: null
os: 'Android 13'   ui: 'OriginOS 3'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 530   bm: '一体化铝合金'   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 vivo Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2023-08 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 93. vivo Pad2（2023）｜ id：`vivo-pad2` ｜ tags：`['平板','主流','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-04'   lp: null   cp: null
sz: 12.1   res: '2800x1968'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑9000'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 10000   bw: 44   bwl: 0   br: null
os: 'Android 13'   ui: 'OriginOS 3'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 585   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 vivo Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2023-04 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 94. iQOO Pad（2023）｜ id：`iqoo-pad` ｜ tags：`['平板','主流','大屏','长续航','游戏']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-05'   lp: null   cp: null
sz: 12.1   res: '2800x1968'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑9000+'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '800万像素'
bc: 10000   bw: 44   bwl: 0   br: null
os: 'Android 13'   ui: 'OriginOS 3'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 585   bm: null   ip: null   bio: null   spk: '六扬声器'   port: 'USB-C'   col: null
pen: '支持 iQOO Pencil，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2023-05 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

---

## G. 三星 Galaxy Tab（13 款）

> 三星 Tab S 系列**全系随附 S Pen**（这是与苹果/安卓其他家最大的差异，录入时 `pen` 一律写「随附 S Pen」）。
> Tab S10 FE 及以后 S Pen 不支持 BLE（蓝牙遥控失效），已在备注里标明。

#### 95. 三星 Galaxy Tab S11 Ultra（2025）｜ id：`samsung-galaxy-tab-s11-ultra` ｜ tags：`['平板','旗舰','大屏','长续航','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-09'   lp: 8999   cp: 8999
sz: 14.6   res: null   ppi: null   mat: 'AMOLED'   rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '天玑9400+'   sb: '联发科'   pr: '3nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512,1024]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素'
bc: 11600   bw: 45   bwl: 0   br: null
os: 'Android 16'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 7'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: '钛影灰,星熠银'
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套（AI Key），不随附'   cell: '有 5G 蜂窝版'
```
- 2025-09-05 发布、09-19 上市。8999 元起（12+256），另有 9799 元配置
- 来源：https://news.samsung.com/tw/ 、https://www.toutiao.com/article/7513593875416498728/

#### 96. 三星 Galaxy Tab S11（2025）｜ id：`samsung-galaxy-tab-s11` ｜ tags：`['平板','旗舰','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-09'   lp: 5999   cp: 5799
sz: 11   res: '2560x1600'   ppi: null   mat: 'AMOLED'   rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '天玑9400+'   sb: '联发科'   pr: '3nm'   cpu: '八核 3.73GHz'   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [128,256,512]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素'
bc: 8400   bw: 45   bwl: 0   br: null
os: 'Android 16'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 7'   bt: null   nfc: false   ir: false   sat: null
bdim: '厚5.5mm'   wt: null   bm: null   ip: null   bio: null   spk: null   port: 'USB-C'   col: '钛影灰,星熠银'
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套（AI Key），不随附'   cell: '有 5G 蜂窝版'
```
- 2025-09-19 上市，5999 元起。电商常卖 5799（官方标价 6999 为含税高配口径，本条采用发布价 5999）
- 来源：https://news.samsung.com/tw/ 、https://s.click.taobao.com/t?e=...（三星官方旗舰店 Galaxy Tab S11）

#### 97. 三星 Galaxy Tab S10 FE+（2025）｜ id：`samsung-galaxy-tab-s10-fe-plus` ｜ tags：`['平板','主流','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-04'   lp: 4499   cp: 3799
sz: 13.1   res: '2880x1800'   ppi: 259   mat: 'LCD'   rr: 90   nit: 800   dim: null   hdr: null
soc: 'Exynos 1580'   sb: '三星'   pr: null   cpu: '2.9GHz 八核'   gpu: null   an: null
rt: null   ft: '支持最高 2TB microSD 扩展'   ram: [8,12]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素超广角'
bc: 10090   bw: 45   bwl: 0   br: null
os: 'Android 15'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 6'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '300.6x194.7x6.0mm'   wt: 664   bm: null   ip: 'IP68'   bio: '指纹识别（电源键）'
spk: '双扬声器'   port: 'USB-C'   col: '清雅灰,月光银,冰清蓝'
pen: '随附 S Pen（不支持 BLE）'   kbd: '支持 书本式键盘皮套 / 薄型键盘皮套（AI Key），不随附'   cell: '有 5G 蜂窝版'
```
- 2025-04-21 国行预售。8+128 Wi-Fi 4499（国补后 3999）、12+256 Wi-Fi 5199（国补后 4699）、12+256 5G 5999（国补后 5499）
- 来源：https://news.samsung.com/tw/娛樂滿分、工作更pro！三星galaxy-tab-s10-fe系列全新登場 、https://www.toutiao.com/article/7495578928267739686

#### 98. 三星 Galaxy Tab S10 FE（2025）｜ id：`samsung-galaxy-tab-s10-fe` ｜ tags：`['平板','主流','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2025-04'   lp: 3499   cp: 3399
sz: 10.9   res: '2304x1440'   ppi: 249   mat: 'LCD'   rr: 90   nit: 800   dim: null   hdr: null
soc: 'Exynos 1580'   sb: '三星'   pr: null   cpu: '2.9GHz 八核'   gpu: null   an: null
rt: null   ft: '支持最高 2TB microSD 扩展'   ram: [8,12]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素超广角'
bc: 8000   bw: 45   bwl: 0   br: null
os: 'Android 15'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 6'   bt: '5.3'   nfc: false   ir: false   sat: null
bdim: '254.3x165.8x6.0mm'   wt: 497   bm: null   ip: 'IP68'   bio: '指纹识别（电源键）'
spk: '双扬声器'   port: 'USB-C'   col: '清雅灰,月光银,冰清蓝'
pen: '随附 S Pen（不支持 BLE）'   kbd: '支持 书本式键盘皮套 / 薄型键盘皮套（AI Key），不随附'   cell: '有 5G 蜂窝版'
```
- 型号 SM-X520。8+128 Wi-Fi 3499（国补后 2999）、12+256 Wi-Fi 4199（国补后 3699）、12+256 5G 4999（国补后 4499）
- 来源：https://news.samsung.com/tw/娛樂滿分、工作更pro！三星galaxy-tab-s10-fe系列全新登場 、https://union-click.jd.com/jdc?e=&p=JF8BAS0JK1olWAYGU1dZAUoTA18IGlsQVAIHUV5fDEoVC19MRANLAjZbERscSkAJHTdNTwcKBlMdBgABFksWA2oBH14QXQQGVVxVFxJSXzI4HiJxA3BFKAc4QBNjexttUjlcKAQCAlJROE8RAGkMGloUXjYCVV9cCUIfCmcKK18TMwdsVFdYZkIeATsKHVsVXVMGUVlYXB8nA244WjUVXgQGVlZZC3sWM28OE1sdWA4BVFtUCk0nA2cMK4y889CO8orkopylgV84K1glbTYCZF1tViUWBGpcGQ4WD2heE1gHWBRHUwEIGV0cXgQBVV1tCkoWAW04K2tWB2YGFBw8aTNMdiRKUwx9OVUFJxUfdQJwdAd4WTt7XwQFMD0FSTZUYhh6Sxl2C05cZF5tD00WM244

#### 99. 三星 Galaxy Tab S10 Ultra（2024）｜ id：`samsung-galaxy-tab-s10-ultra` ｜ tags：`['平板','旗舰','大屏','长续航','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-09'   lp: null   cp: null
sz: 14.6   res: '2960x1848'   ppi: null   mat: 'AMOLED 2X'   rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '天玑9300+'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512,1024]
cm: '1300万像素'   cw: '800万像素超广角'   ct: null   cz: null   cv: null   fc: '1200万像素 + 1200万像素超广角'
bc: 11200   bw: 45   bwl: 0   br: null
os: 'Android 14'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 7'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 718   bm: null   ip: 'IP68'   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套，不随附'   cell: '有 5G 蜂窝版'
```
- 2024-09 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 100. 三星 Galaxy Tab S10+（2024）｜ id：`samsung-galaxy-tab-s10-plus` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-09'   lp: null   cp: null
sz: 12.4   res: '2800x1752'   ppi: null   mat: 'AMOLED 2X'   rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '天玑9300+'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256,512]
cm: '1300万像素'   cw: '800万像素超广角'   ct: null   cz: null   cv: null   fc: '1200万像素超广角'
bc: 10090   bw: 45   bwl: 0   br: null
os: 'Android 14'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 7'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 571   bm: null   ip: 'IP68'   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套，不随附'   cell: '有 5G 蜂窝版'
```
- 2024-09 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 101. 三星 Galaxy Tab S9 Ultra（2023）｜ id：`samsung-galaxy-tab-s9-ultra` ｜ tags：`['平板','旗舰','大屏','长续航','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-08'   lp: 9499   cp: 8449
sz: 14.6   res: '2960x1848'   ppi: null   mat: 'Dynamic AMOLED 2X'   rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '骁龙8 Gen2 for Galaxy'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512,1024]
cm: '1300万像素'   cw: '800万像素超广角'   ct: null   cz: null   cv: null   fc: '1200万像素 + 1200万像素超广角'
bc: 11200   bw: 45   bwl: 0   br: null
os: 'Android 13'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 6E'   bt: null   nfc: false   ir: false   sat: null
bdim: '厚5.5mm'   wt: 732   bm: null   ip: 'IP68'   bio: null   spk: '四扬声器'   port: 'USB-C'   col: '云影灰'
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套，不随附'   cell: '有 5G 蜂窝版'
```
- 国行先行者价：12+256=9499 / 12+512=10399 / 16+1TB=12699。京东（海外版 12+256）在售约 8439
- 来源：https://sina.cn/news/detail/4928034485043936.html 、https://union-click.jd.com/jdc?e=&p=JF8BASwJK1olXwMFXV1cC0IVAl8IGlodWgEKVl1ZC08VA19MRANLAjZbERscSkAJHTdNTwcKBlMdBgABFksWAmcPHFMXXgIBUFxdFxJSXzI4fShQHlBkKyg9axcNBi57WjAXJ3NeNFJROE8RAGkMGloUXjYCVV9cCUIfCmcKK18TMwdsVFdYZk9DUWoNSQ4XDgEEUgxfDUMnA244WjUVWAUFXF9aDHsWM28OE1sdWA4DV1tbCE0nA2cMK4y889CO8orkopylgV84K1glbTYCZF1tViUWBGsMH15GVWheE1gHDxFKBAEIGV0TXQcDUlltCkoWAW04K2ttFU1HVCwOCUtkZTlDXT5SDVtDJyE2DjwTdRN_HjUXJ3tDIlcFCyBNUBdzTDhuOQEyVG5aDkonAl8

#### 102. 三星 Galaxy Tab S9+（2023）｜ id：`samsung-galaxy-tab-s9-plus` ｜ tags：`['平板','旗舰','大屏','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-08'   lp: 7999   cp: 6199
sz: 12.4   res: '2800x1752'   ppi: null   mat: 'Dynamic AMOLED 2X'   rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '骁龙8 Gen2 for Galaxy'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12]   rom: [256,512]
cm: '1300万像素'   cw: '800万像素超广角'   ct: null   cz: null   cv: null   fc: '1200万像素超广角'
bc: 10090   bw: 45   bwl: 0   br: null
os: 'Android 13'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 6E'   bt: null   nfc: false   ir: false   sat: null
bdim: '厚5.7mm'   wt: 581   bm: null   ip: 'IP68'   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套，不随附'   cell: '有 5G 蜂窝版'
```
- 国行先行者价：12+256=7999 / 12+512=8899。型号 SM-X810
- 来源：https://sina.cn/news/detail/4928034485043936.html 、https://uland.taobao.com/item/edetail?id=POmzAMqXC3t6850AKd5cOquGC6-6gq8rDuyPweQqXJfBW

#### 103. 三星 Galaxy Tab S9（2023）｜ id：`samsung-galaxy-tab-s9` ｜ tags：`['平板','旗舰','生产力']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-08'   lp: 6499   cp: null
sz: 11   res: '2560x1600'   ppi: null   mat: 'Dynamic AMOLED 2X'   rr: 120   nit: null   dim: null   hdr: 'HDR10+'
soc: '骁龙8 Gen2 for Galaxy'   sb: '高通'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256]
cm: '1300万像素'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素超广角'
bc: 8400   bw: 45   bwl: 0   br: null
os: 'Android 13'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 6E'   bt: null   nfc: false   ir: false   sat: null
bdim: '厚5.9mm'   wt: 498   bm: null   ip: 'IP68'   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套，不随附'   cell: '有 5G 蜂窝版'
```
- 国行先行者价：8+128=6499 / 12+256=7399
- 来源：https://sina.cn/news/detail/4928034485043936.html

#### 104. 三星 Galaxy Tab S9 FE+（2023）｜ id：`samsung-galaxy-tab-s9-fe-plus` ｜ tags：`['平板','主流','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-10'   lp: null   cp: null
sz: 12.4   res: '2560x1600'   ppi: null   mat: 'LCD'   rr: 90   nit: null   dim: null   hdr: null
soc: 'Exynos 1380'   sb: '三星'   pr: '5nm'   cpu: null   gpu: null   an: null
rt: null   ft: '支持 microSD 扩展'   ram: [6,8]   rom: [128,256]
cm: '800万像素'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素超广角'
bc: 10090   bw: 45   bwl: 0   br: null
os: 'Android 13'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 6'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 627   bm: null   ip: 'IP68'   bio: null   spk: '双扬声器'   port: 'USB-C'   col: null
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套，不随附'   cell: '有 5G 蜂窝版'
```
- 2023-10 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 105. 三星 Galaxy Tab S9 FE（2023）｜ id：`samsung-galaxy-tab-s9-fe` ｜ tags：`['平板','主流','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-10'   lp: null   cp: null
sz: 10.9   res: '2304x1440'   ppi: null   mat: 'LCD'   rr: 90   nit: null   dim: null   hdr: null
soc: 'Exynos 1380'   sb: '三星'   pr: '5nm'   cpu: null   gpu: null   an: null
rt: null   ft: '支持 microSD 扩展'   ram: [6,8]   rom: [128,256]
cm: '800万像素'   cw: null   ct: null   cz: null   cv: null   fc: '1200万像素超广角'
bc: 8000   bw: 45   bwl: 0   br: null
os: 'Android 13'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 6'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 523   bm: null   ip: 'IP68'   bio: null   spk: '双扬声器'   port: 'USB-C'   col: null
pen: '随附 S Pen'   kbd: '支持 官方键盘保护套，不随附'   cell: '有 5G 蜂窝版'
```
- 2023-10 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 106. 三星 Galaxy Tab A9+（2023）｜ id：`samsung-galaxy-tab-a9-plus` ｜ tags：`['平板','入门','大屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-10'   lp: null   cp: null
sz: 11   res: '1920x1200'   ppi: null   mat: 'LCD'   rr: 90   nit: null   dim: null   hdr: null
soc: '骁龙695'   sb: '高通'   pr: '6nm'   cpu: null   gpu: null   an: null
rt: null   ft: '支持 microSD 扩展'   ram: [4,6,8]   rom: [64,128,256]
cm: '800万像素'   cw: null   ct: null   cz: null   cv: null   fc: '500万像素'
bc: 7040   bw: 15   bwl: 0   br: null
os: 'Android 13'   ui: 'One UI'   net: 'Wi-Fi / 5G'   wf: 'Wi-Fi 5'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 491   bm: null   ip: null   bio: null   spk: '四扬声器（杜比全景声）'   port: 'USB-C'   col: null
pen: '不支持官方 S Pen'   kbd: null   cell: '有 5G 蜂窝版'
```
- 2023-10 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

#### 107. 三星 Galaxy Tab A9（2023）｜ id：`samsung-galaxy-tab-a9` ｜ tags：`['平板','入门','小屏']`

```
cat: 'tablet'   ff: 'slate'
d: '2023-10'   lp: null   cp: null
sz: 8.7   res: '1340x800'   ppi: null   mat: 'LCD'   rr: 60   nit: null   dim: null   hdr: null
soc: 'Helio G99'   sb: '联发科'   pr: '6nm'   cpu: null   gpu: null   an: null
rt: null   ft: '支持 microSD 扩展'   ram: [4,6]   rom: [64,128]
cm: '800万像素'   cw: null   ct: null   cz: null   cv: null   fc: '200万像素'
bc: 5100   bw: 15   bwl: 0   br: null
os: 'Android 13'   ui: 'One UI'   net: 'Wi-Fi / 4G'   wf: 'Wi-Fi 5'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 332   bm: null   ip: null   bio: null   spk: '双扬声器（杜比全景声）'   port: 'USB-C'   col: null
pen: '不支持官方 S Pen'   kbd: null   cell: '有 4G 蜂窝版'
```
- 2023-10 发布。**国行首发价未查到**
- 来源：https://www.toutiao.com/article/7513593875416498728/

---

## H. 联想平板（6 款）

#### 108. 联想拯救者 Y700（2025 款）｜ id：`lenovo-legion-y700-2025` ｜ tags：`['平板','小屏','游戏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-12'   lp: 2899   cp: 2899
sz: 8.8   res: '2560x1600'   ppi: null   mat: 'LCD'   rr: 165   nit: null   dim: null   hdr: null
soc: '骁龙8 Gen3'   sb: '高通'   pr: '4nm'   cpu: '八核'   gpu: null   an: null
rt: null   ft: 'UFS 4.0'   ram: [12,16]   rom: [256,512]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 6550   bw: 68   bwl: 0   br: null
os: 'Android 14'   ui: 'ZUI 16.1'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 350   bm: null   ip: null   bio: null   spk: '双扬声器'   port: '双 USB-C'   col: '钛晶灰'
pen: '不支持官方手写笔'   kbd: null   cell: '无蜂窝版'
```
- ZOL 标注「2025 款」，上市时间 2024 年（2024 年末上市、2025 款命名）。12+256=2899 / 16+512=3299 / 超控灵动版 3299
- 来源：https://detail.zol.com.cn/tablepc/lenovo/guangzhou/good.html

#### 109. 联想拯救者 Y700（2024 款）｜ id：`lenovo-legion-y700-2024` ｜ tags：`['平板','小屏','游戏']`

```
cat: 'tablet'   ff: 'slate'
d: '2024'   lp: null   cp: null
sz: 8.8   res: '2560x1600'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: null   sb: '高通'   pr: null   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 6550   bw: null   bwl: 0   br: null
os: 'Android'   ui: 'ZUI'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '双扬声器'   port: '双 USB-C'   col: null
pen: '不支持官方手写笔'   kbd: null   cell: '无蜂窝版'
```
- **本条参数完整度低**：仅确认 8.8" / 6550mAh / 双 Type-C / 2024 款命名，**芯片型号、价格、重量未查到**
- 来源：https://detail.zol.com.cn/tablepc/lenovo/guangzhou/good.html

#### 110. 联想拯救者 Y700（2023 款）｜ id：`lenovo-legion-y700-2023` ｜ tags：`['平板','小屏','游戏','轻薄']`

```
cat: 'tablet'   ff: 'slate'
d: '2023'   lp: 2299   cp: null
sz: 8.8   res: '2560x1600'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '骁龙8+ Gen1'   sb: '高通'   pr: '4nm'   cpu: '八核'   gpu: null   an: null
rt: null   ft: null   ram: [12,16]   rom: [256,512]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 6550   bw: null   bwl: 0   br: null
os: 'Android 13'   ui: 'ZUI'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 348   bm: null   ip: null   bio: null   spk: '双扬声器'   port: '双 USB-C'   col: '钛晶灰'
pen: '不支持官方手写笔'   kbd: null   cell: '无蜂窝版'
```
- 联想知识库：骁龙8+ / 8.8" / 12+256=2299 / 16+512=2699
- 来源：https://www.lenovo.com.cn/wiki/tablet_phone/page/49.html

#### 111. 联想小新 Pad Pro 12.7（2023）｜ id：`lenovo-xiaoxin-pad-pro-127` ｜ tags：`['平板','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2023'   lp: 1599   cp: 1499
sz: 12.7   res: '2944x1840'   ppi: null   mat: 'LCD'   rr: 120   nit: null   dim: null   hdr: null
soc: '骁龙870'   sb: '高通'   pr: '7nm'   cpu: '八核'   gpu: null   an: null
rt: null   ft: null   ram: [8]   rom: [128,256]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10200   bw: null   bwl: 0   br: null
os: 'Android 13'   ui: 'ZUI 15'   net: 'Wi-Fi'   wf: 'Wi-Fi 6'   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 620   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: '鸽子灰'
pen: '支持 小新触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 联想知识库：8+128=1599 / 8+256=1799。ZOL 在售 ¥1499
- 来源：https://www.lenovo.com.cn/wiki/tablet_phone/page/49.html 、https://detail.zol.com.cn/tablepc/lenovo/guangzhou/good.html

#### 112. 联想小新 Pad Pro 12.7（2025 款）｜ id：`lenovo-xiaoxin-pad-pro-127-2025` ｜ tags：`['平板','大屏','长续航']`

```
cat: 'tablet'   ff: 'slate'
d: '2024-10'   lp: 1599   cp: 1444
sz: 12.7   res: '2944x1840'   ppi: null   mat: 'LCD'   rr: 144   nit: null   dim: null   hdr: null
soc: '天玑8300'   sb: '联发科'   pr: '4nm'   cpu: null   gpu: null   an: null
rt: null   ft: null   ram: [8,12]   rom: [128,256]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: 10200   bw: null   bwl: 0   br: null
os: 'Android'   ui: 'ZUI'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: null   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: '支持 小新触控笔，不随附'   kbd: '支持 官方键盘，不随附'   cell: '无蜂窝版'
```
- 2024-10 上市（命名「2025 款」）。天猫/淘宝在售 1294~1739（补贴价）
- 来源：https://detail.zol.com.cn/tablepc/lenovo/guangzhou/good.html 、https://s.click.taobao.com/t?e=m%3D2%26s%3DGbc9IeaiXIdw4vFB6t2Z2ueEDrYVVa64XoO8tOebS%2BdRAdhuF14FMTLZ48WAJzZRRitN3%2FurF3ybBjBh3LodcDtMDMUFdHxsEga%2Bn4dNFSFW2RGh2%2FLyNYVwhIsr1DlAgb9ZeSZXs4qU4UvmTtMCYI3dQecC4NUeOemaFM5tHHZ4CTHdso7N%2B96uf%2BrFHWySKLc8H5I6GryObetPibSrY6SpJwfkvp8axWFqUiGZj7e4YfIEY1ZZNrVkEXHDb6J4ecTX9L0NYFW6BGkbcaeVJmM4qaqZgBqShxPS0W69lpKAenUVNk7Ws8YMXU3NNCg%2F

#### 113. 联想小新 Pad Plus（11 英寸）｜ id：`lenovo-xiaoxin-pad-plus` ｜ tags：`['平板','入门']`

```
cat: 'tablet'   ff: 'slate'
d: '2022'   lp: 1499   cp: null
sz: 11   res: '2000x1200'   ppi: null   mat: 'LCD（莱茵TUV低蓝光认证）'   rr: 60   nit: null   dim: null   hdr: null
soc: null   sb: null   pr: null   cpu: '八核'   gpu: null   an: null
rt: null   ft: null   ram: [6]   rom: [128]
cm: null   cw: null   ct: null   cz: null   cv: null   fc: null
bc: null   bw: null   bwl: 0   br: null
os: 'Android 11'   ui: 'ZUI 12.5'   net: 'Wi-Fi'   wf: null   bt: null   nfc: false   ir: false   sat: null
bdim: null   wt: 520   bm: null   ip: null   bio: null   spk: '四扬声器'   port: 'USB-C'   col: null
pen: null   kbd: null   cell: '无蜂窝版'
```
- ZOL：11 英寸 / 6+128 / 520g / ZUI 12.5 / ¥1499。**芯片型号与电池未查到**
- 来源：https://detail.zol.com.cn/tablepc/lenovo/guangzhou/good.html

---

## I. 明确「不收录 / 未查到」清单（12 项）

| 机型 / 系列 | 状态与原因 |
|---|---|
| 三星 Galaxy Tab S8 / S8+ / S8 Ultra、Tab S7、Tab S6 系列 | **2022 年及更早发布**，超出「2023-2026 主流在售」窗口，且国行官方规格页已下线，本轮未收录。如需补齐请告知，我再单独跑一轮 |
| 微软 Surface Pro（第 11 版 / Snapdragon X Elite） | 二合一形态（`ff: 'detachable'`），国行在售但**本轮未取到可逐项核实的官方规格页**（屏幕/电池/重量口径与国内平板不一致），暂不收录。需要的话我下一轮专项补 |
| 步步高学习平板 / 酷比魔方 / 台电 | 学习平板与小厂白牌平板，官方规格页缺失、参数口径混乱（大量电商页互相抄错），**本轮不收录**。如产品要覆盖学习平板赛道，请先明确是否接受「电商页参数 + 低可信度标记」 |
| 联想 ThinkPad X12 Detachable | 二合一形态，国行渠道价格与规格信息本轮未查到 |
| 华为 MatePad Pro 12.6（2021） | 2021 发布，超出窗口，未收录 |
| 小米平板 5 Pro 5G 版 / 平板 5 Pro 12.4 键盘套装版 | 同机型的不同配置，按「蜂窝版/套装版不拆条」原则合并进主条目 |
| 一加平板 2 Pro 5G 版（若有） | 本轮未检索到国行 5G 版，按无蜂窝版处理 |
| 荣耀平板 GT NFC 版 / 非 NFC 版 | 同款不同配件版本，合并；如需区分请告知 |
| 三星 Tab S10 FE / FE+ 的 5G 版 | 按「蜂窝版不拆条」原则合并，5G 版内存组合差异用 `ram`/`rom` 数组表达 |
| 各机型的「柔光版 / PaperMatte 版」 | 屏幕涂层差异，价格差 200~1200 元。**建议**按独立机型录入（因为屏幕参数与价格都变了），本轮未全部展开，需要的话我补一轮 |
| iPad Pro M4 13 英寸国行首发价 | 只查到中国台湾 NT$45,900 起，国行价未查到，`lp` 保持 null |
| 各机型 2026 年下半年新品的详细参数（荣耀平板 X10 / 平板 20、vivo Pad6 Pro、REDMI K Pad 2、iQOO Pad5e 等） | 只查到官方起售价，详细规格未查到，按「有价格 + 大量 null」录入，已在各条备注标明 |

---

## J. 遗留问题（需要团队拍板 / 我可继续补）

1. **Apple 全系 `bc` 为 null 会漏判「长续航」标签。** 苹果只公布 Wh（28.65~40.88Wh），不公布 mAh。建议：
   - 方案 A：给 iPad 单独维护一张「型号 → 等效 mAh」映射表（业界通用换算：Wh ÷ 3.82V × 1000，例如 31.29Wh ≈ 8180mAh），但这是**估算值**，与安卓的官方 mAh 口径不可直接比较；
   - 方案 B：iPad 不参与 `long-battery` 派生，改用 `tags` 手工标注。
   我倾向 **方案 B**（不制造假精度）。请架构师定。

2. **`lp` 缺失较多（约 30 条）**，集中在：iPad Air M2/M3、iPad Pro M4 13"、荣耀平板 9/10、OPPO Pad 2/3 Pro/5 Pro、一加平板/2/2 Pro/3 Pro、vivo Pad3/3 Pro/Air/Pad2、iQOO Pad/Pad5、三星 Tab S10 Ultra/S10+/S9 FE/S9 FE+/A9/A9+ 的国行首发价。这些都是 2023-2024 年的老机型，苹果/三星官网已下架。**要不要我用「电商历史价 / 媒体首发报道」补齐？** 补齐后可信度会低于官方价，需要标记。

3. **「柔光版 / PaperMatte 版」是否算独立机型？** 华为 MatePad Pro 12（标准版 5999 / PaperMatte 7199）、小米平板 9（柔光版 +500）、荣耀平板 9 Pro（护眼版 +200）。屏幕参数与价格都不同，我倾向**算独立机型**，但需要多一轮调研（约 +10~15 条）。

4. **联想拯救者 Y700 2024 款与 2025 款的命名有冲突**：ZOL 把「Y700 2025」的上市时间标为 2024 年，联想知识库把「Y700 2023」标为骁龙 8+。我在文件里按「2023 款=骁龙8+ / 2024 款 / 2025 款=骁龙8 Gen3」处理，但 2024 款的芯片没查到。**建议由工程师在录入时二次确认**，或直接把 2024 款这一条删掉（它完整度太低）。

5. **`spk` 字段格式**：我统一写成「N 扬声器（XX）」，如果前端要做「扬声器数量 ≥6」的筛选，需要正则提取数字。要不要改成独立数值字段 `spkCount`？请架构师定。

6. **蜂窝版拆分**：我的建议是**不拆**（理由见文首第 5 节）。若架构师坚持拆，我按 `<id>-cellular` 后缀补一轮，预计新增 30+ 条。

---

## K. 给工程师的录入建议

1. **优先录入顺序**：小米/REDMI（22，参数最全）→ 荣耀（14）→ 三星（13）→ 华为（17）→ OPPO/一加（11）→ vivo/iQOO（12）→ Apple（18）→ 联想（6）。
   Apple 放后面是因为它 `bc`/`ram`/`rom` 口径特殊、且价格缺失较多，先跑通安卓平板的字段映射再处理 Apple 更省事。
2. **新增文件建议**：`src/data/phones/tablets.ts`（或按品牌拆 `tablet-apple.ts` / `tablet-android.ts`），全部带 `cat: 'tablet'`。
3. **`src/data/prices.ts`**：本文件里所有 `cp` 都是 2026-10 的电商在售价，可直接作为 `jd` / `pdd` 参考价的种子数据（注意国补价波动，建议 `isReference: true`）。
4. **对比表分区**：强烈建议按 `cat` 分「手机 / 平板」两个对比表，或至少在平板上不做「重量/尺寸」的跨品类排序——平板 450g 在手机里是最重的一档，在平板里是最轻的一档，混排会误导用户。



