# RecoveryOS

Marketing site and free unclaimed-asset triage for RecoveryOS - an evidence-backed
recovery service for unclaimed shares, dividends, mutual funds, PF and bank deposits in India.

Static site, no build step. `index.html` + `assets/` is the whole deployable unit.

- Design system: ink `#14232B`, ivory `#F7F5EF`, pearl `#FFFFFF`, brass `#A58354`, teal `#267F77`
- Type: Fraunces (display) + Inter (UI/body) via Google Fonts
- Triage: deterministic client-side decision tree (`assets/app.js`), rules version `2026.09.26`
- Waitlist: posts to a Web3Forms endpoint; set `WAITLIST_ACCESS_KEY` in `assets/app.js`

## Deploy

Any static host (GitHub Pages, Cloudflare Pages, Netlify, surge). Serve the repo root.

## Workflow

This repo follows the founder's Vibe Coding workflow: docs-first, small phased tasks, structured commits, security from the start, preview -> QA -> production.

- `docs/PRD.md` - requirements + phase acceptance criteria
- `docs/ARCHITECTURE.md` - system design
- `docs/DESIGN.md` - design system + motion rules
- `docs/RULES.md` - hard constraints
- `docs/TASKS.md` - phased task log
- `docs/DECISIONS.md` - decision log with evidence
- `docs/MEMORY.md` - working notes
- `docs/TEST_PLAN.md` - QA checklists
- `docs/SECURITY.md` - security posture + launch gates
