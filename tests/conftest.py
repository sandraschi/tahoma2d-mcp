"""Pytest configuration for tahoma2d-mcp."""
import pytest


@pytest.fixture
def anyio_backend():
    return "asyncio"
