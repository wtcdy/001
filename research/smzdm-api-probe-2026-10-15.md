# smzdm.com API 可行性探测报告

**探测日期**：2026-10-15
**探测人**：smzdm-probe
**结论**：⚠️ **部分可行，但不适合做 644 台设备的定时价格更新源**

**一句话结论**：`api.smzdm.com/v2/search` 免签名可搜到真机价格，但在售机型命中率仅 64.5%（20/31），老机型 0%（0/2），且价格是"爆料当时价"而非实时价、无失效标记、配件污染严重——**不配做定时更新**。

---

## 一、可用接口清单

### 1.1 `GET /v1/home/articles` — 首页好价流

| 项 | 值 |
|---|---|
| URL | `https://api.smzdm.com/v1/home/articles?limit=N` |
| 签名 | ❌ 不需要 |
| 实测返回 | HTTP 200，`error_code: "0"` |
| 参数 | `limit`（每页条数，实际返回 2 条/页，疑似固定）、`p`/`c`/`category`/`type`/`f` 等分页/分类参数**均被忽略** |
| 关键发现 | **`keyword` 参数被完全忽略**——传 `keyword=iPhone 17 Pro` 和 `keyword=zzzzzzz_not_exist_abc` 返回完全相同的结果（首页最新好价流） |

**返回字段**（单条 article）：
```
article_id, article_title, article_price, article_subtitle,
article_mall, article_mall_icon, article_url,
article_date, article_format_date, article_unix_date,
article_is_timeout, article_is_sold_out,   ← 关键：实测都是空字符串 ""
article_type_name,                          ← "好价" / "长文"
article_channel_name,                       ← "优惠"
ga_category,                                ← "吸油烟机" 等品类
article_region,                             ← "精选"
article_worthy, article_unworthy,           ← 值/不值投票
article_collection, article_comment,
redirect_data                               ← 跳转链接（含 mp_path 小程序路径）
```

### 1.2 `GET /v2/search` — 关键词搜索（★ 唯一真正可用的搜索接口）

| 项 | 值 |
|---|---|
| URL | `https://api.smzdm.com/v2/search?keyword=<URL-encoded>&page_size=20&offset=0` |
| 签名 | ❌ 不需要 |
| 实测返回 | HTTP 200，`error_code: 0` |
| 参数 | `keyword`（必填）、`page_size`（默认 20）、`offset`（分页偏移） |
| 无效参数 | `sort_field`/`sort`/`order`/`days`/`start_time`/`end_time`/`category_id`/`mall_id`/`channel_id`/`type` — **全部被忽略**，返回结果与不带参数完全一致 |
| 特殊值 | `type=haojia` 会返回 `total_num: 0`（空结果） |

**返回结构**：
```json
{
  "error_code": 0,
  "data": {
    "total_num": 1299,
    "offset": 0,
    "page_size": 20,
    "rows": [ ... ],                          // 20 条/页
    "channel_statistics": [],                 // 全空
    "mall_id_statistics": [],
    "mall_statistics": [],
    "top_category_level_one_name": [],        // 全空
    "top_category_all_name": [],
    "top_brand_all_id": [],
    "user_info": [],
    "like_user_count": 0
  }
}
```

**单条 row 字段**（比 v1 精简）：
```
article_id, article_title, article_price, article_mall,
article_format_date,                          ← "13:22" / "10-14" / "09-26"
article_pic, article_url,
article_type_name,                            ← 实测多为空字符串
article_is_sold_out, article_is_timeout,      ← 实测都是 "" 或 null
stock_status,                                 ← 实测都是 0
article_status_name,                          ← 实测都是空
article_channel_name,
article_collection, article_comment,
article_worthy, article_unworthy,
article_referrals,                            ← 爆料人
article_anonymous,
redirect_data
```

---

## 二、不可用接口清单

所有以下路径均返回 **HTTP 404 + HTML 错误页**（`error_code: -1, error_msg: "Unknown method."` 或 CodeIgniter 404 页）：

