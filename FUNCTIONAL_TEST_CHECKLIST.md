# Liste de Contrôle des Tests Fonctionnels

Cette liste de contrôle couvre les fonctionnalités clés d'OpenPrompt et peut être utilisée pour vérifier que l'application fonctionne comme prévu après des modifications ou des déploiements.

## 1. Authentification et Gestion des Utilisateurs

-   [ ] **Inscription :**
    -   [ ] Création d'un nouveau compte utilisateur (email/mot de passe).
    -   [ ] Gestion des erreurs (email déjà enregistré, mots de passe non correspondants).
-   [ ] **Connexion :**
    -   [ ] Connexion réussie avec des identifiants valides (email/mot de passe).
    -   [ ] Connexion via Google/GitHub (si implémenté et configuré).
    -   [ ] Gestion des erreurs (identifiants invalides, compte non existant).
-   [ ] **Déconnexion :**
    -   [ ] Déconnexion réussie et redirection vers la page de connexion/accueil.
-   [ ] **Gestion du Profil :**
    -   [ ] Affichage correct des informations du profil utilisateur.
    -   [ ] Modification et sauvegarde des informations du profil (nom, bio, site web, GitHub, avatar).
    -   [ ] Annulation des modifications du profil.

## 2. Gestion des Contenus (Prompts, Agents, Personas, Contextes)

### Création (CRUD - Create)
-   [ ] **Prompts :**
    -   [ ] Création d'un nouveau prompt avec titre, description, tags, texte, catégorie, public/privé.
    -   [ ] Ajout/gestion des pièces jointes (images, URLs).
-   [ ] **Agents :**
    -   [ ] Création d'un nouvel agent avec titre, description, tags, instruction système, public/privé.
-   [ ] **Personas :**
    -   [ ] Création d'une nouvelle persona avec titre, description, tags, instruction système, public/privé.
-   [ ] **Contextes :**
    -   [ ] Création d'un nouveau contexte avec titre, description, contenu, tags, public/privé.

### Lecture (CRUD - Read)
-   [ ] **Affichage des listes :**
    -   [ ] Les listes de prompts, agents, personas et contextes s'affichent correctement.
    -   [ ] Le filtrage et la recherche fonctionnent sur toutes les listes.
    -   [ ] Les éléments publics et privés sont affichés selon les permissions de l'utilisateur.
-   [ ] **Affichage des détails :**
    -   [ ] Les pages de détails pour chaque type de contenu affichent toutes les informations correctement.
    -   [ ] Les pièces jointes sont affichées/accessibles.

### Mise à jour (CRUD - Update)
-   [ ] **Prompts :**
    -   [ ] Modification et sauvegarde des informations d'un prompt existant.
-   [ ] **Agents :**
    -   [ ] Modification et sauvegarde des informations d'un agent existant.
-   [ ] **Personas :**
    -   [ ] Modification et sauvegarde des informations d'une persona existante.
-   [ ] **Contextes :**
    -   [ ] Modification et sauvegarde des informations d'un contexte existant.

### Suppression (CRUD - Delete)
-   [ ] **Tous les types de contenu :**
    -   [ ] Suppression réussie d'un élément.
    -   [ ] Confirmation de la suppression avant l'action.

## 3. Fonctionnalités du Playground

-   [ ] **Interaction LLM :**
    -   [ ] Envoi de requêtes aux modèles LLM configurés.
    -   [ ] Réception et affichage des réponses en streaming.
-   [ ] **Entrées Multimodales :**
    -   [ ] Téléchargement et utilisation d'images dans les requêtes.
    -   [ ] Utilisation de l'entrée vocale (si configurée).
-   [ ] **Sélection de Contenu :**
    -   [ ] Sélection et application de prompts, agents, personas et contextes dans le playground.

## 4. Fonctionnalités Communautaires

-   [ ] **Likes :**
    -   [ ] L'utilisateur peut aimer/ne plus aimer un élément.
    -   [ ] Le nombre de likes est mis à jour.
-   [ ] **Commentaires :**
    -   [ ] L'utilisateur peut ajouter un commentaire à un élément.
    -   [ ] Les commentaires s'affichent correctement.
    -   [ ] L'utilisateur peut supprimer ses propres commentaires.

## 5. Tableau de Bord Admin (si rôle admin)

-   [ ] **Gestion des Utilisateurs :**
    -   [ ] Affichage de la liste des utilisateurs.
    -   [ ] Suppression d'utilisateurs.
    -   [ ] Modification des rôles/informations des utilisateurs.
-   [ ] **Gestion des Commentaires :**
    -   [ ] Affichage de tous les commentaires.
    -   [ ] Suppression de n'importe quel commentaire.

## 6. Paramètres

-   [ ] **Configuration des Clés API :**
    -   [ ] Saisie et sauvegarde des clés API pour les différents fournisseurs LLM.
    -   [ ] Les clés sont stockées localement et utilisées correctement.
-   [ ] **Configuration Ollama :**
    -   [ ] Saisie de l'URL de base d'Ollama.
    -   [ ] Chargement des modèles disponibles depuis Ollama.
    -   [ ] Sélection d'un modèle par défaut.

## 7. Interface Utilisateur et Expérience

-   [ ] **Navigation :**
    -   [ ] Toutes les sections de l'application sont accessibles via la navigation.
    -   [ ] Les boutons "Retour" fonctionnent comme prévu.
-   [ ] **Thème Sombre :**
    -   [ ] Le thème sombre est appliqué correctement sur toutes les pages.
-   [ ] **Réactivité :**
    -   [ ] L'interface est réactive et s'adapte aux différentes tailles d'écran (mobile, tablette, bureau).
-   [ ] **Notifications/Messages d'Erreur :**
    -   [ ] Les messages de succès et d'erreur s'affichent de manière appropriée.
