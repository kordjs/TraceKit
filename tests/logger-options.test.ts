// Test logger options
import { SimpleLogger } from "../dist";
import { expect, test } from "vitest";

test("SimpleLogger with options", () => {
  const options = {
    timestamp: true,
    colorize: true,
  };

  const logger = new SimpleLogger(options);

  expect(logger.options.timestamp).toBe(true);
  expect(logger.options.colorize).toBe(true);
});

test("SimpleLogger with default options", () => {
  const logger = new SimpleLogger();

  expect(logger.options.timestamp).toBe(true);
  expect(logger.options.colorize).toBe(true);
});

test("SimpleLogger with invalid options", () => {
  const invalidOptions = {
    timestamp: "true", // Invalid type
    colorize: "yes",
  };

  expect(() => new SimpleLogger(invalidOptions as any)).toThrow();
});
