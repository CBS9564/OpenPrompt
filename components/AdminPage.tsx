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
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background text-primary">
            <h1 className="text-3xl font-bold mb-6 text-accent">Admin Dashboard</h1>

            <div className="flex border-b border-border mb-6">
                <button className={`py-2 px-4 text-lg font-medium ${activeTab === 'users' ? 'border-b-2 border-accent text-accent' : 'text-secondary hover:text-primary'}`} onClick={() => setActiveTab('users')}>Users</button>
                <button className={`py-2 px-4 text-lg font-medium ${activeTab === 'prompts' ? 'border-b-2 border-accent text-accent' : 'text-secondary hover:text-primary'}`} onClick={() => setActiveTab('prompts')}>Prompts</button>
                <button className={`py-2 px-4 text-lg font-medium ${activeTab === 'agents' ? 'border-b-2 border-accent text-accent' : 'text-secondary hover:text-primary'}`} onClick={() => setActiveTab('agents')}>Agents</button>
                <button className={`py-2 px-4 text-lg font-medium ${activeTab === 'personas' ? 'border-b-2 border-accent text-accent' : 'text-secondary hover:text-primary'}`} onClick={() => setActiveTab('personas')}>Personas</button>
                <button className={`py-2 px-4 text-lg font-medium ${activeTab === 'comments' ? 'border-b-2 border-accent text-accent' : 'text-secondary hover:text-primary'}`} onClick={() => setActiveTab('comments')}>Comments</button>
            </div>

            {activeTab === 'users' && (
                <div className="bg-card p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Manage Users</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-background rounded-lg overflow-hidden">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-left">Name</th>
                                    <th className="py-3 px-4 text-left">Role</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-secondary">
                                {users.map(u => (
                                    <tr key={u.id} className="border-t border-border">
                                        <td className="py-3 px-4">{u.id}</td>
                                        <td className="py-3 px-4">{u.email}</td>
                                        <td className="py-3 px-4">{u.name}</td>
                                        <td className="py-3 px-4">{u.role}</td>
                                        <td className="py-3 px-4">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2" onClick={() => handleEditUser(u)}>Edit</button>
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'prompts' && (
                <div className="bg-card p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Manage Prompts</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-background rounded-lg overflow-hidden">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Title</th>
                                    <th className="py-3 px-4 text-left">Author</th>
                                    <th className="py-3 px-4 text-left">Public</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-secondary">
                                {prompts.map(p => (
                                    <tr key={p.id} className="border-t border-border">
                                        <td className="py-3 px-4">{p.id}</td>
                                        <td className="py-3 px-4">{p.title}</td>
                                        <td className="py-3 px-4">{p.author}</td>
                                        <td className="py-3 px-4">{p.isPublic ? 'Yes' : 'No'}</td>
                                        <td className="py-3 px-4">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2" onClick={() => handleEditItem(p, 'prompt')}>Edit</button>
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={() => handleDeleteItem(p.id, 'prompt')}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'agents' && (
                <div className="bg-card p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Manage Agents</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-background rounded-lg overflow-hidden">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Title</th>
                                    <th className="py-3 px-4 text-left">Author</th>
                                    <th className="py-3 px-4 text-left">Public</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-secondary">
                                {agents.map(a => (
                                    <tr key={a.id} className="border-t border-border">
                                        <td className="py-3 px-4">{a.id}</td>
                                        <td className="py-3 px-4">{a.title}</td>
                                        <td className="py-3 px-4">{a.author}</td>
                                        <td className="py-3 px-4">{a.isPublic ? 'Yes' : 'No'}</td>
                                        <td className="py-3 px-4">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2" onClick={() => handleEditItem(a, 'agent')}>Edit</button>
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={() => handleDeleteItem(a.id, 'agent')}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'personas' && (
                <div className="bg-card p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Manage Personas</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-background rounded-lg overflow-hidden">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Title</th>
                                    <th className="py-3 px-4 text-left">Author</th>
                                    <th className="py-3 px-4 text-left">Public</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-secondary">
                                {personas.map(p => (
                                    <tr key={p.id} className="border-t border-border">
                                        <td className="py-3 px-4">{p.id}</td>
                                        <td className="py-3 px-4">{p.title}</td>
                                        <td className="py-3 px-4">{p.author}</td>
                                        <td className="py-3 px-4">{p.isPublic ? 'Yes' : 'No'}</td>
                                        <td className="py-3 px-4">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2" onClick={() => handleEditItem(p, 'persona')}>Edit</button>
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={() => handleDeleteItem(p.id, 'persona')}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'comments' && (
                <div className="bg-card p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Manage Comments</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-background rounded-lg overflow-hidden">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Item ID</th>
                                    <th className="py-3 px-4 text-left">Author</th>
                                    <th className="py-3 px-4 text-left">Content</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-secondary">
                                {comments.map(c => (
                                    <tr key={c.id} className="border-t border-border">
                                        <td className="py-3 px-4">{c.id}</td>
                                        <td className="py-3 px-4">{c.itemId}</td>
                                        <td className="py-3 px-4">{c.authorName}</td>
                                        <td className="py-3 px-4">{c.content}</td>
                                        <td className="py-3 px-4">
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={() => handleDeleteComment(c.id)}>Delete</button>
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
                    <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md border border-border">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Edit User</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={editingUser.name || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Avatar URL</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={editingUser.avatarUrl || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, avatarUrl: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Role</label>
                                <select
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={editingUser.role || 'user'}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'user' | 'admin' })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={() => setEditingUser(null)}>Cancel</button>
                            <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90" onClick={handleSaveUser}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md border border-border">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Edit {editingItem.type.charAt(0).toUpperCase() + editingItem.type.slice(1)}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={editingItem.title || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={editingItem.description || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : editingItem.tags || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                />
                            </div>
                            {'text' in editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Text</label>
                                    <textarea
                                        className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                        value={(editingItem as Prompt).text || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                                    />
                                </div>
                            )}
                            {'systemInstruction' in editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">System Instruction</label>
                                    <textarea
                                        className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                        value={(editingItem as Agent | Persona).systemInstruction || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, systemInstruction: e.target.value })}
                                    />
                                </div>
                            )}
                            {'category' in editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Category</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                        value={(editingItem as Prompt).category || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                    />
                                </div>
                            )}
                            {'supportedInputs' in editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Supported Inputs (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                        value={Array.isArray((editingItem as Prompt).supportedInputs) ? (editingItem as Prompt).supportedInputs?.join(', ') : (editingItem as Prompt).supportedInputs || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, supportedInputs: e.target.value.split(',').map(input => input.trim()) })}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Is Public</label>
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-accent rounded focus:ring-accent"
                                    checked={editingItem.isPublic}
                                    onChange={(e) => setEditingItem({ ...editingItem, isPublic: e.target.checked })}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={() => setEditingItem(null)}>Cancel</button>
                            <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90" onClick={handleSaveItem}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
    };

export default AdminPage;