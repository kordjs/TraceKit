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
- **Colorized output**
- **Timezone support**
- **Timestamp and log level display**
- **ESM & CJS** support

---

## Installation

```sh
npm install @kordjs/logger
```

### Installing a Specific Version

```sh
npm install @kordjs/logger@version

e.g:
npm install @kordjs/logger/@2.1.2
```

---

## Usage

```ts
import { Logger, TimeFormats } from '@kordjs/logger';
import { doOperation } from '@lib/operation';

const logger = new Logger({
  time: {
    zone: "Asia/Tokyo",
    format: TimeFormats.Compact
  }

  display: {
    timestamp: true,
    level: true,
    styling: true,
    icons: true
  }
});

logger.styled.info('Hello from KordJS!');

function main() {
  try {
    logger.styled.debug('Loading env variables.');
    process.loadEnvFile('.env');

    const operation = doOperation();

    logger.styled.success(`Completed operation! ${operation.result}`);
  } catch (error) {
    logger.styled.error('main(): Error', error);
  }
}
```

---

## API

`interface LoggerOptions {}`

- `options.dispay`
  - [DisplayOptions](https://github.com/kordjs/logger/blob/49b0c3e52326eabc400d162d72d2c8d11b68a91a/src/lib/Logger.ts#L30)
  - `display.timezone`
    - _Wether to display the time_
    - Type: `Boolean`
    - Default: `true`
  - `display.level`
    - _Wether to display the level_
    - Type: `Boolean`
    - Default; `true`
  - `display.styling`
    - _Wether to use_ [`StyledLogger`](https://github.com/kordjs/logger/blob/49b0c3e52326eabc400d162d72d2c8d11b68a91a/src/lib/StyledLogger.ts#L11)
    - `Boolean`
    - Default: `true`
- `options.transport` (experimental)
  - [TransportOptions](https://github.com/kordjs/logger/blob/49b0c3e52326eabc400d162d72d2c8d11b68a91a/src/lib/Logger.ts#L58)
  - `transport.enabled`
    - _Enable or disable transport_
    - Type: `Boolean`
    - Default: `false`
  - `transport.file`
    - _The file to transport logs to_
    - Type: `String`
    - Default: `undefined`
- `options.time`
  - [TimeOptions](https://github.com/kordjs/logger/blob/49b0c3e52326eabc400d162d72d2c8d11b68a91a/src/lib/Logger.ts#L45)
  - `time.zone`
    - _Adjust the timezone_
    - Type: [`TimezoneKey`](docs/typedoc/types/TimezoneKey.html)
  - `time.format`
    - _Format the timezone_
    - Type: [`TimeFormats`](docs/typedoc/enums/TimeFormats.html)

---

## License

[ISC](./LICENSE) ©️ kordjs
