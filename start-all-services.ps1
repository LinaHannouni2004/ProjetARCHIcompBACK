# Script pour démarrer tous les services automatiquement (dans des fenêtres séparées)
# ATTENTION: Ce script ouvre 9 fenêtres PowerShell séparées

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Démarrage de tous les services..." -ForegroundColor Cyan
Write-Host "9 fenêtres PowerShell vont s'ouvrir" -ForegroundColor Yellow
Write-Host ""

# Fonction pour démarrer un service dans une nouvelle fenêtre
function Start-ServiceInNewWindow {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$DelaySeconds = 0
    )
    
    $script = @"
Start-Sleep -Seconds $DelaySeconds
cd '$projectRoot\$ServicePath'
Write-Host 'Démarrage de $ServiceName...' -ForegroundColor Green
mvn spring-boot:run
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $script
}

# Démarrer les services dans l'ordre avec des délais
Start-ServiceInNewWindow -ServiceName "Discovery Server (Eureka)" -ServicePath "discovery-server" -DelaySeconds 0
Start-Sleep -Seconds 2
Start-ServiceInNewWindow -ServiceName "Config Server" -ServicePath "config-server" -DelaySeconds 10
Start-Sleep -Seconds 2
Start-ServiceInNewWindow -ServiceName "API Gateway" -ServicePath "api-gateway" -DelaySeconds 20
Start-Sleep -Seconds 2
Start-ServiceInNewWindow -ServiceName "Author Service" -ServicePath "library-author-service" -DelaySeconds 25
Start-Sleep -Seconds 2
Start-ServiceInNewWindow -ServiceName "Book Service" -ServicePath "library-book-service" -DelaySeconds 30
Start-Sleep -Seconds 2
Start-ServiceInNewWindow -ServiceName "User Service" -ServicePath "library-user-service" -DelaySeconds 35
Start-Sleep -Seconds 2
Start-ServiceInNewWindow -ServiceName "Loan Service" -ServicePath "library-loan-service" -DelaySeconds 40
Start-Sleep -Seconds 2
Start-ServiceInNewWindow -ServiceName "Recommendation Service" -ServicePath "recommendation-service" -DelaySeconds 45
Start-Sleep -Seconds 2
Start-ServiceInNewWindow -ServiceName "Client Service" -ServicePath "library-client-service" -DelaySeconds 50

Write-Host "Tous les services sont en cours de démarrage..." -ForegroundColor Green
Write-Host "Vérifiez les fenêtres PowerShell qui se sont ouvertes" -ForegroundColor Yellow
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "  Eureka: http://localhost:8761" -ForegroundColor Magenta
Write-Host "  API Gateway: http://localhost:8080" -ForegroundColor Magenta

