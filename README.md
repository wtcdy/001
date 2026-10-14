# 全网手机参数对比工具

对标「懂车帝车型对比」交互的**纯静态手机参数对比 Web 应用**。零后端、零数据库，构建产物可直接部署到 GitHub Pages / 任意静态托管。

- 机型库：搜索 + 多维筛选 + 卡片网格，最多勾选 4 款进入对比
- 对比页：首列固定、分组折叠、**只看不同**、差异高亮（更优=红/橙，更差=绿/灰）、一键复制分享链接
- 数据：455 款机型（近 3~5 年主流在售/经典机型），全部为纯前端 TypeScript 数据文件，无网络请求、无外链图片

---

## 一、技术栈

| 项目 | 选型 | 说明 |
| --- | --- | --- |
| 构建 | Vite 5 | `base: './'`，支持任意子路径部署 |
| 框架 | React 18 + TypeScript（strict） | 仅使用 Hooks，无 Redux |
| 路由 | react-router-dom 6 **HashRouter** | 适配 GitHub Pages 子路径 |
| 样式 | Tailwind CSS 3（`darkMode: 'class'`） | 所有组件手搓，未引入 MUI 等组件库 |
| 图标 | lucide-react | 纯 SVG 图标 |
| 部署 | GitHub Actions → GitHub Pages | `.github/workflows/deploy.yml` |

## 二、本地运行

需要 Node.js ≥ 18（本项目在 Node 22.12 下验证通过）。

```bash
npm install

npm run dev        # 本地开发（默认 http://localhost:5173）
npm run build      # 类型检查 + 生产构建，产物在 dist/
npm run preview    # 本地预览 dist/ 构建产物
npm run typecheck  # 仅类型检查（分别检查 tsconfig.app.json 与 tsconfig.node.json）
npm run lint       # ESLint 检查
npm test           # Vitest 单元测试（jsdom）
npm run validate:data  # 机型数据自检（数量 / 重复 id / 字段违规）
npm run validate:prices # 报价数据自检（重复 key / 未知 id / 越界 / 国补边界对拍）
npm run import:prices -- --input ./prices.csv  # 导入渠道报价（京东 / 拼多多百亿补贴）
```

> 若使用指定 Node 版本：
> `export PATH="/Users/<user>/.workbuddy/binaries/node/versions/22.12.0/bin:$PATH"`

## 三、功能说明

### 1. 机型库页（`/`）

- **搜索**：机型名 / 品牌 / 处理器 / 标签关键词模糊匹配
- **筛选**：品牌多选、发布年份、处理器厂商、价格区间、屏幕尺寸区间、电池容量区间，以及 IP68 / 无线充电 / NFC 三个开关
- **排序**：最新发布、发布时间升序、价格升/降序、电池容量降序、名称升序
- **卡片**：品牌首字色块头像（CSS 生成，**不依赖任何外部图片**），展示处理器 / 屏幕尺寸 / 电池 / 发布时间
- **价格**：京东自营价 / 拼多多百亿补贴价并排展示（**价低者高亮**），下方突出显示**国补后到手价**与「省 ¥xxx」；超 6000 元提示「超出国补范围」；未收录报价的机型显示「暂无报价」，不臆造价格
- **选择**：最多 4 款，超出时弹出浮层 Toast（移动端可见，无需 hover）；底部浮出对比条，可直接开始对比或移除

### 2. 对比页（`/compare?ids=a,b,c`）

- 首列参数名**横向滚动时固定**
- 9 个参数分组（基础信息 / 屏幕 / 性能 / 存储 / 影像 / 前置 / 电池与充电 / 系统与网络 / 机身），可折叠
- **基础信息组**新增「京东自营价」「拼多多百亿补贴价」「国补后到手价」三行，均为数值型、价低为优，参与差异高亮与最优/最弱标记
- **只看不同**：隐藏所有机型取值完全一致的行。
  注意：**「缺失」也是一个可比较取值** ——「A 有潜望长焦、B 没有」会被判为差异并保留展示，
  只有所有机型取值（含缺失状态）完全一致的行才会被隐藏
