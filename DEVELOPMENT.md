# TraceKit Package Files

This directory contains the source code and built package for `@kordjs/tracekit`.

## Directory Structure

```
/app/
├── src/                     # TypeScript source code
│   ├── core/               # Core logger implementation
│   ├── transports/         # Remote transport implementations
│   ├── utils/             # Utility functions
│   ├── test/              # TypeScript test files
│   ├── types.ts           # Type definitions
│   └── index.ts           # Main export file
├── dist/                   # Compiled JavaScript output
│   ├── index.js           # CommonJS build
│   ├── index.mjs          # ES Module build
│   └── index.d.ts         # Type definitions
├── examples/              # Usage examples
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── tsup.config.js         # Build configuration
└── README.md             # Documentation
```

## Development

1. **Install dependencies**:

      ```bash
      yarn install
      ```

2. **Build the package**:

      ```bash
      npm run build
      ```

3. **Development build with watch**:

      ```bash
      npm run dev
      ```

4. **Run examples**:

      ```bash
      node examples/basic-usage.js
      ```

5. **Run tests**:

      ```bash
      node test-runner.js
      ```

6. **Test remote functionality**:
      ```bash
      node test-remote.js
      ```

## Features Implemented

✅ **Core Logging**

- All 7 log levels (debug, trace, info, success, warn, error, fatal)
- ANSI color-coded terminal output
- Timestamp support
- Namespace support

✅ **Terminal Styling**

- BoxLogger with rounded and ASCII border styles
- Configurable padding and alignment
- Centered content support
- Custom titles and colors

✅ **Remote Transports**

- HTTPTransport with retry logic
- WebSocketTransport with reconnection and fallback
- InMemoryTransport for testing
- Transport factory function

✅ **Configuration System**

- Global configuration with runtime updates
- Per-call configuration overrides
- Complete type safety
- Sensible defaults

✅ **Zero Dependencies**

- Uses only native Node.js APIs
- ANSI escape codes for styling
- Native fetch for HTTP requests
- Native WebSocket for real-time transport

✅ **TypeScript Support**

- Full TypeScript implementation
- Comprehensive type definitions
- Both ESM and CJS exports
- Source maps for debugging

✅ **Testing Support**

- InMemoryTransport for unit tests
- Comprehensive test suite
- Example implementations

The package is ready for publishing to NPM!
