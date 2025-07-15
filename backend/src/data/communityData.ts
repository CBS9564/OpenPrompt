import { Prompt, Agent, Persona, ContextItem, Comment, User } from "@types";
import { v4 as uuidv4 } from 'uuid';

// --- AUTHORS ---
const authors = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy"];
const admin = "Admin User";

// --- HELPER FUNCTIONS FOR GENERATION ---

const getRandomAuthor = () => authors[Math.floor(Math.random() * authors.length)];
const getRandomBoolean = () => Math.random() > 0.5;
const getRandomDate = () => Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365); // Up to 1 year ago

const generateRandomTags = (count: number) => {
  const possibleTags = ["tech", "creative", "productivity", "fun", "education", "writing", "coding", "art", "science", "history", "personal", "gaming", "health", "food", "travel"];
  const tags: string[] = [];
  for (let i = 0; i < count; i++) {
    tags.push(possibleTags[Math.floor(Math.random() * possibleTags.length)]);
  }
  return [...new Set(tags)]; // Ensure unique tags
};

const generatePrompt = (index: number): Omit<Prompt, "likeCount" | "commentCount"> => ({
  id: `prompt-${uuidv4()}`,
  title: `Prompt Généré ${index}: ${[
    "Idée de Scénario", "Analyse de Données", "Recette Créative", "Conseil en Carrière", "Exercice de Langue"
  ][Math.floor(Math.random() * 5)]}`,
  description: `Description détaillée pour le prompt généré numéro ${index}. Il vise à ${[
    "stimuler la créativité", "simplifier des concepts complexes", "aider à la planification", "fournir des informations utiles"
  ][Math.floor(Math.random() * 4)]}.`,
  tags: generateRandomTags(Math.floor(Math.random() * 3) + 1),
  text: `Voici le texte du prompt numéro ${index}. Il inclut des variables comme {{sujet}} et {{contexte}} pour une personnalisation facile.`,
  category: ["Écriture Créative", "Technique", "Style de vie", "Éducation", "Divertissement"][Math.floor(Math.random() * 5)],
  author: getRandomAuthor(),
  isRecommended: getRandomBoolean(),
  createdAt: getRandomDate(),
  isPublic: getRandomBoolean(),
  supportedInputs: getRandomBoolean() ? ["image"] : (getRandomBoolean() ? ["audio"] : (getRandomBoolean() ? ["video"] : [])),
});

const generateAgent = (index: number): Omit<Agent, "likeCount" | "commentCount"> => ({
  id: `agent-${uuidv4()}`,
  title: `Agent Virtuel ${index}: ${[
    "Assistant Personnel", "Expert en Codage", "Guide de Voyage", "Coach de Fitness", "Conteur d'Histoires"
  ][Math.floor(Math.random() * 5)]}`,
  description: `Cet agent est conçu pour ${[
    "optimiser votre productivité", "vous aider à résoudre des problèmes techniques", "planifier vos aventures", "améliorer votre bien-être"
  ][Math.floor(Math.random() * 4)]}.`,
  tags: generateRandomTags(Math.floor(Math.random() * 3) + 1),
  systemInstruction: `En tant qu'Agent ${index}, votre rôle est de fournir des réponses ${[
    "précises et concises", "créatives et inspirantes", "pratiques et actionnables"
  ][Math.floor(Math.random() * 3)]}.`,
  author: getRandomAuthor(),
  isRecommended: getRandomBoolean(),
  createdAt: getRandomDate(),
  isPublic: getRandomBoolean(),
});

const generatePersona = (index: number): Omit<Persona, "likeCount" | "commentCount"> => ({
  id: `persona-${uuidv4()}`,
  title: `Persona ${index}: ${[
    "Philosophe Ancien", "Explorateur Spatial", "Chef Cuisinier Excentrique", "Détective Cynique", "Robot Optimiste"
  ][Math.floor(Math.random() * 5)]}`,
  description: `Une persona avec une personnalité ${[
    "profonde et contemplative", "aventureuse et curieuse", "passionnée et créative", "observatrice et sarcastique"
  ][Math.floor(Math.random() * 4)]}.`,
  tags: generateRandomTags(Math.floor(Math.random() * 3) + 1),
  systemInstruction: `Adoptez le ton et le style d'un ${[
    "sage ancien", "capitaine de vaisseau spatial", "artiste culinaire", "enquêteur privé"
  ][Math.floor(Math.random() * 4)]}.`,
  author: getRandomAuthor(),
  isRecommended: getRandomBoolean(),
  createdAt: getRandomDate(),
  isPublic: getRandomBoolean(),
});

