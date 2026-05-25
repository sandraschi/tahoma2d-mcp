# Webapp Dashboard Guide

The webapp runs on **port 11012** and provides a graphical interface for all Tahoma2D MCP tools.

## Pages

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/` | Server status, project overview |
| Canvas | `/canvas` | Create and manage canvases |
| Layers | `/layers` | Add, delete, configure layers |
| Draw | `/draw` | Draw strokes, shapes, fills |
| Animation | `/animation` | Keyframes and timeline |
| Effects | `/effects` | Apply visual effects |
| Compositor | `/compositor` | Multi-layer compositing |
| Render | `/render` | Render frame sequences |
| Export | `/export` | Export to video/GIF/SVG |
| AI Assistant | `/chat` | MCP tool chat interface |
| Settings | `/settings` | Tahoma2D path, server config |
| Help | `/help` | Full documentation |

## Troubleshooting

- **Tahoma2D not found**: Go to Settings, set the correct path to Tahoma2D.exe
- **Backend unreachable**: Run `start.ps1`, check port 11013 is listening
- **Frontend blank**: Check the browser console for errors, verify Vite proxy config
