import React, { useState } from 'react';
import { PublishableItem } from '../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (item: PublishableItem) => void;
  initialItem: PublishableItem;
}

const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, onPublish, initialItem }) => {
  const [item, setItem] = useState<PublishableItem>(initialItem);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Publish Your Creation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-secondary">Title</label>
            <input
              type="text"
              id="title"
              value={item.title}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-background text-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-secondary">Description</label>
            <textarea
              id="description"
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-background text-primary"
              rows={3}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-secondary">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={item.tags.join(', ')}
              onChange={(e) => setItem({ ...item, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              className="w-full p-2 border border-border rounded-md bg-background text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary">Visibility</label>
            <div className="flex gap-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="isPublic"
                  checked={!item.isPublic}
                  onChange={() => setItem({ ...item, isPublic: false })}
                  className="form-radio text-accent"
                />
                <span className="ml-2 text-primary">Private</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="isPublic"
                  checked={item.isPublic}
                  onChange={() => setItem({ ...item, isPublic: true })}
                  className="form-radio text-accent"
                />
                <span className="ml-2 text-primary">Public</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-card border border-border rounded-md text-primary hover:bg-card-hover">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90">Publish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishModal;