'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/lib/types';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import TotalSpending from '@/components/TotalSpending';

export default function Home() {
  const {
    expenses,
    loading,
    error: expenseError,
    clearError: clearExpenseError,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  const {
    categories,
    error: categoryError,
    clearError: clearCategoryError,
    fetchCategories,
    addCategory,
  } = useCategories();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const error = expenseError || categoryError;

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [fetchExpenses, fetchCategories]);

  const handleSubmit = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      const success = await updateExpense(editingExpense.id, expense);
      if (success) setEditingExpense(null);
    } else {
      await addExpense(expense);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearError = () => {
    clearExpenseError();
    clearCategoryError();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600 mt-1">Track your spending and stay on budget</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={clearError}
              className="ml-4 text-red-800 hover:text-red-900 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <TotalSpending expenses={expenses} />
            <ExpenseForm
              categories={categories}
              onSubmit={handleSubmit}
              onAddCategory={addCategory}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={deleteExpense}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
