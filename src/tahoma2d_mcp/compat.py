"""FastMCP 3.2 compatibility shim."""

try:
    from fastmcp import Context
except ImportError:
    from fastmcp.server.context import Context  # type: ignore[no-redef]

try:
    from pydantic.v1 import BaseModel as PydanticBaseModel
except ImportError:
    from pydantic import BaseModel as PydanticBaseModel

from pydantic import BaseModel, Field

__all__ = ["BaseModel", "Context", "Field", "PydanticBaseModel"]
