"""Render tools for tahoma2d-mcp — tcomposer.exe bridge."""

import logging
import os
from pathlib import Path

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_render_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_render(
        operation: str = "render",
        scene_path: str = "",
        output_path: str = "",
        start_frame: int = 1,
        end_frame: int = 100,
        step: int = 1,
        format: str = "png",
    ) -> str:
        """
        Render .tnz scenes headlessly via tcomposer.exe.

        Operations:
        - render: Render a .tnz scene frame range to images
        - check: Verify tcomposer is available

        Requires a pre-existing .tnz scene file (create/edit via Tahoma2D GUI,
        then render here).

        Returns render result or availability check.
        """
        if operation == "check":
            if _executor.tcomposer_path:
                ver = await _executor.tcomposer_version()
                return f"tcomposer ready: {_executor.tcomposer_path}\nVersion: {ver}"
            return "ERROR: tcomposer.exe not found. Install Tahoma2D from https://tahoma2d.org"

        if operation == "render":
            if not scene_path:
                return "ERROR: scene_path required (.tnz file)"
            if not os.path.isfile(scene_path):
                return f"ERROR: Scene file not found: {scene_path}"

            if not output_path:
                out_dir = Path(scene_path).parent / "renders"
                out_dir.mkdir(exist_ok=True)
                output_path = str(out_dir / f"{Path(scene_path).stem}_{start_frame}-{end_frame}.{format}")

            result = await _executor.render_scene(
                scene_path=scene_path,
                output_path=output_path,
                start_frame=start_frame,
                end_frame=end_frame,
                step=step,
            )

            if result.get("status") == "SUCCESS":
                return f"Rendered {start_frame}-{end_frame} to {output_path}"
            return f"Render failed: {result.get('error', 'unknown error')}"

        else:
            return f"Unknown operation: {operation}"


_register_render_tools()
