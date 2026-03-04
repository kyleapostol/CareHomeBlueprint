'use client';

import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const COOKIE_NAME = 'mpp_disclaimer_accepted'; // Updated for MyProviderPath
const COOKIE_MAX_AGE_DAYS = 180;

// Helper to handle client-side cookie logic
const cookieStore = {
  get: (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  },
  set: (name: string, value: string, days: number) => {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  }
};

export default function DisclaimerGate({ children }: Props) {
  const [isReady, setIsReady] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    const consent = cookieStore.get(COOKIE_NAME);
    setHasAccepted(consent === 'true');
    setIsReady(true);
  }, []);

  const handleAccept = () => {
    cookieStore.set(COOKIE_NAME, 'true', COOKIE_MAX_AGE_DAYS);
    setHasAccepted(true);
  };

  // Prevent hydration flicker
  if (!isReady) return <div className="min-h-screen bg-neutral-900" />;

  if (hasAccepted) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div 
        className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog" 
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">Legal Disclaimer</h2>
          <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mt-1">
            Required Acknowledgement
          </p>
        </div>

        {/* Content - Scrollable area */}
        <div className="p-6 overflow-y-auto text-gray-700 space-y-4 leading-relaxed">
          <p className="font-medium text-gray-900">
            This application is a project management tool based on the developer’s personal experience 
            navigating the California ARF licensing process.
          </p>

          <hr className="border-gray-100" />

          <section>
            <h3 className="font-bold text-gray-900">No Professional Advice</h3>
            <p className="text-sm">
              The content provided is for educational guidance and does not constitute legal, 
              financial, or professional consulting advice.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900">No Professional-Client Relationship</h3>
            <p className="text-sm">
              Using this tool or contacting the developer does not establish a consultant-client relationship.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900">User Responsibility</h3>
            <p className="text-sm">
              Licensing requirements are subject to change by the CDSS and Regional Centers. 
              Users are responsible for verifying all steps with their assigned CCLD analyst 
              and official state documentation.
            </p>
          </section>

          <section className="bg-red-50 p-3 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-900">Limitation of Liability</h3>
            <p className="text-sm text-red-800">
              The developer is not liable for application denials, business delays, or 
              financial losses resulting from the use of this software.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={handleAccept}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg active:transform active:scale-95"
          >
            I understand and agree
          </button>
        </div>
      </div>
    </div>
  );
}