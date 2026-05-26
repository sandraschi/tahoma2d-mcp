"""System tools for tahoma2d-mcp."""

import logging

from .. import __version__
from ..app import get_app
from ..bridge.tahoma_executor import get_executor
from ..config import find_tahoma2d, tahoma2d_available

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_system_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_status(
        operation: str = "status",
        format: str = "text",
    ) -> str:
        """
        Check Tahoma2D MCP server and renderer availability.

        Operations:
        - status: Server health, tcomposer availability, version info
        - help: List available tools

        Returns status or help text.
        """
        if operation == "help":
            return (
                "tahoma2d-mcp v" + __version__ + "\n"
                "Tools:\n"
                "  tahoma2d_status   - Server health, tcomposer check\n"
                "  tahoma2d_project  - .tnz scene file management\n"
                "  tahoma2d_render   - Headless rendering via tcomposer.exe\n"
                "  tahoma2d_export   - Convert frames to video via ffmpeg\n"
                "See docs/TOOL_REFERENCE.md for details."
            )

        tcomposer_path = _executor.tcomposer_path
        tcomposer_ver = await _executor.tcomposer_version() if tcomposer_path else "N/A"

        info = {
            "status": "running",
            "version": __version__,
            "tahoma2d_installed": tahoma2d_available(),
            "tahoma2d_path": find_tahoma2d(),
            "tcomposer_path": tcomposer_path,
            "tcomposer_version": tcomposer_ver,
        }

        if format == "json":
            return f"STATUS: {info}"

        lines = [
            f"Tahoma2D MCP v{__version__}",
            f"Tahoma2D: {'Yes' if tahoma2d_available() else 'No'} at {find_tahoma2d() or 'N/A'}",
            f"tcomposer: {'Yes' if tcomposer_path else 'No'}",
            f"tcomposer version: {tcomposer_ver}",
        ]
        return "\n".join(lines)


_register_system_tools()
