import type { SQLiteDatabase } from 'expo-sqlite';
import { CURRENT_SCHEMA_VERSION, INSTALLED_AT_KEY, STORAGE_VERSION_KEY } from '../../domain/constants';
import { createSchemaSql } from './schema';
import { getDb } from './client';

export class AppDataTooNewError extends Error {
  readonly storedVersion: number;
  constructor(storedVersion: number) {
    super('本地数据由更高版本的 App 创建（v' + storedVersion + '），当前 App 支持到 v' + CURRENT_SCHEMA_VERSION + '。');
    this.name = 'AppDataTooNewError';
    this.storedVersion = storedVersion;
  }
}

async function readStorageVersion(db: SQLiteDatabase): Promise<number | null> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_meta WHERE key = ?',
    [STORAGE_VERSION_KEY],
  );
  if (!row) return null;
  const n = Number(row.value);
  return Number.isFinite(n) ? Math.floor(n) : null;
}

async function writeMeta(db: SQLiteDatabase, key: string, value: string): Promise<void> {
  await db.runAsync(
    'INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value],
  );
}

/** 启动时调用：建表 + 版本检查。当前只有 v1，未来升级在此逐级迁移。 */
export async function ensureDatabaseReady(): Promise<void> {
  const db = await getDb();
  await db.execAsync(createSchemaSql());
  const stored = await readStorageVersion(db);
  if (stored === null) {
    await writeMeta(db, STORAGE_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
    await writeMeta(db, INSTALLED_AT_KEY, new Date().toISOString());
    return;
  }
  if (stored > CURRENT_SCHEMA_VERSION) {
    throw new AppDataTooNewError(stored);
  }
  if (stored !== CURRENT_SCHEMA_VERSION) {
    // v1 之前不存在；若有旧结构，这里逐级迁移。当前无历史版本。
    await writeMeta(db, STORAGE_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
  }
}
