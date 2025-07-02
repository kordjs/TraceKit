import { makeKordJSError } from '@kordjs/utils';
import { defaultErrorMessages } from './Properties';

export const KordJSError = makeKordJSError(
  Error as new (...args: unknown[]) => Error,
  'LoggerError',
  {
    ...defaultErrorMessages,

    STYLED_LOGGER_DISABLED: () =>
      'Styled logger is disabled. Enable it to use: { styling: false -> true }'
  }
);

export const KordJSTypeError = makeKordJSError(
  TypeError as new (...args: unknown[]) => TypeError,
  'LoggerTypeError',
  {
    ...defaultErrorMessages
  }
);

export const KordJSRangeError = makeKordJSError(
  RangeError as new (...args: unknown[]) => RangeError,
  'LoggerRangeError',
  {
    ...defaultErrorMessages
  }
);
