# SECT Frontend

The SECT public website and administration interface is a React single-page application. Webpack compiles the React entry point and bundles the production assets.

## Development

From the repository root, install dependencies and start the frontend:

```bash
npm --prefix frontend install
npm run dev:frontend
```

The Webpack development server runs at `http://localhost:3000` and proxies API
and upload requests to `http://localhost:5000` by default. Set
`REACT_APP_API_PROXY_TARGET` in `frontend/.env` to use a different development
backend. Set `REACT_APP_API_BASE_URL` when the deployed API uses a different
origin; leave it unset to use the same-origin `/api/v1` path.

Browsing the public site, contacting the Trust, and donating do not require an
account. The only sign-in page is reserved for authorized staff in the admin portal.

## Validation

```bash
npm run build:frontend
npm run lint:frontend
```

`src/main.jsx` is the React entry point and `webpack.config.cjs` defines the
project's development and production bundles. `index.html` supplies the page
shell and Webpack injects the compiled scripts. `npm run build` generates the
deployable static site in `frontend/dist/`; this output is generated and
intentionally excluded from Git. `npm start` builds the site and serves the
static output locally for verification. Production deployments serve the
generated files with the Nginx container defined in `deploy/compose.production.yaml`.

See the root [README](../README.md) for full-stack setup and database instructions.
