# Lernium landing

Canonical static landing page for Lernium. The production landing at
`lernium.ru` is deployed separately; this repository also publishes the same
image to the platform staging host at `dev.platform.lernium.ru/`.

## Local development

```bash
npm start
```

The server listens on `http://localhost:4173` by default.

## Checks

```bash
npm run check
npm test
docker build -t lernium-landing .
```

Pushes to `main` publish immutable and `main` images to GHCR, then deploy the
immutable image to the GitHub `staging` environment.
