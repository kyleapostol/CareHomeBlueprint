// src/contexts/ChecklistProvider.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// 1. Import the real authentication hook
import { useAuth } from './AuthProvider';

/**
 * A simple debounce utility.
 * @param func The function to debounce.
 * @param waitFor The debounce delay in milliseconds.
 */
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
};

// Define the shape of the context data
interface ChecklistContextType {
  completedIds: string[];
  toggleTask: (taskId: string) => void;
  isInitialized: boolean; // To prevent UI flicker on initial load
}

// Create the context
const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

// Define the provider's props
interface ChecklistProviderProps {
  children: ReactNode;
  trackType: 'arf' | 'rcfe' | 'adp';
  // For authenticated users, this is pre-fetched on the server
  initialCompletedIds?: string[];
}

// STABLE REFERENCE: This prevents the useEffect infinite loop
const EMPTY_ARRAY: string[] = [];

export const ChecklistProvider = ({
  children,
  trackType,
  initialCompletedIds = EMPTY_ARRAY, 
}: ChecklistProviderProps) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { isLoggedIn, isLoading: isAuthLoading, token: authToken } = useAuth();

  // Grab the real JWT token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  const localStorageKey = `checklist-progress-${trackType}`;

  // Debounced function to sync progress with the Strapi backend
  const debouncedSync = useCallback(
    debounce(async (ids: string[], authToken: string) => {
      console.log(`[Syncing] Debounced sync for track: ${trackType}`, { ids });
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  console.log(process.env.NEXT_PUBLIC_STRAPI_URL)
      try {
        const response = await fetch(`${baseUrl}/api/user-progress/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            data: {
              trackType,
              completedIds: ids,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync progress with the server.');
        }
        console.log('[Syncing] Progress synced successfully!');
      } catch (error) {
        console.error('[Syncing] Error:', error);
      }
    }, 1000), 
    [trackType] 
  );

useEffect(() => {
    if (isAuthLoading) return;

    let initialIds: string[] = [];
    
    // THE FIX: Use the stable authToken from your provider
    if (isLoggedIn && authToken) {
      console.log('Initializing state for AUTHENTICATED user.');
      initialIds = initialCompletedIds;
    } else {
      console.log('Initializing state for GUEST user.');
      try {
        const storedIds = localStorage.getItem(localStorageKey);
        if (storedIds) {
          initialIds = JSON.parse(storedIds);
        }
      } catch (error) {
        console.error('Failed to parse state from localStorage', error);
      }
    }
    setCompletedIds(initialIds);
    setIsInitialized(true);
  }, [isLoggedIn, authToken, initialCompletedIds, localStorageKey, isAuthLoading]);

  const toggleTask = (taskId: string) => {
    // 1. Optimistic Update
    const newCompletedIds = completedIds.includes(taskId)
      ? completedIds.filter((id) => id !== taskId)
      : [...completedIds, taskId];
    
    setCompletedIds(newCompletedIds);

    if (isLoggedIn && authToken) {
        debouncedSync(newCompletedIds, authToken);
      }
  };

  const value = { completedIds, toggleTask, isInitialized };

  return (
    <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>
  );
};

// Custom hook for easy consumption in child components
export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (context === undefined) {
    throw new Error('useChecklist must be used within a ChecklistProvider');
  }
  return context;
};