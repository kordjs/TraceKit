/**
 * ANSI color codes and styling for terminal output
 * 
 * @description Complete collection of ANSI escape codes for terminal styling.
 * Includes colors for log levels, text formatting, and background colors.
 * All codes are raw ANSI escape sequences for zero-dependency operation.
 * 
 * @example
 * ```typescript
 * import { Colors, colorize } from '@kordjs/tracekit';
 * 
 * console.log(colorize('Error message', Colors.red));
 * console.log(`${Colors.bold}Bold text${Colors.reset}`);
 * ```
 */
export const Colors = {
        /** Reset all styling */
        reset: '\x1b[0m',

        // Log level colors
        /** Cyan color for debug messages */
        debug: '\x1b[36m',
        /** Magenta color for trace messages */
        trace: '\x1b[35m',
        /** Blue color for info messages */
        info: '\x1b[34m',
        /** Green color for success messages */
        success: '\x1b[32m',
        /** Yellow color for warning messages */
        warn: '\x1b[33m',
        /** Red color for error messages */
        error: '\x1b[31m',
        /** Bright red color for fatal messages */
        fatal: '\x1b[91m',

        // Style modifiers
        /** Bold text styling */
        bold: '\x1b[1m',
        /** Dimmed text styling */
        dim: '\x1b[2m',
        /** Underlined text styling */
        underline: '\x1b[4m',

        // Background colors
        /** Red background color */
        bgRed: '\x1b[41m',
        /** Green background color */
        bgGreen: '\x1b[42m',
        /** Yellow background color */
        bgYellow: '\x1b[43m',
        /** Blue background color */
        bgBlue: '\x1b[44m',

        // Text colors
        /** Black text color */
        black: '\x1b[30m',
        /** Red text color */
        red: '\x1b[31m',
        /** Green text color */
        green: '\x1b[32m',
        /** Yellow text color */
        yellow: '\x1b[33m',
        /** Blue text color */
        blue: '\x1b[34m',
        /** Magenta text color */
        magenta: '\x1b[35m',
        /** Cyan text color */
        cyan: '\x1b[36m',
        /** White text color */
        white: '\x1b[37m',
        /** Gray text color */
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
