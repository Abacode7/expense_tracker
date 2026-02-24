import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const data = readData();
  const expense = data.expenses.find((e) => e.id === id);

  if (!expense) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  return NextResponse.json(expense);
}

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
