import { priorityWeight, normalizePriority } from '../src/domain/priority';
import { isHabitDue } from '../src/domain/schedule';
import { selectTodayItems, selectPoolItems, selectFutureItems, sortByPriority } from '../src/domain/selectors';
import type { Habit, Item } from '../src/domain/types';

describe('priority', () => {
  it('权重 A < S < SS < SSS，非法回退 A', () => {
    expect(priorityWeight('A')).toBe(0);
    expect(priorityWeight('S')).toBe(1);
    expect(priorityWeight('SS')).toBe(2);
    expect(priorityWeight('SSS')).toBe(3);
    expect(priorityWeight(null)).toBe(0);
    expect(priorityWeight('x')).toBe(0);
    expect(normalizePriority(null)).toBe('A');
  });
});

describe('schedule', () => {
  const daily: Habit = { id: '1', title: 'x', frequencyType: 'daily', weekdays: [], category: '其他', createdAt: '', updatedAt: '' };
  const weekly: Habit = { id: '2', title: 'x', frequencyType: 'weekly', weekdays: [1, 3, 5], category: '其他', createdAt: '', updatedAt: '' };

  it('每天习惯每天都到期', () => {
    expect(isHabitDue(daily, '2026-11-23')).toBe(true);
    expect(isHabitDue(daily, '2026-11-24')).toBe(true);
  });

  it('每周一三五到期（2026-11-23 是周一）', () => {
    expect(isHabitDue(weekly, '2026-11-23')).toBe(true);  // 周一
    expect(isHabitDue(weekly, '2026-11-24')).toBe(false); // 周二
    expect(isHabitDue(weekly, '2026-11-25')).toBe(true);  // 周三
    expect(isHabitDue(weekly, '2026-11-27')).toBe(true);  // 周五
    expect(isHabitDue(weekly, '2026-11-29')).toBe(false); // 周日
  });
});

describe('selectors', () => {
  const today = '2026-11-23';
  const items: Item[] = [
    { id: '1', title: '今天未完成', category: '学习', priority: 'A', dueDate: today, done: false, createdAt: '', completedAt: null },
    { id: '2', title: '今天已完成', category: '学习', priority: 'SSS', dueDate: today, done: true, createdAt: '', completedAt: null },
    { id: '3', title: '待办池', category: null, priority: null, dueDate: null, done: false, createdAt: '', completedAt: null },
    { id: '4', title: '未来', category: null, priority: null, dueDate: '2026-11-25', done: false, createdAt: '', completedAt: null },
    { id: '5', title: '昨天已完成', category: null, priority: null, dueDate: '2026-11-22', done: true, createdAt: '', completedAt: null },
    { id: '6', title: '昨天未完成', category: null, priority: null, dueDate: '2026-11-22', done: false, createdAt: '', completedAt: null },
  ];

  it('今天 = 今天 + 过期未完成，排除过期已完成', () => {
    expect(selectTodayItems(items, today).map((i) => i.id).sort()).toEqual(['1', '2', '6']);
  });

  it('待办池 = 无日期', () => {
    expect(selectPoolItems(items).map((i) => i.id)).toEqual(['3']);
  });

  it('未来 = 日期大于今天', () => {
    expect(selectFutureItems(items, today).map((i) => i.id)).toEqual(['4']);
  });

  it('按优先级 SSS > SS > S > A 排序', () => {
    const sorted = sortByPriority([
      { ...items[0], id: 'a', priority: 'A' },
      { ...items[0], id: 'b', priority: 'SSS' },
      { ...items[0], id: 'c', priority: 'S' },
    ]).map((i) => i.priority);
    expect(sorted).toEqual(['SSS', 'S', 'A']);
  });
});
