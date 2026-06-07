param(
    [switch]$Headless,
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$NoBrowser
)

$WebPort = 11012
$BackendPort = 11013
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

$FleetStartPath = Join-Path $RepoRoot "scripts\FleetStartMode.ps1"
if (-not (Test-Path -LiteralPath $FleetStartPath)) {
    Write-Host "ERROR: Missing vendored launcher helper: $FleetStartPath" -ForegroundColor Red
    exit 1
}
. $FleetStartPath
$FleetStart = Initialize-FleetStartMode @PSBoundParameters
Enter-FleetHeadlessConsole -Headless:$Headless -BackendOnly:$BackendOnly
Stop-FleetPortSquatters -Ports @($WebPort, $BackendPort) -Label "tahoma2d-mcp"

if (-not (Assert-FleetPortsAvailable -Ports @($WebPort, $BackendPort) -Label "tahoma2d-mcp")) { exit 1 }

if (-not $FrontendOnly) {
    Write-Host "Starting backend (port $BackendPort)..." -ForegroundColor Green
    $backendCmd = "Set-Location '$RepoRoot'; uv run --project '$RepoRoot' uvicorn tahoma2d_mcp.server:asgi_app --host 127.0.0.1 --port $BackendPort --log-level info"
    $BackendProc = Start-Process powershell -ArgumentList "-NoProfile", "-WindowStyle", "Normal", "-Command", $backendCmd -PassThru

    Write-Host "Waiting for backend /api/status..." -ForegroundColor Gray
    $ready = $false
    for ($i = 0; $i -lt 60; $i++) {
        try {
            $r = Invoke-WebRequest -Uri "http://127.0.0.1:$BackendPort/api/status" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
            if ($r.StatusCode -eq 200) { $ready = $true; break }
        } catch {}
        Start-Sleep 1
    }
    if ($ready) {
        Write-Host "Backend ready on port $BackendPort" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Backend may not be ready" -ForegroundColor Yellow
    }
}

if ($BackendOnly) {
    while (-not $BackendProc.HasExited) { Start-Sleep 2 }
    exit
}

if (-not $FleetStart.RunFrontend) {
    while ($true) { Start-Sleep -Seconds 60 }
}

$WebRoot = Join-Path $RepoRoot "webapp"
if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
    Set-Location $WebRoot
    npm install
}

if (-not $NoBrowser) {
    $url = "http://127.0.0.1:$WebPort"
    $pollAndOpen = "for (`$i = 0; `$i -lt 60; `$i++) { try { `$null = Invoke-WebRequest -Uri '$url' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop; Start-Process '$url'; exit } catch { Start-Sleep -Seconds 1 } }"
    Start-Process powershell -ArgumentList "-NoProfile", "-WindowStyle", "Hidden", "-Command", $pollAndOpen
}

Write-Host "=== Tahoma2D MCP is running ===" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:$BackendPort/mcp"
Write-Host "Webapp:  http://localhost:$WebPort"
Set-Location $WebRoot
npm run dev -- --port $WebPort --host --strictPort


