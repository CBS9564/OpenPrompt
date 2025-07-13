import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { PencilIcon } from './icons/PencilIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface ProfilePageProps {
    onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
    const { user, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [website, setWebsite] = useState(user?.website || '');
    const [github, setGithub] = useState(user?.github || '');
    const [avatar, setAvatar] = useState(user?.avatarUrl || '');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            setWebsite(user.website || '');
            setGithub(user.github || '');
            setAvatar(user.avatarUrl || '');
        }
    }, [user]);
    
    const handleCancelEditing = () => {
      setIsEditing(false);
      // Reset fields to current user state
      if (user) {
        setName(user.name || '');
        setBio(user.bio || '');
        setWebsite(user.website || '');
        setGithub(user.github || '');
        setAvatar(user.avatarUrl || '');
      }
    };

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center p-6">
                <p className="text-secondary">Please log in to view your profile.</p>
            </div>
        );
    }
    
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const updatedProfile: Partial<User> = { name, bio, website, github, avatarUrl: avatar };
        updateUserProfile(updatedProfile);
        setIsEditing(false);
    };

    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors">
                        <ArrowLeftIcon className="w-5 h-5"/>
                        Back
                    </button>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-card border border-border text-primary rounded-md hover:bg-card-hover transition-colors">
                            <PencilIcon className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="bg-content p-8 rounded-xl border border-border shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        <div className="relative group flex-shrink-0">
                            <img src={avatar || `https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(user.email)}`} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-card-hover" />
                            {isEditing && (
                                <>
                                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => fileInputRef.current?.click()} className="text-white">
                                            <CameraIcon className="w-8 h-8"/>
                                        </button>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                                </>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left pt-2">
                            {isEditing ? (
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="text-3xl font-bold text-primary bg-card border border-border rounded-md p-2 w-full" placeholder="Your Name" />
                            ) : (
                                <h1 className="text-4xl font-bold text-primary tracking-tight">{name}</h1>
                            )}
                            <p className="text-secondary mt-2 text-lg">{user.email}</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">About Me</h3>
                            {isEditing ? (
                                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm" placeholder="Write a short bio..."></textarea>
                            ) : (
                                <p className="text-primary whitespace-pre-wrap leading-relaxed">{bio || <span className="text-secondary italic">No bio provided.</span>}</p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Links</h3>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input type="url" value={website} onChange={e => setWebsite(e.target.value)} className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm" placeholder="https://your-website.com" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-secondary bg-card p-2 rounded-l-md border border-r-0 border-border">github.com/</span>
                                        <input type="text" value={github} onChange={e => setGithub(e.target.value)} className="w-full p-2 bg-card border border-border rounded-r-md focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm" placeholder="your-username" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2">
                                    {website ? <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{website}</a> : <span className="text-secondary italic">No website provided.</span>}
                                    {github ? <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">github.com/{github}</a> : <span className="text-secondary italic">No GitHub provided.</span>}
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 pt-6 border-t border-border flex justify-end gap-4">
                            <button onClick={handleCancelEditing} className="px-5 py-2.5 bg-card border border-border text-primary font-semibold rounded-md hover:bg-card-hover transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="px-5 py-2.5 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;