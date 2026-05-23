# tahoma2d-mcp — Tahoma2D Animation MCP Server

**FastMCP 3.2** — Unified Gateway: MCP (stdio/HTTP) + REST + Vite dashboard + Tauri 2.0 desktop.

> 2D animation production via Tahoma2D (active OpenToonz fork). BSD-licensed, Ghibli-pedigree, last release May 2026.
> 8 portmanteau tools: project, canvas, layer, draw, animation, effects, render, status.

## Quick Start

```bash
uv sync
.\start.ps1
# Opens http://localhost:11012
```

## Claude Desktop Config

```json
{
  "mcpServers": {
    "tahoma2d": {
      "command": "uv",
      "args": ["--directory", "D:/Dev/repos/tahoma2d-mcp", "run", "tahoma2d-mcp-server"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `tahoma2d_project` | Create, open, save projects |
| `tahoma2d_canvas` | Create, list canvases |
| `tahoma2d_layer` | Create, list layers |
| `tahoma2d_draw` | Draw strokes, shapes, fill |
| `tahoma2d_animation` | Keyframes, FPS, timeline |
| `tahoma2d_effects` | Blur, glow, shadow, tint |
| `tahoma2d_render` | Render, export video/SVG |
| `tahoma2d_status` | Server health |

## Ports

| Port | Role |
|------|------|
| 11012 | Vite frontend |
| 11013 | FastAPI + FastMCP HTTP |

## justfile targets

| Target | Purpose |
|--------|---------|
| `lint` / `fix` | Ruff lint + format |
| `test` / `e2e` | pytest + Playwright |
| `serve` / `web` / `start` | Run server / frontend / both |
| `build-sidecar` | PyInstaller EXE |
| `build-native` / `build-all` | Tauri release |

## Fleet Integration

```
Fleet generators → tahoma2d-mcp (compositor) → resolveops (final edit)
Cross-refs: blender-mcp (Grease Pencil), freecad-mcp (CAD), godot-mcp (game)
```

## License

MIT — Free for personal and commercial use.

## See Also

- [tahoma2d.org](https://tahoma2d.org) — active OpenToonz fork
- [WEBAPP_PORTS.md](../../operations/WEBAPP_PORTS.md)
- [FLEET_INDEX.md](../FLEET_INDEX.md)
