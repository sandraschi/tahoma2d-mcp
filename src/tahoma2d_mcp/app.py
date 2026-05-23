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
            description="Tahoma2D 2D animation production via MCP",
        )
        logger.info("Tahoma2D MCP app created (v%s)", __version__)
    return _app
