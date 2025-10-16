'use client';

import Link from 'next/link';
import { Search, Calendar, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            C&L SEO Lead Finder
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            by C&L Page Services
          </p>
          <p className="text-lg text-gray-400 mb-12">
            Discover high-value SEO leads automatically
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/search"
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <Search className="w-16 h-16 text-blue-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Manual Search
            </h2>
            <p className="text-gray-300 mb-6">
              Find leads on-demand by location and industry
            </p>
            <div className="text-blue-400 group-hover:text-blue-300 font-semibold">
              Launch Tool →
            </div>
          </Link>

          <Link
            href="/automation"
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-16 h-16 text-purple-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Automation
            </h2>
            <p className="text-gray-300 mb-6">
              Schedule weekly lead generation runs
            </p>
            <div className="text-purple-400 group-hover:text-purple-300 font-semibold">
              Configure →
            </div>
          </Link>

          <Link
            href="/results"
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <BarChart3 className="w-16 h-16 text-green-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Results Dashboard
            </h2>
            <p className="text-gray-300 mb-6">
              View and analyze your leads
            </p>
            <div className="text-green-400 group-hover:text-green-300 font-semibold">
              View Results →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
