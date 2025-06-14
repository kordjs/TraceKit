
export interface SimpleLoggerOptions {
    /**
     * Weather to use colors on log-content.
     * @default false
     */
    coloring?: boolean;

    /**
     * Weather to display a date-time before the log-content.
     * @default true
     */
    displayDate?: boolean;

    /**
     * Weather to display a level after the date and before the log-content.
     */
    displayLevel?: boolean;
}