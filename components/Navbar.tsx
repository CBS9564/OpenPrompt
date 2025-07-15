import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon } from './icons/HomeIcon';
import { DiscoverIcon } from './icons/DiscoverIcon';
import { PlusIcon } from './icons/PlusIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { CogIcon } from './icons/CogIcon';
import { LogoutIcon } from './icons/LogoutIcon';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-card border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-primary font-bold text-lg flex items-center gap-2">
          <HomeIcon className="w-6 h-6" /> OpenPrompt
        </Link>
        <Link to="/prompts" className="text-secondary hover:text-primary flex items-center gap-1">
          <DiscoverIcon className="w-5 h-5" /> Explore
        </Link>
        {user && (
          <Link to="/create" className="text-secondary hover:text-primary flex items-center gap-1">
            <PlusIcon className="w-5 h-5" /> Create
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative group">
            <button className="flex items-center gap-2 text-primary">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
              ) : (
                <UserCircleIcon className="w-8 h-8" />
              )}
              <span className="hidden md:inline">{user.name}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <Link to="/profile" className="block px-4 py-2 text-sm text-secondary hover:bg-card-hover flex items-center gap-2">
                <UserCircleIcon className="w-4 h-4" /> Profile
              </Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-secondary hover:bg-card-hover flex items-center gap-2">
                <CogIcon className="w-4 h-4" /> Settings
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block px-4 py-2 text-sm text-secondary hover:bg-card-hover flex items-center gap-2">
                  <CogIcon className="w-4 h-4" /> Admin
                </Link>
              )}
              <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2">
                <LogoutIcon className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;