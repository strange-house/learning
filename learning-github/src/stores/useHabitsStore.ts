import { create } from 'zustand';
import * as repo from '../data/repositories/habitRepository';
import type { Habit, HabitFrequencyType } from '../domain/types';

interface HabitsState {
  habits: Habit[];
  completedByHabit: Record<string, string[]>;
  load: () => Promise<void>;
  createHabit: (input: { title: string; frequencyType: HabitFrequencyType; weekdays: number[]; category: string }) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, date: string) => Promise<void>;
  isCompleted: (habitId: string, date: string) => boolean;
  completedDays: (habitId: string) => number;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  completedByHabit: {},
  async load() {
    const [habits, completions] = await Promise.all([repo.listHabits(), repo.listCompletions()]);
    const completedByHabit: Record<string, string[]> = {};
    for (const c of completions) {
      if (!completedByHabit[c.habitId]) completedByHabit[c.habitId] = [];
      completedByHabit[c.habitId].push(c.date);
    }
    set({ habits, completedByHabit });
  },
  async createHabit(input) {
    const habit = await repo.insertHabit(input);
    set({ habits: [...get().habits, habit] });
  },
  async updateHabit(habit) {
    await repo.updateHabit(habit);
    set({ habits: get().habits.map((h) => (h.id === habit.id ? { ...habit, updatedAt: new Date().toISOString() } : h)) });
  },
  async deleteHabit(id) {
    await repo.deleteHabit(id);
    const completedByHabit = { ...get().completedByHabit };
    delete completedByHabit[id];
    set({ habits: get().habits.filter((h) => h.id !== id), completedByHabit });
  },
  async toggleCompletion(habitId, date) {
    const cur = get().completedByHabit[habitId] || [];
    const done = cur.includes(date);
    await repo.setCompletion(habitId, date, !done);
    const next = done ? cur.filter((d) => d !== date) : [...cur, date];
    set({ completedByHabit: { ...get().completedByHabit, [habitId]: next } });
  },
  isCompleted(habitId, date) {
    return (get().completedByHabit[habitId] || []).includes(date);
  },
  completedDays(habitId) {
    return (get().completedByHabit[habitId] || []).length;
  },
}));
