# AureA CMS

A reusable, independently deployable CMS for institutional and professional websites.

## Product principles

- One independent installation per website: domain, database, media storage, administrator and configuration.
- Shared codebase; no centralized multi-tenant runtime in v1.
- Fixed public templates with structured editing forms, not a page builder.
- Draft and published content are separate; publication is explicit and revisioned.
- One administrator in v1.
- Portuguese-first public content.

## Planned v1

- Public pages: Home, Sobre, Serviços and Contactos.
- Admin area at `/admin`.
- Structured page editing, media library, SEO, site identity and settings.
- Contact-message inbox with spam controls.
- Revision history and restore.
- Secure sessions, server-side validation, audit events and rate limiting.
- Automated off-server backups and restore verification.

## Out of scope for v1

Public registration, multiple administrators, commerce, subscriptions, payments, comments, page builder, centralized multi-tenancy and mobile app.

## Initial implementation status

This repository is being initialized. Architecture and implementation decisions are documented under `docs/`. No production-readiness claim is made until automated tests, security checks, deployment and restore procedures have been verified.

## Development

The application uses Next.js App Router, TypeScript, PostgreSQL, Prisma, Zod and Sharp. The current media upload implementation stores optimized WebP files on the local filesystem using `MEDIA_LOCAL_DIR`; production must mount this path on persistent storage and include it in backups. An S3-compatible adapter remains future work. See `docs/architecture.md` and `docs/implementation-plan.md`.


## Instalação e operação

O procedimento de instalação, configuração HTTPS, bootstrap do primeiro administrador, armazenamento multimédia, backups, restauro e atualizações está em [docs/deployment-production.md](docs/deployment-production.md).

## Administração e contactos

- Backoffice protegido em `/admin`, com autenticação por sessão HttpOnly.
- Configuração inicial de administrador: consultar [docs/admin-setup.md](docs/admin-setup.md).
- Caixa de entrada de contactos em `/admin/contactos`, com estados Nova, Lida e Arquivada.\n- Editor de conteúdos e SEO em `/admin/conteudo`, com rascunhos, publicação e revisões.\n- Biblioteca multimédia com upload autenticado, validação de ficheiros, conversão WebP, imagens principais e imagens por secção.
- Migrações PostgreSQL versionadas em `prisma/migrations`.

O CI executa instalação, geração do Prisma Client, lint, verificação TypeScript, testes unitários e build de produção. A publicação não deve avançar enquanto estes controlos não estiverem verdes.

CI dependency installation uses npm with compatibility flags until a reviewed lockfile is committed.

CI uses the ESLint flat configuration compatible with the installed Next.js release.

ESLint presets are adapted through FlatCompat for ESLint 9 compatibility.
