import { useState, useCallback, useRef } from 'react';
import { generateContentStream } from '../services/llmService';
import { ApiKeys, LLMProvider, Agent, Persona, Prompt, ContextItem } from '../types';

interface ChatLogicProps {
  apiKeys: ApiKeys;
  selectedLLMProvider: LLMProvider;
  selectedLLMModel: string | null;
}

export const useChatLogic = ({ apiKeys, selectedLLMProvider, selectedLLMModel }: ChatLogicProps) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai' | 'system', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAiMessageContent, setCurrentAiMessageContent] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (
    userInput: string,
    selectedItem: Agent | Persona | Prompt | null,
    attachedImage: string | null,
    finalPromptText: string | null
  ) => {
    // In "Only Chat" mode, selectedItem can be null. We should only check for isLoading.
    if (isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    const currentUserInput = userInput.trim();

    // Add user message to state immediately
    if (currentUserInput) {
      setMessages(prev => [...prev, { role: 'user', content: currentUserInput }]);
    }

    let finalPrompt = '';
    let agent: Agent | Persona | undefined = undefined;

    const isSystemItem = (item: any): item is (Agent & { type: 'agent' }) | (Persona & { type: 'persona' }) => {
      return item && (item.type === 'agent' || item.type === 'persona');
    };
    const isPrompt = (item: any): item is Prompt & { type: 'prompt' } => {
      return item && item.type === 'prompt';
    };

    if (isSystemItem(selectedItem)) {
      finalPrompt = currentUserInput;
      agent = selectedItem;
    } else if (isPrompt(selectedItem)) {
      const baseText = finalPromptText || selectedItem.text;
      finalPrompt = currentUserInput ? `${baseText}\n\n${currentUserInput}` : baseText;
    } else {
      // This is the "Only Chat" case
      finalPrompt = currentUserInput;
    }

    let attachmentContext = '';
    if (selectedItem?.attachments && selectedItem.attachments.length > 0) {
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

    try {
      setCurrentAiMessageContent('...'); // Show a loading indicator
      
      const stream = generateContentStream({
        apiKeys,
        provider: selectedLLMProvider,
        model: selectedLLMModel,
        prompt: finalPrompt,
        agent,
        image: attachedImage,
        signal
      });

      let accumulatedContent = '';
      for await (const chunk of stream) {
        if (signal.aborted) throw new Error("Aborted");
        accumulatedContent += chunk;
        setCurrentAiMessageContent(accumulatedContent);
      }

      if (accumulatedContent) {
        setMessages(prev => [...prev, { role: 'ai', content: accumulatedContent }]);
      } else if (!signal.aborted) {
         setMessages(prev => [...prev, { role: 'ai', content: 'No response received from LLM.' }]);
      }

    } catch (error) {
      console.error('useChatLogic: Error during content generation:', error);
      if (signal.aborted) {
        console.log('Request aborted by user.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setMessages(prev => [...prev, { role: 'ai', content: `Error: ${errorMessage}` }]);
      }
    } finally {
      setCurrentAiMessageContent(''); // Clear loading indicator
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, apiKeys, selectedLLMProvider, selectedLLMModel]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return { messages, isLoading, sendMessage, resetChat, setMessages, currentAiMessageContent };
};