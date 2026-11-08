import { beforeEach, describe, expect, it } from 'vitest';
import { customerSchema, MockBookingGateway, selectionItems } from '../src/lib/booking';
import { services } from '../src/lib/demo/catalogue';
import { instant, localDate, money } from '../src/lib/format';
import type { RequestPayload, Result } from '../src/lib/types';
let now: number;
let gateway: MockBookingGateway;
const unwrap = <T>(r: Result<T>) => {
  if (!r.ok) throw new Error(r.error);
  return r.value;
};
const payload = (overrides: Partial<RequestPayload> = {}): RequestPayload => ({
  selections: [{ serviceId: 'hydrating-facial' }],
  date: '2026-11-09',
  time: '16:00',
  name: 'Demo Guest',
  phone: '9876543210',
  note: 'Synthetic test data',
  policy: true,
  idempotencyKey: crypto.randomUUID(),
  ...overrides,
});
beforeEach(() => {
  now = instant('2026-11-08', '09:00');
  gateway = new MockBookingGateway(() => now);
});
describe('catalogue and localised values', () => {
  it('contains distinct useful services with unverified demo prices', () => {
    expect(services.length).toBeGreaterThanOrEqual(60);
    expect(services.length).toBeLessThanOrEqual(90);
    expect(new Set(services.map((s) => s.id)).size).toBe(services.length);
    expect(services.every((s) => s.demo && !s.priceIsVerified)).toBe(true);
  });
  it('formats INR and uses the Indian date across a UTC boundary', () => {
    expect(money(120000)).toBe('₹1,200');
    expect(localDate(new Date('2026-11-08T20:00:00Z'))).toBe('2026-11-09');
  });
  it('requires a hair-length option and combines addons safely', () => {
    expect(selectionItems([{ serviceId: 'hair-spa' }], services).ok).toBe(false);
    const items = unwrap(
      selectionItems(
        [
          { serviceId: 'hair-spa', variantId: 'long', addonIds: ['massage'] },
          { serviceId: 'eyebrow-threading' },
        ],
        services,
      ),
    );
    expect(items[0].addons).toEqual(['Extra scalp massage']);
    expect(items.reduce((n, i) => n + i.duration, 0)).toBe(105);
    expect(items.reduce((n, i) => n + i.price, 0)).toBe(156000);
  });
  it('rejects duplicates, invalid addons and consultation-only bookings', () => {
    expect(
      selectionItems([{ serviceId: 'hair-spa', variantId: 'short', addonIds: ['bad'] }], services)
        .ok,
    ).toBe(false);
    expect(selectionItems([{ serviceId: 'bridal-makeup' }], services).ok).toBe(false);
    expect(
      selectionItems(
        [{ serviceId: 'signature-haircut' }, { serviceId: 'signature-haircut' }],
        services,
      ).ok,
    ).toBe(false);
  });
  it('normalises Indian phone numbers and requires policy acknowledgement', () => {
    expect(
      customerSchema.parse({ name: 'Demo Guest', phone: '+91 98765 43210', note: '', policy: true })
        .phone,
    ).toBe('9876543210');
    expect(
      customerSchema.safeParse({ name: 'A', phone: '123', note: '', policy: false }).success,
    ).toBe(false);
  });
});
describe('duration-aware availability', () => {
  it('rejects past dates, closed days and dates beyond the booking window', () => {
    for (const date of ['2026-11-07', '2026-11-10', '2026-12-20', '2026-02-30'])
      expect(gateway.submitAppointmentRequest(payload({ date })).ok).toBe(false);
  });
  it('rejects the past, minimum notice, invalid times and treatments crossing closing time', () => {
    for (const p of [
      { date: '2026-11-08', time: '09:30' },
      { time: '19:00' },
      { time: '18:00' },
      { time: '16:15' },
      { time: '99:00' },
    ])
      expect(gateway.submitAppointmentRequest(payload(p)).ok).toBe(false);
  });
  it('includes cleanup in overlap checks', () => {
    const r = unwrap(gateway.submitAppointmentRequest(payload({ time: '15:30' })));
    expect(r.duration).toBe(60);
    expect(gateway.submitAppointmentRequest(payload({ time: '16:30' })).ok).toBe(false);
    expect(gateway.submitAppointmentRequest(payload({ time: '17:00' })).ok).toBe(true);
  });
  it('rejects same and partially overlapping start times', () => {
    unwrap(gateway.submitAppointmentRequest(payload()));
    expect(gateway.submitAppointmentRequest(payload({ time: '16:30' })).ok).toBe(false);
    expect(gateway.submitAppointmentRequest(payload({ time: '15:30' })).ok).toBe(false);
  });
  it('returns labels for seeded held and confirmed availability', () => {
    const slots = gateway.getAvailability([{ serviceId: 'signature-haircut' }], '2026-11-09');
    expect(slots.find((s) => s.time === '11:00')?.state).toBe('held');
    expect(slots.find((s) => s.time === '14:00')?.state).toBe('confirmed');
  });
  it('combines multi-service duration against a single resource', () => {
    expect(
      gateway.submitAppointmentRequest(
        payload({
          time: '17:00',
          selections: [{ serviceId: 'signature-haircut' }, { serviceId: 'hydrating-facial' }],
        }),
      ).ok,
    ).toBe(true);
    expect(
      gateway.submitAppointmentRequest(
        payload({
          time: '17:30',
          selections: [{ serviceId: 'signature-haircut' }, { serviceId: 'hydrating-facial' }],
        }),
      ).ok,
    ).toBe(false);
  });
});
describe('requests, holds and transitions', () => {
  it('creates pending requests with opaque status tokens and stable price snapshots', () => {
    const b = unwrap(gateway.submitAppointmentRequest(payload()));
    expect(b.status).toBe('pending_approval');
    expect(b.holdState).toBe('held');
    expect(b.token.length).toBeGreaterThan(60);
    expect(gateway.getRequestStatus(b.reference)).toBeUndefined();
    gateway.updateService({ ...services.find((s) => s.id === 'hydrating-facial')!, price: 990000 });
    expect(gateway.getRequestStatus(b.token)?.total).toBe(120000);
  });
  it('submits idempotently without a duplicate request', () => {
    const p = payload();
    const a = unwrap(gateway.submitAppointmentRequest(p));
    const b = unwrap(gateway.submitAppointmentRequest(p));
    expect(b.id).toBe(a.id);
    expect(
      gateway.getOwnerRequests().filter((b) => b.idempotencyKey === p.idempotencyKey),
    ).toHaveLength(1);
  });
  it('releases expired pending holds and protects confirmed allocations from expiry', () => {
    const b = unwrap(gateway.submitAppointmentRequest(payload()));
    unwrap(gateway.approveRequest(b.id));
    now += 600000;
    gateway.expireHolds();
    expect(gateway.getRequestStatus(b.token)?.holdState).toBe('allocated');
    expect(gateway.submitAppointmentRequest(payload()).ok).toBe(false);
    const seed = gateway.getOwnerRequests().find((b) => b.id === '1001')!;
    expect(seed.holdState).toBe('expired');
  });
  it('declining a request releases its mock hold', () => {
    const b = unwrap(gateway.submitAppointmentRequest(payload()));
    unwrap(gateway.declineRequest(b.id));
    expect(gateway.getRequestStatus(b.token)?.holdState).toBe('released');
    expect(gateway.submitAppointmentRequest(payload()).ok).toBe(true);
  });
  it('rechecks availability before approving an expired request', () => {
    const a = unwrap(gateway.submitAppointmentRequest(payload()));
    now += 300001;
    gateway.expireHolds();
    const b = unwrap(gateway.submitAppointmentRequest(payload()));
    unwrap(gateway.approveRequest(b.id));
    expect(gateway.approveRequest(a.id).ok).toBe(false);
  });
  it('does not allow invalid transitions and supports customer cancellation', () => {
    const b = unwrap(gateway.submitAppointmentRequest(payload()));
    unwrap(gateway.cancelRequest(b.token));
    expect(gateway.approveRequest(b.id).ok).toBe(false);
    expect(gateway.declineRequest(b.id).ok).toBe(false);
    expect(gateway.cancelRequest('wrong-token').ok).toBe(false);
  });
  it('proposes without reserving and rechecks a competing hold on acceptance', () => {
    const a = unwrap(gateway.submitAppointmentRequest(payload()));
    unwrap(gateway.proposeAlternativeTime(a.id, '2026-11-11', '16:00'));
    expect(gateway.getRequestStatus(a.token)?.status).toBe('reschedule_proposed');
    expect(gateway.getRequestStatus(a.token)?.holdState).toBe('released');
    unwrap(gateway.submitAppointmentRequest(payload({ date: '2026-11-11' })));
    expect(gateway.acceptProposal(a.token).ok).toBe(false);
  });
  it('accepts an available proposal and preserves confirmed time after hold expiry', () => {
    const a = unwrap(gateway.submitAppointmentRequest(payload()));
    unwrap(gateway.proposeAlternativeTime(a.id, '2026-11-11', '16:00'));
    const accepted = unwrap(gateway.acceptProposal(a.token));
    expect(accepted.date).toBe('2026-11-11');
    expect(accepted.status).toBe('confirmed');
    now += 600000;
    gateway.expireHolds();
    expect(gateway.getRequestStatus(a.token)?.holdState).toBe('allocated');
  });
  it('records attendance outcomes only after confirmation', () => {
    const a = unwrap(gateway.submitAppointmentRequest(payload()));
    expect(gateway.markOutcome(a.id, 'completed').ok).toBe(false);
    unwrap(gateway.approveRequest(a.id));
    expect(unwrap(gateway.markOutcome(a.id, 'completed')).status).toBe('completed');
  });
  it('persists locally, recovers malformed storage and resets predictably', () => {
    let value: string | null = null;
    const storage = {
      getItem: () => value,
      setItem: (_key: string, v: string) => {
        value = v;
      },
      removeItem: () => {
        value = null;
      },
    };
    gateway.hydrate(storage);
    const a = unwrap(gateway.submitAppointmentRequest(payload()));
    const second = new MockBookingGateway(() => now);
    second.hydrate(storage);
    expect(second.getRequestStatus(a.token)?.id).toBe(a.id);
    second.reset();
    expect(second.getOwnerRequests()).toHaveLength(2);
    value = 'invalid JSON';
    expect(() => second.hydrate(storage)).not.toThrow();
  });
  it('updates sample hours while keeping confirmed bookings allocated', () => {
    const a = unwrap(gateway.submitAppointmentRequest(payload()));
    unwrap(gateway.approveRequest(a.id));
    unwrap(gateway.updateHours({ ...gateway.getSnapshot().hours, close: 16 }));
    expect(gateway.getRequestStatus(a.token)?.holdState).toBe('allocated');
    expect(gateway.submitAppointmentRequest(payload({ date: '2026-11-11' })).ok).toBe(false);
    expect(gateway.updateHours({ ...gateway.getSnapshot().hours, open: 20, close: 10 }).ok).toBe(
      false,
    );
  });
  it('stores enquiries only in the local adapter', () => {
    const e = unwrap(
      gateway.addEnquiry({
        kind: 'bridal',
        name: 'Demo Guest',
        phone: '9876543210',
        note: 'Sample wedding enquiry',
      }),
    );
    expect(gateway.getSnapshot().enquiries[0].id).toBe(e.id);
  });
  it('keeps a deterministic empty server snapshot after browser hydration', () => {
    const snapshot = gateway.getServerSnapshot();
    expect(snapshot.bookings).toHaveLength(0);
    gateway.hydrate({ getItem: () => null, setItem: () => {}, removeItem: () => {} });
    unwrap(gateway.submitAppointmentRequest(payload()));
    expect(gateway.getServerSnapshot()).toBe(snapshot);
    expect(snapshot.bookings).toHaveLength(0);
    expect(gateway.getReady()).toBe(true);
  });
});
