import { Prompt, Agent, Persona, ContextItem, Comment, Attachment, User } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // Replace with your backend URL in production

interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
}

const fetchApi = async <T>(endpoint: string, method: string = 'GET', body?: any, token?: string): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };
    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Redirect to login page if unauthorized or forbidden
                window.location.href = '/'; // Assuming '/' is your login page
            }
            return { error: data.message || response.statusText };
        }
        return { data };
    } catch (error: any) {
        return { error: error.message || 'Network error' };
    }
};

// Prompts
export const getPrompts = async (token: string): Promise<Prompt[]> => {
    const { data, error } = await fetchApi<Prompt[]>('/prompts', 'GET', undefined, token);
    if (error) {
        console.error("Error fetching prompts:", error);
        return [];
    }
    return data || [];
};

export const getPromptById = async (id: string, token: string): Promise<Prompt | null> => {
    const { data, error } = await fetchApi<Prompt>(`/prompts/${id}`, 'GET', undefined, token);
    if (error) {
        console.error(`Error fetching prompt ${id}:`, error);
        return null;
    }
    return data || null;
};

export const addPrompt = async (prompt: Prompt, attachments: Omit<Attachment, 'id' | 'itemId'>[] = [], token: string) => {
    const { error } = await fetchApi('/prompts', 'POST', { ...prompt, attachments }, token);
    if (error) {
        console.error("Error adding prompt:", error);
        throw new Error(error);
    }
};

export const updatePrompt = async (prompt: Prompt, token: string) => {
    const { error } = await fetchApi(`/prompts/${prompt.id}`, 'PUT', prompt, token);
    if (error) {
        console.error("Error updating prompt:", error);
        throw new Error(error);
    }
};

export const deletePrompt = async (id: string, token: string) => {
    const { error } = await fetchApi(`/prompts/${id}`, 'DELETE', undefined, token);
    if (error) {
        console.error("Error deleting prompt:", error);
        throw new Error(error);
    }
};

// Agents
export const getAgents = async (token: string): Promise<Agent[]> => {
    const { data, error } = await fetchApi<Agent[]>('/agents', 'GET', undefined, token);
    if (error) {
        console.error("Error fetching agents:", error);
        return [];
    }
    return data || [];
};

export const getAgentById = async (id: string, token: string): Promise<Agent | null> => {
    const { data, error } = await fetchApi<Agent>(`/agents/${id}`, 'GET', undefined, token);
    if (error) {
        console.error(`Error fetching agent ${id}:`, error);
        return null;
    }
    return data || null;
};

export const addAgent = async (agent: Agent, attachments: Omit<Attachment, 'id' | 'itemId'>[] = [], token: string) => {
    const { error } = await fetchApi('/agents', 'POST', { ...agent, attachments }, token);
    if (error) {
        console.error("Error adding agent:", error);
        throw new Error(error);
    }
};

export const updateAgent = async (agent: Agent, token: string) => {
    const { error } = await fetchApi(`/agents/${agent.id}`, 'PUT', agent, token);
    if (error) {
        console.error("Error updating agent:", error);
        throw new Error(error);
    }
};

export const deleteAgent = async (id: string, token: string) => {
    const { error } = await fetchApi(`/agents/${id}`, 'DELETE', undefined, token);
    if (error) {
        console.error("Error deleting agent:", error);
        throw new Error(error);
    }
};

// Personas
export const getPersonas = async (token: string): Promise<Persona[]> => {
    const { data, error } = await fetchApi<Persona[]>('/personas', 'GET', undefined, token);
    if (error) {
        console.error("Error fetching personas:", error);
        return [];
    }
    return data || [];
};

export const getPersonaById = async (id: string, token: string): Promise<Persona | null> => {
    const { data, error } = await fetchApi<Persona>(`/personas/${id}`, 'GET', undefined, token);
    if (error) {
        console.error(`Error fetching persona ${id}:`, error);
        return null;
    }
    return data || null;
};

export const addPersona = async (persona: Persona, attachments: Omit<Attachment, 'id' | 'itemId'>[] = [], token: string) => {
    const { error } = await fetchApi('/personas', 'POST', { ...persona, attachments }, token);
    if (error) {
        console.error("Error adding persona:", error);
        throw new Error(error);
    }
};

