'use strict';

import { CC } from './CC';
import { ErrorCodes } from './Codes';

export const Messages = {
  // Generic Errors.
  [ErrorCodes.UnknownProperty]: (prop: unknown) =>
    `Unknown property: ${CC.red}${CC.bold}${prop}${CC.reset}`,
  [ErrorCodes.NoTypeMatch]: (expected: string, got: string) =>
    `Expected a ${CC.bold}${CC.green}${expected}${CC.reset} but got ${CC.red}${CC.bold}${got}${CC.reset}`,
  [ErrorCodes.EmptyString]: `Empty string. Expected string to be ${CC.bold}${CC.underline}>= 1${CC.reset}`,

  // Focused Errors.
  [ErrorCodes.DisabledStyling]: `${CC.yellow}.styled${CC.reset} can't be used ${CC.red}when${CC.reset} LoggerOptions provided has ${CC.bold}${CC.dim}${JSON.stringify({ display: { styling: false } })}${CC.reset} | Set ${CC.green}styling${CC.reset} to ${CC.green}true${CC.reset}`
};
