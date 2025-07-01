import { LoggerOptions } from './lib/Logger';
import { TimezoneKey } from './tz-data/zones';

export const DefaultOptions: LoggerOptions = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimezoneKey,
  display: {
    timestamp: true,
    level: true,
    styling: true
  }
};
