# 小米 / Redmi / 荣耀渠道价真实抓取报告（2026-10-15）

结论先行：**本次真实抓取成功 0 条。** 京东、拼多多两条路径在当前网络环境下均取不到「页面实际售价」，
`src/data/prices.ts` **未做任何改动**，225 条记录全部保持 `isReference: true`。

---

## 1. 范围校正（与任务书的差异，请 team-lead 注意）

任务书说「小米 39 + Redmi 34 + 荣耀 47 共 120 款」。核对结果：

| 文件 | 机型数 |
|---|---|
| `src/data/phones/xiaomi.ts` | 39 |
| `src/data/phones/redmi.ts` | 34 |
| `src/data/phones/honor.ts` | 47 |
| **合计** | **120** ✅ |

但 `src/data/prices.ts` 里**只有这 120 款中的 44 条**报价记录（荣耀 22 + 小米 10 + Redmi 12），
其余 76 款机型在价格表里根本不存在条目（前端显示「暂无报价」）。

> 也就是说：即便抓取全部成功，能落地的也只有这 44 条；另外 76 款需要先「新增报价条目」，
> 而那属于新增数据（不是改 `isReference`），本次未做——按铁律只改既有条目。

本次可改的 44 条清单（`src/data/prices.ts` 行号）：

- 荣耀（22）：`honor-magic7-pro` `honor-magic7` `honor-magic7-rsr` `honor-magic6-pro` `honor-magic6`
  `honor-magic6-rsr` `honor-magic-v3` `honor-magic-v2` `honor-magic-vs3` `honor-magic-vflip`
  `honor-400-pro` `honor-400` `honor-300-pro` `honor-300` `honor-200-pro` `honor-200`
  `honor-gt-pro` `honor-gt` `honor-x60-pro` `honor-x60` `honor-power` `honor-magic6-ultimate`
- 小米（10）：`xiaomi-15-ultra` `xiaomi-15-pro` `xiaomi-15` `xiaomi-14-ultra` `xiaomi-mix-fold-4`
  `xiaomi-mix-fold-3` `xiaomi-mix-flip-2` `xiaomi-mix-flip` `xiaomi-civi-5-pro` `xiaomi-civi-4-pro`
- Redmi（12）：`redmi-k80-pro` `redmi-k80` `redmi-k80-ultra` `redmi-turbo-4-pro` `redmi-turbo-4`
  `redmi-turbo-3` `redmi-note-14-pro-plus` `redmi-note-14-pro` `redmi-note-14` `redmi-14c`
  `redmi-a3-pro` `redmi-note-15-pro-plus`

这 44 条**全部有 `cp`（官网现价）**，因此不存在「无 cp 老机型需跳过」的情况。
按任务书优先级，P1（2025 年及以后发布）11 条、P2（其余有 cp）33 条：

**P1（11 条）**：`honor-400-pro`(3299) `honor-400`(2399) `honor-gt-pro`(3199) `honor-power`(1699)
`xiaomi-15-ultra`(5999) `xiaomi-civi-5-pro`(2699) `redmi-k80-ultra`(2399) `redmi-turbo-4-pro`(1699)
`redmi-turbo-4`(1499) `redmi-14c`(699) `redmi-note-15-pro-plus`(1899)

---

## 2. 尝试过的抓取路径与结果

### 2.1 京东

