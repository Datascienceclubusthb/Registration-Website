# DataScience World campaign redesign

Reference source: `/home/camadata/Documents/ref.zip` (five posters inspected).

Art direction: neutral cream, near-black condensed Anton headlines, orange actions, detailed floating Minecraft islands, orange location markers and editorial spacing. Original DSC logo unchanged. Generated illustrations are local optimized WebP assets; no runtime 3D or external image dependency.

Implementation tasks, with separate commits:
1. Campaign visual system, responsive homepage, department world browser, and retained Data Fest / Data Camp / Projects content.
2. Registration journey, up to three ranked non-binding preferences, experience and motivation, explicit data-processing consent, secure persistence and retry protection, review and achievement confirmation.
3. Admin compatibility, recruitment control, privacy notice, verification and delivery.

Existing stack: Next.js App Router, React, Tailwind CSS, Mongoose/Atlas. Admin authentication uses signed HttpOnly cookies and server-only environment credentials. Existing search, filters, statuses, notes and filtered CSV export will be retained. The deadline remains 31 October 2026 at 23:59 Algiers.

The newer comprehensive brief supersedes the earlier maximum-one preference rule; preferences remain non-binding. Historical applications are preserved. Tests use isolated storage stubs and mocked browser requests, never production writes.
