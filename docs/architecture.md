# AureA CMS — Architecture baseline

## Deployment model
AureA is a reusable codebase deployed independently for each customer website. Every installation owns its domain, PostgreSQL database, media storage, administrator, secrets, configuration and backup destination. There is no centralized multi-tenant runtime in v1.

## Runtime stack
- Next.js App Router and TypeScript strict mode.
- Node.js LTS.
- PostgreSQL with Prisma ORM.
- Zod validation at untrusted input boundaries.
- Argon2id password hashing.
- Database-backed opaque sessions; HttpOnly, Secure and SameSite cookies.
- Sharp image processing.
- Local filesystem media storage is implemented through `MEDIA_LOCAL_DIR`; production requires a persistent mounted volume and off-server backup. An S3-compatible adapter is planned but not implemented.
- Vitest and Playwright.
- Docker Compose; Caddy or Nginx for TLS termination.

## Core entities
- SiteSettings: one settings record per installation, including identity, locale, contact details, social links and global SEO defaults.
- AdminUser: one administrator in v1; normalized email, Argon2id hash, status and timestamps. No public registration.
- AdminSession: hash of a high-entropy opaque token, user relation, expiry and revocation metadata. Never store the raw token.
- Page: stable key (home, about, services, contact), route, draft snapshot, published snapshot, SEO fields and version.
- PageRevision: immutable snapshots for recovery, with actor and timestamp.
- MediaAsset: storage key, original filename, MIME, size, dimensions, variants, alt text, caption and status.
- ContactMessage: sender details, message, received timestamp, status and minimal anti-spam metadata.
- AuditEvent: actor, action, entity, timestamp and minimal metadata. Never record secrets.

## Draft and publish lifecycle
1. Admin edits a typed page form.
2. Server validates and saves draft data only.
3. Authenticated preview renders the draft and is not indexable.
4. Publish transaction creates an immutable revision and atomically promotes the validated draft snapshot.
5. Public routes read only published snapshots.
6. Restore creates a new draft from a revision; history is not silently rewritten.

## Media lifecycle
Uploads are authenticated, rate-limited and bounded to 12 MB. The endpoint allowlists JPEG, PNG, WebP and AVIF MIME types, decodes/re-encodes with Sharp to WebP, resizes to a 2400-pixel maximum edge, assigns random storage keys and stores metadata. SVG and executable formats are rejected. The initial admin flow supports selecting replacement images; safe deletion and S3 storage remain future work.

## Contact form
Validate and normalize server-side; enforce request-size limits, rate limits, honeypot and timing signals. Persist messages independently from public content. Email notification is optional and not required for successful storage.

## Security
- Secure one-time administrator bootstrap; no default credentials.
- Argon2id and opaque random sessions with hashed-at-rest tokens, expiry, rotation and revocation.
- HttpOnly, Secure in production, SameSite cookies and CSRF protection.
- Server-side authorization for every admin operation.
- Zod validation, output encoding and no raw HTML editor in v1.
- Rate limits for login, contact and upload endpoints.
- Strict upload allowlist, content sniffing, limits and path-safe storage keys.
- Security headers, HTTPS and redacted logs.
- Audit security-sensitive administrative actions.

## Backups
Daily automated database and media backups to a destination outside the application VPS. Retention is configurable. Encrypt in transit and at rest, restrict credentials, monitor failures and run scheduled restore tests in an isolated environment. A backup is not verified until restoration has been tested.

## API and public structure
Internal HTTP endpoints use /api/v1. Public pages are Home, Sobre, Serviços and Contactos. The public template is fixed: administrators edit approved fields but cannot create arbitrary sections, reorder the structure or change the design system.
