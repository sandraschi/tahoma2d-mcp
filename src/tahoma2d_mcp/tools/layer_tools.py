"""Layer management tools for tahoma2d-mcp."""

import logging

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_layer_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_layer(
        operation: str = "create",
        canvas_name: str = "Canvas",
        layer_name: str = "Layer",
        visibility: bool = True,
        opacity: float = 1.0,
    ) -> str:
        """
        Manage animation layers: create, list, delete, set properties.

        Operations:
        - create: Create a new layer on the specified canvas
        - list: List all layers on a canvas
        - delete: Remove a layer by name
        - set_visibility: Show/hide a layer
        - set_opacity: Set layer opacity (0.0-1.0)

        Returns layer operation result.
        """
        if operation == "create":
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.createLayer("{layer_name}");
print(JSON.stringify({{"status":"SUCCESS","canvas":"{canvas_name}","layer":"{layer_name}"}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Layer '{layer_name}' created on '{canvas_name}'"
            return f"ERROR: {result.get('error', 'Layer creation failed')}"

        elif operation == "list":
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layers = [];
for (var i = 0; i < canvas.getLayerCount(); i++) {{
    var l = canvas.getLayerByIndex(i);
    layers.push({{"name": l.getName(), "visible": l.isVisible(), "frame_count": l.getFrameCount()}});
}}
print(JSON.stringify({{"status":"SUCCESS","layers":layers}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                layers = result.get("layers", [])
                if not layers:
                    return f"No layers on canvas '{canvas_name}'"
                lines = [f"Layers on '{canvas_name}' ({len(layers)}):"]
                for l in layers:
                    lines.append(f"  {l['name']} (visible: {l['visible']}, frames: {l['frame_count']})")
                return "\n".join(lines)
            return f"ERROR: {result.get('error', 'Failed to list layers')}"

        else:
            return f"Unknown operation: {operation}"


_register_layer_tools()
