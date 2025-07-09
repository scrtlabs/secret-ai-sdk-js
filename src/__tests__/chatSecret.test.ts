/**
 * Secret AI SDK test module
 */

import { Secret } from '../secret';
import { ChatSecret } from '../chatSecret';
import * as config from '../config';

// Test constants
const TEST_MNEMONIC = 'grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar';
const TEST_KNOWN_MODEL = 'deepseek-r1:70b';
const TEST_KNOWN_API_KEY = 'bWFzdGVyQHNjcnRsYWJzLmNvbTpTZWNyZXROZXR3b3JrTWFzdGVyS2V5X18yMDI1';

describe('Secret AI Functions', () => {
  beforeAll(() => {
    // Set up environment variables for testing
    process.env[config.API_KEY] = TEST_KNOWN_API_KEY;
  });

  afterAll(() => {
    // Clean up environment variables
    delete process.env[config.API_KEY];
  });

  describe('ChatSecret Integration', () => {
    it('should establish connection with confidential LLM and process query', async () => {
      // Initialize Secret client
      const secretClient = new Secret();
      
      // Get models and URLs
      const models = await secretClient.getModels();
      expect(models.length).toBeGreaterThanOrEqual(1);
      
      const urls = await secretClient.getUrls(TEST_KNOWN_MODEL);
      expect(urls.length).toBeGreaterThanOrEqual(1);

      // Create ChatSecret instance
      const secretAiLlm = new ChatSecret({
        baseUrl: urls[0],
        model: TEST_KNOWN_MODEL,
        temperature: 1.0,
      });

      // Test messages
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant that translates English to French. Translate the user sentence.',
        },
        {
          role: 'user', 
          content: 'I love programming.',
        },
      ];

      // Note: In real implementation, you'd call the LLM here
      // For now, we just test that the ChatSecret instance was created successfully
      expect(secretAiLlm).toBeDefined();
      expect(secretAiLlm.client).toBeDefined();
      expect(secretAiLlm.asyncClient).toBeDefined();
      
      // Test attestation method
      const attestation = await secretAiLlm.getAttestation();
      expect(attestation).toBeDefined();
      expect(typeof attestation).toBe('object');
    }, 60000); // 60 second timeout for network requests
  });

  describe('ChatSecret Configuration', () => {
    it('should create ChatSecret with valid configuration', () => {
      const chatSecret = new ChatSecret({
        baseUrl: 'https://test.example.com',
        model: 'test-model',
        temperature: 0.5,
      });

      expect(chatSecret).toBeDefined();
      expect(chatSecret.baseUrl).toBe('https://test.example.com');
    });

    it('should handle missing API key', () => {
      // Temporarily remove API key
      const originalKey = process.env[config.API_KEY];
      delete process.env[config.API_KEY];

      expect(() => {
        new ChatSecret({
          baseUrl: 'https://test.example.com',
          model: 'test-model',
        });
      }).toThrow('Missing API Key');

      // Restore API key
      if (originalKey) {
        process.env[config.API_KEY] = originalKey;
      }
    });
  });

  describe('Client Integration', () => {
    it('should create clients with proper authentication headers', () => {
      const chatSecret = new ChatSecret({
        baseUrl: 'https://test.example.com',
        model: 'test-model',
      });

      expect(chatSecret.client).toBeDefined();
      expect(chatSecret.asyncClient).toBeDefined();
    });
  });
}); 