/**
 * ANSI color codes for terminal output
 */
export const Colors = {
        // Reset
        reset: '\x1b[0m',

        // Log level colors
        debug: '\x1b[36m', // cyan
        trace: '\x1b[35m', // magenta
        info: '\x1b[34m', // blue
        success: '\x1b[32m', // green
        warn: '\x1b[33m', // yellow
        error: '\x1b[31m', // red
        fatal: '\x1b[91m', // bright red

        // Style modifiers
        bold: '\x1b[1m',
        dim: '\x1b[2m',
        underline: '\x1b[4m',

        // Background colors
        bgRed: '\x1b[41m',
        bgGreen: '\x1b[42m',
        bgYellow: '\x1b[43m',
        bgBlue: '\x1b[44m',

        // Text colors
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        gray: '\x1b[90m'
} as const;

/**
 * Log level icons/prefixes
 */
export const LogIcons = {
        debug: '🐛',
        trace: '🔍',
        info: 'ℹ️',
        success: '✅',
        warn: '⚠️',
        error: '❌',
        fatal: '💀'
} as const;

/**
 * Apply color to text
 */
export function colorize(text: string, color: string, enableColors: boolean = true): string {
        if (!enableColors) return text;
        return `${color}${text}${Colors.reset}`;
}

/**
 * Get color for log level
 */
export function getLevelColor(level: string): string {
        return (Colors as any)[level] || Colors.info;
}
