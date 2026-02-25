---
description: Generate and maintain documentation for the expense tracker
argument-hint: [--api | --readme | --check | --help]
allowed-tools: Bash(ls:*), Bash(cat:*), Bash(test:*), Bash(grep:*), Bash(find:*)
---

Generate and maintain documentation for this Next.js expense tracker application, keeping it in sync with implementation.

## Usage Examples

**Basic documentation generation:**
```
/expense-tracker-docs
```

**Generate API documentation:**
```
/expense-tracker-docs --api
```

**Check documentation coverage:**
```
/expense-tracker-docs --check
```

**Generate README:**
```
/expense-tracker-docs --readme
```

**Help and options:**
```
/expense-tracker-docs --help
```

## Implementation

If $ARGUMENTS contains "help" or "--help":
Display this usage information and exit.

Parse documentation options from $ARGUMENTS (--api, --readme, --check, or specific module/file).


## 1. Analyze Current Documentation

Check existing documentation:
```bash
find . -name "*.md" -not -path "./node_modules/*" | head -20
test -f README.md && echo "README exists" || echo "No README.md found"
```

Count JSDoc comments in TypeScript files:
```bash
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs grep -l '/\*\*' 2>/dev/null | wc -l
```

## 2. API Documentation (--api flag)

Analyze Next.js API routes in `app/api/`:
```bash
find ./app/api -name "route.ts" 2>/dev/null
```

Extract exported HTTP methods (GET, POST, PUT, DELETE):
```bash
grep -rE "export async function (GET|POST|PUT|DELETE|PATCH)" ./app/api --include="route.ts" 2>/dev/null
```

For each route file found, determine the API path from its directory structure:
- `app/api/expenses/route.ts` → `/api/expenses`
- `app/api/expenses/[id]/route.ts` → `/api/expenses/:id`
- `app/api/categories/route.ts` → `/api/categories`


## 3. Generate README (--readme flag)

Extract project info from package.json:
```bash
cat package.json | grep -E '"name"|"description"|"version"' | head -5
```

List available npm scripts:
```bash
cat package.json | grep -A 10 '"scripts"'
```

Generate README.md with:
```markdown
# Expense Tracker

A simple expense tracking application built with Next.js 14+, TypeScript, and Tailwind CSS.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev     # Start development server at http://localhost:3000
npm run build   # Build for production
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

## Project Structure

```
app/
├── api/              # API routes
│   ├── expenses/     # Expense CRUD operations
│   └── categories/   # Category management
├── page.tsx          # Main page (client component)
components/           # React components
├── ExpenseForm.tsx   # Create/edit expense form
├── ExpenseList.tsx   # Expense list display
├── ExpenseItem.tsx   # Single expense row
└── TotalSpending.tsx # Total calculation
lib/
├── storage.ts        # JSON file read/write utilities
└── types.ts          # TypeScript interfaces
data/
└── expenses.json     # Data persistence file
```

## Data Model

### Expense
- `id`: string - Unique identifier
- `amount`: number - Expense amount
- `category`: string - Expense category
- `description`: string - Expense description
- `date`: string - ISO date string
- `createdAt`: string - Creation timestamp
```


## 4. Check Documentation Coverage (--check flag)

Find all TypeScript functions and components:
```bash
grep -rE "^export (async )?function |^export const .* = |^function " --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules
```

Find functions with JSDoc comments (/** */):
```bash
grep -B1 -rE "^export (async )?function |^export const .* = " --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules | grep '/\*\*' | wc -l
```

Check components for documentation:
```bash
find ./components -name "*.tsx" 2>/dev/null | while read f; do
  name=$(basename "$f" .tsx)
  has_jsdoc=$(grep -c '/\*\*' "$f" 2>/dev/null || echo 0)
  echo "$f: $has_jsdoc JSDoc blocks"
done
```

Check lib files:
```bash
find ./lib -name "*.ts" 2>/dev/null | while read f; do
  funcs=$(grep -cE "^export (async )?function " "$f" 2>/dev/null || echo 0)
  jsdocs=$(grep -c '/\*\*' "$f" 2>/dev/null || echo 0)
  echo "$f: $funcs functions, $jsdocs JSDoc blocks"
done
```

Generate coverage report:
```
DOCUMENTATION COVERAGE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Coverage: X%

DOCUMENTED (X/Y)
─────────────────
✓ lib/storage.ts: X/Y functions
✓ components/ExpenseForm.tsx: has JSDoc

MISSING DOCUMENTATION
─────────────────────
✗ components/ExpenseItem.tsx: ExpenseItem (no JSDoc)
✗ components/TotalSpending.tsx: TotalSpending (no JSDoc)
✗ lib/types.ts: Expense interface (no JSDoc)

QUICK FIXES
────────────
1. Add JSDoc to component functions
2. Document TypeScript interfaces in lib/types.ts
3. Add inline comments to API route handlers
```


## Output Templates

For API documentation (--api):
```markdown
# API Documentation

## Endpoints

### GET /api/expenses
Returns all expenses.

**Response:** `200 OK` with array of Expense objects
```json
[
  {
    "id": "abc123",
    "amount": 50.00,
    "category": "Food",
    "description": "Lunch",
    "date": "2024-01-15",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
]
```

### POST /api/expenses
Creates a new expense.

**Request Body:**
```json
{
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch",
  "date": "2024-01-15"
}
```

**Response:** `201 Created` with created Expense object

### GET /api/expenses/:id
Returns a single expense by ID.

**Response:** `200 OK` with Expense object or `404 Not Found`

### PUT /api/expenses/:id
Updates an existing expense.

**Request Body:** (all fields optional)
```json
{
  "amount": 75.00,
  "category": "Entertainment",
  "description": "Updated description",
  "date": "2024-01-16"
}
```

**Response:** `200 OK` with updated Expense or `404 Not Found`

### DELETE /api/expenses/:id
Deletes an expense.

**Response:** `200 OK` with `{ "success": true }` or `404 Not Found`

### GET /api/categories
Returns all categories (default + custom).

**Response:** `200 OK` with array of category strings

### POST /api/categories
Adds a custom category.

**Request Body:**
```json
{
  "category": "Custom Category"
}
```

**Response:** `201 Created` with updated categories array
```


Think step by step about documentation needs and:

1. Identify what documentation is missing
2. Generate appropriate documentation based on code analysis
3. Create templates for missing documentation
4. Ensure examples are included where helpful

When generating documentation:
- Use JSDoc format for TypeScript: `/** Description */`
- Document all exported functions and interfaces
- Include parameter types and return types
- Provide usage examples where helpful
