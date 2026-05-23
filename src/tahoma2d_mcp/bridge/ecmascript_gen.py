"""ECMAScript code generation for Tahoma2D automation."""

import json


def gen_create_project(name: str, width: int, height: int, fps: float) -> str:
    return f"""
var project = new Project("{name}", {width}, {height}, {fps});
project.save();
print(JSON.stringify({{"status":"SUCCESS","project":"{name}","width":{width},"height":{height},"fps":{fps}}}));
"""


def gen_create_canvas(name: str, width: int, height: int) -> str:
    return f"""
var scene = Scene.getCurrentScene();
var canvas = scene.createCanvas("{name}", {width}, {height});
print(JSON.stringify({{"status":"SUCCESS","canvas":"{name}","width":{width},"height":{height}}}));
"""


def gen_create_layer(canvas_name: str, layer_name: str) -> str:
    return f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.createLayer("{layer_name}");
print(JSON.stringify({{"status":"SUCCESS","canvas":"{canvas_name}","layer":"{layer_name}"}}));
"""


def gen_draw_stroke(
    canvas_name: str, layer_name: str,
    points: list[tuple[float, float, float]],
    thickness: float = 2.0,
    color: list[float] | None = None,
    frame: int = 1,
) -> str:
    if color is None:
        color = [0, 0, 0, 255]
    pts_json = json.dumps(points)
    return f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.getLayer("{layer_name}");
var frame = layer.getFrame({frame});
var stroke = frame.createStroke();
stroke.setThickness({thickness});
stroke.setColor({int(color[0])}, {int(color[1])}, {int(color[2])}, {int(color[3] if len(color) > 3 else 255)});
var pts = {pts_json};
for (var i = 0; i < pts.length; i++) {{
    stroke.addPoint(pts[i][0], pts[i][1], pts[i][2]);
}}
print(JSON.stringify({{"status":"SUCCESS","points":pts.length,"thickness":{thickness}}}));
"""


def gen_set_keyframe(canvas_name: str, layer_name: str, frame: int) -> str:
    return f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layer = canvas.getLayer("{layer_name}");
layer.setKeyframe({frame});
print(JSON.stringify({{"status":"SUCCESS","canvas":"{canvas_name}","layer":"{layer_name}","frame":{frame}}}));
"""


def gen_render_scene(output_path: str, start_frame: int, end_frame: int) -> str:
    return f"""
var scene = Scene.getCurrentScene();
scene.render("{output_path}", {start_frame}, {end_frame});
print(JSON.stringify({{"status":"SUCCESS","output":"{output_path}","start":{start_frame},"end":{end_frame}}}));
"""


def gen_status() -> str:
    return """
var scene = Scene.getCurrentScene();
var info = {
    "scene_name": scene.getName(),
    "canvas_count": scene.getCanvasCount(),
    "total_frames": scene.getTotalFrames(),
    "fps": scene.getFps()
};
print(JSON.stringify({"status":"SUCCESS","info":info}));
"""


def gen_list_canvases() -> str:
    return """
var scene = Scene.getCurrentScene();
var canvases = [];
for (var i = 0; i < scene.getCanvasCount(); i++) {
    var c = scene.getCanvasByIndex(i);
    canvases.push({"name": c.getName(), "width": c.getWidth(), "height": c.getHeight()});
}
print(JSON.stringify({"status":"SUCCESS","canvases":canvases}));
"""


def gen_list_layers(canvas_name: str) -> str:
    return f"""
var scene = Scene.getCurrentScene();
var canvas = scene.getCanvas("{canvas_name}");
var layers = [];
for (var i = 0; i < canvas.getLayerCount(); i++) {{
    var l = canvas.getLayerByIndex(i);
    layers.push({{"name": l.getName(), "visible": l.isVisible(), "frame_count": l.getFrameCount()}});
}}
print(JSON.stringify({{"status":"SUCCESS","layers":layers}}));
"""
