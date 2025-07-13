import React from 'react';
import { View } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { DiscoverIcon } from './icons/DiscoverIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { UsersIcon } from './icons/UsersIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { PlusIcon } from './icons/PlusIcon';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const NavLink: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  disabled?: boolean;
}> = ({ view, label, icon, activeView, onViewChange, disabled }) => {
  const isActive = activeView === view;
  const classes = `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left ${
    isActive
      ? 'bg-accent/10 text-accent'
      : disabled
      ? 'text-secondary/50 cursor-not-allowed'
      : 'text-secondary hover:bg-card-hover hover:text-primary'
  }`;

  return (
    <button onClick={() => !disabled && onViewChange(view)} className={classes} disabled={disabled}>
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user } = useAuth();
  
  return (
    <aside className="w-64 bg-sidebar border-r border-border p-4 flex flex-col">
      <div className="px-3 pt-2 pb-6">
        <button onClick={() => onViewChange(View.HOME)} className="text-left w-full">
            <h1 className="text-2xl font-bold text-accent tracking-tighter">
                OpenPrompt
            </h1>
        </button>
      </div>
      
      <div className="px-3 mb-6">
        <button 
            onClick={() => onViewChange(View.CREATE)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent"
        >
            <PlusIcon className="w-5 h-5"/>
            <span>Create</span>
        </button>
      </div>

      <nav className="flex-1 space-y-6">
        <div>
          <h3 className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Explore</h3>
          <div className="space-y-1">
            <NavLink icon={<DiscoverIcon className="w-5 h-5" />} label="Prompts" view={View.PROMPTS} activeView={activeView} onViewChange={onViewChange} />
            <NavLink icon={<CpuChipIcon className="w-5 h-5" />} label="Agents" view={View.AGENTS} activeView={activeView} onViewChange={onViewChange} />
            <NavLink icon={<UsersIcon className="w-5 h-5" />} label="Personas" view={View.PERSONAS} activeView={activeView} onViewChange={onViewChange} />
            <NavLink icon={<DatabaseIcon className="w-5 h-5" />} label="Contexts" view={View.CONTEXTS} activeView={activeView} onViewChange={onViewChange} />
          </div>
        </div>

        {user && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">My Library</h3>
            <div className="space-y-1">
              <NavLink icon={<DiscoverIcon className="w-5 h-5" />} label="My Prompts" view={View.MY_PROMPTS} activeView={activeView} onViewChange={onViewChange} />
              <NavLink icon={<CpuChipIcon className="w-5 h-5" />} label="My Agents" view={View.MY_AGENTS} activeView={activeView} onViewChange={onViewChange} />
              <NavLink icon={<UsersIcon className="w-5 h-5" />} label="My Personas" view={View.MY_PERSONAS} activeView={activeView} onViewChange={onViewChange} />
              <NavLink icon={<DatabaseIcon className="w-5 h-5" />} label="My Contexts" view={View.MY_CONTEXTS} activeView={activeView} onViewChange={onViewChange} />
            </div>
          </div>
        )}
      </nav>

      <div className="flex-shrink-0 mt-auto">
        <div className="border-t border-border pt-4 px-3 text-xs text-secondary space-y-1">
            <p>&copy; {new Date().getFullYear()} Tethered Software Inc.</p>
            <div className="flex gap-4">
                <a href="#" className="hover:text-primary">Privacy Policy</a>
                <a href="#" className="hover:text-primary">Terms of Service</a>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;