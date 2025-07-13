import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CogIcon } from './icons/CogIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface HeaderProps {
    onSettingsClick: () => void;
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onProfileClick }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex-shrink-0 flex items-center justify-end px-6 h-16 bg-background border-b border-border">
      <div className="flex items-center gap-4">
        {user ? (
           <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full" />
                ) : (
                  <UserCircleIcon className="w-9 h-9 text-secondary" />
                )}
                <span className="text-sm font-medium text-primary hidden sm:inline">{user.name}</span>
                <ChevronDownIcon className={`w-4 h-4 text-secondary transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMenuOpen && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-20 py-1"
                    onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-border">
                     <p className="text-sm font-semibold text-primary truncate">{user.name}</p>
                     <p className="text-xs text-secondary truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                     <button onClick={() => { onProfileClick(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:bg-card-hover hover:text-primary rounded-md">
                      <UserCircleIcon className="w-4 h-4"/> Profile
                    </button>
                    <button onClick={() => { onSettingsClick(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:bg-card-hover hover:text-primary rounded-md">
                      <CogIcon className="w-4 h-4"/> Settings
                    </button>
                    <button onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md">
                      <LogoutIcon className="w-4 h-4"/> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;