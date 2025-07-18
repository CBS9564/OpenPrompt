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

// --- GENERATE REALISTIC DATA ---
const NUM_ENTRIES = 10; // Limite à 10 entrées pour chaque type

export const COMMUNITY_PROMPTS: Omit<Prompt, "likeCount" | "commentCount">[] = [
  {
    id: `prompt-${uuidv4()}`,
    title: "Générateur d'Idées de Start-up",
    description: "Un prompt pour brainstormer des idées de start-up innovantes basées sur des tendances actuelles.",
    tags: ["business", "innovation", "créativité", "start-up"],
    text: `Génère 5 idées de start-up innovantes dans le domaine de {{domaine}} en tenant compte de la tendance {{tendance}}.`,
    category: "Business",
    author: "Alice",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Rédacteur d'Articles de Blog SEO",
    description: "Crée des articles de blog optimisés pour le SEO sur n'importe quel sujet.",
    tags: ["rédaction", "SEO", "marketing", "contenu"],
    text: `Rédige un article de blog de 800 mots sur le sujet {{sujet}} avec les mots-clés SEO suivants : {{mots_cles}}. Le ton doit être {{ton}}.`,
    category: "Marketing",
    author: "Bob",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Assistant de Code Python",
    description: "Aide à écrire, déboguer et optimiser du code Python.",
    tags: ["codage", "python", "développement", "tech"],
    text: `Écris une fonction Python qui {{description_fonction}}. Inclue des commentaires et des exemples d'utilisation.`,
    category: "Développement",
    author: "Charlie",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Planificateur de Repas Sains",
    description: "Génère des plans de repas équilibrés et personnalisés pour la semaine.",
    tags: ["santé", "nutrition", "cuisine", "bien-être"],
    text: `Crée un plan de repas pour {{nombre_jours}} jours pour une personne {{type_regime}} avec {{nombre_calories}} calories par jour. Inclue des options pour le petit-déjeuner, le déjeuner et le dîner.`,
    category: "Style de vie",
    author: "David",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Scénariste de Vidéos YouTube",
    description: "Écrit des scripts engageants pour des vidéos YouTube sur divers sujets.",
    tags: ["vidéo", "créativité", "divertissement", "écriture"],
    text: `Rédige un script pour une vidéo YouTube de {{duree}} minutes sur le sujet {{sujet}}. Le script doit inclure une introduction, trois points principaux et une conclusion avec un appel à l'action.`,
    category: "Divertissement",
    author: "Eve",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Traducteur Multilingue",
    description: "Traduit des textes entre différentes langues avec précision et fluidité.",
    tags: ["langues", "traduction", "éducation"],
    text: `Traduis le texte suivant de {{langue_source}} à {{langue_cible}} : "{{texte_a_traduire}}".`,
    category: "Éducation",
    author: "Frank",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Générateur de Noms de Marques",
    description: "Propose des noms de marques créatifs et mémorables pour de nouvelles entreprises ou produits.",
    tags: ["business", "créativité", "branding"],
    text: `Génère 10 noms de marques pour une entreprise de {{secteur}} qui évoquent {{caractéristique_principale}}.`,
    category: "Business",
    author: "Grace",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Conseiller en Carrière",
    description: "Offre des conseils personnalisés pour l'évolution de carrière et la recherche d'emploi.",
    tags: ["carrière", "emploi", "développement_personnel"],
    text: `Donne des conseils pour améliorer mon CV et ma lettre de motivation pour un poste de {{poste}} dans le secteur {{secteur}}.`,
    category: "Carrière",
    author: "Heidi",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Créateur de Recettes de Cocktails",
    description: "Invente des recettes de cocktails uniques basées sur les ingrédients disponibles.",
    tags: ["cuisine", "boissons", "créativité", "divertissement"],
    text: `Crée une recette de cocktail avec les ingrédients suivants : {{ingredients}}. Le cocktail doit être {{type_cocktail}}.`,
    category: "Divertissement",
    author: "Ivan",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    isPublic: true,
    supportedInputs: [],
  },
  {
    id: `prompt-${uuidv4()}`,
    title: "Assistant de Planification d'Événements",
    description: "Aide à organiser et planifier divers types d'événements.",
    tags: ["événement", "organisation", "planification"],
    text: `Planifie un événement de {{type_evenement}} pour {{nombre_personnes}} personnes. Inclue une liste de tâches, un budget estimatif et des suggestions de lieu.`,
    category: "Style de vie",
    author: "Judy",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    isPublic: true,
    supportedInputs: [],
  },
];

