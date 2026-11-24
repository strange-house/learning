import { getDb } from '../db/client';
import type { Memo } from '../../domain/types';
import { newId } from '../../utils/id';

interface MemoRow { id: string; content: string; pinned: number; created_at: string; updated_at: string; }

function rowToMemo(r: MemoRow): Memo {
  return { id: r.id, content: r.content, pinned: r.pinned === 1, createdAt: r.created_at, updatedAt: r.updated_at };
}

export async function listMemos(): Promise<Memo[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<MemoRow>('SELECT * FROM memos');
  return rows.map(rowToMemo).sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });
}

export async function insertMemo(content: string, pinned: boolean): Promise<Memo> {
  const now = new Date().toISOString();
  const memo: Memo = { id: newId(), content, pinned, createdAt: now, updatedAt: now };
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO memos (id, content, pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [memo.id, memo.content, memo.pinned ? 1 : 0, memo.createdAt, memo.updatedAt],
  );
  return memo;
}

export async function updateMemo(id: string, content: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE memos SET content = ?, updated_at = ? WHERE id = ?', [content, new Date().toISOString(), id]);
}

export async function setMemoPinned(id: string, pinned: boolean): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE memos SET pinned = ? WHERE id = ?', [pinned ? 1 : 0, id]);
}

export async function deleteMemo(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM memos WHERE id = ?', [id]);
}
