"""Configuration for tahoma2d-mcp."""

import os
from pathlib import Path

# Tahoma2D executable paths (auto-detect)
TAHOMA2D_EXE = os.environ.get(
    "TAHOMA2D_EXE",
    os.environ.get(
        "ProgramFiles",
        ""
    ) + "\\Tahoma2D\\Tahoma2D.exe"
)

# Fallback: common install locations
_FALLBACK_PATHS = [
    "C:\\Program Files\\Tahoma2D\\Tahoma2D.exe",
    "C:\\Program Files (x86)\\Tahoma2D\\Tahoma2D.exe",
    os.path.expanduser("~\\AppData\\Local\\Tahoma2D\\Tahoma2D.exe"),
]

MCP_PORT = int(os.environ.get("MCP_PORT", "11013"))
MCP_HOST = os.environ.get("MCP_HOST", "127.0.0.1")
MCP_TRANSPORT = os.environ.get("MCP_TRANSPORT", "http")

TAHOMA2D_SCRIPT_DIR = Path(os.environ.get("TAHOMA2D_SCRIPT_DIR", "D:\\Dev\\repos\\tahoma2d-mcp\\scripts"))
TAHOMA2D_DATA_DIR = Path(os.environ.get("TAHOMA2D_DATA_DIR", "D:\\Dev\\repos\\tahoma2d-mcp\\data"))

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")


def find_tahoma2d() -> str | None:
    """Find the Tahoma2D executable on the system."""
    if os.path.isfile(TAHOMA2D_EXE):
        return TAHOMA2D_EXE
    for p in _FALLBACK_PATHS:
        if os.path.isfile(p):
            return p
    return None


def tahoma2d_available() -> bool:
    """Check if Tahoma2D is installed."""
    return find_tahoma2d() is not None
