# Data Science Club Recruitment

A responsive recruitment experience for the Data Science Club at USTHB. The Next.js app uses Tailwind CSS, MongoDB, and Vercel. Applicants explore a Minecraft-inspired world, rank up to three optional department interests (not confirmed placements), complete a five-step application, and receive a saved local draft while they work.

## Run locally

1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and configure the values below.
4. Run `npm run dev` and open `http://localhost:3000`.

## Environment variables

- `MONGODB_URI`: MongoDB connection string. Applications are saved in the `submissions` collection.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: credentials for `/admin`.
- `ADMIN_SESSION_SECRET`: random secret of at least 32 characters used to sign the HTTP-only admin session cookie. Create one with `openssl rand -base64 48`.

Applications can be previewed and filtered by status, division, year, or search in the admin console. Admins can update review status and internal notes or export the filtered results to CSV. The admin console requires all three admin environment variables; keep them private and do not commit `.env.local`.

## Deploy to Vercel

Import `Datascienceclubusthb/Registration-Website` as a Next.js project and keep the default build settings. Add `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` to the Vercel project environment variables, then deploy. Configure MongoDB network access for your deployment. Registration returns a service-unavailable message if the database is not configured or reachable.

## Rebuilt functionality and source limits

The supplied Base44 material is a browser-saved site capture rather than the original source project or a connected database. It informed the seven department descriptions and the application/review workflow. Its original admin credentials, existing application data, and backend logic were not included, so the `/admin` dashboard, authentication, application storage, review statuses, filters, and CSV export are implemented here. No Base44 records are migrated.

## Recruitment deadline and visuals

The shared deadline in `src/lib/recruitment.ts` is **31 October 2026 at 23:59, Africa/Algiers (UTC+01:00)**. It drives the live homepage countdown, registration notice, closed-state UI, and server-side submission cutoff. Change this single value and its display label for a new recruitment round.

The current campaign follows the five supplied poster references: cream backgrounds, near-black condensed Anton headings, orange accents, detailed floating voxel islands, and the unchanged official DSC logo. Anton and Space Grotesk are self-hosted with OFL licenses. Tokens and campaign styles live in `src/app/campaign.css`; shared illustration, location marker, button and brand components live in `src/components/world-ui.tsx`.

The original generated campaign illustrations are optimized local assets: `public/world/portal.webp` (181 KB) and `public/world/islands.webp` (422 KB). The latter is one 3×3 illustration sheet reused for seven departments, collaboration and confirmation. No runtime WebGL, external fonts or animation package is needed. Earlier landscape-generation scripts and artwork are retained as archives, not used by the current campaign.

New submissions accept zero to three unique, ordered department IDs in `choices`. Invalid IDs and duplicate preferences are rejected. Historical submitted records remain unchanged; legacy drafts keep their first three valid unique preferences. Experience, learning goals and project ideas are optional. Required consent is recorded server-side with a timestamp and notice version. `/privacy` describes application data use and local draft storage.

Each application draft has a browser-generated UUID, stored server-side in `applicationKey` with a unique sparse index. Repeated requests for the same key return the existing reference rather than creating another record. Historical submissions have no key and remain compatible. This prevents retries from duplicating a draft; it does not restrict separate applications by email. Allow Mongoose to create the schema index in Atlas (the existing connection uses automatic index creation).

Authorized admins can pause or reopen applications with `/api/admin/recruitment`. The setting is persisted in the `recruitments` collection. With no setting yet, recruitment is enabled until the fixed deadline. Reopening never overrides the deadline. `/api/recruitment` exposes only public availability and the deadline. The frontend refreshes availability on focus and every minute; the submission API checks the current setting before every new write. A database outage blocks submission without losing the draft.

The Instagram destination was verified from the club’s existing official website at https://datascienceclubusthb.netlify.app/ and is maintained in `src/config/site.ts`.

## UI verification

Run `node --test tests/registration-preference.test.cjs` for isolated preference/API/model checks. For browser verification, start the app on port 3100, install Playwright in a separate tools directory, and run `node scripts/verify-ui.cjs /absolute/path/to/tools/node_modules`. The script uses Chromium, mocks every API request, fixes the test clock, and saves screenshots in `/tmp`. It checks responsive layouts, keyboard navigation, registration, draft restoration, the deadline, admin notes, and recruitment controls. It never submits a real application.

## Submission reliability and student matricule

New applications require a student matricule (text, up to 40 characters, preserving leading zeros). It appears in the review, admin details/search, and CSV export. Existing records without this field remain readable.

A failed public availability check no longer disables submission; the API still enforces the deadline and administrative pause. Submissions have a 20-second browser timeout with retry-safe keys and readable errors for non-JSON responses. MongoDB connections have a 12-second request-level wait limit to handle slow SRV/TXT DNS while retaining one shared in-flight connection attempt.

Verification: 12 isolated tests, mocked browser retry after an availability outage and an HTTP 503 response, production build, and an actual API/Atlas persistence-and-retry test using a temporary collection that was removed afterward. During local verification, system SRV/TXT resolution intermittently timed out; verified DNS seed records were used only in the isolated test process, without changing the app’s environment configuration.
