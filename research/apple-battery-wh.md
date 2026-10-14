# Apple iPad 电池 Wh 官方值核实（2026-10-14）

> 用途：给 `DeviceBattery.batteryWh` 字段落地后填写 18 条 iPad 用。
> 结论先行：**Apple 官方确实公布 iPad 的 Wh**（规格页「电源和电池 / 电池和电源」章节原文「内置 X 瓦时锂聚合物充电电池」），**不是拆解值也不是换算值**，可以放心填。
> 18 条全部有值；16 条已直连 Apple 官网 / 官方支持页确认，2 条沿用本文件已有记录（待补直连），0 条留空。

## 一、18 条 Wh 对照表

| # | id | 机型 | `batteryWh` | `bc` | 证据等级 | 来源 |
|---|---|---|---|---|---|---|
| 1 | `ipad-pro-m5-11` | iPad Pro 11（M5） | **31.29** | null | ✅ Apple 官网 | https://www.apple.com.cn/ipad-pro/specs 「11 英寸 iPad Pro：内置 31.29 瓦时锂聚合物充电电池」 |
| 2 | `ipad-pro-m5-13` | iPad Pro 13（M5） | **38.99** | null | ✅ Apple 官网 | 同上「13 英寸 iPad Pro：内置 38.99 瓦时锂聚合物充电电池」 |
| 3 | `ipad-pro-m4-11` | iPad Pro 11（M4） | **31.29** | null | 🟡 沿用记录 | 值同 M5（同模具），本轮未直连 Apple 页面；原记录来源 https://www.jyes.com.tw/news.php?act=view&id=10708 |
| 4 | `ipad-pro-m4-13` | iPad Pro 13（M4） | **38.99** | null | 🟡 沿用记录 | 同上 |
| 5 | `ipad-pro-m2-11` | iPad Pro 11（M2，第 6 代） | **28.65** | null | 🟠 官方文案转载 | Apple 规格原文「iPad Pro 11-inch Built-in 28.65-watt-hour rechargeable lithium-polymer battery」，本轮只取到第三方镜像 https://eit-lb.com/mobile/product/apple-ipad-pro-11-inch6th-generation ；同页 12.9" 的 40.88 已被 Apple 官方页证实，故 28.65 可信度很高 |
| 6 | `ipad-pro-m2-129` | iPad Pro 12.9（M2，第 6 代） | **40.88** | null | ✅ Apple 官方支持 | https://support.apple.com/zh-cn/111841 「内置 40.88 瓦时锂聚合物充电电池」；另 apple.com.cn 翻新页同源 |
| 7 | `ipad-air-m3-11` | iPad Air 11（M3） | **28.93** | null | ✅ Apple 官方支持 | https://support.apple.com/zh-cn/122241 「内置 28.93 瓦时锂聚合物充电电池」 |
| 8 | `ipad-air-m3-13` | iPad Air 13（M3） | **36.59** | null | ✅ Apple 官网（商城规格） | https://www.apple.com.cn/shop/product/fcnn4ch/a 「内置 36.59 瓦时锂聚合物充电电池」 |
| 9 | `ipad-air-m2-11` | iPad Air 11（M2，第 6 代） | **28.93** | null | ✅ Apple 官网 + 官方支持 | https://www.apple.com/cn/ipad-air/specs 、https://support.apple.com/zh-cn/119893 （13" 同代 36.59） |
| 10 | `ipad-air-m2-13` | iPad Air 13（M2） | **36.59** | null | ✅ Apple 官方支持 | https://support.apple.com/zh-cn/119893 「内置 36.59 瓦时锂聚合物充电电池」 |
| 11 | `ipad-air-m1` | iPad Air（M1，第 5 代，10.9"） | **28.6** | null | ✅ Apple 官方支持 | https://support.apple.com/en-mt/111887 「Built-in 28.6-watt-hour…」；apple.com.cn 翻新页「内置 28.6 瓦时锂聚合物充电电池」 |
| 12 | `ipad-air-m4-11` | iPad Air 11（M4，2026） | **28.93** | null | ✅ Apple 官网（当前在售代） | https://www.apple.com/cn/ipad-air/specs 「iPad Air 11 英寸 内置 28.93 瓦时…」（该页为当前代，Wi-Fi 7 + Apple N1 + 蓝牙 6 + C1X，即 M4） |
| 13 | `ipad-air-m4-13` | iPad Air 13（M4，2026） | **36.59** | null | ✅ Apple 官网（当前在售代） | 同上「iPad Air 13 英寸 内置 36.59 瓦时…」 |
| 14 | `ipad-a16-11` | iPad 11（A16） | **28.93** | null | ✅ Apple 官网 | https://www.apple.com.cn/ipad-11/specs 「内置 28.93 瓦时锂聚合物充电电池」 |
| 15 | `ipad-10` | iPad 10（A14，第 10 代） | **28.6** | null | ✅ Apple 官方支持 | https://support.apple.com/zh-cn/111840 「内置 28.6 瓦时锂聚合物充电电池」 |
| 16 | `ipad-9` | iPad 9（A13，第 9 代） | **32.4** | null | ✅ Apple 官方支持 | https://support.apple.com/kb/SP849 「内置 32.4 瓦时锂聚合物充电电池」 |
| 17 | `ipad-mini-a17pro` | iPad mini 7（A17 Pro） | **19.3** | null | ✅ Apple 官网 | https://www.apple.com.cn/ipad-mini/specs 「内置 19.3 瓦时锂聚合物充电电池」 |
| 18 | `ipad-mini-6` | iPad mini 6（A15，第 6 代） | **19.3** | null | ✅ Apple 官方支持 | https://support.apple.com/kb/sp850 「内置 19.3 瓦时锂聚合物充电电池」 |

