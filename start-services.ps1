# Script PowerShell pour démarrer tous les services du système de gestion de bibliothèque
# Utilisation: Ouvrez plusieurs terminaux PowerShell et exécutez chaque commande dans un terminal séparé

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Démarrage des Services - Bibliothèque" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Ouvrez 9 terminaux PowerShell séparés" -ForegroundColor Yellow
Write-Host "2. Dans chaque terminal, naviguez vers le répertoire du projet" -ForegroundColor Yellow
Write-Host "3. Exécutez les commandes suivantes dans l'ordre:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 - Discovery Server (Eureka):" -ForegroundColor Green
Write-Host "  cd discovery-server" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Config Server (attendre 10 secondes après le démarrage d'Eureka):" -ForegroundColor Green
Write-Host "  cd config-server" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 3 - API Gateway (attendre 15 secondes après le démarrage du Config Server):" -ForegroundColor Green
Write-Host "  cd api-gateway" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 4 - Author Service:" -ForegroundColor Green
Write-Host "  cd library-author-service" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 5 - Book Service:" -ForegroundColor Green
Write-Host "  cd library-book-service" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 6 - User Service:" -ForegroundColor Green
Write-Host "  cd library-user-service" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 7 - Loan Service:" -ForegroundColor Green
Write-Host "  cd library-loan-service" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 8 - Recommendation Service:" -ForegroundColor Green
Write-Host "  cd recommendation-service" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 9 - Client Service:" -ForegroundColor Green
Write-Host "  cd library-client-service" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URLs des Services:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Magenta
Write-Host "Config Server: http://localhost:8888" -ForegroundColor Magenta
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Magenta
Write-Host "Author Service: http://localhost:8081" -ForegroundColor Magenta
Write-Host "Book Service: http://localhost:8082" -ForegroundColor Magenta
Write-Host "User Service: http://localhost:8083" -ForegroundColor Magenta
Write-Host "Loan Service: http://localhost:8084" -ForegroundColor Magenta
Write-Host "Recommendation Service: http://localhost:8085" -ForegroundColor Magenta
Write-Host "Client Service: http://localhost:8086" -ForegroundColor Magenta
Write-Host ""

