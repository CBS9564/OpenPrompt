import { Prompt, Agent, Persona, ContextItem } from '../../types';

export const COMMUNITY_PROMPTS: Prompt[] = [
  {
    id: 'p1',
    title: 'Creative Story Starter',
    description: 'Generate an intriguing opening paragraph for a story based on a genre and a key object.',
    tags: ['Creative Writing', 'Storytelling', 'Fiction'],
    text: `Generate an intriguing opening paragraph for a {{genre}} story that involves a {{object}}. Make it mysterious and compelling.

User Input:
Genre: {{genre}}
Object: {{object}}

Your Story Opening:
`,
    category: 'Creative Writing',
    author: 'OpenPrompt Team',
    isRecommended: true,
    isPublic: true,
    supportedInputs: [],
    createdAt: 1672531200000
  },
  {
    id: 'p_json_recipe',
    title: 'Recipe in JSON Format',
    description: 'Create a recipe in JSON format using an image description.',
    tags: ['JSON', 'Cooking', 'Vision'],
    text: `Analyze the following image description of food ingredients and generate a recipe in a valid JSON format. The JSON should include a recipe name, a list of ingredients (with quantities), and a list of instructions.

Image Description:
{{userInput}}

JSON Output:
`,
    category: 'Technical',
    author: 'Google AI Studio',
    isRecommended: true,
    isPublic: true,
    supportedInputs: ['image'],
    createdAt: 1672617600000
  },
  {
    id: 'p_math_worksheet',
    title: 'Math Worksheet Generator',
    description: 'Create a set of math worksheets for teachers and parents.',
    tags: ['Education', 'Math', 'Generation'],
    text: `Create a set of 5 math problems for an elementary school worksheet on the topic of {{topic}}. The problems should be word problems appropriate for {{gradeLevel}} graders.

Topic: {{topic}}
Grade Level: {{gradeLevel}}

Worksheet Problems:
`,
    category: 'Education',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1672704000000
  },
  {
    id: 'p_treasure_hunt',
    title: 'Treasure Hunt',
    description: 'Create a list of treasure hunt concepts.',
    tags: ['Creative', 'Game', 'Lifestyle'],
    text: `Generate 5 creative and fun treasure hunt concepts suitable for {{audience}} in a {{location}} setting. For each concept, provide a theme and a sample first clue.

Target Audience (e.g., kids, adults): {{audience}}
Location (e.g., backyard, city park): {{location}
`,
    category: 'Creative Writing',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1672790400000
  },
  {
    id: 'p_geometry_solver',
    title: 'Geometry Problem Solver',
    description: 'Solve geometry problems based on given parameters.',
    tags: ['Math', 'Geometry', 'Problem Solving'],
    text: `Solve the following geometry problem:

{{problemDescription}}
`,
    category: 'Education',
    author: 'Google AI Studio',
    isPublic: true,
    supportedInputs: [],
    createdAt: 1672876800000
  }
];

export const COMMUNITY_AGENTS: Agent[] = [];
export const COMMUNITY_PERSONAS: Persona[] = [];
export const COMMUNITY_CONTEXTS: ContextItem[] = [];