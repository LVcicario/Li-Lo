// =============================================
// SIZE SELECTOR COMPONENT
// EU/US Size Conversion with Dynamic Toggle
// ==============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SIZE_CHART, formatSizeDisplay, Gender } from '@/types/size-conversion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SizeSelectorProps {
  selectedSize?: number; // EU size
  onSizeSelect: (euSize: number) => void;
  availableSizes?: number[]; // EU sizes available
  gender?: Gender;
  className?: string;
}

export function SizeSelector({
  selectedSize,
  onSizeSelect,
  availableSizes,
  gender = 'men',
  className = '',
}: SizeSelectorProps) {
  const [displayType, setDisplayType] = useState<'EU' | 'US'>('EU');

  const allSizes = SIZE_CHART.map(s => s.eu);
  const sizesToShow = availableSizes && availableSizes.length > 0 ? availableSizes : allSizes;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toggle EU/US */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Size</h3>
        <div className="flex gap-2">
          <Button
            variant={displayType === 'EU' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDisplayType('EU')}
            className="min-w-[60px]"
          >
            EU
          </Button>
          <Button
            variant={displayType === 'US' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDisplayType('US')}
            className="min-w-[60px]"
          >
            US
          </Button>
        </div>
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {sizesToShow.map((euSize) => {
          const sizeInfo = SIZE_CHART.find(s => s.eu === euSize);
          if (!sizeInfo) return null;

          const isSelected = selectedSize === euSize;
          const isAvailable = !availableSizes || availableSizes.includes(euSize);

          const displayLabel = displayType === 'EU'
            ? `EU ${euSize}`
            : gender === 'women'
            ? sizeInfo.us_women
            : sizeInfo.us_men;

          return (
            <motion.button
              key={euSize}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              onClick={() => isAvailable && onSizeSelect(euSize)}
              disabled={!isAvailable}
              className={`
                relative h-14 rounded-lg border-2 font-semibold text-sm transition-all
                ${
                  isSelected
                    ? 'border-red-500 bg-red-500 text-white'
                    : isAvailable
                    ? 'border-gray-300 hover:border-red-400 bg-white text-gray-900'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                }
              `}
            >
              {displayLabel}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1"
                >
                  <Check className="h-3 w-3" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Size Info */}
      {selectedSize && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold text-blue-900">Selected Size:</span>
              <span className="ml-2 text-blue-700">
                {formatSizeDisplay(selectedSize, 'EU')} / {formatSizeDisplay(selectedSize, 'US', gender)}
              </span>
            </div>
            <Badge variant="outline" className="border-blue-300 text-blue-700">
              {formatSizeDisplay(selectedSize, 'CM')}
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Size Guide Link */}
      <div className="text-center">
        <button className="text-sm text-gray-600 hover:text-gray-900 underline">
          View Size Guide
        </button>
      </div>
    </div>
  );
}

// Size Chart Table Component
export function SizeChart({ gender = 'men' }: { gender?: Gender }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left font-semibold">EU</th>
            <th className="py-3 px-4 text-left font-semibold">US (Men)</th>
            <th className="py-3 px-4 text-left font-semibold">US (Women)</th>
            <th className="py-3 px-4 text-left font-semibold">UK</th>
            <th className="py-3 px-4 text-left font-semibold">CM</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART.map((size, index) => (
            <tr
              key={size.eu}
              className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            >
              <td className="py-2 px-4 font-medium">{size.eu}</td>
              <td className="py-2 px-4">{size.us_men}</td>
              <td className="py-2 px-4">{size.us_women}</td>
              <td className="py-2 px-4">{size.uk}</td>
              <td className="py-2 px-4">{size.cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}