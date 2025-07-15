
import React, { useState } from 'react';
import { ApiKeys, LLMProvider } from '../types';
import { AVAILABLE_MODELS } from '../constants';
import { OllamaIcon } from './icons/OllamaIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { GeminiIcon } from './icons/GeminiIcon';
import { AnthropicIcon } from './icons/AnthropicIcon';
import { GroqIcon } from './icons/GroqIcon';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { ElevenLabsIcon } from './icons/ElevenLabsIcon';
import { ImageIcon } from './icons/ImageIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { HuggingFaceIcon } from './icons/HuggingFaceIcon';
import { StabilityAIIcon } from './icons/StabilityAIIcon';
import { RunwayMLIcon } from './icons/RunwayMLIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';

interface SettingsModalProps {
  apiKeys: ApiKeys;
  onClose: () => void;
  onSave: (apiKeys: ApiKeys) => void;
  onFetchOllamaModels: () => Promise<{ success: boolean; message: string; models?: string[] }>;
  fetchedOllamaModels: string[];
  selectedLLMProvider: LLMProvider;
  selectedLLMModel: string | null;
  onSaveLLMSettings: (provider: LLMProvider, model: string | null) => void;
}

type SettingsTab = 'gemini' | 'anthropic' | 'groq' | 'ollama' | 'huggingface' | 'openai' | 'elevenlabs' | 'stabilityai' | 'runwayml';

