
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LLMProvider, Agent, Persona, ApiKeys, OllamaCredentials } from '../types';

const generateGeminiContent = async (apiKey: string | undefined, model: string, prompt: string, agent: Agent | Persona | null, image: string | null): Promise<string> => {
  if (!apiKey) {
    return "Error: Gemini API Key is missing. Please add it in the settings panel.";
  }
    
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    let contents;
    if (image) {
      const mimeType = image.match(/data:(image\/\w+);base64,/)?.[1] || 'image/png';
      const imageData = image.split(',')[1];
      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: imageData,
        },
      };
      const textPart = { text: prompt };
      contents = { parts: [textPart, imagePart] };
    } else {
      contents = prompt;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: contents,
        ...(agent && { config: { systemInstruction: agent.systemInstruction } }),
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    if (error instanceof Error) {
        return `Error from Gemini API: ${error.message}`;
    }
    return "An unknown error occurred while contacting the Gemini API.";
  }
};

const generateSimulatedContent = async (provider: LLMProvider, apiKey: string | undefined, model: string, prompt: string, agent: Agent | Persona | null, image: string | null): Promise<string> => {
    // API key check removed as this is a simulation and UI for keys is deprecated.
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
    
    let responseText = `This is a simulated response from ${provider} using the model ${model}.\n\n`;

    if (image) {
        responseText += `---IMAGE ATTACHED---\nAn image was received but cannot be displayed in this simulation.\n\n`;
    }
    
    if (agent && agent.systemInstruction) {
        responseText += `---SYSTEM INSTRUCTION RECEIVED---\n${agent.systemInstruction}\n\n`;
    }

    responseText += `---PROMPT RECEIVED---\n${prompt}\n\n`;
    
    return responseText;
}

const generateOllamaContent = async (credentials: OllamaCredentials | undefined, model: string, prompt: string, agent: Agent | Persona | null, image: string | null): Promise<string> => {
  if (!credentials || !credentials.baseUrl) {
    return `Error: Ollama Base URL is missing. Please add it in the settings panel.`;
  }
  
  const cleanBaseUrl = credentials.baseUrl.endsWith('/') ? credentials.baseUrl.slice(0, -1) : credentials.baseUrl;
  const endpoint = `${cleanBaseUrl}/api/generate`;

  const body: any = {
    model: model,
    prompt: prompt,
    system: agent?.systemInstruction,
    stream: false,
  };
  if (image) {
      body.images = [image.split(',')[1]]
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Ollama API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return data.response || 'No response text found from Ollama.';
  } catch (error) {
    console.error("Error generating content from Ollama:", error);
    if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
             return 'Network error. Could not connect to Ollama server. Check the Base URL and make sure your server is running with CORS configured if necessary.';
        }
        return `Error from Ollama: ${error.message}`;
    }
    return "An unknown error occurred while contacting the Ollama server.";
  }
}

interface GenerateContentParams {
  apiKeys: ApiKeys;
  provider: LLMProvider;
  model: string;
  prompt: string;
  agent: Agent | Persona | undefined;
  image: string | null;
}


export const generateContent = async ({ apiKeys, provider, model, prompt, agent, image }: GenerateContentParams): Promise<string> => {
  switch (provider) {
    case LLMProvider.GEMINI:
      return generateGeminiContent(apiKeys.gemini, model, prompt, agent || null, image);
    case LLMProvider.ANTHROPIC:
      return generateSimulatedContent(LLMProvider.ANTHROPIC, apiKeys.anthropic, model, prompt, agent || null, image);
    case LLMProvider.GROQ:
        return generateSimulatedContent(LLMProvider.GROQ, apiKeys.groq, model, prompt, agent || null, image);
    case LLMProvider.OLLAMA:
        return generateOllamaContent(apiKeys.ollama, model, prompt, agent || null, image);
    case LLMProvider.HUGGINGFACE:
        return generateSimulatedContent(LLMProvider.HUGGINGFACE, apiKeys.huggingface, model, prompt, agent || null, image);
    default:
      const exhaustiveCheck: never = provider;
      return `Error: Provider "${exhaustiveCheck}" is not supported.`;
  }
};