export const updatePersona = async (persona: Persona, token: string) => {
    const { error } = await fetchApi(`/personas/${persona.id}`, 'PUT', persona, token);
    if (error) {
        console.error("Error updating persona:", error);
        throw new Error(error);
    }
};

export const deletePersona = async (id: string, token: string) => {
    const { error } = await fetchApi(`/personas/${id}`, 'DELETE', undefined, token);
    if (error) {
        console.error("Error deleting persona:", error);
        throw new Error(error);
    }
};

// Contexts
export const getContexts = async (token: string): Promise<ContextItem[]> => {
    const { data, error } = await fetchApi<ContextItem[]>('/contexts', 'GET', undefined, token);
    if (error) {
        console.error("Error fetching contexts:", error);
        return [];
    }
    return data || [];
};

export const addContext = async (context: ContextItem, token: string) => {
    const { data, error } = await fetchApi('/contexts', 'POST', context, token);
    if (error) {
        console.error("Error adding context:", error);
        throw new Error(error);
    }
    return { data };
};

// Social Features
export const getCommentsForItem = async (itemId: string, token: string): Promise<Comment[]> => {
    const { data, error } = await fetchApi<Comment[]>(`/comments/${itemId}`, 'GET', undefined, token);
    if (error) {
        console.error(`Error fetching comments for item ${itemId}:`, error);
        return [];
    }
    return data || [];
};

export const hasUserLikedItem = async (itemId: string, userId: string, token: string): Promise<boolean> => {
    const { data, error } = await fetchApi<{ hasLiked: boolean }>(`/likes/${itemId}/${userId}`, 'GET', undefined, token);
    if (error) {
        console.error(`Error checking like status for item ${itemId} by user ${userId}:`, error);
        return false;
    }
    return data?.hasLiked || false;
};

export const addLike = async (itemId: string, userId: string, token: string) => {
    const { error } = await fetchApi('/likes', 'POST', { itemId, userId }, token);
    if (error) {
        console.error("Error adding like:", error);
        throw new Error(error);
    }
};

export const removeLike = async (itemId: string, userId: string, token: string) => {
    const { error } = await fetchApi('/likes', 'DELETE', { itemId, userId }, token);
    if (error) {
        console.error("Error removing like:", error);
        throw new Error(error);
    }
};

export const addComment = async (comment: Comment, token: string) => {
    const { error } = await fetchApi('/comments', 'POST', comment, token);
    if (error) {
        console.error("Error adding comment:", error);
        throw new Error(error);
    }
};

// Auth
export const registerUser = async (email: string, password: string, name?: string): Promise<ApiResponse<{ userId: string }>> => {
    return fetchApi<{ userId: string }>('/auth/register', 'POST', { email, password, name });
};

export const loginUser = async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    return fetchApi<{ token: string; user: User }>('/auth/login', 'POST', { email, password });
};

// Admin
export const getUsers = async (token: string): Promise<User[]> => {
    const { data, error } = await fetchApi<User[]>('/admin/users', 'GET', undefined, token);
    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    return data || [];
};

export const deleteUser = async (id: string, token: string) => {
    const { error } = await fetchApi(`/admin/users/${id}`, 'DELETE', undefined, token);
    if (error) {
        console.error("Error deleting user:", error);
        throw new Error(error);
    }
};

export const updateUser = async (user: User, token: string) => {
    const { error } = await fetchApi(`/admin/users/${user.id}`, 'PUT', user, token);
    if (error) {
        console.error("Error updating user:", error);
        throw new Error(error);
    }
};

export const getAdminComments = async (token: string): Promise<Comment[]> => {
    const { data, error } = await fetchApi<Comment[]>('/admin/comments', 'GET', undefined, token);
    if (error) {
        console.error("Error fetching admin comments:", error);
        return [];
    }
    return data || [];
};

export const deleteAdminComment = async (id: string, token: string) => {
    const { error } = await fetchApi(`/admin/comments/${id}`, 'DELETE', undefined, token);
    if (error) {
        console.error("Error deleting admin comment:", error);
        throw new Error(error);
    }
};


export const exportDbAsFile = async () => { console.warn("exportDbAsFile is deprecated. Data is now managed by the backend."); };
export const importDbFromFile = async (file: File) => { console.warn("importDbFromFile is deprecated. Data is now managed by the backend."); };
