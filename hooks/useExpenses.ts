'use client';

/**
 * Custom hook for managing expense CRUD operations.
 * Provides state management and API integration for expenses.
 * @module hooks/useExpenses
 */
import { useState, useCallback } from 'react';
import { Expense } from '@/lib/types';

/** Input type for creating or updating an expense (without generated fields) */
export type ExpenseInput = Omit<Expense, 'id' | 'createdAt'>;

interface UseExpensesReturn {
  expenses: Expense[];
  loading: boolean;
  error: string;
  clearError: () => void;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: ExpenseInput) => Promise<boolean>;
  updateExpense: (id: string, expense: ExpenseInput) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
}

/**
 * Hook for managing expense state and CRUD operations.
 * @returns Object containing expense state and action functions
 * @example
 * const { expenses, loading, addExpense } = useExpenses();
 */
export function useExpenses(): UseExpensesReturn {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const clearError = useCallback(() => setError(''), []);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data);
    } catch {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(async (expense: ExpenseInput): Promise<boolean> => {
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
      return true;
    } catch {
      setError('Failed to add expense');
      return false;
    }
  }, []);

  const updateExpense = useCallback(async (id: string, expense: ExpenseInput): Promise<boolean> => {
    try {
      setError('');
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      if (!res.ok) throw new Error('Failed to update expense');

      const updatedExpense = await res.json();
      setExpenses((prev) =>
        prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
      );
      return true;
    } catch {
      setError('Failed to update expense');
      return false;
    }
  }, []);

  const deleteExpense = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError('');
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete expense');

      setExpenses((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch {
      setError('Failed to delete expense');
      return false;
    }
  }, []);

  return {
    expenses,
    loading,
    error,
    clearError,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
