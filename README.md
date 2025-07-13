# OpenPrompt

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Framework](https://img.shields.io/badge/framework-React-blue.svg)

OpenPrompt is a community-driven, local-first platform to create, share, and test prompts and AI agents. Explore a library of curated prompts, configure agents with specific behaviors, and experiment in a real-time, multimodal playground that runs entirely in your browser.

***
# OpenPrompt
<img width="1512" height="1207" alt="image" src="https://github.com/user-attachments/assets/acbe47d4-163e-4aaf-a609-2f7635ffd908" />
<img width="1516" height="1208" alt="image" src="https://github.com/user-attachments/assets/0ee589af-68cd-4e5c-9530-20d2887e4ede" />
<img width="1503" height="1217" alt="image" src="https://github.com/user-attachments/assets/40f67c5f-d365-4b8f-93bd-dc2dd602571c" />
<img width="1527" height="1211" alt="image" src="https://github.com/user-attachments/assets/33a08853-d4d3-4308-8227-bb93956c97a4" />
***

## About The Project

OpenPrompt empowers developers, writers, and AI enthusiasts to build, manage, and refine their interactions with Large Language Models. It provides a structured environment for prompt engineering, featuring a rich user interface for creating, editing, and testing prompts, agents, and personas. With a focus on local-first data storage and community sharing, it's the ultimate toolkit for your AI experiments.

## Key Features

- **Unified Playground:** Test prompts, agents, and personas against multiple LLM providers (Gemini, Ollama, and more) in a single, intuitive chat interface with real-time streaming responses.
- **Community & Private Library:** Share your creations with the community or keep them in your private, persistent library.
- **Full CRUD for Creations:** Easily **C**reate, **R**ead, **U**pdate, and **D**elete your prompts, agents, and personas in a dedicated detail view.
- **AI-Assisted Creation:** Use the power of AI to generate prompt templates and system instructions from a simple title and description.
- **Multimodal Inputs:** Interact with models using more than just text. Attach **images** for vision-based tasks and use your **voice** for dictation.
- **Local-First SQL Database:** All data is stored in a robust **SQLite** database that lives in your browser, powered by `sql.js` (WebAssembly). Your data is yours and persists between sessions.
- **Rich Filtering & Search:** Quickly find what you need in the community or your library with powerful search and filtering options, including by input type (image, voice, etc.).
- **Modern Dark Theme:** A sleek, professional interface designed for focus and readability.

## Changelog

### v0.0.1 - August 1, 2024

This initial release brings OpenPrompt from a concept to a functional tool for prompt engineering.

✨ **New Features**
-   **Streaming AI Responses:** Playground responses now stream in real-time for a more interactive experience with supported providers (Gemini, Ollama).
-   **Social Engagement:** Users can now like and comment on community prompts, agents, and personas.
-   **User Profiles:** Full user profile page with editable name, bio, links, and custom avatar uploads.
-   **Multimodal Playground:** The playground now supports image attachments for vision models and voice-to-text input for hands-free interaction.
-   **AI-Assisted Creation:** A "Generate with AI" feature helps bootstrap new prompts, agents, and personas from a simple title and description.
-   **File & URL Attachments:** Attach text files, PDFs, or URLs to your creations to provide them with more context.
-   **Ollama Integration:** Seamless connection to local Ollama servers, including automatic model discovery and generation.
-   **Refined UI/UX:** A new dedicated detail page allows viewing, testing, and editing items in one place. The overall design has been polished for a better user experience.

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Local Database:** SQL.js (SQLite compiled to WebAssembly)
- **LLM APIs:** @google/genai for Gemini, plus native `fetch` for Ollama.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need `git` and a modern web browser. `Node.js` and `npx` (which is included with Node.js) are required to follow these instructions.

### Installation & Running

> **Important:** This is a pure client-side application that uses browser-native ES Modules via an `importmap`. There is **no `package.json`** file, and you **do not need to run `npm install`**. Doing so will result in an error because the module names in the `importmap` (like `react-dom/client`) are not `npm`-compatible package names.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/CBS9564/OpenPrompt.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd OpenPrompt
    ```

3.  **Serve the application:**
    This application runs entirely in the browser and requires a simple static file server. The easiest way is using `npx`:
    ```sh
    npx serve
    ```
    This command will start a local web server, typically at `http://localhost:3000`.

4.  **Open in your browser:**
    Navigate to the URL provided by the `serve` command (e.g., `http://localhost:3000`).

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

OpenPrompt is a "serverless" application. It has no backend and runs entirely in the browser.

- **Data Persistence:** It uses `sql.js` to create and manage an in-browser SQLite database. The entire database is exported and saved to the browser's `localStorage` whenever a change is made, ensuring your work is saved between sessions.
- **LLM Communication:** API calls are made directly from your browser to the respective LLM provider's endpoints (e.g., Google AI, or your local Ollama instance).

## Database Schema

The application uses an in-browser SQLite database powered by `sql.js`. The schema is defined below and executed on startup. The use of `CREATE TABLE IF NOT EXISTS` ensures that existing data is preserved across sessions.

```sql
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT,
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT,
  isRecommended INTEGER,
  createdAt INTEGER,
  isPublic INTEGER NOT NULL,
  supportedInputs TEXT
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT,
  systemInstruction TEXT NOT NULL,
  author TEXT,
  isRecommended INTEGER,
  createdAt INTEGER,
  isPublic INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS personas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT,
  systemInstruction TEXT NOT NULL,
  author TEXT,
  isRecommended INTEGER,
  createdAt INTEGER,
  isPublic INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS contexts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author TEXT,
  tags TEXT,
  isPublic INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  itemId TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  mimeType TEXT,
  content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS likes (
  itemId TEXT NOT NULL,
  userId TEXT NOT NULL,
  PRIMARY KEY (itemId, userId)
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  itemId TEXT NOT NULL,
  userId TEXT NOT NULL,
  authorName TEXT NOT NULL,
  authorAvatar TEXT,
  content TEXT NOT NULL,
  createdAt INTEGER NOT NULL
);
```

## Roadmap to v0.1.0

Here are some of the features planned for the next major release:

-   **True Community Sync:** Implement an optional backend service (e.g., Firebase) to allow for real-time sharing and syncing of community items across all users.
-   **Prompt/Agent Versioning:** Add a system to save and view the history of changes made to an item.
-   **Prompt Chaining:** Build a feature to link multiple prompts or agents together to create complex workflows.
-   **Formal Evaluation Suite:** Develop a dedicated interface for testing a single prompt against a batch of inputs to evaluate its performance and consistency.
-   **Expanded Provider Support:** Move beyond simulation and implement full API support for Anthropic, Groq, Hugging Face, and other services.
-   **Theming:** Introduce a light theme and allow users to toggle between light and dark modes.

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