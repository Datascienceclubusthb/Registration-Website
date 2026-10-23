# DataScience World campaign redesign

Reference source: `/home/camadata/Documents/ref.zip` (five posters inspected).

Art direction: neutral cream, near-black condensed Anton headlines, orange actions, detailed floating Minecraft islands, orange location markers and editorial spacing. Original DSC logo unchanged. Generated illustrations are local optimized WebP assets; no runtime 3D or external image dependency.

Implementation tasks, with separate commits:
1. Campaign visual system, responsive homepage, department world browser, and retained Data Fest / Data Camp / Projects content.
2. Registration journey, up to three ranked non-binding preferences, experience and motivation, explicit data-processing consent, secure persistence and retry protection, review and achievement confirmation.
3. Admin compatibility, recruitment control, privacy notice, verification and delivery.

Existing stack: Next.js App Router, React, Tailwind CSS, Mongoose/Atlas. Admin authentication uses signed HttpOnly cookies and server-only environment credentials. Existing search, filters, statuses, notes and filtered CSV export will be retained. The deadline remains 31 October 2026 at 23:59 Algiers.

The newer comprehensive brief supersedes the earlier maximum-one preference rule; preferences remain non-binding. Historical applications are preserved. Tests use isolated storage stubs and mocked browser requests, never production writes.


## Final implementation and verification

- Sampled poster colors (mean of small flat regions): cream `#F0EEE1`, orange `#EF6404`, ink `#040F1B`. These feed the central campaign tokens.
- Campaign homepage, seven matching department islands, collaboration art, Data Fest / Data Camp / Projects, application wizard, review, achievement confirmation, privacy notice and administration implemented.
- Eleven isolated backend/model tests cover preference limits and ordering, legacy restoration, consent, optional answers, reference generation, duplicate retries, deadline, admin pause, storage failure, authenticated setting changes and server status.
- Chromium exercises 320/390/900/1440px home layouts, keyboard tabs and disclosure controls, form validation, ranking without duplicates, reordering, required consent, mocked submission, drafts, expiry, pause, privacy and admin notes/control. All API calls are mocked in browser checks.
- No production application records were created or changed during verification. Existing environment credentials remain ignored and unchanged.
- The supplied Base44 capture remains a reference only; no unavailable Base44 records or backend were migrated. Current Next.js/MongoDB functionality is retained and extended.

Production `npm run build` passed, including TypeScript and all 11 routes. The full mocked Chromium journey passed against `next start`, with no browser page errors or horizontal overflow at the checked sizes.
