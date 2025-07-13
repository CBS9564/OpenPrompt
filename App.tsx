

import React, { useState, useEffect, useCallback } from 'react';
import { View, Prompt, Agent, Persona, ContextItem, PlaygroundItem, ApiKeys, PublishableItem, SortOrder, MultimodalFilter, User, Comment, OllamaCredentials } from './types';
import { useAuth } from './contexts/AuthContext';
import * as db from './services/dbService';
import { fetchOllamaModels as fetchOllamaModelsService } from './services/llmService';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CreationPage from './components/CreationPage';
import SettingsModal from './components/SettingsModal';
import DetailPage from './components/DetailPage';
import ProfilePage from './components/ProfilePage';
import CommunityHeader from './components/CommunityHeader';
import PromptCard from './components/PromptCard';
import AgentCard from './components/AgentCard';
import PersonaCard from './components/PersonaCard';
import ContextCard from './components/ContextCard';

// Main App Component
const App: React.FC = () => {
    // Component State
    const { user, login } = useAuth();
    const [view, setView] = useState<View>(View.HOME);
    const [selectedDetailItem, setSelectedDetailItem] = useState<PlaygroundItem | null>(null);

    // Data State
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [contexts, setContexts] = useState<ContextItem[]>([]);
    const [apiKeys, setApiKeys] = useState<ApiKeys>({});
    const [fetchedOllamaModels, setFetchedOllamaModels] = useState<string[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Comments & Likes state for DetailPage
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLiked, setIsLiked] = useState(false);

    // List page state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('recommended');
    const [multimodalFilter, setMultimodalFilter] = useState<MultimodalFilter>('all');
    
    // DB Initialization
    useEffect(() => {
        const initDb = async () => {
            await db.init();
            loadAllData();
            // Load settings from localStorage
            const savedKeys = localStorage.getItem('openprompt_apikeys');
            if (savedKeys) {
                setApiKeys(JSON.parse(savedKeys));
            }
        };
        initDb();
    }, []);

    // Data Loading
    const loadAllData = useCallback(async () => {
        setPrompts(await db.getPrompts());
        setAgents(await db.getAgents());
        setPersonas(await db.getPersonas());
        setContexts(await db.getContexts());
    }, []);

    // Load social data when detail item changes
    useEffect(() => {
        const loadSocialData = async () => {
            if (selectedDetailItem && user) {
                setComments(await db.getCommentsForItem(selectedDetailItem.id));
                setIsLiked(await db.hasUserLikedItem(selectedDetailItem.id, user.email));
            } else {
                setComments([]);
                setIsLiked(false);
            }
        };
        loadSocialData();
    }, [selectedDetailItem, user]);
    
    // Navigation Handlers
    const handleViewChange = (newView: View) => {
        setView(newView);
        setSelectedDetailItem(null);
        setSearchQuery('');
    };

    const handleNavigateToDetail = async (id: string, type: 'prompt' | 'agent' | 'persona') => {
        let item: PlaygroundItem | null = null;
        switch(type) {
            case 'prompt': 
                const p = await db.getPromptById(id);
                if(p) item = {...p, type: 'prompt'};
                break;
            case 'agent':
                const a = await db.getAgentById(id);
                if(a) item = {...a, type: 'agent'};
                break;
            case 'persona':
                const pe = await db.getPersonaById(id);
                if(pe) item = {...pe, type: 'persona'};
                break;
        }
        if (item) {
            setSelectedDetailItem(item);
            // We don't change the main view, just show the detail item over it.
            // A null selectedDetailItem means we are showing a list view or home.
        }
    };
    
    // CRUD Handlers
    const handlePublish = async (item: PublishableItem) => {
        const baseItem = {
            id: `${item.type.slice(0,1)}${Date.now()}`,
            title: item.title,
            description: item.description,
            tags: item.tags,
            author: user?.name || "Anonymous",
            createdAt: Date.now(),
            isPublic: item.isPublic,
            isRecommended: false,
        };

        switch(item.type) {
            case 'prompt':
                await db.addPrompt({ ...baseItem, text: item.content, category: item.category || 'General', supportedInputs: [] }, item.attachments);
                break;
            case 'agent':
                await db.addAgent({ ...baseItem, systemInstruction: item.content }, item.attachments);
                break;
            case 'persona':
                await db.addPersona({ ...baseItem, systemInstruction: item.content }, item.attachments);
                break;
            case 'context':
                await db.addContext({ ...baseItem, content: item.content });
                break;
        }
        await loadAllData();
        handleViewChange(View.HOME);
    };

    const handleUpdateItem = async (item: PlaygroundItem) => {
        switch(item.type) {
            case 'prompt': await db.updatePrompt(item); break;
            case 'agent': await db.updateAgent(item); break;
            case 'persona': await db.updatePersona(item); break;
        }
        await loadAllData();
        setSelectedDetailItem(item); // Keep viewing the updated item
    };
    
    const handleDeleteItem = async (item: PlaygroundItem) => {
        if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
        switch(item.type) {
            case 'prompt': await db.deletePrompt(item.id); break;
            case 'agent': await db.deleteAgent(item.id); break;
            case 'persona': await db.deletePersona(item.id); break;
        }
        await loadAllData();
        handleViewChange(view); // Go back to the list view
        setSelectedDetailItem(null);
    };
    
    // Settings Handlers
    const handleSaveSettings = (keys: ApiKeys) => {
        setApiKeys(keys);
        localStorage.setItem('openprompt_apikeys', JSON.stringify(keys));
        setIsSettingsOpen(false);
        // re-fetch ollama models if url changed
        if (keys.ollama?.baseUrl !== apiKeys.ollama?.baseUrl) {
             handleFetchOllamaModels(keys.ollama);
        }
    };

    const handleFetchOllamaModels = async (ollamaCreds: OllamaCredentials | undefined) => {
        if (!ollamaCreds || !ollamaCreds.baseUrl) {
            setFetchedOllamaModels([]);
            return { success: false, message: 'Ollama Base URL is not set.'};
        }
        try {
            const models = await fetchOllamaModelsService(ollamaCreds.baseUrl);
            setFetchedOllamaModels(models);
            return { success: true, message: `Successfully loaded ${models.length} models.`, models };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            setFetchedOllamaModels([]);
            return { success: false, message };
        }
    };

    // Social Handlers
    const handleToggleLike = async (itemId: string, isCurrentlyLiked: boolean) => {
        if (!user) return;
        if (isCurrentlyLiked) {
            await db.removeLike(itemId, user.email);
        } else {
            await db.addLike(itemId, user.email);
        }
        setIsLiked(!isCurrentlyLiked);
        // Refresh data to update like counts
        await loadAllData();

        const currentItem = selectedDetailItem;
        if (!currentItem) return;

        let playgroundItem: PlaygroundItem | null = null;
        switch(currentItem.type) {
            case 'prompt': {
                const p = await db.getPromptById(itemId);
                if (p) playgroundItem = {...p, type: 'prompt'};
                break;
            }
            case 'agent': {
                const a = await db.getAgentById(itemId);
                if (a) playgroundItem = {...a, type: 'agent'};
                break;
            }
            case 'persona': {
                const pe = await db.getPersonaById(itemId);
                if (pe) playgroundItem = {...pe, type: 'persona'};
                break;
            }
        }

        if (playgroundItem) {
             setSelectedDetailItem(playgroundItem);
        }
    };
    
    const handleAddComment = async (itemId: string, content: string) => {
        if (!user) return;
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            itemId,
            userId: user.email,
            authorName: user.name,
            authorAvatar: user.avatarUrl,
            content,
            createdAt: Date.now(),
        };
        await db.addComment(newComment);
        setComments(await db.getCommentsForItem(itemId));
        await loadAllData(); // to update comment counts
    };


    // Filtering logic
    const filterAndSort = <T extends (Prompt | Agent | Persona)>(items: T[], isMyLibrary: boolean): T[] => {
        if (!items || items.length === 0) return [];
        let filtered: T[];

        if (isMyLibrary && user) {
            filtered = items.filter(p => p.author === user.name);
        } else {
            filtered = items.filter(p => p.isPublic);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q))
            );
        }
        
        const isPromptView = view === View.PROMPTS || view === View.MY_PROMPTS;

        if (isPromptView && multimodalFilter !== 'all') {
            // This is safe because this code path is only taken for prompt views, 
            // where `items` will be of type `Prompt[]`.
            filtered = filtered.filter(p => (p as Prompt).supportedInputs?.includes(multimodalFilter));
        }

        if (sortOrder === 'recent') {
            filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        } else { // 'recommended'
            filtered.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
        }

        return filtered;
    };

    // Render logic
    const renderContent = () => {
        if (selectedDetailItem) {
            return <DetailPage
                item={selectedDetailItem}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                onBack={() => setSelectedDetailItem(null)}
                apiKeys={apiKeys}
                fetchedOllamaModels={fetchedOllamaModels}
                contexts={contexts}
                comments={comments}
                isLiked={isLiked}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
            />
        }
        
        switch (view) {
            case View.HOME:
                return <HomePage onViewChange={handleViewChange} user={user} onNavigateToDetail={handleNavigateToDetail} login={login}/>;
            case View.PROMPTS:
            case View.MY_PROMPTS:
                const isMyPrompts = view === View.MY_PROMPTS;
                const filteredPrompts = filterAndSort(prompts, isMyPrompts);
                return (
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <CommunityHeader
                            title={isMyPrompts ? "My Prompts" : "Community Prompts"}
                            subtitle={isMyPrompts ? "Your personal collection of prompts." : "Explore prompts created by the community."}
                            showSort={true} sortOrder={sortOrder} onSortOrderChange={setSortOrder}
                            searchQuery={searchQuery} onSearchChange={setSearchQuery}
                            showMultimodalFilter={true}
                            multimodalFilter={multimodalFilter} onMultimodalFilterChange={setMultimodalFilter}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredPrompts.map(p => <PromptCard key={p.id} prompt={p} onSelect={() => handleNavigateToDetail(p.id, 'prompt')} showVisibility={isMyPrompts} />)}
                        </div>
                    </main>
                );
            case View.AGENTS:
            case View.MY_AGENTS:
                 const isMyAgents = view === View.MY_AGENTS;
                 const filteredAgents = filterAndSort(agents, isMyAgents);
                 return (
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <CommunityHeader
                            title={isMyAgents ? "My Agents" : "Community Agents"}
                            subtitle={isMyAgents ? "Your personal collection of agents." : "Explore pre-configured AI agents with specific behaviors."}
                            showSort={true} sortOrder={sortOrder} onSortOrderChange={setSortOrder}
                            searchQuery={searchQuery} onSearchChange={setSearchQuery}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredAgents.map(a => <AgentCard key={a.id} agent={a} onSelect={() => handleNavigateToDetail(a.id, 'agent')} showVisibility={isMyAgents} />)}
                        </div>
                    </main>
                );
            case View.PERSONAS:
            case View.MY_PERSONAS:
                 const isMyPersonas = view === View.MY_PERSONAS;
                 const filteredPersonas = filterAndSort(personas, isMyPersonas);
                 return (
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <CommunityHeader
                            title={isMyPersonas ? "My Personas" : "Community Personas"}
                            subtitle={isMyPersonas ? "Your personal collection of personas." : "Explore fun and interesting AI personas for roleplaying."}
                            showSort={true} sortOrder={sortOrder} onSortOrderChange={setSortOrder}
                            searchQuery={searchQuery} onSearchChange={setSearchQuery}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredPersonas.map(p => <PersonaCard key={p.id} persona={p} onSelect={() => handleNavigateToDetail(p.id, 'persona')} showVisibility={isMyPersonas} />)}
                        </div>
                    </main>
                );
            case View.CONTEXTS:
            case View.MY_CONTEXTS:
                 const isMyContexts = view === View.MY_CONTEXTS;
                 let filteredContexts = isMyContexts && user ? contexts.filter(c => c.author === user.name) : contexts.filter(c => c.isPublic);
                 if (searchQuery) {
                     const q = searchQuery.toLowerCase();
                     filteredContexts = filteredContexts.filter(c => 
                        c.title.toLowerCase().includes(q) ||
                        (c.description && c.description.toLowerCase().includes(q)) ||
                        c.tags.some(t => t.toLowerCase().includes(q))
                    );
                 }
                 return (
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <CommunityHeader
                            title={isMyContexts ? "My Contexts" : "Community Contexts"}
                            subtitle={isMyContexts ? "Your private context files for injection." : "Shared context files for testing."}
                            showSort={false}
                            searchQuery={searchQuery} onSearchChange={setSearchQuery}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredContexts.map(c => <ContextCard key={c.id} context={c} showVisibility={isMyContexts} />)}
                        </div>
                    </main>
                );
            case View.CREATE:
                return <CreationPage onPublish={handlePublish} onCancel={() => setView(View.HOME)} apiKeys={apiKeys} fetchedOllamaModels={fetchedOllamaModels} />;
            case View.PROFILE:
                return <ProfilePage onBack={() => setView(View.HOME)} />;
            default:
                return <HomePage onViewChange={handleViewChange} user={user} onNavigateToDetail={handleNavigateToDetail} login={login}/>;
        }
    };

    const showSidebar = view !== View.HOME;
    const showHeader = view !== View.HOME || !!user;

    return (
        <div className="h-screen w-screen flex bg-background text-primary antialiased">
            {showSidebar && <Sidebar activeView={view} onViewChange={handleViewChange} />}
            <div className="flex-1 flex flex-col min-w-0">
                {showHeader && <Header onSettingsClick={() => setIsSettingsOpen(true)} onProfileClick={() => setView(View.PROFILE)} />}
                {renderContent()}
            </div>
            {isSettingsOpen &&
                <SettingsModal
                    apiKeys={apiKeys}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={handleSaveSettings}
                    fetchedOllamaModels={fetchedOllamaModels}
                    onFetchOllamaModels={() => handleFetchOllamaModels(apiKeys.ollama)}
                />
            }
        </div>
    );
};

export default App;