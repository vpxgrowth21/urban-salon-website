# Architecture and production integration contract

## Current implementation

One Next.js application. No database, API handlers, auth or provider connections. Public pages use server routes with interactive client components. `DemoProvider` owns a browser-local `MockBookingGateway` instance. Components subscribe via `useSyncExternalStore`. Hydration reads versioned localStorage after mount; server rendering never accesses browser storage. Storage failure falls back to memory. Same-origin storage events update other tabs; these events do not provide atomic multi-tab or multi-device coordination.

- `src/lib/types.ts`: service hierarchy, safe integer paise, variants/addons, selections, booking item snapshots, explicit statuses, hold state, enquiries, hours, result types and gateway interface.
- `src/lib/demo/catalogue.ts`: single source for 84 illustrative services, categories, packages, gallery, FAQ and business config. Every service is `demo: true`, `priceIsVerified: false`.
- `src/lib/booking.ts`: mock domain rules and adapter. A clock can be injected for deterministic tests.
- `src/lib/format.ts`: INR and explicit Asia/Kolkata dates/times. Booking date/time strings are converted using the `+05:30` offset. No ambiguous local date parsing.
- `src/lib/i18n.ts`: English and draft Gujarati journey strings. Full reviewed translation is a later content task.
- `src/components/booking-flow.tsx`: three-step customer flow, selected services passed by URL, name/phone/policy validation, clear estimates and local-only submission.
- `src/components/booking-status.tsx`: local status, countdown, cancellation, proposal response and rebooking.
- `src/components/admin.tsx`: public simulation controls; no fake password security.
- `src/components/gallery.tsx`: Radix focus-managed lightbox; Escape/arrows/swipe.
- `src/app`: public sitemap, policies, route metadata, loading/error/not-found boundaries.

## Domain operations

`BookingGateway` describes service listing, variants, availability, request submission, status lookup, cancellation, owner requests, approval, decline and alternative time proposals. The mock also exposes proposal acceptance, outcomes, price/hours edits and reset/simulator controls. The current adapter returns `Result<T>` synchronously. Customer submission already awaits its result. A future remote adapter should provide Promise results, with async loading/error handling added to the owner and status boundaries. Do not treat the current browser implementation as a production security boundary.

Use an asynchronous production contract shaped as:

```ts
type AsyncGateway = {
  [K in keyof BookingGateway]: BookingGateway[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : never;
};
```

Production availability responses should include server time, resource identifiers and a revision. Requests need selections, preferred start, customer consent and an idempotency identifier. Server responses supply immutable service/price snapshots, reference, private status token, authoritative status and any valid hold expiry. Return typed conflict/validation/authorization/provider errors; do not optimistically claim confirmation.

## Mock scheduling rules

One exclusive sample resource; sequential multi-service duration + 10-minute cleanup, 30-minute start intervals, 60-minute notice and 30-day advance window. Illustrative hours initially 10 AM–7 PM, Tuesday closed. Hours, closed day and mock hold period can be edited in the owner demo. There is no staff selector with invented names.

Submission validates services, variants, add-ons, customer data, policy, date/window/hours, duration and overlap. Duplicate submission identifiers return the original request. A pending request holds the full interval for five minutes by default. Expiry releases the hold but keeps the pending request. Approval rechecks the full interval. Confirmed allocations never expire with the hold timer. Decline/cancellation releases the interval. Proposals release the old hold without reserving the new time; accepting rechecks and confirms only if available. Service snapshots protect historical request estimates from price edits.

States: `pending_approval`, `confirmed`, `declined`, `reschedule_proposed`, `cancelled`, `completed`, `no_show`. Hold states: `held`, `expired`, `released`, `allocated`. The UI separately labels requestable, selected, unavailable, held, pending and confirmed states.

## Future Supabase implementation — documentation only

Do not connect or create Supabase during the current phase. After approval:

1. Agree business-controlled ownership, isolated staging/production and policies.
2. Implement a remote gateway behind validated Next.js server actions/route handlers. Never trust browser duration, price, status, resource, user role or expiry.
3. Use Supabase Auth for a privately provisioned single owner, server-side authorization on every owner operation, protected media storage and strict RLS. No public owner signup or public appointment-table access.
4. Model service categories/subcategories, services, variants/addons, package inclusions, hours/closures, qualified resources/staff, appointments/items, allocations/holds, proposals, enquiries, status history, audit records and notification outbox. Build only tables with operational purpose.
5. Store UTC timestamps and integer paise; render in Asia/Kolkata. Freeze price/duration/name snapshots in appointment items.
6. Atomically acquire shared holds/allocations using PostgreSQL transactions and a resource/time-range exclusion constraint, full durations and cleanup included. Reap expired holds using authoritative server time. Idempotency keys must have a database uniqueness constraint.
7. Hash high-entropy, revocable/expiring status tokens. Minimise fields returned by guest status endpoints; enforce cancellation rules, rate limits and abuse controls. Do not expose sequential references as authentication.
8. Deliver owner alerts and customer updates through an approved provider and outbox. Record actual delivery states. Never claim a notification was sent based only on a UI action.
9. Test simultaneous requests/approvals against the database, authorization/RLS, token expiry, schedule changes, cancellation, provider failures and reconciliation.
10. Import only reviewed business content. Never migrate browser demo bookings or synthetic customers into production.

Production concurrency, security, privacy compliance and provider delivery have not been implemented or verified by this frontend demonstration.
