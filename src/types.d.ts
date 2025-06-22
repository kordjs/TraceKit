export interface SimpleLoggerOptions {
  /**
   * Whether to include a timestamp in the log messages.
   * @default true
   */
  timestamp?: boolean;

  /**
   * Whether to colorize the output in the console.
   * @default true
   */
  colorize?: boolean;
}

export interface AdvancedLoggerOptions {
  path?: string
}

export type LoggerOptions = SimpleLoggerOptions & AdvancedLoggerOptions;

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export interface RecursiveObject extends Record<string, JSONValue> {}