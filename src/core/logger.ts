import {
        LogLevel,
        LoggerConfig,
        LogCallConfig,
        InternalLogEntry,
        Transport
} from '../types';
import { formatTimestamp, formatSimpleMessage } from '../utils/formatter';
import { BoxLogger, MinimalBox } from '../utils/box';
import { getLevelColor } from '../utils/colors';
import { createTransport } from '../transports';

/**
 * Default configuration for the logger
 */
const DEFAULT_CONFIG: Required<LoggerConfig> = {
        namespace: 'System',
        enableTimestamp: true,
        enableColors: true,
        defaultBoxed: false,
        defaultBorderStyle: 'rounded',
        defaultPadding: 1,
        enableRemote: false,
        transportType: 'http',
        transportTimeout: 5000,
        retryAttempts: 3,
        authToken: '',
        wsReconnectDelay: 5000,
        wsMaxReconnectAttempts: 5,
        fallbackToHttp: true,
        minLevel: 'debug',
        remoteMinLevel: 'info'
};

/**
 * Fixed remote transport URLs (cannot be overridden by users)
 */
const REMOTE_URLS = {
        http: 'https://logsify.onrender.com/api/logs',
        websocket: 'wss://logsify.onrender.com/api/logs'
} as const;

/**
 * Log level priorities for filtering
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
        debug: 0,
        trace: 1,
        info: 2,
        success: 3,
        warn: 4,
        error: 5,
        fatal: 6
};

/**
 * Remote-enabled log levels
 */
const REMOTE_LEVELS: Set<LogLevel> = new Set(['info', 'warn', 'error', 'fatal']);

/**
 * TraceKit Logger - Advanced logging with terminal styling and remote transport
 * 
 * @description The main Logger class provides comprehensive logging functionality with:
 * - 7 log levels (debug, trace, info, success, warn, error, fatal)
 * - ANSI color-coded terminal output with configurable styling
 * - Boxed output with multiple border styles and customization options
 * - Remote transport via HTTP or WebSocket with authentication support
 * - Highly configurable with both global and per-call configuration
 * - Zero external dependencies
 * 
 * @example
 * ```typescript
 * import { Logger } from '@kordjs/tracekit';
 * 
 * const logger = new Logger({
 *   namespace: 'MyApp',
 *   enableRemote: true,
 *   transportType: 'websocket'
 * });
 * 
 * logger.info('Application started');
 * logger.error('Database connection failed', { boxed: true });
 * ```
 */
export class Logger {
        /** Internal configuration state */
        private config: Required<LoggerConfig>;
        /** Remote transport instance */
        private transport: Transport | null = null;
        /** Box formatting utility */
        private boxLogger: BoxLogger;

        /**
         * Create a new Logger instance
         * 
         * @param config - Logger configuration options
         * @description Initializes a new logger with the provided configuration.
         * Configuration is merged with sensible defaults. If remote logging is enabled,
         * the appropriate transport will be initialized automatically.
         */
        constructor(config: LoggerConfig = {}) {
                this.config = { ...DEFAULT_CONFIG, ...config };
                this.boxLogger = new BoxLogger(
                        this.config.defaultBorderStyle,
                        this.config.defaultPadding,
                        this.config.enableColors
                );

                if (this.config.enableRemote) {
                        this.initializeTransport();
                }
        }

        /**
         * Update logger configuration at runtime
         * 
         * @param newConfig - Partial configuration to merge with existing settings
         * @description Updates the logger configuration with new values. The configuration
         * is merged with existing settings, so only provided values are changed. If remote
         * transport settings are modified, the transport connection will be re-initialized.
         * 
         * @example
         * ```typescript
         * logger.configure({
         *   namespace: 'UpdatedApp',
         *   enableRemote: true,
         *   transportType: 'websocket'
         * });
         * ```
         */
        configure(newConfig: Partial<LoggerConfig>): void {
                const oldRemoteEnabled = this.config.enableRemote;
                const oldTransportType = this.config.transportType;
                const oldAuthToken = this.config.authToken;

                this.config = { ...this.config, ...newConfig };

                // Reinitialize transport if remote settings changed
                const remoteSettingsChanged =
                        this.config.enableRemote !== oldRemoteEnabled ||
                        this.config.transportType !== oldTransportType ||
                        this.config.authToken !== oldAuthToken;

                if (remoteSettingsChanged) {
                        this.closeTransport();
                        if (this.config.enableRemote) {
                                this.initializeTransport();
                        }
                }

                // Update box logger
                this.boxLogger = new BoxLogger(
                        this.config.defaultBorderStyle,
                        this.config.defaultPadding,
                        this.config.enableColors
                );
        }

