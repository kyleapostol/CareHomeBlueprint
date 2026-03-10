'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthProvider";

// Import the JSON file (Adjust this path based on where you saved it!)
import loginData from "@/content/login/phase1-login.json"; 

export default function LandingPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="landing-wrapper">
      
      {/* Simple Navigation Bar */}
      {!isLoggedIn && (
        <nav className="nav-bar">
          <div>
            <Link href="/login" className="nav-link">
              {loginData.navigation.login} &rarr;
            </Link>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <main className="hero-layout">
        
        {/* Left Column: Copy & CTA */}
        <div className="hero-text-col">
          <h1 className="hero-title">
            {loginData.hero.title.main}{" "}
            <span className="hero-highlight">{loginData.hero.title.highlight}</span>
          </h1>
          <p className="hero-subtitle">
            {loginData.hero.subtitle}
          </p>
          <div className="cta-group">
            <Link href="/login" className="cta-primary">
              {loginData.hero.cta}
            </Link>
          </div>
        </div>

        {/* Right Column: Dashboard Graphic Composition */}
        <div className="hero-visual-col flex justify-end items-center mt-8 lg:mt-0">
          <div className="visual-backdrop-blob"></div>

          {/* The Composition Wrapper */}
          <div className="relative w-full max-w-[600px] mt-8 sm:mt-12">

            {/* 1. Desktop Preview (Back - Staggered Top Left) */}
            <div className="relative z-10 w-[85%] mr-auto aspect-[16/10] rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden bg-white">
              <Image
                src="/platform-prev2.png"
                alt={loginData.images.desktopAlt}
                fill
                className="object-cover object-top"
                priority
              />
            </div>

            {/* 2. Mobile Preview (Front - Staggered Bottom Right) */}
            <div className="absolute -bottom-8 -right-2 sm:-bottom-16 sm:-right-6 z-20 w-[28%] sm:w-[30%] aspect-[9/19] rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border-[4px] sm:border-[6px] border-slate-900 bg-slate-900 overflow-hidden">
              <Image
                src="/mobile-prev3.png"
                alt={loginData.images.mobileAlt}
                fill
                className="object-cover object-top"
              />
            </div>

          </div>
        </div>
        
      </main>
    </div>
  );
}