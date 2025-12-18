/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ⚠️ SECURITY WARNING ⚠️
 * This is a CLIENT-SIDE ONLY authentication implementation for DEMO purposes.
 * DO NOT use this in production. This implementation has critical security flaws:
 * 1. localStorage is vulnerable to XSS attacks
 * 2. SHA-256 is NOT suitable for password hashing (use bcrypt/scrypt on server)
 * 3. All authentication logic is client-side and can be bypassed
 * 4. No protection against brute force attacks
 *
 * For production, implement proper backend authentication with:
 * - Server-side password hashing (bcrypt, scrypt, Argon2)
 * - HTTPOnly secure cookies for session management
 * - HTTPS only
 * - Rate limiting and brute force protection
 * - Proper CSRF protection
*/

import React, { useState, useEffect } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Default to Login
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear messages on mode switch
  useEffect(() => {
    setError('');
    setSuccessMsg('');
  }, [isSignUp]);

  const hashPassword = async (password: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Basic Format Validation
    if (!validateEmail(formData.email)) {
        setError("Invalid email format.");
        setLoading(false);
        return;
    }
    if (formData.password.length < 12) {
        setError("Password must be at least 12 characters for security.");
        setLoading(false);
        return;
    }

    try {
        const hashedPassword = await hashPassword(formData.password);

        // Process authentication immediately (removed artificial delay)
        const dbKey = 'asn_secure_users_v2';
        let users;
        try {
            users = JSON.parse(localStorage.getItem(dbKey) || '{}');
        } catch (parseError) {
            console.error("Failed to parse user database:", parseError);
            setError("Authentication system error. Please clear your browser data.");
            setLoading(false);
            return;
        }
        const emailKey = formData.email.toLowerCase();

        if (isSignUp) {
            // --- REGISTRATION LOGIC ---
            if (users[emailKey]) {
                setError('Account already exists. Please Sign In.');
                setLoading(false);
                return;
            }

            if (!formData.name.trim()) {
                setError('Full Name is required for registration.');
                setLoading(false);
                return;
            }

            // Save new user
            users[emailKey] = {
                name: formData.name,
                hash: hashedPassword,
                created: Date.now()
            };
            localStorage.setItem(dbKey, JSON.stringify(users));

            setSuccessMsg("Account created successfully! Logging you in...");
            setTimeout(() => onLogin(formData.name, formData.email), 500);
        } else {
            // --- LOGIN LOGIC ---
            const user = users[emailKey];

            if (!user) {
                setError('Account does not exist. Please create an account first.');
                setLoading(false);
                return;
            }

            if (user.hash !== hashedPassword) {
                setError('Incorrect password. Please try again.');
                setLoading(false);
                return;
            }

            setSuccessMsg("Credentials verified.");
            setTimeout(() => onLogin(user.name, formData.email), 500);
        }
    } catch (err) {
        setError("Security module error.");
        setLoading(false);
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
         style={{ zIndex: 400, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-4 p-4 p-md-5 shadow position-relative border border-secondary"
           style={{ maxWidth: '24rem', width: '100%' }}>

        <button onClick={onClose} className="btn-close position-absolute top-0 end-0 m-3"></button>

        <div className="text-center mb-4">
          <div className="bg-dark rounded-3 d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
               style={{ width: '3rem', height: '3rem' }}>
            <svg style={{ width: '1.5rem', height: '1.5rem' }} className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="h4 fw-black text-dark mb-1">{isSignUp ? 'Create Account' : 'Secure Login'}</h2>
          <p className="text-secondary fw-medium" style={{ fontSize: '0.75rem' }}>Enterprise Gateway</p>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-3 animate-fade-in-up">
              <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '0.625rem' }}>Full Name</label>
              <input
                type="text"
                className="form-control bg-light border-secondary fw-semibold"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                style={{ fontSize: '0.875rem' }}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '0.625rem' }}>Email</label>
            <input
              type="email"
              required
              className="form-control bg-light border-secondary fw-semibold"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="user@company.com"
              style={{ fontSize: '0.875rem' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '0.625rem' }}>Password</label>
            <input
              type="password"
              required
              className="form-control bg-light border-secondary fw-semibold"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••"
              style={{ fontSize: '0.875rem' }}
            />
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-start gap-2 p-3 mb-3" role="alert">
              <svg style={{ width: '1rem', height: '1rem' }} className="text-danger flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="fw-bold" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success d-flex align-items-center gap-2 p-3 mb-3" role="alert">
              <svg style={{ width: '1rem', height: '1rem' }} className="text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="fw-bold" style={{ fontSize: '0.75rem' }}>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="btn btn-dark w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
            style={{ fontSize: '0.875rem' }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
            className="btn btn-link text-secondary fw-bold text-decoration-none p-0"
            style={{ fontSize: '0.75rem' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'No account? Create one'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
