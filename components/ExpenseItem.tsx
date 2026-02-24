'use client';

import { Expense } from '@/lib/types';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-800',
  Transport: 'bg-blue-100 text-blue-800',
  Entertainment: 'bg-purple-100 text-purple-800',
  Bills: 'bg-red-100 text-red-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Healthcare: 'bg-green-100 text-green-800',
  Other: 'bg-gray-100 text-gray-800',
};

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const categoryColor = categoryColors[expense.category] || categoryColors.Other;

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
            {expense.category}
          </span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <p className="mt-1 text-gray-800 font-medium">{expense.description}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-gray-900">
          ${expense.amount.toFixed(2)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            aria-label="Edit expense"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Delete expense"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