- **差异高亮**：以出现次数最多的取值为基准，其余标为差异；数值型参数（价格、电池、充电功率、跑分、重量、屏幕尺寸等）额外计算最优/最差
  - 更优 → <span>红色系（优）</span>
  - 更差 → <span>绿色系（弱）</span>
  - 仅不同但无优劣 → 琥珀色描边
  - 缺失值统一显示「—」
- **换机型**：点击任一列的「换机型」按钮，在弹窗中搜索并替换
- **复制分享链接**：URL 形如 `#/compare?ids=iphone-16-pro-max,xiaomi-15-ultra`
- 选择状态同时写入 URL 与 `localStorage`，刷新/分享后自动还原

### 3. 主题

默认浅色，右上角一键切换深/浅色，选择持久化在 `localStorage`；首次访问跟随系统偏好。

## 四、目录结构

```
.
├── index.html                     # 入口（含主题首屏防闪烁脚本）
├── package.json
├── vite.config.ts                 # base: './'
├── tailwind.config.js             # brand / better / worse 自定义色板
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── .eslintrc.cjs
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── scripts/
│   ├── fetch-phones.mjs           # 数据维护脚本（适配器模式）
│   ├── import-prices.mjs          # 渠道报价导入脚本（CSV / JSON）
│   └── adapters/
│       ├── csv.mjs                # 本地 CSV 导入示例
│       └── json.mjs               # 本地 JSON 导入示例
└── src/
    ├── main.tsx
    ├── App.tsx                    # HashRouter + Shell + 路由
    ├── constants.ts               # REPO_URL / DATA_UPDATED_AT / SUBSIDY_POLICY 等常量
    ├── index.css                  # Tailwind 指令 + .psc-* 组件类
    ├── __tests__/                 # Vitest 单元测试（jsdom）
    ├── utils/price.ts             # computeDeal()：渠道低价 + 国补计算（纯函数）
    ├── types/phone.ts             # Phone / PriceRecord / SpecRow / SpecGroup 等类型
    ├── data/
    │   ├── specGroups.ts          # 9 个参数分组定义 + computeRowDiff()
    │   ├── prices.ts              # 渠道报价表（与参数数据解耦、可独立更新）
    │   ├── index.ts               # 汇总、去重校验、派生筛选项
    │   └── phones/                # 按品牌拆分的数据文件
    │       ├── _factory.ts        # PhoneSeed / CompactSeed 工厂
    │       ├── apple.ts  huawei.ts  honor.ts  xiaomi.ts  redmi.ts
    │       ├── oppo.ts   oneplus.ts realme.ts vivo.ts    iqoo.ts
    │       ├── samsung.ts meizu.ts  nubia.ts  motorola.ts sony.ts
    │       └── others.ts          # Google / Nothing / 中兴 / 华硕 / 其他
    ├── hooks/
    │   ├── useTheme.ts            # 主题持久化
    │   ├── useCompare.ts          # 选择状态（URL + localStorage 双向同步）
    │   └── useFilters.ts          # 筛选与排序
    ├── components/
    │   ├── BrandAvatar.tsx        # CSS 生成品牌色块头像
    │   ├── PhoneCard.tsx
    │   ├── FilterPanel.tsx
    │   ├── CompareBar.tsx
    │   ├── SpecTable.tsx
    │   ├── ThemeToggle.tsx
    │   └── EmptyState.tsx
    └── pages/
        ├── LibraryPage.tsx
        └── ComparePage.tsx
```

## 五、数据维护

### 手动维护（推荐）

在 `src/data/phones/<brand>.ts` 中追加条目即可。精简格式（CompactSeed）示例：

```ts
import { c, type CompactSeed } from './_factory';

const SEEDS: CompactSeed[] = [
  {
    i: 'xiaomi-15-ultra',      // id（全局唯一，英文 slug）
    n: '小米 15 Ultra',        // 机型名
    d: '2025-03',              // 发布时间 YYYY-MM
    lp: 6499, cp: 6499,        // 首发价 / 参考现价
    sz: 6.73, res: '3200x1440', ppi: 522, mat: 'OLED LTPO', rr: 120,
    soc: '骁龙8 Elite', sb: '高通', an: 3000000,
    ram: [12, 16], rom: [256, 512, 1024],
    cm: '5000万像素 索尼LYT-900 F1.63 OIS',
    fc: '3200万像素',
    bc: 6000, bw: 90, bwl: 80,
    os: 'Android 15', ui: '澎湃OS 2',
    nfc: true, ir: true,
    wt: 226, ip: 'IP68',
    tags: ['影像旗舰'],
  },
];

export const XIAOMI_PHONES = c('小米', SEEDS);
```

