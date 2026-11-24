import dayjs from 'dayjs';
import type { Habit } from './types';

/** 周一=1 … 周日=7 */
export function isoWeekday(date: string): number {
  const dow = dayjs(date).day();
  return dow === 0 ? 7 : dow;
}

export function isHabitDue(habit: Habit, date: string): boolean {
  if (habit.frequencyType === 'daily') return true;
  return habit.weekdays.includes(isoWeekday(date));
}
