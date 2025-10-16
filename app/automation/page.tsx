'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Calendar, Save, Play, Pause, Loader2 } from 'lucide-react';

export default function AutomationPage() {
  const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState('Houston, TX');
  const [day, setDay] = useState('monday');
  const [time, setTime] = useState('09:00');
  const [industries, setIndustries] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/automation');
      const data = await response.json();

      if (data.config) {
        setEnabled(data.config.enabled);
        setLocation(data.config.location);
        setDay(data.config.day_of_week);
        setTime(data.config.time);
        setIndustries(data.config.industries || '');
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled,
          location,
          day_of_week: day,
          time,
          industries,
        }),
      });

      const data = await response.json();

      if (data.config) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-lg">Back to Home</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ⏰ Automation Settings
          </h1>
          <p className="text-xl text-gray-300">
            Schedule weekly lead generation runs
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Automation Status
              </h2>
              <p className="text-gray-300">
                {enabled ? '✅ Active - Running weekly' : '❌ Disabled'}
              </p>
            </div>
            <button
              onClick={async () => {
                const newEnabled = !enabled;
                setEnabled(newEnabled);
                await fetch('/api/automation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    enabled: newEnabled,
                    location,
                    day_of_week: day,
                    time,
                    industries,
                  }),
                });
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                enabled
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {enabled ? (
                <>
                  <Pause className="w-5 h-5" />
                  Disable
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Enable
                </>
              )}
            </button>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            📋 Configuration
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                📍 Default Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="e.g., Houston, TX"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  📅 Day of Week
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  🕐 Time (24h format)
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                🎯 Target Industries (optional, comma-separated)
              </label>
              <input
                type="text"
                value={industries}
                onChange={(e) => setIndustries(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Leave blank for auto-discovery, or specify: dentists, plumbers, HVAC"
              />
              <p className="text-gray-400 text-sm mt-2">
                Leave blank to auto-discover top industries, or specify your own
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saved ? 'Saved! ✓' : 'Save Configuration'}
          </button>
        </div>

        {/* Schedule Preview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            📆 Schedule Preview
          </h2>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-white">Next Run:</span>{' '}
              {enabled ? `Every ${day.charAt(0).toUpperCase() + day.slice(1)} at ${time}` : 'Not scheduled (automation disabled)'}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-white">Location:</span> {location}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-white">Industries:</span>{' '}
              {industries || 'Auto-discover top 5 industries'}
            </p>
          </div>

          {enabled && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-300 font-semibold">
                ✅ Automation is active! Leads will be generated automatically and saved to your results dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

