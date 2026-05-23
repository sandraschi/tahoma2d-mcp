"""Entry point for PyInstaller-bundled server."""
import sys
sys.path.insert(0, ".")

from tahoma2d_mcp.cli import main  # noqa: E402
main()
