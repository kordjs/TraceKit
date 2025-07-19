import { Transport, LogEntry } from '../types'

/**
 * HTTP Transport for sending logs via fetch API with authentication support
 */
export class HTTPTransport implements Transport {
  private url: string
  private timeout: number
  private retryAttempts: number
  private authToken?: string

  constructor(url: string, timeout: number = 5000, retryAttempts: number = 3, authToken?: string) {
    this.url = url
    this.timeout = timeout
    this.retryAttempts = retryAttempts
    this.authToken = authToken
  }

  async send(entry: LogEntry): Promise<boolean> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }

        // Add Bearer token if provided
        if (this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`
        }

        const response = await fetch(this.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(entry),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          return true
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on certain errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
          break // Network error, don't retry
        }
        
        // Don't retry on authentication errors
        if (error instanceof Error && error.message.includes('401')) {
          console.error('Authentication failed - check your auth token')
          break
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < this.retryAttempts) {
          await this.sleep(Math.pow(2, attempt) * 1000)
        }
      }
    }

    console.error(`HTTPTransport failed after ${this.retryAttempts + 1} attempts:`, lastError)
    return false
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  isConnected(): boolean {
    return true // HTTP is stateless, always "connected"
  }
}