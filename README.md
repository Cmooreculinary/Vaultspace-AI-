# VaultSpace browser prototype

VaultSpace currently ships as a static, browser-local product prototype. It is not a password manager, encrypted document vault, identity system, AI service, cloud-sync service, or backup product. Do not enter sensitive information.

## What works

- Static React interface and sample workspaces
- Browser-local demo profiles, alerts, preferences, and activity history
- Typed assistant commands processed with local keyword rules
- Optional browser speech recognition, subject to the browser vendor's processing behavior
- Optional WebAuthn device prompts, without server-side assertion verification
- Optional local camera preview, without capture, upload, recognition, or identity verification
- Scoped reset of VaultSpace browser data

All workspace records and analytics are hard-coded samples. No real file exists behind them.

## Local verification

```bash
npm ci
npm run check
npm audit --omit=dev
npm run preview
```

`npm run check` runs TypeScript validation followed by the production build.

## Deployment

`render.yaml` defines a Render static site using a clean dependency install, the full verification command, the `dist` publish directory, and a single-page-app route fallback. Commits to `main` trigger deployment.

The GitHub deploy gate repeats the same checks and rejects browser bundles containing a server-secret reference or unsupported encryption/compliance claims.

## Production boundary

A production VaultSpace requires an approved architecture for backend identity, authentication, authorization, encrypted transport and storage, key management, durable storage, recovery, audit integrity, monitoring, privacy, threat modeling, and independent security review.
