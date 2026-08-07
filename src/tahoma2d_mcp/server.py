"""ASGI server and transport layer for tahoma2d-mcp."""

import argparse
import logging
import os
import time
from collections import deque
from uuid import uuid4

import httpx
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from starlette.routing import Mount, Route

from . import __version__
from .app import get_app
from .config import MCP_HOST, MCP_PORT, get_config_manager

logger = logging.getLogger(__name__)


class ActivityLog:
    def __init__(self, max_entries=2000):
        self.max_entries = max_entries
        self._entries = deque(maxlen=max_entries)

    def add(self, level, kind, detail, meta=None):
        eid = f"{time.time():.6f}.{uuid4().hex[:6]}"
        self._entries.append(
            {
                "id": eid,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime()),
                "level": level.upper(),
                "kind": kind,
                "detail": detail,
                "meta": meta or {},
            }
        )
        return eid

    def info(self, kind, detail, **meta):
        return self.add("INFO", kind, detail, meta)

    def warn(self, kind, detail, **meta):
        return self.add("WARNING", kind, detail, meta)

    def error(self, kind, detail, **meta):
        return self.add("ERROR", kind, detail, meta)

    def query(self, limit=50, offset=0, level=None, kind=None, search=None, sort="desc", after_id=None):
        entries = list(self._entries)
        if after_id:
            try:
                at = float(after_id.split(".")[0])
                entries = [e for e in entries if float(e["id"].split(".")[0]) > at]
            except:
                pass
        if level:
            lo = {"DEBUG": 0, "INFO": 1, "WARNING": 2, "ERROR": 3}
            ml = lo.get(level.upper(), 1)
            entries = [e for e in entries if lo.get(e["level"], 1) >= ml]
        if kind:
            entries = [e for e in entries if e["kind"] == kind]
        if search:
            q = search.lower()
            entries = [e for e in entries if q in e["detail"].lower()]
        entries.sort(key=lambda e: e["id"], reverse=(sort == "desc"))
        total = len(entries)
        page = entries[offset : offset + limit]
        return {
            "entries": page,
            "total": total,
            "limit": limit,
            "offset": offset,
            "max_entries": self.max_entries,
            "sort": sort,
        }

    def stats(self):
        levels, kinds = {}, {}
        for e in self._entries:
            levels[e["level"]] = levels.get(e["level"], 0) + 1
            kinds[e["kind"]] = kinds.get(e["kind"], 0) + 1
        return {"total": len(self._entries), "max_entries": self.max_entries, "levels": levels, "kinds": kinds}

    def clear(self):
        self._entries.clear()


activity_log = ActivityLog()


mcp = get_app()
mcp_http = mcp.http_app(path="/")
cfg = get_config_manager()


async def api_status(request):
    return JSONResponse(
        {
            "status": "running",
            "version": __version__,
            "tahoma2d_available": cfg.tahoma2d_available(),
            "tahoma2d_path": cfg.find_tahoma2d(),
        }
    )


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
    return JSONResponse(
        {
            "success": True,
            "tahoma2d_path": cfg.find_tahoma2d(),
            "tahoma2d_available": cfg.tahoma2d_available(),
        }
    )


OLLAMA_BASE = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434")


async def api_llm_providers(request):
    try:
        async with httpx.AsyncClient(timeout=5) as c:
            r = await c.get(f"{OLLAMA_BASE}/api/tags")
            r.raise_for_status()
            data = r.json()
            models = [m["name"] for m in data.get("models", [])]
    except Exception:
        models = []
    return JSONResponse({"providers": [{"name": "ollama", "models": models}]})


async def api_llm_chat(request):
    body = await request.json()
    prompt = body.get("prompt", "")
    model = body.get("model", "llama3.2:3b")
    if not prompt:
        return JSONResponse({"error": "Missing prompt"}, status_code=400)
    try:
        async with httpx.AsyncClient(timeout=120) as c:
            r = await c.post(
                f"{OLLAMA_BASE}/api/generate",
                json={"model": model, "prompt": prompt, "stream": False},
            )
            r.raise_for_status()
            data = r.json()
            return JSONResponse({"response": data.get("response", "")})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=502)


async def api_log_query(request):
    limit = int(request.query_params.get("limit", 50))
    offset = int(request.query_params.get("offset", 0))
    level = request.query_params.get("level")
    kind = request.query_params.get("kind")
    search = request.query_params.get("search")
    sort = request.query_params.get("sort", "desc")
    after_id = request.query_params.get("after_id")
    return JSONResponse(
        activity_log.query(
            limit=limit, offset=offset, level=level, kind=kind, search=search, sort=sort, after_id=after_id
        )
    )


async def api_log_stats(request):
    return JSONResponse(activity_log.stats())


async def api_log_clear(request):
    activity_log.clear()
    return JSONResponse({"success": True})


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


_tauri_desktop = os.environ.get("TAHOMA2D_TAURI", "").lower() in ("1", "true", "yes")
app = Starlette(
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=[
                "http://127.0.0.1:11013",
                "http://localhost:11013",
                "http://goliath:11013",
                "http://127.0.0.1:11012",
                "http://localhost:11012",
                "http://goliath:11012",
                "http://tauri.localhost",
                "https://tauri.localhost",
                "tauri://localhost",
            ],
            allow_origin_regex=r"https?://tauri\.localhost(:\d+)?" if _tauri_desktop else None,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ],
    routes=[
        Route("/api/status", api_status, methods=["GET"]),
        Route("/api/config", api_config, methods=["GET"]),
        Route("/api/config", api_config_set, methods=["POST"]),
        Route("/api/llm/providers", api_llm_providers, methods=["GET"]),
        Route("/api/llm/chat", api_llm_chat, methods=["POST"]),
        Route("/api/tool", api_tool, methods=["POST"]),
        Route("/api/logs", api_log_query, methods=["GET"]),
        Route("/api/logs/stats", api_log_stats, methods=["GET"]),
        Route("/api/logs/clear", api_log_clear, methods=["POST"]),
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
