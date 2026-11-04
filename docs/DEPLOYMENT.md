# Production Deployment

This repository includes a single-host Docker Compose deployment for the frontend and API. Caddy obtains and renews the public TLS certificate. PostgreSQL remains external and must be a managed PostgreSQL service with TLS enabled; production API startup rejects embedded databases.

This setup runs one API instance. Uploaded files live in a persistent Docker volume on that host. It is not a multi-host or high-availability design; use shared object storage before scaling the API horizontally. Back up the upload volume independently of the database.

## Railway deployment

Railway uses two services from this repository: a private API service and a public frontend service. The frontend serves the Webpack build and proxies `/api/*` and `/uploads/*` to the API over Railway's private network. This keeps browser requests same-origin and avoids requiring a public API domain.

Use the Railway dashboard to create both services from this repository. For each service, set the source root to the repository root and set `RAILWAY_DOCKERFILE_PATH`:

| Service | Dockerfile | Start behavior |
|---|---|---|
| API | `/deploy/railway-backend.Dockerfile` | Starts `backend/src/server.js` |
| Frontend | `/deploy/railway-frontend.Dockerfile` | Builds the SPA and starts its static/proxy server |

Configure the API service first:

1. Add a private network domain, set `PORT=5000`, and set the service health-check path to `/api/v1/health/ready`. Do not generate a public domain for the API.
2. Set `NODE_ENV=production`, `TRUST_PROXY_HOPS=1`, `USE_EMBEDDED_DB=false`, `UPLOAD_DIR=/app/backend/uploads`, and `MAX_FILE_SIZE_MB=10`.
3. Set `DATABASE_URL` to the least-privilege application-role connection string and `MIGRATION_DATABASE_URL` to a separate DDL-capable migration-role connection string. Keep both values in Railway's protected variables; never commit them or paste them into chat.
4. Set distinct high-entropy `JWT_SECRET` and `JWT_REFRESH_SECRET` values, each at least 32 characters. Set `FRONTEND_URL` to the frontend's final HTTPS origin after its domain has been generated. `DATABASE_SSL_CA` is optional when the database certificate is already trusted.
5. Add a Railway volume mounted at `/app/backend/uploads`. Railway mounts volumes as root, so set `RAILWAY_RUN_UID=0` for this service. Keep one API replica while using local upload storage.
6. Set the API service's pre-deploy command to `node deploy/railway-migrate.cjs`. This runner uses `MIGRATION_DATABASE_URL` only in the migration process. The API startup removes that variable before loading application modules. Failed migrations block the deployment.

Then configure the frontend service:

1. Set `API_PROXY_TARGET` to the API's private network origin, for example `http://sect-api.railway.internal:5000` (use the actual private hostname shown by Railway).
2. Generate a Railway public domain for this service and use its HTTPS origin as the API service's `FRONTEND_URL`.
3. Set the frontend health check path to `/`. Requests to `/api/*` and `/uploads/*` are forwarded to the configured private API origin; other paths are served from the SPA build.

Attach any custom domain to the frontend service and update `FRONTEND_URL` to that exact HTTPS origin. Redeploy the API after changing the value. Do not configure production payment keys until the Trust chooses and verifies its donation workflow. Email delivery is not implemented. Registration/80G fields remain blank by request and must not be populated with unverified values.

This Railway layout still uses a single API instance and local persistent upload storage. Configure database and volume backups and test restoration before launch. The Docker Compose deployment below remains available for single-host deployments.

## Prerequisites

- Docker Engine with Docker Compose v2.
- A DNS name whose A/AAAA records point to the Docker host.
- Inbound TCP ports 80 and 443 (and UDP 443 if HTTP/3 is desired).
- A managed PostgreSQL database reachable from the host, with certificate validation enabled and separate application/migration roles.
- The trust's approved UPI donation QR code and contact details for manual payment acknowledgement.

## Configure

Copy `deploy/production.env.example` to `deploy/production.env`. The real file is ignored by Git. Set the public host/email, both PostgreSQL URLs, and distinct random JWT secrets. `DATABASE_URL` is used by the API and should have only the runtime privileges it needs. `MIGRATION_DATABASE_URL` is used only by migrations and the initial roles seed; grant it the DDL privileges those scripts need. URL-encode special characters in both PostgreSQL URL passwords. If the provider uses a private CA, set `DATABASE_SSL_CA` to the PEM certificate content.

After creating both database roles and the `sect` database, apply grants as the database owner. The API role needs application DML but no schema-creation privilege; the migrator creates and alters application objects:

```sql
GRANT CONNECT ON DATABASE sect TO sect_app, sect_migrator;
GRANT USAGE ON SCHEMA public TO sect_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO sect_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO sect_app;
GRANT USAGE, CREATE ON SCHEMA public TO sect_migrator;
ALTER DEFAULT PRIVILEGES FOR ROLE sect_migrator IN SCHEMA public
	GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sect_app;
ALTER DEFAULT PRIVILEGES FOR ROLE sect_migrator IN SCHEMA public
	GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO sect_app;
```

