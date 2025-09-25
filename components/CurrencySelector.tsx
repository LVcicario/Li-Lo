'use client'

import { useCurrencyStore, Currency } from '@/lib/currency-store'
import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currencies: { code: Currency; symbol: string; flag: string }[] = [
    { code: 'EUR', symbol: '€', flag: '🇪🇺' },
    { code: 'USD', symbol: '$', flag: '🇺🇸' }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
      >
        <span>{currentCurrency.flag}</span>
        <span>{currentCurrency.code}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 overflow-hidden">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => {
                setCurrency(curr.code)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 ${
                currency === curr.code ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              <span>{curr.flag}</span>
              <span>{curr.code}</span>
              <span className="text-gray-500">{curr.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}