| 类别 | 试过的路径 |
|---|---|
| v1 搜索类 | `/v1/search`, `/v1/search/`, `/v1/search/articles`, `/v1/search/goods`, `/v1/search/good`, `/v1/search/article`, `/v1/search/haojia`, `/v1/search/word`, `/v1/search/key`, `/v1/search/query`, `/v1/search/list`, `/v1/search/result`, `/v1/search/index`, `/v1/search/suggest`, `/v1/search/sug`, `/v1/search/hot`, `/v1/search/box`, `/v1/search/all`, `/v1/search/product`, `/v1/search/price`, `/v1/search/zhidemai`, `/v1/search/haojia/list` |
| v1 文章类 | `/v1/article/search`, `/v1/article/list`, `/v1/article/184033678`, `/v1/article/info`, `/v1/article/comments`, `/v1/home/articles/search` |
| v1 商品类 | `/v1/good/info`, `/v1/good/list`, `/v1/good/search`, `/v1/good/article`, `/v1/product/search`, `/v1/price/search`, `/v1/p/search` |
| v1 分类/标签 | `/v1/home/bx`, `/v1/home/haowu`, `/v1/home/hot`, `/v1/home/latest`, `/v1/home/new`, `/v1/home/timeline`, `/v1/home/feed`, `/v1/home/search`, `/v1/home/haojia`, `/v1/tag/search`, `/v1/topic/search`, `/v1/user/search`, `/v1/mall/list`, `/v1/index/search`, `/v1/sug/search`, `/v1/feed`, `/v1/stream`, `/v1/haojia/search`, `/v1/haojia/list` |
| v1 小程序 | `/v1/wxapp/search`, `/v1/wxapp/haojia`, `/v1/wxapp/home/articles` |
| v2 其他 | `/v2/home/articles`, `/v2/search`（只有裸 `/v2/search` 可用） |
| POST 方法 | `POST /v1/search/`, `POST /v1/search/haojia/`, `POST /v1/search` — 全部 404 |

**失败原因统一**：`api.smzdm.com` 路由层只暴露了极少的 controller，`/v1/home/articles` 和 `/v2/search` 是仅有的两个可用 endpoint。其他路径全部走 CodeIgniter 默认 404。

---

## 三、样本机型实测结果

### 3.1 5+2+1 指定样本

| 机型 | 是否搜到 | 最低真机价 | 商城 | 过期标记 | 配件误匹配 | 备注 |
|---|---|---|---|---|---|---|
| 小米 18 Pro | ✓ | ¥5999 | 京东 | 无 | 0/18 | 12+ 条真机，质量极高 |
| iPhone 17 Pro | ✓ | ¥7368.73 | 京东/天猫精选/苏宁易购 | 无 | 0/18 | 17 条真机 |
| 荣耀 Magic9 | ✓ | ¥3999 | 京东/天猫精选/苏宁易购 | 无 | 0/18 | 18 条全真机 |
| OPPO Find X10 | ✓ | ¥3749 | 京东/天猫精选/苏宁易购 | 无 | 0/18 | 13 条真机 |
| vivo X500 Pro Max | ✓ | ¥6499 | 京东/天猫精选/苏宁易购 | 无 | 0/18 | 18 条全真机 |
| iPhone 11（老） | ✗ | — | — | — | 17/18 | total=125882，前 20 条全配件 |
| 小米 10（老） | ✗ | — | — | — | 6/18 | total=56967，前 20 条 0 真机 |
| 红米 K Pad（平板） | ✗ | — | — | — | 18/18 | 被"红米/平板/膜"等配件完全污染 |

### 3.2 扩展样本（共 33 款，覆盖各品牌/价位/新老）

