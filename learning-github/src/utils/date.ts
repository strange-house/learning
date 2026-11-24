import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);
dayjs.locale('zh-cn');

export function todayKey(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function addDaysKey(date: string, delta: number): string {
  return dayjs(date).add(delta, 'day').format('YYYY-MM-DD');
}

export function dayHeader(date: string): { date: string; weekday: string; full: string } {
  const d = dayjs(date);
  return { date: d.format('M月D日'), weekday: d.format('dddd'), full: d.format('YYYY年M月D日 dddd') };
}

/** 未来事项的展示：明天 / 后天，超过 2 天显示具体日期 */
export function futureLabel(date: string, base?: string): string {
  const d = dayjs(date);
  const b = dayjs(base || todayKey());
  const diff = d.startOf('day').diff(b.startOf('day'), 'day');
  if (diff === 1) return '明天';
  if (diff === 2) return '后天';
  return d.format('M月D日');
}

/** 今天 / 昨天 / M月D日 */
export function friendlyDate(date: string): string {
  const d = dayjs(date);
  const t = dayjs();
  if (d.isSame(t, 'day')) return '今天';
  if (d.isSame(t.subtract(1, 'day'), 'day')) return '昨天';
  return d.format('M月D日');
}

export function shortDate(date: string): string {
  return dayjs(date).format('M月D日');
}
