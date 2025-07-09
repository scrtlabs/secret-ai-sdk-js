/**
 * Module: Secret AI SDK configurations and constants
 */

// Log level environment variable
export const LOG_LEVEL = 'SECRET_SDK_LOG_LEVEL';

// Log level mapping for console output
export const LOG_LEVELS = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  warning: 'warn', // Allow both 'warn' and 'warning' as valid values
  error: 'error',
  critical: 'error',
  fatal: 'error'
} as const;

export type LogLevel = keyof typeof LOG_LEVELS;

// API key environment variable
export const API_KEY = 'SECRET_AI_API_KEY';

// SECRET Network configuration
export const SECRET_CHAIN_ID_DEFAULT = 'pulsar-3';
export const SECRET_WORKER_SMART_CONTRACT_DEFAULT = 'secret18cy3cgnmkft3ayma4nr37wgtj4faxfnrnngrlq';
export const SECRET_NODE_URL_DEFAULT = 'https://pulsar.lcd.secretnodes.com';

// Environment variable names
export const SECRET_CHAIN_ID = 'SECRET_CHAIN_ID'; // points to the name of the env var for secret chain id
export const SECRET_WORKER_SMART_CONTRACT = 'SECRET_WORKER_SMART_CONTRACT'; // points to the env var for the smart contract address for secret worker management
export const SECRET_NODE_URL = 'SECRET_NODE_URL'; // points to the name of the env var for secret node url 