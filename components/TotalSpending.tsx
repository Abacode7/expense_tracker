'use client';

import { Expense } from '@/lib/types';

interface TotalSpendingProps {
  expenses: Expense[];
}

export default function TotalSpending({ expenses }: TotalSpendingProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
      <h2 className="text-lg font-medium opacity-90">Total Spending</h2>
      <p className="text-4xl font-bold mt-2">
        ${total.toFixed(2)}
      </p>
      <p className="text-sm opacity-75 mt-1">
        {expenses.length} expense{expenses.length !== 1 ? 's' : ''} tracked
      </p>
    </div>
  );
}
