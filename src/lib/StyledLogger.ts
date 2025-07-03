import { colors } from '@kordjs/utils';
import { LoggerOptions } from './Logger';
import { KordJSError } from '../errors';
import { Utility } from './Utility';

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

/**
 * A logger class that outputs styled log messages based on provided options.
 */
export class StyledLogger {
  private options: LoggerOptions;
  private utility: Utility;

  /**
   * Creates an instance of StyledLogger.
   * @param options - Logger configuration options.
   * @throws {KordJSError} If styled logging is disabled in options.
   */
  public constructor(options: LoggerOptions) {
    if (!options.display?.styling) throw new KordJSError('STYLED_LOGGER_DISABLED');

    this.options = options;
    this.utility = new Utility(options);
  }

  /**
   * Logs a debug message with styling.
   * @param args - Arguments to log.
   */
  public debug(...args: unknown[]) {
    console.debug(this._log("DEBUG", ...args));
  }

  /**
   * Logs an info message with styling.
   * @param args - Arguments to log.
   */
  public info(...args: unknown[]) {
    console.info(this._log("INFO", ...args));
  }

  /**
   * Logs a warning message with styling.
   * @param args - Arguments to log.
   */
  public warn(...args: unknown[]) {
    console.warn(this._log("WARN", ...args));
  }

  /**
   * Logs an error message with styling.
   * @param args - Arguments to log.
   */
  public error(...args: unknown[]) {
    console.error(this._log("ERROR", ...args));
  }

  /**
   * Formats the log message according to the logger options and log level.
   * @param lvl - The log level (e.g., DEBUG, INFO, WARN, ERROR).
   * @param args - Arguments to include in the log message.
   * @returns The formatted log message string.
   * @private
   */
  private _log(lvl: LogLevel, ...args: unknown[]) {
    let placeholder = '{icon}{timestamp}{level}{args}';

    if (!this.options.display?.level) placeholder = placeholder.replace('{level}', '');
    if (!this.options.display?.timestamp) placeholder = placeholder.replace('{timestamp}', '');
    if (!this.options.display?.icons) placeholder = placeholder.replace('{icon}', '');

    const IconForLevels: Record<LogLevel, keyof typeof colors.icons> = {
      DEBUG: "star",
      INFO: "info",
      WARN: "warn",
      ERROR: "cross"
    };

    const content = placeholder
      .replace("{icon}", `${colors.icons[IconForLevels[lvl]]()}`)
      .replace('{timestamp}', `${colors.red(this.utility.date.format())} `)
      .replace('{level}', `${lvl} `)
      .replace('{args}', this.utility.string.stringifyArguments(...args));

    return content;
  }
}