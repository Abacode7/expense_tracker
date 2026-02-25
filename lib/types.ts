/** Represents a single expense entry */
export interface Expense {
  /** Unique identifier (timestamp + random string) */
  id: string;
  /** Expense amount in dollars */
  amount: number;
  /** Category name */
  category: string;
  /** Description of the expense */
  description: string;
  /** Date of expense in ISO format (YYYY-MM-DD) */
  date: string;
  /** Creation timestamp in ISO format */
  createdAt: string;
}

/** Data structure stored in the JSON persistence file */
export interface ExpenseData {
  /** Array of all expenses */
  expenses: Expense[];
  /** Array of category names (default + custom) */
  categories: string[];
}

/** Default expense categories available to all users */
export const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Bills',
  'Shopping',
  'Healthcare',
  'Other',
];
