# RecoveryOS - Test Plan

## Phase 1 QA (all run pre-deploy via headless Chrome + puppeteer-core)
- [x] Page loads with no console/page errors
- [x] CDN libraries load: GSAP, ScrollTrigger, Three.js, lottie-web
- [x] Triage branch: shares + heir + entity/folio -> "IEPF route, with transmission first" + heir human-review note
- [x] Triage branch: unsure + self + none -> guided-search sequence
- [x] Triage branch: shares + nothing -> "insufficient evidence" state, no fabricated match
- [x] Wizard validation: Continue disabled until step answered; restart resets state
- [x] Result shows rules version + sources-checked receipt + waitlist CTA (prefills asset select)
- [x] FAQ accordion opens/closes
- [x] Waitlist validation: name/email/asset/consent errors; honeypot rejects bots silently
- [x] Lottie animations render (radar, result check) - requires http(s), file:// blocked
- [x] Desktop 1440px, tablet 768px, mobile 375px layouts inspected visually - no overflow at any width

## Pre-deploy checklist (gates every deploy, per the founder's workflow)
- [x] Functionality: all interactive flows pass headless e2e
- [x] Responsive: 375px / 768px / 1440px - zero horizontal overflow, layouts inspected
- [x] Security: no secrets in repo, no sensitive fields in form, CDN versions pinned
- [x] Lint/typecheck/tests/build: JS passes node --check; static site, no build step
- [x] Preview before production: served locally over http, all sections visually inspected

## Production QA (on live URL, post-deploy)
- [ ] Live URL returns 200 and renders hero
- [ ] All CDN assets load over https (no mixed content)
- [ ] Waitlist end-to-end: real submission lands in ops mailbox
- [ ] Lottie files fetch over https
- [ ] Mobile viewport pass
- [ ] All outbound official links resolve (IEPF/MITRA/EPFO/UDGAM/AMFI)

## Phase 2 preview (from blueprint)
Synthetic-case testing before any real client file; cross-case access tests; backup restore test; upload MIME/malware checks; audit-event verification.