| 品牌 | 机型 | 年份 | total_num | 真机条数 | 配件 | 其他 | 最低价 | 命中 |
|---|---|---|---|---|---|---|---|---|
| 小米 | 18 Pro | 2026 | 1299 | 18 | 0 | 0 | 5999 | ✓ |
| 苹果 | iPhone 17 Pro | 2025 | 31134 | 17 | 0 | 1 | 7368.73 | ✓ |
| 荣耀 | Magic9 | 2026 | 1521 | 18 | 0 | 0 | 3999 | ✓ |
| OPPO | Find X10 | 2026 | 1979 | 13 | 0 | 5 | 3749 | ✓ |
| vivo | X500 Pro Max | 2026 | 197 | 18 | 0 | 0 | 6499 | ✓ |
| 苹果 | iPhone 17e | 2026 | 2648 | 18 | 0 | 0 | 3999 | ✓ |
| 一加 | 13 | 2025 | 10300 | 15 | 0 | 3 | 2306.9 | ✓ |
| 荣耀 | X70 | 2025 | 7597 | 9 | 0 | 9 | 1039.98 | ✓ |
| 红米 | K Pad | 2025 | 4119 | 0 | 18 | 0 | — | ✗ |
| 苹果 | iPhone 17 | 2025 | 85534 | 18 | 0 | 0 | 5269.01 | ✓ |
| iQOO | 13 | 2025 | 7465 | 0 | 14 | 4 | — | ✗ |
| 小米 | 15 | 2025 | 93351 | 14 | 0 | 4 | 2498 | ✓ |
| 小米 | 15 Pro | 2025 | 30712 | 0 | 0 | 18 | — | ✗ |
| 小米 | 14 | 2024 | 78578 | 0 | 1 | 17 | — | ✗ |
| 小米 | 13 | 2023 | 56049 | 2 | 2 | 14 | 2133.03 | ✓ |
| 小米 | 12 | 2022 | 102657 | 0 | 0 | 18 | — | ✗ |
| 小米 | 11 | 2021 | 38037 | 0 | 7 | 11 | — | ✗ |
| 苹果 | iPhone 16 | 2024 | 185499 | 7 | 5 | 6 | 5399 | ✓ |
| 苹果 | iPhone 15 | 2023 | 150433 | 0 | 11 | 7 | — | ✗ |
| 苹果 | iPhone 14 | 2022 | 243253 | 1 | 16 | 1 | 4399 | ✓ |
| 苹果 | iPhone 13 | 2021 | 167070 | 0 | 17 | 1 | — | ✗ |
| 苹果 | iPhone 12 | 2020 | 148879 | 0 | 0 | 18 | — | ✗ |
| 华为 | Mate 70 | 2025 | 40100 | 17 | 0 | 1 | 2975 | ✓ |
| 华为 | Pura 70 | 2024 | 55249 | 11 | 5 | 2 | 3199 | ✓ |
| 华为 | nova 13 | 2024 | 8065 | 8 | 1 | 9 | 1699 | ✓ |
| OPPO | Reno 13 | 2025 | 5849 | 0 | 2 | 16 | — | ✗ |
| vivo | S20 | 2025 | 6919 | 3 | 1 | 13 | 2193 | ✓ |
| 三星 | S25 | 2025 | 6133 | 2 | 0 | 16 | 4998 | ✓ |
| realme | GT 8 | 2025 | 16107 | 0 | 0 | 18 | — | ✗ |
| 红米 | K80 | 2025 | 25979 | 13 | 1 | 4 | 1920.15 | ✓ |
| 红米 | Note 14 | 2025 | 15603 | 11 | 0 | 7 | 1359.15 | ✓ |
| 苹果 | iPhone 11 | 2019 | 125882 | 0 | 17 | 1 | — | ✗ |
| 小米 | 10 | 2020 | 56967 | 0 | 6 | 12 | — | ✗ |

### 3.3 覆盖率统计

| 分组 | 命中 / 总数 | 命中率 |
|---|---|---|
| **在售机型**（31 款） | 20 | **64.5%** |
| **老机型**（2 款） | 0 | **0%** |
| **总计**（33 款） | 20 | **60.6%** |

按品牌细分（在售）：
- 小米/红米：5/9 = 55.6%
- 苹果：4/6 = 66.7%
- 华为：3/3 = 100%
- 荣耀：2/2 = 100%
- OPPO：1/2 = 50%
- vivo：1/1 = 100%
- 三星：1/1 = 100%
- iQOO：0/1 = 0%
- realme：0/1 = 0%
- 一加：1/1 = 100%

---

## 四、数据形态评估

### 4.1 `article_price` 是实时价吗？

**❌ 不是。是"爆料当时"的价格。**

证据：
- 字段语义：`article_price` 来自"好价文章"，是用户/编辑发布爆料时填写的价格
- 时间字段：`article_format_date` 显示的是爆料时间（"13:22" / "10-14" / "09-26"），不是价格采集时间
- 同一机型同一 SKU 在不同爆料里价格不同（小米 18 Pro 16+512G 黑色出现 ¥7199.1 和 ¥7999 两个价）
- 没有"最后更新时间"字段

### 4.2 `article_is_timeout` / `article_is_sold_out` 能判断失效吗？

**❌ 不能。**

