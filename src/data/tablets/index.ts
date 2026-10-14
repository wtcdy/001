import type { Device } from '../../types/device';

import { APPLE_TABLETS } from './apple';
import { HONOR_TABLETS } from './honor';
import { HUAWEI_TABLETS } from './huawei';
import { LENOVO_TABLETS } from './lenovo';
import { ONEPLUS_TABLETS, OPPO_TABLETS } from './oppo';
import { SAMSUNG_TABLETS } from './samsung';
import { VIVO_TABLETS } from './vivo';
import { REDMI_TABLETS, XIAOMI_TABLETS } from './xiaomi';

/**
 * 平板数据源总入口（T03b）。
 *
 * 与 `src/data/phones/` 同构：按品牌分文件、统一用 `c()` 工厂产出 `Device`。
 * 每条平板都必须显式写 `cat: 'tablet'` + `ff`（`slate` / `detachable`），
 * 缺失 `cat` 会被 `validate:data` 拦下；`ff` 不做尺寸推导（见 `src/types/device.ts` 注释）。
 *
 * 口径约定：
 *  - **蜂窝版与 Wi-Fi 版算同一款机型**，只在 `tb.cellular` 上标 `true`，不拆成两条；
 *  - 扬声器数量同时写 `spk`（展示串，形如「8 扬声器（HiFi 级）」）与 `tb.speakerCount`（数值，供派生筛选）；
 *  - 手写笔 / 键盘 / 桌面模式 / microSD 一律走 `tb` 扩展块，不另起短键。
 */

/** 按品牌分组的平板数据 */
export const TABLETS_BY_BRAND: Record<string, Device[]> = {
  Apple: APPLE_TABLETS,
  华为: HUAWEI_TABLETS,
  小米: XIAOMI_TABLETS,
  Redmi: REDMI_TABLETS,
  荣耀: HONOR_TABLETS,
  OPPO: OPPO_TABLETS,
  一加: ONEPLUS_TABLETS,
  vivo: VIVO_TABLETS,
  三星: SAMSUNG_TABLETS,
  联想: LENOVO_TABLETS,
};

/** 汇总后的全部平板 */
export const ALL_TABLETS: Device[] = [
  APPLE_TABLETS,
  HUAWEI_TABLETS,
  XIAOMI_TABLETS,
  REDMI_TABLETS,
  HONOR_TABLETS,
  OPPO_TABLETS,
  ONEPLUS_TABLETS,
  VIVO_TABLETS,
  SAMSUNG_TABLETS,
  LENOVO_TABLETS,
].flat();

export {
  APPLE_TABLETS,
  HUAWEI_TABLETS,
  XIAOMI_TABLETS,
  REDMI_TABLETS,
  HONOR_TABLETS,
  OPPO_TABLETS,
  ONEPLUS_TABLETS,
  VIVO_TABLETS,
  SAMSUNG_TABLETS,
  LENOVO_TABLETS,
};
