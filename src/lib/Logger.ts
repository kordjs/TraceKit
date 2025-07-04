import { DefaultOptions } from '../defaultOptions';
import { StyledLogger } from './StyledLogger';
import { TimezoneKey } from '../tz-data/zones';
import { KordJSTypeError } from '../errors';

/**
 * TimeFormats represents formats of time.
 * 
 * @remarks
 * Compact - Short format
 * Date - Full Date
 * 
 * @public
 */
export enum TimeFormats {
  Compact = 'D/M/YY',
  Date = 'DD/MM/YYYY'
}

/**
 * Options to control the display of log output.
 *
 * @property timestamp - Whether to display timestamps in logs.
 * @property level - Whether to display log levels.
 * @property styling - Whether to enable styled logging.
 * @property icons - Whether to display icons (displayed in StyledLogger).
 */
export interface DisplayOptions {
  timestamp?: boolean;
  level?: boolean;
  styling?: boolean;
  icons?: boolean;
}

/**
 * Options for configuring timestamp formatting in the logger.
 *
 * @property zone - The timezone key to use for timestamps.
 * @property format - The time format to use.
 */
export interface TimeOptions {
  zone?: TimezoneKey;
  format?: TimeFormats;
}

/**
 * Options for configuring a file transport in the logger.
 *
 * @property enabled - Whether file transport is enabled.
 * @property file - The file path for log output.
 */
export interface TransportOptions {
  enabled: boolean;
  file: string;
}

/**
 * Configuration options for the Logger.
 *
 * @property display - Options related to how log messages are displayed.
 * @property transport - Options for configuring file transport of log messages.
 * @property time - Options for formatting timestamps in log messages.
 */
export interface LoggerOptions {
  display?: DisplayOptions;
  transport?: TransportOptions;
  time?: TimeOptions;
}

/**
 * Represents a configurable logger for outputting messages.
 *
 * @remarks
 * The `Logger` class provides a flexible logging mechanism with customizable options.
 * You can extend its functionality or use the {@link Logger.styled | styled} getter for formatted output.
 *
 * @example
 * ```typescript
 * const logger = new Logger();
 * logger.info('Hello, world!');
 * ```
 *
 * @see {@link LoggerOptions}
 * @see {@link StyledLogger}
 */
export class Logger {
  private options: LoggerOptions;

  /**
   * Creates a new instance of the Logger class.
   *
   * @param {LoggerOptions} options - Optional configuration object for the logger. If provided, must be of type `object` or `LoggerOptions`.
   * @throws {KordJSTypeError} If the `options` parameter is not an object.
   *
   * Merges the provided options with the default logger options.
   */
  public constructor(options?: LoggerOptions) {
    if (options && typeof options !== 'object')
      throw new KordJSTypeError('TYPE_NO_MATCH', 'object | LoggerOptions', typeof options);

    this.options = {
      ...DefaultOptions,
      ...options
    };
  }

  /**
   * Returns a new instance of {@link StyledLogger} configured with the current logger options.
   * 
   * @remarks
   * This getter provides access to a styled logger, which offer formatted output.
   * Each call creates a new {@link StyledLogger} instance using the current options.
   *
   * @returns {StyledLogger} A styled logger instance with the current configuration.
   */
  public get styled() {
    return new StyledLogger(this.options);
  }
}
