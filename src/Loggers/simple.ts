import type { SimpleLoggerOptions } from "../types.d";
import colors from "ansi-colors";

export class SimpleLogger {
  protected options: SimpleLoggerOptions;

  public constructor(options?: SimpleLoggerOptions) {
    if (options) this.options = options;
    else
      this.options = {
        coloring: false,
        displayDate: true,
        displayLevel: true,
        levels: {
          debug: { tagColor: colors.white },
          info: { tagColor: colors.green },
          warn: { tagColor: colors.yellow },
          error: {
            tagColor: colors.red,
            saveError: false,
            saveLocation: "./errors/*",
          },
        },
      };
  }

  public debug(...content: unknown[]) {
    console.debug(
      //@ts-expect-error Type Error
      colors[this.options.levels.debug.tagColor]("DEBUG"),
      ...content,
    );
  }
}
