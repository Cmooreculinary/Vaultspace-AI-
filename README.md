# VaultSpace AI deployment demo

This repository currently ships a static, browser-local deployment demo. It is not a production password manager, encrypted document vault, identity system, or cloud backup service. Do not store sensitive information in it.

## Local build

```bash
npm ci
npm run build
npm run preview
```

## Render

`render.yaml` defines a static service with a clean `npm ci` build and SPA route fallback. No AI secret is exposed to the browser. The ingestion test runs locally and sends no document or credential off-device.

A production VaultSpace requires an approved backend, authentication, encryption/key-management design, durable storage, threat model, and security review before the demo language can be removed.
