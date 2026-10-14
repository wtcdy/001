import { describe, expect, it } from 'vitest';

import { computeRowDiff, SPEC_GROUP_MAP, SPEC_GROUPS } from '../data/specGroups';
import type { SpecRow } from '../types/phone';

import { makePhone } from './fixtures';

/** 取一个内置行定义（按 分组.key + 行 key 定位） */
function rowOf(groupKey: string, rowKey: string): SpecRow {
  const group = SPEC_GROUP_MAP[groupKey];
  const row = group.rows.find((item) => item.key === rowKey);
  if (!row) throw new Error(`未找到参数行 ${groupKey}.${rowKey}`);
  return row;
}

describe('SPEC_GROUPS 定义', () => {
  it('分组 key 唯一，且 SPEC_GROUP_MAP 索引完整', () => {
    const keys = SPEC_GROUPS.map((group) => group.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(Object.keys(SPEC_GROUP_MAP).length).toBe(keys.length);
  });

  it('每行都有 key 与 label，且组内行 key 不重复', () => {
    for (const group of SPEC_GROUPS) {
      const rowKeys = group.rows.map((row) => row.key);
      expect(new Set(rowKeys).size).toBe(rowKeys.length);
      for (const row of group.rows) {
        expect(row.key).toBeTruthy();
        expect(row.label).toBeTruthy();
        expect(typeof row.get).toBe('function');
      }
    }
  });

  it('所有行的 get() 在完整机型上不抛异常', () => {
    const phone = makePhone();
    for (const group of SPEC_GROUPS) {
      for (const row of group.rows) {
        expect(() => row.get(phone)).not.toThrow();
      }
    }
  });
});

describe('computeRowDiff()', () => {
  describe('差异判定', () => {
    it('所有机型取值相同 -> allSame 为 true，diffIndexes 为空', () => {
      const phones = [
        makePhone({ id: 'a', performance: { soc: 'Snapdragon 8 Gen 3' } }),
        makePhone({ id: 'b', performance: { soc: 'Snapdragon 8 Gen 3' } }),
      ];
      const result = computeRowDiff(rowOf('performance', 'performance.soc'), phones);
      expect(result.allSame).toBe(true);
      expect(result.diffIndexes).toEqual([]);
      expect(result.displayValues).toEqual(['Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 3']);
    });

    it('取值不同 -> allSame 为 false，非基准项被标记为差异', () => {
      const phones = [
        makePhone({ id: 'a', performance: { soc: 'A17 Pro' } }),
        makePhone({ id: 'b', performance: { soc: 'Snapdragon 8 Gen 3' } }),
      ];
      const result = computeRowDiff(rowOf('performance', 'performance.soc'), phones);
      expect(result.allSame).toBe(false);
      // 出现次数相同的两个值，基准取先出现的那个，因此下标 1 为差异项
      expect(result.diffIndexes).toEqual([1]);
    });

    it('三款机型中「少数派」被标记为差异（基准=出现次数最多的值）', () => {
      const phones = [
        makePhone({ id: 'a', performance: { soc: 'X' } }),
        makePhone({ id: 'b', performance: { soc: 'X' } }),
        makePhone({ id: 'c', performance: { soc: 'Y' } }),
      ];
      const result = computeRowDiff(rowOf('performance', 'performance.soc'), phones);
      expect(result.allSame).toBe(false);
      expect(result.diffIndexes).toEqual([2]);
    });

    it('数值行会带上单位后缀参与展示与比较', () => {
      const phones = [
        makePhone({ id: 'a', battery: { capacity: 5000 } }),
        makePhone({ id: 'b', battery: { capacity: 6000 } }),
      ];
      const result = computeRowDiff(rowOf('battery', 'battery.capacity'), phones);
      expect(result.displayValues).toEqual(['5000mAh', '6000mAh']);
      expect(result.allSame).toBe(false);
    });
  });

  describe('缺失值 / null 的行为（缺失本身也是一个可比较取值）', () => {
    it('一侧有值、另一侧缺失：算作差异（缺失也参与比较，「只看不同」不应隐藏该行）', () => {
      const phones = [
        makePhone({ id: 'a', camera: { telephoto: '5000万像素' } }),
        makePhone({ id: 'b', camera: { telephoto: null } }),
      ];
      const result = computeRowDiff(rowOf('camera', 'camera.telephoto'), phones);
      expect(result.allSame).toBe(false);
      expect(result.displayValues).toEqual(['5000万像素', null]);
      // 两种取值各出现 1 次，基准取先出现的「5000万像素」，缺失项（下标 1）标为差异
      expect(result.diffIndexes).toEqual([1]);
    });

    it('多数有值、个别缺失时，只有缺失项被标为差异', () => {
      const phones = [
        makePhone({ id: 'a', camera: { telephoto: '5000万像素' } }),
        makePhone({ id: 'b', camera: { telephoto: '5000万像素' } }),
        makePhone({ id: 'c', camera: { telephoto: null } }),
      ];
      const result = computeRowDiff(rowOf('camera', 'camera.telephoto'), phones);
      expect(result.allSame).toBe(false);
      expect(result.diffIndexes).toEqual([2]);
    });

    it('全部缺失 -> allSame 为 true 且展示值全为 null', () => {
      const phones = [makePhone({ id: 'a' }), makePhone({ id: 'b' })];
      const result = computeRowDiff(rowOf('system', 'system.satellite'), phones);
      expect(result.allSame).toBe(true);
      expect(result.displayValues).toEqual([null, null]);
    });

    it('布尔 null 展示为 null（渲染层再降级为「—」）', () => {
      const phones = [makePhone({ id: 'a', system: { nfc: null } })];
      const result = computeRowDiff(rowOf('system', 'system.nfc'), phones);
      expect(result.displayValues).toEqual([null]);
    });

    it('布尔 true / false 展示为「支持 / 不支持」', () => {
      const phones = [makePhone({ id: 'a', system: { nfc: true } }), makePhone({ id: 'b', system: { nfc: false } })];
      const result = computeRowDiff(rowOf('system', 'system.nfc'), phones);
      expect(result.displayValues).toEqual(['支持', '不支持']);
      expect(result.allSame).toBe(false);
      expect(result.diffIndexes).toEqual([1]);
    });

    it('无线充电：0 展示为「不支持」，大于 0 展示为 "xW"', () => {
      const phones = [
        makePhone({ id: 'a', battery: { wirelessCharge: 50 } }),
        makePhone({ id: 'b', battery: { wirelessCharge: 0 } }),
      ];
      const result = computeRowDiff(rowOf('battery', 'battery.wirelessCharge'), phones);
      expect(result.displayValues).toEqual(['50W', '不支持']);
    });

    it('无线充电：数值缺失（null）展示为 null，由渲染层降级为「—」', () => {
      const phones = [
        makePhone({ id: 'a', battery: { wirelessCharge: 50 } }),
        makePhone({ id: 'b', battery: { wirelessCharge: null } }),
      ];
      const result = computeRowDiff(rowOf('battery', 'battery.wirelessCharge'), phones);
      expect(result.displayValues).toEqual(['50W', null]);
      expect(result.allSame).toBe(false);
    });

    /**
     * get() 返回原始数值、展示文案交给 format 钩子，
     * 因此该行的 numeric + better='higher' 能正常参与优劣计算。
     */
    it('无线充电：数值参与优劣比较，最高功率标优、0（不支持）标弱', () => {
      const phones = [
        makePhone({ id: 'a', battery: { wirelessCharge: 80 } }),
        makePhone({ id: 'b', battery: { wirelessCharge: 50 } }),
        makePhone({ id: 'c', battery: { wirelessCharge: 0 } }),
      ];
      const result = computeRowDiff(rowOf('battery', 'battery.wirelessCharge'), phones);
      expect(result.allSame).toBe(false);
      expect(result.bestIndexes).toEqual([0]);
      expect(result.worstIndexes).toEqual([2]);
    });
  });

  describe('最优 / 最差标记', () => {
    it("better: 'higher' 时最大值被标记为 best，最小值被标记为 worst", () => {
      const phones = [
        makePhone({ id: 'a', battery: { capacity: 5000 } }),
        makePhone({ id: 'b', battery: { capacity: 6000 } }),
        makePhone({ id: 'c', battery: { capacity: 4000 } }),
      ];
      const result = computeRowDiff(rowOf('battery', 'battery.capacity'), phones);
      expect(result.bestIndexes).toEqual([1]);
      expect(result.worstIndexes).toEqual([2]);
    });

    it("better: 'lower' 时最小值被标记为 best，最大值被标记为 worst（首发价）", () => {
      const phones = [
        makePhone({ id: 'a', launchPrice: 5999 }),
        makePhone({ id: 'b', launchPrice: 3999 }),
      ];
      const result = computeRowDiff(rowOf('basic', 'launchPrice'), phones);
      expect(result.bestIndexes).toEqual([1]);
      expect(result.worstIndexes).toEqual([0]);
    });

    it('取值全部相同时不产生 best / worst', () => {
      const phones = [
        makePhone({ id: 'a', battery: { capacity: 5000 } }),
        makePhone({ id: 'b', battery: { capacity: 5000 } }),
      ];
      const result = computeRowDiff(rowOf('battery', 'battery.capacity'), phones);
      expect(result.bestIndexes).toEqual([]);
      expect(result.worstIndexes).toEqual([]);
    });

    it('未声明 better 的数值行不参与优劣判定（如屏幕尺寸）', () => {
      const phones = [
        makePhone({ id: 'a', screen: { size: 6.1 } }),
        makePhone({ id: 'b', screen: { size: 6.7 } }),
      ];
      const result = computeRowDiff(rowOf('screen', 'screen.size'), phones);
      expect(result.allSame).toBe(false);
      expect(result.bestIndexes).toEqual([]);
      expect(result.worstIndexes).toEqual([]);
    });

    it('机型数不足 2 款时不判定优劣', () => {
      const result = computeRowDiff(rowOf('battery', 'battery.capacity'), [
        makePhone({ id: 'a', battery: { capacity: 5000 } }),
      ]);
      expect(result.bestIndexes).toEqual([]);
      expect(result.worstIndexes).toEqual([]);
    });
  });
});
