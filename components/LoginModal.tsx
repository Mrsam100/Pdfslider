/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
    }

    try {
        const hashedPassword = await hashPassword(formData.password);
        
        setTimeout(() => {
            const dbKey = 'asn_secure_users_v2';
            const users = JSON.parse(localStorage.getItem(dbKey) || '{}');
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
                setTimeout(() => onLogin(formData.name, formData.email), 1000);
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
                setTimeout(() => onLogin(user.name, formData.email), 800);
            }
        }, 1000); // Network delay simulation
    } catch (err) {
        setError("Security module error.");
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-[#0F172A]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl animate-modal relative border border-gray-200">
            
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-2xl font-black text-[#0F172A] mb-1">{isSignUp ? 'Create Account' : 'Secure Login'}</h2>
                <p className="text-xs text-gray-500 font-medium">Enterprise Gateway</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                    <div className="animate-fade-in-up">
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#0F172A] focus:bg-white outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Email</label>
                    <input 
                        type="email" 
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#0F172A] focus:bg-white outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="user@company.com"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#0F172A] focus:bg-white outline-none transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-pulse">
                        <svg className="w-4 h-4 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="text-xs font-bold text-red-600 leading-tight">{error}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="text-xs font-bold text-green-600">{successMsg}</span>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading || !!successMsg}
                    className="w-full py-3 bg-[#0F172A] text-white text-sm font-bold rounded-lg shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                       <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                       isSignUp ? 'Create Account' : 'Sign In'
                    )}
                </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <button 
                    onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
                    className="text-xs font-bold text-gray-500 hover:text-[#4F46E5] transition-colors"
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'No account? Create one'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default LoginModal;