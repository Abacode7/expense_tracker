'use client';

/**
 * Custom hook for managing category state and operations.
 * Provides state management and API integration for categories.
 * @module hooks/useCategories
 */
import { useState, useCallback } from 'react';

/** Return type for the useCategories hook */
interface UseCategoriesReturn {
  categories: string[];
  error: string;
  clearError: () => void;
  fetchCategories: () => Promise<void>;
  addCategory: (category: string) => Promise<boolean>;
}

/**
 * Hook for managing category state and operations.
 * @returns Object containing category state and action functions
 * @example
 * const { categories, addCategory } = useCategories();
 */
export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState('');

  const clearError = useCallback(() => setError(''), []);

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

  const addCategory = useCallback(async (category: string): Promise<boolean> => {
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
        return false;
      }

      setCategories((prev) => [...prev, category]);
      return true;
    } catch {
      setError('Failed to add category');
      return false;
    }
  }, []);

  return {
    categories,
    error,
    clearError,
    fetchCategories,
    addCategory,
  };
}
