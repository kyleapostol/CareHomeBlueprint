'use client';

import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const COOKIE_NAME = 'chb_disclaimer_ok';
const COOKIE_MAX_AGE_DAYS = 180;

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[$()*+.?[\\\]^{|}-]/g, '\\$&') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const maxAge = days * 24 * 60 * 60; // seconds
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

export default function DisclaimerGate({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const v = getCookie(COOKIE_NAME);
    setAccepted(v === '1');
    setReady(true);
  }, []);

  if (!ready) return null; // avoid flicker

  if (accepted) return <>{children}</>;

  return (
    <div className="disclaimer-overlay" role="dialog" aria-modal="true" aria-label="Disclaimer">
      <div className="disclaimer-card">
        <h2 className="disclaimer-title">Disclaimer</h2>
        <p className="disclaimer-text">
          This resource is for informational purposes only and does not constitute legal,
          regulatory, or professional advice. Requirements may vary by agency and circumstance.
          Always verify with CDSS, your local fire authority, and the applicable Regional Center.
        </p>

        <button
          className="disclaimer-accept"
          type="button"
          onClick={() => {
            setCookie(COOKIE_NAME, '1', COOKIE_MAX_AGE_DAYS);
            setAccepted(true);
          }}
        >
          I understand
        </button>
      </div>
    </div>
  );
}
