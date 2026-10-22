# DSC refinement plan

Requested direction: keep the Minecraft identity, simplify the interface, and use a more cinematic composition with less decorative UI. Each applicant chooses exactly one department. Keep Next.js, Tailwind, the official logo, the existing deadline, and administration.

The user requested a 30-minute pause after planning and before implementation.

## Task 1 — One department per application
- [ ] Replace ranked selections with a single accessible choice.
- [ ] Enforce exactly one valid department in both the API and MongoDB schema.
- [ ] Restore older browser drafts using their first valid department.
- [ ] Update applicant-facing copy, admin labels, and documentation; preserve historical submitted records.
- [ ] Verify replacement selection and rejection of multiple choices without creating production records.
- Commit: `Require a single department per application`

## Task 2 — Cinematic homepage hero
- [ ] Replace the floating-island presentation with a wide, grounded Minecraft landscape and restrained lighting.
- [ ] Simplify navigation, title, copy, and calls to action.
- [ ] Integrate the existing October 31 deadline in a discreet, readable countdown.
- [ ] Keep branding legible, handle small screens, and respect reduced-motion preferences.
- Commit: `Introduce a restrained cinematic recruitment hero`

## Task 3 — Simplify the rest of the experience
- [ ] Replace busy map controls and repeated decorative panels with a clear department browser.
- [ ] Reduce jargon, ornamental labels, and oversized pixel treatment.
- [ ] Bring registration and its confirmation screens into the same quieter visual system.
- [ ] Retain keyboard navigation, draft restoration, status feedback, and admin functionality.
- Commit: `Simplify department browsing and registration presentation`

## Task 4 — Final review and delivery
- [ ] Check desktop and narrow mobile layouts in Chromium.
- [ ] Exercise the full form without submitting a real application; verify single selection, restored drafts, the review step, and the deadline.
- [ ] Run the production build and check the staged files exclude credentials.
- [ ] Record verification results, commit any final fixes, and push the small commits to main.
- Commit: `Verify the simplified recruitment experience`
