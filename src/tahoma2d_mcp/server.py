"""ASGI server and transport layer for tahoma2d-mcp."""

import argparse
import logging
import sys
import uvicorn

from .app import get_app
from .config import MCP_HOST, MCP_PORT, MCP_TRANSPORT

logger = logging.getLogger(__name__)

app = get_app()

# FastMCP HTTP app for ASGI serving
asgi_app = app.http_app()


def run_server(host: str = MCP_HOST, port: int = MCP_PORT) -> None:
    logger.info("Starting Tahoma2D MCP server on %s:%d", host, port)
    uvicorn.run(asgi_app, host=host, port=port, log_level="info")


def main_stdio() -> None:
    logger.info("Starting Tahoma2D MCP in stdio mode")
    app.run(transport="stdio")


def main(args: argparse.Namespace) -> None:
    if args.http:
        run_server(host=args.host, port=args.port)
    elif args.stdio:
        main_stdio()
    else:
        main_stdio()
