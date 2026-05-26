# tahoma2d-mcp

**Headless .tnz scene renderer** via tcomposer.exe + ffmpeg export.

NOT a 2D animation compositor. ToonzScript (ECMAScript automation) is **not available**
in the Tahoma2D 1.6.1 build that ships. You cannot create or edit scenes programmatically
through this server. You create scenes in the Tahoma2D GUI, then render here.

## What This Actually Does

| Tool | What it does | Limitation |
|------|-------------|------------|
| `tahooma2d_status` | Checks tcomposer is installed | — |
| `tahooma2d_project` | Lists .tnz files on disk | Read-only. Cannot create or edit scenes. |
| `tahooma2d_render` | Launches tcomposer.exe to render .tnz frame range | Requires a pre-existing .tnz file |
| `tahooma2d_export` | Converts rendered frames to MP4 via ffmpeg | Requires ffmpeg in PATH |

## What This Is NOT

This is NOT a 2D animation compositor, a replacement for Blender Grease Pencil,
a scriptable animation pipeline, or something that can create or edit scenes.

This IS a headless batch renderer for existing .tnz scenes.

## Why

Tahoma2D 1.6.1 ships with Qt5Script.dll but the `.toonzscript` automation path
was either compiled out or changed between source and binary. The only confirmed
headless operations are:

- `tcomposer.exe scene.tnz -o output.png -range 1 24` ✅ working
- `tcomposer.exe -version` ✅ working

## Workflow

```
1. Create/edit .tnz scenes in Tahoma2D GUI
2. tahoma2d_render(scene_path="scene.tnz", start=1, end=100)
3. tahoma2d_export(input_pattern="frame_%04d.png", output="out.mp4")
```

## Requirements

- Tahoma2D 1.6+ installed ([tahooma2d.org](https://tahooma2d.org))
- ffmpeg in PATH (for export tool)
- Python 3.12+
- Node.js 20+ (for webapp dev)

## Quick Start

```bash
uv sync
.\start.ps1
```

## Claude Desktop Config

```json
{
  "mcpServers": {
    "tahoma2d": {
      "command": "uv",
      "args": ["--directory", "D:/Dev/repos/tahooma2d-mcp", "run", "tahooma2d-mcp-server"]
    }
  }
}
```

## Ports

| Port | Role |
|------|------|
| 11012 | Vite frontend |
| 11013 | FastAPI + FastMCP HTTP |

## Fleet Role

```
blender-mcp GP (create 2D) -> .tnz -> tahoma2d-mcp (render frames) -> resolveops (final edit)
```

## License

MIT
