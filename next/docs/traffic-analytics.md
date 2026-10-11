# First-party website analytics decision

## Purpose and boundary

The admin traffic page measures public page views and selected contact-link clicks. This helps the school improve the mobile site and understand which pages lead to contact. It does not identify unique people, track across devices, or request browser permissions.

`app/api/track/route.ts` is the ingestion boundary; `prisma/schema.prisma` is the data model; `actions/admin.ts` and `app/admin/traffic` are the admin-only read surface. Google Analytics remains separate.

## Visit data

Only page views receive detailed metadata: public IP from Vercel's trusted forwarding header, approximate country/region/city from Vercel IP headers, user-agent-derived device category/model and OS/browser versions when present, browser screen and viewport size in CSS pixels, and the referring website origin. No raw user agent, query string, exact GPS position, camera, microphone, contacts, or high-entropy client-hint request is recorded. Browser-reported models and versions may be incomplete or generic.

Click events keep their existing page/type/locale counts and do not receive the new visit details. The public notice at `/<locale>/privacy` explains this collection without a popup.

## Access and retention

Only ADMIN and SUPER_ADMIN sessions may read the traffic dashboard. A daily Vercel Cron request to `/api/cron/redact-traffic`, authenticated with the production `CRON_SECRET`, clears IP, location, referrer, device, browser, and screen fields for page views older than 30 days. Page, type, locale, and timestamp remain for historical totals. Check the cron job's execution after release; a missing secret fails closed with 401 and leaves records unredacted until fixed.

## Release and recovery

1. The production Vercel build runs `prisma migrate deploy` before `next build`. Preview builds do not migrate. The new migration contains nullable columns, so the previous app version remains compatible if the build fails or is rolled back.
2. Set `CRON_SECRET` in Vercel production as a random secret of at least 16 characters. Do not place its value in Git or logs.
3. Build and verify the preview; stage a production build; promote only after its migration, build, and secret are confirmed.
4. Verify a public page records a visit, dashboard details are admin-only, no permission request appears, and the cron route rejects unauthenticated requests. Confirm the cron is registered and inspect its first scheduled run in Vercel logs.
5. If application rollback is needed, promote the previous deployment. The additive columns may stay in place. Ensure retention continues during a rollback because the previous deployment does not include this cron job.
