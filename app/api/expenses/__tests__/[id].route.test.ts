import { describe, test, expect, vi, beforeEach } from 'vitest';
import { GET, PUT, DELETE } from '../[id]/route';
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

const createRouteParams = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe('GET /api/expenses/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns expense by ID', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [mockExpense],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/123-abc');
    const response = await GET(request, createRouteParams('123-abc'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockExpense);
  });

  test('returns 404 for non-existent ID', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [mockExpense],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/not-found');
    const response = await GET(request, createRouteParams('not-found'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Expense not found');
  });
});

describe('PUT /api/expenses/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.writeData.mockImplementation(() => {});
  });

  test('updates expense fields', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [{ ...mockExpense }],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/123-abc', {
      method: 'PUT',
      body: JSON.stringify({
        amount: 75,
        description: 'Updated lunch',
      }),
    });

    const response = await PUT(request, createRouteParams('123-abc'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.amount).toBe(75);
    expect(data.description).toBe('Updated lunch');
    expect(data.category).toBe('Food'); // unchanged
    expect(data.id).toBe('123-abc'); // preserved
  });

  test('preserves createdAt on update', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [{ ...mockExpense }],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/123-abc', {
      method: 'PUT',
      body: JSON.stringify({ amount: 100 }),
    });

    const response = await PUT(request, createRouteParams('123-abc'));
    const data = await response.json();

    expect(data.createdAt).toBe(mockExpense.createdAt);
  });

  test('converts amount to number on update', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [{ ...mockExpense }],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/123-abc', {
      method: 'PUT',
      body: JSON.stringify({ amount: '99.99' }),
    });

    const response = await PUT(request, createRouteParams('123-abc'));
    const data = await response.json();

    expect(data.amount).toBe(99.99);
    expect(typeof data.amount).toBe('number');
  });

  test('returns 404 for non-existent ID', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [mockExpense],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/not-found', {
      method: 'PUT',
      body: JSON.stringify({ amount: 100 }),
    });

    const response = await PUT(request, createRouteParams('not-found'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Expense not found');
  });

  test('returns 500 on invalid JSON', async () => {
    const request = new Request('http://localhost/api/expenses/123-abc', {
      method: 'PUT',
      body: 'invalid json',
    });

    const response = await PUT(request, createRouteParams('123-abc'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to update expense');
  });

  test('calls writeData with updated data', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [{ ...mockExpense }],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/123-abc', {
      method: 'PUT',
      body: JSON.stringify({ amount: 200 }),
    });

    await PUT(request, createRouteParams('123-abc'));

    expect(mockStorage.writeData).toHaveBeenCalledWith(
      expect.objectContaining({
        expenses: expect.arrayContaining([
          expect.objectContaining({ id: '123-abc', amount: 200 }),
        ]),
      })
    );
  });
});

describe('DELETE /api/expenses/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.writeData.mockImplementation(() => {});
  });

  test('deletes expense by ID', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [mockExpense],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/123-abc', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createRouteParams('123-abc'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  test('removes expense from storage', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [mockExpense, { ...mockExpense, id: 'other-id' }],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/123-abc', {
      method: 'DELETE',
    });

    await DELETE(request, createRouteParams('123-abc'));

    expect(mockStorage.writeData).toHaveBeenCalledWith(
      expect.objectContaining({
        expenses: [expect.objectContaining({ id: 'other-id' })],
      })
    );
  });

  test('returns 404 for non-existent ID', async () => {
    mockStorage.readData.mockReturnValue({
      expenses: [mockExpense],
      categories: DEFAULT_CATEGORIES,
    });

    const request = new Request('http://localhost/api/expenses/not-found', {
      method: 'DELETE',
    });

    const response = await DELETE(request, createRouteParams('not-found'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Expense not found');
  });
});
