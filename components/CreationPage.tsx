
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PublishableItem, ApiKeys, LLMProvider, Attachment } from '../types.ts';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { UsersIcon } from './icons/UsersIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { useAuth } from '../contexts/AuthContext';
import { generateContent as generateContentService } from '../services/llmService';
import { SparklesIcon } from './icons/SparklesIcon';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { LinkIcon } from './icons/LinkIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { CsvIcon } from './icons/CsvIcon';
import { ImageIcon } from './icons/ImageIcon';
import { PdfIcon } from './icons/PdfIcon';

interface CreationPageProps {
  onPublish: (item: PublishableItem) => void;
  onCancel: () => void;
  apiKeys: ApiKeys;
  fetchedOllamaModels: string[];
  initialType?: CreationType; // New prop
}

type CreationType = 'prompt' | 'agent' | 'persona';

type AttachmentDraft = Omit<Attachment, 'id' | 'itemId'>;

const CREATION_CONFIG = {
    prompt: { label: 'Prompt', icon: <BookOpenIcon className="w-6 h-6"/> },
    agent: { label: 'Agent', icon: <CpuChipIcon className="w-6 h-6"/> },
    persona: { label: 'Persona', icon: <UsersIcon className="w-6 h-6"/> },
};

const CreationPage: React.FC<CreationPageProps> = ({ onPublish, onCancel, apiKeys, initialType }) => {
  const { user } = useAuth();
  const [creationType, setCreationType] = useState<CreationType>(initialType || 'prompt');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([]);
  const [newUrl, setNewUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // pdf.js needs to know where to load its worker script from.
    // We provide the full CDN URL that's also used in our import map in index.html.
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.4.178/build/pdf.worker.mjs';
  }, []);

  const isFormValid = title && description && content && (creationType !== 'prompt' || category);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText;
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
        let newAttachment: AttachmentDraft;
        const { type, name } = file;

        if (type.startsWith('image/')) {
            const content = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
            newAttachment = { name, type: 'file', mimeType: type, content };
        } else if (type === 'application/pdf') {
            const content = await extractTextFromPdf(file);
            newAttachment = { name, type: 'file', mimeType: type, content };
        } else { // Assume text-based
            const content = await file.text();
            newAttachment = { name, type: 'file', mimeType: type, content };
        }
        setAttachments(prev => [...prev, newAttachment]);
    }
    if (event.target) event.target.value = ''; // Allow re-uploading same file
  };

  const handleAddUrl = () => {
    if (!newUrl || !newUrl.startsWith('http')) {
        alert('Please enter a valid URL (starting with http or https).');
        return;
    }
    // Note: This only saves the URL. For AI generation, we don't fetch content client-side
    // due to CORS. The model (if it has browsing capabilities) could use the URL.
    // For this app, we'll treat it as text context.
    setAttachments(prev => [...prev, { name: newUrl, type: 'url', content: newUrl }]);
    setNewUrl('');
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };


  const handleGenerateContent = async () => {
    if (!title || !description) return;
    setIsGenerating(true);

    let attachmentContext = '';
    if (attachments.length > 0) {
        attachmentContext = '\n\nPlease use the following context from attached files to inform your generation:\n';
        attachments.forEach(att => {
            if (att.type === 'url') {
                attachmentContext += `\n[Reference URL: ${att.content}]`;
            } else if (!att.mimeType?.startsWith('image/')) {
                attachmentContext += `\n--- START OF FILE: ${att.name} ---\n${att.content}\n--- END OF FILE: ${att.name} ---\n`;
            }
        });
    }

    let metaPrompt = '';
    if (creationType === 'prompt') {
        metaPrompt = `You are an expert prompt engineer. Your task is to generate a detailed and effective prompt template based on a given title and description. Use {{variables}} for user-supplied inputs where it makes sense. The output should only be the prompt template text itself, without any extra explanation or formatting.

Title: "${title}"
Description: "${description}"
${attachmentContext}

Generated Prompt Template:`;
    } else { // For agents and personas
        metaPrompt = `You are an expert in crafting system instructions for AI models. Based on the title and description of a desired AI agent or persona, write a clear, concise, and effective system instruction that defines its behavior, personality, and goals. The output should only be the system instruction text, without any extra explanation or formatting.

Title: "${title}"
Description: "${description}"
${attachmentContext}

Generated System Instruction:`;
    }

    try {
        const generatedText = await generateContentService({
            apiKeys,
            provider: LLMProvider.GEMINI,
            model: 'gemini-2.5-flash',
            prompt: metaPrompt,
            agent: null,
            image: null,
        });
        setContent(generatedText);
    } catch (error) {
        console.error("Failed to generate content:", error);
        setContent("Error: Could not generate content. Please check your Gemini API key in settings.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called!"); // Added for debugging
    if (!isFormValid || (!user)) {
      console.log("Form is not valid or user not logged in for non-context type."); // Added for debugging
      return;
    }

    const newId = uuidv4();
    onPublish({
      id: newId,
      type: creationType,
      title,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      content,
      isPublic: user ? isPublic : true, // Non-logged in users can only create public items
      category: creationType === 'prompt' ? category : undefined,
      attachments,
    });
  };
  
  const AttachmentIcon: React.FC<{att: AttachmentDraft}> = ({ att }) => {
    if (att.type === 'url') return <LinkIcon className="w-5 h-5 text-secondary" />;
    if (att.mimeType === 'application/pdf') return <PdfIcon className="w-5 h-5 text-secondary" />;
    if (att.mimeType?.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-secondary" />;
    if (att.mimeType === 'text/csv') return <CsvIcon className="w-5 h-5 text-secondary" />;
    return <DocumentTextIcon className="w-5 h-5 text-secondary" />;
  };

  const TypeButton: React.FC<{ type: CreationType }> = ({ type }) => {
    const config = CREATION_CONFIG[type];
    const isActive = creationType === type;
    
    const baseClasses = "flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all";
    const stateClasses = isActive
      ? 'bg-accent/10 border-accent text-accent'
      : 'bg-card border-border text-secondary hover:bg-card-hover hover:border-slate-600';

    return (
        <button
            type="button"
            onClick={() => setCreationType(type)}
            className={`${baseClasses} ${stateClasses}`}
        >
            {React.cloneElement(config.icon, { className: 'w-6 h-6' })}
            <span className="font-semibold">{config.label}</span>
        </button>
    )
  }
  
  const getContentLabel = () => {
      switch(creationType) {
          case 'prompt': return 'Prompt Template';
          case 'agent': return 'Agent System Instruction';
          case 'persona': return 'Persona System Instruction';
      }
  }
  
  const getContentPlaceholder = () => {
      switch(creationType) {
          case 'prompt': return 'Your prompt text, use {{variables}} for user input.';
          case 'agent': return 'e.g., You are a helpful assistant...';
          case 'persona': return 'e.g., You are a pirate captain...';
      }
  }

  return (
    <main className="flex-1 bg-background overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-6 lg:p-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-primary tracking-tight">Share Your Creation</h1>
                <p className="mt-3 text-lg text-secondary">Contribute to the community by creating something new.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-content border border-border rounded-xl shadow-lg">
                <div className="p-8">
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-primary mb-3">1. What are you creating?</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {(Object.keys(CREATION_CONFIG) as CreationType[]).map(type => 
                                <TypeButton key={type} type={type} />
                            )}
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-primary mb-3">2. Add Details</label>
                        <div className="bg-background border border-border p-6 rounded-lg space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-secondary mb-2">Title</label>
                                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="A clear and concise title" className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary" />
                                </div>
                                 {creationType === 'prompt' ? (
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-secondary mb-2">Category</label>
                                        <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g., Creative Writing" className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary" />
                                    </div>
                                ) : <div className="hidden md:block" />}
                            </div>

                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-secondary mb-2">Description</label>
                                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={2} placeholder="A short explanation of what this is and how to use it." className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"></textarea>
                            </div>

                             <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-secondary mb-2">Tags</label>
                                <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="Comma-separated, e.g., Fun, Roleplay, Technical" className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-medium text-primary mb-3">3. Add Attachments (Optional)</label>
                       <div className="bg-background border border-border p-6 rounded-lg space-y-4">
                               <div className="flex gap-2">
                                  <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-card text-primary font-semibold rounded-md hover:bg-card-hover transition-colors">
                                      <PaperClipIcon className="w-5 h-5"/> Upload Files
                                  </button>
                               </div>
                               <div className="flex gap-2">
                                  <input type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://example.com" className="flex-1 p-2 bg-card border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent text-primary" />
                                  <button type="button" onClick={handleAddUrl} className="flex items-center justify-center gap-2 px-4 py-2 bg-card text-primary font-semibold rounded-r-md hover:bg-card-hover transition-colors">
                                      <LinkIcon className="w-5 h-5"/> Add URL
                                  </button>
                               </div>
                                {attachments.length > 0 && (
                                    <div className="pt-4 space-y-2">
                                        {attachments.map((att, index) => (
                                            <div key={index} className="flex items-center justify-between bg-card p-2 rounded-md">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <AttachmentIcon att={att}/>
                                                    <span className="text-sm text-primary truncate">{att.name}</span>
                                                </div>
                                                <button type="button" onClick={() => removeAttachment(index)} className="p-1 text-secondary hover:text-primary">
                                                    <XCircleIcon className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                           </div>
                        </div>

                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-primary">
                            4. {getContentLabel()}
                          </label>
                          <button 
                            type="button" 
                            onClick={handleGenerateContent}
                            disabled={!title || !description || isGenerating}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-card border border-border text-primary rounded-md hover:bg-card-hover disabled:bg-card-hover disabled:text-secondary disabled:cursor-not-allowed transition-colors"
                          >
                            {isGenerating ? (
                              <>
                                <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <SparklesIcon className="w-4 h-4 text-accent" />
                                <span>Generate with AI</span>
                              </>
                            )}
                          </button>
                      </div>
                      <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={10} placeholder={getContentPlaceholder()} className="w-full p-3 bg-background text-primary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm leading-relaxed"></textarea>
                    </div>
                    
                    {user && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-primary mb-3">
                           5. Visibility
                        </label>
                        <div className="bg-background rounded-lg p-1 flex border border-border">
                          <button type="button" onClick={() => setIsPublic(false)} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${!isPublic ? 'bg-accent text-white shadow' : 'text-secondary hover:bg-card'}`}>
                            Private
                          </button>
                          <button type="button" onClick={() => setIsPublic(true)} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${isPublic ? 'bg-accent text-white shadow' : 'text-secondary hover:bg-card'}`}>
                            Public
                          </button>
                        </div>
                        <p className="text-xs text-secondary mt-2">
                          Private items are saved to "My Library" and are only visible to you. Public items are shared with the community.
                        </p>
                      </div>
                    )}
                </div>

                <div className="p-6 bg-background border-t border-border flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-card border border-border text-primary font-semibold rounded-md hover:bg-card-hover transition-colors">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition-colors disabled:bg-card-hover disabled:text-secondary disabled:cursor-not-allowed">
                        Publish {CREATION_CONFIG[creationType].label}
                    </button>
                </div>
            </form>
        </div>
    </main>
  );
};

export default CreationPage;
