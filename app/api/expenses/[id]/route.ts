/**
 * Single expense API route handlers for CRUD operations by ID.
 * @module app/api/expenses/[id]/route
 */
import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

/** Route parameters containing the expense ID */
interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/expenses/:id - Returns a single expense by ID.
 * @param request - The incoming request
 * @param params - Route parameters containing the expense ID
 * @returns The expense if found, 404 otherwise
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const data = readData();
  const expense = data.expenses.find((e) => e.id === id);

  if (!expense) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  return NextResponse.json(expense);
}

/**
 * PUT /api/expenses/:id - Updates an existing expense.
 * @param request - The incoming request with updated fields
 * @param params - Route parameters containing the expense ID
 * @returns The updated expense if found, 404 otherwise
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, category, description, date } = body;

    const data = readData();
    const index = data.expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    data.expenses[index] = {
      ...data.expenses[index],
      amount: amount !== undefined ? Number(amount) : data.expenses[index].amount,
      category: category ?? data.expenses[index].category,
      description: description ?? data.expenses[index].description,
      date: date ?? data.expenses[index].date,
    };

    writeData(data);
    return NextResponse.json(data.expenses[index]);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/expenses/:id - Deletes an expense by ID.
 * @param request - The incoming request
 * @param params - Route parameters containing the expense ID
 * @returns Success response if deleted, 404 if not found
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const data = readData();
  const index = data.expenses.findIndex((e) => e.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  data.expenses.splice(index, 1);
  writeData(data);

  return NextResponse.json({ success: true });
}
