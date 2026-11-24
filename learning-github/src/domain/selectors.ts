import type { Item } from './types';
import { priorityWeight } from './priority';

/** 今日计划：今天到期 + 过期未完成（回滚到今天）；过期的已完成项不显示 */
export function selectTodayItems(items: Item[], today: string): Item[] {
  return items.filter((i) => {
    if (i.dueDate === null) return false;
    if (i.dueDate > today) return false;
    if (i.dueDate < today && i.done) return false;
    return true;
  });
}

export function selectPoolItems(items: Item[]): Item[] {
  return items.filter((i) => i.dueDate === null);
}

export function selectFutureItems(items: Item[], today: string): Item[] {
  return items
    .filter((i) => i.dueDate !== null && i.dueDate > today)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : a.dueDate! > b.dueDate! ? 1 : 0));
}

export function sortByPriority(items: Item[]): Item[] {
  return [...items].sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
}
