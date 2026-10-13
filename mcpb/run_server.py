"""Entry point for PyInstaller-bundled server."""
import _strptime  # noqa: F401
import sys
sys.path.insert(0, ".")

from tahoma2d_mcp.cli import main  # noqa: E402
main()

