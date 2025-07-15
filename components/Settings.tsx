import React, { useState, useEffect } from 'react';
import { ApiKeys, OllamaCredentials } from '../types';

interface SettingsProps {
  apiKeys: ApiKeys;
  onSave: (keys: ApiKeys) => void;
  fetchedOllamaModels: string[];
  onFetchOllamaModels: () => Promise<{ success: boolean; message: string; models?: string[] }>;
}

const Settings: React.FC<SettingsProps> = ({ apiKeys, onSave, fetchedOllamaModels, onFetchOllamaModels }) => {
  const [geminiKey, setGeminiKey] = useState(apiKeys.gemini || '');
  const [anthropicKey, setAnthropicKey] = useState(apiKeys.anthropic || '');
  const [groqKey, setGroqKey] = useState(apiKeys.groq || '');
  const [huggingfaceKey, setHuggingfaceKey] = useState(apiKeys.huggingface || '');
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState(apiKeys.ollama?.baseUrl || '');
  const [ollamaModel, setOllamaModel] = useState(apiKeys.ollama?.model || '');
  const [ollamaFetchStatus, setOllamaFetchStatus] = useState('');

  useEffect(() => {
    setGeminiKey(apiKeys.gemini || '');
    setAnthropicKey(apiKeys.anthropic || '');
    setGroqKey(apiKeys.groq || '');
    setHuggingfaceKey(apiKeys.huggingface || '');
    setOllamaBaseUrl(apiKeys.ollama?.baseUrl || '');
    setOllamaModel(apiKeys.ollama?.model || '');
  }, [apiKeys]);

  const handleSave = () => {
    const newKeys: ApiKeys = {
      gemini: geminiKey || undefined,
      anthropic: anthropicKey || undefined,
      groq: groqKey || undefined,
      huggingface: huggingfaceKey || undefined,
      ollama: ollamaBaseUrl ? { baseUrl: ollamaBaseUrl, model: ollamaModel || undefined } : undefined,
    };
    onSave(newKeys);
  };

  const handleFetchOllama = async () => {
    setOllamaFetchStatus('Fetching models...');
    const result = await onFetchOllamaModels();
    if (result.success) {
      setOllamaFetchStatus(result.message);
      if (result.models && result.models.length > 0 && !ollamaModel) {
        setOllamaModel(result.models[0]); // Auto-select first model if none is selected
      }
    } else {
      setOllamaFetchStatus(`Error: ${result.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">API Keys</h3>
        <p className="text-sm text-secondary mb-4">Enter your API keys for various LLM providers. These are stored locally in your browser.</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-secondary mb-1">Google Gemini API Key</label>
            <input
              type="password"
              id="gemini-key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              placeholder="Enter your Gemini API Key"
            />
          </div>
          <div>
            <label htmlFor="anthropic-key" className="block text-sm font-medium text-secondary mb-1">Anthropic API Key (Simulated)</label>
            <input
              type="password"
              id="anthropic-key"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              placeholder="Enter your Anthropic API Key"
            />
          </div>
          <div>
            <label htmlFor="groq-key" className="block text-sm font-medium text-secondary mb-1">Groq API Key (Simulated)</label>
            <input
              type="password"
              id="groq-key"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              placeholder="Enter your Groq API Key"
            />
          </div>
          <div>
            <label htmlFor="huggingface-key" className="block text-sm font-medium text-secondary mb-1">Hugging Face API Key (Simulated)</label>
            <input
              type="password"
              id="huggingface-key"
              value={huggingfaceKey}
              onChange={(e) => setHuggingfaceKey(e.target.value)}
              className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              placeholder="Enter your Hugging Face API Key"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">Ollama Settings</h3>
        <p className="text-sm text-secondary mb-4">Configure your local Ollama server connection.</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="ollama-base-url" className="block text-sm font-medium text-secondary mb-1">Ollama Base URL</label>
            <input
              type="text"
              id="ollama-base-url"
              value={ollamaBaseUrl}
              onChange={(e) => setOllamaBaseUrl(e.target.value)}
              className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              placeholder="e.g., http://localhost:11434"
            />
            <button onClick={handleFetchOllama} className="mt-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm">
              Fetch Models
            </button>
            {ollamaFetchStatus && <p className="text-xs text-secondary mt-2">{ollamaFetchStatus}</p>}
          </div>
          {fetchedOllamaModels.length > 0 && (
            <div>
              <label htmlFor="ollama-model" className="block text-sm font-medium text-secondary mb-1">Default Ollama Model</label>
              <select
                id="ollama-model"
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              >
                {fetchedOllamaModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <button type="button" onClick={handleSave} className="px-5 py-2.5 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;