# Expense Tracker Architecture Memory

## Project Overview
Next.js 14+ expense tracker with App Router, TypeScript, and Tailwind CSS. Uses JSON file persistence.

## Key Architectural Patterns

### Data Flow
- JSON file at `data/expenses.json` is single source of truth
- `lib/storage.ts` provides fs-based read/write utilities
- API routes (`app/api/`) coordinate storage operations
- Client components fetch from APIs, never direct file access

### Component Hierarchy
```
page.tsx (orchestrator)
├── ExpenseForm (create/edit with validation)
│   └── CategorySelect (custom category management)
├── TotalSpending (calculation component)
└── ExpenseList (sorting + rendering)
    └── ExpenseItem (formatting + actions)
```

### State Management
- Client components use local state (useState)
- ExpenseForm uses key-based remounting for edit mode reset
- No global state library (Context, Redux, etc.)

### Validation Patterns
- ExpenseForm validates: empty fields, amount > 0, valid number
- API routes validate required fields server-side
- Form shows error messages in red banner

### Formatting Standards
- Dates: ISO format (YYYY-MM-DD) stored, formatted with `toLocaleDateString('en-US')`
- Amounts: Stored as numbers, displayed with `.toFixed(2)`
- IDs: Generated as `${Date.now()}-${randomString}`

### Testing Considerations
- Components are 'use client' - need React testing environment
- API routes use Node.js fs module - need mocking or temp directories
- No existing test infrastructure
- ExpenseForm has complex logic: validation, edit mode, form reset

## File Organization
- `/app` - Next.js App Router pages and API routes
- `/components` - React client components
- `/lib` - Shared utilities and types
- `/data` - JSON persistence (gitignored after initial commit)

## Dependencies
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- No test libraries installed yet
