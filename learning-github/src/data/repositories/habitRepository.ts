import { getDb, withTransaction } from '../db/client';
import type { Habit, HabitCompletion, HabitFrequencyType } from '../../domain/types';
import { normalizeCategory } from '../../domain/category';
import { newId } from '../../utils/id';

interface HabitRow {
  id: string; title: string; frequency_type: string; weekdays: string;
  category: string; created_at: string; updated_at: string;
}
interface CompletionRow { habit_id: string; date: string; completed_at: string; }

function rowToHabit(r: HabitRow): Habit {
  let weekdays: number[] = [];
  try { weekdays = JSON.parse(r.weekdays || '[]'); } catch { weekdays = []; }
  return {
    id: r.id,
    title: r.title,
    frequencyType: (r.frequency_type === 'weekly' ? 'weekly' : 'daily') as HabitFrequencyType,
    weekdays,
    category: normalizeCategory(r.category),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function listHabits(): Promise<Habit[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<HabitRow>('SELECT * FROM habits ORDER BY created_at ASC');
  return rows.map(rowToHabit);
}

export async function listCompletions(): Promise<HabitCompletion[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<CompletionRow>('SELECT * FROM habit_completions');
  return rows.map((r) => ({ habitId: r.habit_id, date: r.date, completedAt: r.completed_at }));
}

export async function insertHabit(input: {
  title: string; frequencyType: HabitFrequencyType; weekdays: number[]; category: string;
}): Promise<Habit> {
  const now = new Date().toISOString();
  const habit: Habit = {
    id: newId(), title: input.title, frequencyType: input.frequencyType,
    weekdays: input.weekdays, category: normalizeCategory(input.category),
    createdAt: now, updatedAt: now,
  };
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO habits (id, title, frequency_type, weekdays, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [habit.id, habit.title, habit.frequencyType, JSON.stringify(habit.weekdays), habit.category, habit.createdAt, habit.updatedAt],
  );
  return habit;
}

export async function updateHabit(habit: Habit): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE habits SET title = ?, frequency_type = ?, weekdays = ?, category = ?, updated_at = ? WHERE id = ?',
    [habit.title, habit.frequencyType, JSON.stringify(habit.weekdays), habit.category, new Date().toISOString(), habit.id],
  );
}

export async function deleteHabit(id: string): Promise<void> {
  await withTransaction(async (db) => {
    await db.runAsync('DELETE FROM habit_completions WHERE habit_id = ?', [id]);
    await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
  });
}

export async function setCompletion(habitId: string, date: string, completed: boolean): Promise<void> {
  const db = await getDb();
  if (completed) {
    await db.runAsync(
      'INSERT INTO habit_completions (habit_id, date, completed_at) VALUES (?, ?, ?) ON CONFLICT(habit_id, date) DO NOTHING',
      [habitId, date, new Date().toISOString()],
    );
  } else {
    await db.runAsync('DELETE FROM habit_completions WHERE habit_id = ? AND date = ?', [habitId, date]);
  }
}
