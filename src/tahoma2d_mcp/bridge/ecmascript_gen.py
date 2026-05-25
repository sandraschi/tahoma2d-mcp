"""ToonzScript code generation for Tahoma2D automation.

Verified QtScript API from Tahoma2D source (scriptconsolepanel.cpp):
  - print(text)        — output to script console
  - run(path)          — load and evaluate a .toonzscript file
  - view(obj)          — view an image or level in flipbook
  - loadScene(path)    — load a .tnz scene
  - saveScene(path)    — save current scene
  - loadLevel(path)    — load an image/level file into xsheet
  - getLevel(name)     — create or get a level (from main.cpp engine)
  - foo(row, col, lvl) — set cell in xsheet (from main.cpp engine)

Since Tahoma2D 1.6.1 QtScript is ES3 (no JSON.stringify).
Use print() with plain text for output, parse on the Python side.
"""

import json


def gen_status() -> str:
    return 'print("T2D_STATUS:OK");'


def gen_load_scene(path: str) -> str:
    p = path.replace("\\", "/")
    return f'loadScene("{p}"); print("T2D_SCENE_LOADED:{p}");'


def gen_save_scene(path: str) -> str:
    p = path.replace("\\", "/")
    return f'saveScene("{p}"); print("T2D_SCENE_SAVED:{p}");'


def gen_load_level(path: str, row: int = 1, col: int = 1) -> str:
    p = path.replace("\\", "/")
    return f"""
loadLevel("{p}", {row}, {col});
print("T2D_LEVEL_LOADED:" + {json.dumps(p)});
"""


def gen_get_level(name: str) -> str:
    return f"""
var lvl = getLevel("{name}");
print("T2D_LEVEL:" + lvl.name);
"""


def gen_set_cell(row: int, col: int, level_name: str) -> str:
    return f"""
var lvl = getLevel("{level_name}");
var r = foo({row}, {col}, lvl);
print("T2D_CELL_SET:row=" + {row} + ",col=" + {col} + ",level=" + "{level_name}" + ",result=" + r);
"""


def gen_render(output_path: str, start: int, end: int) -> str:
    p = output_path.replace("\\", "/")
    return f"""
saveScene("{p}.tnz");
print("T2D_RENDER:render via tcomposer.exe separately");
print("T2D_SCENE_SAVED:{p}.tnz");
"""
