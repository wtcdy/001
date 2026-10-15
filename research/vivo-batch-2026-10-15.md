# vivo / iQOO 品牌参数整包补齐（2026-10-15）

## 一、任务范围

- 文件：`src/data/phones/vivo.ts`（51 款）、`src/data/phones/iqoo.ts`（42 款）
- 数据源优先级：**vivo/iQOO 官网规格参数页 `vivo.com.cn/vivo/param/<型号>` > 官网营销页（仅交叉核对）**
- 只改上述两个文件，未触碰其他品牌。

## 二、官网参数页 URL 规律（本轮全部验证有效）

| 机型 | param 页 URL | 设备型号 |
|---|---|---|
| vivo X300 | vivo.com.cn/vivo/param/x300 | V2509A |
| vivo X300 Pro | vivo.com.cn/vivo/param/x300pro | V2502A / V2502DA（卫星通信版） |
| vivo X300s | vivo.com.cn/vivo/param/x300s | V2548A |
| vivo X300 Ultra | vivo.com.cn/vivo/param/x300ultra | V2547A / V2547DA |
| vivo X500 | vivo.com.cn/vivo/param/x500 | V2609A |
| vivo X500 Pro | vivo.com.cn/vivo/param/x500pro | V2608A / V2608DA |
| vivo X500 Pro Max | vivo.com.cn/vivo/param/x500promax | V2602A / V2602DA |
| iQOO Z11 Turbo | vivo.com.cn/vivo/param/iqooz11turbo | V2536A |
| iQOO 16 | vivo.com.cn/vivo/param/iqoo16 | V2606A |

> 注意：商城页 `shop.vivo.com.cn` 无参数表；`/vivo/<型号>/param`（营销页内锚点）与
> `/vivo/param/<型号>`（纯参数页）**是同一页**，后者更干净、字段更全，优先用后者。

## 三、P0 四款逐条（最新旗舰，用户重点关注）

### 1. vivo X300 Pro（`vivo-x300-pro`）
| 字段 | 值 | 来源 |
|---|---|---|
| bdim | `161.98x75.48x7.99mm` | param 页「物理规格」原文（高度161.98/宽度75.48/厚度7.99） |
| wt | 226（g） | param 页「物理规格」原文（重量 226g，单档无分色） |
| nit | 4500 | 官网**营销页**「4500nit 局部峰值亮度」原文（param 页不公布） |
| res | `2800x1260` | param 页「屏幕显示」原文 |
| ppi | 452 | 营销页「452PPI」原文 |
| dim | `2160Hz PWM` | 营销页「2160Hz 全亮度高频 PWM 调光 + 全亮度 DC 调光」原文 |
| hdr | `HDR10+` | param 页「HDR技术：支持」+ 营销页杜比视界（保守取 HDR10+） |
| cpu | `4.21GHz×1+3.5GHz×3+2.7GHz×4` | param 页「CPU主频」原文 |
| rt/ft | `LPDDR5X Ultra 四通道` / `UFS 4.1` | param 页「存储」原文 |
| cz | `3.5倍光变/100倍数字` | param 页「变焦模式：3.5x光学变焦；最大100x数字变焦」原文 |
| fc | `5000万像素` | param 页「前置摄像头像素」原文 |
| wf/bt | `Wi-Fi 7` / `6.0` | param 页「WLAN」「蓝牙协议支持6.0」原文 |
| bio | `3D超声波单点指纹` | param 页「指纹识别」原文（原库内写「屏下指纹」，已更正） |
| spk | `立体声双扬声器` | param 页「音乐与音响：双扬声器」原文 |
| port | `USB-C 3.2` | param 页「USB版本：USB3.2 Gen1」原文 |
| lp | 5299 | param 页「建议零售价」12+256GB 档（原库内 lp 缺失） |

