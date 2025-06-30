'use strict';

import { CC } from './CC';
import { ErrorCodes } from './Codes';
import { Messages } from './Messages';

function makeKordJSError(BaseClass: new (...args: string[]) => Error) {
  return class KordJSError extends BaseClass {
    public code: string;
    constructor(code: string, ...args: string[]) {
      super(message(code, args));
      this.code = code;
      Error.captureStackTrace(this, KordJSError);
    }

    get name() {
      return `${CC.bold}${CC.yellow}${super.name} - [${this.code}]${CC.reset}`;
    }
  };
}

function message(code: string, args: Array<string>) {
  if (!(code in ErrorCodes)) throw new Error('Error code must be a valid KordJSErrorCodes');
  const msg = Messages[code];
  if (!msg) throw new Error(`No message associated with error code: ${code}.`);
  //@ts-expect-error Rest Param Error.
  if (typeof msg === 'function') return msg(...args);
  if (!args?.length) return msg;
  args.unshift(msg);
  return String(...args);
}

export const KordJSTypeError = makeKordJSError(TypeError);
export const KordJSRangeError = makeKordJSError(RangeError);
export const KordJSError = makeKordJSError(Error);
