
import React from 'react';
import { McpItem } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface McpCardProps {
  mcp: McpItem;
  onSelect: () => void; // Add onSelect prop
  showVisibility?: boolean;
}

const McpCard: React.FC<McpCardProps> = ({ mcp, onSelect, showVisibility }) => {
  return (
    <div
      onClick={onSelect}
      className="p-5 rounded-lg border bg-card cursor-pointer transition-colors hover:bg-card-hover border-border flex flex-col"
    >
      <div className="flex-1">
        <div className="flex items-start gap-3 mb-3">
          <DocumentTextIcon className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-primary text-base">{mcp.title}</h3>
            <p className="text-sm text-secondary mt-1">{mcp.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {mcp.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 text-xs font-medium bg-card-hover text-secondary rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-3 flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
            <UserCircleIcon className="w-5 h-5 text-secondary" />
            <span className="text-xs text-secondary font-medium">{mcp.author || 'Anonymous'}</span>
        </div>
        {showVisibility && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                mcp.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/50 text-slate-300'
            }`}>
                {mcp.isPublic ? 'Public' : 'Private'}
            </span>
        )}
      </div>
    </div>
  );
};

export default McpCard;