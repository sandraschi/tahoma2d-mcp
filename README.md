# tahoma2d-mcp — Tahoma2D Render Engine

**FastMCP 3.2** — Headless .tnz scene rendering via tcomposer.exe + ffmpeg export.

> Pivot: Not a 2D animation compositor (ToonzScript not available in this build).
> Instead: a render orchestrator. Create .tnz scenes in the Tahoma2D GUI,
> render them headlessly via tcomposer, export frames to video via ffmpeg.

## Quick Start

```bash
uv sync
.\start.ps1
# Opens http://localhost:11012
```

## Tools

| Tool | Description |
|------|-------------|
| `tahooma2d_status` | Server + tcomposer health check |
| `tahooma2d_project` | List, inspect, open .tnz scene files |
| `tahooma2d_render` | Headless rendering via tcomposer.exe |
| `tahooma2d_export` | Convert frame sequences to video (ffmpeg) |

## Ports

| Port | Role |
|------|------|
| 11012 | Vite frontend |
| 11013 | FastAPI + FastMCP HTTP |

## Workflow

```
1. Create/edit .tnz scene in Tahoma2D GUI
2. tahoma2d_render(scene_path="scene.tnz", start=1, end=100)
3. tahoma2d_export(input_pattern="render_%04d.png", output="out.mp4")
```

## Claude Desktop Config

```json
{
  "mcpServers": {
    "tahoma2d": {
      "command": "uv",
      "args": ["--directory", "D:/Dev/repos/tahoma2d-mcp", "run", "tahooma2d-mcp-server"]
    }
  }
}
```

## justfile targets

| Target | Purpose |
|--------|---------|
| `lint` / `fix` | Ruff |
| `test` | pytest |
| `serve` / `web` / `start` | Run server / frontend / both |

## Fleet Role

```
blender-mcp GP (create 2D) → .tnz → tahoma2d-mcp (render frames) → resolveops (final edit)
```

## See Also

- [tahoma2d.org](https://tahoma2d.org)
- [WEBAPP_PORTS.md](../../operations/WEBAPP_PORTS.md)
- [FLEET_INDEX.md](../FLEET_INDEX.md)
