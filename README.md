# Système de Gestion de Bibliothèque en Ligne

Système de gestion de bibliothèque basé sur une architecture microservices utilisant Spring Boot, Spring Cloud, et Eureka.

## Architecture

Ce projet est un système de microservices composé de 10 modules :

1. **discovery-server** (Port 8761) - Serveur Eureka pour la découverte de services
2. **config-server** (Port 8888) - Serveur de configuration centralisé
3. **api-gateway** (Port 8080) - Passerelle API avec Spring Cloud Gateway
4. **library-author-service** (Port 8081) - Gestion des auteurs
5. **library-book-service** (Port 8082) - Gestion du catalogue de livres
6. **library-user-service** (Port 8083) - Gestion des membres de la bibliothèque
7. **library-loan-service** (Port 8084) - Gestion des emprunts et retours
8. **recommendation-service** (Port 8085) - Service de recommandation de livres
9. **library-client-service** (Port 8086) - Service façade pour agrégation de données
10. **config-repo** - Dépôt de configurations externalisées

## Technologies Utilisées

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Cloud 2023.0.0**
- **Spring Cloud Gateway** - Routage et filtrage
- **Netflix Eureka** - Découverte de services
- **Spring Cloud Config** - Configuration centralisée
- **OpenFeign** - Communication inter-services
- **Spring Data JPA** - Accès aux données
- **H2 Database** - Base de données en mémoire
- **MapStruct** - Mapping DTO/Entity
- **Lombok** - Réduction du code boilerplate
- **Springdoc OpenAPI** - Documentation Swagger
- **Spring Actuator** - Monitoring et métriques

## Structure du Projet

```
library-management-system/
├── pom.xml (Parent POM)
├── discovery-server/
├── config-server/
├── api-gateway/
├── library-author-service/
├── library-book-service/
├── library-user-service/
├── library-loan-service/
├── recommendation-service/
├── library-client-service/
└── config-repo/
```

## Prérequis

- Java 17 ou supérieur
- Maven 3.6 ou supérieur

## Installation et Démarrage

### 1. Compiler le projet

```bash
mvn clean install
```

### 2. Démarrer les services dans l'ordre suivant

#### Étape 1 : Démarrer le serveur de découverte (Eureka)

```bash
cd discovery-server
mvn spring-boot:run
```

Vérifier que le serveur est démarré : http://localhost:8761

#### Étape 2 : Démarrer le serveur de configuration

```bash
cd config-server
mvn spring-boot:run
```

Le serveur de configuration sera disponible sur : http://localhost:8888

#### Étape 3 : Démarrer la passerelle API

```bash
cd api-gateway
mvn spring-boot:run
```

La passerelle sera disponible sur : http://localhost:8080

#### Étape 4 : Démarrer les microservices

Dans des terminaux séparés :

```bash
# Service Auteur
cd library-author-service
mvn spring-boot:run

# Service Livre
cd library-book-service
mvn spring-boot:run

# Service Utilisateur
cd library-user-service
mvn spring-boot:run

# Service Emprunt
cd library-loan-service
mvn spring-boot:run

# Service Recommandation
cd recommendation-service
mvn spring-boot:run

# Service Client
cd library-client-service
mvn spring-boot:run
```

## Accès aux Services

### Eureka Dashboard
- URL : http://localhost:8761

### API Gateway
- URL : http://localhost:8080

### Swagger UI pour chaque service

- **Author Service** : http://localhost:8081/swagger-ui.html
- **Book Service** : http://localhost:8082/swagger-ui.html
- **User Service** : http://localhost:8083/swagger-ui.html
- **Loan Service** : http://localhost:8084/swagger-ui.html
- **Recommendation Service** : http://localhost:8085/swagger-ui.html
- **Client Service** : http://localhost:8086/swagger-ui.html

### Console H2 Database

- **Author Service** : http://localhost:8081/h2-console
  - JDBC URL: `jdbc:h2:mem:authordb`
  - Username: `sa`
  - Password: (vide)

- **Book Service** : http://localhost:8082/h2-console
  - JDBC URL: `jdbc:h2:mem:bookdb`
  - Username: `sa`
  - Password: (vide)

- **User Service** : http://localhost:8083/h2-console
  - JDBC URL: `jdbc:h2:mem:userdb`
  - Username: `sa`
  - Password: (vide)

- **Loan Service** : http://localhost:8084/h2-console
  - JDBC URL: `jdbc:h2:mem:loandb`
  - Username: `sa`
  - Password: (vide)

## Endpoints API via Gateway

Tous les endpoints sont accessibles via la passerelle API à l'adresse : `http://localhost:8080`

### Service Auteur

- `GET /api/authors` - Liste tous les auteurs
- `GET /api/authors/{id}` - Obtenir un auteur par ID
- `POST /api/authors` - Créer un nouvel auteur
- `PUT /api/authors/{id}` - Mettre à jour un auteur
- `DELETE /api/authors/{id}` - Supprimer un auteur
- `GET /api/authors/search?name={name}` - Rechercher des auteurs par nom

