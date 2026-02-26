# Architecture Overview

This document provides a comprehensive overview of the Expense Tracker application architecture.

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.1.6 |
| Runtime | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Testing | Vitest | 4.x |

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   page.tsx   │◄───│   Custom     │◄───│  Components  │  │
│  │   (Home)     │    │   Hooks      │    │              │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘  │
│         │                   │                               │
│         │      fetch()      │                               │
│         └───────────────────┘                               │
│                   │                                         │
└───────────────────┼─────────────────────────────────────────┘
                    │ HTTP
┌───────────────────┼─────────────────────────────────────────┐
│                   ▼                                         │
│              API Routes                                     │
│  ┌──────────────────┐    ┌──────────────────┐             │
│  │  /api/expenses   │    │  /api/categories │             │
│  └────────┬─────────┘    └────────┬─────────┘             │
│           │                       │                        │
│           └───────────┬───────────┘                        │
│                       ▼                                    │
│               ┌───────────────┐                           │
│               │   Storage     │                           │
│               │   (lib/)      │                           │
│               └───────┬───────┘                           │
│                       │                                    │
│                       ▼                                    │
│               ┌───────────────┐                           │
│               │ expenses.json │                           │
│               │   (data/)     │                           │
│               └───────────────┘                           │
│                                                            │
│                     Server                                 │
└────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
expense_tracker/
├── app/                      # Next.js App Router
│   ├── api/                  # API route handlers
│   │   ├── expenses/
│   │   │   ├── route.ts      # GET all, POST new
│   │   │   └── [id]/
│   │   │       └── route.ts  # GET, PUT, DELETE by id
│   │   └── categories/
│   │       └── route.ts      # GET all, POST new
│   ├── page.tsx              # Home page (client component)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global Tailwind styles
├── components/               # React components
│   ├── ExpenseForm.tsx       # Create/edit form
│   ├── ExpenseList.tsx       # Expense list display
│   ├── ExpenseItem.tsx       # Single expense row
│   ├── CategorySelect.tsx    # Category dropdown
│   ├── TotalSpending.tsx     # Total calculation
│   └── icons/                # SVG icon components
├── hooks/                    # Custom React hooks
│   ├── useExpenses.ts        # Expense CRUD hook
│   └── useCategories.ts      # Category hook
├── lib/                      # Utilities
│   ├── storage.ts            # File system operations
│   └── types.ts              # TypeScript interfaces
├── data/                     # Data persistence
│   └── expenses.json         # JSON data file
└── docs/                     # Documentation
    ├── API.md                # API documentation
    ├── COMPONENTS.md         # Component docs
    ├── HOOKS.md              # Hooks documentation
    └── ARCHITECTURE.md       # This file
```

## Data Flow

### Read Flow (GET)

```
User Action → Component → Hook (fetchExpenses)
    → fetch('/api/expenses') → API Route
    → storage.readData() → expenses.json
    → Response → Hook State Update → Component Re-render
```

### Write Flow (POST/PUT/DELETE)

```
User Action → Component → Hook (addExpense/updateExpense/deleteExpense)
    → fetch with method → API Route
    → storage.readData() → Modify → storage.writeData()
    → Response → Hook State Update → Component Re-render
```

## Key Patterns

### 1. Server-Client Separation

- **Server:** API routes handle all data operations
- **Client:** Components render UI and manage local state
- **Bridge:** Custom hooks abstract API calls

### 2. File-Based Persistence

The application uses a simple JSON file for data storage:

```typescript
// lib/storage.ts
const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

export function readData(): ExpenseData { /* ... */ }
export function writeData(data: ExpenseData): void { /* ... */ }
```

**Trade-offs:**
- ✅ Simple, no database setup required
- ✅ Easy to inspect and modify data
- ✅ Works out of the box
- ❌ Not suitable for production scale
- ❌ No concurrent write handling
- ❌ No query optimization

### 3. Custom Hooks for State Management

Instead of Redux/Context, the app uses focused custom hooks:

```typescript
// hooks/useExpenses.ts
export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // CRUD operations with API calls
  return { expenses, addExpense, updateExpense, deleteExpense };
}
```

**Benefits:**
- Collocated state and operations
- Easy to test
- No external dependencies
- Type-safe

### 4. Component Composition

UI is built from small, focused components:

```tsx
<Home>
  <TotalSpending />      // Read-only display
  <ExpenseForm />        // User input
    <CategorySelect />   // Nested select
  <ExpenseList />        // List container
    <ExpenseItem />      // List item
</Home>
```

## API Design

### RESTful Endpoints

| Method | Endpoint | Action |
|--------|----------|--------|
| GET | /api/expenses | List all |
| POST | /api/expenses | Create |
| GET | /api/expenses/:id | Get one |
| PUT | /api/expenses/:id | Update |
| DELETE | /api/expenses/:id | Delete |
| GET | /api/categories | List all |
| POST | /api/categories | Create |

### Request/Response Format

All endpoints use JSON:

```typescript
// Request body (POST/PUT)
{
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch",
  "date": "2024-01-15"
}

// Response body
{
  "id": "1708534800000-abc123",
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch",
  "date": "2024-01-15",
  "createdAt": "2024-01-15T12:00:00.000Z"
}

// Error response
{
  "error": "Error message"
}
```

## Type System

### Core Types

```typescript
// lib/types.ts
interface Expense {
  id: string;           // timestamp-random format
  amount: number;       // in dollars
  category: string;     // category name
  description: string;  // expense description
  date: string;         // ISO date (YYYY-MM-DD)
  createdAt: string;    // ISO timestamp
}

interface ExpenseData {
  expenses: Expense[];
  categories: string[];
}

const DEFAULT_CATEGORIES = [
  'Food', 'Transport', 'Entertainment',
  'Bills', 'Shopping', 'Healthcare', 'Other'
];
```

### ID Generation

```typescript
// lib/storage.ts
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
// Example: "1708534800000-abc1234"
```

## Testing Strategy

### Unit Tests

Located in `__tests__` directories alongside source files:

```
lib/__tests__/storage.test.ts
app/api/expenses/__tests__/route.test.ts
app/api/expenses/__tests__/[id].route.test.ts
```

### Test Framework

- **Vitest** for test runner
- **vi.spyOn** for mocking file system
- No test database needed (mocked storage)

### Test Coverage

| Area | Tests |
|------|-------|
| Storage functions | 10 tests |
| Expenses API (list/create) | 10 tests |
| Expenses API (CRUD by id) | 11 tests |

## Scalability Considerations

For production use, consider:

1. **Database:** Replace JSON file with PostgreSQL/MongoDB
2. **Authentication:** Add user sessions/JWT
3. **Caching:** Redis for frequent reads
4. **Validation:** Zod/Yup for schema validation
5. **Error Handling:** Centralized error boundary
6. **Monitoring:** Add logging and metrics

## Security Notes

- Input validation on API routes
- No SQL injection risk (file-based storage)
- CORS handled by Next.js defaults
- No authentication (demo app)

## Performance

- Client-side state caching (hooks)
- Minimal re-renders via useCallback
- Efficient sorting only on render
- Small bundle (no heavy dependencies)
