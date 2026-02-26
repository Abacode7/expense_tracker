# Component Documentation

This document provides detailed documentation for all React components in the Expense Tracker application.

## Component Hierarchy

```
App
└── Home (app/page.tsx)
    ├── TotalSpending
    ├── ExpenseForm
    │   └── CategorySelect
    └── ExpenseList
        └── ExpenseItem
            ├── EditIcon
            └── DeleteIcon
```

## Components

### Home

**Location:** `app/page.tsx`

The main page component that serves as the expense tracker interface. Coordinates expense and category state through custom hooks.

**Hooks Used:**
- `useExpenses` - Manages expense CRUD operations
- `useCategories` - Manages category state

**State:**
| State | Type | Description |
|-------|------|-------------|
| editingExpense | `Expense \| null` | Currently editing expense |

**Event Handlers:**
| Handler | Description |
|---------|-------------|
| handleSubmit | Creates or updates expense based on editing state |
| handleEdit | Sets expense for editing and scrolls to form |
| clearError | Clears both expense and category errors |

---

### ExpenseForm

**Location:** `components/ExpenseForm.tsx`

Form component for creating and editing expenses. Uses a key-based reset pattern to reinitialize form state when switching between create and edit modes.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| categories | `string[]` | Yes | Available categories |
| onSubmit | `(expense: Omit<Expense, 'id' \| 'createdAt'>) => void` | Yes | Submit handler |
| onAddCategory | `(category: string) => void` | Yes | Add category handler |
| editingExpense | `Expense \| null` | No | Expense being edited |
| onCancelEdit | `() => void` | No | Cancel edit handler |

**Form Fields:**
- Amount (number, required, > 0)
- Category (select, required)
- Description (text, required)
- Date (date, defaults to today)

**Validation:**
- All fields are required
- Amount must be a positive number

---

### ExpenseList

**Location:** `components/ExpenseList.tsx`

Displays a list of expenses sorted by date (most recent first). Shows loading spinner or empty state when appropriate.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| expenses | `Expense[]` | Yes | Array of expenses |
| onEdit | `(expense: Expense) => void` | Yes | Edit handler |
| onDelete | `(id: string) => void` | Yes | Delete handler |
| loading | `boolean` | No | Loading state |

**States:**
- **Loading:** Shows animated spinner
- **Empty:** Shows EmptyListIcon with prompt
- **List:** Shows sorted expenses

---

### ExpenseItem

**Location:** `components/ExpenseItem.tsx`

Individual expense row with category badge, date, description, amount, and action buttons.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| expense | `Expense` | Yes | Expense data |
| onEdit | `(expense: Expense) => void` | Yes | Edit handler |
| onDelete | `(id: string) => void` | Yes | Delete handler |

**Category Colors:**
| Category | Color Classes |
|----------|---------------|
| Food | `bg-orange-100 text-orange-800` |
| Transport | `bg-blue-100 text-blue-800` |
| Entertainment | `bg-purple-100 text-purple-800` |
| Bills | `bg-red-100 text-red-800` |
| Shopping | `bg-pink-100 text-pink-800` |
| Healthcare | `bg-green-100 text-green-800` |
| Other | `bg-gray-100 text-gray-800` |

---

### CategorySelect

**Location:** `components/CategorySelect.tsx`

Dropdown for selecting expense categories with inline add functionality.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| categories | `string[]` | Yes | Available categories |
| value | `string` | Yes | Selected category |
| onChange | `(value: string) => void` | Yes | Selection handler |
| onAddCategory | `(category: string) => void` | Yes | Add handler |

**Features:**
- Dropdown select with all categories
- "+" button to toggle add input
- Inline input for new category name
- Trims whitespace before adding

---

### TotalSpending

**Location:** `components/TotalSpending.tsx`

Displays the total sum of all expenses with a count of tracked expenses.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| expenses | `Expense[]` | Yes | Array of expenses |

**Display:**
- Total amount formatted to 2 decimal places
- Expense count with proper pluralization

---

## Icon Components

All icons are located in `components/icons/` and share a common interface:

```typescript
interface IconProps {
  className?: string;
}
```

### EditIcon

**Location:** `components/icons/EditIcon.tsx`

Pencil icon for edit actions. Default size: `w-5 h-5`

### DeleteIcon

**Location:** `components/icons/DeleteIcon.tsx`

Trash icon for delete actions. Default size: `w-5 h-5`

### EmptyListIcon

**Location:** `components/icons/EmptyListIcon.tsx`

Clipboard icon for empty state. Default size: `w-16 h-16`

---

## Styling

All components use Tailwind CSS classes. Key patterns:

- **Cards:** `bg-white rounded-lg shadow-md`
- **Inputs:** `px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500`
- **Primary Button:** `bg-blue-500 text-white hover:bg-blue-600`
- **Secondary Button:** `bg-gray-300 text-gray-700 hover:bg-gray-400`
- **Danger Button:** `text-red-600 hover:bg-red-50`

## Best Practices

1. **Client Components:** All interactive components use `'use client'` directive
2. **Key-based Reset:** ExpenseForm uses key prop to reset state on edit mode change
3. **Accessible Actions:** Edit/delete buttons include `aria-label` attributes
4. **Responsive Layout:** Uses Tailwind's responsive grid (`lg:grid-cols-3`)
