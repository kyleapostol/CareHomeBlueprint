import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      
      {/* Simple Navigation Bar */}
      <nav className="nav-bar">
        <div>
          <Link href="/login" className="nav-link">
            Log In &rarr;
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-layout">
        
        {/* Left Column: Copy & CTA */}
        <div className="hero-text-col">
          <h1 className="hero-title">
            The blueprint to opening and operating your own <span className="hero-highlight">care facility.</span>
          </h1>
          <p className="hero-subtitle">
            Navigate licensing, vendorization, and operations for ARF, RCFE, and ADP facilities without the guesswork. Build your business on a solid foundation.
          </p>
          <div className="cta-group">
            <Link href="/login" className="cta-primary">
              Explore the Platform
            </Link>
          </div>
        </div>

        {/* Right Column: Dashboard Graphic Composition */}
        <div className="hero-visual-col flex justify-end items-center mt-8 lg:mt-0">
          <div className="visual-backdrop-blob"></div>
          
          {/* The Composition Wrapper */}
          <div className="relative w-full max-w-[600px]">
            
            {/* 1. Desktop Preview (Back) */}
            <div className="relative z-10 w-[85%] ml-auto aspect-[16/10] rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden bg-white">
              <Image
                  src="/platform-prev2.png"
                  alt="Desktop Platform Preview"
                  fill
                  className="object-cover object-top"
                  priority
              />
            </div>

            {/* 2. Mobile Preview (Front & Overlapping) */}
            {/* The -bottom and -left properties pull it outside the desktop box */}
            <div className="absolute -bottom-6 -left-2 sm:-bottom-10 sm:-left-6 z-20 w-[28%] sm:w-[30%] aspect-[9/19] rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border-[4px] sm:border-[6px] border-slate-900 bg-slate-900 overflow-hidden">
              <Image
                  src="/mobile-prev3.png"
                  alt="Mobile Platform Preview"
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