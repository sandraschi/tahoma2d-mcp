!macro KillFleetProcesses
  DetailPrint "Stopping tahoma2d MCP processes..."
  ExecWait 'taskkill /F /IM tahoma2d-backend.exe /T' $0
  ExecWait 'taskkill /F /IM tahoma2d-native.exe /T' $0
  !if "${INSTALLMODE}" == "currentUser"
    nsis_tauri_utils::KillProcessCurrentUser "tahoma2d-backend.exe"
    Pop $0
    nsis_tauri_utils::KillProcessCurrentUser "tahoma2d-native.exe"
    Pop $0
  !else
    nsis_tauri_utils::KillProcess "tahoma2d-backend.exe"
    Pop $0
    nsis_tauri_utils::KillProcess "tahoma2d-native.exe"
    Pop $0
  !endif
  Sleep 2000
!macroend

!macro NSIS_HOOK_PREINSTALL
  !insertmacro KillFleetProcesses
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  !insertmacro KillFleetProcesses
!macroend
