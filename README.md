# Expense Tracker

A simple expense tracking application built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

- Add, edit, and delete expenses
- Categorize expenses with default and custom categories
- View total spending across all expenses
- Expenses sorted by date (most recent first)
- Persistent storage using JSON file

## Installation

```bash
npm install
```

## Development

```bash
npm run dev     # Start development server at http://localhost:3000
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## API Reference

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | List all expenses |
| POST | /api/expenses | Create a new expense |
| GET | /api/expenses/:id | Get a single expense |
| PUT | /api/expenses/:id | Update an expense |
| DELETE | /api/expenses/:id | Delete an expense |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | List all categories |
| POST | /api/categories | Add a custom category |

See [docs/API.md](docs/API.md) for detailed API documentation.

## Project Structure

```
app/
├── api/                  # API routes
│   ├── expenses/         # Expense CRUD operations
│   │   ├── route.ts      # GET all, POST new
│   │   └── [id]/
│   │       └── route.ts  # GET, PUT, DELETE by id
│   └── categories/
│       └── route.ts      # GET all, POST new
├── page.tsx              # Main page (client component)
├── layout.tsx            # Root layout
└── globals.css           # Global styles
components/
├── ExpenseForm.tsx       # Create/edit expense form
├── ExpenseList.tsx       # Expense list display
├── ExpenseItem.tsx       # Single expense row
├── CategorySelect.tsx    # Category dropdown with add new
├── TotalSpending.tsx     # Total calculation display
└── icons/                # Reusable SVG icon components
    ├── EditIcon.tsx
    ├── DeleteIcon.tsx
    ├── EmptyListIcon.tsx
    └── index.ts
hooks/
├── useExpenses.ts        # Expense CRUD state management
└── useCategories.ts      # Category state management
lib/
├── storage.ts            # JSON file read/write utilities
└── types.ts              # TypeScript interfaces
data/
└── expenses.json         # Data persistence file
```

## Data Model

### Expense

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (timestamp + random string) |
| amount | number | Expense amount in dollars |
| category | string | Expense category |
| description | string | Description of the expense |
| date | string | Date of expense (ISO format YYYY-MM-DD) |
| createdAt | string | Creation timestamp (ISO format) |

### Default Categories

- Food
- Transport
- Entertainment
- Bills
- Shopping
- Healthcare
- Other

Custom categories can be added via the UI or API.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Runtime:** React 19.2.3

## License

MIT
