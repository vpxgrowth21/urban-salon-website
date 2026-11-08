import { z } from 'zod';
import { services } from './demo/catalogue';
import { addDays, instant, localDate, timeLabel } from './format';
import type {
  Booking,
  BookingGateway,
  BookingItem,
  BookingStatus,
  DemoState,
  Enquiry,
  Hours,
  RequestPayload,
  Result,
  Selection,
  Service,
  Slot,
} from './types';
export const STORAGE_KEY = 'urban-beauti-demo-v1';
export const defaultHours: Hours = {
  open: 10,
  close: 19,
  closedDay: 2,
  buffer: 10,
  holdMinutes: 5,
  noticeMinutes: 60,
  advanceDays: 30,
};
export const customerSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(80),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s()-]/g, '').replace(/^\+91/, ''))
    .refine((v) => /^[6-9]\d{9}$/.test(v), 'Enter a valid 10-digit Indian mobile number.'),
  note: z.string().max(500, 'Please keep notes under 500 characters.'),
  policy: z.boolean().refine((v) => v, 'Please acknowledge the demo booking policy.'),
});
export function selectionItems(
  selections: Selection[],
  catalogue: Service[],
): Result<BookingItem[]> {
  if (!selections.length) return { ok: false, error: 'Choose at least one service.' };
  if (new Set(selections.map((s) => s.serviceId)).size !== selections.length)
    return { ok: false, error: 'Each service can only be selected once.' };
  const items: BookingItem[] = [];
  for (const selection of selections) {
    const s = catalogue.find((s) => s.id === selection.serviceId && s.active);
    if (!s || s.price === null)
      return {
        ok: false,
        error: 'This service needs a consultation. Please use the bridal or contact enquiry.',
      };
    const v = s.variants?.find((v) => v.id === selection.variantId);
    if (s.variants?.length && !v) return { ok: false, error: `Choose an option for ${s.name}.` };
    const ids = selection.addonIds || [];
    const addons = ids.map((id) => s.addons?.find((a) => a.id === id));
    if (new Set(ids).size !== ids.length || addons.some((a) => !a))
      return { ok: false, error: 'Invalid add-on selection.' };
    items.push({
      serviceId: s.id,
      name: s.name,
      variant: v?.name,
      addons: addons.map((addon) => addon!.name),
      price: (v?.price ?? s.price) + addons.reduce((n, a) => n + a!.price, 0),
      duration: (v?.duration ?? s.duration) + addons.reduce((n, a) => n + a!.duration, 0),
    });
  }
  return { ok: true, value: items };
}
export function initialState(now = Date.now()): DemoState {
  const state: DemoState = {
    version: 1,
    services: structuredClone(services),
    bookings: [],
    enquiries: [],
    hours: { ...defaultHours },
  };
  let date = addDays(localDate(new Date(now)), 1);
  if (new Date(instant(date)).getUTCDay() === 2) date = addDays(date, 1);
  const seed = (id: string, name: string, time: string, status: BookingStatus): Booking => ({
    id,
    token: `sample-${id}-demo-only`,
    reference: `UB-DEMO-${id}`,
    idempotencyKey: id,
    name,
    phone: 'Synthetic contact',
    note: 'Synthetic demonstration request.',
    date,
    time,
    duration: 60,
    total: 120000,
    items: [
      { serviceId: 'hydrating-facial', name: 'Hydrating Facial', price: 120000, duration: 60 },
    ],
    status,
    holdState: status === 'confirmed' ? 'allocated' : 'held',
    holdExpiresAt: now + 300000,
    createdAt: now,
    history: [{ at: now, message: 'Synthetic request seeded for demonstration.' }],
  });
  state.bookings = [
    seed('1001', 'Sample Guest A', '11:00', 'pending_approval'),
    seed('1002', 'Sample Guest B', '14:00', 'confirmed'),
  ];
  return state;
}
export class MockBookingGateway implements BookingGateway {
  private state: DemoState;
  // Hydrating a streamed route must always see the exact deterministic SSR snapshot,
  // even if the provider effect has already restored browser-local records.
  private serverSnapshot: DemoState = {
    version: 1,
    services: structuredClone(services),
    bookings: [],
    enquiries: [],
    hours: { ...defaultHours },
  };
  private hydrated = false;
  private listeners = new Set<() => void>();
  private storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  constructor(
    private now: () => number = Date.now,
    seed?: DemoState,
  ) {
    this.state = seed || initialState(now());
  }
  getSnapshot = () => this.state;
  getServerSnapshot = () => this.serverSnapshot;
  getReady = () => this.hydrated;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  hydrate(storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>) {
    this.storage = storage;
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (
          s.version === 1 &&
          Array.isArray(s.services) &&
          Array.isArray(s.bookings) &&
          Array.isArray(s.enquiries) &&
          s.hours
        )
          this.state = s;
      }
    } catch {
      /* Browser storage may be unavailable. Continue in memory. */
    }
    this.hydrated = true;
    this.expireHolds();
    this.emit();
  }
  sync(raw: string | null) {
    try {
      if (raw) {
        const s = JSON.parse(raw);
        if (s.version === 1 && Array.isArray(s.services) && Array.isArray(s.bookings) && s.hours) {
          this.state = s;
          this.expireHolds();
          this.listeners.forEach((fn) => fn());
        }
      }
    } catch {
      /* Ignore malformed browser data. */
    }
  }
  private emit() {
    this.state = { ...this.state };
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      /* In-memory demo remains usable. */
    }
    this.listeners.forEach((fn) => fn());
  }
  reset() {
    this.state = initialState(this.now());
    this.emit();
  }
  listServices() {
    return this.state.services.filter((s) => s.active);
  }
  getServiceVariants(id: string) {
    return this.state.services.find((s) => s.id === id)?.variants || [];
  }
  getOwnerRequests() {
    return this.state.bookings;
  }
  getRequestStatus(token: string) {
    return this.state.bookings.find((b) => b.token === token);
  }
  expireHolds() {
    let changed = false;
    this.state.bookings = this.state.bookings.map((b) => {
      if (b.holdState === 'held' && b.holdExpiresAt <= this.now()) {
        changed = true;
        return {
          ...b,
          holdState: 'expired',
          history: [
            ...b.history,
            {
              at: this.now(),
              message: 'Demo hold expired. Availability must be checked again before approval.',
            },
          ],
        };
      }
      return b;
    });
    if (changed) this.emit();
  }
  private dateError(date: string) {
    const today = localDate(new Date(this.now()));
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(instant(date)) ||
      localDate(new Date(instant(date))) !== date
    )
      return 'Choose a valid date.';
    if (date < today) return 'Past dates cannot be requested.';
    if (date > addDays(today, this.state.hours.advanceDays))
      return `Choose a date within ${this.state.hours.advanceDays} days.`;
    if (new Date(instant(date)).getUTCDay() === this.state.hours.closedDay)
      return 'The illustrative salon schedule is closed on this day.';
    return null;
  }
  private conflict(date: string, time: string, duration: number, exclude?: string) {
    const start = instant(date, time),
      end = start + (duration + this.state.hours.buffer) * 60000;
    return this.state.bookings.find(
      (b) =>
        b.id !== exclude &&
        (b.status === 'confirmed' || (b.holdState === 'held' && b.holdExpiresAt > this.now())) &&
        start < instant(b.date, b.time) + (b.duration + this.state.hours.buffer) * 60000 &&
        end > instant(b.date, b.time),
    );
  }
  private validateTime(date: string, time: string, duration: number, exclude?: string) {
    const error = this.dateError(date);
    if (error) return error;
    if (!/^([01]\d|2[0-3]):[03]0$/.test(time)) return 'Choose an available half-hour time.';
    const start = instant(date, time);
    if (start < this.now() + this.state.hours.noticeMinutes * 60000)
      return 'This time is too soon. Choose a later appointment.';
    if (
      start < instant(date, `${String(this.state.hours.open).padStart(2, '0')}:00`) ||
      start + (duration + this.state.hours.buffer) * 60000 >
        instant(date, `${String(this.state.hours.close).padStart(2, '0')}:00`)
    )
      return 'The full treatment and cleanup must fit within illustrative opening hours.';
    if (this.conflict(date, time, duration, exclude))
      return 'That time conflicts with a demo hold or confirmed appointment. Please choose another time.';
    return null;
  }
  getAvailability(selections: Selection[], date: string): Slot[] {
    const result = selectionItems(selections, this.state.services);
    if (!result.ok || this.dateError(date)) return [];
    const duration = result.value.reduce((n, i) => n + i.duration, 0);
    const slots: Slot[] = [];
    for (let m = this.state.hours.open * 60; m < this.state.hours.close * 60; m += 30) {
      const time = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      const reason = this.validateTime(date, time, duration);
      const b = this.conflict(date, time, duration);
      slots.push({
        time,
        label: timeLabel(time),
        state: reason
          ? b
            ? b.status === 'confirmed'
              ? 'confirmed'
              : 'held'
            : 'unavailable'
          : 'requestable',
        reason: reason || undefined,
      });
    }
    return slots;
  }
  submitAppointmentRequest(p: RequestPayload): Result<Booking> {
    this.expireHolds();
    const duplicate = this.state.bookings.find((b) => b.idempotencyKey === p.idempotencyKey);
    if (duplicate) return { ok: true, value: duplicate };
    const customer = customerSchema.safeParse(p);
    if (!customer.success) return { ok: false, error: customer.error.issues[0].message };
    if (!p.idempotencyKey) return { ok: false, error: 'Missing request identifier.' };
    const result = selectionItems(p.selections, this.state.services);
    if (!result.ok) return result;
    const duration = result.value.reduce((n, i) => n + i.duration, 0);
    const error = this.validateTime(p.date, p.time, duration);
    if (error) return { ok: false, error };
    const id = crypto.randomUUID();
    const b: Booking = {
      id,
      token: crypto.randomUUID() + crypto.randomUUID(),
      reference: `UB-DEMO-${id.slice(0, 6).toUpperCase()}`,
      idempotencyKey: p.idempotencyKey,
      ...customer.data,
      date: p.date,
      time: p.time,
      duration,
      total: result.value.reduce((n, i) => n + i.price, 0),
      items: result.value,
      status: 'pending_approval',
      holdState: 'held',
      holdExpiresAt: this.now() + this.state.hours.holdMinutes * 60000,
      createdAt: this.now(),
      history: [
        {
          at: this.now(),
          message: 'Demo request received; mock hold created. No notification sent.',
        },
      ],
    };
    this.state.bookings = [b, ...this.state.bookings];
    this.emit();
    return { ok: true, value: b };
  }
  private update(
    id: string,
    allowed: BookingStatus[],
    patch: Partial<Booking>,
    message: string,
  ): Result<Booking> {
    const b = this.state.bookings.find((b) => b.id === id);
    if (!b) return { ok: false, error: 'Demo request not found.' };
    if (!allowed.includes(b.status))
      return { ok: false, error: 'This action is not allowed for the current request status.' };
    const next = { ...b, ...patch, history: [...b.history, { at: this.now(), message }] };
    this.state.bookings = this.state.bookings.map((b) => (b.id === id ? next : b));
    this.emit();
    return { ok: true, value: next };
  }
  approveRequest(id: string): Result<Booking> {
    this.expireHolds();
    const b = this.state.bookings.find((b) => b.id === id);
    if (!b) return { ok: false, error: 'Request not found.' };
    const error = this.validateTime(b.date, b.time, b.duration, id);
    if (error) return { ok: false, error };
    return this.update(
      id,
      ['pending_approval'],
      { status: 'confirmed', holdState: 'allocated' },
      'Owner approved this simulated appointment. No notification sent.',
    );
  }
  declineRequest(id: string) {
    return this.update(
      id,
      ['pending_approval', 'reschedule_proposed'],
      { status: 'declined', holdState: 'released' },
      'Owner declined the demo request; mock hold released.',
    );
  }
  cancelRequest(token: string) {
    const b = this.getRequestStatus(token);
    return this.update(
      b?.id || '',
      ['pending_approval', 'confirmed', 'reschedule_proposed'],
      { status: 'cancelled', holdState: 'released' },
      'Customer cancelled the demo request.',
    );
  }
  proposeAlternativeTime(id: string, date: string, time: string): Result<Booking> {
    const b = this.state.bookings.find((b) => b.id === id);
    if (!b) return { ok: false, error: 'Request not found.' };
    const error = this.validateTime(date, time, b.duration, id);
    if (error) return { ok: false, error };
    return this.update(
      id,
      ['pending_approval', 'confirmed', 'reschedule_proposed'],
      {
        status: 'reschedule_proposed',
        holdState: 'released',
        proposedDate: date,
        proposedTime: time,
      },
      'Alternative time proposed in the demo. Awaiting customer response; no slot reserved.',
    );
  }
  acceptProposal(token: string): Result<Booking> {
    const b = this.getRequestStatus(token);
    if (!b?.proposedDate || !b.proposedTime) return { ok: false, error: 'No time proposal found.' };
    const error = this.validateTime(b.proposedDate, b.proposedTime, b.duration, b.id);
    if (error) return { ok: false, error };
    return this.update(
      b.id,
      ['reschedule_proposed'],
      {
        status: 'confirmed',
        date: b.proposedDate,
        time: b.proposedTime,
        holdState: 'allocated',
        proposedDate: undefined,
        proposedTime: undefined,
      },
      'Customer accepted the simulated owner proposal after availability recheck.',
    );
  }
  markOutcome(id: string, status: 'completed' | 'no_show') {
    return this.update(
      id,
      ['confirmed'],
      { status, holdState: 'released' },
      `Owner marked the demo appointment ${status}.`,
    );
  }
  updateService(service: Service) {
    this.state.services = this.state.services.map((s) =>
      s.id === service.id ? { ...service, priceIsVerified: false, demo: true } : s,
    );
    this.emit();
  }
  updateHours(hours: Hours): Result<Hours> {
    if (
      !Number.isInteger(hours.open) ||
      !Number.isInteger(hours.close) ||
      hours.open < 0 ||
      hours.close > 23 ||
      hours.open >= hours.close ||
      hours.holdMinutes < 1 ||
      hours.holdMinutes > 60
    )
      return { ok: false, error: 'Use valid opening hours and a hold period from 1–60 minutes.' };
    this.state.hours = { ...hours };
    this.emit();
    return { ok: true, value: hours };
  }
  addEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt'>): Result<Enquiry> {
    const valid = customerSchema.safeParse({ ...enquiry, policy: true });
    if (!valid.success) return { ok: false, error: valid.error.issues[0].message };
    const e = { ...enquiry, ...valid.data, id: crypto.randomUUID(), createdAt: this.now() };
    this.state.enquiries = [e, ...this.state.enquiries];
    this.emit();
    return { ok: true, value: e };
  }
  simulateConflict(id: string): string {
    const b = this.state.bookings.find((b) => b.id === id);
    if (!b) return 'Choose a demo request first.';
    const conflict = this.validateTime(b.date, b.time, b.duration);
    return conflict || 'This expired or released slot is requestable again.';
  }
  expireNow(id: string) {
    const b = this.state.bookings.find((b) => b.id === id);
    if (b?.holdState === 'held') {
      b.holdExpiresAt = this.now() - 1;
      this.expireHolds();
    }
  }
}