export const COMMUNITY_AGENTS: Omit<Agent, "likeCount" | "commentCount">[] = [
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Support Client IA",
    description: "Un agent IA pour gérer les requêtes de support client et fournir des réponses rapides.",
    tags: ["support", "client", "IA", "service"],
    systemInstruction: `Vous êtes un agent de support client amical et efficace. Répondez aux questions des utilisateurs avec clarté et aidez-les à résoudre leurs problèmes.`,
    author: "Alice",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Vente Virtuel",
    description: "Un agent pour assister les clients dans leurs achats et recommander des produits.",
    tags: ["vente", "e-commerce", "conseil", "produit"],
    systemInstruction: `Vous êtes un agent de vente virtuel. Aidez les clients à trouver les produits qui leur conviennent, répondez à leurs questions et facilitez le processus d'achat.`,
    author: "Bob",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Recrutement IA",
    description: "Un agent pour présélectionner les candidats et répondre aux questions sur les postes vacants.",
    tags: ["recrutement", "RH", "emploi", "IA"],
    systemInstruction: `Vous êtes un agent de recrutement. Interagissez avec les candidats, répondez à leurs questions sur les offres d'emploi et collectez les informations pertinentes pour la présélection.`,
    author: "Charlie",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Gestion de Projet",
    description: "Un agent pour aider à la planification, au suivi et à l'exécution des projets.",
    tags: ["projet", "gestion", "organisation", "productivité"],
    systemInstruction: `Vous êtes un agent de gestion de projet. Aidez les équipes à organiser leurs tâches, à suivre les progrès et à identifier les obstacles pour assurer la réussite du projet.`,
    author: "David",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Création de Contenu",
    description: "Un agent pour générer des idées de contenu, des titres et des ébauches d'articles.",
    tags: ["contenu", "création", "marketing", "écriture"],
    systemInstruction: `Vous êtes un agent de création de contenu. Proposez des idées originales, des titres accrocheurs et des structures pour divers types de contenu (articles, posts sociaux, scripts).`,
    author: "Eve",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Traduction Instantanée",
    description: "Un agent pour traduire des conversations en temps réel entre différentes langues.",
    tags: ["traduction", "langues", "communication", "temps_réel"],
    systemInstruction: `Vous êtes un agent de traduction instantanée. Traduisez les propos des utilisateurs avec précision et fluidité pour faciliter la communication multilingue.`,
    author: "Frank",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Réservation de Voyages",
    description: "Un agent pour trouver et réserver des vols, hôtels et activités de voyage.",
    tags: ["voyage", "réservation", "planification", "tourisme"],
    systemInstruction: `Vous êtes un agent de réservation de voyages. Aidez les utilisateurs à trouver les meilleures offres de vols et d'hôtels, et à planifier leurs itinéraires de voyage.`,
    author: "Grace",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Recommandation de Films",
    description: "Un agent pour suggérer des films et séries basés sur les préférences de l'utilisateur.",
    tags: ["divertissement", "films", "séries", "recommandation"],
    systemInstruction: `Vous êtes un agent de recommandation de films. Proposez des films et séries qui correspondent aux goûts des utilisateurs, en tenant compte de leurs genres préférés et de leur historique de visionnage.`,
    author: "Heidi",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent de Suivi de Santé",
    description: "Un agent pour enregistrer et analyser les données de santé et de bien-être.",
    tags: ["santé", "bien-être", "données", "suivi"],
    systemInstruction: `Vous êtes un agent de suivi de santé. Enregistrez les données de santé des utilisateurs (sommeil, activité, alimentation) et fournissez des analyses et des conseils pour améliorer leur bien-être.`,
    author: "Ivan",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    isPublic: true,
  },
  {
    id: `agent-${uuidv4()}`,
    title: "Agent d'Apprentissage Personnalisé",
    description: "Un agent pour créer des parcours d'apprentissage personnalisés et interactifs.",
    tags: ["éducation", "apprentissage", "personnalisé", "formation"],
    systemInstruction: `Vous êtes un agent d'apprentissage personnalisé. Concevez des modules d'apprentissage adaptés aux besoins et au rythme de chaque utilisateur, en proposant des exercices et des ressources pertinentes.`,
    author: "Judy",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    isPublic: true,
  },
];

