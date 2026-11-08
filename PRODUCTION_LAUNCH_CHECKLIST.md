# Production launch gates

The frontend cannot enter production mode by configuration alone. The prebuild check rejects `NEXT_PUBLIC_DEMO_MODE=false` until that guard is deliberately replaced by reviewed production validation.

## Ownership and environments

- [ ] Owner-approved business email and responsibility for billing/support.
- [ ] Client-owned or contractually agreed repository, Vercel and Supabase projects.
- [ ] Separate demo/staging/production; approved collaborator roles, no shared passwords.
- [ ] Production secrets set through hosting controls; no browser service-role key or committed secrets.

## Content

- [ ] Every enabled service and price reviewed/verified; all demo prices excluded from official publication.
- [ ] Real contact details, hours, closures, map, policies, treatment suitability copy and brand approved.
- [ ] Demo stock imagery replaced with approved media; genuine optional reviews only.
- [ ] Translation review complete before exposing Gujarati switching.
- [ ] Offers require publication approval, eligibility/terms and automatic expiry filtering.

## Booking, security and operations

- [ ] Implement the asynchronous remote booking adapter and server-side validation.
- [ ] Privately provision the owner; enforce authentication, permissions and RLS on all protected operations.
- [ ] Agree resource/qualification model, temporary-hold policy, expiry and approval expectations.
- [ ] Transactional idempotency and database-level full-interval overlap prevention, including buffer.
- [ ] Concurrent holds/approvals tested against PostgreSQL, including expired-hold races and proposal acceptance.
- [ ] High-entropy hashed, expiring/revocable status tokens; guest cancellation policy and rate limits.
- [ ] Secure validated media uploads, audit log, enquiry storage and retention/deletion workflows.
- [ ] Notification outbox and real provider setup; delivery failure handling and reliable owner alerting.
- [ ] Attendance/reminders configurable and approved; no automatic blacklist or deposits added by default.
- [ ] Never migrate localStorage demo bookings or synthetic customers into the live system.

## Release

- [ ] Owner/legal approval of privacy, terms and booking policies.
- [ ] Production content guard validates verified prices and required business config.
- [ ] Customer/owner browser → API → data → status journey verified with real staging persistence.
- [ ] Database security tests, lint/type/unit/E2E/build checks pass.
- [ ] Mobile and accessibility QA, real-device Safari/Android checks and performance measurement completed.
- [ ] Demo stays noindex. Only remove production noindex after approved metadata, canonical origin, verified LocalBusiness details and sitemap.
- [ ] Backups, recovery, alerts, incident response and handover agreed.

This demo has no production auth, database constraints, secure external status endpoint or notification delivery. None should be inferred from its simulated interactions.
