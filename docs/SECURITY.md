# RecoveryOS - Security

## Phase 1 posture
- Static site: no server, no database, no session state. Attack surface = the waitlist form endpoint.
- Waitlist: honeypot field, client-side validation, consent checkbox required. No sensitive fields collected (no PAN, Aadhaar, folio numbers, OTPs - by design, and copy says so).
- Form endpoint access key is a public-site key (Web3Forms pattern), rate-limited by the provider; not a credential.
- No analytics tracking in phase 1. No cookies. No third-party pixels.
- CDN dependencies pinned to exact versions on cdnjs.
- Git author uses GitHub noreply email; founder's real email/phone appear nowhere in the repo or site.

## Standing rules carried into every phase (blueprint section 7)
- Deny-by-default access, server-enforced RLS when a backend exists
- Never store government passwords/OTPs; never automate CAPTCHA/OTP
- Private object storage + short-lived signed URLs for documents
- Append-only audit events; immutable source-file checksums
- PII kept out of logs, analytics, URLs, telemetry
- Malware scan + MIME sniffing on uploads
- Launch gate: no real sensitive documents until permission model, audit log, privacy notice, security testing, backups and incident response are working
- DPDP Act / 2025 Rules compliance reviewed by Indian counsel before real client data
