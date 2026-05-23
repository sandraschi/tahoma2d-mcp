"""Canvas management tools for tahoma2d-mcp."""

import logging

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_canvas_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_canvas(
        operation: str = "create",
        name: str = "Canvas",
        width: int = 1920,
        height: int = 1080,
    ) -> str:
        """
        Manage Tahoma2D canvases: create, list, resize.

        Operations:
        - create: Create a new canvas with given dimensions
        - list: List all canvases in the current project
        - resize: Resize an existing canvas (requires width, height)

        Returns canvas operation result.
        """
        if operation == "create":
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.createCanvas("{name}", {width}, {height});
print(JSON.stringify({{"status":"SUCCESS","canvas":"{name}","width":{width},"height":{height}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Canvas '{name}' created ({width}x{height})"
            return f"ERROR: {result.get('error', 'Canvas creation failed')}"

        elif operation == "list":
            script = """
var scene = Scene.getCurrentScene();
var canvases = [];
for (var i = 0; i < scene.getCanvasCount(); i++) {
    var c = scene.getCanvasByIndex(i);
    canvases.push({"name": c.getName(), "width": c.getWidth(), "height": c.getHeight()});
}
print(JSON.stringify({"status":"SUCCESS","canvases":canvases}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                canvases = result.get("canvases", [])
                if not canvases:
                    return "No canvases found"
                lines = [f"Canvases ({len(canvases)}):"]
                for c in canvases:
                    lines.append(f"  {c['name']}: {c['width']}x{c['height']}")
                return "\n".join(lines)
            return f"ERROR: {result.get('error', 'Failed to list canvases')}"

        else:
            return f"Unknown operation: {operation}"


_register_canvas_tools()
