


import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import AdminPage from './components/AdminPage'; // Import the new AdminPage

const AppContent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, login } = useAuth(); // Get token from useAuth
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
            try {
                if (token) { // Only load data if authenticated
                    await loadAllData(token);
                }
                const savedKeys = localStorage.getItem('openprompt_apikeys');
                if (savedKeys) {
                    setApiKeys(JSON.parse(savedKeys));
                }
            } catch (error) {
                console.error("Failed to initialize the database:", error);
            }
        };
        initDb();

        // Redirect if trying to access /create without being logged in
        if (location.pathname === '/create' && !user) {
            navigate('/');
        }
    }, [token, user, location.pathname, navigate]); // Re-run when token, user, or path changes

    // Data Loading
    const loadAllData = useCallback(async (authToken: string) => {
        try {
            setPrompts(await db.getPrompts(authToken));
            setAgents(await db.getAgents(authToken));
            setPersonas(await db.getPersonas(authToken));
            setContexts(await db.getContexts(authToken));
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    }, []);

    // Load social data when detail item changes
    useEffect(() => {
        const loadSocialData = async () => {
            if (selectedDetailItem && user && token) {
                try {
                    setComments(await db.getCommentsForItem(selectedDetailItem.id, token));
                    setIsLiked(await db.hasUserLikedItem(selectedDetailItem.id, user.email, token));
                } catch (error) {
                    console.error("Failed to load social data:", error);
                }
            } else {
                setComments([]);
                setIsLiked(false);
            }
        };
        loadSocialData();
    }, [selectedDetailItem, user, token]);
    
    // Navigation Handlers
    const handleViewChange = (newView: View) => {
        setSelectedDetailItem(null);
        setSearchQuery('');
        navigate(newView);
    };

    const handleNavigateToDetail = async (id: string, type: 'prompt' | 'agent' | 'persona') => {
        if (!token) return; // Require token for detail view
        let item: PlaygroundItem | null = null;
        try {
            switch(type) {
                case 'prompt': 
                    const p = await db.getPromptById(id, token);
                    if(p) item = {...p, type: 'prompt'};
                    break;
                case 'agent':
                    const a = await db.getAgentById(id, token);
                    if(a) item = {...a, type: 'agent'};
                    break;
                case 'persona':
                    const pe = await db.getPersonaById(id, token);
                    if(pe) item = {...pe, type: 'persona'};
                    break;
            }
            if (item) {
                setSelectedDetailItem(item);
            }
        } catch (error) {
            console.error("Failed to navigate to detail:", error);
        }
    };
    
    // CRUD Handlers
    const handlePublish = async (item: PublishableItem) => {
        if (!token) return; // Require token for publish
        const baseItem = {
            title: item.title,
            description: item.description,
            tags: item.tags,
            author: user?.name || "Anonymous",
            createdAt: Date.now(),
            isPublic: item.isPublic,
            isRecommended: false,
        };

        try {
            let response;
            switch(item.type) {
                case 'prompt':
                    response = await db.addPrompt({ ...baseItem, text: item.content, category: item.category || 'General', supportedInputs: [] }, item.attachments, token);
                    break;
                case 'agent':
                    response = await db.addAgent({ ...baseItem, systemInstruction: item.content }, item.attachments, token);
                    break;
                case 'persona':
                    response = await db.addPersona({ ...baseItem, systemInstruction: item.content }, item.attachments, token);
                    break;
                case 'context':
                    response = await db.addContext({ ...baseItem, content: item.content }, token);
                    break;
            }
            if (response?.data?.id) {
                console.log(`${item.type} added with ID:`, response.data.id);
            } else {
                console.warn(`No ID returned for ${item.type} creation.`);
            }
            await loadAllData(token);
            handleViewChange(View.HOME);
        } catch (error) {
            console.error("Failed to publish item:", error);
        }
    };

    const handleUpdateItem = async (item: PlaygroundItem) => {
        if (!token) return; // Require token for update
        try {
            switch(item.type) {
                case 'prompt': await db.updatePrompt(item, token); break;
                case 'agent': await db.updateAgent(item, token); break;
                case 'persona': await db.updatePersona(item, token); break;
            }
            await loadAllData(token);
            setSelectedDetailItem(item); // Keep viewing the updated item
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    };
    
    const handleDeleteItem = async (item: PlaygroundItem) => {
        if (!token) return; // Require token for delete
        if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
        try {
            switch(item.type) {
                case 'prompt': await db.deletePrompt(item.id, token); break;
                case 'agent': await db.deleteAgent(item.id, token); break;
                case 'persona': await db.deletePersona(item.id, token); break;
            }
            await loadAllData(token);
            setSelectedDetailItem(null);
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };
    
    // Settings Handlers
    const handleSaveSettings = (keys: ApiKeys) => {
        setApiKeys(keys);
        localStorage.setItem('openprompt_apikeys', JSON.stringify(keys));
        setIsSettingsOpen(false);
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
        if (!user || !token) return; // Require user and token for like
        try {
            if (isCurrentlyLiked) {
                await db.removeLike(itemId, user.email, token);
            } else {
                await db.addLike(itemId, user.email, token);
            }
            setIsLiked(!isCurrentlyLiked);
            await loadAllData(token);

            const currentItem = selectedDetailItem;
            if (!currentItem) return;

            let playgroundItem: PlaygroundItem | null = null;
            switch(currentItem.type) {
                case 'prompt': {
                    const p = await db.getPromptById(itemId, token);
                    if (p) playgroundItem = {...p, type: 'prompt'};
                    break;
                }
                case 'agent': {
                    const a = await db.getAgentById(itemId, token);
                    if (a) playgroundItem = {...a, type: 'agent'};
                    break;
                }
                case 'persona': {
                    const pe = await db.getPersonaById(itemId, token);
                    if (pe) playgroundItem = {...pe, type: 'persona'};
                    break;
                }
            }

            if (playgroundItem) {
                 setSelectedDetailItem(playgroundItem);
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };
    
    const handleAddComment = async (itemId: string, content: string) => {
        if (!user || !token) return; // Require user and token for comment
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            itemId,
            userId: user.email,
            authorName: user.name,
            authorAvatar: user.avatarUrl,
            content,
            createdAt: Date.now(),
        };
        try {
            await db.addComment(newComment, token);
            setComments(await db.getCommentsForItem(itemId, token));
            await loadAllData(token);
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

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
        
        const isPromptView = location.pathname.includes('/prompts');

        if (isPromptView && multimodalFilter !== 'all') {
            filtered = filtered.filter(p => (p as Prompt).supportedInputs?.includes(multimodalFilter));
        }

        if (sortOrder === 'recent') {
            filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        } else {
            filtered.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
        }

        return filtered;
    };

    const renderListPage = (title: string, subtitle: string, items: (Prompt[] | Agent[] | Persona[]), cardComponent: React.ElementType, itemType: 'prompt' | 'agent' | 'persona', isMyLibrary: boolean) => {
        const filteredItems = filterAndSort(items as any, isMyLibrary);
        return (
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <CommunityHeader
                    title={title}
                    subtitle={subtitle}
                    showSort={true} sortOrder={sortOrder} onSortOrderChange={setSortOrder}
                    searchQuery={searchQuery} onSearchChange={setSearchQuery}
                    showMultimodalFilter={itemType === 'prompt'}
                    multimodalFilter={multimodalFilter} onMultimodalFilterChange={setMultimodalFilter}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map((item: any) => React.createElement(cardComponent, { key: item.id, [itemType]: item, onSelect: () => handleNavigateToDetail(item.id, itemType), showVisibility: isMyLibrary }))}
                </div>
            </main>
        );
    };

    const showSidebar = location.pathname !== '/';
    const showHeader = location.pathname !== '/' || !!user;

    return (
        <div className="h-screen w-screen flex bg-background text-primary antialiased">
            {showSidebar && <Sidebar activeView={location.pathname as View} onViewChange={handleViewChange} />}
            <div className="flex-1 flex flex-col min-w-0">
                {showHeader && <Header onSettingsClick={() => setIsSettingsOpen(true)} onProfileClick={() => navigate('/profile')} navigate={navigate} />}
                
                {selectedDetailItem ? (
                    <DetailPage
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
                ) : (
                    <Routes>
                        <Route path="/" element={<HomePage onViewChange={handleViewChange} user={user} onNavigateToDetail={handleNavigateToDetail} login={login}/>} />
                        <Route path="/prompts" element={renderListPage("Community Prompts", "Explore prompts created by the community.", prompts, PromptCard, 'prompt', false)} />
                        <Route path="/my-prompts" element={renderListPage("My Prompts", "Your personal collection of prompts.", prompts, PromptCard, 'prompt', true)} />
                        <Route path="/agents" element={renderListPage("Community Agents", "Explore pre-configured AI agents with specific behaviors.", agents, AgentCard, 'agent', false)} />
                        <Route path="/my-agents" element={renderListPage("My Agents", "Your personal collection of agents.", agents, AgentCard, 'agent', true)} />
                        <Route path="/personas" element={renderListPage("Community Personas", "Explore fun and interesting AI personas for roleplaying.", personas, PersonaCard, 'persona', false)} />
                        <Route path="/my-personas" element={renderListPage("My Personas", "Your personal collection of personas.", personas, PersonaCard, 'persona', true)} />
                        <Route path="/create" element={<CreationPage onPublish={handlePublish} onCancel={() => navigate('/')} apiKeys={apiKeys} fetchedOllamaModels={fetchedOllamaModels} />} />
                        <Route path="/profile" element={<ProfilePage onBack={() => navigate(-1)} />} />
                        {user?.role === 'admin' && <Route path="/admin" element={<AdminPage />} />}
                    </Routes>
                )}
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

const App: React.FC = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
