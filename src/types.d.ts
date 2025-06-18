import * as ansiColors from "ansi-colors";

export enum LogLevels {
  "debug",
  "info",
  "warn",
  "error",
}

export interface LevelOptions {
  debug: {
    /**
     * Use a custom color at > [DEBUG] <
     * @default "White"
     */
    tagColor: ansiColors.ansiColors;
  };

  info: {
    /**
     * Use a custom color at > [INFO] <
     * @default "Green"
     */
    tagColor: ansiColors;
  };

  warn: {
    /**
     * Use a custom color at > [WARN] <
     * @default "Yellow"
     */
    tagColor: ansiColors;
  };

  error: {
    /**
     * Use a custom color at > [ERROR] <
     * @default "Red"
     */
    tagColor?: ansiColors;

    /**
     * Weather to save the error to a file.
     * @default false
     */
    saveError?: boolean;

    /**
     * The path to save error content to.
     * Expects a path to a folder, not a file.
     * On error, the program will create a file containing the information.
     *
     * @default "./errors/*"
     * @example
     *   { saveError: true, saveLocation: "./app/exceptions/*" }
     */
    saveLocation?: string;
  };
}

export interface SimpleLoggerOptions {
  /**
   * Weather to use colors on log-content.
   * @default false
   */
  coloring?: boolean;

  /**
   * Weather to display a date-time before the log-content.
   * @default true
   */
  displayDate?: boolean;

  /**
   * Weather to display a level after the date and before the log-content.
   * @default true
   */
  displayLevel?: boolean;

  /**
   * Configure each level.
   */
  levels?: LevelOptions;
}
