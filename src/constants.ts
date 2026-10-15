/**
 * 全局常量。
 *
 * 集中放置需要随部署环境变化的配置，避免在组件里散落魔法字符串。
 */

import type { DeviceCategory, FormFactor } from './types/device';

/**
 * 项目仓库地址（用于头部 GitHub 入口）。
 *
 * 部署到你自己的仓库后，请把这里改成实际地址，例如：
 *   https://github.com/<your-account>/<your-repo>
 */
export const REPO_URL = 'https://github.com/wtcdy/001';

/**
 * 机型数据的更新日期（YYYY-MM-DD）。
 *
 * 数据集是静态快照，不会自动更新；每次批量维护数据后请同步修改这里，
 * 页脚会展示该日期，方便用户判断数据新鲜度。
 */
export const DATA_UPDATED_AT = '2026-10-13';

/**
 * 分品类的数据更新日期。
 *
 * 各品类数据量与维护节奏不同（手机 455 款、平板 T03 接入、笔记本暂无），
 * 因此按品类分别记录；当前三者同源，接入新品类时只需改对应一项。
 */
export const DATA_UPDATED_BY_CATEGORY: Record<DeviceCategory, string> = {
  phone: DATA_UPDATED_AT,
  tablet: '2026-10-14',
  laptop: DATA_UPDATED_AT,
};

/** 品类定义（顶部品类切换与格式化工具共用，避免中文名散落） */
export interface CategoryDef {
  /** 品类 id */
  id: DeviceCategory;
  /** 中文名 */
  label: string;
  /** 是否已接入数据（未接入的在 UI 上禁用并提示「敬请期待」） */
  enabled: boolean;
}

/** 全部品类（顺序即 UI 展示顺序） */
export const CATEGORIES: CategoryDef[] = [
  { id: 'phone', label: '手机', enabled: true },
  { id: 'tablet', label: '平板', enabled: true },
  { id: 'laptop', label: '笔记本', enabled: false },
];

/**
 * 形态中文名。
 *
 * 单一数据源：`formFactorLabel()`、`CategoryTabs`、筛选 chips 全部读这里，
 * 避免同一形态在不同位置叫法不一致。
 */
export const FORM_FACTOR_LABELS: Record<FormFactor, string> = {
  bar: '直板',
  'fold-h': '横折叠',
  'fold-mid': '中折叠',
  'fold-v': '竖折叠',
  'fold-wide': '阔折叠',
  'fold-triple': '三折叠',
  slate: '纯平板',
  detachable: '可拆卸',
  clamshell: '翻盖笔记本',
};

/**
 * 国家补贴（以旧换新 / 数码产品购新补贴）政策参数。
 *
 * 依据：发改环资〔2025〕1745 号 + 商务部等 5 部门《关于做好 2026 年家电以旧换新、
 * 数码和智能产品购新补贴工作的通知》。政策会随年度调整，因此集中在此处配置，
 * 业务代码一律读这里的常量，不要散落到组件或工具函数里。
 *
 * 关键口径：补贴基数是「扣除各环节优惠后的最终销售价格」，
 * 所以实现上必须**先取渠道低价、再算补贴**。
 */
export const SUBSIDY_POLICY = {
  /** 政策年度 */
  year: 2026,
  /** 可享受补贴的单件销售价格上限（元），超过该价格不享受补贴 */
  priceCeiling: 6000,
  /** 补贴比例 */
  rate: 0.15,
  /** 单件补贴金额上限（元） */
  maxAmount: 500,
  /** 每人每类产品可补贴件数 */
  perPersonPerCategory: 1,
  /** 政策依据（展示给用户的出处） */
  source: '发改环资〔2025〕1745号 / 商务部等5部门2026年通知',
} as const;

/** 价格免责声明（卡片与页脚共用，避免文案不一致） */
export const PRICE_DISCLAIMER =
  '京东自营渠道参考价，对应标注配置（最低配）的版本，实际以平台页面结算价为准；国补资格与金额以当地政策为准。';
