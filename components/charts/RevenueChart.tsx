'use client'

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  data: Array<{
    date: string;
    value: number;
    label: string;
  }>;
  type?: 'line' | 'bar';
  height?: number;
  showTrend?: boolean;
}

export function RevenueChart({ data, type = 'line', height = 300, showTrend = true }: RevenueChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [trend, setTrend] = useState<{ value: number; percentage: number }>({ value: 0, percentage: 0 });

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Calculate trend
    if (showTrend && data.length > 1) {
      const currentPeriod = data.slice(-7).reduce((sum, d) => sum + d.value, 0);
      const previousPeriod = data.slice(-14, -7).reduce((sum, d) => sum + d.value, 0);
      const change = currentPeriod - previousPeriod;
      const percentage = previousPeriod > 0 ? (change / previousPeriod) * 100 : 0;
      setTrend({ value: change, percentage });
    }

    setChartData({
      labels: data.map(d => d.label),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(d => d.value),
          borderColor: 'rgb(0, 0, 0)',
          backgroundColor: type === 'line'
            ? 'rgba(0, 0, 0, 0.05)'
            : data.map((_, index) =>
                index === data.length - 1
                  ? 'rgb(0, 0, 0)'
                  : 'rgba(0, 0, 0, 0.6)'
              ),
          tension: 0.4,
          fill: type === 'line',
        }
      ]
    });
  }, [data, type, showTrend]);

  const options: ChartOptions<typeof type> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return '$' + (value as number).toLocaleString();
          }
        }
      }
    }
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-pulse bg-gray-200 rounded-lg w-full h-full" />
      </div>
    );
  }

  const ChartComponent = type === 'line' ? Line : Bar;

  return (
    <div className="space-y-4">
      {showTrend && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <span className="text-2xl font-bold">
              ${data[data.length - 1]?.value.toLocaleString() || 0}
            </span>
          </div>
          <div className={`flex items-center gap-1 ${trend.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend.percentage >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {trend.percentage >= 0 ? '+' : ''}{trend.percentage.toFixed(1)}%
            </span>
          </div>
        </motion.div>
      )}
      <div style={{ height }}>
        <ChartComponent data={chartData} options={options as any} />
      </div>
    </div>
  );
}

interface MetricChartProps {
  title: string;
  value: number | string;
  change?: number;
  data: number[];
  prefix?: string;
  suffix?: string;
}

export function MetricChart({ title, value, change, data, prefix = '', suffix = '' }: MetricChartProps) {
  const chartData = {
    labels: data.map((_, i) => ''),
    datasets: [{
      data: data,
      borderColor: change && change >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
    }]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg p-4 shadow-sm"
    >
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-end justify-between mb-2">
        <p className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change >= 0 ? '+' : ''}{change.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div style={{ height: 40 }}>
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
}