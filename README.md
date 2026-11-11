# Workout_API

## Base de données

Le [diagramme ERD](docs/erd.md) décrit les tables PostgreSQL, leurs relations et leurs contraintes à partir du schéma Prisma.

## GitHub repo public
https://github.com/Yoan6223911/Workout_API

## Base de donnée
La BD PostgreSQL utilisée par l'API a été hébergée sur la plateforme NEON 

## Routes API

URL de base : `https://workout-api-eqyt.kennhosting.app`.
Les chemins ci-dessous s'ajoutent à cette URL, sans préfixe `/api`.
Les requêtes POST et PATCH utilisent un corps JSON avec l'en-tête `Content-Type: application/json`.

### État du service

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/health` | Vérifier que l'API répond. |

### Entraînements

| Méthode | Route | Description | Corps JSON |
| --- | --- | --- | --- |
| GET | `/workouts` | Lister tous les entraînements. | — |
| GET | `/workouts/:id` | Obtenir un entraînement avec ses exercices, séries et répétitions. | — |
| POST | `/workouts` | Créer un entraînement. | `{"name":"Haut du corps"}` |
| PATCH | `/workouts/:id` | Renommer un entraînement. | `{"name":"Nouvelle séance"}` |
| DELETE | `/workouts/:id` | Supprimer un entraînement et ses associations. | — |

### Exercices

| Méthode | Route | Description | Corps JSON |
| --- | --- | --- | --- |
| GET | `/exercices` | Lister tous les exercices. | — |
| GET | `/exercices?muscleGroup=CHEST` | Filtrer les exercices par groupe musculaire. | — |
| GET | `/exercices/:id` | Obtenir un exercice et les entraînements qui l'utilisent. | — |
| POST | `/exercices` | Créer un exercice. | `{"name":"Développé couché","muscleGroup":"CHEST"}` |
| PATCH | `/exercices/:id` | Modifier le nom et/ou le groupe musculaire d'un exercice. | `{"name":"Pompes","muscleGroup":"CHEST"}` |
| DELETE | `/exercices/:id` | Supprimer un exercice et ses associations. | — |

Groupes musculaires acceptés : `CHEST`, `BACK`, `LEGS`, `SHOULDERS`, `BICEPS`, `TRICEPS`, `ABS`.

### Exercices d'un entraînement

| Méthode | Route | Description | Corps JSON |
| --- | --- | --- | --- |
| POST | `/workouts/:id/exercices` | Ajouter un exercice à un entraînement avec ses séries et répétitions. | `{"exerciceId":"ID_EXERCICE","sets":3,"repetitions":10}` |
| DELETE | `/workouts/:id/exercices/:exerciceId` | Retirer un exercice de l'entraînement sans supprimer l'exercice lui-même. | — |

`:id` désigne l'identifiant de l'entraînement ou de l'exercice selon la route ; `:exerciceId` désigne celui de l'exercice associé.
Il n'existe pas de route PATCH pour les associations : pour modifier les séries ou répétitions, retirer puis ajouter à nouveau l'exercice.

Exemple pour consulter tous les entraînements :

```http
GET https://workout-api-eqyt.kennhosting.app/workouts
```

## Déploiement

Configurer `DATABASE_URL` avec la connexion PostgreSQL de production et `PORT`
avec le port fourni par l'hébergeur. Le client et les migrations utilisent la
même variable `DATABASE_URL`.

Depuis le dossier `nodejs_stage` :

```sh
npm ci --include=dev
npm run db:generate
npm start
```

`npm start` exécute automatiquement les migrations versionnées via `prestart`
avant de lancer l'API. Si une migration échoue, le serveur ne démarre pas.
Configurer donc la commande de démarrage de l'hébergeur sur `npm start`.
Conserver les dépendances de développement dans l'environnement de démarrage :
la CLI `prisma` y est déclarée et sert à appliquer les migrations.

Pour appliquer les migrations séparément depuis le terminal de l'hébergeur :

## Utilisation de l'IA

L'IA a été utilisée particulièrement pour les validations, l'implémentation
du design patern repository, pour la rédaction/schématisation du diagrame
de la base de donnée et enfin pour ce README.md

## Autres sources

Les sources qui m'ont permis de mener à bien ce projet en dehors de l'IA 
sont notamment une vidéo YouTube : https://www.youtube.com/watch?v=g09PoiCob4Y et du repo git de la vidéo
https://github.com/machadop1407/NodeJS-ExpressJS-BackendCourse.