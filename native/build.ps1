$Root = Split-Path -Parent $PSScriptRoot
$RepoName = Split-Path -Leaf $Root
$BackendPath = "$PSScriptRoot\binaries"
$TargetTriple = "x86_64-pc-windows-msvc"

Write-Host "=== Building $RepoName (Full Pipeline) ===" -ForegroundColor Cyan

# Step 1: Build webapp
Write-Host "[1/4] Building webapp..." -ForegroundColor Yellow
Push-Location "$Root\webapp"
npm install
npm run build
Pop-Location

# Step 2: Build PyInstaller sidecar
Write-Host "[2/4] Building PyInstaller sidecar..." -ForegroundColor Yellow
Push-Location "$Root"
$py = if (Get-Command "uv" -ErrorAction SilentlyContinue) { "uv run python" } else { "python" }
& cmd /c "$py -m PyInstaller --onedir -y --clean --name ${RepoName}-backend --add-data src/${RepoName};${RepoName} --copy-metadata fastmcp --hidden-import uvicorn.logging run_server.py" 2>&1 | Out-Host
Pop-Location

# Step 3: Copy sidecar binary
Write-Host "[3/4] Copying sidecar..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $BackendPath
$src = "$Root\dist\${RepoName}-backend\${RepoName}-backend.exe"
$dst = "$BackendPath\${RepoName}-backend-${TargetTriple}.exe"
if (Test-Path $src) {
    Copy-Item $src $dst -Force
    Write-Host "  Sidecar copied to $dst" -ForegroundColor Green
} else {
    Write-Host "  WARNING: Sidecar binary not found at $src" -ForegroundColor Red
}

# Step 4: Build Tauri bundle
Write-Host "[4/4] Building Tauri bundle..." -ForegroundColor Yellow
Push-Location $PSScriptRoot
npx @tauri-apps/cli build
Pop-Location

Write-Host "=== Build Complete ===" -ForegroundColor Cyan
