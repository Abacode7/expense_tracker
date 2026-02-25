/**
 * Storage utilities for reading and writing expense data to a JSON file.
 * @module lib/storage
 */
import fs from 'fs';
import path from 'path';
import { ExpenseData, DEFAULT_CATEGORIES } from './types';

/** Path to the JSON data file */
const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

/** Default data structure when no file exists */
const defaultData: ExpenseData = {
  expenses: [],
  categories: [...DEFAULT_CATEGORIES],
};

/**
 * Reads expense data from the JSON file.
 * Creates the file with default data if it doesn't exist.
 * @returns The expense data from storage
 */
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

/**
 * Writes expense data to the JSON file.
 * Creates the data directory if it doesn't exist.
 * @param data - The expense data to persist
 */
export function writeData(data: ExpenseData): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/**
 * Generates a unique ID for new expenses.
 * Format: timestamp-randomstring (e.g., "1708534800000-abc1234")
 * @returns A unique identifier string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
