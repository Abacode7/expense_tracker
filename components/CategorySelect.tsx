'use client';

import { useState } from 'react';

interface CategorySelectProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  onAddCategory: (category: string) => void;
}

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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category
      </label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAddInput(!showAddInput)}
          className="px-3 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50"
        >
          +
        </button>
      </div>
      {showAddInput && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="New category name"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
