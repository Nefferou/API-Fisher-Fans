# Scénarios de test pour l'API Fisher Fans

## Framework de test recommandé
Pour ce type de projet, nous recommandons d'utiliser **Jest** pour les tests unitaires et d’intégration, en combinaison avec **Supertest** pour tester les endpoints HTTP. Jest est facile à configurer et à utiliser, et Supertest facilite les tests des routes HTTP d'Express.js.

## 1 - Authentification des utilisateurs ✅

### Scénario 1.1 : Vérifier qu'un utilisateur non authentifié ne peut pas accéder aux ressources de l’API. ✅
- **Étapes** :
  1. Envoyer une requête GET ou POST à un endpoint protégé (par exemple `/api/users`).
  2. Vérifier que le statut de la réponse est **401 Unauthorized**.
  3. Vérifier que le message d'erreur indique un besoin d'authentification.

### Scénario 1.2 : Vérifier qu’un utilisateur authentifié peut accéder aux ressources de l'API. ✅
- **Étapes** :
  1. Créer un utilisateur et obtenir un token d'authentification (par exemple avec JWT).
  2. Envoyer une requête GET ou POST à un endpoint protégé avec le token dans l'en-tête `Authorization`.
  3. Vérifier que la réponse est **200 OK**.
  4. Vérifier que les données retournées correspondent à celles attendues (par exemple, la liste des utilisateurs).

## 2 - Accès aux ressources 

### Scénario 2.1 : Vérifier que les endpoints pour les utilisateurs, bateaux, sorties pêche, réservations, et carnets de pêche sont disponibles. ✅
- **Étapes** :
  1. Tester chaque endpoint avec une requête GET (par exemple, `/api/users`, `/api/boats`, etc.).
  2. Vérifier que la réponse est **200 OK** et que chaque endpoint renvoie des données.

### Scénario 2.2 : Vérifier que chaque endpoint renvoie des données dans un format correct (JSON). ✅
- **Étapes** :
  1. Envoyer une requête GET à un endpoint (par exemple `/api/users`).
  2. Vérifier que le type de contenu de la réponse est `application/json`.
  3. Vérifier que la réponse est bien structurée en JSON.

### Scénario 2.3 : Vérifier qu’un utilisateur peut récupérer la liste de ses bateaux, sorties pêche, réservations et pages de son carnet de pêche. ✅
- **Étapes** :
  1. Créer un utilisateur avec des bateaux, sorties pêche, réservations, et pages de carnet de pêche.
  2. Envoyer une requête GET à un endpoint pour récupérer la liste (par exemple, `/api/boats/:userId`).
  3. Vérifier que la réponse contient les bons éléments (les bateaux associés à cet utilisateur).

### Scénario 2.4 : Vérifier que les listes sont complètes et exactes. ✅
- **Étapes** :
  1. Créer plusieurs ressources dans la base de données.
  2. Envoyer une requête GET à un endpoint pour récupérer une liste (par exemple, `/api/boats`).
  3. Vérifier que la liste contient exactement les éléments créés.

### Scénario 2.5 : Vérifier que l’API permet de filtrer les utilisateurs, bateaux, sorties, et réservations par un sous-ensemble de leurs caractéristiques. ✅
- **Étapes** :
  1. Créer plusieurs ressources avec différentes caractéristiques (ex : date, type de bateau).
  2. Envoyer une requête GET avec des paramètres de filtre (par exemple `/api/boats?type=sail`).
  3. Vérifier que la réponse contient uniquement les éléments qui correspondent aux filtres.

### Scénario 2.6 : Vérifier que l’API permet de filtrer les bateaux situés dans une zone géographique spécifique. ✅
- **Étapes** :
  1. Créer des bateaux avec des coordonnées géographiques.
  2. Envoyer une requête GET avec des paramètres de filtre géographique (par exemple `/api/boats?lat=45.0&lon=3.0`).
  3. Vérifier que la réponse contient des bateaux proches de la zone géographique spécifiée.

