export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string
  createdAt: string;
}

export interface ExpenseData {
  expenses: Expense[];
  categories: string[];
}

export const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Bills',
  'Shopping',
  'Healthcare',
  'Other',
];
