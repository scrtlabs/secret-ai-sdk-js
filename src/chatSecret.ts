/**
 * Module Secret AI SDK
 * ================
 *
 * Secret AI SDK module serves the purpose of connecting to Secret AI Confidential LLM.
 *
 * Author: Alex H
 * Email: alexh@scrtlabs.com
 * Version: 0.1
 */

import { ChatOllama } from '@langchain/ollama';
import { SecretAIClient, SecretAIAsyncClient } from './client';
import * as config from './config';

// Set up logging
const logLevelName = (process.env[config.LOG_LEVEL] || 'info').toLowerCase();

if (config.LOG_LEVELS[logLevelName as keyof typeof config.LOG_LEVELS]) {
  // Set console log level if needed
  console.log(`Log level set to: ${logLevelName}`);
} else {
  console.log(`Invalid log level: ${logLevelName}. Defaulting to INFO.`);
}

export interface ChatSecretConfig {
  baseUrl?: string;
  model?: string;
  temperature?: number;
  clientKwargs?: Record<string, any>;
  [key: string]: any;
}

/**
 * Secret AI Chat client that extends ChatOllama with SecretAI authentication
 */
export class ChatSecret extends ChatOllama {
  protected _secretClient?: SecretAIClient;
  protected _asyncClient?: SecretAIAsyncClient;
  public clientKwargs?: Record<string, any>;

  constructor(config: ChatSecretConfig = {}) {
    const { clientKwargs, baseUrl = 'http://localhost:11434', ...ollamaConfig } = config;
    
    super({
      ...ollamaConfig,
      baseUrl,
    });
    
    this.clientKwargs = clientKwargs;
    this._setClients();
  }

  /**
   * Override the _setClients method to use SecretAI clients
   */
  private _setClients(): this {
    const clientOptions = {
      host: this.baseUrl,
      ...this.clientKwargs,
    };

    // Set Secret AI Client
    this._secretClient = new SecretAIClient(clientOptions);
    
    // Set Secret AI Async Client  
    this._asyncClient = new SecretAIAsyncClient(clientOptions);

    return this;
  }

  /**
   * Method returns the attestation report
   * @returns Promise<Record<string, any>> - attestation report
   */
  async getAttestation(): Promise<Record<string, any>> {
    // Not implemented yet
    return {};
  }

  /**
   * Get the underlying SecretAI client
   */
  get secretClient(): SecretAIClient | undefined {
    return this._secretClient;
  }

  /**
   * Get the underlying SecretAI async client
   */
  get asyncClient(): SecretAIAsyncClient | undefined {
    return this._asyncClient;
  }
} 