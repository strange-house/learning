import { create } from 'zustand';
import * as repo from '../data/repositories/diaryRepository';
import type { DiaryEntry } from '../domain/types';

interface DiaryState {
  entries: DiaryEntry[];
  load: () => Promise<void>;
  saveEntry: (date: string, title: string, body: string) => Promise<void>;
  deleteEntry: (date: string) => Promise<void>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  async load() {
    set({ entries: await repo.listDiary() });
  },
  async saveEntry(date, title, body) {
    const entry = await repo.upsertDiary(date, title, body);
    const exists = get().entries.some((e) => e.date === date);
    set({
      entries: exists
        ? get().entries.map((e) => (e.date === date ? entry : e))
        : [entry, ...get().entries].sort((a, b) => (a.date < b.date ? 1 : -1)),
    });
  },
  async deleteEntry(date) {
    await repo.deleteDiary(date);
    set({ entries: get().entries.filter((e) => e.date !== date) });
  },
}));
