# Contributing

## Setup

```bash
uv sync
uv sync --group dev
```

## Development

- `just lint` — Ruff lint check
- `just fix` — Ruff auto-fix + format
- `just test` — Run pytest
- `just dev` — Run backend with hot reload

## Adding a Tool

1. Create `src/tahoma2d_mcp/tools/{name}_tools.py`
2. Decorate with `@app.tool` (app from `..app.get_app()`)
3. It auto-registers via the tools package's `discover_tools()`

## Code Style

- Ruff: line-length 120, double quotes
- Pydantic v2 model patterns (`model_dump()` not `dict()`)
- FastMCP 3.2 `Context` import via compat shim
