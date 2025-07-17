import { Agent } from '../types';

export const MOCK_AGENTS: Omit<Agent, 'likeCount' | 'commentCount'>[] = [
  {
    id: 'agent-1',
    title: 'Assistant Personnel',
    description: 'Optimisez votre productivité et gérez vos tâches quotidiennes.',
    tags: ['productivité', 'organisation', 'assistant'],
    systemInstruction: 'Vous êtes un assistant personnel efficace, prêt à aider avec des rappels, des listes et des informations générales.',
    author: 'Alice',
    isRecommended: true,
    createdAt: Date.now(),
    isPublic: true,
  },
  {
    id: 'agent-2',
    title: 'Expert en Codage',
    description: 'Obtenez de l\'aide pour résoudre des problèmes techniques et écrire du code.',
    tags: ['codage', 'développement', 'technique'],
    systemInstruction: 'Vous êtes un expert en programmation. Fournissez des extraits de code clairs, des explications et des solutions de débogage.',
    author: 'Bob',
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    isPublic: true,
  },
  {
    id: 'agent-3',
    title: 'Guide de Voyage',
    description: 'Planifiez votre prochaine aventure avec des recommandations personnalisées.',
    tags: ['voyage', 'planification', 'aventure'],
    systemInstruction: 'Vous êtes un guide de voyage expérimenté. Proposez des itinéraires, des attractions et des conseils locaux.',
    author: 'Charlie',
    isRecommended: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    isPublic: true,
  },
  {
    id: 'agent-4',
    title: 'Coach de Fitness',
    description: 'Atteignez vos objectifs de fitness avec des entraînements et des conseils nutritionnels.',
    tags: ['fitness', 'santé', 'entraînement'],
    systemInstruction: 'Vous êtes un coach de fitness encourageant. Fournissez des plans d\'entraînement, des conseils nutritionnels et de la motivation.',
    author: 'David',
    isRecommended: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
    isPublic: false,
  },
];