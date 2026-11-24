export const PRIORITIES = ['A', 'S', 'SS', 'SSS'] as const;
export type Priority = (typeof PRIORITIES)[number];
export const DEFAULT_PRIORITY: Priority = 'A';
export const PRIORITY_WEIGHT: Record<Priority, number> = { A: 0, S: 1, SS: 2, SSS: 3 };

export function isPriority(v: string | null | undefined): v is Priority {
  return typeof v === 'string' && (PRIORITIES as readonly string[]).includes(v);
}

export function normalizePriority(v: string | null | undefined): Priority {
  return isPriority(v) ? v : DEFAULT_PRIORITY;
}

export function priorityWeight(v: string | null | undefined): number {
  return PRIORITY_WEIGHT[normalizePriority(v)];
}
