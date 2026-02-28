'use client';

/**
 * ExpenseForm component - Elegant form for creating and editing expenses.
 * @module components/ExpenseForm
 */

import { useState } from 'react';
import { Expense } from '@/lib/types';
import CategorySelect from './CategorySelect';

interface ExpenseFormProps {
  categories: string[];
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onAddCategory: (category: string) => void;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

interface FormState {
  amount: string;
  category: string;
  description: string;
  date: string;
}

function getInitialState(expense: Expense | null | undefined): FormState {
  if (expense) {
    return {
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      date: expense.date,
    };
  }
  return {
    amount: '',
    category: '',
    description: '',
    date: getTodayDate(),
  };
}

function ExpenseFormInner({
  categories,
  onSubmit,
  onAddCategory,
  editingExpense,
  onCancelEdit,
}: ExpenseFormProps) {
  const initialState = getInitialState(editingExpense);
  const [amount, setAmount] = useState(initialState.amount);
  const [category, setCategory] = useState(initialState.category);
  const [description, setDescription] = useState(initialState.description);
  const [date, setDate] = useState(initialState.date);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(getTodayDate());
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || !category || !description || !date) {
      setError('Please fill in all fields');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    await onSubmit({ amount: parsedAmount, category, description, date });
    setIsSubmitting(false);

    if (!editingExpense) {
      resetForm();
    }
  };

  const isEditing = Boolean(editingExpense);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(26, 58, 47, 0.08)',
        border: '1px solid #E8E4DE'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: isEditing
              ? 'linear-gradient(135deg, #C67D5E 0%, #E8A889 100%)'
              : 'linear-gradient(135deg, #8BA888 0%, #B8D4B0 100%)'
          }}
        >
          {isEditing ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: '#2C2C2C' }}
          >
            {isEditing ? 'Edit Expense' : 'New Expense'}
          </h2>
          <p
            className="text-sm"
            style={{ color: '#6B6B6B' }}
          >
            {isEditing ? 'Update your expense details' : 'Track a new purchase'}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="mb-5 p-3 rounded-xl flex items-center gap-2 animate-scale-in"
          style={{
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1px solid #FECACA'
          }}
        >
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-5">
        {/* Amount */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: '#2C2C2C' }}
          >
            Amount
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium"
              style={{ color: '#6B6B6B' }}
            >
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl text-lg font-medium"
              style={{
                background: '#FAF7F2',
                border: '1px solid #E8E4DE',
                color: '#2C2C2C'
              }}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Category */}
        <CategorySelect
          categories={categories}
          value={category}
          onChange={setCategory}
          onAddCategory={onAddCategory}
        />

        {/* Description */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: '#2C2C2C' }}
          >
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl"
            style={{
              background: '#FAF7F2',
              border: '1px solid #E8E4DE',
              color: '#2C2C2C'
            }}
            placeholder="What did you spend on?"
          />
        </div>

        {/* Date */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: '#2C2C2C' }}
          >
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl"
            style={{
              background: '#FAF7F2',
              border: '1px solid #E8E4DE',
              color: '#2C2C2C'
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-5 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            style={{
              background: isEditing
                ? 'linear-gradient(135deg, #C67D5E 0%, #E8A889 100%)'
                : 'linear-gradient(135deg, #1A3A2F 0%, #2D5A47 100%)',
              boxShadow: isEditing
                ? '0 4px 12px rgba(198, 125, 94, 0.3)'
                : '0 4px 12px rgba(26, 58, 47, 0.3)'
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : isEditing ? (
              'Update Expense'
            ) : (
              'Add Expense'
            )}
          </button>
          {isEditing && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-5 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: '#FAF7F2',
                border: '1px solid #E8E4DE',
                color: '#6B6B6B'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default function ExpenseForm(props: ExpenseFormProps) {
  const key = props.editingExpense?.id ?? 'new';
  return <ExpenseFormInner key={key} {...props} />;
}
