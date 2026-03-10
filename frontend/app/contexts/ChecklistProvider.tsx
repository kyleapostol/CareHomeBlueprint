'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced as (...args: Parameters<F>) => void;
};

interface ChecklistContextType {
  completedIds: string[];
  toggleTask: (taskId: string) => void;
  resetTrack: () => Promise<void>;
  isInitialized: boolean;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

interface ChecklistProviderProps {
  children: ReactNode;
  trackType: 'arf' | 'rcfe' | 'adp';
  initialCompletedIds?: string[];
}

const EMPTY_ARRAY: string[] = [];

export const ChecklistProvider = ({
  children,
  trackType,
  initialCompletedIds = EMPTY_ARRAY,
}: ChecklistProviderProps) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { isLoggedIn, isLoading: isAuthLoading, token: authToken } = useAuth();
  const localStorageKey = `checklist-progress-${trackType}`;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

  // Helper to sync with server
  const syncWithServer = async (ids: string[], token: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/user-progress/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { trackType, completedIds: ids },
        }),
      });
      if (!response.ok) throw new Error('Failed to sync');
      console.log(`[Syncing] ${trackType} progress updated on server.`);
    } catch (error) {
      console.error('[Syncing] Error:', error);
    }
  };

  const debouncedSync = useCallback(
    debounce((ids: string[], token: string) => syncWithServer(ids, token), 1000),
    [trackType, baseUrl]
  );

  // Initialize Data
  useEffect(() => {
    if (isAuthLoading) return;

    const fetchProgress = async () => {
      if (isLoggedIn && authToken) {
        try {
          const response = await fetch(
            `${baseUrl}/api/user-progress?trackType=${trackType}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const result = await response.json();

          // Strapi 5 usually returns data in result.data
          // We need to check if completedIds is a string or an array
          let serverIds = result.data?.completedIds;

          if (typeof serverIds === 'string') {
            serverIds = JSON.parse(serverIds);
          }

          if (Array.isArray(serverIds)) {
            setCompletedIds(serverIds);
          } else {
            // Fallback to the server-side pre-fetched IDs
            setCompletedIds(initialCompletedIds);
          }
        } catch (error) {
          console.error("Failed to fetch server progress", error);
          setCompletedIds(initialCompletedIds);
        }
      } else {
        const storedIds = localStorage.getItem(localStorageKey);
        setCompletedIds(storedIds ? JSON.parse(storedIds) : []);
      }
      setIsInitialized(true);
    };

    fetchProgress();
  }, [isLoggedIn, authToken, trackType, isAuthLoading, initialCompletedIds]);

  const toggleTask = (taskId: string) => {
    // SINGLE TRACK LOCK: Prevent starting a new track if another has progress
    const allKeys = Object.keys(localStorage);
    const otherTrackKey = allKeys.find(key => 
      key.startsWith('checklist-progress-') && 
      key !== localStorageKey && 
      JSON.parse(localStorage.getItem(key) || '[]').length > 0
    );

    if (otherTrackKey && completedIds.length === 0) {
      const otherTrackName = otherTrackKey.split('-').pop()?.toUpperCase();
      toast.error("Track Locked", {
        description: `You already have progress in ${otherTrackName}. Reset that track to start this one.`,
      });
      return;
    }

    const newIds = completedIds.includes(taskId)
      ? completedIds.filter((id) => id !== taskId)
      : [...completedIds, taskId];
    
    setCompletedIds(newIds);

    if (isLoggedIn && authToken) {
      debouncedSync(newIds, authToken);
    } else {
      localStorage.setItem(localStorageKey, JSON.stringify(newIds));
    }
  };

  const resetTrack = async () => {
    setCompletedIds([]);
    localStorage.removeItem(localStorageKey);
    
    if (isLoggedIn && authToken) {
      await syncWithServer([], authToken);
    }
    toast.success("Progress cleared.");
  };

  return (
    <ChecklistContext.Provider value={{ completedIds, toggleTask, resetTrack, isInitialized }}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (!context) throw new Error('useChecklist must be used within a ChecklistProvider');
  return context;
};