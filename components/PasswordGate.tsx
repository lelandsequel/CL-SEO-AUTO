'use client';

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('seo_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check - in production, use proper auth
    if (password === 'sequel123' || password === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('seo_authenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-4">
            <Lock className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            C&L SEO Lead Finder
          </h1>
          <p className="text-gray-300">
            Enter password to access
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
            autoFocus
          />
          
          {error && (
            <p className="text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Unlock
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Contact C&L Page Services for access
        </p>
      </div>
    </div>
  );
}

