import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ApiKeys, LLMProvider, Agent } from '../types';
import { AVAILABLE_MODELS } from '../constants';
import { useRumbleLogic, Participant } from '../hooks/useRumbleLogic';
import ModelSelector from './ModelSelector';
import ProviderIcon from './ProviderIcon';
import { UsersIcon } from './icons/UsersIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { PlusIcon } from './icons/PlusIcon';

interface RumblePageProps {
  apiKeys: ApiKeys;
  fetchedOllamaModels: string[];
  fetchedGeminiModels: string[];
  agents: Agent[];
  selectedLLMProvider: LLMProvider;
  selectedLLMModel: string | null;
}

const ORCHESTRATOR_CONFIG = {
    provider: LLMProvider.GEMINI,
    model: 'gemini-1.5-flash-latest', // A fast and capable model is good for orchestration
};

const participantColors = [
  'bg-blue-500/20', 'bg-purple-500/20', 'bg-green-500/20', 'bg-yellow-500/20', 'bg-pink-500/20', 'bg-indigo-500/20'
];
const participantTextColors = [
  'text-blue-400', 'text-purple-400', 'text-green-400', 'text-yellow-400', 'text-pink-400', 'text-indigo-400'
];

const RumblePage: React.FC<RumblePageProps> = ({ apiKeys, fetchedOllamaModels, fetchedGeminiModels, agents, selectedLLMProvider, selectedLLMModel }) => {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: `p-${Date.now()}-1`, name: 'Participant 1', provider: selectedLLMProvider, model: selectedLLMModel, agent: null },
    { id: `p-${Date.now()}-2`, name: 'Participant 2', provider: selectedLLMProvider, model: selectedLLMModel, agent: null },
  ]);
  const [initialPrompt, setInitialPrompt] = useState('');
  
  const { messages, isLoading, startRumble, stopRumble } = useRumbleLogic({ apiKeys, orchestrator: ORCHESTRATOR_CONFIG });
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAddParticipant = () => {
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name: `Participant ${participants.length + 1}`,
      provider: LLMProvider.GEMINI,
      model: null,
      agent: null,
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateParticipant = (id: string, newConfig: Partial<Participant>) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...newConfig } : p));
  };

  const handleStart = () => {
    if (initialPrompt.trim()) {
      startRumble(participants, initialPrompt);
    }
  };

  const isStartDisabled = isLoading || !initialPrompt.trim() || participants.length < 2 || participants.some(p => !p.model);

  const ParticipantConfigurator: React.FC<{ participant: Participant, index: number }> = ({ participant, index }) => {
    const getProviderModels = (provider: LLMProvider) => {
        switch (provider) {
            case LLMProvider.OLLAMA:
                return fetchedOllamaModels.length > 0 ? fetchedOllamaModels : AVAILABLE_MODELS[LLMProvider.OLLAMA] || [];
            case LLMProvider.GEMINI:
                return fetchedGeminiModels.length > 0 ? fetchedGeminiModels : AVAILABLE_MODELS[LLMProvider.GEMINI] || [];
            default:
                // For other providers not fetched dynamically, use the constants.
                return AVAILABLE_MODELS[provider as keyof typeof AVAILABLE_MODELS] || [];
        }
    };
    const availableModels = useMemo(() => getProviderModels(participant.provider), [participant.provider, fetchedOllamaModels, fetchedGeminiModels]);
    
    useEffect(() => {
        if (!participant.model && availableModels.length > 0) {
            handleUpdateParticipant(participant.id, { model: availableModels[0] });
        }
    }, [participant.model, availableModels, participant.id]);

    return (
      <div className="bg-card p-4 rounded-lg border border-border flex-1 relative min-w-[300px]">
        <div className="flex justify-between items-center mb-4">
            <input 
                type="text"
                value={participant.name}
                onChange={(e) => handleUpdateParticipant(participant.id, { name: e.target.value })}
                className="text-lg font-bold text-primary bg-transparent focus:outline-none"
            />
            {participants.length > 2 && (
                <button onClick={() => handleRemoveParticipant(participant.id)} className="text-secondary hover:text-primary">
                    <XCircleIcon className="w-5 h-5" />
                </button>
            )}
        </div>
        <div className="space-y-3">
          <ModelSelector
            label="Select Provider"
            items={Object.values(LLMProvider).map(p => ({ value: p, label: p, provider: p }))}
            selectedValue={participant.provider}
            onSelect={(provider) => handleUpdateParticipant(participant.id, { provider: provider as LLMProvider, model: null })}
          />
          <ModelSelector
            label="Select Model"
            items={availableModels.map(m => ({ value: m, label: m, provider: participant.provider }))}
            selectedValue={participant.model}
            onSelect={(model) => handleUpdateParticipant(participant.id, { model })}
            disabled={availableModels.length === 0}
          />
          <div className="flex items-center gap-2 bg-card-hover border border-border rounded-md px-3">
              <UsersIcon className="w-5 h-5 text-secondary" />
              <select 
                  value={participant.agent?.id || ''}
                  onChange={(e) => handleUpdateParticipant(participant.id, { agent: agents.find(a => a.id === e.target.value) || null })}
                  className="w-full bg-transparent p-2 focus:outline-none text-primary text-sm"
              >
                  <option className="bg-card text-primary" value="">None (Raw Model)</option>
                  {agents.map(agent => (
                      <option className="bg-card text-primary" key={agent.id} value={agent.id}>{agent.title}</option>
                  ))}
              </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-content text-primary p-4 lg:p-6">
      <h2 className="text-2xl font-bold mb-4">Rumble Chat (Orchestrated)</h2>
      
      <div className="flex overflow-x-auto gap-4 mb-4 pb-4">
        {participants.map((p, index) => <ParticipantConfigurator key={p.id} participant={p} index={index} />)}
        <button onClick={handleAddParticipant} className="flex-shrink-0 flex items-center justify-center w-24 bg-card border-2 border-dashed border-border rounded-lg text-secondary hover:text-primary hover:border-accent transition-colors">
            <PlusIcon className="w-8 h-8" />
        </button>
      </div>

      <div className="mb-4">
        <textarea
          value={initialPrompt}
          onChange={(e) => setInitialPrompt(e.target.value)}
          placeholder="Enter the initial prompt to start the conversation..."
          className="w-full p-3 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={handleStart} disabled={isStartDisabled} className="px-6 py-2 bg-accent text-white font-semibold rounded-md disabled:bg-card-hover disabled:text-secondary disabled:cursor-not-allowed hover:bg-accent/90 transition-colors">
          Start Rumble
        </button>
        <button onClick={stopRumble} disabled={!isLoading} className="px-6 py-2 bg-destructive text-white font-semibold rounded-md disabled:bg-card-hover disabled:text-secondary disabled:cursor-not-allowed hover:bg-red-600/90 transition-colors">
          Stop
        </button>
      </div>

      <div className="flex-1 bg-background p-4 rounded-lg border border-border overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => {
            if (msg.type === 'system') {
              return <div key={index} className="text-center text-xs text-secondary italic py-2">-- {msg.content} --</div>;
            }
            const participantIndex = participants.findIndex(p => p.id === msg.participantId);
            const bgColor = participantColors[participantIndex % participantColors.length];
            const textColor = participantTextColors[participantIndex % participantTextColors.length];
            const isUser = msg.participantId === 'user';

            return (
              <div key={index} className={`flex items-start gap-3 ${isUser ? 'justify-center' : ''}`}>
                {!isUser && <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}><ProviderIcon provider={msg.provider} className={`w-5 h-5 ${textColor}`} /></div>}
                <div className={`max-w-3xl p-3 rounded-xl font-sans ${isUser ? 'bg-accent/20' : 'bg-card'}`}>
                  {!isUser && <p className={`font-bold text-sm mb-1 ${textColor}`}>{msg.participantName}</p>}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })}
          {isLoading && <div className="text-center text-secondary text-sm">... Orchestrator is thinking ...</div>}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default RumblePage;