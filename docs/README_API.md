# API Reference

## REST Endpoints

All REST endpoints are served on port **11013**.

### `GET /api/status`

Server health and Tahoma2D availability.

```json
{
  "status": "running",
  "version": "0.1.0",
  "tahoma2d_available": true,
  "tahoma2d_path": "C:\\Program Files\\Tahoma2D\\Tahoma2D.exe"
}
```

### `GET /api/config`

Full server configuration.

```json
{
  "tahoma2d_path": "C:\\Program Files\\Tahoma2D\\Tahoma2D.exe",
  "tahoma2d_available": true,
  "tahoma2d_script_dir": "D:\\Dev\\repos\\tahoma2d-mcp\\scripts",
  "tahoma2d_data_dir": "D:\\Dev\\repos\\tahoma2d-mcp\\data",
  "mcp_port": 11013,
  "mcp_host": "127.0.0.1",
  "mcp_transport": "http",
  "log_level": "INFO"
}
```

### `POST /api/config`

Update configuration (e.g., Tahoma2D path).

```json
// Request
{ "tahoma2d_path": "C:\\Program Files (x86)\\Tahoma2D\\Tahoma2D.exe" }

// Response
{ "success": true, "tahoma2d_path": "C:\\Program Files (x86)\\Tahoma2D\\Tahoma2D.exe", "tahoma2d_available": true }
```

### `POST /api/tool`

Call any MCP tool via REST bridge.

```json
// Request
{ "tool": "tahoma2d_status", "params": { "operation": "status", "format": "json" } }

// Response
{ "success": true, "data": "STATUS: {'status': 'running', 'version': '0.1.0', ...}" }
```

## MCP Endpoint

- **Path**: `/mcp`
- **Transport**: Streamable HTTP (JSON-RPC)
- **Port**: 11013

## MCP Tools

### tahoma2d_status

Check server health and Tahoma2D availability.

| Parameter | Type | Description |
|-----------|------|-------------|
| `operation` | string | `"status"` or `"help"` |
| `format` | string | `"text"` (default) or `"json"` |

### tahoma2d_project

Create, open, and save projects.

| Operation | Parameters |
|-----------|------------|
| `create` | `name`, `width`, `height`, `fps` |
| `open` | `path` |
| `save` | `path` (optional) |

### tahoma2d_canvas

Manage canvases within a project.

| Operation | Parameters |
|-----------|------------|
| `create` | `name`, `width`, `height` |
| `list` | — |
| `resize` | `name`, `width`, `height` |

### tahoma2d_layer

Manage layers on a canvas.

| Operation | Parameters |
|-----------|------------|
| `create` | `canvas`, `name`, `type` |
| `list` | `canvas` |
| `delete` | `canvas`, `name` |
| `set_visibility` | `canvas`, `name`, `visible` |
| `set_opacity` | `canvas`, `name`, `opacity` |

### tahoma2d_draw

Draw strokes, shapes, and fills.

| Operation | Parameters |
|-----------|------------|
| `draw_stroke` | `canvas`, `layer`, `points`, `thickness` |
| `draw_box` | `canvas`, `layer`, `x`, `y`, `width`, `height`, `thickness` |
| `draw_circle` | `canvas`, `layer`, `x`, `y`, `radius`, `thickness` |
| `draw_line` | `canvas`, `layer`, `x1`, `y1`, `x2`, `y2`, `thickness` |
| `fill_region` | `canvas`, `layer`, `x`, `y` |
| `set_color` | `r`, `g`, `b`, `a` |

### tahoma2d_animation

Keyframes and timeline control.

| Operation | Parameters |
|-----------|------------|
| `set_keyframe` | `canvas`, `layer`, `frame` |
| `clear_keyframe` | `canvas`, `layer`, `frame` |
| `set_fps` | `fps` |
| `set_frame_range` | `start`, `end` |

### tahoma2d_effects

Apply and manage visual effects.

| Operation | Parameters |
|-----------|------------|
| `apply` | `canvas`, `layer`, `effect`, `intensity` |
| `list` | — |
| `remove` | `canvas`, `layer`, `effect` |

Supported effects: `blur`, `glow`, `shadow`, `tint`, `color_curve`, `levels`, `noise`.

### tahoma2d_render

Render and export.

| Operation | Parameters |
|-----------|------------|
| `render` | `output_path`, `start_frame`, `end_frame`, `resolution_x`, `resolution_y`, `fps` |
| `export` | `output_path`, `format`, `fps`, `resolution_x`, `resolution_y` |
| `export_svg` | `output_path`, `frame` |
| `status` | — |

Supported export formats: `mp4`, `gif`, `mov`, `svg`, `png_sequence`.
