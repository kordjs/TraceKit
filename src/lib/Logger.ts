import { ErrorCodes } from '@kordjs/utils';
import { DefaultOptions } from '../defaultOptions';
import { StyledLogger } from './StyledLogger';
import { KordJSTypeError } from '../errors';
import { TimezoneKey } from '../tz-data/zones';

export enum TimeFormats {
  Compact = 'D/M/YY',
  Date = 'DD/MM/YYYY'
}

interface DisplayOptions {
  timestamp?: boolean;
  level?: boolean;
  styling?: boolean;
}

interface TimeOptions {
  zone?: TimezoneKey;
  format?: TimeFormats;
}

export interface LoggerOptions {
  time?: TimeOptions;
  display?: DisplayOptions;
}

export class Logger {
  private options: LoggerOptions;

  public constructor(options?: LoggerOptions) {
    if (options && typeof options !== 'object')
      throw new KordJSTypeError(ErrorCodes.NoTypeMatch, 'typeof LoggerOptions: {}', typeof options);

    this.options = {
      ...DefaultOptions,
      ...options
    };
  }

  public get styled() {
    return new StyledLogger(this.options);
  }
}
