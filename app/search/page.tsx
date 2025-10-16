'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Search, Loader2, Download } from 'lucide-react';

export default function SearchPage() {
  const [location, setLocation] = useState('Austin, TX');
  const [mode, setMode] = useState<'auto' | 'manual' | 'hybrid'>('auto');
  const [industries, setIndustries] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          industries,
          mode,
        }),
      });

      const data = await response.json();

      if (data.results) {
        setResults(data.results);
      } else {
        console.error('Search failed:', data.error);
        // Fallback to mock data if API fails
        setResults([
          {
            business: 'Example Business',
            industry: 'Sample',
            website: 'example.com',
            seo_score: 75,
            issues: ['API error - showing sample data'],
            phone: 'N/A',
          },
        ]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csv = [
      ['Business', 'Industry', 'Website', 'SEO Score', 'Phone', 'Issues'],
      ...results.map(r => [
        r.business,
        r.industry,
        r.website,
        r.seo_score,
        r.phone,
        r.issues.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${location.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-lg">Back to Home</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔍 Manual Lead Search
          </h1>
          <p className="text-xl text-gray-300">
            Find SEO leads on-demand by location and industry
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                📍 Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., Austin, TX"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                🏭 Industry Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('auto')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    mode === 'auto'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setMode('manual')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    mode === 'manual'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => setMode('hybrid')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    mode === 'hybrid'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Hybrid
                </button>
              </div>
            </div>
          </div>

          {(mode === 'manual' || mode === 'hybrid') && (
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                🎯 Industries (comma-separated)
              </label>
              <input
                type="text"
                value={industries}
                onChange={(e) => setIndustries(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., dentists, plumbers, HVAC"
              />
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find Leads
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">
                📊 Results ({results.length} leads)
              </h2>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                <Download className="w-5 h-5" />
                Download CSV
              </button>
            </div>

            <div className="space-y-4">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {result.business}
                      </h3>
                      <p className="text-gray-400">{result.industry}</p>
                    </div>
                    <div className={`text-3xl font-bold ${
                      result.seo_score >= 70 ? 'text-red-400' : 
                      result.seo_score >= 50 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {result.seo_score}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Website</p>
                      <a
                        href={`https://${result.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        {result.website}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Phone</p>
                      <p className="text-white font-semibold">{result.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">SEO Issues</p>
                    <div className="flex flex-wrap gap-2">
                      {result.issues.map((issue: string, i: number) => (
                        <span
                          key={i}
                          className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

