'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthProvider';

interface ChecklistToggleProps {
  isActive: boolean;
  onToggle: (val: boolean) => void;
}

export default function ChecklistToggle({ isActive, onToggle }: ChecklistToggleProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handleChange = (enabled: boolean) => {
    if (enabled && !isLoggedIn) {
      toast.error("Progress won't be saved", {
        description: "Sign in to keep track of your licensing journey.",
        action: {
          label: "Sign In",
          onClick: () => router.push('/login'),
        },
      });
    }
    onToggle(enabled);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        Checklist Mode
      </span>
      <button 
        type="button"
        onClick={() => handleChange(!isActive)}
        className={`mpp-toggle-track ${isActive ? 'is-active' : ''}`}
        aria-pressed={isActive}
      >
        <span className={`mpp-toggle-thumb ${isActive ? 'is-active' : ''}`} />
      </button>
    </div>
  );
}