### 2. vivo X500（`vivo-x500`）
| 字段 | 值 | 来源 |
|---|---|---|
| bdim | `157.01x74.49x8.15mm` | param 页「物理规格」原文 |
| wt | 211（g） | param 页「重量」原文：摄夜213g / 大地回声·晴天·晨曦211g，取主流配色 211g |
| nit | 4000 | 营销页「4000nit 20% APL 峰值亮度」原文（param 页不公布） |
| res | `2750x1260` | param 页「屏幕显示」原文（原库内写 `'1.5K'`，非标准，已更正） |
| ppi | 459 | 营销页「459 PPI」原文 |
| cpu/gpu | `4.21GHz×1+3.5GHz×3+2.7GHz×4` / `G1-Ultra` | param 页原文 |
| rt/ft | `LPDDR5X Ultra 四通道` / `UFS 4.1` | param 页原文 |
| cm/cw/ct | 5000万蔡司高动态主摄 / 5000万超广角 / 6400万蔡司APO超级长焦 | param 页「后置摄像头像素」原文 |
| cz | `3.1倍光变/100倍数字` | param 页「3.1x光学变焦；最大100x数字变焦」原文 |
| fc | `5000万像素` | param 页原文 |
| os | `Android 17` | param 页「基于Android 17 开发的OriginOS 7」原文 |
| wf/bt | `Wi-Fi 7` / `6.0` | param 页原文 |
| bio/spk/port | `3D超声波单点指纹` / `立体声双扬声器` / `USB-C 3.2` | param 页原文 |

### 3. vivo X500 Pro（`vivo-x500-pro`）
| 字段 | 值 | 来源 |
|---|---|---|
| bdim | `151.78x71.92x8.12mm` | param 页「物理规格」原文 |
| wt | 197（g） | param 页「重量」原文：摄夜192g / 大地回声·晴天·览霞197g，取主流配色 197g |
| nit | **null（官网未公布）** | 营销页与 param 页均无亮度数值 → 保持 null |
| res | `2660x1216` | param 页「屏幕显示」原文（原库内为 null） |
| rr | 144 | param 页「刷新率：1-144Hz」原文（原库内写 120，已更正） |
| cpu/gpu | `4.55GHz×2+4.35GHz×3+3.1GHz×3` / `Mali-G2-Ultra-NX` | param 页原文 |
| cm/ct | 5000万蔡司云台级主摄 / 6400万蔡司APO超级长焦 | param 页原文（原库内 ct 为 null） |
| cz | `3.5倍光变/100倍数字` | param 页「3.5x光学变焦；最大100x数字变焦」原文 |
| fc/wf/bt | `5000万像素` / `Wi-Fi 7` / `6.0` | param 页原文 |
| os | `Android 17` | param 页原文 |
| bio/spk/port | `3D超声波单点指纹` / `立体声双扬声器` / `USB-C 3.2` | param 页原文 |

### 4. vivo X500 Pro Max（`vivo-x500-pro-max`）
| 字段 | 值 | 来源 |
|---|---|---|
| bdim | `163.32x76.82x8.12mm` | param 页「物理规格」原文 |
| wt | 229（g） | param 页「重量」原文：摄夜225g / 大地回声·晴天·览霞229g，取主流配色 229g |
| nit | **null（官网未公布）** | 营销页与 param 页均无亮度数值 → 保持 null |
| res | `3168x1440` | param 页「屏幕显示」原文（原库内写 `'2K'`，非标准，已更正） |
| rr | 144 | param 页「1-144Hz」原文（原库内写 120，已更正） |
| bw | 90 | param 页「充电规格：最大输出功率90W」原文（原库内为 null） |
| cpu/gpu | `4.55GHz×2+4.35GHz×3+3.1GHz×3` / `Mali-G2-Ultra-NX` | param 页原文 |
| ct | `2亿像素 蔡司APO超级长焦` | param 页原文 |
| cz | `3.5倍光变/100倍数字` | param 页「3.5x光学变焦；最大100x数字变焦」原文 |
| fc/wf/bt | `5000万像素` / `Wi-Fi 7` / `6.0` | param 页原文 |
| os | `Android 17` | param 页原文 |
| sat | `北斗卫星通信（1TB卫星通信版）` | param 页「北斗三号短报文…仅1TB版本机型支持」原文 |
| bio/spk/port | `3D超声波单点指纹` / `立体声双扬声器` / `USB-C 3.2` | param 页原文 |

