// Test setup file for Jest
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set test timeout
(global as any).jest?.setTimeout(30000);

// Mock console methods in tests if needed
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

(global as any).beforeEach(() => {
  // You can mock console methods here if needed for cleaner test output
  // console.error = jest.fn();
  // console.warn = jest.fn();
});

(global as any).afterEach(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}); 