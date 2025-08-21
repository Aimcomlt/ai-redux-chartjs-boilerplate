# AI Redux ChartJS Boilerplate

This project uses [Vite](https://vitejs.dev/), React and Redux Toolkit to experiment with Chart.js visualisations and background model training via Web Workers.

## Scripts

Run these with `pnpm`:

- `pnpm dev` – start the Vite development server.
- `pnpm build` – create a production build in `dist/`.
- `pnpm preview` – preview the production build locally.
- `pnpm test` – execute the test suite with Vitest.

## Architecture Overview

### State flow
The Redux store combines UI and domain slices along with RTK Query APIs. Components dispatch actions and select state from `src/app/store.js`.

### Worker protocol
Model training occurs in `src/workers/trainBrain.worker.js`. The worker expects `{ series, hyperparams, norm }` and posts `{ progress }` updates. When complete it sends `{ done: { modelJSON, norm } }` or `{ error }` on failure.

### Chart composition
Chart behaviour is centralised in `src/charts/config.ts` and `src/charts/datasets.ts` which provide reusable Chart.js configuration and dataset helpers.

### Content Security Policy (CSP)
Deploying with a restrictive CSP is recommended:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; worker-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'
```

Adjust `connect-src` for any external APIs and avoid `unsafe-eval` to keep worker execution safe.

## Environment variables

Vite exposes only variables prefixed with `VITE_` to client code. Define them in `.env` files, e.g.:

```
VITE_API_URL=https://api.example.com
```

Access them via `import.meta.env.VITE_API_URL`.

## Screenshots

### Overview

![Overview screenshot](https://placehold.co/600x400?text=Overview)

### Model Lab

![Model Lab demo](https://placehold.co/600x400?text=Model+Lab)