const generateContext = (index: number): Omit<ContextItem, "likeCount" | "commentCount"> => ({
  id: `context-${uuidv4()}`,
  title: `Document de Contexte ${index}: ${[
    "Manuel d'Utilisation", "Rapport de Recherche", "Journal Intime", "Recueil de Poèmes", "Spécifications Techniques"
  ][Math.floor(Math.random() * 5)]}`,
  description: `Ce document fournit des informations ${[
    "essentielles pour l'utilisation", "approfondies sur un sujet", "personnelles et introspectives", "techniques détaillées"
  ][Math.floor(Math.random() * 4)]}.`,
  content: `Le contenu du document numéro ${index} est un exemple de texte long et informatif. Il peut inclure des faits, des chiffres, des anecdotes et des instructions.`,
  author: getRandomAuthor(),
  tags: generateRandomTags(Math.floor(Math.random() * 3) + 1),
  isPublic: getRandomBoolean(),
});

// --- GENERATE DATA ---
const NUM_ENTRIES = 120; // Generate more than 100 entries for each type

export const COMMUNITY_PROMPTS: Omit<Prompt, "likeCount" | "commentCount">[] = Array.from({ length: NUM_ENTRIES }, (_, i) => generatePrompt(i + 1));
export const COMMUNITY_AGENTS: Omit<Agent, "likeCount" | "commentCount">[] = Array.from({ length: NUM_ENTRIES }, (_, i) => generateAgent(i + 1));
export const COMMUNITY_PERSONAS: Omit<Persona, "likeCount" | "commentCount">[] = Array.from({ length: NUM_ENTRIES }, (_, i) => generatePersona(i + 1));
export const COMMUNITY_CONTEXTS: Omit<ContextItem, "likeCount" | "commentCount">[] = Array.from({ length: NUM_ENTRIES }, (_, i) => generateContext(i + 1));

// --- USERS (for seeding in index.ts) ---
export const TEST_USERS: Omit<User, "password">[] = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${uuidv4()}`,
  email: `user${i + 1}@example.com`,
  name: `User ${i + 1}`,
  avatarUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
  bio: `Ceci est la biographie de l'utilisateur ${i + 1}.`,
  website: `https://user${i + 1}.com`,
  github: `user${i + 1}`,
}));

// --- COMMENTS (for seeding in index.ts) ---
// These will be generated dynamically in index.ts to link to actual item IDs and user IDs
export const generateTestComments = (items: (Prompt | Agent | Persona | ContextItem)[], users: User[]): Comment[] => {
  const comments: Comment[] = [];
  const possibleComments = [
    "Super idée ! J'adore la façon dont c'est formulé.",
    "Très utile, merci beaucoup !",
    "J'ai essayé et ça a très bien fonctionné.",
    "Peut-on ajouter une option pour X ?",
    "Excellent travail, très clair et concis.",
    "J'ai eu un petit bug avec ça, quelqu'un d'autre ?",
    "C'est exactement ce dont j'avais besoin !",
    "Impressionnant ! Continuez comme ça.",
    "Je n'ai pas compris la partie Y, une explication ?",
    "J'ai hâte de voir les prochaines mises à jour.",
  ];

  items.forEach(item => {
    // Add 0 to 5 comments per item
    const numComments = Math.floor(Math.random() * 6);
    for (let i = 0; i < numComments; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      comments.push({
        id: `comment-${uuidv4()}`,
        itemId: item.id,
        userId: randomUser.id,
        authorName: randomUser.name,
        authorAvatar: randomUser.avatarUrl,
        content: possibleComments[Math.floor(Math.random() * possibleComments.length)],
        createdAt: getRandomDate(),
      });
    }
  });
  return comments;
};