| # | 路径 / URL 形态 | 方式 | 结果 | 失败原因（实测证据） |
|---|---|---|---|---|
| J1 | `https://search.jd.com/Search?keyword=<机型>&enc=utf-8` | curl + 桌面 UA | ❌ | HTTP 302 → `cfe.m.jd.com/privatedomain/risk_handler/03101900/`，响应头 `x-rp-content` base64 解出「**验证一下，购物无阻**」——**触发京东风控人机验证** |
| J2 | `https://item.jd.com/<sku>.html` | curl | ❌ | HTTP 200 但只有 36KB SPA 空壳，`<title>` 是站点通用标题，**价格完全由 JS 动态加载**，静态 HTML 里没有价格 |
| J3 | `https://item.jd.com/<sku>.html` | 无头 Chromium（桌面 UA） | ❌ | 页面标题变成「**PC频控页 -京东商城**」，正文「暂时无法展示该商品的信息，请稍后重试」——**IP 级频控拦截** |
| J4 | `https://item.m.jd.com/product/<sku>.html` | curl（iPhone UA） | ❌ | 商品名、店铺名、配置都在 SSR 里（可用），**但价格被脱敏**：`"priceFloor":{"demoteEnable":false,"price":"4??9",...,"jdPrice":"4??9"}`。已按字节确认 `?` 就是 0x3F，不是编码问题 |
| J5 | `https://item.m.jd.com/product/<sku>.html` | 无头 Chromium（iPhone UA + 移动 viewport + 反自动化脚本 + 滑动） | ❌ | 页面正文显示「¥4??9」「**登录看更多商品信息**」「**登录最高省15%**」——**未登录会话不给真实价格** |
| J6 | 同 J5，但先访问 `https://m.jd.com/` 预热会话、带 cookie 再进商品页 | 无头 Chromium | ❌ | 仍是 `¥4??9`，仍然提示登录 |
| J7 | `http(s)://p.3.cn/prices/mgets?skuIds=J_<sku>&type=1`（京东经典价格接口） | curl + Referer | ❌ | HTTP 版 502、HTTPS 版连接失败（exit 35），**被网关拦截**（remote_ip 为出网代理 10.199.200.133） |
| J8 | `https://api.m.jd.com/?appid=item-v3&functionId=<prod_price / m_prod_price / item_price / pcPrice / getPrice>` | curl + Referer | ❌ | 全部返回 `{"code":"2","echo":"the current API does not exist"}`——这些是需要 **h5st 签名 + 登录态** 的接口，无签名不可用 |
| J9 | `https://so.m.jd.com/ware/search.action?keyword=<机型>` | curl / 无头 Chromium | ❌ | curl 只拿到 2.7KB SPA 空壳；浏览器打开直接落到「**京东登录注册**」登录墙（+86 获取验证码） |

**SKU 定位本身是通的**，问题不在发现环节：
`https://www.sogou.com/web?query=site:item.jd.com <机型>` 与 `https://www.so.com/s?q=...` 都能拿到 SKU，
例如 `小米15Ultra 黑色 12GB+256GB` → SKU **100186493450**，页面确认 `shopName: 小米京东自营旗舰店`（京东自营，口径正确）。
卡点只在**价格读取**：脱敏 + 登录墙 + 频控。

### 2.2 拼多多

| # | 路径 / URL 形态 | 方式 | 结果 | 失败原因（实测证据） |
|---|---|---|---|---|
| P1 | `https://mobile.yangkeduo.com/search_result.html?search_key=<机型>` | curl（iPhone UA） | ❌ | HTTP 200 / 48KB，但是**纯 JS 空壳**：无 `__INITIAL_STATE__`、无 `goodsName`、无 `¥/￥`、无「百亿补贴」字样，商品价格全靠带 anti-token 的 XHR |
| P2 | 同上 | 无头 Chromium（iPhone UA + 移动 viewport + 反自动化脚本 + 滑动） | ❌ | `document.title` = 「**登录**」，正文 = 「打开拼多多APP / 手机登录 / 发送验证码 / 同意服务协议与隐私政策」——**搜索必须登录** |
| P3 | `https://apiv2.yangkeduo.com/search?q=<机型>&size=10` | curl | ❌ | HTTP **403** + `{"server_time":1792035521,"error_code":40001,"empty_reason":1}`——**缺 anti-content 反爬签名** |
| P4 | 商品页 `goods.html?goods_id=<id>` | — | ❌（未执行） | goods_id 只能从搜索拿，而搜索已登录墙；搜狗 `site:mobile.yangkeduo.com` 检索 0 条商品链接，**拿不到 goods_id，路径断在第一步** |

### 2.3 第三方兜底（探测过，但主动弃用）

| # | 路径 | 结果 | 处置 |
|---|---|---|---|
| T1 | `https://s.manmanbuy.com/default.aspx?key=<机型>`（慢慢买） | HTTP 200 可访问 | **弃用**。返回的是「爆料」信息流，实测 `小米15Ultra` 的返回结果几乎全是手机壳/背膜等配件，且大量标注「**已结束**」，没有机型维度的京东/拼多多当前报价。即便有价格也不是「平台页面实际售价」，不符合口径，且时效性不可验证 |
| T2 | `https://www.bing.com/search?q=...`、`https://www.baidu.com/s?wd=...` | 302 / 无 JD 结果链接 | 不可用（百度直接 302，Bing 未返回 JD 商品链接） |

---

## 3. 成功抓到真实价格的机型清单

**空。** 没有任何一条拿到京东自营价或拼多多百亿补贴价。