## 四、P1 其余缺口补齐

| 机型（id） | 补齐字段 | 来源 |
|---|---|---|
| vivo X300（`vivo-x300`） | bdim `150.57x71.92x7.95mm`、hdr `HDR10+`、cpu、rt/ft、fc `5000万像素`、cz 补 `/100倍数字`、wf `Wi-Fi 7`、bt `6.0`、bio `3D超声波单点指纹`、spk `立体声双扬声器`、port `USB-C 3.2`；bdim 原为 `'厚7.95mm'`（非完整三围）已更正 | param/x300 |
| vivo X300s（`vivo-x300s`） | **从仅 3 字段扩为完整条目**：sz 6.78、res `2800x1260`、bc 7100（原已有）、bw 90、bwl 40、bdim `161.98x75.48x8.00mm`、wt 217、lp/cp 5299、soc 天玑9500、cz `3倍光变/100倍数字` 等全量 | param/x300s |
| vivo X300 Ultra（`vivo-x300-ultra`） | **从仅 3 字段扩为完整条目**：sz 6.82、res `3168x1440`、rr 144、bc 6600、bw 100、bwl 40、bdim `162.98x76.81x8.49mm`、wt 237、lp/cp 7499、soc 第五代骁龙8至尊版、cz `3.7倍光变/105倍数字` 等全量 | param/x300ultra |
| iQOO Z11 Turbo（`iqoo-z11-turbo`） | sz 6.59、res `2750x1260`、rr 144、cpu `3.80GHz×2+3.32GHz×6`、gpu Adreno 829、rt/ft、ram/rom、cm `2亿像素大底超级主摄 f/1.88 OIS`、cw `800万像素超广角`、cz `40倍数字`、cv、fc `3200万像素 f/2.2`、bdim `157.61x74.42x8.1mm`、wt 206、os `Android 16`/ui `OriginOS 6`、wf `Wi-Fi 7`、bt `5.4`、bio `3D超声波单点指纹`、spk、port | param/iqooz11turbo |
| iQOO 16（`iqoo-16`） | hdr `HDR10+`、cpu/gpu 补齐、ram/rom 补数组、wf `Wi-Fi 7`、bt `6.0`、col `赛道,传奇,逐光`、bio 补 `+ Face Wake`、spk `立体声双扬声器`；cz 归一为 `100倍数字` | param/iqoo16 |

## 五、P2 变倍 cz 补齐（有潜望长焦、原 cz 缺失或只写光变）

| 机型 | 修正前 | 修正后 | 官网原文 |
|---|---|---|---|
| vivo X300 | `3倍光变` | `3倍光变/100倍数字` | 后置长焦 3x 光学变焦；最大 100x 数字变焦 |
| vivo X300 Pro | null | `3.5倍光变/100倍数字` | 3.5x 光学变焦；最大 100x 数字变焦 |
| vivo X300s | null | `3倍光变/100倍数字` | 3x 光学变焦；最大 100x 数字变焦 |
| vivo X300 Ultra | null | `3.7倍光变/105倍数字` | 3.7x 光学变焦；最大 105x 数字变焦 |
| vivo X500 | null | `3.1倍光变/100倍数字` | 3.1x 光学变焦；最大 100x 数字变焦 |
| vivo X500 Pro | null | `3.5倍光变/100倍数字` | 3.5x 光学变焦；最大 100x 数字变焦 |
| vivo X500 Pro Max | null | `3.5倍光变/100倍数字` | 3.5x 光学变焦；最大 100x 数字变焦 |
| iQOO Z11 Turbo | null | `40倍数字` | 后置主摄支持 40 倍数字变焦（**无光学变焦，主摄裁切**） |

