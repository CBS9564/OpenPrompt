import { LLMProvider } from './types';

export const AVAILABLE_MODELS = {
  [LLMProvider.GEMINI]: [
    'gemini-2.5-flash',
    'gemini-pro',
  ],
  [LLMProvider.ANTHROPIC]: [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  [LLMProvider.GROQ]: [
    'llama3-70b-8192',
    'llama3-8b-8192',
    'mixtral-8x7b-32768',
  ],
  [LLMProvider.OLLAMA]: [
    'llama3',
    'phi3',
    'mistral',
  ],
  [LLMProvider.HUGGINGFACE]: [
    'mistralai/Mistral-7B-Instruct-v0.2',
    'google/gemma-7b',
    'meta-llama/Llama-2-7b-chat-hf',
  ],
};