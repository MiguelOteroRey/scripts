
::Restaurar men´´u contextual clásico
reg.exe add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve



::Alinear barra de herramientas a la izquierda
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v TaskbarAl /t REG_DWORD /f /d 0



:: Desactivar 'Mostrar elementos abiertos recientemente en Inicio'
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v Start_TrackDocs /t REG_DWORD /d 0 /f


:: Desactivar sugerencias (opcional, algunas vienen por política)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 0 /f


:: Desactivar sugerencias de la Tienda (live tiles, Spotlight, etc.)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v SubscribedContent-310093Enabled /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v SubscribedContent-338389Enabled /t REG_DWORD /d 0 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v SystemPaneSuggestionsEnabled /t REG_DWORD /d 0 /f

:: Opcional: Desactivar recomendaciones de la barra de tareas (Widgets, etc.)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v TaskbarDa /t REG_DWORD /d 0 /f



:: Ejecutar PowerShell desde CMD para quitar apps basura (preinstaladas por OEM/Microsoft)
powershell -Command "Get-AppxPackage -AllUsers *xbox* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *bing* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *skype* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *solitaire* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *zune* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *Spotify* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *Facebook* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *TikTok* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *CandyCrush* | Remove-AppxPackage"
powershell -Command "Get-AppxPackage -AllUsers *Disney* | Remove-AppxPackage"







:: Reiniciar el explorador para aplicar cambios
echo Reiniciando el Explorador de Windows...
taskkill /f /im explorer.exe
start explorer.exe