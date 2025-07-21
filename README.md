# OpenPrompt

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Framework](https://img.shields.io/badge/framework-React-blue.svg)

OpenPrompt is a community-driven platform to create, share, and test prompts and AI agents. Explore a library of curated prompts, configure agents with specific behaviors, and experiment in a real-time, multimodal playground. It now features a robust client-server architecture for enhanced data management and user authentication.

***
# OpenPrompt
<img width="1512" height="1207" alt="image" src="https://github.com/user-attachments/assets/acbe47d4-163e-4aaf-a609-2f7635ffd908" />
<img width="1516" height="1208" alt="image" src="https://github.com/user-attachments/assets/0ee589af-68cd-4e5c-9530-20d2887e4ede" />
<img width="1503" height="1217" alt="image" src="https://github.com/user-attachments/assets/40f67c5f-d365-4b8f-93bd-dc2dd602571c" />
<img width="1527" height="1211" alt="image" src="https://github.com/user-attachments/assets/33a08853-d4d3-4308-8227-bb93956c97a4" />
***

## About The Project

OpenPrompt empowers developers, writers, and AI enthusiasts to build, manage, and refine their interactions with Large Language Models. It provides a structured environment for prompt engineering, featuring a rich user interface for creating, editing, and testing prompts, agents, and personas. With a new client-server architecture, it offers enhanced data persistence, user authentication, and community sharing capabilities. It's the ultimate toolkit for your AI experiments.

## Key Features

- **Unified Playground:** Test prompts, agents, and personas against multiple LLM providers (Gemini, Ollama, and more) in a single, intuitive chat interface with real-time streaming responses.
- **Community & Private Library:** Share your creations with the community or keep them in your private, persistent library.
- **Full CRUD for Creations:** Easily **C**reate, **R**ead, **U**pdate, and **D**elete your prompts, agents, and personas in a dedicated detail view.
- **AI-Assisted Creation:** Use the power of AI to generate prompt templates and system instructions from a simple title and description.
- **Multimodal Inputs:** Interact with models using more than just text. Attach **images** for vision-based tasks and use your **voice** for dictation.
- **Robust Data Persistence:** All data is now managed by a dedicated backend service, ensuring secure and scalable storage.
- **User Authentication & Authorization:** Secure user login and role-based access control, including an **Admin Dashboard** for managing users and content.
- **Rich Filtering & Search:** Quickly find what you need in the community or your library with powerful search and filtering options, including by input type (image, voice, etc.).
- **Modern Dark Theme:** A sleek, professional interface designed for focus and readability.

## Tech Stack

- **Frontend Framework:** React 18
- **Frontend Language:** TypeScript
- **Frontend Styling:** Tailwind CSS
- **Backend:** Node.js with Express.js
- **Database:** SQLite (managed by backend)
- **LLM APIs:** @google/genai for Gemini, plus native `fetch` for Ollama.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need `git`, `Node.js`, `npm` (or `yarn`), and a modern web browser.

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/CBS9564/OpenPrompt.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd OpenPrompt
    ```

3.  **Install frontend dependencies:**
    ```sh
    npm install
    ```

4.  **Install backend dependencies and build:**
    ```sh
    cd backend
    npm install
    npm run build
    cd ..
    ```

5.  **Start the backend server:**
    ```sh
    npm run start-backend
    ```
    This will start the backend server, typically at `http://localhost:3001`.

6.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```
    This will start the frontend development server, typically at `http://localhost:5173`.

7.  **Open in your browser:**
    Navigate to the URL provided by the frontend development server (e.g., `http://localhost:5173`).

## Usage and Configuration

The application is usable out of the box with simulated providers. To connect to real Large Language Models, you need to configure API keys.

### 1. Configure API Keys

- Click the **cog icon** ⚙️ in the top-right header to open the **Settings** modal.
- Here you can add your API keys for different providers like **Gemini**.
- All keys are stored **exclusively in your browser's local storage** and are never sent to any server other than the respective LLM provider's API endpoint.

### 2. Configure Ollama

Ollama runs locally on your machine. To connect OpenPrompt to it:
1.  Ensure your [Ollama server](https://ollama.com/) is running.
2.  In the Settings modal, go to the **Ollama** tab.
3.  Enter your Ollama server's **Base URL** (e.g., `http://localhost:11434`).
4.  **Important:** For the browser to connect to your local Ollama server, you may need to configure CORS. You can do this by setting an environment variable before starting your Ollama server:
    ```sh
    # On macOS/Linux
    OLLAMA_ORIGINS='*' ollama serve

    # On Windows (Command Prompt)
    set OLLAMA_ORIGINS=*
    ollama serve
    ```
5.  Click **Load Available Models** to fetch the models you have pulled in Ollama. You can optionally set a default model to be used in the Playground.

## How It Works

OpenPrompt now operates with a client-server architecture:

- **Frontend:** A React application running in your browser, responsible for the user interface and interacting with the backend API.
- **Backend:** A Node.js (Express.js) server that handles data persistence, user authentication, and serves as an API gateway for LLM providers.
- **Data Persistence:** The backend manages a SQLite database, ensuring secure, scalable, and persistent storage of all application data.
- **LLM Communication:** The frontend communicates with the backend, which then forwards requests to the respective LLM provider's endpoints (e.g., Google AI, or your local Ollama instance). This centralizes API key management and allows for future enhancements like rate limiting and logging.

## Modifications Récentes

Voici un résumé des améliorations et corrections apportées depuis la version précédente :

-   **Déplacement du menu "My Library"** : Les liens "My Prompts", "My Agents", "My Personas" ont été déplacés de la barre latérale vers le menu déroulant de l'utilisateur pour une meilleure organisation de l'interface.
-   **Correction du chargement et de la sélection des modèles Gemini** : Résolution des problèmes où les modèles Gemini ne s'affichaient pas dans les paramètres et où le modèle par défaut était remplacé dans la page Rumble.
-   **Ajout de la page "Only Chat"** : Une interface de chat simplifiée pour interagir directement avec les modèles.
-   **Ajout de la page "Rumble"** : Une fonctionnalité permettant de faire interagir plusieurs agents ou modèles entre eux.
-   **Intégration du Bouton A2A Manager** : Ajout d'un bouton "A2A Manager" dans le menu déroulant de l'utilisateur pour un accès rapide à l'interface de test A2A.
-   **Test d'Agents A2A dans le Playground** :
    -   Les cartes d'agent affichent désormais des informations spécifiques au protocole A2A (version, capacités, schémas de sécurité).
    -   Possibilité de sélectionner un agent A2A dans le Playground et d'envoyer des requêtes à son point de terminaison A2A, affichant les réponses directement dans l'interface.
-   **Model Context Protocol (MCP)** : Une norme ouverte qui permet aux applications d'intelligence artificielle, notamment les modèles de langage de grande taille (LLM), de se connecter de manière sécurisée et bidirectionnelle à diverses sources de données et outils externes. Dans OpenPrompt, les MCPs sont actuellement implémentés comme des sources de contexte textuel injectables dans les prompts, mais la norme est plus large.
-   **Amélioration des Données de Test** : Les données de test générées sont désormais plus réalistes et limitées à 10 entrées par catégorie (prompts, agents, personas, MCPs, utilisateurs) pour une meilleure gestion et pertinence.
-   **Corrections de Bugs Divers** : Résolution de plusieurs problèmes liés aux modifications ci-dessus, incluant des erreurs 404, des erreurs de compilation et des problèmes de cliquabilité des cartes.

## Cohérence de l'implémentation MCP avec la norme

La définition du Model Context Protocol (MCP) est une norme ouverte qui permet aux applications d'intelligence artificielle, notamment les modèles de langage de grande taille (LLM), de se connecter de manière sécurisée et bidirectionnelle à diverses sources de données et outils externes.

Notre implémentation actuelle des "MCPs" dans OpenPrompt est une **simplification et une première étape** vers cette norme.

**Cohérence :**

-   **Sources de données :** Nos MCPs agissent comme des "sources de données" textuelles. Ils permettent d'injecter du contenu (texte) dans les prompts, ce qui est une forme de connexion à une source de données.
-   **Sécurité :** Bien que nous n'ayons pas encore implémenté des mécanismes de sécurité spécifiques au protocole MCP pour ces "sources de données" (au-delà de l'authentification utilisateur générale de l'application), le concept de sécurité est reconnu et peut être étendu.
-   **Bidirectionnel :** Actuellement, nos MCPs sont principalement unidirectionnels (injection de données dans le prompt). Cependant, la structure est là pour permettre des interactions plus complexes à l'avenir.
-   **Outils externes :** L'idée d'intégrer des "outils externes" est représentée par la possibilité d'attacher des fichiers (PDF, CSV, etc.) et des URLs, qui peuvent être considérés comme des outils pour fournir du contexte.

**Incohérence / Points à améliorer pour une conformité totale :**

-   **Norme ouverte :** Notre implémentation n'est pas encore une "norme ouverte" au sens où elle ne suit pas un protocole de communication standardisé pour les MCPs (comme un protocole HTTP spécifique ou un format de données défini pour l'échange). C'est une implémentation interne.
-   **Bidirectionnalité avancée :** La "bidirectionnalité" dans la définition du MCP implique des interactions plus complexes que la simple injection de texte. Cela pourrait inclure la capacité pour le LLM de requêter dynamiquement des données à partir d'un MCP ou d'envoyer des données à un MCP.
-   **Outils externes :** L'intégration avec des "outils externes" pourrait être plus poussée, par exemple, en permettant aux MCPs d'exécuter des fonctions ou d'interagir avec des APIs externes.
-   **Schéma de données :** La norme MCP pourrait définir un schéma de données plus riche pour les "sources de données" et les "outils externes" que notre simple champ `content`.

**Conclusion :**

Notre implémentation actuelle des MCPs est une base fonctionnelle qui permet d'injecter du contexte dans les prompts. Elle est alignée avec l'esprit général du Model Context Protocol en tant que "source de données" pour les LLM. Cependant, pour être pleinement conforme à la définition d'une "norme ouverte" et pour exploiter toutes les capacités d'un MCP, des développements futurs seraient nécessaires pour implémenter un protocole de communication plus formel et des interactions bidirectionnelles plus sophistiquées.

## Roadmap

Voici quelques-unes des fonctionnalités prévues pour les prochaines versions :

-   **Prompt/Agent Versioning:** Ajouter un système pour sauvegarder et visualiser l'historique des modifications apportées à un élément.
-   **Prompt Chaining:** Construire une fonctionnalité pour lier plusieurs prompts ou agents ensemble afin de créer des workflows complexes.
-   **Formal Evaluation Suite:** Développer une interface dédiée pour tester un seul prompt contre un lot d'entrées afin d'évaluer ses performances et sa cohérence.
-   **Expanded Provider Support:** Implémenter un support API complet pour Anthropic, Groq, Hugging Face, et d'autres services.
-   **Theming:** Introduire un thème clair et permettre aux utilisateurs de basculer entre les modes clair et sombre.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.