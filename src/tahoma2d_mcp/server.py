"""ASGI server and transport layer for tahoma2d-mcp."""

import argparse
import logging
import os

from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from starlette.routing import Mount, Route

from . import __version__
from .app import get_app
from .config import MCP_HOST, MCP_PORT, get_config_manager

logger = logging.getLogger(__name__)

mcp = get_app()
mcp_http = mcp.http_app()
cfg = get_config_manager()


async def api_status(request):
    return JSONResponse({
        "status": "running",
        "version": __version__,
        "tahoma2d_available": cfg.tahoma2d_available(),
        "tahoma2d_path": cfg.find_tahoma2d(),
    })


async def api_config(request):
    return JSONResponse(cfg.get_all())


async def api_config_set(request):
    body = await request.json()
    path = body.get("tahoma2d_path", "").strip()
    if path:
        if not os.path.isfile(path):
            return JSONResponse(
                {"success": False, "error": "File not found at that path"},
                status_code=400,
            )
        cfg.set_tahoma2d_path(path)
        logger.info("Tahoma2D path set to: %s", path)
    else:
        cfg.set_tahoma2d_path("")
    return JSONResponse({
        "success": True,
        "tahoma2d_path": cfg.find_tahoma2d(),
        "tahoma2d_available": cfg.tahoma2d_available(),
    })


async def api_tool(request):
    body = await request.json()
    tool_name = body.get("tool")
    params = body.get("params", {})
    tool = mcp.get_tool(tool_name)
    if tool is None:
        return JSONResponse(
            {"success": False, "error": f"Tool '{tool_name}' not found"},
            status_code=404,
        )
    try:
        result = await mcp.call_tool(tool_name, params)
        texts = [c.text for c in result.content if hasattr(c, "text")]
        if len(texts) == 1:
            data = texts[0]
        elif texts:
            data = "\n".join(texts)
        elif result.structured_content:
            data = result.structured_content
        else:
            data = str(result)
        return JSONResponse({"success": True, "data": data})
    except Exception as e:
        logger.error("Tool '%s' failed: %s", tool_name, e)
        return JSONResponse(
            {"success": False, "error": str(e)},
            status_code=500,
        )


app = Starlette(
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ],
    routes=[
        Route("/api/status", api_status, methods=["GET"]),
        Route("/api/config", api_config, methods=["GET"]),
        Route("/api/config", api_config_set, methods=["POST"]),
        Route("/api/tool", api_tool, methods=["POST"]),
        Mount("/mcp", app=mcp_http),
    ],
)

asgi_app = app


def run_server(host: str = MCP_HOST, port: int = MCP_PORT) -> None:
    logger.info("Starting Tahoma2D MCP server on %s:%d", host, port)
    import uvicorn
    uvicorn.run(asgi_app, host=host, port=port, log_level="info")


def main_stdio() -> None:
    logger.info("Starting Tahoma2D MCP in stdio mode")
    mcp.run(transport="stdio")


def main(args: argparse.Namespace) -> None:
    if args.http:
        run_server(host=args.host, port=args.port)
    elif args.stdio:
        main_stdio()
    else:
        main_stdio()
