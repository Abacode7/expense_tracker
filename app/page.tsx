'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/lib/types';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import TotalSpending from '@/components/TotalSpending';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data);
    } catch {
      setError('Failed to load expenses');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchExpenses(), fetchCategories()]).finally(() => {
      setLoading(false);
    });
  }, [fetchExpenses, fetchCategories]);

  const handleAddExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      setError('');
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      if (!res.ok) throw new Error('Failed to add expense');

      const newExpense = await res.json();
      setExpenses((prev) => [...prev, newExpense]);
    } catch {
      setError('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!editingExpense) return;

    try {
      setError('');
      const res = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      if (!res.ok) throw new Error('Failed to update expense');

      const updatedExpense = await res.json();
      setExpenses((prev) =>
        prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
      );
      setEditingExpense(null);
    } catch {
      setError('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setError('');
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete expense');

      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError('Failed to delete expense');
    }
  };

  const handleAddCategory = async (category: string) => {
    try {
      setError('');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to add category');
        return;
      }

      setCategories((prev) => [...prev, category]);
    } catch {
      setError('Failed to add category');
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              onClick={() => setError('')}
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
              onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
              onAddCategory={handleAddCategory}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