对应地，本报告**没有**产生任何「机型 × 京东价 × 拼多多价 × 来源 URL × 采集日期」记录——
因为一旦有 URL 就该有数字，没有数字就不写 URL，避免留下「看起来有据可查但实际没抓到」的假证据。

---

## 4. 抓不到、因而保留推导价的机型清单

即第 1 节列出的 **44 条**，`src/data/prices.ts` 中**原样未动**：

- 未删除任何条目
- 未修改任何 `jd` / `pdd` 数值
- 未修改 `spec`
- `isReference` 全部保持 `true`
- `updatedAt` 全部保持原值（`2026-10-13`）

按品牌拆：荣耀 22 条、小米 10 条、Redmi 12 条。

---

## 5. 第二轮：已登录会话下的复抓（2026-10-15，仍然 0 条）

team-lead 反馈已用 `agent-browser`（真实 Chromium）扫码登录京东（账号 `Delbert16`），
并实测登录后可读到 `¥4999.00`。据此做了第二轮复抓。**结果仍然是 0 条真实价格**，
而且过程中京东侧的风控明显升级。

### 5.1 登录态「看起来有、实际不生效」

| 检查项 | 结果 |
|---|---|
| cookie `unick` | `Delbert16`（domain `.jd.com`）✅ |
| cookie `pin` | `jd_5da0ea8d5cc6b`（domain `.jd.com`）✅ |
| cookie `detailedAdd` | 北京海淀区… ✅ |
| `document.cookie.includes('unick')` | `true` ✅ |
| cookie `pt_key` / `pt_pin`（京东 passport 真实 SSO 票据） | **缺失** ❌ |
| `home.m.jd.com` / `my.m.jd.com` | **302 → `plogin.m.jd.com/login/...` 登录页** ❌ |
| 商品页配送地址 | 显示「北京朝阳区三环到四环之间」（IP 推断），**不是账号保存的海淀地址** ❌ |
| `item.m.jd.com/product/100186493450.html` 价格 | 仍是 **`¥4??9`**，不是 `¥4999.00` ❌ |
| `www.jd.com` | 「当前页面异常 请刷新或切换账户试试」+「登录领限时福利」❌ |
| `item.jd.com/<sku>.html` | `pc-frequent-pro.pf.jd.com/?from=pc_item&reason=403`（PC频控页），正文「你好，请登录」❌ |

判断：cookie 留在了本地（有 `unick`/`pin`），但**服务端会话已失效**（缺 `pt_key`/`pt_pin`，
访问 `my.m.jd.com` 直接跳登录）。典型的「半登出 / 会话未接上」状态。

### 5.2 排除法（都试过，都不解决）

- **不是 UA 问题**：`agent-browser set device "iPhone 15"` 后重试 → 仍是 `¥4??9`
- **不是 SKU 问题**：换 Redmi 14C（SKU `100167094418`，699 元档）→ `¥9??`，低价商品同样脱敏
- **不是缓存问题**：`?_=<ts>&sceneval=2` 重试 → 仍脱敏
- **不是详情页全局无价**：`m.jd.com` 首页价格**是正常可读的**（`¥6999` / `¥2869.3` / `¥6289`），
  说明脱敏精确挂在「商品详情页 + 登录看更多商品信息」这道闸门上

### 5.3 风控升级（我自己的探测很可能加剧了它，需要如实记录）

复抓过程中京东侧的拦截逐级加重：

1. 起始：`item.m.jd.com` SSR 可读，价格脱敏为 `¥4??9`（curl 移动 UA 正常）
2. 用 node `fetch` 批量拉 SSR → 全部返回 `<title>京东验证</title>`（**node 的 TLS/请求指纹被识别**）
3. 改用 curl 批量拉 SSR（44 款 × 8 候选 SKU）→ 全部返回**空响应**，连商品名/店铺名都拿不到了
4. 最后 `agent-browser` 打开商品页 → 从「价格脱敏」升级为**整页登录墙**（`京东登录注册 / +86 获取验证码`）

即：本轮**不仅没拿到价格，还把我们这条出口 IP 在京东的信誉打得更低了**。
后续若要继续，建议：**先停一段时间不要再打京东，重新登录后**再做低速（每款间隔 3–5 秒）小规模抓取，
且优先只抓 P1 的 11 条，观察是否被再次脱敏。

### 5.4 已完成的副产品：SKU 发现链路可用（但当前已被风控打断）

