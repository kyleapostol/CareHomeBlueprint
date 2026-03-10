'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

// Define the shape of user data you expect from Strapi/localStorage
// Adjust this to match the actual user object structure
interface AuthUser {
  id: number;
  username: string;
  email: string;
}

// Define the shape of the auth context
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean; // To handle initial auth state check
  login: (jwt: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const router = useRouter();

  // This effect runs once on mount to initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('jwt');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false); // Finished loading auth state
    }
  }, []);

  // This effect listens for storage changes to sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'jwt' || event.key === 'user') {
        const storedToken = localStorage.getItem('jwt');
        const storedUser = localStorage.getItem('user');
        setToken(storedToken);
        setUser(storedUser ? JSON.parse(storedUser) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

 const login = useCallback(async (jwt: string, userData: any) => {
  // 1. Basic Auth State Update
  const userToStore = { id: userData.id, username: userData.username, email: userData.email };
  localStorage.setItem('jwt', jwt);
  localStorage.setItem('user', JSON.stringify(userToStore));
  setToken(jwt);
  setUser(userToStore);

  // 2. Dynamic Migration: Sync any and all local progress
  // Scan localStorage for keys like 'checklist-progress-arf' or 'checklist-progress-rcfe'
  const allKeys = Object.keys(localStorage);
  const progressKeys = allKeys.filter(key => key.startsWith('checklist-progress-'));

  for (const key of progressKeys) {
    const localData = localStorage.getItem(key);
    if (!localData) continue;

    try {
      const completedIds = JSON.parse(localData);
      // Extract the trackType from the key (e.g., 'arf' or 'rcfe')
      const trackType = key.replace('checklist-progress-', '');

      console.log(`[Migration] Moving guest ${trackType} progress to account...`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-progress/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          data: { trackType, completedIds }
        })
      });

      if (response.ok) {
        localStorage.removeItem(key);
        console.log(`[Migration] ${trackType} successfully synced and local cleared.`);
      }
    } catch (e) {
      console.error(`[Migration] Failed to sync ${key}:`, e);
    }
  }
}, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = { user, token, isLoggedIn: !isLoading && !!token, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};