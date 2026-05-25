# tahoma2d-mcp

**2D animation production server** — MCP tools + Vite dashboard for Tahoma2D (active OpenToonz fork).

```bash
uv sync && .\start.ps1
# Opens http://localhost:11012
```

## Table of Contents

- [Installation & Setup](docs/README_INSTALL.md)
- [API Reference](docs/README_API.md)
- [Webapp Dashboard Guide](docs/README_DASHBOARD.md)
- [Tauri Native Desktop](docs/README_TAURI.md)
- [Contributing](docs/README_CONTRIBUTING.md)

## Quick Start

1. **Install Tahoma2D** from [tahoma2d.org](https://tahoma2d.org) (portable zip or installer)
2. **`uv sync`** — install Python deps
3. **`.\start.ps1`** — launches backend on :11013 + frontend on :11012

If Tahoma2D isn't auto-detected, set the path in Settings → Tahoma2D Executable.

## Tools

| Tool | Description |
|------|-------------|
| `tahoma2d_project` | Create, open, save .tnz projects |
| `tahoma2d_canvas` | Create, list, resize canvases |
| `tahoma2d_layer` | Create, list, delete, visibility, opacity |
| `tahoma2d_draw` | Strokes, boxes, circles, lines, fills |
| `tahoma2d_animation` | Keyframes, FPS, frame range |
| `tahoma2d_effects` | Blur, glow, shadow, tint, color curve, levels, noise |
| `tahoma2d_render` | Render frames, export MP4/GIF/MOV/SVG |
| `tahoma2d_status` | Server health, Tahoma2D availability |

## Ports

| Port | Service |
|------|---------|
| 11012 | Vite frontend |
| 11013 | Backend (REST + MCP HTTP) |

## justfile

| Target | Purpose |
|--------|---------|
| `lint` / `fix` | Ruff lint + format |
| `test` / `e2e` | pytest + Playwright |
| `serve` / `web` / `start` | Run server / frontend / both |
| `build-sidecar` | PyInstaller EXE |
| `build-native` / `build-all` | Tauri release |

## License

MIT — free for personal and commercial use.
