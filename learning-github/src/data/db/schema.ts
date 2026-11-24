const STATEMENTS: string[] = [
  'PRAGMA journal_mode = WAL;',

  'CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);',

  "CREATE TABLE IF NOT EXISTS habits (" +
    "id TEXT PRIMARY KEY NOT NULL, " +
    "title TEXT NOT NULL, " +
    "frequency_type TEXT NOT NULL DEFAULT 'daily', " +
    "weekdays TEXT NOT NULL DEFAULT '[]', " +
    "category TEXT NOT NULL DEFAULT '其他', " +
    "created_at TEXT NOT NULL, " +
    "updated_at TEXT NOT NULL);",

  'CREATE TABLE IF NOT EXISTS habit_completions (' +
    'habit_id TEXT NOT NULL, ' +
    'date TEXT NOT NULL, ' +
    'completed_at TEXT NOT NULL, ' +
    'PRIMARY KEY (habit_id, date));',

  'CREATE TABLE IF NOT EXISTS items (' +
    'id TEXT PRIMARY KEY NOT NULL, ' +
    'title TEXT NOT NULL, ' +
    'category TEXT, ' +
    'priority TEXT, ' +
    'due_date TEXT, ' +
    'done INTEGER NOT NULL DEFAULT 0, ' +
    'created_at TEXT NOT NULL, ' +
    'completed_at TEXT);',
  'CREATE INDEX IF NOT EXISTS idx_items_due ON items(due_date);',

  'CREATE TABLE IF NOT EXISTS diary (' +
    'date TEXT PRIMARY KEY NOT NULL, ' +
    "title TEXT NOT NULL DEFAULT '', " +
    "body TEXT NOT NULL DEFAULT '', " +
    'created_at TEXT NOT NULL, ' +
    'updated_at TEXT NOT NULL);',

  'CREATE TABLE IF NOT EXISTS memos (' +
    'id TEXT PRIMARY KEY NOT NULL, ' +
    'content TEXT NOT NULL, ' +
    'pinned INTEGER NOT NULL DEFAULT 0, ' +
    'created_at TEXT NOT NULL, ' +
    'updated_at TEXT NOT NULL);',

  'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);',
];

export function createSchemaSql(): string {
  return STATEMENTS.join('\n');
}
