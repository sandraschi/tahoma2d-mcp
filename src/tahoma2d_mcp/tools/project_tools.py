"""Project management tools for tahoma2d-mcp."""

import logging

from ..app import get_app
from ..bridge.tahoma_executor import get_executor

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_project_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_project(
        operation: str = "create",
        name: str = "Untitled",
        width: int = 1920,
        height: int = 1080,
        fps: float = 24.0,
        file_path: str = "",
    ) -> str:
        """
        Manage Tahoma2D projects: create, open, save, close.

        Operations:
        - create: Create a new project with given dimensions and FPS
        - open: Open an existing project file
        - save: Save current project
        - close: Close current project without saving
        - list: List recent projects

        Returns project operation result.
        """
        if operation == "create":
            script = f"""
var project = new Project("{name}", {width}, {height}, {fps});
project.save();
print(JSON.stringify({{"status":"SUCCESS","project":"{name}","width":{width},"height":{height},"fps":{fps}}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Project '{name}' created ({width}x{height}, {fps}fps)"
            return f"ERROR: {result.get('error', 'Project creation failed')}"

        elif operation == "open":
            if not file_path:
                return "ERROR: file_path required for open operation"
            script = f"""
var project = Project.open("{file_path}");
print(JSON.stringify({{"status":"SUCCESS","project":project.getName()}}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return f"SUCCESS: Opened project '{result.get('project', file_path)}'"
            return f"ERROR: {result.get('error', 'Failed to open project')}"

        elif operation == "save":
            script = """
var scene = Scene.getCurrentScene();
scene.save();
print(JSON.stringify({"status":"SUCCESS","saved":true}));
"""
            result = await _executor.execute_script(script)
            if result.get("status") == "SUCCESS":
                return "SUCCESS: Project saved"
            return f"ERROR: {result.get('error', 'Save failed')}"

        else:
            return f"Unknown operation: {operation}"


_register_project_tools()
