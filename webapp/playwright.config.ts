import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 60000,
    retries: 1,
    use: {
        baseURL: 'http://localhost:11012',
        headless: true,
        screenshot: 'only-on-failure',
    },
    webServer: {
        command: 'uv run uvicorn tahoma2d_mcp.server:asgi_app --host 127.0.0.1 --port 11013 --log-level warning',
        port: 11013,
        cwd: '../',
        timeout: 30000,
        reuseExistingServer: false,
    },
});
