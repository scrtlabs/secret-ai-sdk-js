/**
 * Secret AI SDK
 * 
 * TypeScript/Node.js SDK for interacting with Secret AI Confidential LLMs
 */

// Main classes
export { ChatSecret } from './chatSecret';
export type { ChatSecretConfig } from './chatSecret';
export { Secret } from './secret';

// Client classes
export { SecretAIClient, SecretAIAsyncClient } from './client';
export type { SecretAIClientOptions } from './client';

// Exceptions
export {
  SecretAIError,
  SecretAIInvalidInputError,
  SecretAIAPIKeyMissingError,
  SecretAISecretValueMissingError,
  SecretAINotImplementedError,
} from './exceptions';

// Configuration constants (optional export)
export * as config from './config';

// Version info
export const VERSION = '0.1.0'; 