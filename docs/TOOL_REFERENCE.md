# tahoma2d-mcp — Tool Reference

All tools use the `tahoma2d_` prefix. Tahoma2D itself is the desktop animation app; this server only drives **tcomposer** (render) and **ffmpeg** (export).

## `tahoma2d_status`

Server health and tcomposer availability.

| Operation | Params | Description |
|-----------|--------|-------------|
| `status` | `format` (`text` / `json`) | MCP version, Tahoma2D path, tcomposer path/version |
| `help` | — | Plain-text tool listing |

## `tahoma2d_project`

Read-only scene file helpers (`.tnz` = Tahoma2D / OpenToonz scene).

| Operation | Params | Description |
|-----------|--------|-------------|
| `list` | `directory` | Find `.tnz` files recursively |
| `info` | `file_path` | Scene file metadata |
| `open` | `file_path` | Launch `Tahoma2D.exe` on a scene |

## `tahoma2d_render`

Headless rendering via `tcomposer.exe` (shipped with Tahoma2D).

| Operation | Params | Description |
|-----------|--------|-------------|
| `render` | `scene_path`, `start_frame`, `end_frame`, `step`, `output_path` | Render frame range to images |
| `check` | — | Verify `tcomposer.exe` exists |

Example CLI equivalent:

```text
tcomposer.exe scene.tnz -o frame_%04d.png -range 1 24 -step 1
```

## `tahoma2d_export`

Frame sequence → video via ffmpeg (not part of Tahoma2D).

| Operation | Params | Description |
|-----------|--------|-------------|
| `to_video` | `input_pattern`, `output_path`, `fps`, `codec` | e.g. `frame_%04d.png` → MP4 |
| `check_ffmpeg` | — | Verify ffmpeg in PATH |
