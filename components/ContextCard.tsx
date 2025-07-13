
import React from 'react';
import { ContextItem } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface ContextCardProps {
  context: ContextItem;
  showVisibility?: boolean;
}

const ContextCard: React.FC<ContextCardProps> = ({ context, showVisibility }) => {
  return (
    <div
      className="p-5 rounded-lg border bg-card border-border flex flex-col"
    >
      <div className="flex-1">
        <div className="flex items-start gap-3 mb-3">
          <DocumentTextIcon className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-primary text-base">{context.title}</h3>
            <p className="text-sm text-secondary mt-1">{context.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {context.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 text-xs font-medium bg-card-hover text-secondary rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-3 flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
            <UserCircleIcon className="w-5 h-5 text-secondary" />
            <span className="text-xs text-secondary font-medium">{context.author || 'Anonymous'}</span>
        </div>
        {showVisibility && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                context.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/50 text-slate-300'
            }`}>
                {context.isPublic ? 'Public' : 'Private'}
            </span>
        )}
      </div>
    </div>
  );
};

export default ContextCard;