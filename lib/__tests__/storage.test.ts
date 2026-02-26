import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { readData, writeData, generateId } from '../storage';
import { DEFAULT_CATEGORIES } from '../types';

const defaultData = {
  expenses: [],
  categories: [...DEFAULT_CATEGORIES],
};

describe('readData', () => {
  let existsSyncSpy: ReturnType<typeof vi.spyOn>;
  let readFileSyncSpy: ReturnType<typeof vi.spyOn>;
  let writeFileSyncSpy: ReturnType<typeof vi.spyOn>;
  let mkdirSyncSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    mkdirSyncSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns data when file exists', () => {
    const mockData = {
      expenses: [{ id: '1', amount: 50, category: 'Food', description: 'Lunch', date: '2024-01-01', createdAt: '2024-01-01' }],
      categories: ['Food', 'Transport'],
    };
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(JSON.stringify(mockData));

    const result = readData();

    expect(result).toEqual(mockData);
    expect(existsSyncSpy).toHaveBeenCalled();
    expect(readFileSyncSpy).toHaveBeenCalled();
  });

  test('creates file with default data when file does not exist', () => {
    existsSyncSpy.mockReturnValueOnce(false).mockReturnValue(true);

    const result = readData();

    expect(result).toEqual(defaultData);
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  test('returns default data on JSON parse error', () => {
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue('invalid json {{{');

    const result = readData();

    expect(result).toEqual(defaultData);
  });

  test('returns default data on file read error', () => {
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockImplementation(() => {
      throw new Error('Read error');
    });

    const result = readData();

    expect(result).toEqual(defaultData);
  });
});

describe('writeData', () => {
  let existsSyncSpy: ReturnType<typeof vi.spyOn>;
  let writeFileSyncSpy: ReturnType<typeof vi.spyOn>;
  let mkdirSyncSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    mkdirSyncSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('writes data to file', () => {
    existsSyncSpy.mockReturnValue(true);

    const data = {
      expenses: [{ id: '1', amount: 100, category: 'Bills', description: 'Electric', date: '2024-02-01', createdAt: '2024-02-01' }],
      categories: ['Bills'],
    };

    writeData(data);

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expect.stringContaining('expenses.json'),
      JSON.stringify(data, null, 2)
    );
  });

  test('creates directory if it does not exist', () => {
    existsSyncSpy.mockReturnValue(false);

    writeData(defaultData);

    expect(mkdirSyncSpy).toHaveBeenCalledWith(
      expect.any(String),
      { recursive: true }
    );
  });

  test('does not create directory if it exists', () => {
    existsSyncSpy.mockReturnValue(true);

    writeData(defaultData);

    expect(mkdirSyncSpy).not.toHaveBeenCalled();
  });
});

describe('generateId', () => {
  test('returns string in expected format (timestamp-random)', () => {
    const id = generateId();

    expect(typeof id).toBe('string');
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);
  });

  test('generates unique IDs across multiple calls', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }

    expect(ids.size).toBe(100);
  });

  test('timestamp portion is a valid number', () => {
    const id = generateId();
    const timestamp = parseInt(id.split('-')[0], 10);

    expect(timestamp).toBeGreaterThan(0);
    expect(timestamp).toBeLessThanOrEqual(Date.now());
  });
});
