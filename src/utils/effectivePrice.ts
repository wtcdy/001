import { dealOfPhone } from '../data/prices';
import type { Phone } from '../types/phone';

/**
 * 价格「口径」函数：机型的有效价。
 *
 * 规则：优先国补后到手价 → 没有渠道报价时回落到参考现价 / 首发价。
 * 价格筛选、排序与 `PRICE_BOUNDS` 都必须使用这一个函数，
 * 否则会出现「滑块边界按首发价算、过滤按到手价算」导致边界机型被悄悄筛掉的问题。
 *
 * 为什么不放进 `src/data/prices.ts`：
 * 该文件会被 `npm run import:prices` **整文件重新生成**，口径函数写在里面时，
 * 只要脚本模板漏掉一个导出，`PRICE_BOUNDS` 在模块初始化阶段就会取不到函数而编译失败。
 * 价格口径属于「规则」而不是「数据」，因此独立于数据文件存在。
 */
export function effectivePriceOf(phone: Phone): number | null {
  const deal = dealOfPhone(phone);
  if (deal.finalPrice !== null) return deal.finalPrice;
  const price = phone.currentPrice ?? phone.launchPrice ?? null;
  return typeof price === 'number' && price > 0 ? price : null;
}
