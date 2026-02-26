'use client';

/**
 * ExpenseForm component for creating and editing expenses.
 * @module components/ExpenseForm
 */

import { useState } from 'react';
import { Expense } from '@/lib/types';
import CategorySelect from './CategorySelect';

/** Props for the ExpenseForm component */
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

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(getTodayDate());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit({ amount: parsedAmount, category, description, date });

    if (!editingExpense) {
      resetForm();
    }
  };

  const isEditing = Boolean(editingExpense);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="0.00"
          />
        </div>

        <CategorySelect
          categories={categories}
          value={category}
          onChange={setCategory}
          onAddCategory={onAddCategory}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="What did you spend on?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
          {isEditing && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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
  // Use key to reset form state when editingExpense changes
  const key = props.editingExpense?.id ?? 'new';
  return <ExpenseFormInner key={key} {...props} />;
}
