# tahoma2d-mcp

**FastMCP 3.2 server for Tahoma2D 2D animation production.**

- Backend: 11013 (FastAPI + FastMCP HTTP /mcp)
- Frontend: 11012 (Vite dev, proxies /api + /mcp -> 11013)
- Bridge: ECMAScript automation scripts executed in Tahoma2D
- Tauri 2.0 native desktop wrapper available

## Commands
- `just lint` — ruff check
- `just fmt` — ruff format check
- `just fix` — ruff fix + format
- `just check` — fmt + lint
- `just ci` — check + test
- `just test` — pytest
- `just serve` — run MCP server (stdio)
- `just web` — start frontend
- `just start` — full stack via start.ps1
- `just dev` — hot-reload backend (uvicorn)
- `just bootstrap` — uv sync
- `just build` — python -m build
- `just build-sidecar` — PyInstaller
- `just build-native` — Tauri release
- `just build-native-debug` — Tauri debug
- `just build-all` — full pipeline
- `just tauri-dev` — hot-reload Tauri
- `just e2e` — Playwright tests
- `just check-sec` — bandit
- `just audit-deps` — safety
- `just clean` — remove build artifacts

## Architecture
- `src/tahoma2d_mcp/server.py` — ASGI + stdio server entry
- `src/tahoma2d_mcp/tools/` — 8 portmanteau tool modules
- `src/tahoma2d_mcp/bridge/` — ECMAScript executor
- `native/` — Tauri 2.0 wrapper
- `webapp/` — React + Vite + Tailwind dashboard
- `tests/` — pytest suite
- `webapp/e2e/` — Playwright e2e tests

## Fleet Role
2D animation compositor. Receives AI-generated assets from fleet generators.

## Dependencies
- Tahoma2D 1.6+ (https://tahoma2d.org)
- Python 3.12+
- Node.js 20+ (webapp dev)
- Rust toolchain (native build)

## Ports
- Frontend: 11012
- Backend: 11013
