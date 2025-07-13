export interface Attachment {
  id: string;
  itemId: string;
  name: string;
  type: 'file' | 'url';
  mimeType?: string; // e.g., 'application/pdf', 'image/png', 'text/plain'
  content: string; // URL for 'url' type, base64 for images, text content for others
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  text: string;
  category: string;
  author?: string;
  isRecommended?: boolean;
  createdAt?: number;
  isPublic: boolean;
  supportedInputs?: ('image' | 'audio' | 'video')[];
  likeCount?: number;
  commentCount?: number;
  attachments?: Attachment[];
}

export interface Agent {
  id: string;
  title: string;
  description: string;
  tags: string[];
  systemInstruction: string;
  author?: string;
  isRecommended?: boolean;
  createdAt?: number;
  isPublic: boolean;
  likeCount?: number;
  commentCount?: number;
  attachments?: Attachment[];
}

export interface Persona {
  id:string;
  title: string;
  description: string;
  tags: string[];
  systemInstruction: string;
  author?: string;
  isRecommended?: boolean;
  createdAt?: number;
  isPublic: boolean;
  likeCount?: number;
  commentCount?: number;
  attachments?: Attachment[];
}

export interface ContextItem {
  id: string;
  title: string;
  description: string;
  content: string;
  author?: string;
  tags: string[];
  isPublic: boolean;
}

export type PlaygroundItem =
  | (Prompt & { type: 'prompt' })
  | (Agent & { type: 'agent' })
  | (Persona & { type: 'persona' });


export enum View {
  HOME = 'home',
  PROMPTS = 'prompts',
  AGENTS = 'agents',
  PERSONAS = 'personas',
  CONTEXTS = 'contexts',
  CREATE = 'create',
  MY_PROMPTS = 'my_prompts',
  MY_AGENTS = 'my_agents',
  MY_PERSONAS = 'my_personas',
  MY_CONTEXTS = 'my_contexts',
  PROFILE = 'profile',
}

export enum LLMProvider {
  GEMINI = 'gemini',
  ANTHROPIC = 'anthropic',
  GROQ = 'groq',
  OLLAMA = 'ollama',
  HUGGINGFACE = 'huggingface',
}

export interface OllamaCredentials {
  baseUrl: string;
  model?: string;
}

export interface ApiKeys {
  [LLMProvider.GEMINI]?: string;
  [LLMProvider.ANTHROPIC]?: string;
  [LLMProvider.GROQ]?: string;
  [LLMProvider.OLLAMA]?: OllamaCredentials;
  [LLMProvider.HUGGINGFACE]?: string;
  openai?: string; // For DALL-E or other OpenAI services
  elevenlabs?: string; // For ElevenLabs text-to-speech
  stabilityai?: string; // For Stability AI image generation
  runwayml?: string; // For RunwayML video generation
}

export interface User {
  name: string;
  email: string; // This is the unique identifier
  avatarUrl?: string;
  bio?: string;
  website?: string;
  github?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (provider: 'email' | 'google' | 'github', email?: string) => void;
  logout: () => void;
  updateUserProfile: (newProfileData: Partial<User>) => void;
}

export interface PublishableItem {
  type: 'prompt' | 'agent' | 'persona' | 'context';
  title: string;
  description: string;
  tags: string[];
  content: string;
  isPublic: boolean;
  category?: string;
  attachments: Omit<Attachment, 'id' | 'itemId'>[];
}

export type SortOrder = 'recommended' | 'recent';

export type MultimodalFilter = 'all' | 'image' | 'audio' | 'video';

export interface Comment {
    id: string;
    itemId: string;
    userId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt: number;
}

export interface DetailPageProps {
  item: PlaygroundItem;
  onUpdate: (item: PlaygroundItem) => void;
  onDelete: (item: PlaygroundItem) => void;
  onBack: () => void;
  apiKeys: ApiKeys;
  fetchedOllamaModels: string[];
  contexts: ContextItem[];
  comments: Comment[];
  isLiked: boolean;
  onToggleLike: (itemId: string, isCurrentlyLiked: boolean) => void;
  onAddComment: (itemId: string, content: string) => void;
}

export interface HomePageProps {
  onViewChange: (view: View) => void;
  user: User | null;
  onNavigateToDetail: (id: string, type: 'prompt' | 'agent' | 'persona') => void;
  login: (provider: 'email' | 'google' | 'github', email?: string) => void;
}