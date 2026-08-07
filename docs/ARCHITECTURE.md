# Architecture

## Components

```
┌─────────────────────────────────────────────────────────┐
│  tahoma2d-mcp                                           │
│                                                         │
│  FastMCP 3.2 (/mcp)  +  FastAPI (health, config API)   │
│         │                                               │
│  ┌──────▼──────────────────────────────────────────┐   │
│  │  Tools: status │ project │ render │ export      │   │
│  └──────┬──────────────────────────────────────────┘   │
│         │                                               │
│  ┌──────▼──────────────────────────────────────────┐   │
│  │  Tahoma2DExecutor                               │   │
│  │  • tcomposer.exe  — headless .tnz render        │   │
│  │  • Tahoma2D.exe   — open GUI (project.open)     │   │
│  │  • ffmpeg         — export only (external)      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

React webapp (:11012) ──proxy──▶ backend (:11013)
```

## Heritage

Tahoma2D → OpenToonz (2016 OSS) → Ghibli-customized Toonz → commercial Toonz (Digital Video). The `.tnz` format and `tcomposer` renderer come from this stack. See [TAHOMA2D_GUIDE.md](TAHOMA2D_GUIDE.md#lineage-toonz--ghibli--opentoonz--tahoma2d).

## What Tahoma2D provides

| Binary | Role |
|--------|------|
| `Tahoma2D.exe` | Full 2D animation editor (authoring) |
| `tcomposer.exe` | Headless scene renderer (batch frames) |

ToonzScript / `.toonzscript` automation is **not** used in this MCP — it is unavailable in the 1.6.1 builds tested.

## Fleet integration

```text
Authoring:  Tahoma2D GUI (human or imported assets)
Batch:      tahoma2d-mcp → PNG/TGA sequence
Finish:     ffmpeg / davinci-resolve-mcp
```

Optional Tauri native wrapper bundles the Python backend (see `docs/README_TAURI.md`).
