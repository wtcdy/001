import { describe, expect, it } from 'vitest';

import type { DeviceCategory, FormFactor } from '../types/device';
import type { SpecRow } from '../types/phone';

import { FORM_FACTOR_LABELS } from '../constants';
import { c, cLaptop, cTablet, mk } from '../data/_factory';
import { LAPTOP_SPEC_GROUPS } from '../data/laptopSpecGroups';
import {
  ALL_DEVICES,
  ALL_PHONES,
  BOUNDS_BY_CATEGORY,
  BRANDS_BY_CATEGORY,
  CATEGORY_COUNTS,
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

  it('② 品类派生自洽：ALL_DEVICES = 手机 + 平板 + 笔记本', () => {
    // 绝对条数交给 `npm run validate:data` 守（它会随录入/补录一起涨）。
    // 这里只守「派生结果与源头一致」——别人往数据目录加机型不会误伤本用例。
    expect(CATEGORY_COUNTS.phone).toBe(ALL_PHONES.length);
    // 总表按品类累加：不该凭空多出/少掉设备
    expect(ALL_DEVICES.length).toBe(
      CATEGORY_COUNTS.phone + CATEGORY_COUNTS.tablet + CATEGORY_COUNTS.laptop,
    );
    // 下限护栏：T01 落地时的基线是 455 条手机，只会增不会减
    expect(ALL_PHONES.length).toBeGreaterThanOrEqual(455);
    expect(Object.keys(DEVICE_MAP).length).toBe(ALL_DEVICES.length);
    expect(Object.keys(PHONE_MAP).length).toBe(ALL_PHONES.length);
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
        // 电池用共享的双单位字段 bwh（Wh），不再是 LaptopExtras.batteryWh
        lx: { cpuModel: 'Core Ultra 7 155H', cpuTdp: 28 },
        bwh: 75,
      },
    ]);

    expect(laptop.category).toBe('laptop');
    expect(laptop.formFactor).toBe('clamshell');
    expect(laptop.laptop?.cpuModel).toBe('Core Ultra 7 155H');
    expect(laptop.laptop?.cpuTdp).toBe(28);
    expect(laptop.battery?.batteryWh).toBe(75);
    // 双单位互斥：填了 Wh 就必须是 mAh 为 null，绝不换算
    expect(laptop.battery?.capacity).toBeNull();
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
        bwh: 75,
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
    const forms = FORM_FACTORS_BY_CATEGORY.phone;
    const counts = FORM_FACTOR_COUNTS_BY_CATEGORY.phone;

    // 不锁死具体回填进度：只断言「派生结果与数据一致」，回填多少台折叠机都不会红
    expect(forms).toContain('bar');
    // 各形态计数之和 === 机型总数（守住「不新增不删除条目」）
    const sum = Object.values(counts).reduce((acc, n) => acc + n, 0);
    expect(sum).toBe(ALL_PHONES.length);
    // 派生出来的形态必须是合法枚举值（比锁死 ['bar'] 更有价值）
    const validForms = Object.keys(FORM_FACTOR_LABELS);
    for (const ff of forms) expect(validForms).toContain(ff);
    // 计数与列表一一对应
    for (const ff of forms) expect(counts[ff]).toBeGreaterThan(0);
    // 无数据的品类给空数组而不是崩溃，UI 侧据此不渲染形态区；
    // 有数据的品类必定能派生出至少一个形态（不写死 tablet/laptop，谁先接入都不会红）
    for (const cat of Object.keys(CATEGORY_COUNTS) as DeviceCategory[]) {
      if (CATEGORY_COUNTS[cat] === 0) {
        expect(FORM_FACTORS_BY_CATEGORY[cat]).toEqual([]);
      } else {
        expect(FORM_FACTORS_BY_CATEGORY[cat].length).toBeGreaterThan(0);
      }
    }
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
        lx: { cpuModel: 'Core Ultra 5 125H' },
        bwh: 60,
      },
    ]);
    const row = LAPTOP_SPEC_GROUPS[0].rows.find((item) => item.key === 'laptop.batteryWh');
    expect(row?.get(laptop)).toBe(60);
  });

  it('⑬ 外屏行的真闸门是「形态」而非「品类」（跨品类对比不出现「—」噪音）', () => {
    const screenGroup = SPEC_GROUPS.find((group) => group.key === 'screen');
    const coverRow = screenGroup?.rows.find((row) => row.key === 'screen.coverSize') as SpecRow;
    expect(coverRow).toBeDefined();

    const [iphone] = c('Apple', [{ i: 't-iphone', n: 'iPhone', d: '2025-09', ff: 'bar' }]);
    const [puraX] = c('华为', [
      { i: 't-pura-x', n: 'Pura X', d: '2025-03', ff: 'fold-wide', fsz: 3.5, fres: '980x980' },
    ]);
    const [ipad] = cTablet('Apple', [{ i: 't-ipad', n: 'iPad', d: '2025-10' }]);

    // 直板手机 vs 平板：没有任何折叠形态参与 → 外屏行不渲染
    expect(shouldRenderRow(coverRow, [iphone, ipad])).toBe(false);
    // 阔折叠 vs 平板：外屏正是 Pura X 的定义性差异 → 必须渲染
    expect(shouldRenderRow(coverRow, [puraX, ipad])).toBe(true);
    // 形态是 OR 语义：只要有一台是折叠机就渲染
    expect(shouldRenderRow(coverRow, [puraX, iphone])).toBe(true);
  });

  it('⑭ cTablet() / cLaptop() 让品类与形态不可能写错', () => {
    // 平板文件不必写 cat / ff
    const [ipad] = cTablet('Apple', [{ i: 't-ipad-2', n: 'iPad Pro', d: '2025-10' }]);
    expect(ipad.category).toBe('tablet');
    expect(ipad.formFactor).toBe('slate');

    // 可拆卸二合一显式覆盖形态，品类仍由工厂兜底
    const [edge] = cTablet('华为', [
      { i: 't-edge', n: 'MatePad Edge', d: '2026-01', ff: 'detachable' },
    ]);
    expect(edge.category).toBe('tablet');
    expect(edge.formFactor).toBe('detachable');

    const [laptop] = cLaptop('联想', [{ i: 't-thinkpad', n: 'ThinkPad', d: '2026-01' }]);
    expect(laptop.category).toBe('laptop');
    expect(laptop.formFactor).toBe('clamshell');

    // 种子里的显式值永远优先于工厂默认（不影响既有 455 条数据的零改动）
    const [override] = cTablet('测试', [
      { i: 't-override', n: '显式覆盖', d: '2026-01', cat: 'phone', ff: 'bar' },
    ]);
    expect(override.category).toBe('phone');
    expect(override.formFactor).toBe('bar');
  });
});
