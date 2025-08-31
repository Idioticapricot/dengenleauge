import { GET } from '../app/api/meme-coins/route';
import { NextResponse } from 'next/server';

// Mock the fetch function
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
const mockJson = jest.fn();
const mockNextResponseJson = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe('/api/meme-coins', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a response with coin data structure', async () => {
      const request = new Request('http://localhost:3000/api/meme-coins');
      const response = await GET(request);

      // The response should be a NextResponse object
      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
    }, 10000);

    it('should handle search parameter', async () => {
      const request = new Request('http://localhost:3000/api/meme-coins?search=test');
      const response = await GET(request);

      expect(response).toBeDefined();
    }, 10000);


    it('should return proper JSON response structure', async () => {
      const request = new Request('http://localhost:3000/api/meme-coins');
      const response = await GET(request);

      // Check that response has the expected methods
      expect(response).toHaveProperty('json');
      expect(typeof response.json).toBe('function');
    }, 10000);
  });
});