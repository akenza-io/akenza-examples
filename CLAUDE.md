# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run any example directly
node examples/uplink/http-send-data.mjs
node examples/data/data-stream.mjs
node examples/management/get-devices.mjs

# Lint
npx eslint examples/
```

No build step or test suite exists — examples are run directly with Node.js.

## Environment Configuration

Copy `.env.template` to `.env` and fill in credentials. Examples load environment variables via `dotenv` and respect a `CONFIG_PATH` env var to point at an alternative `.env` file. Available environment variants: `.env`, `.env.dev`, `.env.staging`, `.env.prod`.

Key variables defined in `.env.template`:
- `BASE_URL`, `DATA_BASE_URL`, `WS_BASE_URL` — API endpoints
- `API_KEY`, `WORKSPACE_ID` — authentication and workspace scope
- Per-protocol credentials: `HTTP_*`, `MQTT_*`, `COAP_*`

## Architecture

The repo is a flat collection of standalone ES module scripts (`.mjs`), each demonstrating one integration scenario. All examples can run independently and export their main function so other examples can import and compose them.

```
examples/
  uplink/      # Device data ingestion — HTTP, MQTT, CoAP
  data/        # Data retrieval — REST queries and WebSocket streams
  management/  # Workspace management — devices, tags, pagination
  utils.mjs    # Shared helpers: loadAllEntities() (pagination), isRunDirectly()
```

### Patterns to follow when adding examples

- Use ES modules (`import`/`export`) — the project is `"type": "module"`
- Load env with `dotenv` at the top of each file; use `process.env.*` for all credentials
- Export the main logic as a named function so it can be imported by other scripts
- Guard direct execution with `isRunDirectly(import.meta)` from `utils.mjs`
- Use `loadAllEntities()` from `utils.mjs` for any paginated API calls

### Protocol libraries

| Protocol | Library | Notes |
|----------|---------|-------|
| HTTP/REST | `axios` | Used for management and data query endpoints |
| MQTT | `mqtt` / `async-mqtt` | TLS variant uses port 8883 with cert verification |
| CoAP | `coap` | UDP-based; host is `coap.akenza.io` |
| WebSocket | `ws` | Used for real-time data streaming |

### API base URLs

- Management & data query: `BASE_URL` (default `https://api.akenza.io`)
- Data gateway (uplinks): `DATA_BASE_URL` (default `https://data-gateway.akenza.io`)
- WebSocket streams: `WS_BASE_URL` (default `wss://api.akenza.io`)

API version is v3. Reference: [docs.akenza.io](https://docs.akenza.io) / [docs.api.akenza.io](https://docs.api.akenza.io)
