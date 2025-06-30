import { colors } from '@kordjs/utils';
import { LoggerOptions } from './Logger';
import { ErrorCodes, KordJSError } from '../errors';

export class StyledLogger {
  private options: LoggerOptions;

  public constructor(options: LoggerOptions) {
    this.options = options;
    if (!options.display?.styling) throw new KordJSError(ErrorCodes.DisabledStyling);
  }

  public info(...args: unknown[]) {
    let placeholder = '{timestamp}{level}{args}';

    if (!this.options.display?.level) placeholder = placeholder.replace('{level}', '');
    if (!this.options.display?.timestamp) placeholder = placeholder.replace('{timestamp}', '');

    const content = placeholder
      .replace('{timestamp}', `${this._date('Asia/Tokyo')} `)
      .replace('{level}', 'INFO ')
      .replace('{args}', args.join(' '));

    console.info(content);
  }

  private _date(_tz: string) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: _tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const parts = formatter.formatToParts(new Date());
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const date = new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  }
}
