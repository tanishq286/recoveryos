# RecoveryOS - Architecture

## Phase 1 (current)
Static marketing site. No build step, no backend, no database.

- `index.html` - single-page landing (hero, triage, how, recovery room, pricing, routes, trust, FAQ, waitlist)
- `assets/styles.css` - design system (see DESIGN.md)
- `assets/app.js` - triage decision tree (deterministic, RULES_VERSION), waitlist form, FAQ, reveals
- `assets/anim.js` - progressive-enhancement animation layer (GSAP + ScrollTrigger, Three.js hero particles, Lottie). Site is fully functional without it.
- `assets/lottie/*.json` - hand-authored animations (radar, verified-check)
- CDN libraries: GSAP 3.12.5, ScrollTrigger, Three.js 0.160.0, lottie-web 5.12.2 (cdnjs)

## Hosting
GitHub Pages from repo root (`main`), `.nojekyll` set. Free tier.

## Waitlist data flow
Browser form -> Web3Forms endpoint (access key in `WAITLIST_ACCESS_KEY`, assets/app.js) -> ops mailbox -> relayed to founder. No PII database in phase 1; fields: name, email, phone(optional), city(optional), asset type, approx value band(optional), notes, consent.

## Phase 2 target (per blueprint)
Next.js + TypeScript + Tailwind + shadcn/ui, Supabase free (Postgres, auth magic links, private storage), RLS deny-by-default, local OCR worker, Postgres jobs table. Data model and API sketch live in the blueprint (sections 8). Phase 2 starts only after phase 1 exit gate passes.
