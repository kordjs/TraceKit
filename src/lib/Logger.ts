import { DefaultOptions } from '../defaultOptions';
import { StyledLogger } from './StyledLogger';
import { TimezoneKey } from '../tz-data/zones';
import { KordJSTypeError } from '../errors';

/**
 * Enum representing supported time formats.
 */
export enum TimeFormats {
  Compact = 'D/M/YY',
  Date = 'DD/MM/YYYY'
}

/**
 * Options for controlling log display features.
 */
interface DisplayOptions {
  /** Whether to display timestamps in logs. */
  timestamp?: boolean;
  /** Whether to display log levels. */
  level?: boolean;
  /** Whether to enable styled logging. */
  styling?: boolean;
  /** Whether to display icons (displayed in StyledLogger) */
  icons?: boolean;
}

/**
 * Options for configuring time formatting and timezone.
 */
interface TimeOptions {
  /** The timezone key to use for timestamps. */
  zone?: TimezoneKey;
  /** The time format to use. */
  format?: TimeFormats;
}

/**
 * Options for configuring log file transport.
 */
interface TransportOptions {
  /** Whether file transport is enabled. */
  enabled: boolean;
  /** The file path for log output. */
  file: string;
}

/**
 * Main logger configuration options.
 */
export interface LoggerOptions {
  /** Display-related options. */
  display?: DisplayOptions;
  /** File transport options. */
  transport?: TransportOptions;
  /** Time formatting options. */
  time?: TimeOptions;
}

export class Logger {
  private options: LoggerOptions;

  /**
   * Creates a new Logger instance.
   * @param options - Logger configuration options.
   * @throws {KordJSTypeError} If options is not an object.
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
   * Returns a styled logger instance using the current options.
   */
  public get styled() {
    return new StyledLogger(this.options);
  }
}
