"""Tahoma2D executor — bridges to Tahoma2D for headless rendering.

Architecture:
  Tahoma2D.exe        - GUI application. Opens .tnz scene files. ToonzScript
                        support varies by build (may not be compiled in).
  tcomposer.exe       - HEADLESS renderer. Renders .tnz scenes to frames.
                        Usage: tcomposer.exe scene.tnz -o output.png -range 1 24

The bridge focuses on what's confirmed working:
  - tcomposer.exe for headless batch rendering of existing .tnz scenes
  - Tahoma2D.exe for opening .tnz files (GUI mode, not scripted)
"""

import asyncio
import logging
import os
import subprocess
import tempfile

from ..config import find_tahoma2d

logger = logging.getLogger(__name__)


class Tahoma2DExecutor:
    """Executes Tahoma2D operations via file-based protocols."""

    def __init__(self) -> None:
        self._tahoma_exe = find_tahoma2d()
        self._install_dir = os.path.dirname(self._tahoma_exe) if self._tahoma_exe else ""
        self._tcomposer = os.path.join(self._install_dir, "tcomposer.exe") if self._install_dir else None

    @property
    def available(self) -> bool:
        return self._tahoma_exe is not None

    @property
    def tahoma_path(self) -> str | None:
        return self._tahoma_exe

    @property
    def tcomposer_path(self) -> str | None:
        return self._tcomposer if self._tcomposer and os.path.isfile(self._tcomposer) else None

    async def execute_script(self, script: str, timeout: int = 60) -> dict:
        """Execute a ToonzScript in Tahoma2D.

        This uses Tahoma2D.exe with a .toonzscript file as positional arg.
        Note: ToonzScript support varies by Tahoma2D build. If it doesn't
        work, use tcomposer for headless rendering instead.
        """
        if not self.available:
            return {"status": "ERROR", "error": "Tahoma2D not found"}

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".toonzscript", delete=False, encoding="utf-8"
        ) as f:
            f.write(script)
            script_path = f.name

        logger.info("Executing ToonzScript: %s", script_path)

        try:
            proc = await asyncio.create_subprocess_exec(
                self._tahoma_exe,
                script_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            try:
                stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
            except TimeoutError:
                try:
                    proc.kill()
                except Exception:
                    pass
                return {"status": "TIMEOUT", "error": "ToonzScript timed out (may not be supported in this build)"}

            out = stdout.decode("utf-8", errors="replace").strip()
            err = stderr.decode("utf-8", errors="replace").strip()

            if proc.returncode == 1:
                return {"status": "SUCCESS", "output": out or "Script executed (exit 1)"}
            if proc.returncode == 0 and not out and not err:
                return {"status": "GUI_MODE", "error": "Tahoma2D entered GUI mode (script ext not recognized)"}
            if proc.returncode not in (0, 1):
                return {"status": "ERROR", "error": err or f"Exit code {proc.returncode}"}

            return {"status": "SUCCESS", "output": out or "Script executed"}

        except FileNotFoundError:
            return {"status": "ERROR", "error": "Tahoma2D executable not found"}
        except Exception as e:
            logger.error(f"Script execution failed: {e}")
            return {"status": "ERROR", "error": str(e)}
        finally:
            try:
                os.unlink(script_path)
            except OSError:
                pass

    async def render_scene(self, scene_path: str, output_path: str,
                           start_frame: int = 1, end_frame: int = 1,
                           step: int = 1, timeout: int = 300) -> dict:
        """Render a .tnz scene headlessly using tcomposer.exe.

        Usage: tcomposer.exe scene.tnz -o output.png -range 1 24 -step 1
        """
        if not self.tcomposer_path:
            return {"status": "ERROR", "error": "tcomposer.exe not found"}

        if not os.path.isfile(scene_path):
            return {"status": "ERROR", "error": f"Scene file not found: {scene_path}"}

        logger.info("Rendering: %s -> %s [%d-%d]", scene_path, output_path, start_frame, end_frame)

        try:
            proc = await asyncio.create_subprocess_exec(
                self.tcomposer_path,
                scene_path,
                "-o", output_path,
                "-range", str(start_frame), str(end_frame),
                "-step", str(step),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
            out = stdout.decode("utf-8", errors="replace").strip()
            err = stderr.decode("utf-8", errors="replace").strip()

            if proc.returncode != 0:
                return {"status": "ERROR", "error": err or f"Render failed (exit {proc.returncode})"}

            return {"status": "SUCCESS", "output": out or f"Rendered {start_frame}-{end_frame}"}

        except TimeoutError:
            return {"status": "ERROR", "error": "Render timed out"}
        except Exception as e:
            return {"status": "ERROR", "error": str(e)}


_executor = Tahoma2DExecutor()


def get_executor() -> Tahoma2DExecutor:
    return _executor
