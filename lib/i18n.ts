import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

// Base translations in French (source language)
const baseTranslations = {
  nav: {
    collections: "Collections",
    allSneakers: "Toutes les Sneakers",
    exclusive: "Exclusif",
    limitedEdition: "Édition Limitée",
    about: "À Propos",
    cart: "Panier",
    account: "Compte",
    search: "Rechercher"
  },
  hero: {
    title: "Sneakers Ultra Rares et Premium",
    subtitle: "Découvrez la collection la plus exclusive",
    shopNow: "Acheter Maintenant",
    viewCollection: "Voir la Collection"
  },
  product: {
    addToCart: "Ajouter au Panier",
    addToWishlist: "Ajouter aux Favoris",
    sizeGuide: "Guide des Tailles",
    selectSize: "Sélectionner la Taille",
    inStock: "En Stock",
    outOfStock: "Rupture de Stock",
    limitedEdition: "Édition Limitée",
    exclusive: "Exclusif",
    new: "Nouveau",
    sale: "Soldes",
    price: "Prix",
    from: "À partir de",
    featured: "En Vedette",
    grail: "Graal"
  },
  pages: {
    home: {
      featuredDrops: "Drops en Vedette",
      handpickedExcellence: "Excellence sélectionnée à la main"
    },
    collections: {
      title: "Collections"
    }
  },
  filters: {
    viewAll: "Voir Tout"
  },
  common: {
    loading: "Chargement",
    error: "Une erreur s'est produite",
    retry: "Réessayer",
    save: "Sauvegarder",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    update: "Mettre à Jour",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    close: "Fermer",
    search: "Rechercher",
    currency: "Devise",
    language: "Langue",
    all: "Tout",
    none: "Aucun",
    yes: "Oui",
    no: "Non"
  }
};

// Translation cache
const translationCacheMap = new Map<string, { translations: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Record<string, any>;
  isLoading: boolean;
  initializeLanguage: () => Promise<void>;
  loadTranslations: (lang: string) => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'fr',
      translations: baseTranslations,
      isLoading: false,

      initializeLanguage: async () => {
        const { currentLanguage } = get();
        await get().loadTranslations(currentLanguage);
      },

      loadTranslations: async (lang: string) => {
        // Check cache first
        const cacheKey = `translations_${lang}`;
        const cached = translationCacheMap.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          set({ currentLanguage: lang, translations: cached.translations, isLoading: false });
          return;
        }

        set({ isLoading: true });

        try {
          // Load translations from static JSON files
          const response = await fetch(`/locales/${lang}.json`);

          if (!response.ok) {
            throw new Error(`Failed to load ${lang} translations`);
          }

          const translations = await response.json();

          // Cache the translations
          translationCacheMap.set(cacheKey, {
            translations,
            timestamp: Date.now()
          });

          set({ currentLanguage: lang, translations, isLoading: false });
        } catch (error) {
          console.error('Failed to load translations:', error);

          // Fall back to base translations if all else fails
          set({ translations: baseTranslations, isLoading: false });
        }
      },

      setLanguage: async (lang: string) => {
        await get().loadTranslations(lang);
      },

      t: (key: string, params?: Record<string, string>) => {
        const { translations, currentLanguage } = get();
        const currentTranslations = translations || baseTranslations;

        // Navigate nested keys
        const keys = key.split('.');
        let value = currentTranslations;

        for (const k of keys) {
          value = value?.[k];
        }

        // If no value found, return the key itself as fallback
        let result = value || key;

        // Replace parameters if provided
        if (params && typeof result === 'string') {
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
          });
        }

        return typeof result === 'string' ? result : key;
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage
      }),
    }
  )
);