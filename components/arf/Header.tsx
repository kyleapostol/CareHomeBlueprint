'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Menu from '@/components/arf/Menu';
import Link from 'next/link';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
        <header className="relative w-full border-b border-slate-200 bg-white/90 backdrop-blur-md z-[100]">
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">

                {/* Brand & Navigator Title */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo_new.png"
                            alt="MyProviderPath"
                            width={45}
                            height={45}
                            className="rounded-lg shadow-sm"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-slate-900 leading-tight tracking-tight">
                                MyProviderPath
                            </span>
                            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                                ARF Licensing Navigator
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Menu Wrapper for Ref */}
                <div className="relative" ref={menuRef}>
                    <button 
                        className={`p-2.5 rounded-xl transition-all border ${
                            isMenuOpen 
                            ? 'bg-orange-50 border-orange-200 text-orange-600' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 shadow-sm'
                        }`}
                        aria-label="Toggle Menu"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="text-2xl leading-none">{isMenuOpen ? '✕' : '≡'}</span>
                    </button>

                    {/* Menu Card */}
                    {isMenuOpen && (
                        <div className="absolute top-[calc(100%+12px)] right-0 z-50 w-72 bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                            {/* Passing activeOnly to mute non-ARF/Contact items */}
                            <Menu activeOnly={true} />
                        </div>
                    )}
                </div>
            </div>

            {/* Shading Backdrop: Mutes the app content when menu is open */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 top-[81px] bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity" 
                    aria-hidden="true"
                />
            )}
        </header>
    );
}