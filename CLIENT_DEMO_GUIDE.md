# Client demonstration walkthrough

Start with `npm run build`, then `npm run start`, or use an actual verified Vercel preview. Use sample details only. No salon request, message or payment is created.

1. Open `/` at a 390px phone width. Show the compact brand, direct booking action and service shortcuts; then show the desktop editorial layout.
2. Open Services & Prices. Choose Hair, search “Hair Spa”, inspect its starting price and detail page. Explain that every rate is illustrative.
3. Click Choose options. Hair Spa is already selected. Choose Short/Medium/Long, optionally add the scalp massage. Continue to date/time.
4. Choose a future non-Tuesday date and a requestable time. Show total duration, cleanup, selected status and owner-review requirement. Enter “Demo Guest” and a synthetic valid-format Indian number (no call or message is made), acknowledge the demo policy and submit.
5. Show “Appointment Request Received”, Pending approval, sample reference, local status link, pay-at-salon note and explicit “not sent” disclosure. Keep this tab open.
6. Open `/demo/admin` in a second tab on the same origin. There is no login because it is a public synthetic-data demo. Select the new request and click Approve. Return to the customer status tab to show the status update and calendar allocation. Storage events synchronize this browser's tabs only.
7. Repeat with another request and Decline it, or cancel a confirmed request through its customer status link. Show how the full treatment interval becomes requestable again.
8. Use Propose a new time, choose a future open date/time, then open View customer demo status and accept. Explain that the proposed time isn't reserved and is checked again on acceptance.
9. In Simulator, click Simulate a conflict while an active hold/confirmed appointment exists. Click Expire a mock hold and show its released time. Confirmed allocations do not expire. The default hold is five minutes and is configurable under Business hours.
10. Under Services & Prices, change a demo price and save. Visit its catalogue/detail page and show the update. Change Hair Spa variant rates under Edit details & options. Existing requests retain original price snapshots. Toggle Visible to hide an unoffered service. CSV export downloads the current sample prices.
11. Change illustrative hours or the closed day, save, and show the changed booking times. These are not verified salon hours.
12. Submit a bridal consultation enquiry at `/bridal#enquire` and view it under Enquiries. Routine 30-minute slot selection is deliberately skipped for bridal consultations.
13. Use Gallery filters, open an image and navigate with arrows/keyboard/swipe. All imagery is labelled stock inspiration; it isn't presented as the salon's own work.
14. Finish with Reset demo to restore two seeded synthetic requests, the original catalogue/hours and no enquiries.

## Before presenting

Use a recent Chrome/Safari/Firefox version and wait for local images/fonts. If using a shared screen, keep names synthetic. Do not claim global reservation safety: different devices do not share data. A status URL cannot retrieve a booking from a different browser. There is no authentication, live owner alert or notification delivery.

## After client approval

Collect the content and decisions in `CLIENT_CONTENT_CHECKLIST.md`. Agree account ownership and billing, then implement the Supabase adapter, protected owner dashboard and shared scheduling described in `ARCHITECTURE.md`. Review `PRODUCTION_LAUNCH_CHECKLIST.md` before accepting a single real booking.
