# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture

This is an expense tracker built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS.

### Data Flow

The app uses a simple JSON file (`data/expenses.json`) for persistence. All data operations go through:
- `lib/storage.ts` - Read/write utilities for the JSON file
- `lib/types.ts` - TypeScript interfaces for Expense and ExpenseData

### API Routes

All routes are in `app/api/` and use the storage utilities:
- `GET/POST /api/expenses` - List all or create expense
- `GET/PUT/DELETE /api/expenses/[id]` - Single expense operations
- `GET/POST /api/categories` - List or add custom categories

### Client Components

The main page (`app/page.tsx`) is a client component that manages state and coordinates:
- `ExpenseForm` - Handles both create and edit modes
- `ExpenseList` - Displays expenses sorted by date
- `ExpenseItem` - Individual row with edit/delete actions
- `TotalSpending` - Calculates and displays sum of all expenses

Categories are predefined in `lib/types.ts` (DEFAULT_CATEGORIES) but users can add custom ones via the API.
