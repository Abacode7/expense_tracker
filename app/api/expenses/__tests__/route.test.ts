import { describe, test, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import * as storage from '@/lib/storage';
import { DEFAULT_CATEGORIES } from '@/lib/types';

vi.mock('@/lib/storage');

const mockStorage = vi.mocked(storage);

const mockExpense = {
  id: '123-abc',
  amount: 50,
  category: 'Food',
  description: 'Lunch',
  date: '2024-01-15',
  createdAt: '2024-01-15T12:00:00.000Z',
};

describe('GET /api/expenses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns all expenses', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [mockExpense],
      categories: DEFAULT_CATEGORIES,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([mockExpense]);
  });

  test('returns empty array when no expenses', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [],
      categories: DEFAULT_CATEGORIES,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });
});

describe('POST /api/expenses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.readData.mockReturnValue({
      expenses: [],
      categories: DEFAULT_CATEGORIES,
    });
    mockStorage.generateId.mockReturnValue('new-id-123');
    mockStorage.writeData.mockImplementation(() => {});
  });

  test('creates expense with generated ID', async () => {
    const requestBody = {
      amount: 100,
      category: 'Transport',
      description: 'Uber ride',
      date: '2024-02-01',
    };

    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe('new-id-123');
    expect(data.amount).toBe(100);
    expect(data.category).toBe('Transport');
    expect(data.description).toBe('Uber ride');
    expect(data.date).toBe('2024-02-01');
    expect(data.createdAt).toBeDefined();
  });

  test('converts amount to number', async () => {
    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({
        amount: '75.50',
        category: 'Food',
        description: 'Dinner',
        date: '2024-02-01',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.amount).toBe(75.5);
    expect(typeof data.amount).toBe('number');
  });

  test('calls writeData with updated expenses', async () => {
    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        category: 'Bills',
        description: 'Electric',
        date: '2024-02-01',
      }),
    });

    await POST(request);

    expect(mockStorage.writeData).toHaveBeenCalledWith(
      expect.objectContaining({
        expenses: expect.arrayContaining([
          expect.objectContaining({
            id: 'new-id-123',
            amount: 50,
            category: 'Bills',
          }),
        ]),
      })
    );
  });

  test('returns 400 when amount is missing', async () => {
    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Food',
        description: 'Lunch',
        date: '2024-02-01',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  test('returns 400 when category is missing', async () => {
    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        description: 'Lunch',
        date: '2024-02-01',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  test('returns 400 when description is missing', async () => {
    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        category: 'Food',
        date: '2024-02-01',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  test('returns 400 when date is missing', async () => {
    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({
        amount: 50,
        category: 'Food',
        description: 'Lunch',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  test('returns 500 on invalid JSON', async () => {
    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to create expense');
  });
});