**字段不确定的一律留空（不写即 `null`），前端渲染为「—」，请勿臆造精确数值。**

新增品牌后需在 `src/data/index.ts` 中 import 并加入 `PHONES_BY_BRAND` / `ALL_PHONES`。

### 脚本导入

```bash
npm run fetch -- --adapter csv  --input ./my-phones.csv  --brand 小米
npm run fetch -- --adapter json --input ./my-phones.json --merge --dry-run
```

参数说明：

| 参数 | 说明 |
| --- | --- |
| `--adapter` | 适配器名，对应 `scripts/adapters/<name>.mjs`，内置 `csv` / `json` |
| `--input` | 本地数据文件路径 |
| `--brand` | 数据未标注品牌列时的兜底品牌 |
| `--merge` | 与已有品牌文件按 id 去重（默认开启，传 `--merge false` 关闭） |
| `--overwrite` | 允许覆盖已存在的品牌文件 |
| `--dry-run` | 只解析与校验，不写文件 |

> **安全策略**：目标品牌文件已存在时脚本**不会覆盖**，而是写入 `<brand>-imported.ts`，由人工确认后再合并，避免误删既有数据。确需覆盖请显式加 `--overwrite`。
> 由于机型名多为中文，自动生成的 id 可能不可读，建议数据里直接提供 `id` 列（英文 slug）。

内置适配器**只读取本地文件**，不做任何网络请求。自定义适配器需导出 `default`，实现 `async load(options)` 并返回记录数组：

```js
const adapter = {
  name: 'my-adapter',
  description: '说明',
  async load({ input, userAgent, rateLimitMs, sleep }) {
    // return [{ 机型名, 品牌, 发布时间, 处理器, ... }, ...]
  },
};
export default adapter;
```

支持的列名（中英文均可）见 `scripts/fetch-phones.mjs` 的 `mapRecordToPhone`。

### 渠道价格与国补（独立维护）

价格与参数**解耦**：参数在 `src/data/phones/*.ts`，价格在 `src/data/prices.ts`，两者可分别更新。

```ts
export interface PriceRecord {
  jd: number | null;       // 京东自营价（元）
  pdd: number | null;      // 拼多多百亿补贴价（元）
  updatedAt: string;       // 报价采集日期 YYYY-MM-DD
  isReference?: boolean;   // 是否内置兜底参考价
}
```

- **覆盖范围**：只收录近 2-3 年仍在售的热门机型（当前 235 款），其余机型显示「暂无报价」；已下架/停产的老机型**不臆造价格**。
- **内置数据性质**：仓库内置的报价为「参考现价 + 渠道折扣模型」推导的**兜底参考值**（`isReference: true`），不是平台实时抓取值，请用下面的导入脚本替换成真实采集数据。

**国补规则**（依据：发改环资〔2025〕1745 号 + 商务部等 5 部门 2026 年数码产品购新补贴通知）：

| 项 | 值 |
| --- | --- |
| 适用品类 | 手机 / 平板 / 智能手表(手环) / 智能眼镜 |
| 价格门槛 | 单件销售价格 **≤ 6000 元** |
| 补贴比例 | 扣除优惠后最终销售价格 × **15%** |
| 单件上限 | **500 元**（每人每类 1 件） |

规则集中配置在 `src/constants.ts` 的 `SUBSIDY_POLICY`（政策会变，改常量即可，业务代码不散落魔法数字）。

**计算顺序**（`src/utils/price.ts` 的 `computeDeal()`，纯函数、有单测）：
先取两个渠道的低价（相等时优先拼多多）→ 再按低价计算补贴 → `min(低价 × 15%, 500)` → 到手价 = 低价 − 补贴。
金额统一保留到**分**，计算与展示使用同一个舍入结果。

