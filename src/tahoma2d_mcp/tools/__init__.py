"""Tool discovery for tahoma2d-mcp."""
import logging
import pkgutil
from pathlib import Path

logger = logging.getLogger(__name__)


def discover_tools(package: str = "tahoma2d_mcp.tools") -> None:
    pkg = __import__(package, fromlist=["_"])
    pkg_path = Path(pkg.__file__).parent if hasattr(pkg, "__file__") else None
    if not pkg_path:
        return
    for _, modname, _ in pkgutil.iter_modules([str(pkg_path)]):
        if modname != "__init__" and not modname.startswith("_"):
            try:
                __import__(f"{package}.{modname}")
                logger.info("Loaded tool module: %s", modname)
            except Exception as e:
                logger.error("Failed to load tool module %s: %s", modname, e)


discover_tools()
