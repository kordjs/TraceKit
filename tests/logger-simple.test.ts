// Test logging functions 
// With different levels and logger options.

import { SimpleLogger } from "../dist";
import { expect, test, vi } from "vitest";

test("SimpleLogger should log info messages with default options", () => {
  const logger = new SimpleLogger();
  const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  logger.info(["This is an info message"]);

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("INFO: This is an info message")
  );

  consoleSpy.mockRestore();
});

test("SimpleLogger should log info messages with custom options", () => {
  const logger = new SimpleLogger({ timestamp: false, colorize: false });
  const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  logger.info(["This is another info message"]);

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("INFO: This is another info message")
  );

  consoleSpy.mockRestore();
});

test("SimpleLogger should log info messages with timestamp w/o color", () => {
  const logger = new SimpleLogger({ timestamp: true, colorize: false });
  const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  logger.info(["This is an info message with timestamp"]);

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("INFO: This is an info message with timestamp")
  );

  consoleSpy.mockRestore();
});