# NanoDev Transaction API

## Description

NanoDev Transaction API est une application backend développée avec NestJS qui gère des transactions financières avec un système de confirmation en temps réel utilisant les WebSockets.

## Technologies

- **Framework**: NestJS v10
- **Base de données**: PostgreSQL 15
- **ORM**: Sequelize
- **Communication en temps réel**: Socket.IO
- **Documentation API**: Swagger
- **Conteneurisation**: Docker

## Prérequis

- Node.js (v20)
- Docker et Docker Compose
- PostgreSQL 15

## Installation

1. Cloner le repository

git clone <repository-url>

2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplir les variables suivantes dans le fichier .env :

```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
APP_BASE_URL=
```

4. Lancer l'application avec Docker

```bash
docker-compose up -d
```

## Structure du projet

```
src/
├── app.module.ts              # Module principal
├── main.ts                    # Point d'entrée
├── transaction/              # Module de gestion des transactions
├── events/                   # Module WebSocket
├── database/                 # Configuration base de données
├── scheduler/                # Tâches planifiées
├── logging/                 # Service de logging
└── http/                    # Service HTTP
```

## Fonctionnalités principales

### 1. Gestion des transactions

- Création de nouvelles transactions
- Consultation avec filtrage avancé
- Mise à jour et suppression
- Confirmation automatique

### 2. Notifications temps réel

- Événement `NEW_TRANSACTION`
- Événement `TRANSACTION_CONFIRMED`

### 3. Simulation automatique

- Génération de transactions toutes les minutes
- Confirmation automatique après 10 secondes

## API Endpoints

### Transactions

```
POST   /transaction          # Créer une transaction
GET    /transaction          # Lister les transactions
GET    /transaction/:id      # Obtenir une transaction
PATCH  /transaction/:id      # Mettre à jour une transaction
DELETE /transaction/:id      # Supprimer une transaction
```

### Paramètres de filtrage

| Paramètre | Description       | Valeurs possibles                       |
| --------- | ----------------- | --------------------------------------- |
| timeRange | Période           | 24h, 7j, 30j, 1M, 3M, 6M, 12M, YTD, All |
| page      | Numéro de page    | ≥ 1                                     |
| limit     | Éléments par page | ≥ 1                                     |
| search    | Recherche         | string                                  |
| start     | Date début        | Date                                    |
| end       | Date fin          | Date                                    |

## WebSocket Events

### Connexion

```javascript
const socket = io('ws://localhost:8111/events');
```

### Écoute des événements

```javascript
socket.on('NEW_TRANSACTION', (data) => {
  console.log('Nouvelle transaction:', data);
});

socket.on('TRANSACTION_CONFIRMED', (data) => {
  console.log('Transaction confirmée:', data);
});
```

## Scripts disponibles

```bash
# Mode développement
npm run start:dev

# Construction
npm run build

# Production
npm run start:prod

# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de tests
npm run test:cov
```

## Docker

L'application est conteneurisée avec trois services :

### Services

- **server**: Application NestJS (port 8111)
- **postgres**: Base de données PostgreSQL (port 5432)
- **adminer**: Interface d'administration BD (port 5096)

### Commandes Docker

```bash
# Lancer tous les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Logs
docker-compose logs -f
```

## Tests

Le projet inclut des tests unitaires et d'intégration pour :

- Controllers
- Services
- WebSocket Gateway
- Validations

## Sécurité

- Validation des DTOs
- Protection CORS
- Logging sécurisé
- Filtrage des données

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)
