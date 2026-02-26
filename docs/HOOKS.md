# Custom Hooks Documentation

This document provides detailed documentation for the custom React hooks used in the Expense Tracker application.

## Overview

The application uses two custom hooks to manage state and API interactions:

| Hook | Location | Purpose |
|------|----------|---------|
| `useExpenses` | `hooks/useExpenses.ts` | Expense CRUD operations |
| `useCategories` | `hooks/useCategories.ts` | Category state management |

---

## useExpenses

**Location:** `hooks/useExpenses.ts`

Custom hook for managing expense CRUD operations. Provides state management and API integration for expenses.

### Return Type

```typescript
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
```

### State

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| expenses | `Expense[]` | `[]` | Array of all expenses |
| loading | `boolean` | `true` | Loading state for fetch |
| error | `string` | `''` | Error message |

### Functions

#### fetchExpenses

```typescript
fetchExpenses: () => Promise<void>
```

Fetches all expenses from the API and updates state.

**API Call:** `GET /api/expenses`

**Side Effects:**
- Sets `expenses` state with fetched data
- Sets `error` if fetch fails
- Sets `loading` to `false` when complete

---

#### addExpense

```typescript
addExpense: (expense: ExpenseInput) => Promise<boolean>
```

Creates a new expense via the API.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| expense | `ExpenseInput` | Expense data without id/createdAt |

**API Call:** `POST /api/expenses`

**Returns:** `true` on success, `false` on failure

**Side Effects:**
- Appends new expense to `expenses` state
- Sets `error` if creation fails

---

#### updateExpense

```typescript
updateExpense: (id: string, expense: ExpenseInput) => Promise<boolean>
```

Updates an existing expense via the API.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | `string` | Expense ID to update |
| expense | `ExpenseInput` | Updated expense data |

**API Call:** `PUT /api/expenses/:id`

**Returns:** `true` on success, `false` on failure

**Side Effects:**
- Updates expense in `expenses` state
- Sets `error` if update fails

---

#### deleteExpense

```typescript
deleteExpense: (id: string) => Promise<boolean>
```

Deletes an expense via the API.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | `string` | Expense ID to delete |

**API Call:** `DELETE /api/expenses/:id`

**Returns:** `true` on success, `false` on failure

**Side Effects:**
- Removes expense from `expenses` state
- Sets `error` if deletion fails

---

#### clearError

```typescript
clearError: () => void
```

Clears the current error message.

### Usage Example

```typescript
import { useExpenses } from '@/hooks/useExpenses';

function MyComponent() {
  const {
    expenses,
    loading,
    error,
    clearError,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAdd = async () => {
    const success = await addExpense({
      amount: 25.50,
      category: 'Food',
      description: 'Lunch',
      date: '2024-01-15',
    });
    if (success) {
      console.log('Expense added!');
    }
  };

  return (/* ... */);
}
```

---

## useCategories

**Location:** `hooks/useCategories.ts`

Custom hook for managing category state and operations. Provides state management and API integration for categories.

### Return Type

```typescript
interface UseCategoriesReturn {
  categories: string[];
  error: string;
  clearError: () => void;
  fetchCategories: () => Promise<void>;
  addCategory: (category: string) => Promise<boolean>;
}
```

### State

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| categories | `string[]` | `[]` | Array of category names |
| error | `string` | `''` | Error message |

### Functions

#### fetchCategories

```typescript
fetchCategories: () => Promise<void>
```

Fetches all categories from the API and updates state.

**API Call:** `GET /api/categories`

**Side Effects:**
- Sets `categories` state with fetched data
- Sets `error` if fetch fails

---

#### addCategory

```typescript
addCategory: (category: string) => Promise<boolean>
```

Adds a new custom category via the API.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | `string` | Category name to add |

**API Call:** `POST /api/categories`

**Returns:** `true` on success, `false` on failure

**Side Effects:**
- Appends new category to `categories` state
- Sets `error` with API error message if creation fails

**Note:** The API validates:
- Category name is required
- Category name cannot be empty
- Category cannot already exist

---

#### clearError

```typescript
clearError: () => void
```

Clears the current error message.

### Usage Example

```typescript
import { useCategories } from '@/hooks/useCategories';

function MyComponent() {
  const {
    categories,
    error,
    clearError,
    fetchCategories,
    addCategory,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (name: string) => {
    const success = await addCategory(name);
    if (success) {
      console.log('Category added!');
    }
  };

  return (/* ... */);
}
```

---

## Types

### ExpenseInput

```typescript
type ExpenseInput = Omit<Expense, 'id' | 'createdAt'>;

// Equivalent to:
interface ExpenseInput {
  amount: number;
  category: string;
  description: string;
  date: string;
}
```

Used when creating or updating expenses (id and createdAt are server-generated).

---

## Design Patterns

### useCallback Memoization

All functions are wrapped in `useCallback` to maintain referential stability. This:
- Prevents unnecessary re-renders when passing functions as props
- Ensures stable dependencies in `useEffect` hooks
- Enables proper dependency tracking

### Optimistic vs Pessimistic Updates

The hooks use **pessimistic updates**:
- State is only updated after successful API response
- Ensures data consistency between client and server
- Returns boolean success indicator for caller to handle

### Error Handling

Each async operation:
1. Clears existing errors before making the request
2. Catches all errors from the fetch
3. Sets a user-friendly error message
4. Returns `false` to indicate failure

Callers can:
- Display the `error` state in UI
- Use the boolean return to trigger local UI changes
- Call `clearError` to dismiss error messages
