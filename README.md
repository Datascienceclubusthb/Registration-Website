# Data Science Club Recruitment

A responsive recruitment experience for the Data Science Club at USTHB. The Next.js app uses Tailwind CSS, MongoDB, and Vercel. Applicants explore a Minecraft-inspired world, optionally indicate one department of interest (not a confirmed placement), complete a five-step application, and receive a saved local draft while they work.

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

Import `datascienceclubusthb-club/Registration-Website` as a Next.js project and keep the default build settings. Add `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` to the Vercel project environment variables, then deploy. Configure MongoDB network access for your deployment. Registration returns a service-unavailable message if the database is not configured or reachable.

## Rebuilt functionality and source limits

The supplied Base44 material is a browser-saved site capture rather than the original source project or a connected database. It informed the seven department descriptions and the application/review workflow. Its original admin credentials, existing application data, and backend logic were not included, so the `/admin` dashboard, authentication, application storage, review statuses, filters, and CSV export are implemented here. No Base44 records are migrated.

## Recruitment deadline and visuals

The shared deadline in `src/lib/recruitment.ts` is **31 October 2026 at 23:59, Africa/Algiers (UTC+01:00)**. It drives the live homepage countdown, registration notice, closed-state UI, and server-side submission cutoff. Change this single value and its display label for a new recruitment round.

The official DSC logo retains its original artwork and colors. The current interface combines a cinematic block landscape with restrained typography and accessible forms. Older world artwork remains available in the repository.

Department interest is optional. New submissions accept zero or one department ID in the existing `choices` field; additional or invalid IDs are rejected. Historical submitted records remain unchanged. Older browser drafts retain their first valid interest. The admin console labels this field as non-binding.

The cinematic hero uses the original scene in `scripts/landscape-scene.js`, rendered once to `public/dsc-landscape.webp`. It does not load Three.js or WebGL for visitors. To regenerate, install `three` and `playwright` in a separate tools directory, then run `node scripts/render-landscape.cjs /path/to/tools/node_modules`. Chromium is expected at `/usr/bin/chromium`, or set `CHROMIUM_PATH`. The Space Grotesk display font is self-hosted with its OFL license.

## UI verification

Run `node --test tests/registration-preference.test.cjs` for isolated preference/API/model checks. For browser verification, start the app on port 3100, install Playwright in a separate tools directory, and run `node scripts/verify-ui.cjs /absolute/path/to/tools/node_modules`. The script uses Chromium, mocks every registration request, fixes the test clock, and saves screenshots in `/tmp`. It checks responsive layouts, keyboard navigation, registration, draft restoration, the deadline, and admin sign-in presentation. It never submits a real application.
