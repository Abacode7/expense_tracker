'use client';

/**
 * Home page component - Main expense tracker interface.
 * @module app/page
 */

import { useState, useEffect } from 'react';
import { Expense } from '@/lib/types';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import TotalSpending from '@/components/TotalSpending';

/**
 * Home page component that serves as the main expense tracker interface.
 * Coordinates expense and category state through custom hooks.
 */
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
    <div className="min-h-screen" style={{ background: '#FAF7F2' }}>
      {/* Decorative top border */}
      <div
        className="h-1.5 w-full"
        style={{
          background: 'linear-gradient(90deg, #1A3A2F 0%, #8BA888 50%, #C67D5E 100%)'
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 animate-fade-in-up">
          <h1
            className="text-4xl md:text-5xl font-normal tracking-tight"
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              color: '#1A3A2F'
            }}
          >
            Expenses
          </h1>
          <p
            className="mt-3 text-lg"
            style={{ color: '#6B6B6B' }}
          >
            Track your spending with clarity
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-8 p-4 rounded-xl flex items-center justify-between animate-scale-in"
            style={{
              background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
              border: '1px solid #FECACA'
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#FEE2E2' }}
              >
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="p-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Form & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="animate-fade-in-up stagger-1">
              <TotalSpending expenses={expenses} />
            </div>
            <div className="animate-fade-in-up stagger-2">
              <ExpenseForm
                categories={categories}
                onSubmit={handleSubmit}
                onAddCategory={addCategory}
                editingExpense={editingExpense}
                onCancelEdit={() => setEditingExpense(null)}
              />
            </div>
          </div>

          {/* Right Column - Expense List */}
          <div className="lg:col-span-8 animate-fade-in-up stagger-3">
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={deleteExpense}
              loading={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <footer
          className="mt-16 pt-8 text-center text-sm animate-fade-in stagger-5"
          style={{
            borderTop: '1px solid #E8E4DE',
            color: '#6B6B6B'
          }}
        >
          Built with care
        </footer>
      </div>
    </div>
  );
}