> 口径：光学倍率只认官网「变焦模式」明确写出的「Xx 光学变焦」；数码倍率取「最大 XXx 数字变焦」。
> iQOO Z11 Turbo 无长焦镜头（双摄：主摄+超广角），只有主摄 40 倍数字变焦，**不写光变**。

## 六、修正的历史错误值

| 机型 | 字段 | 错误值（原库内） | 正确值（官网） | 说明 |
|---|---|---|---|---|
| iQOO Z11 Turbo | bc | 5500 | **7600** | 官网 param 页：典型容量 7600mAh（3.74V，28.43Wh） |
| iQOO Z11 Turbo | bw | 120 | **100** | 官网：100W 超快闪充（11V/9.1A） |
| iQOO Z11 Turbo | wt | 190 | **206** | 官网：天光白/沧浪浮光/光晕粉 206g（极夜黑 202g） |
| iQOO Z11 Turbo | soc | `骁龙8 Gen5` | `第五代骁龙8移动平台` | 官网 CPU 型号原文 |
| vivo X300 | bdim | `厚7.95mm` | `150.57x71.92x7.95mm` | 原值非完整三围 |
| vivo X500 | res | `1.5K` | `2750x1260` | 原值非标准分辨率写法 |
| vivo X500 Pro | res | null | `2660x1216` | 补齐 |
| vivo X500 Pro Max | res | `2K` | `3168x1440` | 原值非标准分辨率写法 |
| vivo X500 Pro / Pro Max | rr | 120 | 144 | 官网「1-144Hz」 |
| vivo X500 Pro Max | bw | null | 90 | 官网「最大输出功率 90W」 |

## 七、官网未公布 → 保持 null 清单（绝不编造）

| 机型 | null 字段 | 原因 |
|---|---|---|
| vivo X500 Pro | nit | 营销页与 param 页均无峰值亮度数值 |
| vivo X500 Pro Max | nit | 营销页与 param 页均无峰值亮度数值 |
| vivo X300s | nit、ip | param 页无亮度；param 页与营销页均无 IP 防水等级 |
| vivo X300 Ultra | nit、ip | param 页无亮度；param 页与营销页均无 IP 防水等级 |
| iQOO Z11 Turbo | nit、ip | param 页无亮度；param 页与营销页均无 IP 防水等级 |
| iQOO 16 | nit、ip | param 页无亮度；param 页无 IP 防水等级 |
| 全系 br（反向充电） | — | 官网只写「OTG反向充电：支持」，**从不公布瓦数**，统一为 `'支持 OTG 反向充电'`（沿用 2026-10-14 口径，本轮未改动） |

> 备注：vivo 官网 param 页的「屏幕显示」栏目**固定不含峰值亮度字段**，亮度只在营销页以
> 「XXnit 局部峰值亮度 / XXnit 20% APL 峰值亮度」宣传语出现；防水等级在 param 页完全不存在，
> 仅部分机型的营销页会标注 IP68/IP69（如 X300 Pro、X500 系列）。

## 八、校验结果

```
npx tsc -p tsconfig.app.json --noEmit     → 0 错误
node scripts/_qa-validate.mjs
  完全合规机型：543/644（基线 536，+7）
  必填缺失计数：143（基线 157，-14）
  vivo / iQOO 手机部分：0 条违规
```

- 本轮 vivo 51 款、iQOO 42 款全部通过校验（含区间、必填、脏数据扫描）。
- 剩余 143 条必填缺失全部来自其他品牌与平板（华为/荣耀/OPPO/Redmi/联想平板等），
  不在本次任务范围内。
- 未引入任何新的必填缺失。
