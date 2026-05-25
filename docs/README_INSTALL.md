# Installation & Setup

## Prerequisites

- **Python 3.12+** and [uv](https://docs.astral.sh/uv/)
- **Node.js 20+** (for the web dashboard)
- **Tahoma2D** (see below)

## Installing Tahoma2D

1. Download from [tahoma2d.org](https://tahoma2d.org)
2. Choose Windows portable zip or installer
3. Extract/install to any location

Common locations auto-detected:

- `C:\Program Files\Tahoma2D\Tahoma2D.exe`
- `C:\Program Files (x86)\Tahoma2D\Tahoma2D.exe`
- `%LOCALAPPDATA%\Tahoma2D\Tahoma2D.exe`
- `%USERPROFILE%\Tahoma2D\Tahoma2D.exe`
- `C:\Tahoma2D\Tahoma2D.exe`
- `%TAHOMA2D_EXE%` env var

If auto-detection fails, set the path in the webapp Settings page or via the `TAHOMA2D_EXE` environment variable.

## Server Setup

```bash
# Clone and install
git clone https://github.com/your-org/tahoma2d-mcp
cd tahoma2d-mcp
uv sync

# Start full stack (backend :11013 + frontend :11012)
.\start.ps1

# Or just the backend
uv run uvicorn tahoma2d_mcp.server:asgi_app --host 127.0.0.1 --port 11013

# Or just the frontend
cd webapp && npm run dev -- --port 11012 --host
```

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
