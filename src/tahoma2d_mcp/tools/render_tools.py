"""Render and export tools for tahoma2d-mcp."""

import logging

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_render_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_render(
        operation: str = "render",
        output_path: str = "",
        start_frame: int = 1,
        end_frame: int = 100,
        format: str = "png",
        fps: float = 24.0,
        resolution_x: int = 1920,
        resolution_y: int = 1080,
    ) -> str:
        """
        Render and export Tahoma2D projects.

        Operations:
        - render: Render frame range to image sequence
        - export: Export to video format (MP4, GIF, MOV)
        - export_svg: Export to SVG
        - status: Check render status

        Returns render/export operation result.
        """
        if operation == "render":
            if not output_path:
                output_path = f"render_{start_frame}_{end_frame}"
            script = f"""
var scene = Scene.getCurrentScene();
scene.render("{output_path}", {start_frame}, {end_frame});
print(JSON.stringify({{"status":"SUCCESS","output":"{output_path}","start":{start_frame},"end":{end_frame}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Rendered frames {start_frame}-{end_frame} to '{output_path}'"
            return f"ERROR: {result.get('error', 'Render failed')}"

        elif operation == "export":
            if not output_path:
                return "ERROR: output_path required for export"
            script = f"""
var scene = Scene.getCurrentScene();
scene.Export("{output_path}", "{format}", {resolution_x}, {resolution_y}, {fps});
print(JSON.stringify({{"status":"SUCCESS","output":"{output_path}","format":"{format}"}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Exported to '{output_path}' ({format})"
            return f"ERROR: {result.get('error', 'Export failed')}"

        else:
            return f"Unknown operation: {operation}"


_register_render_tools()
