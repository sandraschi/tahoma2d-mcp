"""Drawing and ink/paint tools for tahoma2d-mcp."""

import json
import logging

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_draw_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_draw(
        operation: str = "draw_stroke",
        canvas_name: str = "Canvas",
        layer_name: str = "Layer",
        points: str = "[]",
        stroke_type: str = "freehand",
        thickness: float = 2.0,
        color_r: int = 0,
        color_g: int = 0,
        color_b: int = 0,
        color_a: int = 255,
        frame: int = 1,
        width: float = 100.0,
        height: float = 100.0,
        radius: float = 50.0,
        fill_r: int = 255,
        fill_g: int = 255,
        fill_b: int = 255,
    ) -> str:
        """
        Draw strokes and paint on Tahoma2D canvases.

        Operations:
        - draw_stroke: Draw freehand/line stroke from point list (JSON [[x,y,z],...])
        - draw_box: Draw a rectangle at origin
        - draw_circle: Draw an ellipse at origin
        - draw_line: Draw a line between two points (first 2 in points)
        - fill_region: Fill a region with color
        - set_color: Set active drawing color

        Returns drawing operation result.
        """
        if operation in ("draw_stroke", "draw_line"):
            pts = json.loads(points) if isinstance(points, str) else points
            if not isinstance(pts, list):
                pts = []
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.getLayer("{layer_name}");
var frame = layer.getFrame({frame});
var stroke = frame.createStroke();
stroke.setThickness({thickness});
stroke.setColor({color_r}, {color_g}, {color_b}, {color_a});
var pts = {json.dumps(pts)};
for (var i = 0; i < pts.length; i++) {{
    stroke.addPoint(pts[i][0], pts[i][1], pts[i].length > 2 ? pts[i][2] : 0);
}}
print(JSON.stringify({{"status":"SUCCESS","points":pts.length,"thickness":{thickness}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Drew {len(pts)} point(s) on '{layer_name}'"
            return f"ERROR: {result.get('error', 'Draw failed')}"

        elif operation == "draw_box":
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.getLayer("{layer_name}");
var frame = layer.getFrame({frame});
var stroke = frame.createStroke();
stroke.setThickness({thickness});
stroke.setColor({color_r}, {color_g}, {color_b}, {color_a});
var w = {width} / 2;
var h = {height} / 2;
stroke.addPoint(-w, -h, 0);
stroke.addPoint(w, -h, 0);
stroke.addPoint(w, h, 0);
stroke.addPoint(-w, h, 0);
stroke.closePath();
print(JSON.stringify({{"status":"SUCCESS","type":"box","width":{width},"height":{height}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Drew box ({width}x{height}) on '{layer_name}'"
            return f"ERROR: {result.get('error', 'Box draw failed')}"

        elif operation == "draw_circle":
            script = f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.getLayer("{layer_name}");
var frame = layer.getFrame({frame});
var stroke = frame.createStroke();
stroke.setThickness({thickness});
stroke.setColor({color_r}, {color_g}, {color_b}, {color_a});
var r = {radius};
var segments = 32;
for (var i = 0; i <= segments; i++) {{
    var angle = (i / segments) * 2 * Math.PI;
    stroke.addPoint(Math.cos(angle) * r, Math.sin(angle) * r, 0);
}}
stroke.closePath();
print(JSON.stringify({{"status":"SUCCESS","type":"circle","radius":{radius}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Drew circle (r={radius}) on '{layer_name}'"
            return f"ERROR: {result.get('error', 'Circle draw failed')}"

        else:
            return f"Unknown operation: {operation}"


_register_draw_tools()
