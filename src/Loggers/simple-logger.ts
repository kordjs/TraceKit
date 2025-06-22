import { SimpleLoggerOptions, RecursiveObject } from "../types";
import Colors from "ansi-colors";

export class SimpleLogger {
  private options: SimpleLoggerOptions;

  /**
   * Pass in options to customize the output.
   * @param {SimpleLoggerOptions} options
   * @example 
   * const logger = new SimpleLogger({ timestamp: false });
   * logger.info("Nice!");
   */
  public constructor(options?: SimpleLoggerOptions) {
    if (options) {
      this.options = options;
    } else {
      this.options = {
        colorize: true,
        timestamp: true
      }
    }
  }

  /**
   * Log messages to the console for debugging purposes.
   * @param {string} message
   * @param {unknown[]} args
   */
  public debug(message: string, ...args: unknown[]): this {
    if (args.length === 0) {
      console.debug(
        this.check("color") ? Colors.bold.underline.blue("DEBUG") : "DEBUG",
        this.check("color") ? Colors.bold.gray(message) : message
      )

      return this;
    }

    console.debug(
      this.check("color") ? Colors.bold.underline.blue("DEBUG") : "DEBUG",
      this.check("color") ? Colors.bold.gray(message) : message,
      `\n${this.check("color") ? Colors.redBright(">>>") : ">>>"}`,
      ...args
    );

    return this;
  }

  /**
   * Logs a pretty message to the console.
   * @param {string} message
   * @param {RecursiveObject} optionals
   * @returns {SimpleLogger}
   */
  public info(message: string, optionals?: RecursiveObject): this {
    if (!optionals) {
      console.info(
        this.check("color") ? Colors.bold.underline.green("INFO") : "INFO",
        this.check("color") ? Colors.bold.gray(message) : message,
      );

      return this;
    }

    const optionalOptions = {};

    for (const [key, value] of Object.entries(optionals)) {
      Object.assign(optionalOptions, { [key]: value });
    }

    console.info(
      this.check("color") ? Colors.bold.underline.green("INFO") : "INFO",
      this.check("color") ? Colors.bold.gray(message) : message,
      "\n  ",
      optionalOptions,
    );

    return this;
  }

  public warn(message: string, ...args: unknown[]): this {
    if (args.length === 0) {
      console.warn(
        this.check("color") ? Colors.bold.underline.yellow("WARN") : "WARN",
        this.check("color") ? Colors.bold.yellow(message) : message
      );

      return this;
    }

    console.warn(
      this.check("color") ? Colors.bold.underline.yellow("WARN") : "WARN",
      this.check("color") ? Colors.bold.yellow(message) : message,
      `\n${this.check("color") ? Colors.yellowBright(">>") : ">>"}`,
      ...args
    );

    return this;
  }

  private check(option: string) {
    switch (option) {
      case "color":
        return this.options.colorize;
      case "time":
        return this.options.timestamp;
      default:
        return this.options;
    }
  }
}
