<div align="center">
  <h1>@kordjs/logger</h1>
  <p>
    <b>Advanced, flexible, and type-safe logger for Node.js projects.</b>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@kordjs/logger">
      <img src="https://img.shields.io/npm/v/@kordjs/logger?style=flat-square" alt="npm version" />
    </a>
    <a href="https://github.com/kordjs/logger/actions/workflows/npm-publish.yml">
      <img src="https://github.com/kordjs/logger/actions/workflows/npm-publish.yml/badge.svg" alt="CI" />
    </a>
    <a href="https://github.com/kordjs/logger/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/kordjs/logger?style=flat-square" alt="license" />
    </a>
  </p>
</div>

---

## Features

- **Type-safe logger** with advanced configuration
- **Colorized output** (with styling toggle)
- **Timezone support** (with type-safe keys)
- **Timestamp and log level display** options
- **ESM & CJS** support
- **Zero dependencies** (except for [@kordjs/utils](https://github.com/kordjs/utils))

---

## Installation

```sh
npm install @kordjs/logger
```

---

## Usage

```ts
import { Logger } from '@kordjs/logger';

const logger = new Logger({
  timezone: 'Asia/Tokyo',
  display: {
    timestamp: true,
    level: true,
    styling: true
  }
});

logger.styled.info('Hello from KordJS Logger!');
```

---

## API

`new Logger(options?: LoggerOptions)`

- `options.timezone`
   - [TimezoneKey](https://github.com)
   - Default: System Timezone
- `options.dispay`
   - [DisplayOptions](https://github.com)
   - `display.timezone`
      - Boolean
      - Default: `true`
   - `display.level`
      - Boolean
      - Default; `true`
   - `display.styling`
      - Boolean
      - Default: `true`

`Logger.styled` returns `StyledLogger`

- `StyledLogger` instance with colorized  output.
     - **Methods:**
         - `.debug(...args: unknown[])`
         - `.warn(...args: unknown[])`

---

## License

[ISC](./LICENSE) ©️ kordjs