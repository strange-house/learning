import { getDb } from '../db/client';
import type { Item } from '../../domain/types';
import { isCategory } from '../../domain/category';
import { isPriority } from '../../domain/priority';
import { newId } from '../../utils/id';

interface ItemRow {
  id: string; title: string; category: string | null; priority: string | null;
  due_date: string | null; done: number; created_at: string; completed_at: string | null;
}

function rowToItem(r: ItemRow): Item {
  return {
    id: r.id,
    title: r.title,
    category: isCategory(r.category) ? r.category : null,
    priority: isPriority(r.priority) ? r.priority : null,
    dueDate: r.due_date,
    done: r.done === 1,
    createdAt: r.created_at,
    completedAt: r.completed_at,
  };
}

export async function listItems(): Promise<Item[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<ItemRow>('SELECT * FROM items');
  return rows.map(rowToItem);
}

export async function insertItem(input: {
  title: string; category: string | null; priority: string | null; dueDate: string | null;
}): Promise<Item> {
  const now = new Date().toISOString();
  const item: Item = {
    id: newId(), title: input.title,
    category: isCategory(input.category) ? input.category : null,
    priority: isPriority(input.priority) ? input.priority : null,
    dueDate: input.dueDate, done: false, createdAt: now, completedAt: null,
  };
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO items (id, title, category, priority, due_date, done, created_at, completed_at) VALUES (?, ?, ?, ?, ?, 0, ?, NULL)',
    [item.id, item.title, item.category, item.priority, item.dueDate, item.createdAt],
  );
  return item;
}

export async function updateItem(item: Item): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE items SET title = ?, category = ?, priority = ?, due_date = ?, done = ?, completed_at = ? WHERE id = ?',
    [item.title, item.category, item.priority, item.dueDate, item.done ? 1 : 0, item.completedAt, item.id],
  );
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM items WHERE id = ?', [id]);
}

export async function setItemDone(id: string, done: boolean): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE items SET done = ?, completed_at = ? WHERE id = ?',
    [done ? 1 : 0, done ? new Date().toISOString() : null, id],
  );
}
