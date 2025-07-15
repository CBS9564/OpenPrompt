import React, { useState, useEffect, useMemo } from 'react';
import { DetailPageProps, PlaygroundItem, Attachment } from '../types';
import Playground from './Playground';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { HeartIcon } from './icons/HeartIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ImageIcon } from './icons/ImageIcon';
import { LinkIcon } from './icons/LinkIcon';
import { PdfIcon } from './icons/PdfIcon';
import { CsvIcon } from './icons/CsvIcon';

const DetailPage: React.FC<DetailPageProps> = ({
    item, onUpdate, onDelete, onBack, apiKeys,
    fetchedOllamaModels, contexts, comments, isLiked, onToggleLike, onAddComment,
    selectedLLMProvider, selectedLLMModel, onSaveLLMSettings
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Form state
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [tags, setTags] = useState(item.tags.join(', '));
  const [content, setContent] = useState(item.type === 'prompt' ? item.text : item.systemInstruction);
  const [category, setCategory] = useState(item.type === 'prompt' ? item.category : '');
  const [isPublic, setIsPublic] = useState(item.isPublic);

  useEffect(() => {
    setTitle(item.title);
    setDescription(item.description);
    setTags(item.tags.join(', '));
    setContent(item.type === 'prompt' ? item.text : item.systemInstruction);
    setCategory(item.type === 'prompt' ? item.category : '');
    setIsPublic(item.isPublic);
    setNewComment('');
    setIsEditing(false);
  }, [item]);

  const isAuthor = user?.name === item.author;

  const handleSave = () => {
    const commonUpdates = {
        title,
        description,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        isPublic,
    };

    let updatedItem: PlaygroundItem;

    switch(item.type) {
        case 'prompt':
            updatedItem = {
                ...item,
                ...commonUpdates,
                text: content,
                category,
            };
            break;
        case 'agent':
            updatedItem = {
                ...item,
                ...commonUpdates,
                systemInstruction: content,
            };
            break;
        case 'persona':
            updatedItem = {
                ...item,
                ...commonUpdates,
                systemInstruction: content,
            };
            break;
        default:
            return; // Should not happen
    }
    onUpdate(updatedItem);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset form fields to original item values
    setTitle(item.title);
    setDescription(item.description);
    setTags(item.tags.join(', '));
    setContent(item.type === 'prompt' ? item.text : item.systemInstruction);
    setIsPublic(item.isPublic);
    if (item.type === 'prompt') {
      setCategory(item.category);
    }
    setIsEditing(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
        onAddComment(item.id, newComment.trim());
        setNewComment('');
    }
  };
  
  const AttachmentIcon: React.FC<{att: Attachment}> = ({ att }) => {
    if (att.type === 'url') return <LinkIcon className="w-5 h-5 text-secondary flex-shrink-0" />;
    if (att.mimeType === 'application/pdf') return <PdfIcon className="w-5 h-5 text-secondary flex-shrink-0" />;
    if (att.mimeType?.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-secondary flex-shrink-0" />;
    if (att.mimeType === 'text/csv') return <CsvIcon className="w-5 h-5 text-secondary flex-shrink-0" />;
    return <DocumentTextIcon className="w-5 h-5 text-secondary flex-shrink-0" />;
  };


  const DetailItem: React.FC<{label: string, value?: string, children?: React.ReactNode}> = ({label, value, children}) => (
    <div>
        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">{label}</h3>
        {children || <p className="text-base text-primary mt-1">{value || 'N/A'}</p>}
    </div>
  );

  const EditField: React.FC<{label: string, id: string, value: string, onChange: (val: string) => void, placeholder?: string, isTextarea?: boolean, rows?: number, mono?: boolean}> = 
    ({label, id, value, onChange, placeholder, isTextarea, rows, mono}) => {
    const commonClasses = `w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary`;
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-secondary mb-2">{label}</label>
            {isTextarea ? (
                <textarea 
                    id={id} 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows || 3}
                    placeholder={placeholder}
                    className={`${commonClasses} ${mono ? 'font-mono' : ''}`}
                />
            ) : (
                <input 
                    type="text" 
                    id={id}
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={commonClasses}
                />
            )}
        </div>
    );
  }

  const timeSince = (date: number) => {
    const seconds = Math.floor((new Date().getTime() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  const renderDetails = () => (
    <div className="space-y-6">
        <DetailItem label="Description" value={item.description} />
        {item.type === 'prompt' && <DetailItem label="Category" value={item.category} />}
        <DetailItem label="Tags">
            <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map(tag => <span key={tag} className="px-2.5 py-0.5 text-xs font-medium bg-card-hover text-secondary rounded-full">{tag}</span>)}
            </div>
        </DetailItem>
        {item.attachments && item.attachments.length > 0 && (
            <DetailItem label="Attachments">
                <div className="mt-2 space-y-2">
                    {item.attachments.map(att => (
                        <a 
                           key={att.id} 
                           href={att.type === 'url' ? att.content : att.content} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           download={att.type === 'file' ? att.name : undefined}
                           className="flex items-center gap-3 bg-card-hover p-2 rounded-md transition-colors hover:bg-card"
                        >
                            <AttachmentIcon att={att} />
                            <span className="text-sm text-primary truncate">{att.name}</span>
                        </a>
                    ))}
                </div>
            </DetailItem>
        )}
        <DetailItem label={item.type === 'prompt' ? "Prompt Template" : "System Instruction"}>
            <pre className="mt-2 p-4 bg-background rounded-md text-sm text-primary whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                {content}
            </pre>
        </DetailItem>
        <DetailItem label="Author" value={item.author} />
    </div>
  );

  const renderEditForm = () => (
    <div className="space-y-6">
        <EditField label="Title" id="edit-title" value={title} onChange={setTitle} placeholder="A clear and concise title" />
        <EditField label="Description" id="edit-desc" value={description} onChange={setDescription} isTextarea placeholder="A short explanation of what this is." />
        {item.type === 'prompt' && <EditField label="Category" id="edit-cat" value={category} onChange={setCategory} placeholder="e.g., Creative Writing" />}
        <EditField label="Tags (comma-separated)" id="edit-tags" value={tags} onChange={setTags} placeholder="Fun, Roleplay, Technical" />
        <EditField 
            label={item.type === 'prompt' ? "Prompt Template" : "System Instruction"}
            id="edit-content"
            value={content}
            onChange={setContent}
            isTextarea
            rows={12}
            mono
        />
        <div>
            <label className="block text-sm font-medium text-secondary mb-3">Visibility</label>
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
    </div>
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <main className="flex-1 w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors">
                    <ArrowLeftIcon className="w-5 h-5"/>
                    Back to list
                </button>
                {isAuthor && !isEditing && (
                     <div className="flex items-center gap-2">
                        <button onClick={() => onDelete(item)} className="p-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-card border border-border text-primary rounded-md hover:bg-card-hover transition-colors">
                            <PencilIcon className="w-4 h-4" />
                            Edit
                        </button>
                     </div>
                )}
            </div>
            
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary">{isEditing ? `Editing: ${item.title}`: item.title}</h1>
                 <div className="mt-4 flex items-center gap-6 text-secondary">
                    <button
                        onClick={() => onToggleLike(item.id, isLiked)}
                        disabled={!user}
                        className={`flex items-center gap-2 transition-colors disabled:cursor-not-allowed ${isLiked ? 'text-red-500' : 'hover:text-primary'}`}
                    >
                        <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : 'fill-none stroke-current'}`} />
                        <span className="font-medium">{item.likeCount || 0}</span>
                    </button>
                     <div className="flex items-center gap-2">
                        <ChatBubbleIcon className="w-5 h-5" />
                        <span className="font-medium">{item.commentCount || 0} Comments</span>
                    </div>
                </div>
            </div>

            {isEditing ? renderEditForm() : renderDetails()}

            {isEditing && (
                 <div className="mt-8 pt-6 border-t border-border flex justify-end gap-4">
                    <button onClick={handleCancel} className="px-5 py-2.5 bg-card border border-border text-primary font-semibold rounded-md hover:bg-card-hover transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition-colors">
                        Save Changes
                    </button>
                </div>
            )}
            
            {!isEditing && (
                <div className="mt-10 pt-8 border-t border-border">
                    <h2 className="text-xl font-bold text-primary mb-4">Comments</h2>
                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="flex items-start gap-3 mb-8">
                            {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full mt-1" /> : <UserCircleIcon className="w-9 h-9 text-secondary mt-1"/>}
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full p-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm"
                                    rows={2}
                                />
                                <div className="text-right mt-2">
                                     <button type="submit" disabled={!newComment.trim()} className="px-4 py-1.5 bg-accent text-white text-sm font-semibold rounded-md hover:bg-accent/90 disabled:bg-card-hover disabled:text-secondary">Post</button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-secondary mb-8">Please log in to post a comment.</p>
                    )}
                    
                    <div className="space-y-6">
                        {comments.length > 0 ? comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-3">
                                {comment.authorAvatar ? <img src={comment.authorAvatar} alt={comment.authorName} className="w-9 h-9 rounded-full" /> : <UserCircleIcon className="w-9 h-9 text-secondary"/>}
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-semibold text-primary text-sm">{comment.authorName}</p>
                                        <p className="text-xs text-secondary">{timeSince(comment.createdAt)}</p>
                                    </div>
                                    <p className="text-sm text-primary mt-1 whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-secondary text-center py-4">No comments yet. Be the first to say something!</p>
                        )}
                    </div>
                </div>
            )}
        </main>
        <aside className="w-full lg:w-1/2 h-full flex-shrink-0 bg-content border-l border-border">
            <Playground selectedItem={item} apiKeys={apiKeys} fetchedOllamaModels={fetchedOllamaModels} contexts={contexts} selectedLLMProvider={selectedLLMProvider} selectedLLMModel={selectedLLMModel} onSaveLLMSettings={onSaveLLMSettings} />
        </aside>
    </div>
  );
};

export default DetailPage;
