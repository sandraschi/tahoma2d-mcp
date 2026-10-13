# Tahoma2D — install & usage

This guide covers **Tahoma2D itself** (the animation app) and how it connects to **tahoma2d-mcp** (batch render server).

## What Tahoma2D is

Tahoma2D is a **free 2D animation desktop program** ([tahoma2d.org](https://tahoma2d.org)), forked from OpenToonz. You use it to:

- Draw or import artwork on **levels** (raster or vector)
- Place frames on the **Xsheet** (timeline)
- Add **effects**, **camera** moves, and preview playback
- Save **scene files** as `.tnz`

**tahoma2d-mcp does not replace this app.** You animate in Tahoma2D; the MCP only runs `tcomposer.exe` to render frames from scenes you already saved.

---

## Lineage: Toonz → Ghibli → OpenToonz → Tahoma2D

Understanding where Tahoma2D comes from explains the Xsheet workflow and `.tnz` file format.

```text
Digital Video "Toonz" (commercial, Italy, 1990s)
        │
        ▼  customized for ink & paint pipeline
Studio Ghibli version (used in-house for ~20+ years)
        │  films include Princess Mononoke, Spirited Away,
        │  Howl's Moving Castle, The Tale of the Princess Kaguya, …
        ▼  2014: Dwango acquires Digital Video;
        │  Ghibli agrees to open-source their branch
OpenToonz (free / open source, released 2016)
        │
        ▼  independent community fork, ongoing releases
Tahoma2D (tahoma2d.org — what you install today)
```

| Name | What it is |
|------|------------|
| **Toonz** | Original commercial 2D animation system by Digital Video (Italy). Raster cleanup, ink & paint, compositing, camera. |
| **Ghibli × Toonz** | Studio Ghibli adopted Toonz and co-developed a **production-hardened variant** for their traditional animation pipeline — scanning, painting, and compositing hand-drawn cels and digital layers. This is the software lineage behind many Ghibli features, not a separate unrelated app. |
| **OpenToonz** | The **open-source release** (2016) based on the Ghibli-used codebase, maintained under the OpenToonz project ([opentoonz.github.io](https://opentoonz.github.io/)). Still actively developed. |
| **Tahoma2D** | A **fork of OpenToonz** with its own release cadence, bugfixes, and UX tweaks. Same core concepts (levels, Xsheet, schematic, `.tnz` scenes). Files are largely compatible within the same family, but use the same app to open a given project when possible. |

**Why this matters for tahoma2d-mcp:** scene files (`.tnz`), the Xsheet model, and `tcomposer.exe` all come from this Toonz/OpenToonz heritage. This MCP speaks that format — it does not implement a new animation system.

Further reading: [OpenToonz history](https://opentoonz.github.io/e/), [Tahoma2D site](https://tahoma2d.org).

---

## Part 1 — Install Tahoma2D (Windows)

### 1. Download

1. Open [https://tahoma2d.org](https://tahoma2d.org)
2. Download the latest **Windows** build (installer or portable zip)
3. Version **1.6+** is required (tested with 1.6.1)

### 2. Install or extract

**Installer:** run the setup wizard; default location is often:

```text
C:\Program Files\Tahoma2D\
```

**Portable zip:** extract to a folder you control, e.g.:

```text
C:\Tahoma2D\
D:\Apps\Tahoma2D\
```

### 3. Confirm both executables exist

Tahoma2D and the headless renderer must live in the **same folder**:

| File | Purpose |
|------|---------|
| `Tahoma2D.exe` | Full animation editor (GUI) |
| `tcomposer.exe` | Command-line batch renderer (used by this MCP) |

PowerShell check (adjust path to your install):

```powershell
Test-Path "C:\Program Files\Tahoma2D\Tahoma2D.exe"
Test-Path "C:\Program Files\Tahoma2D\tcomposer.exe"
& "C:\Program Files\Tahoma2D\tcomposer.exe" -version
```

Both `Test-Path` calls should return `True`. `-version` should print a build string.

### 4. First launch (GUI)

1. Double-click **Tahoma2D.exe**
2. On first run you may be asked for a **project folder** — pick an empty directory (e.g. `D:\Animation\MyProject`)
3. Tahoma2D creates subfolders such as `scenes`, `drawings`, `extras` under that project root

---

## Part 2 — Use Tahoma2D (author a scene)

Minimal workflow to produce a `.tnz` file this MCP can render:

### 1. New scene

- **File → New Scene** (or open an existing project)
- Set resolution and frame rate when prompted (e.g. 1920×1080, 24 fps)

### 2. Create a level

- **Level → New…** → choose **Raster Level** or **Vector Level**
- Name it (e.g. `bg` or `character`)
- Draw in the **Viewer** or import scanned/digitized art (**File → Import**)

### 3. Build timing on the Xsheet

- Open the **Xsheet** (timeline) panel
- Drag your level into column cells to hold each frame across time
- Extend the scene length by adding frames in the Xsheet header

### 4. Preview

- Use the playback controls in the Viewer to scrub through frames
- Fix drawing or timing before rendering

### 5. Save the scene

- **File → Save Scene** (or Save Scene As…)
- You get a file like:

```text
D:\Animation\MyProject\scenes\Scene01.tnz
```

**This `.tnz` path is what tahoma2d-mcp needs.** Keep the project folder intact — scenes reference drawings and assets by relative paths.

### 6. Optional — render from the GUI

Tahoma2D can render inside the app (**File → Render** or output settings in the render dialog). You do **not** need the GUI render step if you use tahoma2d-mcp instead — both use the same `tcomposer` engine.

---

## Part 3 — Point tahoma2d-mcp at Tahoma2D

The MCP auto-searches these locations (first match wins):

```text
%ProgramFiles%\Tahoma2D\Tahoma2D.exe
%ProgramFiles(x86)%\Tahoma2D\Tahoma2D.exe
%LOCALAPPDATA%\Tahoma2D\Tahoma2D.exe
%USERPROFILE%\Tahoma2D\Tahoma2D.exe
C:\Tahoma2D\Tahoma2D.exe
```

If your install is elsewhere:

**Option A — webapp Settings**

1. Start the stack: `.\start.ps1`
2. Open [http://127.0.0.1:11012/settings](http://127.0.0.1:11012/settings)
3. Set **Tahoma2D.exe** path → Save
4. Click **Check Status** — should show `tahoma2d_available: true`

**Option B — environment variable**

```powershell
$env:TAHOMA2D_EXE = "D:\Apps\Tahoma2D\Tahoma2D.exe"
.\start.ps1
```

**Option C — MCP status tool**

Ask your agent to call `tahoma2d_status` with `operation: status` — response includes `tahoma2d_path` and `tcomposer_path`.

---

## Part 4 — Install ffmpeg (for MP4 export)

Rendering produces **image sequences** (PNG/TGA). MP4 needs **ffmpeg**:

1. Download from [https://ffmpeg.org](https://ffmpeg.org) (or `winget install ffmpeg`)
2. Ensure `ffmpeg` is on PATH:

```powershell
ffmpeg -version
```

3. In the webapp, **Export** page or `tahoma2d_export` with `operation: check_ffmpeg` confirms detection.

---

## Part 5 — Install & run tahoma2d-mcp

```powershell
cd D:\Dev\repos\tahoma2d-mcp
uv sync
cd webapp
npm install
cd ..
.\start.ps1
```

| URL | Role |
|-----|------|
| http://127.0.0.1:11012 | Dashboard, Render, Export, Help |
| http://127.0.0.1:11013 | MCP HTTP `/mcp` + REST API |

---

## Part 6 — Batch render workflow (MCP / dashboard)

```text
1. Author     → Tahoma2D GUI → save Scene.tnz
2. Projects   → list/open .tnz (optional)
3. Render     → frame range → output folder (tcomposer)
4. Export     → frame_%04d.png → video.mp4 (ffmpeg)
```

**Render page example**

- Scene: `D:\Animation\MyProject\scenes\Scene01.tnz`
- Frames: `1` to `48`
- Output: `D:\Animation\MyProject\output\frame_%04d.png`

**Export page example**

- Input pattern: `D:\Animation\MyProject\output\frame_%04d.png`
- Output: `D:\Animation\MyProject\output\Scene01.mp4`
- FPS: `24`

**MCP equivalent**

```text
tahoma2d_render  → operation: render
tahoma2d_export  → operation: to_video
```

---

## Limitations

- **No remote editing** — ToonzScript/scene creation from code is not available in current Tahoma2D 1.6.1 builds.
- **Project paths matter** — moving `.tnz` without its project folder breaks linked drawings.
- **Render errors** — open the scene in the GUI first; confirm frame range and writable output directory.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `tcomposer.exe not found` | Reinstall Tahoma2D; both exes must share one folder; set path in Settings |
| `Scene not found` | Use full absolute path to `.tnz` |
| Render exits with error | Open scene in GUI; check missing levels/assets; try a shorter frame range |
| Black or empty frames | Scene has no exposed column in Xsheet for those frames |
| ffmpeg missing | Install ffmpeg; restart terminal after PATH change |
| MCP offline | Run `.\start.ps1`; port 11013 must be free |

---

## Further reading

- [Tahoma2D manual & tutorials](https://tahoma2d.org) (site docs and community)
- [OpenToonz documentation](https://opentoonz.github.io/e/) (concepts largely apply)
- [TOOL_REFERENCE.md](TOOL_REFERENCE.md) — MCP operation parameters
