# RecoveryOS - Product Requirements

## Problem
Unclaimed shares, dividends, mutual funds, PF and bank deposits in India are recoverable through public official routes (IEPF, SEBI MITRA, EPFO, RBI UDGAM, AMFI), but the process is opaque: which form, which authority, which proof, what happens after filing.

## Promise
"Find the path back to your assets. See every step."
Evidence-backed recovery cases. Never: guaranteed discovery, amounts, or timelines.

## Commercial model (founder-approved 2026-09-26)
- 10% commission on the recovered amount, charged only on successful credit.
- Separate allocation equal to 10% of the recovery toward client life/health insurance via a licensed partner - planned benefit, conditional on partner availability, client choice, eligibility and issuance. Unused allocation returns to the client.
- IEPF-5 itself has no government filing fee; professional fees disclosed separately and in writing before work begins.

## Phases (from blueprint)
- Phase 1 (current): marketing site + free guided triage + waitlist. Static site, GitHub Pages.
- Phase 2: trustworthy MVP - consent, login, private upload, case queue, timeline, quotes.
- Phase 3: OCR proof cards, rule-based eligibility, reviewer queue.
- Phase 4: coordination automation. Phase 5: MF/PF case packs.

## Phase 1 acceptance criteria
- [x] Hero with single promise + free check CTA
- [x] Deterministic 3-step triage with honest states (route / guided / insufficient evidence), sources-checked receipt, rules version label
- [x] Heir cases always route to human review language
- [x] Pricing section with both 10% components + conditional insurance wording
- [x] Self-service official links beside paid offer
- [x] Trust rules: no OTPs/passwords ever, money never touches RecoveryOS, evidence-backed milestones
- [x] Waitlist with consent + validation (backend wired at deploy)
- [ ] Live on free tier (GitHub Pages) - pending post-midnight browser window
- [ ] Waitlist backend live (Web3Forms/Formspree free tier on assistant ops mailbox)