export const COMMUNITY_PERSONAS: Omit<Persona, "likeCount" | "commentCount">[] = [
  {
    id: `persona-${uuidv4()}`,
    title: "Le Sage Ancien",
    description: "Une persona qui parle avec la sagesse et la profondeur d'un philosophe antique.",
    tags: ["sagesse", "philosophie", "ancien", "réflexion"],
    systemInstruction: `Adoptez le ton et le style d'un sage ancien, utilisant des métaphores et des analogies pour transmettre des vérités profondes.`,
    author: "Alice",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "L'Explorateur Spatial",
    description: "Une persona aventureuse et curieuse, toujours prête à découvrir de nouveaux horizons.",
    tags: ["aventure", "espace", "science-fiction", "exploration"],
    systemInstruction: `Parlez comme un explorateur spatial, avec un sens de l'émerveillement et une soif de découverte, décrivant des mondes lointains et des technologies futuristes.`,
    author: "Bob",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "Le Chef Cuisinier Excentrique",
    description: "Une persona passionnée par la cuisine, avec un sens de l'humour décalé et des idées culinaires audacieuses.",
    tags: ["cuisine", "humour", "créativité", "gastronomie"],
    systemInstruction: `Exprimez-vous comme un chef cuisinier excentrique, avec des descriptions vivantes de saveurs et des anecdotes amusantes sur la nourriture.`,
    author: "Charlie",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "Le Détective Cynique",
    description: "Une persona observatrice et sarcastique, avec un esprit aiguisé pour résoudre les mystères.",
    tags: ["mystère", "détective", "cynisme", "logique"],
    systemInstruction: `Adoptez le ton d'un détective cynique, avec des observations perspicaces, des répliques mordantes et une approche pragmatique des problèmes.`,
    author: "David",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "Le Robot Optimiste",
    description: "Une persona robotique avec une vision positive du monde et une logique implacable.",
    tags: ["robot", "optimisme", "futur", "technologie"],
    systemInstruction: `Parlez comme un robot optimiste, avec une voix monotone mais des messages encourageants et une logique irréprochable.`,
    author: "Eve",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "L'Artiste Rêveur",
    description: "Une persona créative et imaginative, inspirée par l'art et la beauté du monde.",
    tags: ["art", "créativité", "imagination", "beauté"],
    systemInstruction: `Exprimez-vous comme un artiste rêveur, avec des descriptions poétiques, des métaphores visuelles et une sensibilité aux émotions.`,
    author: "Frank",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "Le Scientifique Rigoureux",
    description: "Une persona logique et analytique, passionnée par la recherche et la découverte.",
    tags: ["science", "logique", "recherche", "analyse"],
    systemInstruction: `Adoptez le ton d'un scientifique rigoureux, avec des explications claires, des faits précis et une approche méthodique des problèmes.`,
    author: "Grace",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "Le Conteur de Légendes",
    description: "Une persona mystérieuse et captivante, qui raconte des histoires épiques et des mythes anciens.",
    tags: ["histoire", "légende", "mythe", "narration"],
    systemInstruction: `Parlez comme un conteur de légendes, avec une voix envoûtante, des récits épiques et une capacité à transporter l'auditeur dans des mondes imaginaires.`,
    author: "Heidi",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "Le Coach Motivateur",
    description: "Une persona énergique et inspirante, qui encourage les autres à atteindre leurs objectifs.",
    tags: ["motivation", "coach", "développement_personnel", "inspiration"],
    systemInstruction: `Exprimez-vous comme un coach motivateur, avec des messages positifs, des encouragements et des conseils pratiques pour surmonter les défis.`,
    author: "Ivan",
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    isPublic: true,
  },
  {
    id: `persona-${uuidv4()}`,
    title: "Le Critique Gastronomique",
    description: "Une persona exigeante et raffinée, qui évalue la cuisine avec un palais averti.",
    tags: ["cuisine", "critique", "gastronomie", "évaluation"],
    systemInstruction: `Adoptez le ton d'un critique gastronomique, avec des descriptions détaillées des saveurs, des textures et des présentations, et un jugement éclairé sur la qualité des plats.`,
    author: "Judy",
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    isPublic: true,
  },
];