        /**
         * Get current logger configuration
         * 
         * @returns Complete configuration object with all default values resolved
         * @description Returns a copy of the current configuration. This includes
         * all configuration values with defaults resolved, providing insight into
         * the logger's current operational state.
         */
        getConfig(): Required<LoggerConfig> {
                return { ...this.config };
        }

        // Log level methods
        
        /**
         * Log debug message
         * 
         * @param message - The message to log
         * @param config - Optional per-call configuration for styling and behavior
         * @description Logs a debug message with cyan coloring. Debug messages are
         * typically used for detailed diagnostic information during development.
         * 
         * @example
         * ```typescript
         * logger.debug('User authentication attempt', { 
         *   metadata: { userId: '123', attempt: 1 } 
         * });
         * ```
         */
        debug(message: string, config?: LogCallConfig): void {
                this.log('debug', message, config);
        }

        /**
         * Log trace message
         * 
         * @param message - The message to log
         * @param config - Optional per-call configuration for styling and behavior
         * @description Logs a trace message with magenta coloring. Trace messages are
         * used for very detailed execution flow tracking, more granular than debug.
         */
        trace(message: string, config?: LogCallConfig): void {
                this.log('trace', message, config);
        }

        /**
         * Log info message
         * 
         * @param message - The message to log
         * @param config - Optional per-call configuration for styling and behavior
         * @description Logs an informational message with blue coloring. Info messages
         * communicate general operational information and system status.
         */
        info(message: string, config?: LogCallConfig): void {
                this.log('info', message, config);
        }

        /**
         * Log success message
         * 
         * @param message - The message to log
         * @param config - Optional per-call configuration for styling and behavior
         * @description Logs a success message with green coloring. Success messages
         * indicate completed operations or positive outcomes.
         */
        success(message: string, config?: LogCallConfig): void {
                this.log('success', message, config);
        }

        /**
         * Log warning message
         * 
         * @param message - The message to log
         * @param config - Optional per-call configuration for styling and behavior
         * @description Logs a warning message with yellow coloring. Warning messages
         * indicate potential issues or situations requiring attention.
         */
        warn(message: string, config?: LogCallConfig): void {
                this.log('warn', message, config);
        }

        /**
         * Log error message
         * 
         * @param message - The message to log
         * @param config - Optional per-call configuration for styling and behavior
         * @description Logs an error message with red coloring. Error messages
         * indicate failures or problems that have occurred in the system.
         */
        error(message: string, config?: LogCallConfig): void {
                this.log('error', message, config);
        }

        /**
         * Log fatal message
         * 
         * @param message - The message to log
         * @param config - Optional per-call configuration for styling and behavior
         * @description Logs a fatal message with bright red coloring. Fatal messages
         * indicate critical errors that may cause system failure or instability.
         */
        fatal(message: string, config?: LogCallConfig): void {
                this.log('fatal', message, config);
        }

        /**
         * Core logging method
         */
        private log(level: LogLevel, message: string, callConfig?: LogCallConfig): void {
                // Check if log level meets minimum threshold
                if (!this.shouldLog(level)) {
                        return;
                }

                const timestamp = formatTimestamp();
                const entry: InternalLogEntry = {
                        level,
                        namespace: this.config.namespace,
                        message,
                        timestamp,
                        metadata: (callConfig as any)?.metadata
                };

                // Format and output to terminal
                this.outputToTerminal(entry, callConfig);

                // Send to remote if enabled and level qualifies
                if (this.shouldLogRemote(level, callConfig)) {
                        this.sendToRemote(entry).catch((error) => {
                                console.error('Failed to send log to remote:', error);
                        });
                }
        }

