import type { Category } from './category';
import type { Priority } from './priority';

export type HabitFrequencyType = 'daily' | 'weekly';

export interface Habit {
  id: string;
  title: string;
  frequencyType: HabitFrequencyType;
  weekdays: number[]; // 1..7（1=周一 … 7=周日），仅 weekly 生效
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
}

export interface Item {
  id: string;
  title: string;
  category: Category | null;
  priority: Priority | null;
  dueDate: string | null; // null=待办池；今天=计划；未来日期=未来事项
  done: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface DiaryEntry {
  date: string; // YYYY-MM-DD（一天一篇）
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memo {
  id: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackupData {
  schemaVersion: number;
  exportedAt: string;
  habits: Habit[];
  habitCompletions: HabitCompletion[];
  items: Item[];
  diary: DiaryEntry[];
  memos: Memo[];
  settings: Record<string, string>;
}
