# tahoma2d-mcp

**MCP + web dashboard for headless Tahoma2D rendering** — batch-render existing `.tnz` scenes with `tcomposer.exe`, then stitch frames to MP4 with ffmpeg.

> **Tahoma2D** is a free, open-source **2D animation program** — a fork of [OpenToonz](https://opentoonz.github.io/), which itself descends from **Toonz** (Digital Video) and the **Studio Ghibli** production branch used for ink & paint on films such as *Spirited Away* and *Princess Mononoke*. Download: [tahoma2d.org](https://tahoma2d.org)

## Lineage (Toonz → Ghibli → OpenToonz → Tahoma2D)

| Step | What happened |
|------|----------------|
| **Toonz** | Commercial 2D animation system (Italy); raster ink/paint, Xsheet, compositing. |
| **Ghibli** | Studio Ghibli used and co-developed a customized Toonz pipeline for traditional feature animation (~1990s–2010s). |
| **OpenToonz** | Ghibli-supported **open-source release** (2016) of that codebase. |
| **Tahoma2D** | Independent **fork of OpenToonz** — what you install for day-to-day work today. |

Scene files (`.tnz`), the Xsheet, and `tcomposer.exe` all come from this family. **tahoma2d-mcp** only batch-renders those scenes; it does not implement a separate animation engine.

Details: [docs/TAHOMA2D_GUIDE.md](docs/TAHOMA2D_GUIDE.md#lineage-toonz--ghibli--opentoonz--tahoma2d)

## What Tahoma2D is (the desktop app)

| You do in **Tahoma2D.exe** | You get |
|----------------------------|---------|
| Draw / import artwork on levels | Raster or vector layers |
| Build scenes (`.tnz`) | Timeline, camera, effects stack |
| Preview & polish | Full GUI compositor + playback |

Tahoma2D is the **authoring tool**. This repo is **not** a replacement for that GUI.

## What this MCP server does

| Tool | Purpose |
|------|---------|
| `tahoma2d_status` | Server health + `tcomposer.exe` detection |
| `tahoma2d_project` | List / inspect `.tnz` files; open a scene in the GUI |
| `tahoma2d_render` | Headless frame render via `tcomposer.exe` |
| `tahoma2d_export` | Frame sequence → MP4 (or other) via ffmpeg |

**Workflow:** edit in Tahoma2D GUI → render frames here → export video.

```
Tahoma2D GUI  →  .tnz scene on disk
       ↓
tahoma2d_render(scene_path, start_frame, end_frame, output_path)
       ↓
tahoma2d_export(input_pattern, output_path)   # optional MP4
```

## What this does **not** do

- Create or edit scenes programmatically (no working ToonzScript in Tahoma2D 1.6.1 builds shipped today)
- Replace Blender Grease Pencil, TVPaint, or Krita animation
- Run as a live “compositor MCP” inside the editor

Confirmed headless ops on **Tahoma2D 1.6.1**:

```text
tcomposer.exe scene.tnz -o frame.png -range 1 24 -step 1
tcomposer.exe -version
```

## Requirements

- **Tahoma2D 1.6+** — [tahoma2d.org](https://tahoma2d.org) (installs `Tahoma2D.exe` + `tcomposer.exe`)
- **ffmpeg** in PATH (export tool only)
- **Python 3.12+** (`uv sync`)
- **Node.js 20+** (webapp dev)

## Quick start

```powershell
uv sync
.\start.ps1
# Webapp: http://127.0.0.1:11012
# Backend: http://127.0.0.1:11013
```

Open **Dashboard → Help** in the webapp for the full “what is this?” guide.

## Claude Desktop / Cursor

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

## Ports

| Port | Role |
|------|------|
| 11012 | Vite frontend (dashboard) |
| 11013 | FastAPI + FastMCP HTTP (`/mcp`) |

## Fleet role

```text
(blender-mcp GP / hand-drawn assets) → .tnz in Tahoma2D GUI
        → tahoma2d-mcp (batch render)
        → davinci-resolve-mcp / ffmpeg (final grade & edit)
```

## Docs

| File | Contents |
|------|----------|
| [docs/TAHOMA2D_GUIDE.md](docs/TAHOMA2D_GUIDE.md) | **Tahoma2D install + GUI usage + MCP workflow** |
| [INSTALL.md](INSTALL.md) | MCP server setup |
| [docs/TOOL_REFERENCE.md](docs/TOOL_REFERENCE.md) | MCP operations |
| [docs/README_DASHBOARD.md](docs/README_DASHBOARD.md) | Webapp pages |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack diagram |

## License

MIT
