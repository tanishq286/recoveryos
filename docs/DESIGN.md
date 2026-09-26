# RecoveryOS - Design System

## Concept
"Private wealth recovery room." Calm, editorial, closer to private banking than an agency site. Premium through clarity, not theater.

## Palette
- Ink `#14232B` (text, dark sections)
- Ivory `#F7F5EF` (page background)
- Pearl `#FFFFFF` (cards)
- Brass `#A58354` (accents, active progress - sparingly)
- Teal `#267F77` (confirmed/verified states only)
- Red `#B4443C` (actual blockers only)
- No glowing AI gradients. No gold everywhere.

## Type
- Display: Fraunces (optical sizing, soft, italic accents)
- Body/UI: Inter. Tabular numerals for dates/amounts.
- Devanagari fallback (Noto Sans Devanagari) before any Hindi.

## Signature elements
- Proof cards: field + source page + confidence chip + approve/correct
- Milestone rail: Prepared -> Submitted -> Company verification -> Authority review -> Credited; teal only when verified with proof
- Sources-checked receipt with last-checked date
- Exact "waiting on X" language; "in progress" is not a milestone

## Motion
- GSAP entrance timeline on hero, ScrollTrigger reveals, rail draw animation
- Three.js quiet particle field in hero (no spectacle)
- Lottie: radar scan (free check), verified check (triage result)
- 150-250ms micro-transitions; `prefers-reduced-motion` disables all animation
- Everything is progressive enhancement: no JS/CDN = fully working static site

## Accessibility
WCAG AA target, visible focus rings, keyboard-navigable wizard, 16px min body text, status never by color alone, 320px mobile support.
