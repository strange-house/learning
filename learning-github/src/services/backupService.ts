import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { BACKUP_VERSION } from '../domain/constants';
import type { BackupData } from '../domain/types';
import { listHabits, listCompletions } from '../data/repositories/habitRepository';
import { listItems } from '../data/repositories/itemRepository';
import { listDiary } from '../data/repositories/diaryRepository';
import { listMemos } from '../data/repositories/memoRepository';
import { getSettings } from '../data/repositories/settingsRepository';
import { getDb, withTransaction } from '../data/db/client';

async function buildBackup(): Promise<BackupData> {
  return {
    schemaVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    habits: await listHabits(),
    habitCompletions: await listCompletions(),
    items: await listItems(),
    diary: await listDiary(),
    memos: await listMemos(),
    settings: await getSettings(),
  };
}

export async function exportBackup(): Promise<boolean> {
  const data = await buildBackup();
  const json = JSON.stringify(data, null, 2);
  const dir = FileSystem.cacheDirectory + 'backups/';
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const path = dir + 'learning-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  await FileSystem.writeAsStringAsync(path, json);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: '导出 Learning 备份' });
    return true;
  }
  return false;
}

export async function importBackup(): Promise<boolean> {
  const res = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
  if (res.canceled || !res.assets || res.assets.length === 0) return false;
  const text = await FileSystem.readAsStringAsync(res.assets[0].uri);
  const data = JSON.parse(text) as BackupData;
  if (typeof data !== 'object' || data === null || typeof data.schemaVersion !== 'number') {
    throw new Error('备份文件格式不正确');
  }
  if (data.schemaVersion > BACKUP_VERSION) {
    throw new Error('备份来自更新版本，无法导入');
  }
  await replaceAll(data);
  return true;
}

async function replaceAll(data: BackupData): Promise<void> {
  const db = await getDb();
  await withTransaction(async (db) => {
    await db.runAsync('DELETE FROM habit_completions');
    await db.runAsync('DELETE FROM habits');
    await db.runAsync('DELETE FROM items');
    await db.runAsync('DELETE FROM diary');
    await db.runAsync('DELETE FROM memos');
    await db.runAsync('DELETE FROM settings');

    for (const h of data.habits || []) {
      await db.runAsync(
        'INSERT INTO habits (id, title, frequency_type, weekdays, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [h.id, h.title, h.frequencyType, JSON.stringify(h.weekdays || []), h.category || '其他', h.createdAt, h.updatedAt],
      );
    }
    for (const c of data.habitCompletions || []) {
      await db.runAsync('INSERT OR IGNORE INTO habit_completions (habit_id, date, completed_at) VALUES (?, ?, ?)', [c.habitId, c.date, c.completedAt]);
    }
    for (const i of data.items || []) {
      await db.runAsync(
        'INSERT INTO items (id, title, category, priority, due_date, done, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [i.id, i.title, i.category, i.priority, i.dueDate, i.done ? 1 : 0, i.createdAt, i.completedAt],
      );
    }
    for (const d of data.diary || []) {
      await db.runAsync('INSERT INTO diary (date, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [d.date, d.title, d.body, d.createdAt, d.updatedAt]);
    }
    for (const m of data.memos || []) {
      await db.runAsync('INSERT INTO memos (id, content, pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [m.id, m.content, m.pinned ? 1 : 0, m.createdAt, m.updatedAt]);
    }
    for (const key of Object.keys(data.settings || {})) {
      await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', [key, data.settings[key]]);
    }
  });
}
