import { create } from 'zustand';
import * as repo from '../data/repositories/itemRepository';
import type { Item } from '../domain/types';
import { DEFAULT_CATEGORY } from '../domain/category';
import { DEFAULT_PRIORITY } from '../domain/priority';
import { todayKey, addDaysKey } from '../utils/date';

interface ItemsState {
  items: Item[];
  load: () => Promise<void>;
  createItem: (input: { title: string; category: string | null; priority: string | null; dueDate: string | null }) => Promise<Item>;
  updateItem: (item: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  moveToToday: (id: string) => Promise<void>;
  moveToTomorrow: (id: string) => Promise<void>;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  async load() {
    set({ items: await repo.listItems() });
  },
  async createItem(input) {
    const item = await repo.insertItem(input);
    set({ items: [item, ...get().items] });
    return item;
  },
  async updateItem(item) {
    await repo.updateItem(item);
    set({ items: get().items.map((i) => (i.id === item.id ? item : i)) });
  },
  async deleteItem(id) {
    await repo.deleteItem(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  async toggleDone(id) {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const done = !item.done;
    await repo.setItemDone(id, done);
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, done, completedAt: done ? new Date().toISOString() : null } : i,
      ),
    });
  },
  async moveToToday(id) {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const updated: Item = {
      ...item,
      dueDate: todayKey(),
      category: item.category ?? DEFAULT_CATEGORY,
      priority: item.priority ?? DEFAULT_PRIORITY,
      done: false,
      completedAt: null,
    };
    await repo.updateItem(updated);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },
  async moveToTomorrow(id) {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const updated: Item = { ...item, dueDate: addDaysKey(todayKey(), 1), done: false, completedAt: null };
    await repo.updateItem(updated);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },
}));
