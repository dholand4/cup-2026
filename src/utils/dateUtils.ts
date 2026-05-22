import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

const BR = 'America/Sao_Paulo';

export const formatTime = (utcDate: string): string =>
  dayjs(utcDate).tz(BR).format('HH:mm');

export const formatDate = (utcDate: string): string =>
  dayjs(utcDate).tz(BR).format('DD/MM · HH:mm');

export const formatDayLabel = (utcDate: string): string =>
  dayjs(utcDate).tz(BR).format('dddd, DD [de] MMMM');

export const formatDayShort = (utcDate: string): string =>
  dayjs(utcDate).tz(BR).format('ddd · DD MMM').toUpperCase();

export const isToday = (utcDate: string): boolean =>
  dayjs(utcDate).tz(BR).isSame(dayjs().tz(BR), 'day');

export const isTomorrow = (utcDate: string): boolean =>
  dayjs(utcDate).tz(BR).isSame(dayjs().tz(BR).add(1, 'day'), 'day');

export const timeAgo = (utcDate: string): string =>
  dayjs(utcDate).tz(BR).fromNow();

export function groupByDate<T extends { utcDate: string }>(
  items: T[],
): Map<string, T[]> {
  return items.reduce((map, item) => {
    const key = dayjs(item.utcDate).tz(BR).format('YYYY-MM-DD');
    return map.set(key, [...(map.get(key) ?? []), item]);
  }, new Map<string, T[]>());
}
