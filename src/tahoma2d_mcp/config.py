"""Configuration for tahoma2d-mcp."""

import json
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

MCP_PORT = int(os.environ.get("MCP_PORT", "11013"))
MCP_HOST = os.environ.get("MCP_HOST", "127.0.0.1")
MCP_TRANSPORT = os.environ.get("MCP_TRANSPORT", "http")
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
TAHOMA2D_SCRIPT_DIR = Path(os.environ.get("TAHOMA2D_SCRIPT_DIR", str(REPO_ROOT / "scripts")))
TAHOMA2D_DATA_DIR = Path(os.environ.get("TAHOMA2D_DATA_DIR", str(REPO_ROOT / "data")))

_FALLBACK_PATHS = [
    os.environ.get("ProgramFiles", "") + "\\Tahoma2D\\Tahoma2D.exe",
    os.environ.get("ProgramFiles(x86)", "") + "\\Tahoma2D\\Tahoma2D.exe",
    "C:\\Program Files\\Tahoma2D\\Tahoma2D.exe",
    "C:\\Program Files (x86)\\Tahoma2D\\Tahoma2D.exe",
    os.path.expanduser("~\\AppData\\Local\\Tahoma2D\\Tahoma2D.exe"),
    os.path.expanduser("~\\Tahoma2D\\Tahoma2D.exe"),
    "C:\\Tahoma2D\\Tahoma2D.exe",
]

_CONFIG_FILE = TAHOMA2D_DATA_DIR / "config.json"


class ConfigManager:
    """Persistent configuration manager.

    Stores config as JSON in data/config.json. Priority for Tahoma2D path:
    1. TAHOMA2D_EXE env var
    2. Persisted config (from settings page)
    3. Auto-detection fallback paths
    """

    def __init__(self) -> None:
        self._data: dict = {}
        self._load()

    def _load(self) -> None:
        try:
            if _CONFIG_FILE.exists():
                self._data = json.loads(_CONFIG_FILE.read_text(encoding="utf-8"))
        except Exception as e:
            logger.warning("Failed to load config: %s", e)
            self._data = {}

    def save(self) -> None:
        try:
            TAHOMA2D_DATA_DIR.mkdir(parents=True, exist_ok=True)
            _CONFIG_FILE.write_text(
                json.dumps(self._data, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
        except Exception as e:
            logger.error("Failed to save config: %s", e)

    def get_tahoma2d_path(self) -> str | None:
        env = os.environ.get("TAHOMA2D_EXE") or None
        if env:
            return env
        cfg = self._data.get("tahoma2d_path")
        if cfg and os.path.isfile(cfg):
            return cfg
        return None

    def set_tahoma2d_path(self, path: str) -> None:
        self._data["tahoma2d_path"] = path
        self.save()

    def find_tahoma2d(self) -> str | None:
        overridden = self.get_tahoma2d_path()
        if overridden:
            return overridden
        for p in _FALLBACK_PATHS:
            if p and os.path.isfile(p):
                return p
        return None

    def tahoma2d_available(self) -> bool:
        return self.find_tahoma2d() is not None

    def get_all(self) -> dict:
        return {
            "tahoma2d_path": self.find_tahoma2d(),
            "tahoma2d_available": self.tahoma2d_available(),
            "tahoma2d_script_dir": str(TAHOMA2D_SCRIPT_DIR),
            "tahoma2d_data_dir": str(TAHOMA2D_DATA_DIR),
            "mcp_port": MCP_PORT,
            "mcp_host": MCP_HOST,
            "mcp_transport": MCP_TRANSPORT,
            "log_level": LOG_LEVEL,
        }


_config_manager = ConfigManager()


def get_config_manager() -> ConfigManager:
    return _config_manager


def find_tahoma2d() -> str | None:
    return _config_manager.find_tahoma2d()


def tahoma2d_available() -> bool:
    return _config_manager.tahoma2d_available()
