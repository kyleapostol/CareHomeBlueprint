'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AuthStatusProps {
  closeMenu?: () => void;
}

export default function AuthStatus({ closeMenu }: AuthStatusProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    
    if (closeMenu) closeMenu();
    router.push('/login');
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