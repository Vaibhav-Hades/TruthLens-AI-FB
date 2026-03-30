# TruthLens AI - Multilingual Voice Installation Script
# This script installs Windows language packs for TTS support

Write-Host "🌍 TruthLens AI - Installing Multilingual Language Packs" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Languages to install
$languages = @(
    @{ Code = "hi-IN"; Name = "हिंदी (Hindi)" },
    @{ Code = "te-IN"; Name = "తెలుగు (Telugu)" },
    @{ Code = "ta-IN"; Name = "தமிழ் (Tamil)" },
    @{ Code = "bn-IN"; Name = "বাংলা (Bengali)" },
    @{ Code = "es-ES"; Name = "Español (Spanish)" },
    @{ Code = "fr-FR"; Name = "Français (French)" },
    @{ Code = "zh-CN"; Name = "中文 (Chinese)" }
)

Write-Host "📦 Available languages to install:" -ForegroundColor Cyan
$languages | ForEach-Object { Write-Host "  ✓ $($_.Name)" }
Write-Host ""

# Get current system language
$currentLang = (Get-Culture).Name
Write-Host "Current system language: $currentLang" -ForegroundColor Yellow
Write-Host ""

Write-Host "Installing language packs..." -ForegroundColor Cyan
Write-Host ""

$installed = 0
$failed = 0

foreach ($lang in $languages) {
    $langCode = $lang.Code
    $langName = $lang.Name
    
    Write-Host "Installing: $langName ($langCode)..." -ForegroundColor Yellow -NoNewline
    
    try {
        # Install language pack using Windows Update
        # Note: This requires internet connection
        
        $osVersion = [System.Environment]::OSVersion.Version
        $isWindows11 = $osVersion.Major -ge 10 -and $osVersion.Build -ge 22000
        
        if ($isWindows11) {
            # Windows 11
            Write-Host " (Windows 11 detected)" -ForegroundColor Gray
            
            # Use Settings app method
            Start-Process "ms-settings:regionlanguage-adddisplaylanguage" -Wait
            Write-Host "  ⚠️  Please complete installation in Settings app" -ForegroundColor Yellow
        } else {
            # Windows 10
            Write-Host " (Windows 10 detected)" -ForegroundColor Gray
            
            # Open region and language settings
            Start-Process "ms-settings:regionlanguage" -Wait
            Write-Host "  ⚠️  Please complete installation in Settings app" -ForegroundColor Yellow
        }
        
        $installed++
    } catch {
        Write-Host "  ❌ Error: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Installation Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Initiated: $installed" -ForegroundColor Green
Write-Host "  ❌ Failed: $failed" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  IMPORTANT: Windows Settings app will open." -ForegroundColor Yellow
Write-Host "   Follow these steps:" -ForegroundColor Yellow
Write-Host "   1. Click 'Add a language'" -ForegroundColor Cyan
Write-Host "   2. Search for the language (Hindi, Telugu, etc.)" -ForegroundColor Cyan
Write-Host "   3. Click 'Next' and 'Install'" -ForegroundColor Cyan
Write-Host "   4. Wait for download (5-10 minutes per language)" -ForegroundColor Cyan
Write-Host "   5. RESTART YOUR COMPUTER when done" -ForegroundColor Cyan
Write-Host ""
Write-Host "After restart, test voices in TruthLens ChatbotWidget!" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to open Windows Settings"

# Open Settings to Region & Language
Start-Process "ms-settings:regionlanguage-adddisplaylanguage"

Write-Host ""
Write-Host "✅ Settings app opened! Follow the steps above." -ForegroundColor Green
Write-Host "⚠️  Remember to RESTART your computer after installing languages!" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter when you're done installing all languages"
