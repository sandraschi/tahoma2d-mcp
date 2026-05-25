"""FastMCP application instance for tahoma2d-mcp."""

import logging

from fastmcp import FastMCP

from . import __version__

logger = logging.getLogger(__name__)

_app: FastMCP | None = None


def get_app() -> FastMCP:
    global _app
    if _app is None:
        _app = FastMCP(
            name="tahoma2d-mcp",
            version=__version__,
        )
        # Import tools package to register all @tool-decorated functions
        import tahoma2d_mcp.tools  # noqa: F401
        logger.info("Tahoma2D MCP app created (v%s)", __version__)
    return _app
