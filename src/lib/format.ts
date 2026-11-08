import type { Service } from './types';
export const money = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
export function priceLabel(s: Service) {
  if (s.price === null || s.priceType === 'consultation') return 'On consultation';
  if (s.priceType === 'range') return `${money(s.price)}–${money(s.maxPrice || s.price)}`;
  return `${s.priceType === 'from' || s.priceType === 'variant' ? 'From ' : ''}${money(s.price)}`;
}
export function localDate(now: Date = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  return `${p.find((x) => x.type === 'year')!.value}-${p.find((x) => x.type === 'month')!.value}-${p.find((x) => x.type === 'day')!.value}`;
}
export const instant = (date: string, time = '12:00') =>
  new Date(`${date}T${time}:00+05:30`).getTime();
export function addDays(date: string, days: number) {
  return localDate(new Date(instant(date) + days * 86400000));
}
export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(instant(date)));
export const timeLabel = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
export const statusLabels = {
  pending_approval: 'Pending approval',
  confirmed: 'Confirmed',
  declined: 'Declined',
  reschedule_proposed: 'New time proposed',
  cancelled: 'Cancelled',
  completed: 'Completed',
  no_show: 'No-show',
};
