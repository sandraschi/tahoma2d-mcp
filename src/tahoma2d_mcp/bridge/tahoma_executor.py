"""Tahoma2D executor — tcomposer.exe render bridge + scene file management.

Confirmed working on Tahoma2D 1.6.1:
  - tcomposer.exe renders .tnz scenes headlessly
  - Tahoma2D.exe launches GUI for scene editing

ToonzScript (.toonzscript) is NOT available in this build.
All operations either use tcomposer.exe or direct file I/O.
"""

import asyncio
import logging
import os
import subprocess
from pathlib import Path

from ..config import find_tahoma2d

logger = logging.getLogger(__name__)


class Tahoma2DExecutor:
    """Manages Tahoma2D operations via tcomposer.exe and file system."""

    def __init__(self) -> None:
        tahoma_exe = find_tahoma2d()
        self._tahoma_exe = tahoma_exe
        install_dir = os.path.dirname(tahoma_exe) if tahoma_exe else ""
        self._tcomposer = os.path.join(install_dir, "tcomposer.exe") if install_dir else None

    @property
    def available(self) -> bool:
        return self._tahoma_exe is not None

    @property
    def tahoma_path(self) -> str | None:
        return self._tahoma_exe

    @property
    def tcomposer_path(self) -> str | None:
        if self._tcomposer and os.path.isfile(self._tcomposer):
            return self._tcomposer
        return None

    async def render_scene(
        self,
        scene_path: str,
        output_path: str,
        start_frame: int = 1,
        end_frame: int = 1,
        step: int = 1,
        timeout: int = 600,
    ) -> dict:
        """Render a .tnz scene headlessly via tcomposer.exe."""
        if not self.tcomposer_path:
            return {"status": "ERROR", "error": "tcomposer.exe not found"}
        if not os.path.isfile(scene_path):
            return {"status": "ERROR", "error": f"Scene not found: {scene_path}"}

        logger.info("Render: %s [%d-%d] -> %s", scene_path, start_frame, end_frame, output_path)
        try:
            proc = await asyncio.create_subprocess_exec(
                self.tcomposer_path, scene_path,
                "-o", output_path,
                "-range", str(start_frame), str(end_frame),
                "-step", str(step),
                stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            )
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
            out = stdout.decode("utf-8", errors="replace").strip()
            err = stderr.decode("utf-8", errors="replace").strip()
            if proc.returncode != 0:
                return {"status": "ERROR", "error": err or f"exit {proc.returncode}"}
            return {"status": "SUCCESS", "output": out or f"Rendered {start_frame}-{end_frame}"}
        except TimeoutError:
            return {"status": "ERROR", "error": "Render timed out"}
        except Exception as e:
            return {"status": "ERROR", "error": str(e)}

    async def tcomposer_version(self) -> str:
        """Get tcomposer version string."""
        if not self.tcomposer_path:
            return "not found"
        try:
            r = subprocess.run([self.tcomposer_path, "-version"], capture_output=True, text=True, timeout=10)  # noqa: S603
            return (r.stdout or r.stderr).strip()
        except Exception:
            return "unknown"

    def find_scenes(self, directory: str) -> list[dict]:
        """Find .tnz scene files in a directory."""
        p = Path(directory)
        if not p.is_dir():
            return []
        scenes = []
        for f in sorted(p.glob("*.tnz")):
            scenes.append({
                "name": f.stem,
                "path": str(f),
                "size": f.stat().st_size,
                "modified": f.stat().st_mtime,
            })
        return scenes

    def get_scene_info(self, scene_path: str) -> dict:
        """Get file info for a .tnz scene."""
        p = Path(scene_path)
        if not p.is_file():
            return {"error": "not found"}
        return {
            "name": p.stem,
            "path": str(p.absolute()),
            "size": p.stat().st_size,
            "modified": p.stat().st_mtime,
        }


_executor = Tahoma2DExecutor()


def get_executor() -> Tahoma2DExecutor:
    return _executor
