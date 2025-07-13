import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { User, AuthContextType } from '../types';
import { jwtDecode } from 'jwt-decode';
import * as db from '../services/dbService';

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
  const [token, setToken] = useState<string | null>(null);

  const GOOGLE_CLIENT_ID = useMemo(() => {
    if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
        return process.env.GOOGLE_CLIENT_ID;
    }
    return undefined;
  }, []);

  const processLogin = (token: string, userData: User) => {
    localStorage.setItem('jwt_token', token);
    const storedProfile = getProfileFromStorage(userData.email);
    const finalUser: User = {
        ...userData,
        ...storedProfile,
        avatarUrl: storedProfile.avatarUrl || userData.avatarUrl,
        name: storedProfile.name || userData.name,
    };
    saveProfileToStorage(finalUser.email, { name: finalUser.name, avatarUrl: finalUser.avatarUrl, ...storedProfile });
    setUser(finalUser);
    setToken(token);
  };

  const handleGoogleLogin = (response: any) => {
    const userData = jwtDecode(response.credential);
    // This part would ideally call your backend's Google auth endpoint
    // For now, we'll mock it or assume the JWT from Google is enough for client-side user info
    if (userData) {
      const mockUser: User = {
        id: userData.sub || `google-${userData.email}`,
        name: userData.name || userData.email,
        email: userData.email,
        avatarUrl: userData.picture,
        role: 'user',
      };
      // In a real app, you'd send response.credential to your backend
      // and your backend would return its own JWT after verifying.
      // For now, we'll just use a mock token or the Google token directly.
      processLogin(response.credential, mockUser);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          const mockUser: User = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name || decoded.email,
            avatarUrl: decoded.avatarUrl,
            role: decoded.role || 'user',
          };
          processLogin(storedToken, mockUser);
        } else {
          localStorage.removeItem('jwt_token');
        }
      } catch (e) {
        console.error("Failed to decode or validate stored JWT", e);
        localStorage.removeItem('jwt_token');
      }
    }

    if (GOOGLE_CLIENT_ID) {
        window.google?.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });
    } else {
        console.warn("GOOGLE_CLIENT_ID environment variable not set. Google Sign-In will be disabled, and a mock user will be used for demonstration purposes.");
    }
  }, [GOOGLE_CLIENT_ID]);

  const login = async (provider: 'email' | 'google' | 'github', email?: string, password?: string) => {
    switch (provider) {
        case 'google':
            if (GOOGLE_CLIENT_ID) {
                window.google?.accounts.id.prompt();
            } else {
                console.warn('Google Client ID not found. Using mock Google user.');
                const mockUser: User = { id: 'mock-google', name: 'Google User', email: 'mock@google.com', avatarUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=google`, role: 'user' };
                processLogin('mock_google_token', mockUser);
            }
            break;
        case 'github':
            // Mock GitHub login
            const mockUser: User = { id: 'mock-github', name: 'GitHub User', email: 'mock@github.com', avatarUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=github`, role: 'user' };
            processLogin('mock_github_token', mockUser);
            break;
        case 'email':
            if (email && password) {
                try {
                    const response = await db.loginUser(email, password);
                    if (response.data && response.data.token && response.data.user) {
                        processLogin(response.data.token, response.data.user);
                        return { success: true };
                    } else {
                        return { success: false, message: response.error || 'Login failed' };
                    }
                } catch (error: any) {
                    return { success: false, message: error.message || 'Login failed' };
                }
            } else {
                return { success: false, message: 'Email and password are required for email login.' };
            }
        default:
            return { success: false, message: 'Unsupported login provider.' };
    }
  };

  const logout = () => {
    if (GOOGLE_CLIENT_ID) {
        window.google?.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem('jwt_token');
    setUser(null);
    setToken(null);
    // Redirect to home page after logout
    window.location.href = '/';
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
    <AuthContext.Provider value={{ user, token, login, logout, updateUserProfile }}>
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