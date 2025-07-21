import { useState, useCallback, useRef } from 'react';
import { generateContent, generateContentStream } from '../services/llmService';
import { ApiKeys, LLMProvider, Agent } from '../types';

export interface RumbleMessage {
  participantId: string;
  participantName: string;
  provider: LLMProvider;
  content: string;
  type: 'message';
}

export interface SystemMessage {
  content: string;
  type: 'system';
}

export type ChatMessage = RumbleMessage | SystemMessage;

export interface Participant {
  id: string;
  name: string;
  provider: LLMProvider;
  model: string | null;
  agent: Agent | null;
}

interface RumbleLogicProps {
  apiKeys: ApiKeys;
  orchestrator: {
    provider: LLMProvider;
    model: string;
  };
}

export const useRumbleLogic = ({ apiKeys, orchestrator }: RumbleLogicProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isStoppedRef = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopRumble = useCallback(() => {
    isStoppedRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  const createOrchestratorPrompt = (
    history: ChatMessage[],
    participants: Participant[]
  ): string => {
    const participantInfo = participants.map(p => `- ID: "${p.id}", Name: "${p.name}", Personality: ${p.agent?.description || 'Raw Model'}`).join('\n');
    const validIds = participants.map(p => `"${p.id}"`).join(', ');
    const conversationHistory = history.map(msg => {
      if (msg.type === 'message') {
        return `${msg.participantName} (ID: ${msg.participantId}): ${msg.content}`;
      }
      return '';
    }).filter(Boolean).join('\n');

    return `You are the orchestrator of a debate between the following participants:\n${participantInfo}\n\nHere is the conversation history so far:\n---\n${conversationHistory}\n---\nBased on the last message, who should speak next? Your response MUST be ONLY the ID of the next participant to speak.\nThe valid IDs are: ${validIds}.\nYour response must be one of these IDs and nothing else. For example: "p-1662581334413-1"`;
  };

  const createParticipantPrompt = (
    history: ChatMessage[],
    participant: Participant
  ): string => {
    const conversationHistory = history.map(msg => {
      if (msg.type === 'message') {
        return `${msg.participantName}: ${msg.content}`;
      }
      return '';
    }).filter(Boolean).join('\n');

    return `You are in a debate. Your name is ${participant.name}.\n${participant.agent?.description ? `Your personality is: ${participant.agent.description}` : 'You are a raw AI model.'}\n\nHere is the conversation history so far:\n---\n${conversationHistory}\n---\nIt is now your turn to speak. Continue the conversation naturally. Your response should be from the perspective of ${participant.name}. Do not add any prefixes like your name or ID.`;
  };


  const startRumble = useCallback(async (
    participants: Participant[],
    initialPrompt: string,
    maxTurns: number = 10
  ) => {
    if (participants.some(p => !p.model)) {
      setMessages([{ type: 'system', content: 'All participants must have a model selected.' }]);
      return;
    }

    stopRumble();
    isStoppedRef.current = false;
    const initialSystemMessage: SystemMessage = { type: 'system', content: `Rumble started! Initial prompt: "${initialPrompt}"` };
    const initialUserMessage: RumbleMessage = { type: 'message', participantId: 'user', participantName: 'User', provider: LLMProvider.GEMINI, content: initialPrompt };
    setMessages([initialSystemMessage, initialUserMessage]);
    setIsLoading(true);

    let currentHistory: ChatMessage[] = [initialUserMessage];
    let accumulatedContent = '';
    for (let i = 0; i < maxTurns; i++) {
      if (isStoppedRef.current) {
        setMessages(prev => [...prev, { type: 'system', content: 'Rumble stopped by user.' }]);
        break;
      }

      // 1. Orchestrator decides who is next
      const orchestratorPrompt = createOrchestratorPrompt(currentHistory, participants);
      let nextParticipantId: string;
      try {
        const response = await generateContent({
          apiKeys,
          provider: orchestrator.provider,
          model: orchestrator.model,
          prompt: orchestratorPrompt,
          agent: undefined,
          image: null,
        });
        // Clean up response to get only the ID
        nextParticipantId = response.trim().replace(/"/g, '');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
        setMessages(prev => [...prev, { type: 'system', content: `Orchestrator failed: ${errorMessage}. Stopping.` }]);
        break;
      }
      
      let nextParticipant = participants.find(p => p.id === nextParticipantId);
      if (!nextParticipant) {
        setMessages(prev => [...prev, { type: 'system', content: `Orchestrator chose an invalid participant ID ("${nextParticipantId}"). Trying to recover or stopping.` }]);
        // Simple recovery: pick the first participant if orchestrator fails
        const fallbackParticipant = participants[i % participants.length];
        if(fallbackParticipant) {
            setMessages(prev => [...prev, { type: 'system', content: `Falling back to ${fallbackParticipant.name}.`}]);
            nextParticipant = fallbackParticipant;
        } else {
            setMessages(prev => [...prev, { type: 'system', content: `Could not recover. Stopping.` }]);
            break;
        }
      }
      
      const participantToRespond = nextParticipant
      if (!participantToRespond) {
          setMessages(prev => [...prev, { type: 'system', content: `Critical error: Could not find participant with ID "${nextParticipantId}". Stopping.` }]);
          break;
      }

      setMessages(prev => [...prev, { type: 'system', content: `Orchestrator chose ${participantToRespond.name} to speak next.`}]);

      // 2. Chosen participant generates a response
      abortControllerRef.current = new AbortController();
      try {
        const participantPrompt = createParticipantPrompt(currentHistory, participantToRespond);
        
        const stream = generateContentStream({
          apiKeys,
          provider: participantToRespond.provider,
          model: participantToRespond.model!,
          prompt: participantPrompt,
          agent: participantToRespond.agent || undefined,
          image: null,
          signal: abortControllerRef.current.signal,
        });

        accumulatedContent = '';
        let messageAdded = false;

        const fullMessage: RumbleMessage = {
            type: 'message',
            participantId: participantToRespond.id,
            participantName: participantToRespond.name,
            provider: participantToRespond.provider,
            content: '',
        };

        for await (const chunk of stream) {
            if (isStoppedRef.current) break;
            accumulatedContent += chunk;
            fullMessage.content = accumulatedContent;
            
            if (!messageAdded) {
                setMessages(prev => [...prev, fullMessage]);
                messageAdded = true;
            } else {
                setMessages(prev => prev.map(m => ((m as RumbleMessage).participantId === fullMessage.participantId && (m as RumbleMessage).content !== accumulatedContent) ? fullMessage : m));
            }
        }

        if (isStoppedRef.current) break;

        if (accumulatedContent) {
          const finalMsg: RumbleMessage = {
            type: 'message',
            participantId: participantToRespond.id,
            participantName: participantToRespond.name,
            provider: participantToRespond.provider,
            content: accumulatedContent,
          };
          currentHistory.push(finalMsg);
        } else {
          setMessages(prev => [...prev, { type: 'system', content: `${participantToRespond.name} failed to respond.` }]);
        }
      } catch (error) {
        if (isStoppedRef.current) break;
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setMessages(prev => [...prev, { type: 'system', content: `Error with ${participantToRespond.name}: ${errorMessage}` }]);
        break;
      }
    }

    if (!isStoppedRef.current) {
      setMessages(prev => [...prev, { type: 'system', content: 'Rumble finished.' }]);
    }
    setIsLoading(false);
    isStoppedRef.current = true;

  }, [apiKeys, orchestrator, stopRumble]);

  return { messages, isLoading, startRumble, stopRumble };
};