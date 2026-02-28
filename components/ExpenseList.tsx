'use client';

/**
 * ExpenseList component - Elegant list of expenses with animations.
 * @module components/ExpenseList
 */

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
      <div
        className="rounded-2xl p-12 text-center"
        style={{
          background: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(26, 58, 47, 0.08)',
          border: '1px solid #E8E4DE'
        }}
      >
        <div
          className="w-12 h-12 rounded-full mx-auto border-3 border-gray-200"
          style={{
            borderTopColor: '#1A3A2F',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <p
          className="mt-6 font-medium"
          style={{ color: '#2C2C2C' }}
        >
          Loading expenses
        </p>
        <p
          className="mt-1 text-sm"
          style={{ color: '#6B6B6B' }}
        >
          Just a moment...
        </p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 text-center"
        style={{
          background: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(26, 58, 47, 0.08)',
          border: '1px solid #E8E4DE'
        }}
      >
        <div
          className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: '#FAF7F2' }}
        >
          <EmptyListIcon
            className="w-10 h-10"
            style={{ color: '#8BA888' }}
          />
        </div>
        <h3
          className="mt-6 text-lg font-semibold"
          style={{ color: '#2C2C2C' }}
        >
          No expenses yet
        </h3>
        <p
          className="mt-2 text-sm max-w-xs mx-auto"
          style={{ color: '#6B6B6B' }}
        >
          Start tracking your spending by adding your first expense using the form.
        </p>
      </div>
    );
  }

  const sortedExpenses = sortByDateDescending(expenses);

  // Group expenses by date
  const groupedExpenses = sortedExpenses.reduce<Record<string, Expense[]>>((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  const formatDateHeader = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(26, 58, 47, 0.08)',
        border: '1px solid #E8E4DE'
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          background: '#FAF7F2',
          borderBottom: '1px solid #E8E4DE'
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#B8D4B0' }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: '#1A3A2F' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2
            className="text-lg font-semibold"
            style={{ color: '#2C2C2C' }}
          >
            Recent Expenses
          </h2>
        </div>
        <span
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{
            background: '#B8D4B0',
            color: '#1A3A2F'
          }}
        >
          {expenses.length} total
        </span>
      </div>

      {/* Grouped expense list */}
      <div>
        {Object.entries(groupedExpenses).map(([date, dateExpenses], groupIndex) => (
          <div key={date}>
            {/* Date header */}
            <div
              className="px-6 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{
                background: '#FAF7F2',
                color: '#6B6B6B',
                borderTop: groupIndex > 0 ? '1px solid #E8E4DE' : undefined
              }}
            >
              {formatDateHeader(date)}
            </div>

            {/* Expenses for this date */}
            {dateExpenses.map((expense, index) => (
              <div
                key={expense.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ExpenseItem
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
