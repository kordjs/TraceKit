import { LogLevel, LogCallConfig, InternalLogEntry } from '../types'
import { Colors, LogIcons, colorize, getLevelColor } from './colors'

/**
 * Format timestamp
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString()
}

/**
 * Get display timestamp (shorter format for terminal)
 */
export function getDisplayTimestamp(date: Date = new Date()): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const ms = date.getMilliseconds().toString().padStart(3, '0')
  return `${hours}:${minutes}:${seconds}.${ms}`
}

/**
 * Format log level display
 */
export function formatLevel(level: LogLevel, enableColors: boolean = true): string {
  const icon = LogIcons[level] || ''
  const levelText = level.toUpperCase().padEnd(7)
  const color = getLevelColor(level)
  
  if (enableColors) {
    return `${icon} ${colorize(levelText, color)}`
  }
  
  return `${icon} ${levelText}`
}

/**
 * Format a simple log message
 */
export function formatSimpleMessage(
  entry: InternalLogEntry, 
  config: { enableTimestamp?: boolean; enableColors?: boolean } = {}
): string {
  const parts: string[] = []
  
  // Add timestamp
  if (config.enableTimestamp) {
    const timestamp = getDisplayTimestamp(new Date(entry.timestamp))
    parts.push(colorize(`[${timestamp}]`, Colors.gray, config.enableColors))
  }
  
  // Add level
  parts.push(formatLevel(entry.level, config.enableColors))
  
  // Add namespace if provided
  if (entry.namespace && entry.namespace !== 'System') {
    parts.push(colorize(`[${entry.namespace}]`, Colors.blue, config.enableColors))
  }
  
  // Add message
  parts.push(entry.message)
  
  // Add metadata if present
  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    const metadataStr = JSON.stringify(entry.metadata, null, 2)
    parts.push(colorize(metadataStr, Colors.dim, config.enableColors))
  }
  
  return parts.join(' ')
}