/**
 * Category API route handlers for listing and adding categories.
 * @module app/api/categories/route
 */
import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

/**
 * GET /api/categories - Returns all categories.
 * @returns JSON array of all category names
 */
export async function GET() {
  const data = readData();
  return NextResponse.json(data.categories);
}

/**
 * POST /api/categories - Adds a new custom category.
 * @param request - The incoming request with category name
 * @returns The added category name
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category } = body;

    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const trimmedCategory = category.trim();
    if (trimmedCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category name cannot be empty' },
        { status: 400 }
      );
    }

    const data = readData();

    if (data.categories.includes(trimmedCategory)) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    data.categories.push(trimmedCategory);
    writeData(data);

    return NextResponse.json({ category: trimmedCategory }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to add category' },
      { status: 500 }
    );
  }
}
