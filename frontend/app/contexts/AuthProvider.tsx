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

  const login = useCallback((jwt: string, userData: any) => {
    // This function should be called after a successful login API call
    const userToStore: AuthUser = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(userToStore));
    setToken(jwt);
    setUser(userToStore);
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