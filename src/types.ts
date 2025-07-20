/**
 * Log levels supported by TraceKit
 */
export type LogLevel = 'debug' | 'trace' | 'info' | 'success' | 'warn' | 'error' | 'fatal';

/**
 * Border styles for boxed output
 */
export type BorderStyle = 'rounded' | 'ascii' | 'minimal';

/**
 * Border styles that use actual borders (for BoxLogger)
 */
export type BoxBorderStyle = 'rounded' | 'ascii';

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
 * General logging options
 */
export interface GeneralOptions {
        /** Logger namespace for message categorization */
        namespace?: string;
        /** Enable timestamp display in log messages */
        enableTimestamp?: boolean;
        /** Enable ANSI color codes in terminal output */
        enableColors?: boolean;
}

/**
 * Terminal-specific display options
 */
export interface TerminalOptions {
        /** Default boxed output style for all log messages */
        defaultBoxed?: boolean;
        /** Default border style for boxed output */
        defaultBorderStyle?: BorderStyle;
        /** Default padding for boxed output */
        defaultPadding?: number;
}

/**
 * Remote transport and logging options
 */
export interface RemoteOptions {
        /** Enable remote logging transport */
        enableRemote?: boolean;
        /** Transport type for remote logging */
        transportType?: TransportType;
        /** Timeout for remote transport operations in milliseconds */
        transportTimeout?: number;
        /** Number of retry attempts for failed remote operations */
        retryAttempts?: number;
        /** Authentication token for remote services */
        authToken?: string;
        /** WebSocket reconnection delay in milliseconds */
        wsReconnectDelay?: number;
        /** Maximum WebSocket reconnection attempts */
        wsMaxReconnectAttempts?: number;
        /** Enable fallback to HTTP transport if WebSocket fails */
        fallbackToHttp?: boolean;
        /** Minimum log level for terminal output */
        minLevel?: LogLevel;
        /** Minimum log level for remote transport */
        remoteMinLevel?: LogLevel;
}

/**
 * Combined logger configuration interface
 */
export type LoggerConfig = GeneralOptions & TerminalOptions & RemoteOptions;

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
