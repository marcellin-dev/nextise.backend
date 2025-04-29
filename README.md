# Documentation du Projet Nextise - Gestion de Séminaires

## Introduction

Ce projet est une API de gestion de séminaires développée avec NestJS. Elle permet aux utilisateurs de gérer des cours et des formateurs, avec des fonctionnalités avancées comme la détection de conflits d'emploi du temps et la suggestion automatique de formateurs.

## Technologies Utilisées

- **Framework**: NestJS v10
- **Base de données**: PostgreSQL
- **ORM**: Prisma
- **Authentification**: JWT
- **Validation**: class-validator
- **Email**: Nodemailer
- **Conteneurisation**: Docker

## Architecture du Projet

```
src/
├── app.module.ts            # Module principal
├── main.ts                  # Point d'entrée
├── auth/                    # Authentification et gestion des utilisateurs
├── courses/                 # Gestion des cours
├── trainer/                 # Gestion des formateurs
├── prisma/                  # Configuration Prisma
├── common/                  # Utilitaires partagés
│   ├── decorator/           # Décorateurs personnalisés
│   ├── errors/              # Gestion des erreurs
│   ├── helpers/             # Fonctions d'aide
│   └── types/               # Types et interfaces
├── logging/                 # Service de logging
└── events/                  # Gestionnaire d'événements
```

## Modèles de Données

### User

- `id`: Identifiant unique (UUID)
- `email`: Email unique
- `password`: Mot de passe hashé
- `lastLogin`: Date de dernière connexion
- `createdAt`: Date de création
- `updatedAt`: Date de mise à jour

### Course

- `id`: Identifiant unique (UUID)
- `name`: Nom du cours
- `date`: Date du cours
- `subject`: Sujet du cours
- `location`: Lieu du cours
- `participants`: Nombre de participants
- `notes`: Notes (optionnel)
- `price`: Prix du cours
- `trainer_price`: Prix du formateur
- `trainer_id`: ID du formateur (optionnel)
- `user_id`: ID de l'utilisateur créateur

### Trainer

- `id`: Identifiant unique (UUID)
- `name`: Nom du formateur
- `training_subjects`: Sujets de formation (tableau)
- `location`: Lieu du formateur
- `email`: Email unique du formateur
- `user_id`: ID de l'utilisateur créateur

## API Endpoints

### Authentification

- `POST /auth/register` : Inscription
- `POST /auth/login` : Connexion
- `POST /auth/request-otp` : Demande d'un code OTP
- `POST /auth/refresh` : Rafraîchir le token

### Cours

- `POST /courses` : Créer un cours
- `GET /courses` : Lister tous les cours (avec pagination)
- `GET /courses/:id` : Obtenir les détails d'un cours
- `POST /courses/suggest-trainer` : Suggérer le meilleur formateur pour un cours

### Formateurs

- `POST /trainers` : Créer un formateur
- `GET /trainers` : Lister tous les formateurs (avec pagination)
- `GET /trainers/:id` : Obtenir les détails d'un formateur
- `GET /trainers/:id/availability/:date` : Vérifier la disponibilité d'un formateur

## Fonctionnalités Principales

### Gestion des Cours

- Création de cours avec validation des données
- Détection automatique des conflits d'emploi du temps
- Pagination et recherche avancée
- Association avec un formateur

### Gestion des Formateurs

- Création de formateurs avec validation des données
- Vérification de disponibilité
- Pagination et recherche avancée

### Algorithmes Intelligents

1. **Détection de Conflits d'Emploi du Temps** :

   - Vérifie si deux cours sont programmés en même temps et au même lieu
   - Empêche la création de cours avec des conflits

2. **Appariement Optimal de Formateur** :
   - Suggère le meilleur formateur en fonction de :
     - Son expertise dans le sujet du cours
     - Sa disponibilité à la date du cours
     - Sa proximité géographique avec le lieu du cours

### Notification par Email

- Envoi automatique d'email au formateur lors de son assignation à un cours
- Email avec détails complets du cours (nom, date, lieu, etc.)

## Installation et Configuration

### Prérequis

- Node.js (v16+)
- PostgreSQL
- Docker et Docker Compose (optionnel)

### Configuration des Variables d'Environnement

Créez un fichier `.env` avec les variables suivantes :

```
DATABASE_URL="postgres://<DATABASE_USERNAME>:<DATABASE_PASSWORD>@<DATABASE_HOST>:<DATABASE_PORT>/<DATABASE_NAME>"

# Secrets JWT
JWT_ACCESS_SECRET="<votre_secret_jwt_access>"
JWT_REFRESH_SECRET="<votre_secret_jwt_refresh>"

# Configuration SMTP pour l'envoi d'emails
MAIL_SENDER="<adresse_email_expediteur>"
MAIL_PASSWORD="<mot_de_passe_email>"
MAIL_HOST="<hote_smtp>"

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
```

### Installation

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Lancer l'application en développement
npm run start:dev
```

### Docker

```bash
# Construire et lancer les conteneurs
docker-compose up -d
```

## Utilisation

### Authentification

Toutes les routes (sauf l'authentification) nécessitent un token JWT valide. Pour l'obtenir :

1. Créez un compte avec `POST /auth/register`
2. Connectez-vous avec `POST /auth/login`
3. Utilisez le token d'accès dans l'en-tête Authorization : `Bearer <token>`

### Création d'un Cours

```json
POST /courses
{
  "name": "Advanced React.js",
  "date": "2024-09-15T10:00:00Z",
  "subject": "React.js",
  "location": "Paris",
  "participants": 20,
  "notes": "Focus sur les hooks et l'API Context",
  "price": 2000,
  "trainer_price": 500,
  "trainer_id": "uuid-du-formateur" // Optionnel
}
```

### Création d'un Formateur

```json
POST /trainers
{
  "name": "Jean Dupont",
  "training_subjects": ["React.js", "Next.js", "Vue.js"],
  "location": "Lyon",
  "email": "jean.dupont@example.com"
}
```

### Recherche avec Pagination

```
GET /courses?page=1&limit=10&search=React
```

## Sécurité

- **Authentification JWT** : Tous les endpoints sont protégés par JWT
- **Validation des Données** : Utilisation de class-validator pour valider les entrées
- **Vérification de Propriété** : Les utilisateurs ne peuvent accéder qu'à leurs propres ressources
- **Logging Sécurisé** : Service de logging pour tracer les actions importantes
- **Gestion des Erreurs** : Messages d'erreur internationalisés et sécurisés

## Bonnes Pratiques Implémentées

1. **Architecture Modulaire** : Séparation claire des responsabilités
2. **Injection de Dépendances** : Utilisation du système DI de NestJS
3. **DTOs Validés** : Validation rigoureuse des données d'entrée
4. **Pagination** : Gestion efficace des grandes collections de données
5. **Internationalisation** : Messages d'erreur en français et anglais
6. **Logging Structuré** : Traces détaillées pour faciliter le débogage
7. **Transactions Atomiques** : Garantie de l'intégrité des données

Ce projet respecte les principes SOLID et suit les recommandations de la documentation officielle de NestJS pour une application robuste et évolutive.
