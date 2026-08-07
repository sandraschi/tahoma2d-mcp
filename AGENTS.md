# tahoma2d-mcp — Agent Guide

## What Tahoma2D is

Free **2D animation** desktop app — fork of **OpenToonz**, which descends from **Toonz** (Digital Video) and the **Studio Ghibli** ink & paint pipeline (e.g. *Spirited Away*). Users build `.tnz` scenes in **Tahoma2D.exe**. This repo only batch-renders via **tcomposer.exe** + optional ffmpeg MP4.

Lineage: `docs/TAHOMA2D_GUIDE.md` § Lineage.

## Server

| Port | Role |
|------|------|
| 11013 | FastMCP HTTP `/mcp` + REST |
| 11012 | Vite dashboard (start here for “what is this?”) |

## MCP tools

`tahoma2d_status` · `tahoma2d_project` · `tahoma2d_render` · `tahoma2d_export`

## Commands

```powershell
uv sync
just start    # or .\start.ps1
just test
```

User-facing explainer: `docs/TAHOMA2D_GUIDE.md`, webapp `/help`, `INSTALL.md`.

Install docs: `mcp-central-docs/standards/AGENT_INSTALL_REFERENCE.md`
