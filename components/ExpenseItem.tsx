'use client';

/**
 * ExpenseItem component for displaying a single expense entry.
 * @module components/ExpenseItem
 */

import { Expense } from '@/lib/types';
import { EditIcon, DeleteIcon } from './icons';

/** Props for the ExpenseItem component */
interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-800',
  Transport: 'bg-blue-100 text-blue-800',
  Entertainment: 'bg-purple-100 text-purple-800',
  Bills: 'bg-red-100 text-red-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Healthcare: 'bg-green-100 text-green-800',
  Other: 'bg-gray-100 text-gray-800',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const categoryColor = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
            {expense.category}
          </span>
          <span className="text-sm text-gray-500">{formatDate(expense.date)}</span>
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
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Delete expense"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
