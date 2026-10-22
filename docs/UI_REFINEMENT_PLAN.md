# DSC refinement plan

Requested direction: keep the Minecraft identity, simplify the interface, and use a more cinematic composition with less decorative UI. Applicants may optionally indicate one department of interest. This is not a final choice or an assignment. Keep Next.js, Tailwind, the official logo, the existing deadline, and administration.

The user requested a 30-minute pause after planning, then explicitly asked to start early. Work resumed on that instruction.

## Task 1 — Optional, non-binding department interest
- [x] Replace ranked selections with an optional single interest and a no-preference option.
- [x] Accept zero or one valid department of interest in both the API and MongoDB schema.
- [x] Restore older browser drafts using their first valid department.
- [x] Update applicant-facing copy, admin labels, and documentation; preserve historical submitted records.
- [x] Verify replacement selection and rejection of multiple choices without creating production records.
- Commit: `Make department interest optional and non-binding`

## Task 2 — Cinematic homepage hero
- [x] Replace the floating-island presentation with a wide, grounded Minecraft landscape and restrained lighting.
- [x] Simplify navigation, title, copy, and calls to action.
- [x] Integrate the existing October 31 deadline in a discreet, readable countdown.
- [x] Keep branding legible, handle small screens, and respect reduced-motion preferences.
- Commit: `Introduce a restrained cinematic recruitment hero`

## Task 3 — Simplify the rest of the experience
- [x] Replace busy map controls and repeated decorative panels with a clear department browser.
- [x] Reduce jargon, ornamental labels, and oversized pixel treatment.
- [x] Bring registration and its confirmation screens into the same quieter visual system.
- [x] Retain keyboard navigation, draft restoration, status feedback, and admin functionality.
- Commit: `Simplify department browsing and registration presentation`

## Task 4 — Final review and delivery
- [ ] Check desktop and narrow mobile layouts in Chromium.
- [ ] Exercise the full form without submitting a real application; verify single selection, restored drafts, the review step, and the deadline.
- [ ] Run the production build and check the staged files exclude credentials.
- [ ] Record verification results, commit any final fixes, and push the small commits to main.
- Commit: `Verify the simplified recruitment experience`

Task 1 verification: six isolated tests passed (optional/single interest, malformed and multiple values, legacy draft restoration, API persistence boundary, cutoff, and model validation). TypeScript check passed. No production database was used.

Task 2 verification: the rendered landscape is a 292 KB static WebP. Desktop (1440px) and mobile (390px) hero checks passed: no horizontal overflow, countdown hydration, and mobile navigation. TypeScript check passed.