### Scénario 2.7 : Vérifier que des erreurs sont renvoyées en cas de données manquantes. ✅
- **Étapes** :
  1. Envoyer une requête POST avec des données manquantes (par exemple sans nom pour un bateau).
  2. Vérifier que la réponse est **400 Bad Request**.
  3. Vérifier que le message d'erreur précise les champs manquants.

## 3 - Création de ressources

### Scénario 3.1 : Vérifier que l’API permet de créer un utilisateur, un bateau, une sortie de pêche, une réservation et une page de carnet de pêche. ✅
- **Étapes** :
  1. Envoyer une requête POST avec des données valides pour chaque ressource (par exemple `/api/users`, `/api/boats`, etc.).
  2. Vérifier que la réponse est **201 Created**.
  3. Vérifier que la ressource a été correctement ajoutée à la base de données.

### Scénario 3.2 : Vérifier que chaque ressource est correctement sauvegardée dans la base de données. ✅
- **Étapes** :
  1. Créer une ressource (par exemple un utilisateur).
  2. Vérifier dans la base de données que la ressource est bien présente avec les bonnes informations.

### Scénario 3.3 : Vérifier que des erreurs sont renvoyées en cas de données invalides. 
- **Étapes** :
  1. Envoyer une requête POST avec des données invalides (par exemple un utilisateur sans email).
  2. Vérifier que la réponse est **400 Bad Request** et que le message d'erreur est explicite.

### Scénario 3.4 : Vérifier qu’un utilisateur sans bateau ne peut pas créer de sortie de pêche. ✅
- **Étapes** :
  1. Créer un utilisateur sans bateau.
  2. Tenter de créer une sortie de pêche pour cet utilisateur via une requête POST.
  3. Vérifier que la réponse est **400 Bad Request** avec un message d'erreur approprié.

### Scénario 3.5 : Vérifier qu’un utilisateur sans permis bateau ne peut pas créer de bateau. ✅
- **Étapes** :
  1. Créer un utilisateur sans permis bateau.
  2. Tenter de créer un bateau pour cet utilisateur.
  3. Vérifier que la réponse est **400 Bad Request** avec un message d'erreur approprié.

## 4 - Suppression de ressources

### Scénario 4.1 : Vérifier que l’API permet de supprimer un utilisateur, un bateau, une sortie de pêche, une réservation et des pages du carnet de pêche. ✅
- **Étapes** :
  1. Créer une ressource (par exemple un bateau).
  2. Envoyer une requête DELETE pour supprimer cette ressource.
  3. Vérifier que la réponse est **204 No Content**.

### Scénario 4.2 : Vérifier que les ressources supprimées ne sont plus accessibles après la suppression. ✅
- **Étapes** :
  1. Supprimer une ressource.
  2. Essayer d'accéder à cette ressource (par exemple avec une requête GET).
  3. Vérifier que la réponse est **404 Not Found**.

## 5 - Modification de ressources

### Scénario 5.1 : Vérifier que l’API permet de modifier les informations d’un utilisateur, d’un bateau, d’une sortie pêche, d’une réservation, et des pages d’un carnet de pêche. ✅
- **Étapes** :
  1. Créer une ressource (par exemple un utilisateur).
  2. Envoyer une requête PUT ou PATCH pour modifier cette ressource.
  3. Vérifier que la réponse est **200 OK**.

### Scénario 5.2 : Vérifier que les modifications sont bien enregistrées et visibles via les endpoints concernés. ✅
- **Étapes** :
  1. Modifier une ressource (par exemple un bateau).
  2. Envoyer une requête GET pour récupérer cette ressource.
  3. Vérifier que les modifications sont présentes dans la réponse.

---

### Exemple de test avec Jest et Supertest

Voici un exemple de test avec **Jest** et **Supertest** pour tester un endpoint :

```javascript
const request = require('supertest');
const app = require('../app'); // L'application Express.js

describe('GET /api/users', () => {
  it('devrait renvoyer un statut 200 OK et une liste d\'utilisateurs', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
