'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Menu from '../components/Menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import AuthStatus from './AuthStatus';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname() || '';

    // Automatically determine the facility theme based on the URL route
    let facilityType = 'arf'; // Default
    if (pathname.includes('/rcfe')) facilityType = 'rcfe';
    if (pathname.includes('/adp')) facilityType = 'adp';

    const facilityTitles = {
        arf: 'ARF Licensing Navigator',
        rcfe: 'RCFE Licensing Navigator',
        adp: 'ADP Licensing Navigator'
    };

    // Handler to close if clicking outside of the menuRef area
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <header 
            className="topbar" 
            data-facility-type={facilityType} // Crucial: This passes the theme colors into the header!
        >
            <div className="topbar-inner">

                {/* Brand & Navigator Title */}
                <div className="topbar-left">
                    <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo_new.png"
                            alt="MyProviderPath"
                            width={65}
                            height={65}
                            className="rounded-lg shadow-sm shrink-0 object-contain"
                        />
                        <div className="flex flex-col">
                            <span className="topbar-title">
                                My Provider Path
                            </span>
                            {/* Hide the subtitle if we are on the home/landing page */}
                            {pathname !== '/' && (
                                <span className="topbar-subtitle">
                                    {pathname === '/login' 
                                        ? '' 
                                        : facilityTitles[facilityType as keyof typeof facilityTitles]}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

                {/* Menu Wrapper for Ref */}
                <div className="relative" ref={menuRef}>
                    <button 
                        className={`topbar-menu-btn ${isMenuOpen ? 'is-active' : ''}`}
                        aria-label="Toggle Menu"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="text-2xl leading-none">{isMenuOpen ? '✕' : '≡'}</span>
                    </button>

                    {/* Menu Card */}
                    {isMenuOpen && (
                        <div className="mpp-menu-dropdown animate-in slide-in-from-top-2 duration-200">
                            {/* Passing activeOnly to mute non-ARF/Contact items */}
                            <Menu activeOnly={true} />
                        </div>
                    )}
                </div>
            </div>

            {/* Shading Backdrop: Mutes the app content when menu is open */}
            {isMenuOpen && (
                <div 
                    className="topbar-backdrop" 
                    aria-hidden="true"
                />
            )}
        </header>
    );
}