'use client';

/**
 * CategorySelect component - Elegant category selector with add functionality.
 * @module components/CategorySelect
 */

import { useState } from 'react';

interface CategorySelectProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  onAddCategory: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍽️',
  Transport: '🚗',
  Entertainment: '🎬',
  Bills: '📄',
  Shopping: '🛍️',
  Healthcare: '💊',
  Other: '📦',
};

export default function CategorySelect({
  categories,
  value,
  onChange,
  onAddCategory,
}: CategorySelectProps) {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setShowAddInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Escape') {
      setShowAddInput(false);
      setNewCategory('');
    }
  };

  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: '#2C2C2C' }}
      >
        Category
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl appearance-none cursor-pointer"
            style={{
              background: '#FAF7F2',
              border: '1px solid #E8E4DE',
              color: value ? '#2C2C2C' : '#6B6B6B',
              paddingRight: '2.5rem'
            }}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat] || '📦'} {cat}
              </option>
            ))}
          </select>
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#6B6B6B' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAddInput(!showAddInput)}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: showAddInput ? '#8BA888' : '#FAF7F2',
            border: '1px solid #E8E4DE',
            color: showAddInput ? 'white' : '#1A3A2F'
          }}
          title="Add new category"
        >
          <svg
            className="w-5 h-5 transition-transform duration-200"
            style={{ transform: showAddInput ? 'rotate(45deg)' : 'none' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Add new category input */}
      {showAddInput && (
        <div
          className="mt-3 flex gap-2 animate-scale-in"
          style={{ transformOrigin: 'top' }}
        >
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 rounded-xl"
            style={{
              background: '#FAF7F2',
              border: '1px solid #8BA888',
              color: '#2C2C2C'
            }}
            placeholder="New category name"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newCategory.trim()}
            className="px-5 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: 'linear-gradient(135deg, #8BA888 0%, #B8D4B0 100%)',
              boxShadow: '0 4px 12px rgba(139, 168, 136, 0.3)'
            }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
