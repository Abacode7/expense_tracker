import fs from 'fs';
import path from 'path';
import { ExpenseData, DEFAULT_CATEGORIES } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

const defaultData: ExpenseData = {
  expenses: [],
  categories: [...DEFAULT_CATEGORIES],
};

export function readData(): ExpenseData {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeData(defaultData);
      return defaultData;
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultData;
  }
}

export function writeData(data: ExpenseData): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
