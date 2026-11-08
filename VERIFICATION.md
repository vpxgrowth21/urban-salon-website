# Verification record — 8 November 2026

This record describes the frontend demonstration only. No production database, authorization, messaging or cross-device concurrency was tested or claimed.

| Check                                             | Result                                                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `npm run lint`                                    | Passed, no warnings/errors                                                             |
| `npm run typecheck`                               | Passed, strict TypeScript                                                              |
| `npm test`                                        | 24 tests passed                                                                        |
| `npm run build`                                   | Passed, Next.js 16.4.5 / Webpack, 101 generated static pages plus dynamic routes       |
| `BASE_URL=http://localhost:3007 npm run test:e2e` | 17 Chrome tests passed, 25.3 seconds                                                   |
| Dependency installation audit                     | 0 known vulnerabilities after patching the lint tool's minimatch transitive dependency |
| Local HTTP response                               | 200 with `X-Robots-Tag: noindex, nofollow`                                             |
| Hosted deployment                                 | Not performed: Vercel returned 403 for the existing team's access grant                |

## Verified customer and owner journey

Service search/filter/detail → preselected service → variant and add-on options → duration/cleanup-aware mock times → validated sample name/Indian mobile/policy → pending request → browser-local status → owner approval in a second tab → status storage-event update → reload persistence → cancellation/release.

Also tested: empty search, gallery category filters/keyboard/Escape, bridal enquiry and owner visibility, service price editing, proposed-time acceptance with revalidation, service visibility, sample hours, conflict scenario, hold expiry, decline, reset, invalid status, not-found handling and all public routes.

Unit tests use an injected clock to cover past/closed/invalid/out-of-window dates, notice/hours, overlapping full durations and cleanup, multi-service totals, options/add-ons, unverified prices, phone normalization, idempotency, high-entropy mock tokens, hold expiry, confirmed allocation protection, immutable booking price snapshots, invalid transitions, proposal conflicts, outcomes, local persistence/malformed JSON, hours, enquiries and deterministic SSR hydration snapshots.

The core browser journey recorded no page errors and no outbound provider/API requests. All assets are local. No Supabase, Gmail, WhatsApp notification, auth or payment SDK is present.

## Responsive and accessibility checks

Chrome checked six representative pages at each width: 320, 360, 375, 390, 412, 430, 768, 1024, 1440 and 1920px. No document-level horizontal overflow was found. A mobile customer journey completed at 390×844; its status layout was also checked at 844×390 landscape.

Axe checked WCAG 2 A/AA and 2.1 AA tags on the homepage, services, booking service selection, bridal, gallery, owner demo, plus date/time and customer-details booking steps at 390px. Final run: no automated violations. Low-contrast captions found in initial runs were corrected. This is automated coverage, not a complete WCAG conformance audit. Keyboard gallery controls, focus-managed dialog dismissal and reduced-motion CSS are included. Real-device Safari/Android, screen-reader, mobile-keyboard and Lighthouse/Core Web Vitals measurement remain manual follow-up checks.

## Visual inspection

Inspected desktop and mobile homepage screenshots, booking time selection and owner dashboard. Initial lazy-image screenshot gaps were addressed by triggering images before full-page capture. Replaced an unsuitable stock product photo with a facial-treatment photograph and included labelled Indian bridal inspiration.

Preview images are in `artifacts/previews/` (ignored by Git). `scripts/capture-preview.mjs` reproduces them against a running preview. Playwright's HTML report is in `playwright-report/` and transient test screenshots are in `test-results/` (also ignored).

## Deployment limitation

The existing Vercel connection can list project metadata but cannot access the target team `ved-patels-projects-8e5221d6`. The team request returned 403 with a request to authorize the existing connection's team access. No other project, database, domain or external account configuration was modified. See `DEPLOYMENT.md` for exact manual steps if team authorization is unavailable.

The final complete browser run also checks that selected add-on names survive in the customer/owner request snapshots. The mobile summary is compact on the first two steps and fully expanded before submission. All 17 tests passed again after these refinements.
