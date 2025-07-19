/**
 * TraceKit - TypeScript-based terminal and remote logging library
 * @version 1.0.0
 * @author KordJS Team
 */

// Core exports
export { Logger } from './core/logger'

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
} from './types'

// Transports
export {
  HTTPTransport,
  WebSocketTransport,
  InMemoryTransport,
  createTransport
} from './transports'

// Utilities
export { Colors, LogIcons, colorize, getLevelColor } from './utils/colors'
export { BoxLogger } from './utils/box'
export { formatTimestamp, getDisplayTimestamp, formatLevel } from './utils/formatter'

// Create default logger instance
import { Logger } from './core/logger'

/**
 * Default logger instance
 */
export const logger = new Logger()

/**
 * Create a new logger instance with custom configuration
 */
export function createLogger(config?: Parameters<typeof Logger.prototype.constructor>[0]): Logger {
  return new Logger(config)
}

// Convenience methods using default logger
export const debug = (message: string, config?: Parameters<typeof logger.debug>[1]) => logger.debug(message, config)
export const trace = (message: string, config?: Parameters<typeof logger.trace>[1]) => logger.trace(message, config)
export const info = (message: string, config?: Parameters<typeof logger.info>[1]) => logger.info(message, config)
export const success = (message: string, config?: Parameters<typeof logger.success>[1]) => logger.success(message, config)
export const warn = (message: string, config?: Parameters<typeof logger.warn>[1]) => logger.warn(message, config)
export const error = (message: string, config?: Parameters<typeof logger.error>[1]) => logger.error(message, config)
export const fatal = (message: string, config?: Parameters<typeof logger.fatal>[1]) => logger.fatal(message, config)

/**
 * Configure the default logger
 */
export const configure = (config: Parameters<typeof logger.configure>[0]) => logger.configure(config)

/**
 * Get the default logger configuration
 */
export const getConfig = () => logger.getConfig()

/**
 * Close the default logger
 */
export const close = () => logger.close()

/**
 * Check if the default logger is connected to remote
 */
export const isConnected = () => logger.isConnected()

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
}