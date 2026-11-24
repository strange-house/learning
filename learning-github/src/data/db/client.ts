import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../../domain/constants';

let handle: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!handle) handle = SQLite.openDatabaseAsync(DB_NAME);
  return handle;
}

export async function withTransaction<T>(work: (db: SQLite.SQLiteDatabase) => Promise<T>): Promise<T> {
  const db = await getDb();
  let result: T | undefined;
  await db.withTransactionAsync(async () => {
    result = await work(db);
  });
  return result as T;
}
