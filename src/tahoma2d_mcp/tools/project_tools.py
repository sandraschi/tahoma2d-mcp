"""Scene file management tools for tahoma2d-mcp."""

import logging
import os

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_project_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_project(
        operation: str = "list",
        directory: str = "",
        name: str = "",
        file_path: str = "",
    ) -> str:
        """
        Manage .tnz scene files.

        Operations:
        - list: Find .tnz files in a directory
        - info: Get metadata about a specific .tnz file
        - open: Launch Tahoma2D GUI with a scene file

        Returns scene file information.
        """
        if operation == "list":
            scan_dir = directory or os.path.join(
                os.path.dirname(_executor.tahoma_path or ""), "..", "tahomastuff", "sandbox"
            )
            scenes = _executor.find_scenes(scan_dir)
            if not scenes:
                return f"No .tnz scenes found in {scan_dir}"
            lines = [f"Scenes in {scan_dir} ({len(scenes)}):"]
            for s in scenes:
                size_kb = s["size"] // 1024
                lines.append(f"  {s['name']}.tnz ({size_kb} KB)")
            return "\n".join(lines)

        elif operation == "info":
            if not file_path:
                return "ERROR: file_path required"
            info = _executor.get_scene_info(file_path)
            if "error" in info:
                return f"ERROR: {info['error']}"
            return f"Scene: {info['name']}.tnz\nPath: {info['path']}\nSize: {info['size'] // 1024} KB"

        elif operation == "open":
            if not file_path:
                return "ERROR: file_path required"
            if not os.path.isfile(file_path):
                return f"ERROR: File not found: {file_path}"
            return f"Open {file_path} in Tahoma2D GUI (use start.ps1 or open manually)"

        else:
            return f"Unknown operation: {operation}"


_register_project_tools()
