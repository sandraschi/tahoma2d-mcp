FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml run_server.py ./
COPY src/ ./src/

RUN pip install --no-cache-dir -e .

EXPOSE 11013

CMD ["uvicorn", "tahoma2d_mcp.server:asgi_app", "--host", "0.0.0.0", "--port", "11013"]
