import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as db from '../services/dbService';
import { User, Comment, Prompt, Agent, Persona } from '../types';

const AdminPage: React.FC = () => {
    const { token, user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'prompts' | 'agents' | 'personas' | 'comments'>('users');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editingItem, setEditingItem] = useState<Prompt | Agent | Persona | null>(null);

    const fetchData = async () => {
        if (!token) return;
        try {
            setUsers(await db.getUsers(token));
            setComments(await db.getAdminComments(token));
            setPrompts(await db.getPrompts(token));
            setAgents(await db.getAgents(token));
            setPersonas(await db.getPersonas(token));
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        }
    };

    useEffect(() => {
        if (user?.role !== 'admin') {
            // Redirect or show unauthorized message
            return;
        }
        fetchData();
    }, [token, user]);

    const handleDeleteUser = async (userId: string) => {
        if (!token || !window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await db.deleteUser(userId, token);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser({ ...user });
    };

    const handleSaveUser = async () => {
        if (!editingUser || !token) return;
        try {
            await db.updateUser(editingUser, token);
            setUsers(users.map(u => (u.id === editingUser.id ? editingUser : u)));
            setEditingUser(null);
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!token || !window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            await db.deleteAdminComment(commentId, token);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const handleEditItem = (item: Prompt | Agent | Persona, type: 'prompt' | 'agent' | 'persona') => {
        setEditingItem({ ...item, type });
    };

    const handleSaveItem = async () => {
        if (!editingItem || !token) return;
        try {
            switch (editingItem.type) {
                case 'prompt':
                    await db.updatePrompt(editingItem as Prompt, token);
                    setPrompts(prompts.map(p => (p.id === editingItem.id ? editingItem as Prompt : p)));
                    break;
                case 'agent':
                    await db.updateAgent(editingItem as Agent, token);
                    setAgents(agents.map(a => (a.id === editingItem.id ? editingItem as Agent : a)));
                    break;
                case 'persona':
                    await db.updatePersona(editingItem as Persona, token);
                    setPersonas(personas.map(p => (p.id === editingItem.id ? editingItem as Persona : p)));
                    break;
            }
            setEditingItem(null);
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    };

    const handleDeleteItem = async (itemId: string, itemType: 'prompt' | 'agent' | 'persona') => {
        if (!token || !window.confirm(`Are you sure you want to delete this ${itemType}?`)) return;
        try {
            switch(itemType) {
                case 'prompt': await db.deletePrompt(itemId, token); setPrompts(prompts.filter(p => p.id !== itemId)); break;
                case 'agent': await db.deleteAgent(itemId, token); setAgents(agents.filter(a => a.id !== itemId)); break;
                case 'persona': await db.deletePersona(itemId, token); setPersonas(personas.filter(p => p.id !== itemId)); break;
            }
        } catch (error) {
            console.error(`Failed to delete ${itemType}:`, error);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p>You do not have administrative privileges to view this page.</p>
            </main>
        );
    }

    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <div className="tabs mb-4">
                <button className={`tab tab-bordered ${activeTab === 'users' ? 'tab-active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
                <button className={`tab tab-bordered ${activeTab === 'prompts' ? 'tab-active' : ''}`} onClick={() => setActiveTab('prompts')}>Prompts</button>
                <button className={`tab tab-bordered ${activeTab === 'agents' ? 'tab-active' : ''}`} onClick={() => setActiveTab('agents')}>Agents</button>
                <button className={`tab tab-bordered ${activeTab === 'personas' ? 'tab-active' : ''}`} onClick={() => setActiveTab('personas')}>Personas</button>
                <button className={`tab tab-bordered ${activeTab === 'comments' ? 'tab-active' : ''}`} onClick={() => setActiveTab('comments')}>Comments</button>
            </div>

            {activeTab === 'users' && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Manage Users</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.email}</td>
                                        <td>{u.name}</td>
                                        <td>{u.role}</td>
                                        <td>
                                            <button className="btn btn-sm btn-info mr-2" onClick={() => handleEditUser(u)}>Edit</button>
                                            <button className="btn btn-sm btn-error" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'prompts' && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Manage Prompts</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Public</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prompts.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.title}</td>
                                        <td>{p.author}</td>
                                        <td>{p.isPublic ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-info mr-2" onClick={() => handleEditItem(p, 'prompt')}>Edit</button>
                                            <button className="btn btn-sm btn-error" onClick={() => handleDeleteItem(p.id, 'prompt')}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'agents' && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Manage Agents</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Public</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map(a => (
                                    <tr key={a.id}>
                                        <td>{a.id}</td>
                                        <td>{a.title}</td>
                                        <td>{a.author}</td>
                                        <td>{a.isPublic ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-info mr-2" onClick={() => handleEditItem(a, 'agent')}>Edit</button>
                                            <button className="btn btn-sm btn-error" onClick={() => handleDeleteItem(a.id, 'agent')}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'personas' && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Manage Personas</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Public</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {personas.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.title}</td>
                                        <td>{p.author}</td>
                                        <td>{p.isPublic ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-info mr-2" onClick={() => handleEditItem(p, 'persona')}>Edit</button>
                                            <button className="btn btn-sm btn-error" onClick={() => handleDeleteItem(p.id, 'persona')}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'comments' && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Manage Comments</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Item ID</th>
                                    <th>Author</th>
                                    <th>Content</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.itemId}</td>
                                        <td>{c.authorName}</td>
                                        <td>{c.content}</td>
                                        <td>
                                            <button className="btn btn-sm btn-error" onClick={() => handleDeleteComment(c.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                    value={editingUser.name || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary">Avatar URL</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                    value={editingUser.avatarUrl || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, avatarUrl: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary">Role</label>
                                <select
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                    value={editingUser.role || 'user'}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'user' | 'admin' })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="btn btn-ghost" onClick={() => setEditingUser(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveUser}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit {editingItem.type.charAt(0).toUpperCase() + editingItem.type.slice(1)}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary">Title</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                    value={editingItem.title || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary">Description</label>
                                <textarea
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                    value={editingItem.description || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                    value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : editingItem.tags || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                />
                            </div>
                            {'text' in editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary">Text</label>
                                    <textarea
                                        className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                        value={(editingItem as Prompt).text || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                                    />
                                </div>
                            )}
                            {'systemInstruction' in editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary">System Instruction</label>
                                    <textarea
                                        className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                        value={(editingItem as Agent | Persona).systemInstruction || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, systemInstruction: e.target.value })}
                                    />
                                </div>
                            )}
                            {'category' in editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary">Category</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                        value={(editingItem as Prompt).category || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                    />
                                </div>
                            )}
                            {'supportedInputs' in editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary">Supported Inputs (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-border rounded-md bg-background text-primary"
                                        value={Array.isArray((editingItem as Prompt).supportedInputs) ? (editingItem as Prompt).supportedInputs?.join(', ') : (editingItem as Prompt).supportedInputs || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, supportedInputs: e.target.value.split(',').map(input => input.trim()) })}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-secondary">Is Public</label>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={editingItem.isPublic}
                                    onChange={(e) => setEditingItem({ ...editingItem, isPublic: e.target.checked })}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="btn btn-ghost" onClick={() => setEditingItem(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveItem}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AdminPage;