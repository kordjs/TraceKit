import { 
  LogLevel, 
  LoggerConfig, 
  LogCallConfig, 
  InternalLogEntry, 
  Transport,
  TransportType 
} from '../types'
import { formatTimestamp, formatSimpleMessage } from '../utils/formatter'
import { BoxLogger } from '../utils/box'
import { Colors, getLevelColor } from '../utils/colors'
import { createTransport } from '../transports'

/**
 * Default configuration for the logger
 */
const DEFAULT_CONFIG: Required<LoggerConfig> = {
  namespace: 'System',
  enableTimestamp: true,
  enableColors: true,
  defaultBoxed: false,
  defaultBorderStyle: 'rounded',
  defaultPadding: 1,
  enableRemote: false,
  remoteUrl: 'https://logsify.onrender.com/api/logs',
  transportType: 'http',
  remoteTimeout: 5000,
  retryAttempts: 3,
  authToken: '',
  wsReconnectDelay: 5000,
  wsMaxReconnectAttempts: 5,
  fallbackToHttp: true,
  minLevel: 'debug',
  remoteMinLevel: 'info'
}

/**
 * Log level priorities for filtering
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  trace: 1,
  info: 2,
  success: 3,
  warn: 4,
  error: 5,
  fatal: 6
}

/**
 * Remote-enabled log levels
 */
const REMOTE_LEVELS: Set<LogLevel> = new Set(['info', 'warn', 'error', 'fatal'])

/**
 * Main Logger class
 */
export class Logger {
  private config: Required<LoggerConfig>
  private transport: Transport | null = null
  private boxLogger: BoxLogger

  constructor(config: LoggerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.boxLogger = new BoxLogger(
      this.config.defaultBorderStyle,
      this.config.defaultPadding,
      this.config.enableColors
    )
    
    if (this.config.enableRemote) {
      this.initializeTransport()
    }
  }

  /**
   * Update configuration at runtime
   */
  configure(newConfig: Partial<LoggerConfig>): void {
    const oldRemoteEnabled = this.config.enableRemote
    const oldTransportType = this.config.transportType
    const oldRemoteUrl = this.config.remoteUrl
    const oldAuthToken = this.config.authToken

    this.config = { ...this.config, ...newConfig }

    // Reinitialize transport if remote settings changed
    const remoteSettingsChanged = 
      this.config.enableRemote !== oldRemoteEnabled ||
      this.config.transportType !== oldTransportType ||
      this.config.remoteUrl !== oldRemoteUrl ||
      this.config.authToken !== oldAuthToken

    if (remoteSettingsChanged) {
      this.closeTransport()
      if (this.config.enableRemote) {
        this.initializeTransport()
      }
    }

    // Update box logger
    this.boxLogger = new BoxLogger(
      this.config.defaultBorderStyle,
      this.config.defaultPadding,
      this.config.enableColors
    )
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<LoggerConfig> {
    return { ...this.config }
  }

  // Log level methods
  debug(message: string, config?: LogCallConfig): void {
    this.log('debug', message, config)
  }

  trace(message: string, config?: LogCallConfig): void {
    this.log('trace', message, config)
  }

  info(message: string, config?: LogCallConfig): void {
    this.log('info', message, config)
  }

  success(message: string, config?: LogCallConfig): void {
    this.log('success', message, config)
  }

  warn(message: string, config?: LogCallConfig): void {
    this.log('warn', message, config)
  }

  error(message: string, config?: LogCallConfig): void {
    this.log('error', message, config)
  }

  fatal(message: string, config?: LogCallConfig): void {
    this.log('fatal', message, config)
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, callConfig?: LogCallConfig): void {
    // Check if log level meets minimum threshold
    if (!this.shouldLog(level)) {
      return
    }

    const timestamp = formatTimestamp()
    const entry: InternalLogEntry = {
      level,
      namespace: this.config.namespace,
      message,
      timestamp,
      metadata: (callConfig as any)?.metadata
    }

    // Format and output to terminal
    this.outputToTerminal(entry, callConfig)

    // Send to remote if enabled and level qualifies
    if (this.shouldLogRemote(level, callConfig)) {
      this.sendToRemote(entry).catch(error => {
        console.error('Failed to send log to remote:', error)
      })
    }
  }

  /**
   * Check if log should be output based on minimum level
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.config.minLevel]
  }

  /**
   * Check if log should be sent to remote
   */
  private shouldLogRemote(level: LogLevel, callConfig?: LogCallConfig): boolean {
    if (!this.config.enableRemote || callConfig?.skipRemote) {
      return false
    }

    if (!REMOTE_LEVELS.has(level)) {
      return false
    }

    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.config.remoteMinLevel]
  }

