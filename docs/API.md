# API Documentation

This document provides detailed information about the Expense Tracker REST API endpoints.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### Expenses

#### GET /api/expenses

Returns all expenses.

**Response:** `200 OK`

```json
[
  {
    "id": "1708534800000-abc123",
    "amount": 50.00,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2024-01-15",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
]
```

---

#### POST /api/expenses

Creates a new expense.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| amount | number | Yes | Expense amount |
| category | string | Yes | Expense category |
| description | string | Yes | Description of expense |
| date | string | Yes | Date in YYYY-MM-DD format |

```json
{
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

**Response:** `201 Created`

```json
{
  "id": "1708534800000-abc123",
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "createdAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Missing required fields
- `500 Internal Server Error` - Failed to create expense

---

#### GET /api/expenses/:id

Returns a single expense by ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Expense ID |

**Response:** `200 OK`

```json
{
  "id": "1708534800000-abc123",
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "createdAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Responses:**

- `404 Not Found` - Expense not found

---

#### PUT /api/expenses/:id

Updates an existing expense. All fields are optional; only provided fields will be updated.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Expense ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| amount | number | No | Updated amount |
| category | string | No | Updated category |
| description | string | No | Updated description |
| date | string | No | Updated date (YYYY-MM-DD) |

```json
{
  "amount": 75.00,
  "description": "Updated description"
}
```

**Response:** `200 OK`

```json
{
  "id": "1708534800000-abc123",
  "amount": 75.00,
  "category": "Food",
  "description": "Updated description",
  "date": "2024-01-15",
  "createdAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Responses:**

- `404 Not Found` - Expense not found
- `500 Internal Server Error` - Failed to update expense

---

#### DELETE /api/expenses/:id

Deletes an expense.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Expense ID |

**Response:** `200 OK`

```json
{
  "success": true
}
```

**Error Responses:**

- `404 Not Found` - Expense not found

---

### Categories

#### GET /api/categories

Returns all categories (default + custom).

**Response:** `200 OK`

```json
[
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Healthcare",
  "Other",
  "Custom Category"
]
```

---

#### POST /api/categories

Adds a custom category.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | string | Yes | Category name |

```json
{
  "category": "Travel"
}
```

**Response:** `201 Created`

```json
{
  "category": "Travel"
}
```

**Error Responses:**

- `400 Bad Request` - Category name is required, empty, or already exists
- `500 Internal Server Error` - Failed to add category

---

## Data Types

### Expense

```typescript
interface Expense {
  id: string;          // Unique identifier (timestamp + random string)
  amount: number;      // Expense amount
  category: string;    // Category name
  description: string; // Description of expense
  date: string;        // ISO date (YYYY-MM-DD)
  createdAt: string;   // ISO timestamp
}
```

### Default Categories

The following categories are available by default:

- Food
- Transport
- Entertainment
- Bills
- Shopping
- Healthcare
- Other

## Error Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Usage Examples

### cURL

**Create an expense:**

```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 25.50, "category": "Food", "description": "Coffee", "date": "2024-01-15"}'
```

**Get all expenses:**

```bash
curl http://localhost:3000/api/expenses
```

**Update an expense:**

```bash
curl -X PUT http://localhost:3000/api/expenses/1708534800000-abc123 \
  -H "Content-Type: application/json" \
  -d '{"amount": 30.00}'
```

**Delete an expense:**

```bash
curl -X DELETE http://localhost:3000/api/expenses/1708534800000-abc123
```

**Add a custom category:**

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"category": "Travel"}'
```

### JavaScript/Fetch

```javascript
// Create expense
const response = await fetch('/api/expenses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 25.50,
    category: 'Food',
    description: 'Coffee',
    date: '2024-01-15'
  })
});
const expense = await response.json();

// Get all expenses
const expenses = await fetch('/api/expenses').then(r => r.json());

// Update expense
await fetch(`/api/expenses/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 30.00 })
});

// Delete expense
await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
```
