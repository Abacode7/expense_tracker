import { NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/storage';
import { Expense } from '@/lib/types';

export async function GET() {
  const data = readData();
  return NextResponse.json(data.expenses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, category, description, date } = body;

    if (!amount || !category || !description || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = readData();
    const newExpense: Expense = {
      id: generateId(),
      amount: Number(amount),
      category,
      description,
      date,
      createdAt: new Date().toISOString(),
    };

    data.expenses.push(newExpense);
    writeData(data);

    return NextResponse.json(newExpense, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
