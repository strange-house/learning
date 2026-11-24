export const CATEGORIES = ['看书', '学习', '练习', '其他'] as const;
export type Category = (typeof CATEGORIES)[number];
export const DEFAULT_CATEGORY: Category = '其他';

export function isCategory(v: string | null | undefined): v is Category {
  return typeof v === 'string' && (CATEGORIES as readonly string[]).includes(v);
}

export function normalizeCategory(v: string | null | undefined): Category {
  return isCategory(v) ? v : DEFAULT_CATEGORY;
}
