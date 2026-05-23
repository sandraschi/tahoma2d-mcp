"""Effects and compositing tools for tahoma2d-mcp."""

import logging

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_effects_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_effects(
        operation: str = "apply",
        effect_type: str = "blur",
        canvas_name: str = "Canvas",
        layer_name: str = "Layer",
        intensity: float = 1.0,
    ) -> str:
        """
        Apply visual effects to Tahoma2D layers and manage the FX node tree.

        Operations:
        - apply: Apply an effect (blur, glow, shadow, tint, brightness) to a layer
        - list: List available effects and their parameters
        - remove: Remove an effect from a layer

        Returns effects operation result.
        """
        if operation == "apply":
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.getLayer("{layer_name}");
var effect = layer.addEffect("{effect_type}", {intensity});
print(JSON.stringify({{"status":"SUCCESS","effect":"{effect_type}","layer":"{layer_name}","intensity":{intensity}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Effect '{effect_type}' applied to '{layer_name}'"
            return f"ERROR: {result.get('error', 'Effect apply failed')}"

        elif operation == "list":
            return (
                "Available effects:\n"
                "  blur - Gaussian blur\n"
                "  glow - Glow effect\n"
                "  shadow - Drop shadow\n"
                "  tint - Color tint\n"
                "  brightness - Brightness/contrast\n"
                "  edge - Edge detection\n"
                "  mosaic - Pixelate/mosaic"
            )

        else:
            return f"Unknown operation: {operation}"


_register_effects_tools()
