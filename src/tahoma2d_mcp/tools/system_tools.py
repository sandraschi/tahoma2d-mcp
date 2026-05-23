"""System status and help tools for tahoma2d-mcp."""

import logging

from ..app import get_app
from ..bridge.tahoma_executor import get_executor
from ..config import tahoma2d_available, find_tahoma2d
from .. import __version__

logger = logging.getLogger(__name__)

_executor = get_executor()


def _register_system_tools():
    app = get_app()

    @app.tool
    async def tahoma2d_status(operation: str = "status", format: str = "text") -> str:
        """
        Check Tahoma2D MCP server and Tahoma2D application availability.

        Operations:
        - status: Server health, Tahoma2D availability, version info
        - help: Display available tools and operations

        Returns status information as text.
        """
        if operation == "help":
            return (
                "tahoma2d-mcp v" + __version__ + "\n"
                "Tools: tahoma2d_project, tahoma2d_canvas, tahoma2d_layer,\n"
                "tahoma2d_draw, tahoma2d_animation, tahoma2d_effects,\n"
                "tahoma2d_render, tahoma2d_status\n"
                "Run tahoma2d_status(operation='help') for details.\n"
                "See docs/ or project pages for full reference."
            )

        tahoma_ok = tahoma2d_available()
        tahoma_path = find_tahoma2d()

        info = {
            "status": "running",
            "version": __version__,
            "tahoma2d_available": tahoma_ok,
            "tahoma2d_path": tahoma_path,
            "bridge_connected": _executor.available,
        }

        if format == "json":
            return f"STATUS: {info}"

        lines = [
            f"Tahoma2D MCP Server v{__version__}",
            f"Tahoma2D installed: {'Yes' if tahoma_ok else 'No'}",
            f"Tahoma2D path: {tahoma_path or 'Not found'}",
            f"Bridge connected: {_executor.available}",
            "",
            "System ready." if tahoma_ok else "Install Tahoma2D from https://tahoma2d.org to use 2D animation tools.",
        ]
        return "\n".join(lines)


_register_system_tools()
