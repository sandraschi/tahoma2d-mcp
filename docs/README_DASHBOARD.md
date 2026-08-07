# Webapp dashboard

The webapp runs on **port 11012** and proxies MCP calls to the backend on **11013**.

## What you are looking at

**Tahoma2D** is a free 2D animation desktop app ([tahoma2d.org](https://tahoma2d.org)).  
**This dashboard** is only the **batch render/export** side — it does not replace the Tahoma2D editor.

## Pages

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/` | What Tahoma2D is, server status, workflow overview |
| Render | `/render` | Headless `tcomposer` frame render |
| Export | `/export` | ffmpeg frame sequence → video |
| Projects | `/projects` | List / open `.tnz` scene files |
| Settings | `/settings` | Tahoma2D install path, connectivity |
| Help | `/help` | Full “what is this?” + MCP tool reference |

Full Tahoma2D install and GUI walkthrough: [TAHOMA2D_GUIDE.md](TAHOMA2D_GUIDE.md) or webapp **Help** (`/help`).

## Troubleshooting

- **Tahoma2D not found** — Settings → set folder containing `Tahoma2D.exe` and `tcomposer.exe`
- **Backend unreachable** — Run `.\start.ps1`; confirm port 11013
- **Render errors** — Open the scene in the GUI first; verify frame range and write permissions on output dir
- **Export errors** — Install ffmpeg and add it to PATH
