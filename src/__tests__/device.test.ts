import { describe, expect, it } from 'vitest';

import type { FormFactor } from '../types/device';
import type { SpecRow } from '../types/phone';

import { c, mk } from '../data/_factory';
import { LAPTOP_SPEC_GROUPS } from '../data/laptopSpecGroups';
import {
  ALL_DEVICES,
  ALL_PHONES,
  BOUNDS_BY_CATEGORY,
  BRANDS_BY_CATEGORY,
  DEVICE_MAP,
  DUPLICATE_IDS,
  FORM_FACTOR_COUNTS_BY_CATEGORY,
  FORM_FACTORS_BY_CATEGORY,
  PHONE_MAP,
  PRICE_BOUNDS,
} from '../data';
import { SPEC_GROUPS, shouldRenderRow } from '../data/specGroups';
import {
  categoryLabel,
  formatBattery,
  formatWeight,
  formFactorLabel,
} from '../utils/deviceFormat';

/**
 * T01 品类抽象基础设施。
 *
 * 核心验收：455 条手机数据零改动、116 项既有测试零改动的前提下，
 * `Device` 落地且平板 / 笔记本扩展位可用。
 */
describe('品类抽象（T01）', () => {
  it('① 老 CompactSeed（无 cat/ff）仍产出 phone + bar', () => {
    const [device] = c('测试品牌', [{ i: 'legacy-seed', n: '老数据', d: '2024-01' }]);
    expect(device.category).toBe('phone');
    expect(device.formFactor).toBe('bar');
    expect(device.tablet).toBeNull();
    expect(device.laptop).toBeNull();
  });

  it('② ALL_DEVICES 与 ALL_PHONES 同为 455 条且索引齐全', () => {
    expect(ALL_DEVICES.length).toBe(455);
    expect(ALL_PHONES.length).toBe(455);
    expect(Object.keys(DEVICE_MAP).length).toBe(455);
    expect(Object.keys(PHONE_MAP).length).toBe(455);
  });

  it('③ 跨品类 id 无重复', () => {
    expect(DUPLICATE_IDS).toEqual([]);
  });

  it('④ 形态中文名来自单一数据源', () => {
    expect(formFactorLabel('fold-wide')).toBe('阔折叠');
    expect(formFactorLabel('fold-mid')).toBe('中折叠');
    expect(formFactorLabel('bar')).toBe('直板');
    expect(formFactorLabel(null)).toBe('—');
    expect(categoryLabel('tablet')).toBe('平板');
  });

  it('⑤ LaptopExtras 可被 c() 正确展开，未填字段兜底 null', () => {
    const [laptop] = c('测试品牌', [
      {
        i: 'test-laptop',
        n: '测试笔记本',
        d: '2025-01',
        cat: 'laptop',
        ff: 'clamshell',
        lx: { cpuModel: 'Core Ultra 7 155H', cpuTdp: 28, batteryWh: 75 },
      },
    ]);

    expect(laptop.category).toBe('laptop');
    expect(laptop.formFactor).toBe('clamshell');
    expect(laptop.laptop?.cpuModel).toBe('Core Ultra 7 155H');
    expect(laptop.laptop?.cpuTdp).toBe(28);
    expect(laptop.laptop?.batteryWh).toBe(75);
    // 未填写的扩展块字段必须兜底为 null，不能是 undefined（渲染层统一按 null 处理）
    expect(laptop.laptop?.gpuDiscrete).toBeNull();
    expect(laptop.laptop?.ramUpgradable).toBeNull();
  });

  it('⑥ TabletExtras 可被 mk() 正确展开', () => {
    const tablet = mk('测试品牌', {
      id: 'test-tablet',
      name: '测试平板',
      release: '2025-03',
      cat: 'tablet',
      ff: 'slate',
      tb: { cellular: true, stylus: { supported: true, name: '测试笔' } },
    });

    expect(tablet.category).toBe('tablet');
    expect(tablet.formFactor).toBe('slate');
    expect(tablet.tablet?.cellular).toBe(true);
    expect(tablet.tablet?.stylus?.name).toBe('测试笔');
    // 未填写的扩展块字段兜底 null
    expect(tablet.tablet?.keyboard).toBeNull();
    expect(tablet.tablet?.speakerCount).toBeNull();
  });

  it('⑦ 折叠机外屏字段可录入（fsz / fres）', () => {
    const [fold] = c('测试品牌', [
      {
        i: 'test-fold',
        n: '测试阔折叠',
        d: '2025-05',
        ff: 'fold-wide',
        fsz: 3.5,
        fres: '980x980',
      },
    ]);

    expect(fold.formFactor).toBe('fold-wide');
    expect(fold.screen.coverSize).toBe(3.5);
    expect(fold.screen.coverResolution).toBe('980x980');
  });

  it('⑧ 重量 / 电池按品类格式化，且不做单位换算', () => {
    const [phone] = c('测试品牌', [
      { i: 'w-phone', n: '手机', d: '2024-01', wt: 200, bc: 5000 },
    ]);
    const [laptop] = c('测试品牌', [
      {
        i: 'w-laptop',
        n: '笔记本',
        d: '2025-01',
        cat: 'laptop',
        ff: 'clamshell',
        wt: 1500,
        lx: { batteryWh: 75 },
      },
    ]);

    expect(formatWeight(phone)).toBe('200g');
    expect(formatWeight(laptop)).toBe('1.5kg');
    // 手机看 mAh、笔记本看 Wh；笔记本 mAh 为 null 时不回落到 0
    expect(formatBattery(phone)).toBe('5000mAh');
    expect(formatBattery(laptop)).toBe('75Wh');
  });

  it('⑨ 分品类派生索引与既有手机口径一致', () => {
    expect(BOUNDS_BY_CATEGORY.phone.price).toEqual(PRICE_BOUNDS);
    expect(BRANDS_BY_CATEGORY.phone.length).toBeGreaterThan(0);
    // 无数据的品类给兜底边界而不是崩溃
    expect(BOUNDS_BY_CATEGORY.laptop.screenSize).toEqual([13, 18]);
  });

  it('⑩ 形态枚举新增时，标签表与外屏行同步（中折叠 fold-mid 不该被漏掉）', () => {
    // 枚举还在增殖：任何折叠形态都必须有中文名，且能触发「外屏」两行
    const foldables: FormFactor[] = ['fold-h', 'fold-mid', 'fold-v', 'fold-wide', 'fold-triple'];
    for (const ff of foldables) {
      expect(formFactorLabel(ff)).not.toBe(ff);
    }

    const screenGroup = SPEC_GROUPS.find((group) => group.key === 'screen');
    const coverRow = screenGroup?.rows.find((row) => row.key === 'screen.coverSize');
    expect(coverRow).toBeDefined();

    const [fold] = c('测试品牌', [
      { i: 'mid-fold', n: '测试中折叠', d: '2026-03', ff: 'fold-mid', fsz: 5.5, fres: '1200x850' },
    ]);
    expect(shouldRenderRow(coverRow as SpecRow, [fold])).toBe(true);
    // 直板机不许渲染外屏行（否则每款手机都多两行「—」）
    const [bar] = c('测试品牌', [{ i: 'bar-phone', n: '直板机', d: '2026-03' }]);
    expect(shouldRenderRow(coverRow as SpecRow, [bar])).toBe(false);
  });

  it('⑪ 形态 chips 的候选来自数据派生，不是硬编码列表', () => {
    // 455 款现有手机全部是工厂默认值 bar
    expect(FORM_FACTORS_BY_CATEGORY.phone).toEqual(['bar']);
    expect(FORM_FACTOR_COUNTS_BY_CATEGORY.phone.bar).toBe(455);
    // 无数据的品类给空数组而不是崩溃，UI 侧据此不渲染形态区
    expect(FORM_FACTORS_BY_CATEGORY.tablet).toEqual([]);
  });

  it('⑫ 笔记本参数组空壳已占住扩展位（仅 laptop 品类）', () => {
    expect(LAPTOP_SPEC_GROUPS.length).toBe(1);
    for (const group of LAPTOP_SPEC_GROUPS) {
      expect(group.categories).toEqual(['laptop']);
    }
    // 空壳不等于空实现：每行都要有真实取值函数
    const [laptop] = c('测试品牌', [
      {
        i: 'shell-laptop',
        n: '测试本',
        d: '2025-01',
        cat: 'laptop',
        ff: 'clamshell',
        lx: { cpuModel: 'Core Ultra 5 125H', batteryWh: 60 },
      },
    ]);
    const row = LAPTOP_SPEC_GROUPS[0].rows.find((item) => item.key === 'laptop.batteryWh');
    expect(row?.get(laptop)).toBe(60);
  });
});
