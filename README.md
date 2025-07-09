# Secret AI SDK for TypeScript/Node.js

A TypeScript/Node.js SDK for interacting with Secret AI Confidential LLMs on the Secret Network blockchain.

## Features

- **Secret Network Integration**: Connect to Secret Network smart contracts
- **Confidential AI**: Interact with Secret AI Confidential LLMs
- **Mnemonic Support**: Generate private keys from mnemonics
- **TypeScript Support**: Full TypeScript type definitions
- **Streaming Support**: Custom streaming handlers for chat responses
- **Built-in Authentication**: API key management for Secret AI services

## Installation

```bash
npm install secret-ai-sdk-js
```

## Quick Start

### Basic Usage

```typescript
import { Secret, ChatSecret } from 'secret-ai-sdk-js';

// Initialize Secret client
const secret = new Secret();

// Get available models
const models = await secret.getModels();
console.log('Available models:', models);

// Get available URLs
const urls = await secret.getUrls();
console.log('Available URLs:', urls);

// Initialize ChatSecret with Secret client
const chatSecret = new ChatSecret({
  model: 'deepseek-r1:70b',
  baseUrl: 'https://secretai-rytn.scrtlabs.com:21434',
  temperature: 0.7
});
```

### Generate Private Key from Mnemonic

```typescript
import { Secret } from 'secret-ai-sdk-js';

const secret = new Secret();
const mnemonic = 'grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar';

const privateKey = secret.getPrivKeyFromMnemonic(mnemonic);
console.log('Private key:', privateKey);
```

### Using with Custom Configuration

```typescript
import { Secret, ChatSecret } from 'secret-ai-sdk-js';

// Custom Secret Network configuration
const secret = new Secret(
  'secret-4',  // chainId
  'https://lcd.secret.express'  // nodeUrl
);

// Custom ChatSecret configuration
const chatSecret = new ChatSecret({
  model: 'deepseek-r1:70b',
  baseUrl: 'https://secretai-rytn.scrtlabs.com:21434',
  temperature: 0.7,
  clientKwargs: {
    timeout: 30000,
    headers: {
      'X-Custom-Header': 'value'
    }
  }
});
```

## API Reference

### Secret Class

#### Constructor
```typescript
new Secret(chainId?: string, nodeUrl?: string)
```

#### Methods

- `getModels(): Promise<string[]>` - Get available AI models
- `getUrls(model?: string): Promise<string[]>` - Get available URLs for models
- `getPrivKeyFromMnemonic(mnemonic: string): string` - Generate private key from mnemonic

### ChatSecret Class

#### Constructor
```typescript
new ChatSecret(config: ChatSecretConfig)
```

#### ChatSecretConfig Interface
```typescript
interface ChatSecretConfig {
  baseUrl?: string;
  model?: string;
  temperature?: number;
  clientKwargs?: Record<string, any>;
  [key: string]: any;
}
```

#### Methods

- `getAttestation(): Promise<Record<string, any>>` - Get attestation report
- `secretClient` - Get underlying Secret AI client
- `asyncClient` - Get underlying Secret AI async client

## Environment Variables

The SDK supports the following environment variables:

- `SECRET_CHAIN_ID` - Secret Network chain ID (default: 'secret-4')
- `SECRET_NODE_URL` - Secret Network node URL (default: 'https://lcd.secret.express')
- `SECRET_WORKER_SMART_CONTRACT` - Smart contract address for worker management
- `SECRET_AI_API_KEY` - API key for Secret AI services
- `LOG_LEVEL` - Logging level (default: 'info')

## Examples

### Streaming Example

```typescript
import { ChatSecret, SecretStreamingHandler } from 'secret-ai-sdk-js';

// Custom streaming handler
class MyStreamingHandler extends SecretStreamingHandler {
  handleLLMNewToken(token: string): void {
    process.stdout.write(token);
  }
}

const chatSecret = new ChatSecret({
  model: 'deepseek-r1:70b',
  baseUrl: 'https://secretai-rytn.scrtlabs.com:21434'
});

// Use with streaming
const handler = new MyStreamingHandler();
// ... implement streaming logic
```

### Error Handling

```typescript
import { Secret, SecretAIError } from 'secret-ai-sdk-js';

try {
  const secret = new Secret();
  const models = await secret.getModels();
} catch (error) {
  if (error instanceof SecretAIError) {
    console.error('Secret AI Error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Build the project
npm run build
```

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-org/secret-ai-sdk-js/issues)
- Documentation: [Secret Network Docs](https://docs.scrt.network)
- Discord: [Secret Network Discord](https://discord.gg/secret-network)

## Related Projects

- [Secret Network](https://scrt.network)
- [SecretJS](https://github.com/scrtlabs/secret.js)
- [Secret AI](https://secretai.scrt.network) 