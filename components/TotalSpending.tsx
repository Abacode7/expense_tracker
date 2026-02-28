'use client';

/**
 * TotalSpending component - Elegant spending overview card.
 * @module components/TotalSpending
 */

import { Expense } from '@/lib/types';
import { useMemo } from 'react';

interface TotalSpendingProps {
  expenses: Expense[];
}

export default function TotalSpending({ expenses }: TotalSpendingProps) {
  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const thisMonthTotal = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const formatCurrency = (amount: number) => {
    const [dollars, cents] = amount.toFixed(2).split('.');
    return { dollars, cents };
  };

  const totalParts = formatCurrency(total);
  const monthParts = formatCurrency(thisMonthTotal);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, #1A3A2F 0%, #2D5A47 100%)',
        boxShadow: '0 8px 24px rgba(26, 58, 47, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20"
        style={{ background: '#B8D4B0' }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-20"
        style={{ background: '#E8A889' }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white/70 uppercase tracking-wider">
            Total Spending
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-white/60 text-2xl font-light">$</span>
          <span
            className="text-5xl font-semibold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
          >
            {totalParts.dollars}
          </span>
          <span className="text-2xl text-white/60 font-light">.{totalParts.cents}</span>
        </div>

        <div
          className="mt-4 pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">This Month</p>
            <p className="text-lg font-medium text-white">
              ${monthParts.dollars}
              <span className="text-white/60">.{monthParts.cents}</span>
            </p>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white'
            }}
          >
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
