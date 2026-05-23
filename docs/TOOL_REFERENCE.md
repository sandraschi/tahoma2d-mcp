# Tahoma2D MCP — Tool Reference

## Portmanteau Tools

### `tahoma2d_project`
Project lifecycle: create, open, save, close.

| Operation | Params | Description |
|-----------|--------|-------------|
| `create` | name, width, height, fps | Create new animation project |
| `open` | file_path | Open existing .tnz project |
| `save` | — | Save current project |

### `tahoma2d_canvas`
Canvas management: create, list.

| Operation | Params | Description |
|-----------|--------|-------------|
| `create` | name, width, height | Create canvas |
| `list` | — | List all canvases |

### `tahoma2d_layer`
Layer management: create, list, delete, set properties.

| Operation | Params | Description |
|-----------|--------|-------------|
| `create` | canvas_name, layer_name | Create layer |
| `list` | canvas_name | List layers |

### `tahoma2d_draw`
Drawing and painting operations.

| Operation | Params | Description |
|-----------|--------|-------------|
| `draw_stroke` | canvas, layer, points, color, thickness | Freehand/line stroke |
| `draw_box` | canvas, layer, width, height, color, thickness | Rectangle |
| `draw_circle` | canvas, layer, radius, color, thickness | Ellipse |
| `fill_region` | canvas, layer, color | Color fill |

### `tahoma2d_animation`
Animation controls: keyframes, timeline.

| Operation | Params | Description |
|-----------|--------|-------------|
| `set_keyframe` | canvas, layer, frame | Insert keyframe |
| `clear_keyframe` | canvas, layer, frame | Remove keyframe |
| `set_fps` | fps | Set project frame rate |

### `tahoma2d_effects`
Visual effects: blur, glow, shadow, tint, etc.

| Operation | Params | Description |
|-----------|--------|-------------|
| `apply` | canvas, layer, effect_type, intensity | Apply effect |
| `list` | — | Available effects |

### `tahoma2d_render`
Render and export.

| Operation | Params | Description |
|-----------|--------|-------------|
| `render` | output_path, start, end | Render frame sequence |
| `export` | output_path, format | Export to MP4/GIF/MOV/SVG |

### `tahoma2d_status`
Server and Tahoma2D health.

| Operation | Params | Description |
|-----------|--------|-------------|
| `status` | format | Server + Tahoma2D status |
| `help` | — | Tool reference |
