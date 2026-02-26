# Testing Patterns for Expense Tracker

## Test Framework Choice: Vitest

**Selected**: Vitest over Jest
**Rationale**:
- Native ESM support (Next.js 16+ uses ESM by default)
- 5-10x faster than Jest for this project size
- Drop-in Jest compatibility (same API: describe, test, expect)
- Better TypeScript integration out of the box
- Vite's hot module replacement for test files
- Active maintenance and Next.js community adoption

## Mocking Strategies

### File System (fs) Mocking
**Pattern**: Use `vitest.mock('fs')` with in-memory data
```typescript
import { vi } from 'vitest';
import fs from 'fs';

vi.mock('fs');
const mockFs = fs as unknown as MockedFs;

// Setup mock data per test
mockFs.existsSync.mockReturnValue(true);
mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData));
```

### Fetch Mocking for Hooks
**Pattern**: Mock global fetch with `vi.stubGlobal`
```typescript
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Setup response
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => mockExpenses,
});
```

### Next.js Response Mocking
**Pattern**: Create helper for NextResponse.json mocking
```typescript
vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: async () => data,
      status: init?.status || 200,
      ok: (init?.status || 200) < 400,
    }),
  },
}));
```

## Test Structure Patterns

### API Route Tests
**Location**: `app/api/__tests__/`
**Pattern**: Test each HTTP method with success/error scenarios
```typescript
describe('GET /api/expenses', () => {
  test('returns all expenses', async () => {
    // Arrange: Mock storage
    // Act: Call route handler
    // Assert: Verify response data and status
  });
});
```

### Hook Tests
**Location**: `hooks/__tests__/`
**Pattern**: Use `renderHook` from @testing-library/react
```typescript
import { renderHook, act } from '@testing-library/react';

test('fetches expenses on mount', async () => {
  const { result } = renderHook(() => useExpenses());
  await act(async () => {
    await result.current.fetchExpenses();
  });
  expect(result.current.expenses).toHaveLength(2);
});
```

### Component Tests
**Location**: `components/__tests__/`
**Pattern**: Use `render` from @testing-library/react, test behavior not implementation
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('shows validation error for empty fields', () => {
  render(<ExpenseForm {...props} />);
  fireEvent.click(screen.getByText('Add Expense'));
  expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
});
```

## Critical Test Cases

### Storage Layer (`lib/storage.ts`)
- readData: file exists, file missing, corrupted JSON
- writeData: creates directory, writes valid JSON
- generateId: unique IDs, format validation

### API Routes
- GET /api/expenses: returns array, handles empty state
- POST /api/expenses: creates expense, validates fields, returns 400 on missing data
- PUT /api/expenses/[id]: updates expense, returns 404 for missing ID
- DELETE /api/expenses/[id]: removes expense, returns 404 for missing ID

### Hooks (`useExpenses`, `useCategories`)
- fetchExpenses: updates state, handles errors, sets loading
- addExpense: optimistic updates, error rollback
- updateExpense: modifies correct item, handles errors
- deleteExpense: removes item, handles errors

### Form Validation (`ExpenseForm`)
- Empty field validation
- Amount validation (positive, numeric)
- Edit mode initialization
- Form reset after submission
- Cancel edit behavior

### Calculations (`TotalSpending`)
- Sum calculation accuracy
- Empty array handling
- Plural/singular text

## Test Execution Order

1. **Foundation**: Storage layer and types
2. **API Layer**: Route handlers (depend on storage)
3. **Client Layer**: Hooks (depend on API routes)
4. **UI Layer**: Components (depend on hooks)
5. **Integration**: End-to-end user flows

## Snapshot Testing Policy

**Avoid snapshots** for this project:
- UI is simple and changes frequently
- Snapshots add maintenance burden
- Prefer explicit assertions for behavior
- Exception: Use snapshots only for complex error messages or JSON structures

## Performance Testing Notes

- Skip performance tests initially
- Monitor if storage operations become slow (>100ms)
- Consider benchmarking ID generation if collision concerns arise
