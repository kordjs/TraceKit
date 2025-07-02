/**
 * Default error messages are used by every error type
 * Error, TypeError & RangeError
 */
export const defaultErrorMessages = {
  /**
   * Used when types don't match the expected type.
   * @param {string} expected The expected type.
   * @param {string} got The given type.
   */
  TYPE_NO_MATCH: (expected: string, got: string) =>
    `Type ${got} does not satisfy the expected Type ${expected}`
};
