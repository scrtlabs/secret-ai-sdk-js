/**
 * Module: Secret AI SDK custom exceptions
 */

/**
 * Base exception class for Secret AI SDK module.
 */
export class SecretAIError extends Error {
  constructor(msg: string = 'Secret AI SDK error') {
    super(`Secret AI SDK Error: ${msg}`);
    this.name = 'SecretAIError';
    Object.setPrototypeOf(this, SecretAIError.prototype);
  }
}

/**
 * Raised when an unimplemented API is called.
 */
export class SecretAINotImplementedError extends SecretAIError {
  constructor() {
    super('Not implemented');
    this.name = 'SecretAINotImplementedError';
    Object.setPrototypeOf(this, SecretAINotImplementedError.prototype);
  }
}

/**
 * Raised when invalid input is provided.
 */
export class SecretAIInvalidInputError extends SecretAIError {
  constructor() {
    super('Invalid value');
    this.name = 'SecretAIInvalidInputError';
    Object.setPrototypeOf(this, SecretAIInvalidInputError.prototype);
  }
}

/**
 * Raised when no API key is provided.
 */
export class SecretAIAPIKeyMissingError extends SecretAIError {
  constructor() {
    super('Missing API Key. Environment variable SECRET_AI_API_KEY must be set');
    this.name = 'SecretAIAPIKeyMissingError';
    Object.setPrototypeOf(this, SecretAIAPIKeyMissingError.prototype);
  }
}

/**
 * Raised when no key mnemonic is provided.
 */
export class SecretAISecretValueMissingError extends SecretAIError {
  constructor(envVar: string) {
    super(`Missing environment variable ${envVar} must be set`);
    this.name = 'SecretAISecretValueMissingError';
    Object.setPrototypeOf(this, SecretAISecretValueMissingError.prototype);
  }
} 