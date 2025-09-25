'use client'

import React from 'react';
import { useMockData } from '@/lib/hooks/useMockData';
import { motion } from 'framer-motion';
import { Database, TestTube, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DataToggle() {
  const { isUsingMockData, toggleMockData } = useMockData();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={toggleMockData}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg
              font-medium text-sm transition-all duration-200
              ${isUsingMockData
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
              }
            `}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isUsingMockData ? (
              <>
                <TestTube className="w-4 h-4" />
                <span>Mock Data</span>
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"
                />
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                <span>Live Data</span>
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              </>
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <p className="font-semibold">
              {isUsingMockData ? 'Using Mock Data' : 'Using Live Data'}
            </p>
            <p className="text-sm text-gray-600">
              {isUsingMockData
                ? 'Displaying simulated data for testing and demonstration'
                : 'Connected to real database (may be empty if no data exists)'}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <AlertCircle className="w-3 h-3" />
              <span>Click to switch data source</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface DataStatusBadgeProps {
  className?: string;
}

export function DataStatusBadge({ className = '' }: DataStatusBadgeProps) {
  const { isUsingMockData } = useMockData();

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isUsingMockData ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
      <span className={isUsingMockData ? 'text-yellow-700' : 'text-green-700'}>
        {isUsingMockData ? 'Mock' : 'Live'}
      </span>
    </div>
  );
}