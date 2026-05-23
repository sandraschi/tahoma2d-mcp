# Architecture

```
┌─────────────────────────────────────────────────────┐
│                 tahoma2d-mcp                         │
│                                                      │
│  ┌────────────┐    ┌──────────────────────────────┐  │
│  │ FastMCP 3.2 │    │  FastAPI REST (optional)     │  │
│  │  /mcp       │    │  /api/health, /api/status    │  │
│  └─────┬───────┘    └──────────────────────────────┘  │
│        │                                              │
│  ┌─────▼──────────────────────────────────────────┐   │
│  │  Tools Layer                                   │   │
│  │  project │ canvas │ layer │ draw │ animation   │   │
│  │  effects │ render │ system                      │   │
│  └─────┬──────────────────────────────────────────┘   │
│        │                                              │
│  ┌─────▼──────────────────────────────────────────┐   │
│  │  Bridge Layer (Tahoma2D Executor)               │   │
│  │  ECMAScript automation scripts → Tahoma2D CLI   │   │
│  │  or TCP bridge to running Tahoma2D GUI          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

┌────────────────┐     ┌──────────────┐
│  React Webapp  │────▶│  Vite Proxy  │
│  (port 11012)  │     │  /mcp → 11013│
└────────────────┘     └──────┬───────┘
                              │
┌─────────────────────────────▼───────┐
│  Tauri 2.0 Native Wrapper            │
│  (optional: bundles everything)       │
│  Sidecar: PyInstaller .exe           │
└─────────────────────────────────────┘
```

## Bridge Modes

1. **Subprocess** — Launch Tahoma2D in script mode, execute .js, capture JSON
2. **Bridge** — (future) TCP to running Tahoma2D GUI for real-time operations

## Fleet Integration

```
Fleet generators (wan-video, veogen, worldlabs, blender-mcp GP)
        │
        ▼
   tahoma2d-mcp (compositor, ink/paint, render)
        │
        ▼
   resolveops (final edit, color grade) → output
```
