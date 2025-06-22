import { LoggerOptions } from "../types";
import { SimpleLogger } from "./simple-logger";

export class Logger {
    private options: LoggerOptions;

    public constructor(options?: LoggerOptions) {
        if (options) {
            this.options = options;
        } else {
            this.options = {
                colorize: true,
                timestamp: true
            }
        }
    }

    get simple(): SimpleLogger {
        return new SimpleLogger(this.options);
    }
}