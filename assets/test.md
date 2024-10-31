# Scénarios de test pour l'API Fisher Fans

### 1 - Authentification des utilisateurs
- **Scénario 1.1** : Vérifier qu'un utilisateur non authentifié ne peut pas accéder aux ressources de l’API.
- **Scénario 1.2** : Vérifier qu’un utilisateur authentifié peut accéder aux ressources de l'API.

### 2 - Accès aux ressources
- **Scénario 2.1** : Vérifier que les endpoints pour les utilisateurs, bateaux, sorties pêche, réservations, et carnets de pêche sont disponibles.
- **Scénario 2.2** : Vérifier que chaque endpoint renvoie des données dans un format correct (JSON).
- **Scénario 2.3** : Vérifier qu’un utilisateur peut récupérer la liste de ses bateaux, sorties pêche, réservations et pages de son carnet de pêche.
- **Scénario 2.4** : Vérifier que les listes sont complètes et exactes.
- **Scénario 2.5** : Vérifier que l’API permet de filtrer les utilisateurs, bateaux, sorties, et réservations par un sous-ensemble de leurs caractéristiques.
- **Scénario 2.6** : Vérifier que l’API permet de filtrer les bateaux situés dans une zone géographique spécifique.
- **Scénario 2.7** : Vérifier que des erreurs sont renvoyées en cas de données manquantes.

### 3 - Création de ressources
- **Scénario 3.1** : Vérifier que l’API permet de créer un utilisateur, un bateau, une sortie de pêche, une réservation et une pages de carnet de pêche.
- **Scénario 3.2** : Vérifier que chaque ressource est correctement sauvegardée dans la base de données.
- **Scénario 3.3** : Vérifier que des erreurs sont renvoyées en cas de données invalides.
- **Scénario 3.4** : Vérifier qu’un utilisateur sans bateau ne peut pas créer de sortie de pêche.
- **Scénario 3.5** : Vérifier qu’un utilisateur sans permis bateau ne peut pas créer de bateau.

### 4 - Suppression de ressources
- **Scénario 4.1** : Vérifier que l’API permet de supprimer un utilisateur, un bateau, une sortie de pêche, une réservation et des pages du carnet de pêche.
- **Scénario 4.2** : Vérifier que les ressources supprimées ne sont plus accessibles après la suppression.

### 5 - Modification de ressources
- **Scénario 5.1** : Vérifier que l’API permet de modifier les informations d’un utilisateur, d’un bateau, d’une sortie pêche, d’une réservation, et des pages d’un carnet de pêche.
- **Scénario 5.2** : Vérifier que les modifications sont bien enregistrées et visibles via les endpoints concernés.