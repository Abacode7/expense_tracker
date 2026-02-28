'use client';

/**
 * ExpenseItem component - Elegant individual expense row.
 * @module components/ExpenseItem
 */

import { useState } from 'react';
import { Expense } from '@/lib/types';
import { EditIcon, DeleteIcon } from './icons';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  Food: { bg: '#FFF7ED', text: '#C2410C', icon: '🍽️' },
  Transport: { bg: '#EFF6FF', text: '#1D4ED8', icon: '🚗' },
  Entertainment: { bg: '#FAF5FF', text: '#7E22CE', icon: '🎬' },
  Bills: { bg: '#FEF2F2', text: '#B91C1C', icon: '📄' },
  Shopping: { bg: '#FDF2F8', text: '#BE185D', icon: '🛍️' },
  Healthcare: { bg: '#F0FDF4', text: '#15803D', icon: '💊' },
  Other: { bg: '#FAF7F2', text: '#6B6B6B', icon: '📦' },
};

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const categoryStyle = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.Other;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(expense.id);
  };

  const formatAmount = (amount: number) => {
    const [dollars, cents] = amount.toFixed(2).split('.');
    return { dollars, cents };
  };

  const amountParts = formatAmount(expense.amount);

  return (
    <div
      className={`group flex items-center justify-between px-6 py-4 transition-all duration-200 ${
        isDeleting ? 'opacity-50 scale-98' : ''
      }`}
      style={{
        borderBottom: '1px solid #E8E4DE',
        background: '#FFFFFF'
      }}
      onMouseEnter={() => {}}
      onMouseLeave={() => setShowConfirm(false)}
    >
      {/* Left side - Category and description */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: categoryStyle.bg }}
        >
          {categoryStyle.icon}
        </div>

        {/* Description and category */}
        <div className="min-w-0">
          <p
            className="font-medium truncate"
            style={{ color: '#2C2C2C' }}
          >
            {expense.description}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: categoryStyle.bg,
                color: categoryStyle.text
              }}
            >
              {expense.category}
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Amount and actions */}
      <div className="flex items-center gap-4 ml-4">
        {/* Amount */}
        <div className="text-right">
          <p
            className="text-lg font-semibold tabular-nums"
            style={{ color: '#2C2C2C' }}
          >
            <span style={{ color: '#6B6B6B' }}>$</span>
            {amountParts.dollars}
            <span style={{ color: '#6B6B6B', fontSize: '0.875em' }}>
              .{amountParts.cents}
            </span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {showConfirm ? (
            <>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: '#FAF7F2',
                  color: '#6B6B6B'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(expense)}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-green-50"
                style={{ color: '#2D5A47' }}
                aria-label="Edit expense"
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-red-50"
                style={{ color: '#C67D5E' }}
                aria-label="Delete expense"
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
