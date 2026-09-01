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

The `main` workflow also scans the image for HIGH/CRITICAL vulnerabilities and
stores an SPDX SBOM artifact. Production is an explicit, reviewed promotion:
run `.github/workflows/promote.yml` with a successful `sha-<commit>` tag and the
public HTTPS origin. Configure the protected `production` environment with
`PRODUCTION_HOST`, `PRODUCTION_USER`, optional paired bastion variables, and
the `PRODUCTION_SSH_KEY`/`PRODUCTION_KNOWN_HOSTS` secrets. The target server
must have the shared `/usr/local/sbin/lernium-deploy` profile installed.

Do not commit `.env` files, passwords, registry tokens, or private keys. Rotate
credentials that have ever been exposed in chat or repository history.
