'use strict';

/**
 * @typedef {Object} KordJSErrorCodes
 */
const keys = [
  // Generic Errors.
  'UnknownProperty',
  'NoTypeMatch',
  'EmptyString',

  // Focused Errors.
  'DisabledStyling'
];

/**
 * @type {KordJSErrorCodes}
 */
export const ErrorCodes = Object.fromEntries(keys.map((key) => [key, key]));
