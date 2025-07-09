/**
 * Secret test module
 */

import { Secret } from '../secret';

// Test constants
const TEST_MNEMONIC = 'grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar';
const TEST_PK = 'f0a7b67eb9a719d54f8a9bfbfb187d8c296b97911a05bf5ca30494823e46beb6';
const TEST_KNOWN_MODEL = 'deepseek-r1:70b';
const TEST_KNOWN_URL = 'https://secretai-rytn.scrtlabs.com:21434';

describe('Secret Functions', () => {
  let secretClient: Secret;

  beforeEach(() => {
    secretClient = new Secret();
  });

  describe('getPrivKeyFromMnemonic', () => {
    it('should generate private key from mnemonic', () => {
      const pkHex = secretClient.getPrivKeyFromMnemonic(TEST_MNEMONIC);
      expect(pkHex).toBe(TEST_PK);
    });

    it('should throw error for invalid mnemonic', () => {
      expect(() => {
        secretClient.getPrivKeyFromMnemonic('invalid mnemonic');
      }).toThrow('Invalid mnemonic provided');
    });
  });

  describe('getModels', () => {
    it('should successfully obtain a list of known confidential LLM models', async () => {
      const models = await secretClient.getModels();
      expect(models.length).toBeGreaterThanOrEqual(1);
      expect(models).toContain(TEST_KNOWN_MODEL);
    }, 30000); // 30 second timeout for network requests
  });

  describe('getUrls', () => {
    it('should successfully obtain a list of known confidential LLM urls', async () => {
      const urls = await secretClient.getUrls();
      expect(urls.length).toBeGreaterThanOrEqual(1);
      expect(urls).toContain(TEST_KNOWN_URL);
    }, 30000);

    it('should successfully obtain URLs for a specific model', async () => {
      const urls = await secretClient.getUrls(TEST_KNOWN_MODEL);
      expect(urls.length).toBeGreaterThanOrEqual(1);
      expect(urls).toContain(TEST_KNOWN_URL);
    }, 30000);
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      // Create client with invalid URL
      const invalidClient = new Secret('invalid-chain', 'http://invalid-url');
      
      await expect(invalidClient.getModels()).rejects.toThrow();
    });
  });
}); 