### Service Livre

- `GET /api/books` - Liste tous les livres
- `GET /api/books/{id}` - Obtenir un livre par ID
- `GET /api/books/{id}/with-author` - Obtenir un livre avec informations auteur
- `POST /api/books` - Créer un nouveau livre
- `PUT /api/books/{id}` - Mettre à jour un livre
- `DELETE /api/books/{id}` - Supprimer un livre
- `GET /api/books/search?title={title}&isbn={isbn}&category={category}` - Rechercher des livres

### Service Utilisateur

- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/{id}` - Obtenir un utilisateur par ID
- `POST /api/users` - Créer un nouvel utilisateur
- `PUT /api/users/{id}` - Mettre à jour un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

### Service Emprunt

- `GET /api/loans` - Liste tous les emprunts
- `GET /api/loans/{id}` - Obtenir un emprunt par ID
- `POST /api/loans/borrow` - Emprunter un livre
- `PUT /api/loans/{id}/return` - Retourner un livre
- `GET /api/loans/user/{userId}` - Obtenir tous les emprunts d'un utilisateur
- `GET /api/loans/book/{bookId}` - Obtenir tous les emprunts d'un livre
- `GET /api/loans/user/{userId}/active` - Obtenir les emprunts actifs d'un utilisateur

### Service Recommandation

- `GET /api/recommendations/most-borrowed?limit={limit}` - Obtenir les livres les plus empruntés
- `GET /api/recommendations/user/{userId}` - Obtenir des recommandations personnalisées pour un utilisateur

### Service Client (Agrégation)

- `GET /api/client/books/with-authors` - Obtenir tous les livres avec informations auteur
- `GET /api/client/recommendations/user/{userId}` - Obtenir des recommandations pour un utilisateur
- `GET /api/client/recommendations/most-borrowed?limit={limit}` - Obtenir les livres les plus empruntés

## Exemples d'Appels API

### Créer un auteur

```bash
curl -X POST http://localhost:8080/api/authors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Victor",
    "lastName": "Hugo",
    "bio": "Écrivain français",
    "birthDate": "1802-02-26"
  }'
```

### Créer un livre

```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Les Misérables",
    "isbn": "978-2-07-036789-0",
    "description": "Roman de Victor Hugo",
    "publicationDate": "1862-01-01",
    "category": "Roman",
    "totalCopies": 5,
    "availableCopies": 5,
    "authorId": 1
  }'
```

### Créer un utilisateur

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "phone": "0123456789"
  }'
```

### Emprunter un livre

```bash
curl -X POST http://localhost:8080/api/loans/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "bookId": 1
  }'
```

### Retourner un livre

```bash
curl -X PUT http://localhost:8080/api/loans/1/return
```

### Obtenir des recommandations

```bash
curl http://localhost:8080/api/recommendations/user/1
```

## Actuator Endpoints

Chaque service expose des endpoints Actuator pour le monitoring :

- `/actuator/health` - État de santé du service
- `/actuator/info` - Informations sur le service
- `/actuator/metrics` - Métriques du service

Exemple : http://localhost:8081/actuator/health

## Gestion des Erreurs

Tous les services implémentent une gestion d'erreurs uniforme avec le format suivant :

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "status": 404,
  "message": "Book not found with id: 1",
  "errors": null
}
```

Pour les erreurs de validation :

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "title": "Title is required",
    "isbn": "ISBN is required"
  }
}
```

## Communication Inter-Services

Les services communiquent entre eux via OpenFeign :

- **book-service** → **author-service** : Récupération des informations auteur
- **loan-service** → **book-service** : Vérification de disponibilité et mise à jour des copies
- **loan-service** → **user-service** : Vérification de l'existence de l'utilisateur
- **recommendation-service** → **loan-service** : Analyse de l'historique d'emprunt
- **recommendation-service** → **book-service** : Récupération des informations livres
- **client-service** → Tous les autres services : Agrégation de données

## Tests

Chaque service contient des tests unitaires et d'intégration. Pour exécuter les tests :

```bash
mvn test
```

Pour exécuter les tests d'un service spécifique :

```bash
cd library-book-service
mvn test
```

## Notes Importantes

1. **Base de données H2** : Les données sont stockées en mémoire et seront perdues à l'arrêt du service
2. **Pas de sécurité** : Aucune authentification ou autorisation n'est implémentée
3. **Configuration** : Les configurations sont externalisées dans `config-repo`
4. **Découverte de services** : Tous les services s'enregistrent automatiquement auprès d'Eureka

## Développement Futur

- Ajout de tests unitaires et d'intégration complets
- Implémentation de la sécurité (JWT, OAuth2)
- Migration vers une base de données persistante (PostgreSQL)
- Ajout de la gestion de cache (Redis)
- Implémentation de la messagerie asynchrone (RabbitMQ/Kafka)
- Ajout de la traçabilité distribuée (Zipkin/Sleuth)

## Auteur

Système de gestion de bibliothèque - Architecture microservices

## Licence

Ce projet est fourni à des fins éducatives.


