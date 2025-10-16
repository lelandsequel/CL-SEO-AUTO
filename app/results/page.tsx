'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Download, Filter, TrendingUp, Users, Target } from 'lucide-react';

export default function ResultsPage() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  
  // Mock data
  const allLeads = [
    {
      id: 1,
      business: 'Austin Dental Care',
      industry: 'Dentists',
      location: 'Austin, TX',
      website: 'austindentalcare.com',
      seo_score: 85,
      phone: '(512) 555-0123',
      email: 'info@austindentalcare.com',
      date: '2025-10-15',
    },
    {
      id: 2,
      business: 'Hill Country Plumbing',
      industry: 'Plumbers',
      location: 'Austin, TX',
      website: 'hillcountryplumbing.com',
      seo_score: 72,
      phone: '(512) 555-0456',
      email: 'contact@hillcountryplumbing.com',
      date: '2025-10-15',
    },
    {
      id: 3,
      business: 'Texas HVAC Solutions',
      industry: 'HVAC',
      location: 'Austin, TX',
      website: 'texashvacsolutions.com',
      seo_score: 68,
      phone: '(512) 555-0789',
      email: 'sales@texashvacsolutions.com',
      date: '2025-10-15',
    },
    {
      id: 4,
      business: 'Downtown Law Firm',
      industry: 'Lawyers',
      location: 'Austin, TX',
      website: 'downtownlawfirm.com',
      seo_score: 55,
      phone: '(512) 555-0321',
      email: 'info@downtownlawfirm.com',
      date: '2025-10-14',
    },
    {
      id: 5,
      business: 'Green Landscaping Co',
      industry: 'Landscaping',
      location: 'Austin, TX',
      website: 'greenlandscaping.com',
      seo_score: 42,
      phone: '(512) 555-0654',
      email: 'hello@greenlandscaping.com',
      date: '2025-10-14',
    },
  ];

  const filteredLeads = allLeads.filter(lead => {
    if (filter === 'hot') return lead.seo_score >= 70;
    if (filter === 'warm') return lead.seo_score >= 50 && lead.seo_score < 70;
    if (filter === 'cold') return lead.seo_score < 50;
    return true;
  });

  const stats = {
    total: allLeads.length,
    hot: allLeads.filter(l => l.seo_score >= 70).length,
    warm: allLeads.filter(l => l.seo_score >= 50 && l.seo_score < 70).length,
    cold: allLeads.filter(l => l.seo_score < 50).length,
  };

  const downloadCSV = () => {
    const csv = [
      ['Business', 'Industry', 'Location', 'Website', 'SEO Score', 'Phone', 'Email', 'Date'],
      ...filteredLeads.map(l => [
        l.business,
        l.industry,
        l.location,
        l.website,
        l.seo_score,
        l.phone,
        l.email,
        l.date,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-lg">Back to Home</span>
          </Link>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            📊 Results Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            View and analyze your SEO leads
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">{stats.total}</span>
            </div>
            <p className="text-gray-300 font-semibold">Total Leads</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-red-400" />
              <span className="text-3xl font-bold text-red-400">{stats.hot}</span>
            </div>
            <p className="text-gray-300 font-semibold">Hot Leads (70+)</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-bold text-yellow-400">{stats.warm}</span>
            </div>
            <p className="text-gray-300 font-semibold">Warm Leads (50-69)</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Filter className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-green-400">{stats.cold}</span>
            </div>
            <p className="text-gray-300 font-semibold">Cold Leads (&lt;50)</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">Filter:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('hot')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'hot'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Hot ({stats.hot})
              </button>
              <button
                onClick={() => setFilter('warm')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'warm'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Warm ({stats.warm})
              </button>
              <button
                onClick={() => setFilter('cold')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'cold'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Cold ({stats.cold})
              </button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Leads ({filteredLeads.length})
          </h2>

          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {lead.business}
                    </h3>
                    <p className="text-gray-400">{lead.industry} • {lead.location}</p>
                  </div>
                  <div className={`text-3xl font-bold ${
                    lead.seo_score >= 70 ? 'text-red-400' : 
                    lead.seo_score >= 50 ? 'text-yellow-400' : 
                    'text-green-400'
                  }`}>
                    {lead.seo_score}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Website</p>
                    <a
                      href={`https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      {lead.website}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                    <p className="text-white font-semibold">{lead.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-semibold">{lead.email}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm">
                    Added: {new Date(lead.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

