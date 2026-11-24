import { create } from 'zustand';
import * as repo from '../data/repositories/memoRepository';
import type { Memo } from '../domain/types';

interface MemosState {
  memos: Memo[];
  load: () => Promise<void>;
  createMemo: (content: string, pinned: boolean) => Promise<void>;
  updateMemo: (id: string, content: string) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
}

export const useMemosStore = create<MemosState>((set, get) => ({
  memos: [],
  async load() {
    set({ memos: await repo.listMemos() });
  },
  async createMemo(content, pinned) {
    const memo = await repo.insertMemo(content, pinned);
    set({ memos: [memo, ...get().memos] });
  },
  async updateMemo(id, content) {
    await repo.updateMemo(id, content);
    set({ memos: get().memos.map((m) => (m.id === id ? { ...m, content, updatedAt: new Date().toISOString() } : m)) });
  },
  async deleteMemo(id) {
    await repo.deleteMemo(id);
    set({ memos: get().memos.filter((m) => m.id !== id) });
  },
  async togglePin(id) {
    const m = get().memos.find((x) => x.id === id);
    if (!m) return;
    const pinned = !m.pinned;
    await repo.setMemoPinned(id, pinned);
    const next = get().memos.map((x) => (x.id === id ? { ...x, pinned } : x)).sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    set({ memos: next });
  },
}));
