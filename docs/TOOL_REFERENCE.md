# tahoma2d-mcp — Tool Reference

## `tahooma2d_status`
Server health and tcomposer availability.

| Operation | Params | Description |
|-----------|--------|-------------|
| `status` | format | Server + tcomposer status |
| `help` | — | Tool listing |

## `tahooma2d_project`
Scene file management for .tnz files.

| Operation | Params | Description |
|-----------|--------|-------------|
| `list` | directory | Find .tnz files |
| `info` | file_path | Scene metadata |
| `open` | file_path | Open in Tahoma2D GUI |

## `tahooma2d_render`
Headless rendering via tcomposer.exe.

| Operation | Params | Description |
|-----------|--------|-------------|
| `render` | scene_path, start_frame, end_frame, step, output_path | Render frame range |
| `check` | — | Verify tcomposer |

## `tahooma2d_export`
Frame-to-video conversion via ffmpeg.

| Operation | Params | Description |
|-----------|--------|-------------|
| `to_video` | input_pattern, output_path, fps, codec | Convert frames to MP4 |
| `check_ffmpeg` | — | Verify ffmpeg in PATH |
