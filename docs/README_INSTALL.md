# Installation & Setup

See **[TAHOMA2D_GUIDE.md](TAHOMA2D_GUIDE.md)** for full Tahoma2D install, first scene, and batch-render workflow.

Quick copy: root **[INSTALL.md](../INSTALL.md)**.

## Prerequisites

- **Tahoma2D 1.6+** — [tahoma2d.org](https://tahoma2d.org) (`Tahoma2D.exe` + `tcomposer.exe`)
- **Python 3.12+** and [uv](https://docs.astral.sh/uv/)
- **Node.js 20+** (web dashboard)
- **ffmpeg** on PATH (MP4 export only)

## Server setup

```powershell
git clone https://github.com/sandraschi/tahoma2d-mcp
cd tahoma2d-mcp
uv sync
cd webapp
npm install
cd ..
.\start.ps1
```

Tahoma2D path: webapp **Settings** or `TAHOMA2D_EXE` env var.

## MCP Client Config (Claude Desktop)

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

## Docker

```bash
docker-compose up
```

The Docker image bundles Python deps and the webapp. Tahoma2D must be installed on the host and mounted via volume.
