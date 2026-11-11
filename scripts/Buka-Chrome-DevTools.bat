@echo off
title Buka Chrome dengan Remote Debugging (Port 9222)
echo ==============================================================
echo  Menjalankan Google Chrome dengan Remote Debugging Aktif
echo  Port: 9222 (Izinkan Antigravity / AI Agent / Puppeteer)
echo ==============================================================

:: Periksa lokasi instalasi Chrome
set CHROME_BIN="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME_BIN% (
    set CHROME_BIN="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)
if not exist %CHROME_BIN% (
    set CHROME_BIN="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

echo Menutup sesi Chrome lama agar port debugging dapat terikat...
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo Membuka Chrome...
start "" %CHROME_BIN% --remote-debugging-port=9222 --remote-allow-origins=* --restore-last-session

echo Selesai! Chrome siap diotomatisasi tanpa kendala koneksi.
timeout /t 2 >nul
exit