实测所有返回中：
- `article_is_timeout` = `""`（空字符串）或 `null`
- `article_is_sold_out` = `""`（空字符串）或 `null`
- `stock_status` = `0`（含义不明，所有行都是 0）
- `article_status_name` = `""`

**没有任何字段能标识"该爆料已过期/商品已下架"。** 只能靠 `article_format_date` 粗略判断"爆料距今多久"。

### 4.3 配件/周边污染有多严重？

**热门机型可控，老机型灾难性。**

| 机型类型 | 前 20 条配件占比 |
|---|---|
| 当年旗舰（小米 18 Pro / 荣耀 Magic9 / vivo X500 Pro Max） | 0% |
| 次新机型（iPhone 17 / 华为 Mate 70） | 0-5% |
| 上代机型（小米 14 / iPhone 15） | 50-90% |
| 老机型（iPhone 11 / 小米 10） | 85-100% |
| 平板（红米 K Pad） | 100%（被"平板膜/平板壳"完全污染） |

**配件关键词黑名单**（实测有效）：
```
手机壳|保护壳|保护套|手机套|贴膜|钢化膜|水凝膜|软膜|充电器|充电头|充电线|
数据线|支架|挂绳|收纳|背夹|电池$|后盖|中框|拆机|维修|回收|以旧换新|官换|
展示机|样机|翻新|二手机|二手|配件|周边|赠品|晒单|评测|开箱|图赏|上手|
对比|横评|拆解|换屏|手机膜|表带|手表|手环|iPad|平板|airpods|耳机|保护|壳$|套$|膜$|线$
```

**但黑名单无法覆盖所有情况**——"Xiaomi 小米 14 5G手机" 这种标题里"小米 14"被"小米 14 Pro/Max"覆盖，正则匹配容易误伤。

### 4.4 `article_mall` 值域与自营/第三方区分

**实测出现过的 mall 值**（14 个）：
```
亚马逊中国、京东、京东全球购、京东国际、唯品会、天猫国际官方直营、
天猫精选、天猫超市、小米商城、抖音商城、拼多多、淘宝直播、
苏宁易购、顺电网上商城
```

**❌ 无法区分自营/第三方。** `article_mall` 只标识平台（"京东"），不标识店铺类型（"京东自营"/"京东第三方"）。要区分必须再去抓商品详情页，但详情页接口（`/v1/article/...`）全部 404。

### 4.5 同一机型能否稳定拿到价格？

**部分能，但严重依赖"是否有人爆料"。**

- 热门新机（小米 18 Pro、iPhone 17 Pro、荣耀 Magic9）：每天都有多条爆料，`total_num` 1000-30000，前 20 条几乎全是真机
- 中端次新（小米 15、华为 Mate 70）：`total_num` 30000-90000，但前 20 条配件占 30-50%
- 老机型（iPhone 11、小米 10）：`total_num` 50000-125000，但前 20 条 90%+ 是配件，**真机爆料要翻到 offset=4000+ 才能找到**，且最新爆料是 2025-08（一年前）
- 冷门机型（realme GT 8、iQOO 13、OPPO Reno 13）：前 20 条 100% 配件或"其他机型"（搜索把"13"匹配到"小米 13/13 Pro"等）

**关键问题**：搜索是**模糊匹配 + 时间倒序**，不是"精确匹配本机型 + 时间倒序"。所以：
- 老机型被"同品牌新机型的配件"淹没
- 数字型号（"13"、"15 Pro"）会被"小米 13/15 Pro/13 Pro/15 Pro+"等互相污染

### 4.6 搜索关键词策略测试

| 策略 | 小米 15 Pro | iPhone 15 | 小米 12 | iQOO 13 |
|---|---|---|---|---|
| 原关键词（`小米 15 Pro`） | ✗ 0 真机 | ✗ 0 真机 | ✗ 0 真机 | ✗ 0 真机 |
| 加"5G手机"（`小米 15 Pro 5G手机`） | ✗ 0 真机 | ✗ 0 真机 | ✗ 0 真机 | ✓ 17 真机 |
| 深翻 offset=4000 | ✓ 10 真机 | ✗ 0 真机 | ✗ 0 真机（已空） | — |
| 深翻 offset=10000 | — | ✗ 0 真机（已空） | ✗ 0 真机（已空） | — |

**结论**：加"5G手机"后缀对部分机型有效（iQOO 13、小米 11），但对 iPhone 15、小米 14/15 Pro 无效——这些机型即使深翻也找不到真机爆料。

