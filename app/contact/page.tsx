'use client';

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mdalqzdz");

  if (state.succeeded) {
    return (
      <div className="page-container flex items-center justify-center p-4">
        <div className="card-success">
          <h2 className="heading-section !mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. We help providers navigate CDSS regulations and will get back to you shortly.
          </p>
          <a href="/" className="btn-secondary">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container split-layout">
      {/* Left Side: Mission & Info */}
      <div className="hero-panel">
        <div className="max-w-lg mx-auto lg:mx-0">
          <h1 className="heading-hero">Get in Touch</h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Our mission is to simplify the complex world of CDSS regulations for care providers. 
            Whether you are starting an ARF, RCFE, or Adult Day Program, we are here to help you navigate the licensing process with confidence.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="icon-circle">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-xl">Email Us</h3>
                <p className="text-gray-400">support@carehomeblueprint.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="icon-circle">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-xl">Resources</h3>
                <p className="text-gray-400">Check our guides for Title 22 compliance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="form-panel">
        <div className="card-main">
          <h2 className="heading-section">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                required
                className="form-input"
              />
              <ValidationError prefix="Name" field="fullName" errors={state.errors} />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="form-input"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>

            {/* Facility Type */}
            <div>
              <label htmlFor="facilityType" className="form-label">Facility Type</label>
              <div className="relative">
                <select
                  id="facilityType"
                  name="facilityType"
                  className="form-input appearance-none bg-white"
                  defaultValue="ARF"
                >
                  <option value="ARF">Adult Residential Facility (ARF)</option>
                  <option value="RCFE">RCFE (Elderly)</option>
                  <option value="ADP">Adult Day Program</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <ValidationError prefix="Facility Type" field="facilityType" errors={state.errors} />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="form-input resize-none"
                placeholder="How can we help you with licensing?"
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state.submitting}
              className="btn-primary"
            >
              {state.submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}