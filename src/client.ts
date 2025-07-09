/**
 * Module: Secret AI SDK Clients
 */

import { Ollama } from 'ollama';
import * as config from './config';
import { SecretAIAPIKeyMissingError } from './exceptions';

export interface SecretAIClientOptions {
  host?: string;
  apiKey?: string;
  [key: string]: any;
}

/**
 * Creates an ollama client with Secret AI authentication.
 * 
 * Arguments:
 * - `host`: optional, Ollama URL
 * - `apiKey`: optional, Secret AI API Key. If none, will access the env var SECRET_AI_API_KEY
 * Additional options are passed to the parent Ollama client
 */
export class SecretAIClient extends Ollama {
  constructor(options: SecretAIClientOptions = {}) {
    const { host, apiKey, ...otherOptions } = options;
    
    // Get API key from parameter or environment variable
    const key = apiKey || process.env[config.API_KEY];
    
    if (!key) {
      throw new SecretAIAPIKeyMissingError();
    }

    // Set authorization header
    const headers = {
      'Authorization': `Bearer ${key}`,
      ...otherOptions.headers,
    };

    // Initialize parent Ollama client with authentication
    super({
      host,
      headers,
      ...otherOptions,
    });
  }
}

/**
 * Creates an async ollama client with Secret AI authentication.
 * 
 * Arguments:
 * - `host`: optional, Ollama URL  
 * - `apiKey`: optional, Secret AI API Key. If none, will access the env var SECRET_AI_API_KEY
 * Additional options are passed to the parent Ollama client
 */
export class SecretAIAsyncClient extends Ollama {
  constructor(options: SecretAIClientOptions = {}) {
    const { host, apiKey, ...otherOptions } = options;
    
    // Get API key from parameter or environment variable
    const key = apiKey || process.env[config.API_KEY];
    
    if (!key) {
      throw new SecretAIAPIKeyMissingError();
    }

    // Set authorization header
    const headers = {
      'Authorization': `Bearer ${key}`,
      ...otherOptions.headers,
    };

    // Initialize parent Ollama client with authentication
    super({
      host,
      headers,
      ...otherOptions,
    });
  }
} 