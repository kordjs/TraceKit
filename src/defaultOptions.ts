import { LoggerOptions, TimeFormats } from './lib/Logger';
import { TimezoneKey } from './tz-data/zones';

export const DefaultOptions: LoggerOptions = {
  time: {
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimezoneKey,
    format: TimeFormats.Date
  },

  display: {
    timestamp: true,
    level: true,
    styling: true
  }
};
