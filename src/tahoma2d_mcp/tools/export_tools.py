"""Export tools for tahoma2d-mcp — ffmpeg-based frame-to-video."""

import logging
import shutil

from ..app import get_app

logger = logging.getLogger(__name__)


def _register_export_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_export(
        operation: str = "to_video",
        input_pattern: str = "",
        output_path: str = "",
        fps: float = 24.0,
        codec: str = "h264",
    ) -> str:
        """
        Convert rendered frame sequences to video via ffmpeg.

        Operations:
        - to_video: Convert image sequence to MP4
        - check_ffmpeg: Verify ffmpeg is installed

        Requires ffmpeg in PATH.
        Input pattern example: C:/renders/frame_%04d.png
        """
        if operation == "check_ffmpeg":
            ffmpeg = shutil.which("ffmpeg")
            if ffmpeg:
                return f"ffmpeg found: {ffmpeg}"
            return "ffmpeg not found. Install from https://ffmpeg.org"

        if operation == "to_video":
            ffmpeg = shutil.which("ffmpeg")
            if not ffmpeg:
                return "ERROR: ffmpeg not found in PATH"

            if not input_pattern:
                return "ERROR: input_pattern required (e.g. render_%04d.png)"
            if not output_path:
                output_path = "output.mp4"

            vcodec = "libx264" if codec == "h264" else "libx265" if codec == "h265" else codec
            import asyncio
            import subprocess
            try:
                proc = await asyncio.create_subprocess_exec(
                    ffmpeg, "-y",
                    "-framerate", str(fps),
                    "-i", input_pattern,
                    "-c:v", vcodec,
                    "-pix_fmt", "yuv420p",
                    output_path,
                    stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                )
                _, stderr = await asyncio.wait_for(proc.communicate(), timeout=300)
                if proc.returncode != 0:
                    err = stderr.decode("utf-8", errors="replace")[-500:]
                    return f"Export failed: {err}"
                return f"Exported to {output_path} ({fps}fps, {codec})"
            except Exception as e:
                return f"Export error: {e}"

        else:
            return f"Unknown operation: {operation}"


_register_export_tools()
