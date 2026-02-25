'use client';

import { Expense } from '@/lib/types';
import { EmptyListIcon } from './icons';
import ExpenseItem from './ExpenseItem';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

function sortByDateDescending(expenses: Expense[]): Expense[] {
  return [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default function ExpenseList({ expenses, onEdit, onDelete, loading }: ExpenseListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <EmptyListIcon className="w-16 h-16 mx-auto text-gray-300" />
        <p className="mt-4 text-gray-500">No expenses yet. Add your first expense above!</p>
      </div>
    );
  }

  const sortedExpenses = sortByDateDescending(expenses);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {sortedExpenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
