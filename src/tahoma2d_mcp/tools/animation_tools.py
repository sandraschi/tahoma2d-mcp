"""Animation tools for tahoma2d-mcp."""

import logging

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_animation_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_animation(
        operation: str = "set_keyframe",
        canvas_name: str = "Canvas",
        layer_name: str = "Layer",
        frame: int = 1,
        start_frame: int = 1,
        end_frame: int = 24,
        fps: float = 24.0,
    ) -> str:
        """
        Control Tahoma2D animation: keyframes, timeline, playback settings.

        Operations:
        - set_keyframe: Insert keyframe on a layer at the specified frame
        - clear_keyframe: Remove keyframe at frame
        - set_fps: Set project frame rate
        - set_frame_range: Set start and end frame for the animation

        Returns animation operation result.
        """
        if operation == "set_keyframe":
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.getLayer("{layer_name}");
layer.setKeyframe({frame});
print(JSON.stringify({{"status":"SUCCESS","canvas":"{canvas_name}","layer":"{layer_name}","frame":{frame}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Keyframe set on '{layer_name}' at frame {frame}"
            return f"ERROR: {result.get('error', 'Set keyframe failed')}"

        elif operation == "clear_keyframe":
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.getLayer("{layer_name}");
layer.clearKeyframe({frame});
print(JSON.stringify({{"status":"SUCCESS","frame":{frame}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Keyframe cleared at frame {frame}"
            return f"ERROR: {result.get('error', 'Clear keyframe failed')}"

        elif operation == "set_fps":
            script = f"""
var scene = Scene.getCurrentScene();
scene.setFps({fps});
print(JSON.stringify({{"status":"SUCCESS","fps":{fps}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: FPS set to {fps}"
            return f"ERROR: {result.get('error', 'Set FPS failed')}"

        else:
            return f"Unknown operation: {operation}"


_register_animation_tools()
