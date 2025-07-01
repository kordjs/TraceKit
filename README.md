<div align="center">
  <h1>@kordjs/logger</h1>
  <p>
    <b>Advanced, flexible, and type-safe logger for Node.js projects.</b>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@kordjs/logger">
      <img src="https://img.shields.io/npm/v/@kordjs/logger?style=flat-square" alt="npm version" />
    </a>
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

## **Installing Development Versions**

> Installing dev versions (e.g., from the `dev` branch) is risky and not recommended for production use. Dev versions may contain unfinished features, breaking changes, or unstable APIs that could break your application. Always prefer stable releases from npm unless you are actively developing or testing new features.  

**To install a dev version:**  
```sh
npm install kordjs/logger@dev
```
> **Development Version Issues?:** Create a issue, with detailed information on the error/bug.

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