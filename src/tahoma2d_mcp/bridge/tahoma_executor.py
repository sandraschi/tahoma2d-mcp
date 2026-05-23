"""Tahoma2D executor — bridges to Tahoma2D via ECMAScript automation."""

import asyncio
import json
import logging
import os
import subprocess
import tempfile

from ..config import find_tahoma2d

logger = logging.getLogger(__name__)


class Tahoma2DExecutor:
    """Executes ECMAScript automation scripts in Tahoma2D."""

    def __init__(self) -> None:
        self._tahoma_exe = find_tahoma2d()

    @property
    def available(self) -> bool:
        return self._tahoma_exe is not None

    @property
    def tahoma_path(self) -> str | None:
        return self._tahoma_exe

    async def execute_script(self, script: str, timeout: int = 60) -> dict:
        """Execute an ECMAScript automation script in Tahoma2D headless mode.

        Writes the script to a temp .js file, runs Tahoma2D with --script,
        captures stdout for JSON result output.
        """
        if not self.available:
            return {"status": "ERROR", "error": "Tahoma2D not found on system"}

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".js", delete=False, encoding="utf-8"
        ) as f:
            f.write(script)
            script_path = f.name

        try:
            proc = await asyncio.create_subprocess_exec(
                self._tahoma_exe,
                "--script", script_path,
                "--headless",
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            stdout, stderr = await asyncio.wait_for(
                proc.communicate(), timeout=timeout
            )

            result = stdout.decode("utf-8", errors="replace").strip()
            err = stderr.decode("utf-8", errors="replace").strip()

            if proc.returncode != 0:
                return {
                    "status": "ERROR",
                    "error": err or f"Exit code {proc.returncode}",
                }

            try:
                parsed = json.loads(result)
                return parsed
            except json.JSONDecodeError:
                return {"status": "SUCCESS", "output": result}

        except TimeoutError:
            return {"status": "ERROR", "error": "Script execution timed out"}
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


_executor = Tahoma2DExecutor()


def get_executor() -> Tahoma2DExecutor:
    return _executor
