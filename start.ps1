param(
    [switch]$Headless,
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$NoBrowser
)

$WebPort = 11012
$BackendPort = 11013
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== Tahoma2D MCP Server ===" -ForegroundColor Cyan
Write-Host "Clearing zombie ports..." -ForegroundColor Yellow

# SOTA zombie port cleanup
Get-NetTCPConnection -LocalPort $WebPort -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Killing process $($_.OwningProcess) on port $WebPort"
    Stop-Process -Id $_.OwningProcess -Force
}
Get-NetTCPConnection -LocalPort $BackendPort -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Killing process $($_.OwningProcess) on port $BackendPort"
    Stop-Process -Id $_.OwningProcess -Force
}

Start-Sleep -Seconds 1

if (-not $FrontendOnly) {
    Write-Host "Starting backend (port $BackendPort)..." -ForegroundColor Green
    $backendJob = Start-Job -ScriptBlock {
        param($root, $port)
        Set-Location -LiteralPath $root
        uv run uvicorn tahoma2d_mcp.server:asgi_app --host 127.0.0.1 --port $port --log-level info
    } -ArgumentList $RepoRoot, $BackendPort

    # Readiness poll
    Write-Host "  Waiting for backend to accept connections..." -NoNewline
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $req = [System.Net.HttpWebRequest]::Create("http://127.0.0.1:$BackendPort/mcp/api/v1/health")
            $req.Timeout = 1000
            $resp = $req.GetResponse()
            if ($resp.StatusCode -eq 200) { $ready = $true; break }
        } catch {}
        Start-Sleep -Milliseconds 500
        Write-Host "." -NoNewline
    }
    Write-Host ""
    if (-not $ready) { Write-Host "  WARNING: Backend may not be ready" -ForegroundColor Yellow }
}

if ($BackendOnly) {
    Write-Host "Backend running on port $BackendPort. Press Ctrl+C to stop." -ForegroundColor Cyan
    Wait-Job $backendJob
    return
}

if (-not $Headless) {
    Write-Host "Starting frontend (port $WebPort)..." -ForegroundColor Green
    $frontendJob = Start-Job -ScriptBlock {
        param($root, $port)
        Set-Location -LiteralPath "$root\webapp"
        npm run dev -- --port $port --host
    } -ArgumentList $RepoRoot, $WebPort

    Start-Sleep -Seconds 5

    if (-not $NoBrowser) {
        $url = "http://localhost:$WebPort"
        Write-Host "Opening $url ..." -ForegroundColor Cyan
        Start-Process $url
    }
}

Write-Host "=== Tahoma2D MCP is running ===" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:$BackendPort/mcp"
Write-Host "Webapp:  http://localhost:$WebPort"
if ($Headless) { Write-Host "Headless mode: no frontend started" -ForegroundColor Yellow }
Write-Host "Press Ctrl+C to stop."

if ($BackendOnly -or $Headless) {
    Wait-Job $backendJob
} else {
    Wait-Job $backendJob, $frontendJob
}
