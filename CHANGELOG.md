## [2.0.3] - 2025-06-22

### Added
- Added `Logger` class for advanced logging configuration and composition.
- Added `SimpleLogger` class with methods: `info`, `debug`, and `warn`.
- Support for colorized output using `ansi-colors`.
- Option to include timestamps and toggle colorization via options.
- Type definitions for logger options and recursive objects.
- Example usage and test script in `tests/.node/index.js`.

### Changed
- Project build now uses `tsup` for bundling and type generation.
- Improved modular exports in `src/index.ts`.

### Fixed
- Ensured compatibility with both ESM and CJS formats.
- Cleaned up configuration and improved type safety.

### Removed
- N/A