const SettingsModal: React.FC<SettingsModalProps> = ({ apiKeys: initialApiKeys, onClose, onSave, onFetchOllamaModels, fetchedOllamaModels, selectedLLMProvider: initialLLMProvider, selectedLLMModel: initialLLMModel, onSaveLLMSettings }) => {
  const [localApiKeys, setLocalApiKeys] = useState<ApiKeys>(initialApiKeys);
  const [activeTab, setActiveTab] = useState<SettingsTab>('gemini');
  const [localSelectedLLMProvider, setLocalSelectedLLMProvider] = useState<LLMProvider>(initialLLMProvider);
  const [localSelectedLLMModel, setLocalSelectedLLMModel] = useState<string | null>(initialLLMModel);

  // Ollama specific state
  const [fetchStatus, setFetchStatus] = useState<{ loading: boolean; message: string | null; success: boolean; }>({ loading: false, message: null, success: false });
  const [availableOllamaModels, setAvailableOllamaModels] = useState<string[]>(fetchedOllamaModels);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localApiKeys);
    onSaveLLMSettings(localSelectedLLMProvider, localSelectedLLMModel);
  };
  
  const handleSimpleKeyChange = (provider: 'gemini' | 'anthropic' | 'groq' | 'openai' | 'elevenlabs' | 'huggingface' | 'stabilityai' | 'runwayml', value: string) => {
    setLocalApiKeys(prev => ({
        ...prev,
        [provider]: value,
    }));
  };

  const handleOllamaChange = (field: 'baseUrl' | 'model', value: string) => {
    setLocalApiKeys(prev => ({
        ...prev,
        [LLMProvider.OLLAMA]: {
            baseUrl: prev.ollama?.baseUrl || '',
            model: prev.ollama?.model || '',
            [field]: value,
        },
    }));
  };

  const handleFetchClick = async () => {
    setFetchStatus({ loading: true, message: 'Loading models...', success: false });
    const result = await onFetchOllamaModels();
    setFetchStatus({ loading: false, message: result.message, success: result.success });
    if (result.success && result.models) {
      setAvailableOllamaModels(result.models);
      if (!localApiKeys.ollama?.model && result.models.length > 0) {
        handleOllamaChange('model', result.models[0]);
      }
    }
  };
  
  const TabButton: React.FC<{tab: SettingsTab, label: string, icon: React.ReactNode}> = ({tab, label, icon}) => {
      const isActive = activeTab === tab;
      return (
         <button
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
              isActive ? 'bg-accent/10 text-accent' : 'text-secondary hover:bg-card-hover hover:text-primary'
            }`}
          >
            {icon}
            {label}
        </button>
      )
  }
  
  const selectClasses = "w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary capitalize";

  const ApiKeyInput: React.FC<{
      provider: 'gemini' | 'anthropic' | 'groq' | 'openai' | 'elevenlabs' | 'huggingface' | 'stabilityai' | 'runwayml',
      title: string,
      description: string,
      icon: React.ReactNode
  }> = ({ provider, title, description, icon }) => {
    const value = localApiKeys[provider] || '';
    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                {React.cloneElement(icon as any, { className: 'w-8 h-8 text-secondary' })}
                <div>
                    <h3 className="text-xl font-bold text-primary">{title}</h3>
                    <p className="text-sm text-secondary mt-1">{description}</p>
                </div>
            </div>
            <div className="space-y-2">
                 <label htmlFor={`${provider}-key`} className="text-sm font-medium text-primary">API Key</label>
                 <input
                  id={`${provider}-key`}
                  type="password"
                  value={value}
                  onChange={(e) => handleSimpleKeyChange(provider, e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                />
            </div>
        </div>
    )
  }

  const renderContent = () => {
      switch(activeTab) {
          case 'gemini':
            return <ApiKeyInput provider="gemini" title="Google Gemini" description="API key for Gemini models. You can get one from Google AI Studio." icon={<GeminiIcon />} />
          case 'anthropic':
            return <ApiKeyInput provider="anthropic" title="Anthropic" description="API key for Claude models." icon={<AnthropicIcon />} />
          case 'groq':
            return <ApiKeyInput provider="groq" title="Groq" description="API key for Groq's LPU Inference Engine." icon={<GroqIcon />} />
          case 'huggingface':
            return <ApiKeyInput provider="huggingface" title="Hugging Face" description="API key for the Inference API." icon={<HuggingFaceIcon />} />
          case 'openai':
            return <ApiKeyInput provider="openai" title="OpenAI" description="API key for services like DALL-E." icon={<OpenAIIcon />} />
          case 'elevenlabs':
            return <ApiKeyInput provider="elevenlabs" title="ElevenLabs" description="API key for voice generation." icon={<ElevenLabsIcon />} />
          case 'stabilityai':
            return <ApiKeyInput provider="stabilityai" title="Stability AI" description="API key for Stable Diffusion models." icon={<StabilityAIIcon />} />
          case 'runwayml':
            return <ApiKeyInput provider="runwayml" title="RunwayML" description="API key for video generation models." icon={<RunwayMLIcon />} />
          case 'ollama':
            return (
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <OllamaIcon className="w-8 h-8 text-secondary" />
                        <div>
                            <h3 className="text-xl font-bold text-primary">Ollama Settings</h3>
                            <p className="text-sm text-secondary mt-1">Configure your local Ollama server connection.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="ollama-url" className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                                Ollama Base URL
                            </label>
                            <p className="text-xs text-secondary mb-3">
                                The URL of your local Ollama server, e.g., http://localhost:11434
                            </p>
                            <input
                              id="ollama-url"
                              type="url"
                              value={localApiKeys.ollama?.baseUrl || ''}
                              onChange={(e) => handleOllamaChange('baseUrl', e.target.value)}
                              placeholder="http://localhost:11434"
                              className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                            />
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={handleFetchClick}
                                    disabled={fetchStatus.loading || !localApiKeys.ollama?.baseUrl}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card text-primary font-semibold rounded-md disabled:bg-card-hover disabled:text-secondary disabled:cursor-not-allowed hover:bg-card-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-content focus:ring-accent"
                                >
                                   {fetchStatus.loading ? (
                                        <>
                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading...
                                        </>
                                   ) : "Load Available Models"}
                                </button>
                                {fetchStatus.message && (
                                    <p className={`mt-2 text-xs text-center ${fetchStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                                        {fetchStatus.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        {availableOllamaModels.length > 0 && (
                             <div>
                                <label htmlFor="ollama-model-select" className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                                    <CpuChipIcon className="w-5 h-5 text-secondary"/>
                                    Default Model <span className="text-secondary">(Optional)</span>
                                </label>
                                <p className="text-xs text-secondary mb-3">
                                    Select a default model after loading them from your server.
                                </p>
                                <select
                                  id="ollama-model-select"
                                  value={localApiKeys.ollama?.model || ''}
                                  onChange={(e) => handleOllamaChange('model', e.target.value)}
                                  className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                                >
                                  <option value="">-- No Default Model --</option>
                                  {availableOllamaModels.map(model => (
                                      <option key={model} value={model}>{model}</option>
                                  ))}
                                </select>
                             </div>
                        )}
                     </div>
                </div>
            )
      }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-content border border-border rounded-lg shadow-xl w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <div className="flex">
                <nav className="w-1/3 p-4 border-r border-border space-y-4">
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Default LLM Settings</h3>
                        <div className="space-y-1">
                            <label htmlFor="llm-provider-select" className="block text-sm font-medium text-primary mb-2">Default LLM Provider</label>
                            <select
                                id="llm-provider-select"
                                value={localSelectedLLMProvider}
                                onChange={(e) => setLocalSelectedLLMProvider(e.target.value as LLMProvider)}
                                className={selectClasses}
                            >
                                {Object.values(LLMProvider).map(provider => (
                                    <option key={provider} value={provider}>{provider}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1 mt-4">
                            <label htmlFor="llm-model-select" className="block text-sm font-medium text-primary mb-2">Default LLM Model</label>
                            <select
                                id="llm-model-select"
                                value={localSelectedLLMModel || ''}
                                onChange={(e) => setLocalSelectedLLMModel(e.target.value || null)}
                                className={selectClasses}
                                disabled={localSelectedLLMProvider === LLMProvider.OLLAMA && availableOllamaModels.length === 0}
                            >
                                <option value="">-- Select a Model --</option>
                                {(localSelectedLLMProvider === LLMProvider.OLLAMA ? availableOllamaModels : AVAILABLE_MODELS[localSelectedLLMProvider] || []).map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Text Models</h3>
                         <div className="space-y-1">
                            <TabButton tab="gemini" label="Gemini" icon={<GeminiIcon className="w-5 h-5" />} />
                            <TabButton tab="anthropic" label="Anthropic" icon={<AnthropicIcon className="w-5 h-5" />} />
                            <TabButton tab="groq" label="Groq" icon={<GroqIcon className="w-5 h-5" />} />
                            <TabButton tab="huggingface" label="Hugging Face" icon={<HuggingFaceIcon className="w-5 h-5" />} />
                            <TabButton tab="ollama" label="Ollama" icon={<OllamaIcon className="w-5 h-5" />} />
                         </div>
                    </div>
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Other Services</h3>
                        <div className="space-y-1">
                            <TabButton tab="openai" label="OpenAI (Image)" icon={<ImageIcon className="w-5 h-5" />} />
                            <TabButton tab="stabilityai" label="Stability AI (Image)" icon={<StabilityAIIcon className="w-5 h-5" />} />
                            <TabButton tab="elevenlabs" label="ElevenLabs (Voice)" icon={<MicrophoneIcon className="w-5 h-5" />} />
                            <TabButton tab="runwayml" label="RunwayML (Video)" icon={<VideoCameraIcon className="w-5 h-5" />} />
                        </div>
                    </div>
                </nav>
                <div className="w-2/3 p-6 min-h-[400px]">
                    {renderContent()}
                </div>
            </div>
          
          <div className="p-4 bg-background border-t border-border flex justify-end gap-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-card border border-border text-primary font-semibold rounded-md hover:bg-card-hover transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition-colors">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;

