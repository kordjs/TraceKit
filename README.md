# TraceKit

A TypeScript-based terminal and remote logging library with zero external dependencies. Designed for Node.js applications that need beautiful terminal output and optional remote log shipping.

## Features

- 🎨 **Terminal Styling**: ANSI color-coded output with timestamps and optional boxing
- 📡 **Remote Logging**: HTTP and WebSocket transports for log shipping
- ⚙️ **Highly Configurable**: Global and per-call configuration options
- 📦 **Zero Dependencies**: Uses only native Node.js APIs
- 🏷️ **TypeScript**: Full TypeScript support with comprehensive types
- 🧪 **Testing Support**: In-memory transport for unit tests

## Installation

```bash
npm install @kordjs/tracekit
```

## Quick Start

```typescript
import { logger, info, warn, error } from '@kordjs/tracekit';

// Basic usage
logger.info('Application started');
logger.warn('This is a warning');
logger.error('Something went wrong');

// Convenience functions
info('Quick info message');
warn('Quick warning');
error('Quick error');
```

## Log Levels

TraceKit supports 7 log levels in order of severity:

- `debug` - Detailed debugging information
- `trace` - Fine-grained execution traces
- `info` - General information messages
- `success` - Success/completion messages
- `warn` - Warning messages
- `error` - Error messages
- `fatal` - Critical errors

## Terminal Styling

### Simple Logs

```typescript
import { logger } from '@kordjs/tracekit';

logger.info('Simple message');
logger.success('Operation completed!');
```

### Boxed Output

```typescript
// Basic box
logger.info('Important message', { boxed: true });

// Custom styled box
logger.error('Critical error', {
        boxed: true,
        title: '🚨 ALERT',
        borderStyle: 'rounded',
        centered: true,
        padding: 2
});
```

### Border Styles

- `rounded` - Uses Unicode box drawing characters (╭─╮│╰─╯)
- `ascii` - Uses ASCII characters (+--+|+--+)

## Configuration

### Global Configuration

```typescript
import { configure, createLogger } from '@kordjs/tracekit';

// Update default logger
configure({
        namespace: 'MyApp',
        enableTimestamp: true,
        enableColors: true,
        defaultBoxed: false
});

// Create custom logger
const logger = createLogger({
        namespace: 'CustomApp',
        minLevel: 'warn',
        enableRemote: true,
        remoteUrl: 'https://your-log-server.com/api/logs'
});
```

### Per-Call Configuration

```typescript
logger.info('Special message', {
        boxed: true,
        title: 'Special',
        metadata: { userId: '123', action: 'login' }
});
```

## Remote Logging

### HTTP Transport with Authentication

```typescript
const logger = createLogger({
        enableRemote: true,
        transportType: 'http',
        remoteUrl: 'https://logsify.onrender.com/api/logs',
        retryAttempts: 3,
        authToken: 'your-auth-token-here' // Sent as Authorization Bearer header
});
```

### WebSocket Transport with Authentication

```typescript
const logger = createLogger({
        enableRemote: true,
        transportType: 'websocket',
        remoteUrl: 'wss://your-server.com/logs',
        fallbackToHttp: true,
        wsMaxReconnectAttempts: 5,
        authToken: 'your-auth-token-here' // Appended as ?token=your-auth-token-here
});
```

### Authentication Details

- **HTTP Transport**: Token sent as `Authorization: Bearer {token}` header
- **WebSocket Transport**: Token appended as query parameter `?token={token}`
- **Fallback Behavior**: When WebSocket fails and falls back to HTTP, the same token is used with Bearer authentication

### Log Payload

Remote logs are sent as JSON with this structure:

```typescript
{
  level: string        // Log level
  namespace: string    // App/service name
  message: string      // Log message
  metadata?: object    // Optional additional data
  timestamp: string    // ISO timestamp
}
```

## Testing

Use the `InMemoryTransport` for unit tests:

