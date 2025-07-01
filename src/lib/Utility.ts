import { LoggerOptions } from './Logger';

type FormatToken = 'Y' | 'M' | 'D' | 'H' | 'm' | 's';
type FormatStyle = '2-digit' | 'numeric';

export class Utility {
  private options: LoggerOptions;

  public constructor(options: LoggerOptions) {
    this.options = options;
  }

  public get string() {
    return {
      stringifyArguments: (...args: unknown[]) => this._string_format_stringifyArgs(args)
    };
  }

  public get date() {
    return {
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
