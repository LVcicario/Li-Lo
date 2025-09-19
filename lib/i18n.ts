import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Record<string, any>;
  isLoading: boolean;
  initializeLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'fr',
      translations: {},
      isLoading: false,

      initializeLanguage: async () => {
        const { currentLanguage, translations } = get();
        if (Object.keys(translations).length === 0) {
          set({ isLoading: true });
          try {
            const response = await fetch(`/locales/${currentLanguage}/common.json`);
            if (!response.ok) {
              throw new Error(`Failed to fetch translations: ${response.status}`);
            }
            const newTranslations = await response.json();
            set({ translations: newTranslations, isLoading: false });
          } catch (error) {
            console.error('Failed to load translations:', error);
            set({ isLoading: false });
          }
        }
      },

      setLanguage: async (lang: string) => {
        try {
          set({ isLoading: true });
          const response = await fetch(`/locales/${lang}/common.json`);
          if (!response.ok) {
            throw new Error(`Failed to fetch translations: ${response.status}`);
          }
          const translations = await response.json();
          set({ currentLanguage: lang, translations, isLoading: false });
        } catch (error) {
          console.error('Failed to load translations:', error);
          // Fallback to English if French fails
          if (lang !== 'en') {
            try {
              const response = await fetch('/locales/en/common.json');
              const translations = await response.json();
              set({ currentLanguage: 'en', translations, isLoading: false });
            } catch (fallbackError) {
              console.error('Failed to load fallback translations:', fallbackError);
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        }
      },

      t: (key: string, params?: Record<string, string>) => {
        const { translations } = get();

        // Return key if no translations loaded yet (prevents hydration mismatch)
        if (!translations || Object.keys(translations).length === 0) {
          return key;
        }

        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
          value = value?.[k];
        }

        let result = value || key;

        // Replace parameters if provided
        if (params && typeof result === 'string') {
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
          });
        }

        return result;
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        translations: state.translations
      }),
    }
  )
);