import { LoggerOptions } from './Logger';

/**
 * Supported date/time format tokens.
 */
type FormatToken = 'Y' | 'M' | 'D' | 'H' | 'm' | 's';

/**
 * Supported styles for date/time formatting.
 */
type FormatStyle = '2-digit' | 'numeric';

export class Utility {
  private options: LoggerOptions;

  /**
   * Creates a new Utility instance.
   * @param options - Logger configuration options.
   */
  public constructor(options: LoggerOptions) {
    this.options = options;
  }

  /**
   * Provides string utility functions.
   */
  public get string() {
    return {
      /**
       * Converts arguments to a formatted string for logging.
       * @param args - Arguments to stringify.
       * @returns {string} The stringified arguments.
       */
      stringifyArguments: (...args: unknown[]) => this._string_format_stringifyArgs(args)
    };
  }

  /**
   * Provides date utility functions.
   */
  public get date() {
    return {
      /**
       * Formats the current date/time according to logger options.
       * @returns {string} The formatted date string.
       */
      format: () => {
        const formatter = Intl.DateTimeFormat('en-US', {
          timeZone: this.options.time?.zone,
          ...this._formatter_options(this._formatter_data())
        });

        const parts = formatter.formatToParts(new Date());
        return this._formatter_formatFromParts(parts);
      }
    };
  }

  /**
   * Converts an array of arguments to a formatted string.
   * @param args - Arguments to stringify.
   * @returns The stringified arguments.
   * @private
   */
  private _string_format_stringifyArgs(args: unknown[]) {
    return args
      .map((arg) => {
        if (typeof arg === 'string') return arg;

        if (typeof arg === 'bigint') return arg.toString() + 'n';

        if (arg instanceof Error)
          return (
            `${arg.name}: ${arg.message}` +
            (arg.stack ? `\n${arg.stack.split('\n').slice(1).join('\n')}` : '')
          );

        if (Array.isArray(arg)) {
          if (arg.every((item) => typeof item === 'string' || typeof item === 'number')) {
            return arg.join(' ');
          }

          try {
            return JSON.stringify(arg, (_, value) =>
              typeof value === 'bigint' ? value.toString() + 'n' : value
            )
              .replace(/:/g, ': ')
              .replace(/,/g, ', ');
          } catch {
            return '[Unserializable Array]';
          }
        }

        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, (_, value) =>
              typeof value === 'bigint' ? value.toString() + 'n' : value
            );
          } catch {
            return '[Unserializable Object]';
          }
        }

        return String(arg);
      })
      .join(' ');
  }

  /**
   * Formats date parts into a string based on the configured format.
   * @param {Intl.DateTimeFormat} parts - Date parts from Intl.DateTimeFormat.
   * @returns {string} The formatted date string.
   * @private
   */
  private _formatter_formatFromParts(parts: Intl.DateTimeFormatPart[]) {
    const map = Object.fromEntries(
      parts.filter((p) => p.type !== 'literal').map((p) => [p.type, p.value])
    );

    return (this.options.time?.format ?? '').replace(
      /Y{2,4}|M{1,2}|D{1,2}|H{1,2}|m{1,2}|s{1,2}/g,
      (token) => {
        switch (token) {
          case 'YYYY':
            return String(new Date().getFullYear());
          case 'YY':
            return String(new Date().getFullYear()).slice(-2);
          case 'MM':
            return map.month?.padStart(2, '0') ?? '';
          case 'M':
            return String(+map.month);
          case 'DD':
            return map.day?.padStart(2, '0') ?? '';
          case 'D':
            return String(+map.day);
          case 'HH':
            return map.hour?.padStart(2, '0') ?? '';
          case 'H':
            return String(+map.hour);
          case 'mm':
            return map.minute?.padStart(2, '0') ?? '';
          case 'm':
            return String(+map.minute);
          case 'ss':
            return map.second?.padStart(2, '0') ?? '';
          case 's':
            return String(+map.second);
          default:
            return token;
        }
      }
    );
  }

  /**
   * Extracts formatting data from the configured time format.
   * @returns An object mapping format tokens to their styles.
   * @private
   */
  private _formatter_data() {
    const result: Partial<Record<FormatToken, FormatStyle>> = {};
    const matches = (this.options.time?.format ?? '').match(/([A-Za-z])\1*/g);
    if (!matches) return result;

    for (const part of matches) {
      const char = part[0] as FormatToken;
      const length = part.length;

      const current = result[char];
      const style: FormatStyle = length > 1 ? '2-digit' : 'numeric';

      if (!current || style === '2-digit') {
        result[char] = style;
      }
    }

    return result;
  }

  /**
   * Converts format data into Intl.DateTimeFormatOptions.
   * @param format - Format data mapping tokens to styles.
   * @returns Intl.DateTimeFormatOptions for formatting dates.
   * @private
   */
  private _formatter_options(format: Partial<Record<FormatToken, FormatStyle>>) {
    const result: Intl.DateTimeFormatOptions = {};

    const keys: (keyof Intl.DateTimeFormatOptions)[] = [
      'year',
      'month',
      'day',
      'hour',
      'minute',
      'second'
    ];

    const map: Record<string, keyof typeof format> = {
      year: 'Y',
      month: 'M',
      day: 'D',
      hour: 'H',
      minute: 'm',
      second: 's'
    };

    for (const key of keys) {
      const token = map[key];
      if (format[token]) result[key] = format[token] as never;
    }

    return result;
  }
}