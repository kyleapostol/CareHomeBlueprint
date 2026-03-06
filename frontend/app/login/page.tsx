'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthProvider';



export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  // State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Send the OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:1337/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation SendOtp($phoneNumber: String!) {
              sendOtp(phoneNumber: $phoneNumber)
            }
          `,
          variables: { phoneNumber },
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

    try {
      const response = await fetch('http://localhost:1337/graphql', {
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
          variables: { phoneNumber, code },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors[0].message);
      
      // 1. Extract the exact variables from the GraphQL wrapper
      const jwt = data?.loginWithOtp?.jwt;
      const user = data?.loginWithOtp?.user;

      if (jwt) {
        // 2. THE FIX: Pass the correctly scoped variables
        // Notice we don't need localStorage.setItem here anymore because AuthProvider does it!
        login(jwt, user || { id: 1, username: 'PhoneUser', email: '' });
        
        // Redirect first, then you can show a success message on the next page if you want
        router.push('/'); 
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {step === 1 ? 'Sign In' : 'Verify Code'}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading || !phoneNumber}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Sending...' : 'Send Login Code'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">6-Digit Code</label>
              <input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading || code.length < 4}
              className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}