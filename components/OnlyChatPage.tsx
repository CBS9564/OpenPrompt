import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ApiKeys, LLMProvider } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { BoltIcon } from './icons/BoltIcon';
import { AVAILABLE_MODELS } from '../constants';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { useAuth } from '../contexts/AuthContext';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { XCircleIcon } from './icons/XCircleIcon';

import ModelSelector from './ModelSelector';

// Import custom hooks
import { useChatLogic } from '../hooks/useChatLogic';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface OnlyChatPageProps {
  apiKeys: ApiKeys;
  fetchedOllamaModels: string[];
  fetchedGeminiModels: string[];
  selectedLLMProvider: LLMProvider;
  selectedLLMModel: string | null;
  onSaveLLMSettings: (provider: LLMProvider, model: string) => void;
}

const OnlyChatPage: React.FC<OnlyChatPageProps> = ({ apiKeys, fetchedOllamaModels, fetchedGeminiModels, selectedLLMProvider, selectedLLMModel, onSaveLLMSettings }) => {
  const [userInput, setUserInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Use custom hooks
  const { messages, isLoading, sendMessage, resetChat, setMessages, currentAiMessageContent } = useChatLogic({
    apiKeys,
    selectedLLMProvider,
    selectedLLMModel,
  });

  const { isRecording, toggleRecognition } = useSpeechRecognition({
    onResult: useCallback((transcript) => {
      setUserInput(prev => (prev ? prev + ' ' : '') + transcript);
    }, []),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, currentAiMessageContent]);

  useEffect(() => {
    setUserInput('');
    setAttachedImage(null);
    resetChat();
  }, [resetChat]);

  const handleRun = useCallback(async () => {
    if (isLoading) return;

    await sendMessage(userInput, null, attachedImage, null); // selectedItem is null for only chat
    setUserInput('');
    setAttachedImage(null);
  }, [userInput, attachedImage, isLoading, sendMessage]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
    if(event.target) event.target.value = '';
  };

  const renderPlaceholder = () => {
    if (attachedImage) return "Describe the image or add instructions...";
    return "Start chatting...";
  };
  
  const hasText = userInput.trim().length > 0;
  const hasImage = !!attachedImage;
  const hasAnyInput = hasText || hasImage;

  const isRunDisabled = useMemo(() => {
    return isLoading || !hasAnyInput;
  }, [isLoading, hasAnyInput]);
  
  const selectClasses = "w-full bg-card border border-border rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent text-primary capitalize";

  const ollamaModels = useMemo(() => {
    const customModel = apiKeys.ollama?.model;
    const defaultModels = AVAILABLE_MODELS[LLMProvider.OLLAMA];
    const baseModels = fetchedOllamaModels.length > 0 ? fetchedOllamaModels : defaultModels;

    if (customModel && customModel.trim() !== '' && !baseModels.includes(customModel)) {
        return [customModel, ...baseModels];
    }
    return baseModels;
  }, [apiKeys.ollama?.model, fetchedOllamaModels]);

  const currentProviderModels = useMemo(() => {
      if (selectedLLMProvider === LLMProvider.OLLAMA) {
          return ollamaModels;
      } else if (selectedLLMProvider === LLMProvider.GEMINI) {
          return fetchedGeminiModels.length > 0 ? fetchedGeminiModels : AVAILABLE_MODELS[LLMProvider.GEMINI];
      }
      return AVAILABLE_MODELS[selectedLLMProvider] || [];
  }, [selectedLLMProvider, ollamaModels, fetchedGeminiModels]);
  
  

  return (
    <div className="flex flex-col h-full bg-content">
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-primary">Only Chat</h2>
            <p className="text-sm text-secondary truncate max-w-xs">
              Start a free-form conversation with your selected LLM.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-48">
            <ModelSelector
              label="Select Provider"
              items={Object.values(LLMProvider).map(p => ({ value: p, label: p, provider: p }))}
              selectedValue={selectedLLMProvider}
              onSelect={(provider) => onSaveLLMSettings(provider as LLMProvider, null)}
            />
            <ModelSelector
              label="Select Model"
              items={currentProviderModels.map(m => ({ value: m, label: m, provider: selectedLLMProvider }))}
              selectedValue={selectedLLMModel}
              onSelect={(model) => onSaveLLMSettings(selectedLLMProvider, model)}
              disabled={currentProviderModels.length === 0}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
             {messages.map((msg, index) => {
                 if(msg.role === 'system') {
                     return (
                        <div key={index} className="text-xs text-secondary bg-card p-3 rounded-lg border border-border my-2">
                            <p className="whitespace-pre-wrap font-mono leading-relaxed">{msg.content}</p>
                        </div>
                     );
                 }
                 const isUser = msg.role === 'user';
                 return (
                     <div key={index} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                       {!isUser && (
                           <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                             <SparklesIcon className="w-5 h-5 text-accent"/>
                           </div>
                       )}
                       <div className={`max-w-xl p-3 rounded-xl font-sans ${isUser ? 'bg-accent text-white' : 'bg-card text-primary'}`}>
                           <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                       </div>
                       {isUser && (
                           <div className="w-8 h-8 rounded-full bg-card-hover flex items-center justify-center flex-shrink-0">
                             {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full" /> : <UserCircleIcon className="w-5 h-5 text-secondary"/>}
                           </div>
                       )}
                     </div>
                 );
             })}

             {isLoading && currentAiMessageContent && (
                 <div className="flex items-start gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-accent"/></div>
                   <div className="max-w-xl p-3 rounded-xl bg-card">
                     <p className="text-sm whitespace-pre-wrap leading-relaxed">{currentAiMessageContent}</p>
                     <div className="flex items-center gap-2 text-secondary mt-2">
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                       {selectedLLMModel && <span className="text-sm">Thinking with {selectedLLMModel}...</span>}
                     </div>
                   </div>
                 </div>
             )}

             {isLoading && !currentAiMessageContent && messages.length > 0 && messages[messages.length - 1]?.role === 'ai' && (
                 <div className="flex items-start gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-accent"/></div>
                   <div className="max-w-xl p-3 rounded-xl bg-card">
                     <div className="flex items-center gap-2 text-secondary">
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                       {selectedLLMModel && <span className="text-sm">Thinking with {selectedLLMModel}...</span>}
                     </div>
                   </div>
                 </div>
             )}

             <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 p-4 border-t border-border bg-content">
             <div className="relative">
                       {attachedImage && (
                          <div className="absolute bottom-full left-0 mb-2 p-1.5 bg-card rounded-lg border border-border shadow-lg">
                            <img src={attachedImage} alt="Preview" className="max-h-24 rounded" />
                            <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-background rounded-full p-0.5 text-secondary hover:text-primary transition-colors">
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      <textarea id="userInput" value={userInput} onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !isRunDisabled) {
                                e.preventDefault();
                                handleRun();
                            }
                        }}
                        placeholder={renderPlaceholder()}
                        className="w-full h-24 p-3 pr-32 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm leading-relaxed"
                        disabled={isLoading}
                      />
                      <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1">
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} disabled={isLoading || !!attachedImage} title="Attach Image" className="p-2 text-secondary rounded-md disabled:text-secondary/50 disabled:cursor-not-allowed hover:text-primary transition-colors">
                          <PaperClipIcon className="w-5 h-5" />
                        </button>
                        <button onClick={toggleRecognition} disabled={isLoading} title="Voice Input" className={`p-2 rounded-md transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-secondary hover:text-primary'} disabled:text-secondary/50 disabled:cursor-not-allowed`}>
                          <MicrophoneIcon className="w-5 h-5" />
                        </button>
                        <button onClick={handleRun} disabled={isRunDisabled} className="p-2.5 bg-accent text-white font-semibold rounded-md disabled:bg-card-hover disabled:text-secondary disabled:cursor-not-allowed hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-accent">
                          <BoltIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
          </div>
      </div>
    </div>
  );
};

export default OnlyChatPage;