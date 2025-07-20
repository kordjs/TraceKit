# @kordjs/tracekit - Production Release

**Version**: 3.0.0

**Release Date**: July 2025

**License**: MIT

## 🚀 Ready for Production

TraceKit is a production-ready, zero-dependency TypeScript logging library designed for Node.js applications that need beautiful terminal output and reliable remote log shipping.

## ✨ Production Features

### 🎯 **Core Logging**

- **7 Log Levels**: debug, trace, info, success, warn, error, fatal
- **ANSI Terminal Styling**: Color-coded output with emojis and timestamps
- **Namespace Support**: Organize logs by application/service name
- **Level Filtering**: Configure minimum log levels for terminal and remote

### 🎨 **Terminal Presentation**

- **BoxLogger**: Beautiful bordered output with rounded/ASCII styles
- **Configurable Layout**: Padding, centering, custom titles
- **Color Customization**: Override colors per log or globally
- **Multi-line Support**: Proper formatting for complex log entries

### 📡 **Remote Transport System**

- **HTTP Transport**: Reliable log shipping with retry logic and exponential backoff
- **WebSocket Transport**: Real-time log streaming with automatic reconnection
- **Authentication**: Bearer token (HTTP) and query parameter (WebSocket) support
- **Fallback Logic**: WebSocket automatically falls back to HTTP when needed

### ⚙️ **Configuration**

- **Runtime Updates**: Change configuration without restarting
- **Per-Call Overrides**: Customize individual log entries
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Sensible Defaults**: Works out-of-the-box with minimal configuration

### 🧪 **Testing & Development**

- **InMemoryTransport**: Perfect for unit tests and development
- **Comprehensive Test Suite**: All features verified and tested
- **Examples**: Rich examples for all use cases
- **Zero Dependencies**: No external runtime dependencies

## 📦 **Production Installation**

```bash
# NPM
npm install @kordjs/tracekit

# Yarn
yarn add @kordjs/tracekit

# PNPM
pnpm add @kordjs/tracekit
```

## 🔧 **Production Usage**

```typescript
import { createLogger } from '@kordjs/tracekit';

// Production logger with authentication
const logger = createLogger({
        namespace: 'MyApp',
        enableRemote: true,
        transportType: 'http',
        remoteUrl: process.env.LOG_ENDPOINT,
        authToken: process.env.LOG_TOKEN,
        minLevel: 'info',
        remoteMinLevel: 'warn'
});

// Log with metadata
logger.info('User authenticated', {
        metadata: {
                userId: user.id,
                sessionId: session.id,
                timestamp: Date.now()
        }
});

// Critical errors with visual emphasis
logger.fatal('Database connection failed', {
        boxed: true,
        title: '🚨 CRITICAL ERROR',
        metadata: {
                service: 'database',
                error: error.message,
                stack: error.stack
        }
});
```

## 🌐 **Environment Configuration**

```bash
# .env file
LOG_TOKEN=your-secure-authentication-token
```

## 📊 **Performance Characteristics**

- **Zero Runtime Dependencies**: Minimal bundle size impact
- **Async Remote Transport**: Non-blocking log shipping
- **Memory Efficient**: Minimal memory footprint
- **Fast Terminal Output**: Optimized ANSI rendering
- **Connection Pooling**: Efficient HTTP transport usage

## 🔒 **Security Features**

- **Secure Authentication**: Bearer token and query parameter support
- **HTTPS/WSS**: Encrypted transport for sensitive logs
- **Token Rotation**: Runtime authentication updates
- **Error Handling**: Graceful handling of authentication failures

## 📈 **Production Monitoring**

TraceKit includes built-in monitoring for production environments:

- **Transport Status**: Monitor connection health
- **Retry Metrics**: Track failed log deliveries
- **Authentication Issues**: Detect token expiration
- **Fallback Events**: Monitor WebSocket-to-HTTP fallbacks

## 🏭 **Enterprise Ready**

- **High Availability**: Automatic failover and reconnection
- **Scalable**: Handles high-frequency logging scenarios
- **Configurable**: Extensive customization options
- **Observable**: Built-in metrics and health checks

## 📚 **Production Documentation**

- **Complete API Reference**: Comprehensive TypeScript definitions
- **Integration Guides**: Examples for popular frameworks
- **Best Practices**: Production deployment recommendations
- **Troubleshooting**: Common issues and solutions

---
