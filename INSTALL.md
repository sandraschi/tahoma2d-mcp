# Installation

Two parts: **Tahoma2D** (animation app) and **tahoma2d-mcp** (batch render server).

Detailed GUI walkthrough: [docs/TAHOMA2D_GUIDE.md](docs/TAHOMA2D_GUIDE.md) · Webapp: **Help** page at `/help`.

---

## 1. Install Tahoma2D (required)

Tahoma2D is the actual 2D animation program (fork of OpenToonz → Toonz → Ghibli production lineage). This MCP only renders scenes you build there.

1. Download from [tahoma2d.org](https://tahoma2d.org) — Windows build **1.6+**
2. Run installer or extract portable zip
3. Confirm in the install folder:

| File | Role |
|------|------|
| `Tahoma2D.exe` | Editor — draw, Xsheet, save `.tnz` |
| `tcomposer.exe` | Headless renderer — used by this MCP |

PowerShell verify:

```powershell
Test-Path "C:\Program Files\Tahoma2D\Tahoma2D.exe"
Test-Path "C:\Program Files\Tahoma2D\tcomposer.exe"
```

4. Launch `Tahoma2D.exe` once; pick a project folder when asked.

**If auto-detection fails**, set the path to `Tahoma2D.exe` in the webapp **Settings** page or:

```powershell
$env:TAHOMA2D_EXE = "D:\Apps\Tahoma2D\Tahoma2D.exe"
```

Auto-searched paths: `Program Files`, `Program Files (x86)`, `%LOCALAPPDATA%\Tahoma2D`, `%USERPROFILE%\Tahoma2D`, `C:\Tahoma2D`.

---

## 2. Install ffmpeg (optional, for MP4)

Frame render outputs images; MP4 needs ffmpeg on PATH:

```powershell
ffmpeg -version
```

(`winget install ffmpeg` works on many Windows setups.)

---

## 3. Install tahoma2d-mcp

**Prerequisites:** Python 3.12+ ([uv](https://docs.astral.sh/uv/)), Node.js 20+

```powershell
git clone https://github.com/sandraschi/tahoma2d-mcp
cd tahoma2d-mcp
uv sync
cd webapp
npm install
cd ..
.\start.ps1
```

| URL | Service |
|-----|---------|
| http://127.0.0.1:11012 | Web dashboard |
| http://127.0.0.1:11013 | MCP + API |

Open **Settings** → Check Status. You should see Tahoma2D and tcomposer paths.

---

## 4. Typical usage

1. **Tahoma2D GUI** — New Scene → levels → Xsheet → Save `Scene.tnz`
2. **Dashboard → Render** — scene path, frame range, output images
3. **Dashboard → Export** — frame sequence → MP4

---

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

## Tauri native build

```powershell
just build-all
```

Installer: `native/target/release/bundle/nsis/Tahoma2D MCP_0.1.0_x64-setup.exe`
