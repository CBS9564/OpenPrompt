import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { User, AuthContextType } from '../types';

// This is a simple JWT decoder. In a real app, you would not need to
// decode tokens on the client for auth purposes, but here it's for
// getting profile info.
function decodeJwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error("Failed to decode JWT", e);
        return null;
    }
}

// Augment the window interface
declare global {
    interface Window {
        google: any;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getProfileFromStorage = (email: string): Partial<User> => {
    try {
        const storedProfile = localStorage.getItem(`openprompt_profile_${email}`);
        return storedProfile ? JSON.parse(storedProfile) : {};
    } catch (e) {
        console.error("Failed to get profile from storage", e);
        return {};
    }
};

const saveProfileToStorage = (email: string, profileData: Partial<User>) => {
    try {
        const currentProfile = getProfileFromStorage(email);
        const newProfile = { ...currentProfile, ...profileData };
        localStorage.setItem(`openprompt_profile_${email}`, JSON.stringify(newProfile));
    } catch (e) {
        console.error("Failed to save profile to storage", e);
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const GOOGLE_CLIENT_ID = useMemo(() => {
    // Safely access process.env only inside the component lifecycle to avoid startup crashes.
    if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
        return process.env.GOOGLE_CLIENT_ID;
    }
    return undefined;
  }, []);

  const loginUser = (baseUser: Omit<User, 'bio' | 'website' | 'github'>) => {
    const storedProfile = getProfileFromStorage(baseUser.email);
    const finalUser: User = {
        ...baseUser,
        ...storedProfile,
        // Custom avatar/name from profile should override default one
        avatarUrl: storedProfile.avatarUrl || baseUser.avatarUrl,
        name: storedProfile.name || baseUser.name,
    };
    
    // Save the merged profile back to storage, ensuring initial data from provider is saved if no profile exists
    saveProfileToStorage(finalUser.email, { name: finalUser.name, avatarUrl: finalUser.avatarUrl, ...storedProfile });
    setUser(finalUser);
  };

  const handleGoogleLogin = (response: any) => {
    const userData = decodeJwt(response.credential);
    if (userData) {
      const baseUser = {
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.picture,
      };
      loginUser(baseUser);
    }
  };

  const createMockUserFromEmail = (email: string) => {
    const name = email.split('@')[0]
      .replace(/[\.\_]/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    
    const baseUser = {
      name: name,
      email: email,
      avatarUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(email)}`
    };
    loginUser(baseUser);
  };

  useEffect(() => {
    if (GOOGLE_CLIENT_ID) {
        window.google?.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });
    } else {
        console.warn("GOOGLE_CLIENT_ID environment variable not set. Google Sign-In will be disabled, and a mock user will be used for demonstration purposes.");
    }
  }, [GOOGLE_CLIENT_ID]);

  const login = (provider: 'email' | 'google' | 'github', email?: string) => {
    switch (provider) {
        case 'google':
            if (GOOGLE_CLIENT_ID) {
                window.google?.accounts.id.prompt();
            } else {
                console.warn('Google Client ID not found. Using mock Google user.');
                loginUser({ name: 'Google User', email: 'mock@google.com', avatarUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=google` });
            }
            break;
        case 'github':
            // Mock GitHub login
            loginUser({ name: 'GitHub User', email: 'mock@github.com', avatarUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=github` });
            break;
        case 'email':
            if (email) {
                createMockUserFromEmail(email);
            }
            break;
        default:
            break;
    }
  };

  const logout = () => {
    if (GOOGLE_CLIENT_ID) {
        window.google?.accounts.id.disableAutoSelect();
    }
    setUser(null);
  };
  
  const updateUserProfile = (newProfileData: Partial<User>) => {
      if (!user) return;
      
      const updatedUser = { ...user, ...newProfileData };
      setUser(updatedUser);
      
      const profileToSave: Partial<User> = {
          name: updatedUser.name,
          avatarUrl: updatedUser.avatarUrl,
          bio: updatedUser.bio,
          website: updatedUser.website,
          github: updatedUser.github,
      };
      saveProfileToStorage(user.email, profileToSave);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};