"""Test Tahoma2D bridge operations."""
import asyncio
from tahoma2d_mcp.bridge.tahoma_executor import get_executor


async def test():
    e = get_executor()
    print(f"Available: {e.available}")
    print(f"Path: {e.tahoma_path}")
    print(f"tcomposer: {e.tcomposer_path}")

    # Test: check availability
    result = await e.execute_script("print('ping');", timeout=15)
    status = "OK" if result.get("status") in ("SUCCESS", "GUI_MODE") else "FAIL"
    print(f"Bridge test: {status} -> {result.get('status')}")

    # Test: tcomposer version
    if e.tcomposer_path:
        import subprocess
        r = subprocess.run([e.tcomposer_path, "-version"], capture_output=True, text=True, timeout=10)
        print(f"tcomposer: {r.stdout.strip() or r.stderr.strip()}")


asyncio.run(test())
