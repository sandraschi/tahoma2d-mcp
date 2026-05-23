# Tahoma2D MCP — Native Desktop Wrapper

Tauri 2.0 desktop wrapper for the Tahoma2D MCP server.

## Prerequisites

- Rust toolchain (`rustup`)
- Node.js 20+
- Python 3.12+ with `uv`
- Tahoma2D 1.6+ (at tahoma2d.org)

## Development

```powershell
# Dev mode with hot-reload (backend must be running separately)
just tauri-dev
```

## Build

```powershell
# Full release pipeline (webapp → PyInstaller → Tauri)
just build-all

# Or step by step:
just build-sidecar    # PyInstaller only
just build-native     # Tauri only
```

The installer lands at `target/release/bundle/nsis/Tahoma2D MCP_0.1.0_x64-setup.exe`.
