import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'USD' | 'EUR';

interface CurrencyState {
  currency: Currency;
  exchangeRate: number; // EUR to USD rate
  setCurrency: (currency: Currency) => void;
  convert: (amount: number, from?: Currency) => number;
  format: (amount: number, from?: Currency) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'EUR', // Default to EUR for European market
      exchangeRate: 1.10, // 1 EUR = 1.10 USD exactly as required

      setCurrency: (currency: Currency) => {
        set({ currency });
      },

      convert: (amount: number, from: Currency = 'USD') => {
        const { currency, exchangeRate } = get();

        // If displaying in same currency, no conversion needed
        if (from === currency) {
          return amount;
        }

        // Convert from USD to EUR
        if (from === 'USD' && currency === 'EUR') {
          return amount / exchangeRate;
        }

        // Convert from EUR to USD
        if (from === 'EUR' && currency === 'USD') {
          return amount * exchangeRate;
        }

        return amount;
      },

      format: (amount: number, from: Currency = 'USD') => {
        const { currency } = get();
        const convertedAmount = get().convert(amount, from);

        const formatter = new Intl.NumberFormat(
          currency === 'EUR' ? 'fr-FR' : 'en-US',
          {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }
        );

        return formatter.format(convertedAmount);
      }
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({
        currency: state.currency
      })
    }
  )
);