export const COMMUNITY_CONTEXTS: Omit<ContextItem, "likeCount" | "commentCount">[] = [
  {
    id: `context-${uuidv4()}`,
    title: "Manuel d'Utilisation du Logiciel X",
    description: "Un guide complet pour l'utilisation du logiciel X, incluant des tutoriels et des FAQ.",
    content: `Ce manuel d'utilisation détaillé couvre toutes les fonctionnalités du logiciel X, de l'installation à l'utilisation avancée. Il contient des instructions étape par étape, des captures d'écran et une section de dépannage.`,
    author: "Alice",
    tags: ["logiciel", "manuel", "tutoriel", "aide"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Rapport Annuel de Tendance Technologique",
    description: "Un rapport analysant les principales tendances technologiques de l'année et leurs impacts.",
    content: `Ce rapport annuel présente une analyse approfondie des tendances technologiques émergentes, telles que l'IA générative, la blockchain et l'informatique quantique. Il examine leurs implications pour l'industrie et la société.`,
    author: "Bob",
    tags: ["tech", "rapport", "tendance", "analyse"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Recueil de Poèmes Modernes",
    description: "Une collection de poèmes contemporains explorant des thèmes variés.",
    content: `Ce recueil rassemble des poèmes modernes qui abordent des thèmes tels que l'amour, la nature, la solitude et l'espoir. Chaque poème offre une perspective unique et une expression artistique.`,
    author: "Charlie",
    tags: ["poésie", "littérature", "art", "créativité"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Guide de Survie en Milieu Sauvage",
    description: "Un guide pratique pour survivre dans des environnements naturels hostiles.",
    content: `Ce guide de survie fournit des conseils essentiels pour faire face aux situations d'urgence en milieu sauvage. Il couvre des sujets comme la construction d'abris, la recherche de nourriture et d'eau, et les premiers secours.`,
    author: "David",
    tags: ["survie", "nature", "aventure", "pratique"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Histoire de l'Art de la Renaissance",
    description: "Un aperçu détaillé de l'art de la Renaissance, de ses origines à ses chefs-d'œuvre.",
    content: `Ce document explore l'histoire de l'art de la Renaissance, en mettant en lumière les artistes majeurs, les mouvements clés et les œuvres emblématiques. Il analyse l'impact de cette période sur l'art occidental.`,
    author: "Eve",
    tags: ["art", "histoire", "renaissance", "culture"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Spécifications Techniques du Projet Alpha",
    description: "Un document détaillant les exigences techniques et l'architecture du projet Alpha.",
    content: `Ce document de spécifications techniques décrit en détail les exigences fonctionnelles et non fonctionnelles du projet Alpha. Il inclut l'architecture du système, les interfaces et les contraintes techniques.`,
    author: "Frank",
    tags: ["tech", "projet", "spécifications", "ingénierie"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Recueil de Contes pour Enfants",
    description: "Une collection de contes courts et éducatifs pour les jeunes lecteurs.",
    content: `Ce recueil propose des contes pour enfants avec des morales simples et des personnages attachants. Chaque histoire est conçue pour divertir et enseigner des valeurs importantes.`,
    author: "Grace",
    tags: ["enfants", "contes", "éducation", "lecture"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Guide de Jardinage Biologique",
    description: "Un guide pratique pour cultiver un jardin biologique et durable.",
    content: `Ce guide de jardinage biologique offre des conseils pour cultiver des légumes, des fruits et des herbes sans produits chimiques. Il couvre la préparation du sol, la rotation des cultures et la lutte contre les parasites naturels.`,
    author: "Heidi",
    tags: ["jardinage", "biologique", "nature", "écologie"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Introduction à la Psychologie Cognitive",
    description: "Un aperçu des principes fondamentaux de la psychologie cognitive.",
    content: `Ce document présente une introduction à la psychologie cognitive, explorant des sujets tels que la mémoire, l'attention, la perception et la résolution de problèmes. Il fournit une base pour comprendre le fonctionnement de l'esprit humain.`,
    author: "Ivan",
    tags: ["psychologie", "cognition", "science", "éducation"],
    isPublic: true,
  },
  {
    id: `context-${uuidv4()}`,
    title: "Livre de Recettes du Monde",
    description: "Une collection de recettes authentiques de différentes cuisines du monde.",
    content: `Ce livre de recettes propose un voyage culinaire autour du monde, avec des plats traditionnels de diverses cultures. Chaque recette est accompagnée d'instructions claires et de suggestions d'ingrédients.`,
    author: "Judy",
    tags: ["cuisine", "recettes", "monde", "gastronomie"],
    isPublic: true,
  },
];

// --- USERS (for seeding in index.ts) ---
export const TEST_USERS: Omit<User, "password">[] = [
  {
    id: `user-${uuidv4()}`,
    email: "alice.smith@example.com",
    name: "Alice Smith",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Passionnée par l'IA et le développement web. J'aime créer des solutions innovantes.",
    website: "https://alicesmith.com",
    github: "alicesmith",
  },
  {
    id: `user-${uuidv4()}`,
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    bio: "Expert en science des données et apprentissage automatique. Toujours à la recherche de nouveaux défis.",
    website: "https://bobjohnson.dev",
    github: "bobjohnson",
  },
  {
    id: `user-${uuidv4()}`,
    email: "charlie.brown@example.com",
    name: "Charlie Brown",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    bio: "Designer UX/UI avec un œil pour l'esthétique et l'expérience utilisateur.",
    website: "https://charliebrown.design",
    github: "charliebrown",
  },
  {
    id: `user-${uuidv4()}`,
    email: "david.wilson@example.com",
    name: "David Wilson",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    bio: "Développeur full-stack avec une expertise en Node.js et React.",
    website: "https://davidwilson.tech",
    github: "davidwilson",
  },
  {
    id: `user-${uuidv4()}`,
    email: "eve.davis@example.com",
    name: "Eve Davis",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    bio: "Spécialiste en marketing digital et stratégie de contenu. J'aide les entreprises à grandir en ligne.",
    website: "https://evedavis.marketing",
    github: "evedavis",
  },
  {
    id: `user-${uuidv4()}`,
    email: "frank.miller@example.com",
    name: "Frank Miller",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
    bio: "Ingénieur DevOps passionné par l'automatisation et l'infrastructure cloud.",
    website: "https://frankmiller.cloud",
    github: "frankmiller",
  },
  {
    id: `user-${uuidv4()}`,
    email: "grace.taylor@example.com",
    name: "Grace Taylor",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
    bio: "Chef de projet expérimentée avec une forte capacité à diriger des équipes et à livrer des projets complexes.",
    website: "https://gracetaylor.pm",
    github: "gracetaylor",
  },
  {
    id: `user-${uuidv4()}`,
    email: "heidi.moore@example.com",
    name: "Heidi Moore",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    bio: "Analyste financier avec une expertise en investissement et gestion de portefeuille.",
    website: "https://heidimoore.finance",
    github: "heidimoore",
  },
  {
    id: `user-${uuidv4()}`,
    email: "ivan.jackson@example.com",
    name: "Ivan Jackson",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    bio: "Chercheur en intelligence artificielle, spécialisé dans le traitement du langage naturel.",
    website: "https://ivanjackson.ai",
    github: "ivanjackson",
  },
  {
    id: `user-${uuidv4()}`,
    email: "judy.white@example.com",
    name: "Judy White",
    avatarUrl: "https://i.pravatar.cc/150?img=10",
    bio: "Éducatrice et créatrice de contenu pédagogique. J'aime rendre l'apprentissage amusant et accessible.",
    website: "https://judywhite.education",
    github: "judywhite",
  },
];

// --- COMMENTS (for seeding in index.ts) ---
// These will be generated dynamically in index.ts to link to actual item IDs and user IDs
export const generateTestComments = (items: (Prompt | Agent | Persona | ContextItem)[], users: User[]): Comment[] => {
  const comments: Comment[] = [];
  const possibleComments = [
    "C'est une excellente ressource, très bien structurée !",
    "J'ai trouvé ça incroyablement utile pour mon projet. Merci !",
    "La description est très claire, j'apprécie la précision.",
    "Serait-il possible d'ajouter un exemple d'utilisation plus complexe ?",
    "J'ai rencontré un petit souci en l'utilisant, est-ce que quelqu'un d'autre a eu ce problème ?",
    "Absolument génial ! Ça m'a fait gagner un temps fou.",
    "Le concept est très innovant, bravo à l'auteur !",
    "Je n'arrive pas à le faire fonctionner comme prévu, une aide serait la bienvenue.",
    "J'adore la façon dont les tags sont utilisés, ça facilite la recherche.",
    "Hâte de voir les futures mises à jour, le potentiel est énorme !",
    "Très pertinent pour mon domaine d'activité, je recommande vivement.",
    "La qualité du contenu est top, continuez comme ça !",
    "Petite suggestion : peut-être un tutoriel vidéo pour les débutants ?",
    "C'est exactement ce que je cherchais, merci d'avoir partagé !",
    "Impressionné par la profondeur des informations fournies.",
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