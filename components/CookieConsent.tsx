'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Settings, BarChart3, Target, User, Sparkles } from 'lucide-react';
import { useLanguageStore } from '@/lib/i18n';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieConsent() {
  const { t } = useLanguageStore();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const rejected = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(rejected));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {isMinimized ? (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            onClick={() => setIsMinimized(false)}
            className="group relative bg-black border border-white/20 rounded-full p-4 hover:border-accent transition-all duration-300 hover:scale-110"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Settings className="w-6 h-6 text-white group-hover:text-accent" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
            />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <div className="relative bg-black border border-white/20 rounded-2xl overflow-hidden backdrop-blur-xl">
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />

            {/* Animated border glow */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 bg-gradient-to-r from-accent via-purple-500 to-accent rounded-2xl opacity-20 blur-sm"
            />

            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2 bg-gradient-to-br from-accent to-yellow-500 rounded-lg"
                  >
                    <Shield className="w-5 h-5 text-black" />
                  </motion.div>
                  <div>
                    <h3 className="font-mono text-lg font-bold tracking-wider text-white flex items-center gap-2">
                      PRIVACY MODE
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-accent" />
                      </motion.div>
                    </h3>
                    <p className="text-xs font-mono text-gray-400 tracking-wider">
                      ULTRA.SECURE
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <motion.div whileHover={{ rotate: 90 }}>
                      <Settings className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </motion.div>
                  </button>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <motion.div whileHover={{ rotate: 90 }}>
                      <X className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </motion.div>
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                We use premium tracking tech to enhance your <span className="text-accent font-mono font-bold">ULTRA.RARE</span> experience.
                Choose your privacy level below.
              </p>

              {!showDetails ? (
                <div className="space-y-3">
                  <motion.button
                    onClick={handleAcceptAll}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(245, 158, 11, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-accent to-yellow-500 text-black px-6 py-3 rounded-lg font-mono text-sm tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    ACCEPT ALL • PREMIUM
                    <Sparkles className="w-4 h-4" />
                  </motion.button>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={() => setShowDetails(!showDetails)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border border-white/30 px-4 py-2 rounded-lg font-mono text-xs tracking-wider hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-1"
                    >
                      CUSTOMIZE
                      <Settings className="w-3 h-3" />
                    </motion.button>
                    <motion.button
                      onClick={handleRejectAll}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border border-white/20 px-4 py-2 rounded-lg font-mono text-xs tracking-wider hover:bg-white/5 transition-all duration-300 text-gray-400 hover:text-white"
                    >
                      MINIMAL
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Essential - Always On */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="p-2 bg-green-500/20 rounded-lg"
                        >
                          <Shield className="w-4 h-4 text-green-400" />
                        </motion.div>
                        <div>
                          <h4 className="font-mono text-sm font-bold text-white tracking-wider">ESSENTIAL</h4>
                          <p className="text-xs text-green-300">Core system functionality</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-500 text-black rounded-full text-xs font-mono font-bold">
                        REQUIRED
                      </div>
                    </div>
                  </div>

                  {/* Custom toggles for other cookies */}
                  <div className="space-y-3">
                    {[
                      {
                        key: 'analytics' as keyof CookiePreferences,
                        title: 'ANALYTICS',
                        description: 'Performance & usage metrics',
                        icon: BarChart3,
                        gradient: 'from-blue-500/10 to-cyan-500/10',
                        border: 'border-blue-500/20',
                        iconColor: 'text-blue-400',
                        bgColor: 'bg-blue-500/20'
                      },
                      {
                        key: 'marketing' as keyof CookiePreferences,
                        title: 'MARKETING',
                        description: 'Personalized premium content',
                        icon: Target,
                        gradient: 'from-purple-500/10 to-pink-500/10',
                        border: 'border-purple-500/20',
                        iconColor: 'text-purple-400',
                        bgColor: 'bg-purple-500/20'
                      },
                      {
                        key: 'preferences' as keyof CookiePreferences,
                        title: 'PREFERENCES',
                        description: 'Your custom settings & language',
                        icon: User,
                        gradient: 'from-orange-500/10 to-yellow-500/10',
                        border: 'border-orange-500/20',
                        iconColor: 'text-orange-400',
                        bgColor: 'bg-orange-500/20'
                      },
                    ].map((cookie) => {
                      const Icon = cookie.icon;
                      return (
                        <motion.div
                          key={cookie.key}
                          whileHover={{ scale: 1.02 }}
                          className={`bg-gradient-to-r ${cookie.gradient} border ${cookie.border} rounded-lg p-4 cursor-pointer`}
                          onClick={() => togglePreference(cookie.key)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{
                                  scale: preferences[cookie.key] ? [1, 1.2, 1] : 1,
                                  rotate: preferences[cookie.key] ? [0, 360] : 0
                                }}
                                transition={{ duration: 0.6 }}
                                className={`p-2 ${cookie.bgColor} rounded-lg`}
                              >
                                <Icon className={`w-4 h-4 ${cookie.iconColor}`} />
                              </motion.div>
                              <div>
                                <h4 className="font-mono text-sm font-bold text-white tracking-wider">{cookie.title}</h4>
                                <p className="text-xs text-gray-400">{cookie.description}</p>
                              </div>
                            </div>
                            <motion.div
                              animate={{
                                backgroundColor: preferences[cookie.key] ? '#F59E0B' : '#374151',
                                scale: preferences[cookie.key] ? 1.1 : 1
                              }}
                              className="w-12 h-6 rounded-full relative cursor-pointer border border-white/20"
                            >
                              <motion.div
                                animate={{
                                  x: preferences[cookie.key] ? 24 : 2,
                                  backgroundColor: preferences[cookie.key] ? '#000' : '#fff'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute top-1 w-4 h-4 rounded-full"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <motion.button
                      onClick={handleAcceptSelected}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-accent to-yellow-500 text-black px-4 py-3 rounded-lg font-mono text-xs tracking-wider font-bold hover:shadow-lg transition-all duration-300"
                    >
                      SAVE PREMIUM
                    </motion.button>
                    <motion.button
                      onClick={() => setShowDetails(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 border border-white/30 rounded-lg font-mono text-xs tracking-wider hover:bg-white/10 transition-all duration-300"
                    >
                      BACK
                    </motion.button>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs font-mono">
                <a href="/legal/privacy" className="text-gray-400 hover:text-accent transition-colors tracking-wider">
                  PRIVACY
                </a>
                <a href="/legal/cookies" className="text-gray-400 hover:text-accent transition-colors tracking-wider">
                  COOKIES
                </a>
                <a href="/legal/terms" className="text-gray-400 hover:text-accent transition-colors tracking-wider">
                  LEGAL
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}