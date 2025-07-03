import { colors } from '@kordjs/utils';
import { LoggerOptions } from './Logger';
import { KordJSError } from '../errors';
import { Utility } from './Utility';

export class StyledLogger {
  private options: LoggerOptions;
  private utility: Utility;

  public constructor(options: LoggerOptions) {
    if (!options.display?.styling) throw new KordJSError('STYLED_LOGGER_DISABLED');

    this.options = options;
    this.utility = new Utility(options);
  }

  public info(...args: unknown[]) {
    let placeholder = '{timestamp}{level}{args}';

    if (!this.options.display?.level) placeholder = placeholder.replace('{level}', '');
    if (!this.options.display?.timestamp) placeholder = placeholder.replace('{timestamp}', '');

    const content = placeholder
      .replace('{timestamp}', `${colors.red(this.utility.date.format())} `)
      .replace('{level}', 'INFO ')
      .replace('{args}', this.utility.string.stringifyArguments(...args));

    console.info(content);
  }
}
