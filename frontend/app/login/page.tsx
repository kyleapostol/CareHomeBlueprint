'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../app/contexts/AuthProvider';
import LoginBackground from '../../components/LoginBackground';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  // State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Get only the digits from the input
    const digits = e.target.value.replace(/\D/g, '');
    const truncatedDigits = digits.slice(0, 10);

    // 2. Apply formatting as XXX-XXX-XXXX
    let formatted = truncatedDigits;
    if (truncatedDigits.length > 6) {
      formatted = `${truncatedDigits.slice(0, 3)}-${truncatedDigits.slice(3, 6)}-${truncatedDigits.slice(6)}`;
    } else if (truncatedDigits.length > 3) {
      formatted = `${truncatedDigits.slice(0, 3)}-${truncatedDigits.slice(3)}`;
    }
    
    setPhoneNumber(formatted);
  };

  const uri = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/graphql` 
  : 'http://localhost:1337/graphql';

  // Step 1: Send the OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError('');

    const digits = phoneNumber.replace(/\D/g, '');
    const fullPhoneNumber = `+1${digits}`;

    try {
      const response = await fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation SendOtp($phoneNumber: String!) {
              sendOtp(phoneNumber: $phoneNumber)
            }
          `,
          variables: { phoneNumber: fullPhoneNumber },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors[0].message);
      if (data?.sendOtp) setStep(2); // Move to code verification
      
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify and Login
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const digits = phoneNumber.replace(/\D/g, '');
    const fullPhoneNumber = `+1${digits}`;

    try {
      const response = await fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation LoginWithOtp($phoneNumber: String!, $code: String!) {
              loginWithOtp(phoneNumber: $phoneNumber, code: $code) {
                jwt
                user {
                  documentId
                  username
                }
              }
            }
          `,
          variables: { phoneNumber: fullPhoneNumber, code },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors[0].message);
      
      const jwt = data?.loginWithOtp?.jwt;
      const user = data?.loginWithOtp?.user;

      if (jwt) {
        login(jwt, user || { id: 1, username: 'PhoneUser', email: '' });
        router.push('/'); 
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container relative z-0 overflow-hidden bg-transparent">
      
      <LoginBackground />

      {/* ADDED: relative and z-10 so the card physically sits above the background layer */}
      <div className="login-card relative z-10">
        
        <div className="login-header">
          <h2 className="login-title">
            {step === 1 ? 'Login' : 'Verify Code'}
          </h2>
          <p className="login-subtitle">
            {step === 1 
              ? 'Sign in to access your dashboard' 
              : `Code sent to ${phoneNumber}`}
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="login-form">
            <div>
              <label className="login-label">Phone Number</label>
              <input
                type="tel"
                placeholder="123-456-7890"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="login-input"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading || !phoneNumber}
              className="login-button"
            >
              {loading ? (
                <>
                  <svg className="login-spinner" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'Send Login Code'}
            </button>
          </div>
        ) : (
          <div className="login-form">
            <div>
              <label className="login-label">6-Digit Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="login-input login-input--code"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading || code.length < 4}
              className="login-button login-button--verify"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            
            <div className="login-link-wrapper">
              <button 
                onClick={() => { setStep(1); setCode(''); setError(''); }}
                className="login-link"
              >
                Change phone number
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}