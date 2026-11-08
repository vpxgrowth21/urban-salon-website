# Vercel demonstration deployment

No Supabase or other API credentials are needed. Use an existing authorized developer-controlled Vercel account; do not connect client production infrastructure during this phase.

## Vercel dashboard with Git

1. Put this checkout in the agreed repository, excluding `.next`, `node_modules`, `.env*` (except `.env.example`), test artifacts and `.vercel` state.
2. In the existing Vercel account choose Add New → Project and import that repository. Select **Next.js** and use the repository root directory.
3. Use `npm ci` for installation and `npm run build` for the build. Leave Output Directory at the Next.js default. Select Node.js 24 (20.9+ minimum).
4. Set `NEXT_PUBLIC_DEMO_MODE=true`. No secrets are required. Canonical URLs, the sitemap and social image URLs default to https://urban-salon-website.vercel.app. To verify an isolated preview end to end, set `NEXT_PUBLIC_SITE_URL` to its verified public origin in the preview environment. Update the production value when an approved branded domain is ready.
5. Deploy to a dedicated demonstration project or preview branch. Keep production business accounts isolated.
6. Verify `/`, `/services`, `/book`, `/bridal` and `/demo/admin` on the actual returned URL. Complete one sample request and owner approval in the same browser.
7. If deployment protection is enabled, use the project's supported shareable preview link for the client. Do not disable protection on unrelated projects.

## Existing authenticated Vercel CLI

```sh
npx vercel
```

Choose the authorized developer scope and a dedicated `urban-beauti-demo` project. This produces a preview deployment. The CLI may ask the account owner to authenticate if no session exists; do not share credentials in chat. Do not use `--prod` for the client's final salon site during this demo phase.

A local preview URL isn't a hosted deployment. Record only a verified returned deployment URL. This project does not claim a URL until deployment succeeds.

## Access observed during implementation

On 8 November 2026 the connected Vercel tool returned 403 when reading the existing team `ved-patels-projects-8e5221d6`: the connection needs a team access grant. No deployment was created. Authorize the existing connection's access to that team, then create a dedicated **preview** project/deployment from this source. Do not repurpose any unrelated project. Consent URLs are single-use and expire; request a fresh link if needed.
