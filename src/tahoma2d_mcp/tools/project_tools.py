"""Project management tools for tahoma2d-mcp."""

import logging

from ..app import get_app
from ..bridge import ecmascript_gen as gen
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_project_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_project(
        operation: str = "status",
        name: str = "Untitled",
        file_path: str = "",
        width: int = 1920,
        height: int = 1080,
        fps: float = 24.0,
    ) -> str:
        """
        Manage Tahoma2D projects via ToonzScript.

        Operations:
        - status: Check if Tahoma2D bridge is alive
        - open: Load a .tnz scene file via loadScene()
        - save: Save current scene via saveScene()
        - create: Create a new project (saves empty scene)

        Returns project operation result.
        """
        if not _executor.available:
            return "ERROR: Tahoma2D not installed. Download from https://tahoma2d.org"

        if operation == "status":
            script = gen.gen_status()
            result = await _executor.execute_script(script)
            if "T2D_STATUS:OK" in str(result):
                return "SUCCESS: Tahoma2D bridge is alive"
            return f"Bridge status: {result}"

        elif operation == "open":
            if not file_path:
                return "ERROR: file_path required"
            script = gen.gen_load_scene(file_path)
            result = await _executor.execute_script(script)
            out = str(result)
            if "T2D_SCENE_LOADED" in out:
                return f"SUCCESS: Scene loaded from '{file_path}'"
            return f"ERROR: {result.get('error', out)}"

        elif operation == "save":
            path = file_path or f"D:\\Dev\\repos\\tahoma2d-mcp\\data\\{name}.tnz"
            script = gen.gen_save_scene(path)
            result = await _executor.execute_script(script)
            out = str(result)
            if "T2D_SCENE_SAVED" in out:
                return f"SUCCESS: Scene saved to '{path}'"
            return f"ERROR: {result.get('error', out)}"

        elif operation == "create":
            path = f"D:\\Dev\\repos\\tahoma2d-mcp\\data\\{name}.tnz"
            script = gen.gen_save_scene(path)
            result = await _executor.execute_script(script)
            out = str(result)
            if "T2D_SCENE_SAVED" in out:
                return f"SUCCESS: Project '{name}' created and saved"
            return f"ERROR: {result.get('error', out)}"

        else:
            return f"Unknown operation: {operation}"


_register_project_tools()
