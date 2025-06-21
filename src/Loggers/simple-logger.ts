import { SimpleLoggerOptions, RecursiveObject } from "../types";
import Colors from "ansi-colors";

export class SimpleLogger {
  options: SimpleLoggerOptions;

  public constructor(options?: SimpleLoggerOptions) {
    options
      ? (this.options = options)
      : (this.options = {
          colorize: true,
          timestamp: true,
        });
  }

  public info(message: string, optionals?: RecursiveObject | any): this {
    if (!optionals) {
      console.info(
        this.check("color") ? Colors.bold.underline.green("INFO") : "INFO",
        Colors.bold.gray(message)
      );

      return this
    }

    const optionalOptions = {};

    for (const [key, value] of Object.entries(optionals)) {
      Object.assign(optionalOptions, 
        { [key]: value }
      );
    }

    console.info(
      this.check("color") ? Colors.bold.underline.green("INFO") : "INFO",
      Colors.bold.gray(message),
      "\n  ", optionalOptions
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