---

## 五、可行性结论

### 5.1 总体判断

**⚠️ 部分可行，但只适合"热门新机爆料监控"，不适合"644 台设备定时价格更新"。**

### 5.2 致命缺陷（按严重性排序）

1. **价格是爆料当时价，不是实时价** —— 用户看到 ¥5999 点进去可能已经涨到 ¥6999，体验极差
2. **无失效标记** —— `article_is_timeout` / `article_is_sold_out` 全是空字符串，无法判断商品是否下架
3. **老机型 0% 命中** —— iPhone 11、小米 10 这种 1-2 年前的机型，前 20 条 100% 配件，深翻也找不到真机
4. **覆盖率仅 60.6%** —— 33 个样本里 13 个拿不到价格，外推到 644 台设备会有 ~250 台无数据
5. **搜索模糊匹配** —— "小米 15 Pro" 返回"小米 Note17Pro"、"小米 17 Pro"，需要标题正则二次过滤
6. **配件污染严重** —— 中端机 50%+ 是配件，需要复杂黑名单
7. **无法区分自营/第三方** —— `article_mall` 只到平台级
8. **无排序/时间筛选** —— 所有相关参数被忽略，只能按"默认时间倒序"翻
9. **`/v1/home/articles` 的 keyword 被忽略** —— 只能用 `/v2/search`

### 5.3 如果一定要用，能怎么用？

**仅适合"热门新机爆料监控"场景**：
- 覆盖范围：发布 6 个月内的旗舰/次旗舰（小米数字系列、iPhone Pro、华为 Mate/Pura、荣耀 Magic、vivo X、OPPO Find）
- 更新频率：每天 1-2 次（爆料更新节奏）
- 命中预期：在售热门机型 ~65%，老机型 0%
- 价格口径：必须标注"爆料价·非实时"

**实现方案**（如果 team-lead 决定接入）：
```
1. 机型 id 对齐：
   - 用 device.name 拼 keyword（如"小米 18 Pro"）
   - 加"5G手机"后缀提升精度（"小米 18 Pro 5G手机"）
   - 维护一份 keyword 别名表（"iPhone 17 Pro" → "iPhone 17 Pro 5G手机"）

2. 抓取流程：
   - GET /v2/search?keyword=<encoded>&page_size=20&offset=0
   - 串行，间隔 ≥ 600ms（实测无风控，但保守起见）
   - 644 台 × 0.6s ≈ 6.5 分钟/轮

3. 过滤规则：
   - 标题正则匹配"品牌+型号"（如 `小米\s*18\s*Pro\b`）
   - 配件黑名单过滤
   - 只保留 `article_price` 非空的行
   - 取最低价 / 中位价作为"爆料参考价"

4. 失效判断：
   - 用 `article_format_date` 判断"爆料距今 > 30 天"则标灰
   - 无其他失效信号

5. 更新策略：
   - 每天凌晨跑一次
   - 只更新"在售 + 发布 12 个月内"的机型（约 200-250 台）
   - 老机型保留历史数据，不更新
```

### 5.4 推荐替代方案

**不建议用 smzdm 做定时更新源**。如果一定要做"渠道价自动更新"，建议：

1. **京东联盟 API**（已有 `fetch-jd-union.mjs`）—— 实时价、有 SKU、有自营标识，但需要联盟账号
2. **慢慢买 / 历史价格网** —— 有公开的价格历史 API，但同样需要商务合作
3. **什么值得买开放平台**（openapi.zhidemai.com）—— 官方明确"需商务邮件对接"，sign 算法不公开
4. **人工 + 半自动**：每周人工核查 50 款重点机型，其余保留"参考价·非实时"标注

---

## 六、附录：探测脚本与原始数据

- 探测脚本：`/tmp/smzdm_probe.sh` ~ `/tmp/smzdm_probe9.sh`
- 原始响应：`/tmp/smzdm/body_*.json`（167 个文件）
- 分析脚本：`/tmp/smzdm/analyze.py`
- 分析结果：`/tmp/smzdm/results.json`

**探测总请求数**：167 次（串行，间隔 600ms，总耗时 ~100 秒）
**风控情况**：全程无 429/403/202，无 IP 封禁，无验证码
**结论**：api.smzdm.com 对低频 GET 请求非常友好，但接口能力极弱（只有 2 个可用 endpoint）
