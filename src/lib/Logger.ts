import { ErrorCodes } from '@kordjs/utils';
import { DefaultOptions } from '../defaultOptions';
import { StyledLogger } from './StyledLogger';
import { KordJSTypeError } from '../errors';
import { TimezoneKey } from '../tz-data/zones';

interface DisplayOptions {
  timestamp: boolean;
  level: boolean;
  styling: boolean;
}

export interface LoggerOptions {
  timezone?: TimezoneKey;
  display?: DisplayOptions;
}

export class Logger {
  private options: LoggerOptions;

  public constructor(options?: LoggerOptions) {
    if (options && typeof options !== 'object')
      throw new KordJSTypeError(ErrorCodes.NoTypeMatch, 'typeof LoggerOptions: {}', typeof options);

    this.options = options ??= DefaultOptions;
  }

  public get styled() {
    return new StyledLogger(this.options);
  }
}
