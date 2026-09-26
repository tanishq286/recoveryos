# RecoveryOS - Decision Log

## D1 - 2026-09-26: Static site first, no framework
Phase 1 is marketing + client-side triage only. A static site deploys free anywhere, has zero attack surface beyond the form endpoint, and keeps the Phase 2 framework choice (Next.js per blueprint) unhurried.

## D2 - 2026-09-26: Deterministic triage, versioned rules
The free check never uses an LLM and never fabricates a match. Rules live in assets/app.js with RULES_VERSION `2026.09.26`; every result carries the version + sources-checked date (blueprint: "Do not let an LLM invent criteria").

## D3 - 2026-09-26: Git author identity
Commits authored as `tanishq286 <tanishq286@users.noreply.github.com>` - GitHub noreply address keeps the founder's real email out of public git history.

## D4 - 2026-09-26: Waitlist backend on ops mailbox
Form backend (Web3Forms/Formspree free tier) registered to the assistant's operational mailbox, not the founder's Gmail - he has explicitly refused Gmail access. Leads relay to him via the main conversation.

## D5 - 2026-09-26: Pricing model + display
Founder's own WhatsApp words, verified in the message archive:
- 8:22 PM IST: "We will charge 10 percent of commission and reaming 10 percent we will do the insurance"
- 8:25 PM IST: "Life insurance/health insurance"
- 8:31 PM IST: "Yes" - confirming the exact 10% + 10% proposal
- 11:09 PM IST: approved starting the build per the updated blueprint, which contains this pricing for the marketing site.
Insurance wording on the site stays conditional (licensed partner, client choice, eligibility, actual issuance) per the blueprint's marketing gate - "planned benefit", never guaranteed cover.

## D6 - 2026-09-26: Animation stack via CDN, progressive enhancement
GSAP + ScrollTrigger + Three.js + lottie-web from cdnjs (free). If any CDN fails or JS is disabled, the site remains fully functional. Reduced-motion preference disables all animation. Lottie files are hand-authored in-repo (no licensing exposure).
