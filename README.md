# Urban Beauti Salon

A premium, responsive, **frontend-only demonstration** for a ladies-only salon in Gandhinagar. Built with Next.js App Router, React, strict TypeScript, Tailwind CSS, Radix Dialog, Lucide, React Hook Form and Zod.

## Run locally

Requires Node.js 20.9 or later (Node 24 recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No credentials or environment variables are required. `.env.example` documents optional configuration. The app is deliberately demo-only; setting `NEXT_PUBLIC_DEMO_MODE=false` fails the build rather than silently exposing illustrative content as production.

## Explore

- `/`: editorial homepage, category discovery, favourite treatments, inspiration and FAQ.
- `/services`: 84 illustrative services, search, category filters and price/duration sorting.
- `/services/hair-spa`: detail view, length variants and add-on details.
- `/bridal`: consultation enquiry, separate from routine time-slot booking.
- `/gallery`: filtered inspiration gallery, accessible lightbox, keyboard and swipe navigation.
- `/about`, `/contact`, `/offers`: honest provisional content; no invented contact details, offers or reviews.
- `/book?service=hair-spa`: three-step service → time → details flow.
- `/booking/[token]`: local request status, proposal response, cancellation and rebooking.
- `/demo/admin`: **public demonstration**, no password. Requests, calendar, price/service edits, hours, enquiries and simulator controls.
- `/privacy`, `/terms`, `/booking-policy`: draft notices requiring review before production.

## What actually works

Service discovery, multi-service estimates, variants/add-ons, date selection, duration/buffer-aware mock availability, Indian phone validation, idempotent simulated submission, temporary holds, expiry, conflict responses, owner approve/decline/propose, proposal acceptance with revalidation, cancellation, completion/no-show outcomes, local enquiry storage, editable service prices/content/visibility/images and sample business hours, price CSV export, and predictable demo reset.

## What is simulated

All appointments, availability, customers, temporary holds, owner decisions and enquiries. Data is stored in this browser's `localStorage` (`urban-beauti-demo-v1`), with an in-memory fallback if storage fails. Same-origin browser tabs receive storage events. **This is not shared persistence or concurrency protection. Different devices do not coordinate.** A status link is only useful where its browser-local record exists.

The owner demo is public and can read all demo information saved in that browser. Use sample names and mobile numbers only. No data is sent to Supabase, Gmail, WhatsApp, a notification service or payment provider. Reset in `/demo/admin` or clear site data to remove local records. There are no real authentication or backend APIs. No database migrations were created or executed, as required by the frontend-only override.

All service prices, hours and photography are clearly labelled demonstration content. Final rates, contact details, credentials, reviews, team and history are not invented. All routes are `noindex` through metadata, HTTP headers and `robots.txt`. Offers are empty until approved; the reviews section is intentionally absent.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright uses the installed Google Chrome channel. Install Chrome or change `channel` in `playwright.config.ts` to your installed Playwright browser. E2E tests start/reuse the production server at port 3000; run `npm run build` first. Set `BASE_URL` to test an already running server. Unit tests cover booking rules and storage with a deterministic clock. Browser tests include the full request/approval/status flow, rescheduling, enquiries, editing and responsive widths from 320 to 1920px. They use synthetic details.

The production build deliberately uses Webpack for reproducibility in restricted local execution environments. There are no remotely fetched build-time fonts; licensed fonts and demo photos are served locally. Next Image supplies responsive optimized images.

## Vercel preview

See `DEPLOYMENT.md`. This is a standard Next.js application with no database requirement. Keep it as a demonstration deployment, separate from the eventual production project. Existing deployment access must be available; never fabricate a preview URL.

## Documentation

- `CLIENT_DEMO_GUIDE.md`: presentation sequence and simulator scenarios.
- `ARCHITECTURE.md`: source modules, booking contract and future integration.
- `CLIENT_CONTENT_CHECKLIST.md`: decisions and assets needed from the owner.
- `PRODUCTION_LAUNCH_CHECKLIST.md`: launch gates and ownership transition.
- `ASSET_SOURCES.md`: local image/font provenance.

## Boundaries and remaining work

Gujarati strings have an initial dictionary but are **not** a complete reviewed translation; no language toggle is exposed. Production auth, database constraints, shared availability, secure external status access, retention enforcement, notifications, staff eligibility, holidays, manual live appointments, owner uploads, live offers and true reporting remain future work. CSV export is available; CSV import and service creation are not part of this demo. Do not switch this mock adapter into production merely by changing an environment variable. See the launch checklist.

See `VERIFICATION.md` for the executed checks and their exact scope. Final local verification: 24 domain tests, 17 Chrome tests, lint, strict typecheck and production build passed. Vercel publication remains blocked on the existing connection's team access grant; no hosted URL is claimed.
