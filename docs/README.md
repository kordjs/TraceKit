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
import { Logger } from '@kordjs/logger';
import { doOperation } from '@lib/operation';

const logger = new Logger({
  timezone: 'Asia/Tokyo',
  display: {
    timestamp: true,
    level: true,
    styling: true
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
  - [DisplayOptions](typedoc/interfaces/DisplayOptions.html)
  - `display.timezone`
    - _Wether to display the time_
    - Type: `Boolean`
    - Default: `true`
  - `display.level`
    - _Wether to display the level_
    - Type: `Boolean`
    - Default; `true`
  - `display.styling`
    - _Wether to use_ [`StyledLogger`](/typedoc/classes/StyledLogger.html)
    - `Boolean`
    - Default: `true`
- `options.transport` (experimental)
  - [TransportOptions](/typedoc/interfaces/TransportOptions.html)
  - `transport.enabled`
    - _Enable or disable transport_
    - Type: `Boolean`
    - Default: `false`
  - `transport.file`
    - _The file to transport logs to_
    - Type: `String`
    - Default: `undefined`
- `options.time`
  - [TimeOptions](/typedoc/interfaces/TimeOptions.html)
  - `time.zone`
    - _Adjust the timezone_
    - Type: [`TimezoneKey`](/typedoc/types/TimezoneKey.html)
  - `time.format`
    - _Format the timezone_
    - Type: [`TimeFormats`](/typedoc/enums/TimeFormats.html)

---

## License

[ISC](./LICENSE) ©️ kordjs
