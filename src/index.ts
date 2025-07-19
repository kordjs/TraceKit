/**
 * TraceKit - TypeScript-based terminal and remote logging library
 * @version 3.0.0
 * @author KordJS
 */

// Core exports
export { Logger } from './core/logger';

// Types
export type {
        LogLevel,
        BorderStyle,
        TransportType,
        LogEntry,
        LogCallConfig,
        LoggerConfig,
        Transport,
        InternalLogEntry
} from './types';

// Transports
export {
        HTTPTransport,
        WebSocketTransport,
        InMemoryTransport,
        createTransport
} from './transports';

// Utilities
export { Colors, LogIcons, colorize, getLevelColor } from './utils/colors';
export { BoxLogger } from './utils/box';
export { formatTimestamp, getDisplayTimestamp, formatLevel } from './utils/formatter';

// Create default logger instance
import { Logger } from './core/logger';
import { LogCallConfig, LoggerConfig } from './types';

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a new logger instance with custom configuration
 */
export function createLogger(config?: LoggerConfig): Logger {
        return new Logger(config);
}

// Convenience methods using default logger
export const debug = (message: string, config?: LogCallConfig) => logger.debug(message, config);
export const trace = (message: string, config?: LogCallConfig) => logger.trace(message, config);
export const info = (message: string, config?: LogCallConfig) => logger.info(message, config);
export const success = (message: string, config?: LogCallConfig) => logger.success(message, config);
export const warn = (message: string, config?: LogCallConfig) => logger.warn(message, config);
export const error = (message: string, config?: LogCallConfig) => logger.error(message, config);
export const fatal = (message: string, config?: LogCallConfig) => logger.fatal(message, config);

/**
 * Configure the default logger
 */
export const configure = (config: LoggerConfig) => logger.configure(config);

/**
 * Get the default logger configuration
 */
export const getConfig = () => logger.getConfig();

/**
 * Close the default logger
 */
export const close = () => logger.close();

/**
 * Check if the default logger is connected to remote
 */
export const isConnected = () => logger.isConnected();

// Default export
export default {
        Logger,
        logger,
        createLogger,
        debug,
        trace,
        info,
        success,
        warn,
        error,
        fatal,
        configure,
        getConfig,
        close,
        isConnected
};