**筛选 / 排序口径**（`src/utils/effectivePrice.ts` 的 `effectivePriceOf()`）：
有渠道报价的机型按**国补后到手价**，其余机型只能回落到**参考现价 / 首发价（未计国补）**。
价格滑块与排序共用这一个函数（页面上也标注了该口径），避免出现「边界按一种价算、过滤按另一种价算」的偏差。
注意：这意味着未收录报价的机型在价格排序里会系统性偏高（没有减掉补贴），这是已知取舍，见「已知限制」。

**导入真实报价**：

```bash
npm run import:prices -- --input ./prices.csv                 # 输出 prices-imported.ts
npm run import:prices -- --input ./prices.csv --overwrite     # 覆盖 src/data/prices.ts
npm run import:prices -- --input ./prices.json --dry-run      # 只校验不写入
```

| 参数 | 说明 |
| --- | --- |
| `--input` | 本地 CSV / JSON 文件路径（脚本**只读取本地文件**，不做任何网络请求） |
| `--updatedAt` | 采集日期，缺省为今天 |
| `--reference` | 导入的数据标记 `isReference: true`（真实抓取数据不要加） |
| `--overwrite` | 允许覆盖已有的 `src/data/prices.ts` |
| `--dry-run` | 只解析与校验，不写文件 |

列名别名（大小写不敏感）：`机型ID / id`、`京东自营价 / jd`、`拼多多百亿补贴价 / pdd`，可选 `更新日期 / updatedAt`、`是否参考价 / isReference`。

校验规则：**id 必须存在于机型库**（否则警告并跳过，绝不静默写入脏数据）；价格必须为正数且落在 300~20000 元，非法值置空并提示；两渠道都无有效值时整条跳过。安全写入策略与机型数据一致——目标文件已存在时默认写入 `prices-imported.ts`，只有显式 `--overwrite` 才覆盖。

> **免责**：价格为公开渠道参考价，实际以平台页面为准；国补资格与金额以当地政策为准。

## 六、部署（GitHub Pages）

1. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
2. 推送到 `main` 分支，`.github/workflows/deploy.yml` 会自动 `npm ci && npm run build` 并发布 `dist/`
3. 若仓库名不是 `<username>.github.io`，访问路径为 `https://<username>.github.io/<repo>/`——本项目已使用 `HashRouter` + `base: './'`，子路径可直接访问

## 七、数据来源与合规声明

- 数据为**公开参数的整理汇总**（厂商官网 / 发布会公开信息 / 公开评测），用于个人学习与交流，不构成购买建议。
- 价格、跑分、重量等会随批次、渠道、测试环境变化，**存在误差属正常现象**；不确定的字段统一留空显示「—」。
- 页面底部保留免责声明，请勿移除。
- 采集脚本合规要求（详见 `scripts/fetch-phones.mjs` 头部注释）：
  1. 仅用于个人学习与自有数据维护，禁止商业用途；
  2. 必须遵守目标站点 `robots.txt` 与服务条款，尊重数据版权；
  3. 内置限速 ≥ 1000ms/请求，且使用自定义可识别 UA；
  4. 不得内置登录、绕过反爬/风控或规避访问限制的逻辑；
  5. 不包含针对任何具体商业站点的结构性抓取规则（不写死 DOM 选择器 / 接口）。

## 八、已知限制

- 数据为静态快照，不随厂商调价/发布实时更新；
- 渠道报价当前覆盖 235 款热门机型（其余显示「暂无报价」），内置值为参考价而非实时抓取值，可用 `npm run import:prices` 替换；
- 国补按「渠道低价 ≤ 6000 元、15%、单件封顶 500 元」计算，实际资格与金额以当地政策为准；
- 价格筛选/排序对**未收录报价**的机型回落到参考现价（未计国补），这类机型在价格升序里会系统性偏高；补录渠道报价即可消除；
- 安兔兔跑分为公开评测区间中值，仅供横向参考；
- 单页最多对比 4 款机型（与主流对比工具一致）；
- 构建产物为单 chunk，实测约 533 kB（gzip 后约 114 kB），已足够单页应用使用。
