

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PlaygroundItem, Prompt, Agent, Persona, ContextItem, LLMProvider, ApiKeys } from '../types';
import { generateContentStream } from '../services/llmService';
import { SparklesIcon } from './icons/SparklesIcon';
import { BoltIcon } from './icons/BoltIcon';
import { AVAILABLE_MODELS } from '../constants';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { useAuth } from '../contexts/AuthContext';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface PlaygroundProps {
  selectedItem: PlaygroundItem | null;
  apiKeys: ApiKeys;
  fetchedOllamaModels: string[];
  contexts: ContextItem[];
}

const Playground: React.FC<PlaygroundProps> = ({ selectedItem, apiKeys, fetchedOllamaModels, contexts, selectedLLMProvider, selectedLLMModel, onSaveLLMSettings }) => {
  console.log("Playground received selectedLLMProvider:", selectedLLMProvider, "selectedLLMModel:", selectedLLMModel);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai' | 'system', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [injectedContextId, setInjectedContextId] = useState<string>('none');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // State for conversational variable filling
  const [promptVariables, setPromptVariables] = useState<string[]>([]);
  const [currentVariableIndex, setCurrentVariableIndex] = useState(0);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isFillingVariables, setIsFillingVariables] = useState(false);
  const [finalPromptText, setFinalPromptText] = useState<string | null>(null);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any | null>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(prev => (prev ? prev + ' ' : '') + transcript);
    };
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    }
  
    recognitionRef.current = recognition;

    return () => {
        recognitionRef.current?.stop();
    }
  }, []);
  
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
      }
      return AVAILABLE_MODELS[selectedLLMProvider] || [];
  }, [selectedLLMProvider, ollamaModels]);
  
  useEffect(() => {
      if (selectedLLMProvider === LLMProvider.OLLAMA && apiKeys.ollama?.model) {
          onSaveLLMSettings(selectedLLMProvider, apiKeys.ollama.model);
      } else if (!currentProviderModels.includes(selectedLLMModel || '')) {
          onSaveLLMSettings(selectedLLMProvider, currentProviderModels[0]);
      } else if (currentProviderModels.length > 0 && !selectedLLMModel) {
          onSaveLLMSettings(selectedLLMProvider, currentProviderModels[0]);
      }
  }, [selectedLLMProvider, currentProviderModels, apiKeys.ollama?.model, selectedLLMModel, onSaveLLMSettings]);

  const isSystemItem = (item: PlaygroundItem): item is (Agent & { type: 'agent' }) | (Persona & { type: 'persona' }) => {
    return item.type === 'agent' || item.type === 'persona';
  };
  
  const isPrompt = (item: PlaygroundItem): item is Prompt & { type: 'prompt' } => {
    return item.type === 'prompt';
  };


  useEffect(() => {
    setUserInput('');
    setMessages([]);
    setInjectedContextId('none');
    setAttachedImage(null);
    setPromptVariables([]);
    setCurrentVariableIndex(0);
    setVariableValues({});
    setIsFillingVariables(false);
    setFinalPromptText(null);

    if (selectedItem) {
      if (isPrompt(selectedItem) && /\{\{\w+\}\}/.test(selectedItem.text)) {
        const uniqueVariables = [...new Set(selectedItem.text.match(/\{\{(\w+)\}\}/g)?.map(v => v.slice(2, -2)) || [])];
        if (uniqueVariables.length > 0) {
          setPromptVariables(uniqueVariables);
          setIsFillingVariables(true);
          setMessages([{ role: 'ai', content: `This prompt needs some information. First, what is the value for "${uniqueVariables[0]}"?` }]);
          return;
        }
      }
      
      const itemType = selectedItem.type === 'prompt' ? 'Prompt' : 'Agent/Persona';
      const contentText = selectedItem.type === 'prompt' 
          ? `\n\nTemplate:\n---\n${selectedItem.text}` 
          : `\n\nSystem Instruction:\n---\n${selectedItem.systemInstruction}`;
      
      setMessages([{ 
          role: 'system', 
          content: `Testing ${itemType}: "${selectedItem.title}"${contentText}`
      }]);
    }
  }, [selectedItem]);

  const handleRun = useCallback(async () => {
    if (!selectedItem || isLoading) return;

    // Handle conversational variable filling
    if (isFillingVariables) {
        const currentUserInput = userInput.trim();
        const currentVar = promptVariables[currentVariableIndex];
        const newValues = { ...variableValues, [currentVar]: currentUserInput };

        setMessages(prev => [...prev, { role: 'user', content: currentUserInput }]);
        setVariableValues(newValues);
        setUserInput('');

        const nextIndex = currentVariableIndex + 1;
        if (nextIndex < promptVariables.length) {
            const nextVar = promptVariables[nextIndex];
            setCurrentVariableIndex(nextIndex);
            setMessages(prev => [...prev, { role: 'ai', content: `Great. Now, what's the value for "${nextVar}"?` }]);
        } else {
            setIsFillingVariables(false);
            let filledPrompt = selectedItem.type === 'prompt' ? selectedItem.text : '';
            for (const [key, value] of Object.entries(newValues)) {
                filledPrompt = filledPrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
            }
            setFinalPromptText(filledPrompt);
            setMessages(prev => [...prev, {
                role: 'system',
                content: `All variables filled! Here's the final prompt. You can add more details below or just click "Run".\n\n---\n${filledPrompt}`
            }]);
        }
        return;
    }

    setIsLoading(true);
    const currentUserInput = userInput.trim();
    let currentMessages = messages;

    if (currentUserInput) {
        const userMessage = { role: 'user' as const, content: currentUserInput };
        setMessages(prev => [...prev, userMessage]);
        currentMessages = [...currentMessages, userMessage]; // Use updated messages for this run
    }
    
    // Add empty AI message placeholder
    setMessages(prev => [...prev, { role: 'ai', content: '' }]);
    setUserInput('');

    let finalPrompt = '';
    let agent: Agent | Persona | undefined = undefined;

    // 1. Prepare base prompt or agent instruction
    if (isSystemItem(selectedItem)) {
      finalPrompt = currentUserInput;
      agent = selectedItem;
    } else if (isPrompt(selectedItem)) {
        const baseText = finalPromptText || selectedItem.text;
        finalPrompt = currentUserInput ? `${baseText}\n\n${currentUserInput}` : baseText;
    }

    // 2. Prepend context from attachments
    let attachmentContext = '';
    if (selectedItem.attachments && selectedItem.attachments.length > 0) {
        const textBasedAttachments = selectedItem.attachments.filter(a =>
            a.type === 'url' || a.mimeType?.startsWith('text') || a.mimeType === 'application/pdf' || a.mimeType === 'text/csv'
        );
        if (textBasedAttachments.length > 0) {
            attachmentContext += 'CONTEXT FROM ATTACHMENTS:\n====================\n';
            textBasedAttachments.forEach(att => {
                attachmentContext += `FILE: ${att.name}\n---\n${att.content}\n---\n\n`;
            });
            attachmentContext += '====================\n\n';
        }
    }
    finalPrompt = attachmentContext + finalPrompt;

    // 3. Prepend context from selected Context item
    if (injectedContextId !== 'none') {
        const context = contexts.find(c => c.id === injectedContextId);
        if (context) {
            finalPrompt = `CONTEXT FROM: ${context.title}\n====================\n${context.content}\n====================\n\n${finalPrompt}`;
        }
    }

    try {
        const stream = generateContentStream({ 
            apiKeys, 
            provider: selectedLLMProvider, 
            model: selectedLLMModel, 
            prompt: finalPrompt, 
            agent, 
            image: attachedImage 
        });

        for await (const chunk of stream) {
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'ai') {
                    lastMessage.content += chunk;
                }
                return newMessages;
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during streaming.';
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'ai') {
                lastMessage.content = `Error: ${errorMessage}`;
            }
            return newMessages;
        });
    } finally {
        setIsLoading(false);
        setAttachedImage(null);
        if (finalPromptText) {
            setFinalPromptText(null);
        }
    }
  }, [selectedItem, userInput, apiKeys, selectedLLMProvider, selectedLLMModel, injectedContextId, contexts, attachedImage, isFillingVariables, promptVariables, currentVariableIndex, variableValues, finalPromptText, isLoading, messages]);
  
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

  const handleMicClick = () => {
    if (isRecording) {
        recognitionRef.current?.stop();
    } else {
        recognitionRef.current?.start();
    }
  };
  
  const renderPlaceholder = () => {
    if (!selectedItem) return "Select an item to begin...";
    if (isFillingVariables) return `Enter a value for "${promptVariables[currentVariableIndex]}"...`;
    if (finalPromptText) return "Add additional context or input (optional)...";
    if (attachedImage) return "Describe the image or add instructions...";
    if (isSystemItem(selectedItem)) return `Send a message to ${selectedItem.title}...`;
    return "Add additional context or input (optional)...";
  };
  
  const hasText = userInput.trim().length > 0;
  const hasImage = !!attachedImage;
  const hasAnyInput = hasText || hasImage;

  const isRunDisabled = useMemo(() => {
    if (isLoading || !selectedItem) return true;
    if (isFillingVariables) return !hasText;
    if (finalPromptText) return false;
    if (isSystemItem(selectedItem)) return !hasAnyInput;
    // For prompts, can run without additional input
    return false;
  }, [isLoading, selectedItem, isFillingVariables, hasText, finalPromptText, hasAnyInput]);
  
  const selectClasses = "w-full bg-card border border-border rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent text-primary capitalize";

  return (
    <div className="flex flex-col h-full bg-content">
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-primary">Playground</h2>
            <p className="text-sm text-secondary truncate max-w-xs">
              {selectedItem ? `Testing: ${selectedItem.title}` : 'Select an item to test'}
            </p>
          </div>
          <div className="flex flex-col gap-2 w-48">
            <select value={selectedLLMProvider} onChange={(e) => onSaveLLMSettings(e.target.value as LLMProvider, null)} className={selectClasses} aria-label="Select Provider">
              {Object.values(LLMProvider).map(provider => <option key={provider} value={provider}>{provider}</option>)}
            </select>
            <select value={selectedLLMModel || ''} onChange={(e) => onSaveLLMSettings(selectedLLMProvider, e.target.value)} className={`${selectClasses} normal-case`} aria-label="Select Model" disabled={currentProviderModels.length === 0}>
              {currentProviderModels.map(model => <option key={model} value={model}>{model}</option>)}
            </select>
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

             {isLoading && messages[messages.length -1]?.content === '' && (
                 <div className="flex items-start gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-accent"/></div>
                   <div className="max-w-xl p-3 rounded-xl bg-card">
                     <div className="flex items-center gap-2 text-secondary">
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                       <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                     </div>
                   </div>
                 </div>
             )}

             <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 p-4 border-t border-border bg-content">
             {selectedItem ? (
                 <>
                    <div className="mb-3">
                      <label htmlFor="context-injection" className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4" />
                        Inject Context (Optional)
                      </label>
                      <select id="context-injection" value={injectedContextId} onChange={(e) => setInjectedContextId(e.target.value)} className={`${selectClasses} normal-case`} aria-label="Inject Context" disabled={isFillingVariables}>
                        <option value="none">None</option>
                        {contexts.map(context => <option key={context.id} value={context.id}>{context.title}</option>)}
                      </select>
                    </div>
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
                        disabled={!selectedItem || isLoading}
                      />
                      <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1">
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} disabled={!selectedItem || isLoading || !!attachedImage || isFillingVariables} title="Attach Image" className="p-2 text-secondary rounded-md disabled:text-secondary/50 disabled:cursor-not-allowed hover:text-primary transition-colors">
                          <PaperClipIcon className="w-5 h-5" />
                        </button>
                        <button onClick={handleMicClick} disabled={!selectedItem || isLoading} title="Voice Input" className={`p-2 rounded-md transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-secondary hover:text-primary'} disabled:text-secondary/50 disabled:cursor-not-allowed`}>
                          <MicrophoneIcon className="w-5 h-5" />
                        </button>
                        <button onClick={handleRun} disabled={isRunDisabled} className="p-2.5 bg-accent text-white font-semibold rounded-md disabled:bg-card-hover disabled:text-secondary disabled:cursor-not-allowed hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-accent">
                          <BoltIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                 </>
             ) : (
                 <div className="flex-1 flex items-center justify-center h-full">
                    <p className="text-secondary">Select an item from the list to start testing.</p>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default Playground;