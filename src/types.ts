/**
 * Log levels supported by TraceKit
 */
export type LogLevel = 'debug' | 'trace' | 'info' | 'success' | 'warn' | 'error' | 'fatal';

/**
 * Border styles for boxed output
 */
export type BorderStyle = 'rounded' | 'ascii';

/**
 * Transport types
 */
export type TransportType = 'http' | 'websocket' | 'memory';

/**
 * Log entry structure for remote transport
 */
export interface LogEntry {
        level: LogLevel;
        namespace: string;
        message: string;
        metadata?: Record<string, any>;
        timestamp?: string;
}

/**
 * Configuration for individual log calls
 */
export interface LogCallConfig {
        boxed?: boolean;
        borderStyle?: BorderStyle;
        title?: string;
        padding?: number;
        centered?: boolean;
        skipRemote?: boolean;
        color?: string;
        metadata?: Record<string, any>;
}

/**
 * Global logger configuration
 */
export interface LoggerConfig {
        // General settings
        namespace?: string;
        enableTimestamp?: boolean;
        enableColors?: boolean;

        // Terminal settings
        defaultBoxed?: boolean;
        defaultBorderStyle?: BorderStyle;
        defaultPadding?: number;

        // Remote settings
        enableRemote?: boolean;
        remoteUrl?: string;
        transportType?: TransportType;
        remoteTimeout?: number;
        retryAttempts?: number;

        // Authentication
        authToken?: string;

        // WebSocket specific
        wsReconnectDelay?: number;
        wsMaxReconnectAttempts?: number;
        fallbackToHttp?: boolean;

        // Log levels
        minLevel?: LogLevel;
        remoteMinLevel?: LogLevel;
}

/**
 * Transport interface that all transports must implement
 */
export interface Transport {
        send(entry: LogEntry): Promise<boolean>;
        close?(): Promise<void>;
        isConnected?(): boolean;
}

/**
 * Internal log entry with additional metadata
 */
export interface InternalLogEntry extends LogEntry {
        timestamp: string;
        formattedMessage?: string;
}