        /**
         * Check if log should be output based on minimum level
         */
        private shouldLog(level: LogLevel): boolean {
                return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.config.minLevel];
        }

        /**
         * Check if log should be sent to remote
         */
        private shouldLogRemote(level: LogLevel, callConfig?: LogCallConfig): boolean {
                if (!this.config.enableRemote || callConfig?.skipRemote) {
                        return false;
                }

                if (!REMOTE_LEVELS.has(level)) {
                        return false;
                }

                return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.config.remoteMinLevel];
        }

        /**
         * Output formatted log to terminal
         */
        private outputToTerminal(entry: InternalLogEntry, callConfig?: LogCallConfig): void {
                const shouldBox = callConfig?.boxed ?? this.config.defaultBoxed;

                if (shouldBox) {
                        this.outputBoxedLog(entry, callConfig);
                } else {
                        this.outputSimpleLog(entry);
                }
        }

        /**
         * Output simple formatted log
         */
        private outputSimpleLog(entry: InternalLogEntry): void {
                const formatted = formatSimpleMessage(entry, {
                        enableTimestamp: this.config.enableTimestamp,
                        enableColors: this.config.enableColors
                });

                console.log(formatted);
        }

        /**
         * Output boxed log with support for multiple border styles
         */
        private outputBoxedLog(entry: InternalLogEntry, callConfig?: LogCallConfig): void {
                const borderStyle = callConfig?.borderStyle ?? this.config.defaultBorderStyle;
                const padding = callConfig?.padding ?? this.config.defaultPadding;
                const title = callConfig?.title;
                const centered = callConfig?.centered ?? false;
                const color = callConfig?.color ?? getLevelColor(entry.level);

                // Prepare content
                const contentLines: string[] = [];

                if (this.config.enableTimestamp) {
                        contentLines.push(`🕐 ${entry.timestamp}`);
                }

                contentLines.push(`📝 ${entry.message}`);

                if (entry.metadata && Object.keys(entry.metadata).length > 0) {
                        contentLines.push('');
                        contentLines.push('📋 Metadata:');
                        contentLines.push(JSON.stringify(entry.metadata, null, 2));
                }

                let boxed: string;

                if (borderStyle === 'minimal') {
                        // Use MinimalBox for borderless output
                        const minimalBox = new MinimalBox(padding, this.config.enableColors);
                        boxed = minimalBox.createBox(contentLines, {
                                title: title || `${entry.level.toUpperCase()} - ${entry.namespace}`,
                                color,
                                centered
                        });
                } else {
                        // Use traditional BoxLogger for bordered output
                        const boxLogger = new BoxLogger(borderStyle, padding, this.config.enableColors);
                        boxed = boxLogger.createBox(contentLines, {
                                title: title || `${entry.level.toUpperCase()} - ${entry.namespace}`,
                                color,
                                centered,
                                minWidth: 50
                        });
                }

                console.log(boxed);
        }

        /**
         * Send log entry to remote transport
         */
        private async sendToRemote(entry: InternalLogEntry): Promise<void> {
                if (!this.transport) {
                        return;
                }

                const remoteEntry = {
                        level: entry.level,
                        namespace: entry.namespace,
                        message: entry.message,
                        metadata: entry.metadata,
                        timestamp: entry.timestamp
                };

                await this.transport.send(remoteEntry);
        }

        /**
         * Initialize remote transport with hardcoded URLs
         */
        private initializeTransport(): void {
                try {
                        const url = this.config.transportType === 'websocket' 
                                ? REMOTE_URLS.websocket 
                                : REMOTE_URLS.http;

                        this.transport = createTransport(
                                this.config.transportType,
                                url,
                                {
                                        timeout: this.config.transportTimeout,
                                        retryAttempts: this.config.retryAttempts,
                                        reconnectDelay: this.config.wsReconnectDelay,
                                        maxReconnectAttempts: this.config.wsMaxReconnectAttempts,
                                        fallbackToHttp: this.config.fallbackToHttp,
                                        authToken: this.config.authToken || undefined
                                }
                        );
                } catch (error) {
                        console.error('Failed to initialize transport:', error);
                }
        }

        /**
         * Close transport connection
         */
        private async closeTransport(): Promise<void> {
                if (this.transport?.close) {
                        await this.transport.close();
                }
                this.transport = null;
        }

        /**
         * Clean up resources
         */
        async close(): Promise<void> {
                await this.closeTransport();
        }

        /**
         * Get transport status
         */
        isConnected(): boolean {
                return this.transport?.isConnected?.() ?? false;
        }
}
