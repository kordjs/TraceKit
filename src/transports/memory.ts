import { Transport, LogEntry } from '../types'

/**
 * In-memory transport for testing purposes
 */
export class InMemoryTransport implements Transport {
  private logs: LogEntry[] = []
  private shouldFail: boolean = false

  constructor(shouldFail: boolean = false) {
    this.shouldFail = shouldFail
  }

  async send(entry: LogEntry): Promise<boolean> {
    if (this.shouldFail) {
      return false
    }

    this.logs.push({ ...entry })
    return true
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: string): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  /**
   * Get logs filtered by namespace
   */
  getLogsByNamespace(namespace: string): LogEntry[] {
    return this.logs.filter(log => log.namespace === namespace)
  }

  /**
   * Clear all stored logs
   */
  clear(): void {
    this.logs = []
  }

  /**
   * Set whether transport should fail
   */
  setShouldFail(shouldFail: boolean): void {
    this.shouldFail = shouldFail
  }

  /**
   * Get the count of stored logs
   */
  getLogCount(): number {
    return this.logs.length
  }

  isConnected(): boolean {
    return !this.shouldFail
  }
}