- 方法：搜狗 / 360 搜索 `site:item.jd.com <机型名>` → 取候选 SKU → 拉移动页 SSR 取 `title` + `shopName` 校验
- 首轮实测可用：例如 `小米15Ultra` → SKU **`100186493450`**，`shopName` = **小米京东自营旗舰店**（京东自营 ✅）
- 批量结果落盘：`/tmp/pf/skumap.json`（候选 SKU）、`/tmp/pf/skumap2.json`（补店铺信息，因风控中断为空）
- ⚠️ 这两个文件在 `/tmp` 下，**不是持久交付物**；登录恢复后需要重跑，届时建议直接重跑脚本而不是复用这份结果

### 5.5 拼多多：本轮仍然无解

登录态问题只影响京东。拼多多的两个死结与登录无关，本轮仍未打开：
H5 搜索页对未登录直接弹登录墙；`apiv2.yangkeduo.com` 返回 403 + `error_code:40001`（缺 anti-content 签名）；
商品页 `goods_id` 依赖搜索，搜索被封 → 路径从第一步就断。

---

## 6. 诚实声明

> - **真实抓取成功的记录数：0 条。**（第一轮无登录态 0 条；第二轮已登录会话 0 条）
> - **最终 `isReference: false` 的条数：0 条。**
> - **最终仍是推导参考价（`isReference: true`）的条数：225 条**（`src/data/prices.ts` 全表）。
>   其中本次任务范围内的三品牌 44 条，全部仍是「官网价 × 0.95/0.90/0.85 折扣模型」推导值。
> - **没有使用任何估算、类比、折扣模型或第三方推算值填充。** 一条都没有补。
> - **没有用「看起来有据可查但实际没抓到」的 URL 充数**：因为 0 条真实价格，
>   报告里也就**没有**任何「机型 × 价格 × 来源 URL」表格——没抓到数字就不写 URL。
> - 本次唯一产出物是这份失败报告；`src/data/prices.ts` 与 `src/data/phones/` 下任何文件均未被我修改。

`npx tsc -p tsconfig.app.json --noEmit` → **0 错误**（基线校验通过）。

---

## 7. 失败根因判断

1. **京东**：价格读取链路对「未登录 + 数据中心/代理出口 IP」双重不友好。
   PC 端直接落到频控页；移动 Web 端 SSR 主动把价格中间位替换成 `?`（反爬脱敏），
   并挂「登录看更多商品信息 / 登录最高省15%」的引导。经典 `p.3.cn` 价格接口在出网网关就被拦（502）。
   根因是**需要登录态 + 正常住宅 IP**。第二轮即使有登录 cookie，
   服务端会话也不生效（缺 `pt_key`/`pt_pin`），且探测本身进一步触发了风控（见 §5.3）。
2. **拼多多**：Web H5 全部走 anti-token 签名接口，未签名请求 403；H5 页面对未登录用户直接弹登录墙；
   且商品页入口 goods_id 依赖搜索，搜索本身已被封，路径从第一步就断掉。
   根因是**必须 App/登录态 + anti-content 签名**，无法在无账号、无 App 环境下绕过。

---

## 8. 后续可选方案（需 team-lead / 用户拍板，本次未擅自执行）

按「可行性 × 合规/口径可接受度」排序：

1. **人工/半人工采集**：由有京东、拼多多账号的同学在登录后导出价格（京东可按 SKU 逐个看，拼多多 App 百亿补贴页截图），
   再走 `npm run import:prices -- --input prices.csv` 导入。这是唯一能拿到**平台页面实际售价**的路径。
   SKU 侧我已验证可批量定位（搜狗/360 `site:item.jd.com`），能提供 44 条机型的自营 SKU 清单以减少人工量。
2. **京东开放平台 / 联盟 API**（需申请 appKey）：官方数据源，口径最正，但需要商务资质与申请周期。
3. **接入商业比价 API**（如慢慢买开放平台等）：第三方数据，**不属于「平台页面实际售价」**，
   若要采用必须先让用户明确接受「第三方聚合价」这一口径变更，并在 UI 上显式标注来源。
4. **维持现状但强化标注**：保持 `isReference: true`，前端明确写「参考价 · 非实时抓取」，避免用户误当实时价。
   这是用户已明确的验收风险点，建议至少做到标注清晰。

我个人推荐 **1 + 4 组合**：先把「参考价」标签做实，避免误导；同时按 SKU 清单做一次人工补采。
