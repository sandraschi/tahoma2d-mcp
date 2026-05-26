# Changelog

## v0.2.0 (2026-05-23)

### Pivot — Render Orchestrator
- Repurposed from 2D animation compositor to tcomposer render engine
- Removed stub tools: canvas, layer, draw, animation, effects (ToonzScript not available)
- Removed ecmascript_gen.py bridge (confirmed non-functional in this Tahoma2D build)
- Retained and rebuilt: project (scene file mgmt), render (tcomposer), export (ffmpeg), status
- Trimmed webapp from 12 to 6 pages (Dashboard, Render, Export, Projects, Settings, Help)
- All 4 tools confirmed working against Tahoma2D 1.6.1

## v0.1.0 (2026-05-23)

### Initial Scaffold
- FastMCP 3.2 server scaffold with 8 portmanteau tools
- React + Vite + Tailwind dashboard (12 pages)
- Tauri 2.0 native wrapper
- Full SOTA fleet compliance
