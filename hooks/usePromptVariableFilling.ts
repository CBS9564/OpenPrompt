import { useState, useEffect, useCallback } from 'react';
import { PlaygroundItem, Prompt } from '../types';

interface UsePromptVariableFillingProps {
  selectedItem: PlaygroundItem | null;
  onVariablesFilled: (filledPrompt: string) => void;
  onResetChat: () => void;
}

export const usePromptVariableFilling = ({ selectedItem, onVariablesFilled, onResetChat }: UsePromptVariableFillingProps) => {
  const [promptVariables, setPromptVariables] = useState<string[]>([]);
  const [currentVariableIndex, setCurrentVariableIndex] = useState(0);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isFillingVariables, setIsFillingVariables] = useState(false);
  const [finalPromptText, setFinalPromptText] = useState<string | null>(null);

  const isPrompt = (item: PlaygroundItem): item is Prompt & { type: 'prompt' } => {
    return item.type === 'prompt';
  };

  useEffect(() => {
    setPromptVariables([]);
    setCurrentVariableIndex(0);
    setVariableValues({});
    setIsFillingVariables(false);
    setFinalPromptText(null);

    if (selectedItem && isPrompt(selectedItem) && /\{\{\w+\}\} /.test(selectedItem.text)) {
      const uniqueVariables = [...new Set(selectedItem.text.match(/\{\{\w+\}\} /g)?.map(v => v.slice(2, -2)) || [])];
      if (uniqueVariables.length > 0) {
        setPromptVariables(uniqueVariables);
        setIsFillingVariables(true);
        onResetChat(); // Reset chat messages when starting variable filling
        // Add initial message for variable filling
        // This message will be added by the Playground component itself
      }
    }
  }, [selectedItem, onResetChat]);

  const handleVariableInput = useCallback((userInput: string) => {
    const currentUserInput = userInput.trim();
    const currentVar = promptVariables[currentVariableIndex];
    const newValues = { ...variableValues, [currentVar]: currentUserInput };

    setVariableValues(newValues);

    const nextIndex = currentVariableIndex + 1;
    if (nextIndex < promptVariables.length) {
      setCurrentVariableIndex(nextIndex);
      return { status: 'needs_more_input', nextVar: promptVariables[nextIndex] };
    } else {
      setIsFillingVariables(false);
      let filledPrompt = selectedItem && isPrompt(selectedItem) ? selectedItem.text : '';
      for (const [key, value] of Object.entries(newValues)) {
        filledPrompt = filledPrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`), value);
      }
      setFinalPromptText(filledPrompt);
      onVariablesFilled(filledPrompt);
      return { status: 'filled', filledPrompt };
    }
  }, [promptVariables, currentVariableIndex, variableValues, selectedItem, onVariablesFilled]);

  const resetVariableFilling = useCallback(() => {
    setPromptVariables([]);
    setCurrentVariableIndex(0);
    setVariableValues({});
    setIsFillingVariables(false);
    setFinalPromptText(null);
  }, []);

  return {
    promptVariables,
    currentVariableIndex,
    variableValues,
    isFillingVariables,
    finalPromptText,
    handleVariableInput,
    resetVariableFilling,
    setFinalPromptText // Expose setter for external reset if needed
  };
};
