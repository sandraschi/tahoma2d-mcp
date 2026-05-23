"""Path and validation utilities."""

from pathlib import Path


def ensure_dir(path: str | Path) -> Path:
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    return p


def safe_filename(name: str) -> str:
    return "".join(c for c in name if c.isalnum() or c in "._- ").strip()