Run the migrations with `MIGRATION_DATABASE_URL`; run the API and administrator bootstrap with `DATABASE_URL`.

Generate JWT secrets with a cryptographically secure generator, for example `openssl rand -hex 32`. Never reuse the local development credentials or commit the production environment file. Prefer your host's secret manager over environment variables where available.

## Release

Run the following from the repository root. Do not run `migrate:seed` in production; it includes demonstration content.

```sh
docker compose --env-file deploy/production.env -f deploy/compose.production.yaml build
docker compose --env-file deploy/production.env -f deploy/compose.production.yaml --profile ops run --rm migrate
docker compose --env-file deploy/production.env -f deploy/compose.production.yaml --profile ops run --rm seed-roles
docker compose --env-file deploy/production.env -f deploy/compose.production.yaml up -d
```

Create the first administrator only after migrations and the roles seed complete. In the deployment shell, set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` temporarily, then run:

```sh
docker compose --env-file deploy/production.env -f deploy/compose.production.yaml run --rm -e BOOTSTRAP_ADMIN_EMAIL -e BOOTSTRAP_ADMIN_PASSWORD api node backend/scripts/createAdmin.js
```

The bootstrap password must be unique, at least 16 characters, and contain uppercase, lowercase, numeric, and symbol characters. Remove both bootstrap variables from the shell immediately afterward. The bootstrap command refuses to elevate an existing account.

Check `https://<PUBLIC_HOSTNAME>/api/v1/health/ready` after startup. Readiness reports the database connection state; `/api/v1/health/live` checks only that the API process is responsive. The production proxy chain is Caddy -> Nginx -> API, so `TRUST_PROXY_HOPS=2` must match that topology for client IP handling and rate limits. Do not expose the API port directly to the internet. Caddy requires valid DNS and reachable ports 80/443 to issue a certificate.

Before releasing, run `node deploy/check-compose-config.cjs`. This resolves the Compose file using the example configuration and verifies that the API has the `sect_app` role, the migration job has the separate `sect_migrator` role, and the API is not passed migration credentials. The example file is for configuration validation only and must never be used to connect to production.

## Operations

- Back up PostgreSQL and test restoration before launch; persistent storage alone is not a backup.
- Back up the `sect_uploads` Docker volume and test restoring uploaded documents and images.
- Deploy one API replica while using local upload storage. A named volume is not shared across hosts.
- Review container logs and configure host-level uptime, disk, database, and certificate-expiry alerts.
- Apply schema migrations as a release step before starting the new application version. Do not seed demo data in production.
- Donors submit the UPI transaction reference and amount; submissions remain pending. An authenticated administrator must confirm against the Trust bank/UPI statement before the application marks it complete, updates project totals, or issues a receipt. A donor-provided screenshot alone is not authoritative payment confirmation.
- Protect `DATABASE_URL` and `MIGRATION_DATABASE_URL` separately; never mount the migrator credential into the long-running API container.
- Email delivery is not implemented/configured; the application logs that receipts and inquiry notifications were not sent. Do not promise email delivery until an email provider is integrated and tested.
- The Docker Compose stack is a single-host deployment, not a substitute for provider-level database backups, failover, or disaster recovery.

## Go-live gates

Do not expose the site publicly until all of these are verified in staging:

- Replace the example environment values with real, separately provisioned runtime and migration database credentials, distinct JWT secrets, and the real public hostname. Keep credentials in a secret manager or protected deployment environment.
- Confirm DNS, firewall rules, HTTPS certificate issuance, database TLS, least-privilege grants, and successful backup restoration.
- Review every public trust-profile field, document, contact detail, and the live UPI QR/payee with the Trust. Registration and 80G fields are currently blank by request; only add verified official values if authorized. QR payment must be confirmed against bank records before being marked complete.
- Choose whether production donations use manual UPI reconciliation or a configured live payment gateway. Test the complete donor, admin verification, receipt, and refund/accounting procedures before accepting donations.
- Email delivery is not implemented. Do not promise donor receipts or inquiry notifications by email until a provider is integrated and end-to-end tested.
- Run the production Compose check, dependency audits, backend tests, frontend build, container builds, and authenticated/anonymous smoke tests. Complete staging load tests against agreed latency, error-rate, and traffic targets; local development load numbers are not capacity guarantees.
- Assign an operator for security updates, logs/alerts, backup monitoring, incident response, and rollback.

## Rollback

Keep the previous image tag and database backup until a release is verified. Roll back the application image if needed, but do not assume database migrations are reversible. Review each migration and restore from a verified backup when a schema rollback is required.