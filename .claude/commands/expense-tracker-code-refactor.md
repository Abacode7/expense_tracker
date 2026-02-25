---
description: Refactor TypeScript/React code for better quality
argument-hint: [file-path]
allowed-tools: Bash(npm:*), Read, Edit, Grep
---

# Refactor Code: $ARGUMENTS
Refactor the TypeScript/React file to improve code quality and readability.

If $ARGUMENTS is empty:
Refactor the entire codebase

## Steps

1. **Read the file(s)** using the Read tool
2. **Analyze the code** and identify issues:
   - Large components (over 100 lines)
   - Duplicate code across components
   - Complex nested conditionals
   - Missing TypeScript types
   - Poor variable/function names
   - Inline styles that should be Tailwind classes
   - Props drilling that could use context
   - Missing error handling

3. **Create improved version** with:
   - Smaller, focused components
   - Custom hooks for reusable logic
   - Proper TypeScript interfaces/types
   - Clear function and variable names
   - Extracted repeated code into utilities
   - Consistent Tailwind usage
   - Proper error boundaries where needed

4. **Run lint** to ensure code quality: `npm run lint`

5. **Show before/after comparison**

## Refactoring Checklist

- [ ] Components are small (under 100 lines)
- [ ] Each component has a single responsibility
- [ ] Good variable and function names
- [ ] TypeScript types/interfaces defined
- [ ] Props have proper type definitions
- [ ] No duplicate code
- [ ] Custom hooks for shared logic
- [ ] Lint passes
