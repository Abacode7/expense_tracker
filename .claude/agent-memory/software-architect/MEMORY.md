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

### Testing Strategy
- **Framework**: Vitest (faster, ESM-native, better TypeScript support for Next.js 16+)
- **Priority Areas**: API routes > storage layer > hooks > form validation > calculations
- **Mocking**: Use in-memory fs for storage tests, global fetch for hook tests
- **Test Location**: `__tests__/` directories parallel to source files
- See `testing-patterns.md` for detailed patterns

## File Organization
- `/app` - Next.js App Router pages and API routes
- `/components` - React client components
- `/lib` - Shared utilities and types
- `/hooks` - Custom React hooks
- `/data` - JSON persistence (gitignored after initial commit)
- `/__tests__/` - Test files (unit and integration)

## Dependencies
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Path aliases: `@/*` maps to project root
