import dayjs from 'dayjs';

export function formatCreatedAt(iso: string): string {
  const d = dayjs(iso);
  const now = dayjs();
  if (d.isSame(now, 'day')) return '今天 ' + d.format('HH:mm');
  if (d.isSame(now, 'year')) return d.format('M月D日 HH:mm');
  return d.format('YYYY年M月D日');
}

export function formatDateTime(iso: string): string {
  return dayjs(iso).format('YYYY年M月D日 HH:mm');
}
