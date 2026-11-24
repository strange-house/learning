import { getDb } from '../db/client';
import type { DiaryEntry } from '../../domain/types';

interface DiaryRow { date: string; title: string; body: string; created_at: string; updated_at: string; }

function rowToDiary(r: DiaryRow): DiaryEntry {
  return { date: r.date, title: r.title, body: r.body, createdAt: r.created_at, updatedAt: r.updated_at };
}

export async function listDiary(): Promise<DiaryEntry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DiaryRow>('SELECT * FROM diary ORDER BY date DESC');
  return rows.map(rowToDiary);
}

export async function getDiary(date: string): Promise<DiaryEntry | null> {
  const db = await getDb();
  const r = await db.getFirstAsync<DiaryRow>('SELECT * FROM diary WHERE date = ?', [date]);
  return r ? rowToDiary(r) : null;
}

export async function upsertDiary(date: string, title: string, body: string): Promise<DiaryEntry> {
  const existing = await getDiary(date);
  const now = new Date().toISOString();
  const entry: DiaryEntry = { date, title, body, createdAt: existing ? existing.createdAt : now, updatedAt: now };
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO diary (date, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(date) DO UPDATE SET title = excluded.title, body = excluded.body, updated_at = excluded.updated_at',
    [entry.date, entry.title, entry.body, entry.createdAt, entry.updatedAt],
  );
  return entry;
}

export async function deleteDiary(date: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM diary WHERE date = ?', [date]);
}
