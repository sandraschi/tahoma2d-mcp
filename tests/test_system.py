"""Tests for tahoma2d-mcp system tools."""

import pytest


def test_imports():
    """Verify core modules import without error."""
    from tahoma2d_mcp import __version__
    assert __version__ == "0.1.0"

    from tahoma2d_mcp.config import tahoma2d_available, find_tahoma2d, MCP_PORT, MCP_HOST
    assert MCP_PORT == 11013
    assert MCP_HOST == "127.0.0.1"

    from tahoma2d_mcp.compat import Context
    assert Context is not None

    from tahoma2d_mcp.bridge.tahoma_executor import get_executor
    executor = get_executor()
    assert executor is not None


def test_config():
    """Verify config is loaded correctly."""
    from tahoma2d_mcp.config import MCP_PORT, MCP_HOST, LOG_LEVEL
    assert isinstance(MCP_PORT, int)
    assert isinstance(MCP_HOST, str)
    assert isinstance(LOG_LEVEL, str)


def test_api_base():
    """Smoke test: the server module creates the app."""
    from tahoma2d_mcp.app import get_app
    app = get_app()
    assert app.name == "tahoma2d-mcp"