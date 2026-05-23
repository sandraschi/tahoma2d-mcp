# Installation

## Prerequisites
- Python 3.12+ (recommended: install via [uv](https://docs.astral.sh/uv/))
- Node.js 20+ (for webapp development)
- Tahoma2D 1.6+ (download from [tahoma2d.org](https://tahoma2d.org))

## Setup

```bash
# Clone
git clone https://github.com/sandraschi/tahoma2d-mcp
cd tahoma2d-mcp

# Python deps
uv sync

# Webapp deps
cd webapp && npm install && cd ..

# Start
.\start.ps1
```

## Claude Desktop Integration

Add to `claude_desktop_config.json`:

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

## Tauri Native Desktop

```bash
just build-all
# Installer at: native/target/release/bundle/nsis/Tahoma2D MCP_0.1.0_x64-setup.exe
```
