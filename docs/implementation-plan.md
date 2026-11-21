# Implementation plan

## Phase 0 — Repository foundation
- Establish application scaffold, strict TypeScript, linting, formatting and test commands.
- Add architecture and security decision records.
- Add CI for install, lint, typecheck and tests.
- Keep secrets out of source control.

## Phase 1 — Data and authentication
- Prisma schema and initial migration for SiteSettings, AdminUser, AdminSession, Page, PageRevision, MediaAsset, ContactMessage and AuditEvent.
- Secure one-time administrator bootstrap using a deployment-time secret; disable after success.
- Login/logout, session rotation, revocation and rate limiting.
- Admin route guard and authorization tests.

## Phase 2 — Public website
- Fixed responsive template and design tokens.
- Home, Sobre, Serviços and Contactos.
- Published-only content queries.
- Contact form persistence, validation, rate limiting and anti-spam.
- SEO metadata, canonical URLs, sitemap and robots.

## Phase 3 — CMS backoffice
- Dashboard and fixed sidebar navigation.
- Structured editors for each public page.
- Draft saving, preview, transactional publishing and revision restore.
- Media library upload, processing, metadata, replacement and safe deletion.
- SEO editor and global settings.
- Contact-message inbox.

## Phase 4 — Operations and hardening
- Local and S3-compatible storage adapters.
- Docker deployment and reverse proxy/TLS documentation.
- Off-server backups, retention, monitoring and tested restore.
- Security headers, rate-limit verification, dependency review and end-to-end tests.

## Acceptance gates
A phase is complete only when its acceptance tests pass. Do not describe the system as production-ready until deployment, security checks, backup and restore tests, and end-to-end workflows have been verified.
