'use client';

import { useEffect } from 'react';
import CookieConsent from '@/components/CookieConsent';

export default function TestCookiesPage() {
  useEffect(() => {
    // Clear localStorage to force cookie banner to show
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tighter mb-4">COOKIE BANNER PREVIEW</h1>
          <p className="font-mono text-gray-400 tracking-wider">
            Premium GDPR compliance interface for Li-Lo
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-gray-900/50 border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features Included:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-mono text-lg text-accent mb-2">✨ Design Features</h3>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Dark theme matching Li-Lo aesthetic</li>
                  <li>• Animated border glow effect</li>
                  <li>• Premium gradient overlays</li>
                  <li>• Sparkles and rotating icons</li>
                  <li>• Smooth spring animations</li>
                  <li>• Minimizable floating widget</li>
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-lg text-accent mb-2">⚙️ Functionality</h3>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Accept All / Minimal / Custom options</li>
                  <li>• Individual cookie category toggles</li>
                  <li>• Animated toggle switches</li>
                  <li>• localStorage persistence</li>
                  <li>• GDPR compliant categories</li>
                  <li>• Legal page links</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Cookie Categories:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-mono font-bold text-green-400 mb-2">ESSENTIAL</h4>
                <p className="text-xs text-green-300">Always active - Core functionality</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-mono font-bold text-blue-400 mb-2">ANALYTICS</h4>
                <p className="text-xs text-blue-300">Performance metrics & usage data</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-mono font-bold text-purple-400 mb-2">MARKETING</h4>
                <p className="text-xs text-purple-300">Personalized content & ads</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-mono font-bold text-orange-400 mb-2">PREFERENCES</h4>
                <p className="text-xs text-orange-300">Language & custom settings</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                localStorage.removeItem('cookieConsent');
                window.location.reload();
              }}
              className="bg-gradient-to-r from-accent to-yellow-500 text-black px-8 py-4 rounded-lg font-mono text-sm tracking-wider font-bold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300"
            >
              🍪 REFRESH TO SEE BANNER
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Banner Component */}
      <CookieConsent />
    </div>
  );
}