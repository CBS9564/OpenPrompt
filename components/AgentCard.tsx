import React from 'react';
import { Agent } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { StarIcon } from './icons/StarIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';


interface AgentCardProps {
  agent: Agent;
  onSelect: () => void;
  showVisibility?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect, showVisibility }) => {
  const authorName = agent.author || 'Anonymous';
  const authorInitials = authorName.includes(" ") ? `${authorName.split(" ")[0][0]}${authorName.split(" ")[1][0]}` : authorName[0]?.toUpperCase() || 'A';


  return (
    <div
      onClick={onSelect}
      className="p-5 rounded-lg border bg-card cursor-pointer transition-colors hover:bg-card-hover border-border flex flex-col"
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-start gap-4">
                <span className="text-2xl mt-1"><CpuChipIcon className="w-7 h-7 text-secondary"/></span>
                <div>
                    <h3 className="font-semibold text-primary text-base">{agent.title}</h3>
                    <p className="text-sm text-secondary mt-1">{agent.description}</p>
                </div>
            </div>
            {agent.isRecommended && <StarIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {agent.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 text-xs font-medium bg-card-hover text-secondary rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
       <div className="border-t border-border pt-4 flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-card-hover flex items-center justify-center text-xs font-bold text-secondary">
                {authorInitials}
             </div>
             <span className="text-xs text-secondary font-medium">{authorName}</span>
             {showVisibility && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    agent.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/50 text-slate-300'
                }`}>
                    {agent.isPublic ? 'Public' : 'Private'}
                </span>
             )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-secondary">
                <HeartIcon className="w-4 h-4" />
                <span className="text-xs font-medium">{agent.likeCount || 0}</span>
            </div>
             <div className="flex items-center gap-1.5 text-secondary">
                <ChatBubbleIcon className="w-4 h-4" />
                <span className="text-xs font-medium">{agent.commentCount || 0}</span>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AgentCard;