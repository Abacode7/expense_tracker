import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

// Reset all mocks after each test
afterEach(() => {
  vi.restoreAllMocks();
});
