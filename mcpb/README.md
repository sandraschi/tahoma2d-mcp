# tahoma2d-mcp (MCPB Bundle)

MCP batch renderer for Tahoma2D .tnz scenes (tcomposer + ffmpeg)

## Usage

Add to \claude_desktop_config.json\:
\\\json
{
  "mcpServers": {
    "tahoma2d-mcp": {
      "command": "uv",
      "args": ["run", "--directory", "\D:\Dev\repos", "python", "-m", "tahoma2d_mcp"],
      "env": { "PYTHONPATH": "\D:\Dev\repos/src" }
    }
  }
}
\\\

## Tools

- **tahoma2d-mcp**: MCP batch renderer for Tahoma2D .tnz scenes (tcomposer + ffmpeg)

## Requirements

- Python 3.12+
- uv
