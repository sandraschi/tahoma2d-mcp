"""CLI entry point for tahoma2d-mcp."""

import argparse
import logging


def main() -> None:
    parser = argparse.ArgumentParser(description="Tahoma2D MCP Server")
    parser.add_argument("--http", action="store_true", help="Run as HTTP server")
    parser.add_argument("--port", type=int, default=11013, help="HTTP port")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="HTTP host")
    parser.add_argument("--log-level", default="INFO", help="Logging level")
    parser.add_argument("--stdio", action="store_true", help="Run in stdio mode (default)")
    args = parser.parse_args()

    logging.basicConfig(
        level=getattr(logging, args.log_level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    from .server import main as server_main
    server_main(args)
