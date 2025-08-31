import { jest } from '@jest/globals';

// Mock fetch globally
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({
      count: 758,
      results: [
        {
          rank: 1,
          id: 0,
          name: 'Algorand',
          ticker: 'ALGO',
          price: 0.236,
          price1h: 0.237,
          price1d: 0.231,
          market_cap: 2060334722,
          image: 'https://asa-list.tinyman.org/assets/0/icon.png'
        },
        {
          rank: 8,
          id: 2200000000,
          name: 'TINY',
          ticker: 'TINY',
          price: 0.01188,
          price1h: 0.01193,
          price1d: 0.01136,
          market_cap: 11862830,
          image: 'https://example.com/tiny.png'
        }
      ]
    })
  })
) as jest.MockedFunction<typeof fetch>;

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, options?: { status?: number; headers?: Record<string, string> }) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
      headers: options?.headers || {},
    })),
  },
}));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});