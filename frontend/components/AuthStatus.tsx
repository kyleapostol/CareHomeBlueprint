'use client';

import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthProvider';

interface AuthStatusProps {
  closeMenu?: () => void;
}

export default function AuthStatus({ closeMenu }: AuthStatusProps) {
  // Use the centralized auth state and functions
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    // The logout function from the context handles state update and redirection
    logout();
    if (closeMenu) closeMenu();
  };

  if (!isLoggedIn) {
    return (
      <Link 
        href="/login"
        onClick={closeMenu}
        className="mpp-login-btn"
      >
        <span className="mr-3 text-lg">🔐</span>
        Sign In
      </Link>
    );
  }

  return (
    <button 
      onClick={handleLogout}
      className="mpp-logout-btn" 
    > Log Out </button>
  );
}