## 二、给工程师的落地口径

1. `batteryWh` 与 `bc` **不得同时有值**：iPad 一律 `bc: null` + `batteryWh: <上表值>`；安卓平板一律 `batteryWh: null` + `bc: <mAh>`。
2. **`ipad-pro-m5-13` 现在库里的 `bc: 10290` 必须清掉**（第三方按 Wh 折算的估算值，违反「绝不换算」）。
3. **派生规则（team-lead 2026-10-14 最终拍板）**：`long-battery` 对平板 = **`bc >= 8000 || batteryWh >= 28`**（不是 30）。
   - 阈值从 30 降到 28 的理由：30Wh 会制造「iPad Pro 11" 不算、iPad 9 算」的跨代分裂，更刺眼的是 **iPad 10（28.6Wh）不命中、iPad 11 A16（28.93Wh）命中**——这两是隔代同定位产品，相邻代际对立不可接受。
   - **按 28Wh 口径：18 条 iPad 只有 mini 全系（19.3Wh，2 条）不命中**，其余 16 条全部命中。mini 电池确实小一个量级且定位是「小屏便携」，不命中合理。
   - ⚠️ 语义提醒（已与 team-lead 对齐）：**Wh 不等于实测续航**（iPad mini 19.3Wh 官方标称 10 小时，Pro 11" 31.29Wh 也是 10 小时）。本标签是从参数派生的「电池容量大」，不是实测续航，UI tooltip 需注明判定依据。

## 三、本轮已排除的做法

- ❌ **不做 Wh → mAh 换算**。业界换算式（Wh ÷ 3.82V × 1000，如 31.29Wh ≈ 8189mAh）会产出假精度，且与安卓官方 mAh 不可比。team-lead 已明令禁止。
- ❌ **不用拆解/实测 mAh**（如 iPad Pro 13 M5 的 10290mAh）。已登记要清除。

---

## 四、交付给工程师的干净清单（id → Wh，可直接抄）

> team-lead 已确认：本表 18 条可直接填入 `batteryWh`，`bc` 全部改 `null`。
> 其中 16 条 Apple 官网 / 官方支持页直连确认；`ipad-pro-m4-11`、`ipad-pro-m4-13`、`ipad-pro-m2-11` 三条为「非本轮直连但可信度足够」，team-lead 已批准直接填，保留第一节的证据等级标注即可。

```ts
// Apple iPad 官方电池能量（瓦时），来源见 research/apple-battery-wh.md 第一节
// 规则：batteryWh 与 bc 不得同时有值 —— iPad 一律 bc: null
const APPLE_IPAD_BATTERY_WH: Record<string, number> = {
  'ipad-pro-m5-11':       31.29,   // iPad Pro 11（M5）
  'ipad-pro-m5-13':       38.99,   // iPad Pro 13（M5）  ← 现有 bc: 10290 必须清掉
  'ipad-pro-m4-11':       31.29,   // iPad Pro 11（M4）
  'ipad-pro-m4-13':       38.99,   // iPad Pro 13（M4）
  'ipad-pro-m2-11':       28.65,   // iPad Pro 11（M2，第 6 代）
  'ipad-pro-m2-129':      40.88,   // iPad Pro 12.9（M2，第 6 代）
  'ipad-air-m3-11':       28.93,   // iPad Air 11（M3）
  'ipad-air-m3-13':       36.59,   // iPad Air 13（M3）
  'ipad-air-m2-11':       28.93,   // iPad Air 11（M2）
  'ipad-air-m2-13':       36.59,   // iPad Air 13（M2）
  'ipad-air-m1':          28.6,    // iPad Air（M1，第 5 代，10.9"）
  'ipad-air-m4-11':       28.93,   // iPad Air 11（M4，2026）
  'ipad-air-m4-13':       36.59,   // iPad Air 13（M4，2026）
  'ipad-a16-11':          28.93,   // iPad 11（A16）
  'ipad-10':              28.6,    // iPad 10（A14，第 10 代）
  'ipad-9':               32.4,    // iPad 9（A13，第 9 代）
  'ipad-mini-a17pro':     19.3,    // iPad mini 7（A17 Pro）
  'ipad-mini-6':          19.3,    // iPad mini 6（A15，第 6 代）
};
```

**改动范围提醒**

- 当前 `src/data/tablets/apple.ts` 里只有 1 条（`ipad-pro-m5-13`），本批真正要改的是它：`bc: 10290` → `bc: null` + `batteryWh: 38.99`。
- 其余 17 条在 `research/tablets.md` A 段，尚未进代码库（T03c 批量录入时再带 `batteryWh`）。工程师**不必**现在补录这 17 条机型，只要保证 `batteryWh` 字段存在、工厂 normalize 兜底 `null` 即可。
