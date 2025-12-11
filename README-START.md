# Guide de Démarrage des Services

## Démarrage Manuel (Recommandé)

Pour démarrer tous les services, ouvrez **9 terminaux PowerShell séparés** et exécutez les commandes suivantes dans l'ordre :

### Terminal 1 - Discovery Server (Eureka)
```powershell
cd discovery-server
mvn spring-boot:run
```
**Port:** 8761  
**URL:** http://localhost:8761

### Terminal 2 - Config Server
Attendre 10-15 secondes après le démarrage d'Eureka, puis :
```powershell
cd config-server
mvn spring-boot:run
```
**Port:** 8888

### Terminal 3 - API Gateway
Attendre 15-20 secondes après le démarrage du Config Server, puis :
```powershell
cd api-gateway
mvn spring-boot:run
```
**Port:** 8080  
**URL:** http://localhost:8080

### Terminal 4 - Author Service
```powershell
cd library-author-service
mvn spring-boot:run
```
**Port:** 8081  
**Swagger:** http://localhost:8081/swagger-ui.html

### Terminal 5 - Book Service
```powershell
cd library-book-service
mvn spring-boot:run
```
**Port:** 8082  
**Swagger:** http://localhost:8082/swagger-ui.html

### Terminal 6 - User Service
```powershell
cd library-user-service
mvn spring-boot:run
```
**Port:** 8083  
**Swagger:** http://localhost:8083/swagger-ui.html

### Terminal 7 - Loan Service
```powershell
cd library-loan-service
mvn spring-boot:run
```
**Port:** 8084  
**Swagger:** http://localhost:8084/swagger-ui.html

### Terminal 8 - Recommendation Service
```powershell
cd recommendation-service
mvn spring-boot:run
```
**Port:** 8085  
**Swagger:** http://localhost:8085/swagger-ui.html

### Terminal 9 - Client Service
```powershell
cd library-client-service
mvn spring-boot:run
```
**Port:** 8086  
**Swagger:** http://localhost:8086/swagger-ui.html

## Démarrage Automatique

Vous pouvez également utiliser le script PowerShell fourni :

```powershell
.\start-all-services.ps1
```

Ce script ouvrira automatiquement 9 fenêtres PowerShell avec les services en cours de démarrage.

## Vérification des Services

### Vérifier les ports en écoute
```powershell
netstat -ano | Select-String -Pattern "(8761|8888|8080|8081|8082|8083|8084|8085|8086)"
```

### Vérifier Eureka Dashboard
Ouvrez votre navigateur et allez sur : http://localhost:8761

Vous devriez voir tous les services enregistrés.

### Tester l'API Gateway
```powershell
# Exemple : Lister tous les auteurs
Invoke-RestMethod -Uri "http://localhost:8080/api/authors" -Method Get
```

## Ordre de Démarrage Important

1. **Discovery Server** (Eureka) - Doit démarrer en premier
2. **Config Server** - Peut démarrer après Eureka
3. **API Gateway** - Doit démarrer après Config Server
4. **Microservices** - Peuvent démarrer en parallèle après Eureka et Config Server

## Arrêt des Services

Pour arrêter un service, appuyez sur `Ctrl+C` dans le terminal correspondant.

Pour arrêter tous les processus Java :
```powershell
Get-Process java | Stop-Process -Force
```

## URLs Importantes

- **Eureka Dashboard:** http://localhost:8761
- **API Gateway:** http://localhost:8080
- **Config Server:** http://localhost:8888
- **Swagger UI (chaque service):** http://localhost:PORT/swagger-ui.html
- **H2 Console (chaque service):** http://localhost:PORT/h2-console

## Dépannage

### Service ne démarre pas
1. Vérifiez que le port n'est pas déjà utilisé
2. Vérifiez que Eureka est démarré (pour les microservices)
3. Vérifiez les logs dans le terminal

### Erreur de connexion à Eureka
- Assurez-vous que le Discovery Server est démarré et accessible sur le port 8761
- Vérifiez la configuration dans `bootstrap.yml` de chaque service

### Erreur de connexion au Config Server
- Assurez-vous que le Config Server est démarré sur le port 8888
- Vérifiez que le profil `native` est activé dans `bootstrap.yml`

