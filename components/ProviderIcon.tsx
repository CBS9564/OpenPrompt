import React from 'react';
import { LLMProvider } from '../types';
import GeminiIcon from './icons/GeminiIcon';
import OpenAIIcon from './icons/OpenAIIcon';
import AnthropicIcon from './icons/AnthropicIcon';
import GroqIcon from './icons/GroqIcon';
import OllamaIcon from './icons/OllamaIcon';
import { StabilityAIIcon } from './icons/StabilityAIIcon';
import { HuggingFaceIcon } from './icons/HuggingFaceIcon';
import { ElevenLabsIcon } from './icons/ElevenLabsIcon';
import { RunwayMLIcon } from './icons/RunwayMLIcon';
import { CpuChipIcon } from './icons/CpuChipIcon'; // Default icon

interface ProviderIconProps {
  provider: LLMProvider | string;
  className?: string;
}

const ProviderIcon: React.FC<ProviderIconProps> = ({ provider, className = "w-5 h-5" }) => {
  switch (provider) {
    case LLMProvider.GEMINI:
      return <GeminiIcon className={className} />;
    case LLMProvider.OPENAI:
      return <OpenAIIcon className={className} />;
    case LLMProvider.ANTHROPIC:
      return <AnthropicIcon className={className} />;
    case LLMProvider.GROQ:
      return <GroqIcon className={className} />;
    case LLMProvider.OLLAMA:
      return <OllamaIcon className={className} />;
    case LLMProvider.STABILITY:
        return <StabilityAIIcon className={className} />;
    case LLMProvider.HUGGINGFACE:
        return <HuggingFaceIcon className={className} />;
    case LLMProvider.ELEVENLABS:
        return <ElevenLabsIcon className={className} />;
    case LLMProvider.RUNWAYML:
        return <RunwayMLIcon className={className} />;
    default:
      return <CpuChipIcon className={className} />;
  }
};

export default ProviderIcon;