  /**
   * Output formatted log to terminal
   */
  private outputToTerminal(entry: InternalLogEntry, callConfig?: LogCallConfig): void {
    const shouldBox = callConfig?.boxed ?? this.config.defaultBoxed
    
    if (shouldBox) {
      this.outputBoxedLog(entry, callConfig)
    } else {
      this.outputSimpleLog(entry)
    }
  }

  /**
   * Output simple formatted log
   */
  private outputSimpleLog(entry: InternalLogEntry): void {
    const formatted = formatSimpleMessage(entry, {
      enableTimestamp: this.config.enableTimestamp,
      enableColors: this.config.enableColors
    })
    
    console.log(formatted)
  }

  /**
   * Output boxed log
   */
  private outputBoxedLog(entry: InternalLogEntry, callConfig?: LogCallConfig): void {
    const borderStyle = callConfig?.borderStyle ?? this.config.defaultBorderStyle
    const padding = callConfig?.padding ?? this.config.defaultPadding
    const title = callConfig?.title
    const centered = callConfig?.centered ?? false
    const color = callConfig?.color ?? getLevelColor(entry.level)

    const boxLogger = new BoxLogger(borderStyle, padding, this.config.enableColors)
    
    // Prepare content
    const contentLines: string[] = []
    
    if (this.config.enableTimestamp) {
      contentLines.push(`🕐 ${entry.timestamp}`)
    }
    
    contentLines.push(`📝 ${entry.message}`)
    
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      contentLines.push('')
      contentLines.push('📋 Metadata:')
      contentLines.push(JSON.stringify(entry.metadata, null, 2))
    }

    const boxed = boxLogger.createBox(contentLines, {
      title: title || `${entry.level.toUpperCase()} - ${entry.namespace}`,
      color,
      centered,
      minWidth: 50
    })

    console.log(boxed)
  }

  /**
   * Send log entry to remote transport
   */
  private async sendToRemote(entry: InternalLogEntry): Promise<void> {
    if (!this.transport) {
      return
    }

    const remoteEntry = {
      level: entry.level,
      namespace: entry.namespace,
      message: entry.message,
      metadata: entry.metadata,
      timestamp: entry.timestamp
    }

    await this.transport.send(remoteEntry)
  }

  /**
   * Initialize remote transport
   */
  private initializeTransport(): void {
    try {
      this.transport = createTransport(this.config.transportType, this.config.remoteUrl, {
        timeout: this.config.remoteTimeout,
        retryAttempts: this.config.retryAttempts,
        reconnectDelay: this.config.wsReconnectDelay,
        maxReconnectAttempts: this.config.wsMaxReconnectAttempts,
        fallbackToHttp: this.config.fallbackToHttp
      })
    } catch (error) {
      console.error('Failed to initialize transport:', error)
    }
  }

  /**
   * Close transport connection
   */
  private async closeTransport(): Promise<void> {
    if (this.transport?.close) {
      await this.transport.close()
    }
    this.transport = null
  }

  /**
   * Clean up resources
   */
  async close(): Promise<void> {
    await this.closeTransport()
  }

  /**
   * Get transport status
   */
  isConnected(): boolean {
    return this.transport?.isConnected?.() ?? false
  }
}