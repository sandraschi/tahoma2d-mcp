default:
    just --list

lint:
    uv run ruff check src/

fmt:
    uv run ruff format src/ --check

fix:
    uv run ruff check --fix src/
    uv run ruff format src/

check: fmt lint

serve:
    uv run tahoma2d-mcp-server

web:
    cd webapp && npm run dev -- --port 11012 --host

start:
    powershell -File start.ps1

dev:
    uv run uvicorn tahoma2d_mcp.server:asgi_app --host 127.0.0.1 --port 11013 --reload

test:
    uv run pytest

ci: check test

bootstrap:
    uv sync

build:
    uv run pip install build
    uv run python -m build

build-sidecar:
    powershell -File native/build-sidecar.ps1

build-native:
    Set-Location native; npx @tauri-apps/cli build

build-native-debug:
    Set-Location native; npx @tauri-apps/cli build --debug

build-all:
    powershell -File native/build.ps1

tauri-dev:
    Set-Location native; npm run dev

check-sec:
    uv run bandit -r src/

audit-deps:
    uv run safety check

e2e:
    cd webapp && npx playwright test

clean:
    Remove-Item -Recurse -Force dist, build, .pytest_cache, __pycache__ -ErrorAction SilentlyContinue