```typescript
import { InMemoryTransport } from '@kordjs/tracekit';

const transport = new InMemoryTransport();

// Send test logs
await transport.send({
        level: 'info',
        namespace: 'Test',
        message: 'Test message',
        timestamp: new Date().toISOString()
});

// Verify logs
const logs = transport.getLogs();
const infoLogs = transport.getLogsByLevel('info');
const testLogs = transport.getLogsByNamespace('Test');
```

## API Reference

### Core Classes

#### Logger

Main logger class with all functionality.

```typescript
class Logger {
        constructor(config?: LoggerConfig);
        configure(config: Partial<LoggerConfig>): void;
        getConfig(): LoggerConfig;

        // Log methods
        debug(message: string, config?: LogCallConfig): void;
        trace(message: string, config?: LogCallConfig): void;
        info(message: string, config?: LogCallConfig): void;
        success(message: string, config?: LogCallConfig): void;
        warn(message: string, config?: LogCallConfig): void;
        error(message: string, config?: LogCallConfig): void;
        fatal(message: string, config?: LogCallConfig): void;

        // Utility methods
        isConnected(): boolean;
        close(): Promise<void>;
}
```

#### BoxLogger

Utility for creating boxed terminal output.

```typescript
class BoxLogger {
        constructor(borderStyle?: BorderStyle, padding?: number, enableColors?: boolean);
        createBox(content: string | string[], options?: BoxOptions): string;
}
```

### Transports

#### HTTPTransport

```typescript
class HTTPTransport implements Transport {
        constructor(url: string, timeout?: number, retryAttempts?: number, authToken?: string);
        send(entry: LogEntry): Promise<boolean>;
}
```

#### WebSocketTransport

```typescript
class WebSocketTransport implements Transport {
        constructor(
                url: string,
                reconnectDelay?: number,
                maxReconnectAttempts?: number,
                httpFallbackUrl?: string,
                fallbackToHttp?: boolean,
                authToken?: string
        );
        send(entry: LogEntry): Promise<boolean>;
        close(): Promise<void>;
}
```

#### InMemoryTransport

```typescript
class InMemoryTransport implements Transport {
        constructor(shouldFail?: boolean);
        send(entry: LogEntry): Promise<boolean>;
        getLogs(): LogEntry[];
        getLogsByLevel(level: string): LogEntry[];
        getLogsByNamespace(namespace: string): LogEntry[];
        clear(): void;
}
```

## Configuration Options

### LoggerConfig

```typescript
interface LoggerConfig {
        // General
        namespace?: string; // Default: 'System'
        enableTimestamp?: boolean; // Default: true
        enableColors?: boolean; // Default: true

        // Terminal styling
        defaultBoxed?: boolean; // Default: false
        defaultBorderStyle?: BorderStyle; // Default: 'rounded'
        defaultPadding?: number; // Default: 1

        // Remote logging
        enableRemote?: boolean; // Default: false
        remoteUrl?: string; // Default: 'https://logsify.onrender.com/api/logs'
        transportType?: TransportType; // Default: 'http'
        remoteTimeout?: number; // Default: 5000
        retryAttempts?: number; // Default: 3

        // Authentication
        authToken?: string; // Default: undefined

        // WebSocket specific
        wsReconnectDelay?: number; // Default: 5000
        wsMaxReconnectAttempts?: number; // Default: 5
        fallbackToHttp?: boolean; // Default: true

        // Filtering
        minLevel?: LogLevel; // Default: 'debug'
        remoteMinLevel?: LogLevel; // Default: 'info'
}
```

### LogCallConfig

```typescript
interface LogCallConfig {
        boxed?: boolean; // Enable boxed output
        borderStyle?: BorderStyle; // Box border style
        title?: string; // Box title
        padding?: number; // Box padding
        centered?: boolean; // Center content in box
        skipRemote?: boolean; // Skip remote transport
        color?: string; // Custom color (ANSI code)
        metadata?: Record<string, any>; // Additional structured data
}
```

## License

MIT License - see LICENSE file for details.