// --- STREAMING IMPLEMENTATIONS ---

async function* generateGeminiContentStream(apiKey: string, model: string, prompt: string, agent: Agent | Persona | null, image: string | null): AsyncGenerator<string> {
    const ai = new GoogleGenAI({ apiKey });
    let contents;
    if (image) {
      const mimeType = image.match(/data:(image\/\w+);base64,/)?.[1] || 'image/png';
      const imageData = image.split(',')[1];
      const imagePart = { inlineData: { mimeType, data: imageData } };
      const textPart = { text: prompt };
      contents = { parts: [textPart, imagePart] };
    } else {
      contents = prompt;
    }
    const response = await ai.models.generateContentStream({
      model,
      contents,
      ...(agent && { config: { systemInstruction: agent.systemInstruction } }),
    });
    for await (const chunk of response) {
      yield chunk.text;
    }
}

async function* generateOllamaContentStream(credentials: OllamaCredentials, model: string, prompt: string, agent: Agent | Persona | null, image: string | null): AsyncGenerator<string> {
    const cleanBaseUrl = credentials.baseUrl.endsWith('/') ? credentials.baseUrl.slice(0, -1) : credentials.baseUrl;
    const endpoint = `${cleanBaseUrl}/api/generate`;

    const body: any = { model, prompt, system: agent?.systemInstruction, stream: true };
    if (image) {
        body.images = [image.split(',')[1]];
    }

    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Ollama API request failed with status ${response.status}: ${errorBody}`);
    }
    if (!response.body) {
        throw new Error("Response from Ollama contained no body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // The last part might be incomplete.

        for (const line of lines) {
            if (line.trim() === '') continue;
            try {
                const parsed = JSON.parse(line);
                if (parsed.response) {
                    yield parsed.response;
                }
            } catch (e) {
                console.error("Failed to parse Ollama stream chunk:", e);
            }
        }
    }
}

async function* generateSimulatedContentStream(provider: LLMProvider, model: string, prompt: string, agent: Agent | Persona | null, image: string | null): AsyncGenerator<string> {
    const fullText = await generateSimulatedContent(provider, undefined, model, prompt, agent, image);
    const words = fullText.split(/(\s+)/);
    for (const word of words) {
        yield word;
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}


export const generateContentStream = ({ apiKeys, provider, model, prompt, agent, image }: GenerateContentParams): AsyncGenerator<string> => {
    switch(provider) {
        case LLMProvider.GEMINI:
            if (!apiKeys.gemini) throw new Error("Error: Gemini API Key is missing. Please add it in the settings panel.");
            return generateGeminiContentStream(apiKeys.gemini, model, prompt, agent || null, image);
        case LLMProvider.OLLAMA:
            if (!apiKeys.ollama || !apiKeys.ollama.baseUrl) throw new Error("Error: Ollama Base URL is missing. Please add it in the settings panel.");
            return generateOllamaContentStream(apiKeys.ollama, model, prompt, agent || null, image);
        case LLMProvider.ANTHROPIC:
        case LLMProvider.GROQ:
        case LLMProvider.HUGGINGFACE:
            return generateSimulatedContentStream(provider, model, prompt, agent || null, image);
        default:
            const exhaustiveCheck: never = provider;
            throw new Error(`Error: Provider "${exhaustiveCheck}" is not supported for streaming.`);
    }
}

export const fetchOllamaModels = async (baseUrl: string): Promise<string[]> => {
  if (!baseUrl || !baseUrl.startsWith('http')) {
    throw new Error('Invalid Ollama Base URL provided.');
  }
  try {
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const response = await fetch(`${cleanBaseUrl}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Failed to connect to Ollama server. Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.models || !Array.isArray(data.models)) {
        throw new Error('Invalid response format from Ollama server.');
    }
    
    return data.models.map(model => model.name);

  } catch (error) {
    console.error("Error fetching Ollama models:", error);
    if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
             return Promise.reject(new Error('Network error. Check CORS settings on your Ollama server or if the server is running.'));
        }
        throw new Error(`Could not fetch models: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching Ollama models.");
  }
};