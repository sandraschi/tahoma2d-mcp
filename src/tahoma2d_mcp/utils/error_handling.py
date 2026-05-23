"""Error handling utilities."""


class Tahoma2DError(Exception):
    """Base error for tahoma2d-mcp."""
    pass


class Tahoma2DNotFoundError(Tahoma2DError):
    """Tahoma2D executable not found."""
    pass


class ScriptExecutionError(Tahoma2DError):
    """Tahoma2D script execution failed."""
    pass
