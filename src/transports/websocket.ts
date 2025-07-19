import { Transport, LogEntry } from '../types';
import { HTTPTransport } from './http';

/**
 * WebSocket Transport with reconnection logic, HTTP fallback, and authentication
 */
export class WebSocketTransport implements Transport {
        private baseUrl: string;
        private url: string;
        private ws: WebSocket | null = null;
        private reconnectDelay: number;
        private maxReconnectAttempts: number;
        private reconnectAttempts: number = 0;
        private httpFallback: HTTPTransport | null = null;
        private fallbackToHttp: boolean;
        private connectionPromise: Promise<boolean> | null = null;
        private authToken?: string;

        constructor(
                url: string,
                reconnectDelay: number = 5000,
                maxReconnectAttempts: number = 5,
                httpFallbackUrl?: string,
                fallbackToHttp: boolean = true,
                authToken?: string
        ) {
                this.baseUrl = url;
                this.authToken = authToken;
                this.reconnectDelay = reconnectDelay;
                this.maxReconnectAttempts = maxReconnectAttempts;
                this.fallbackToHttp = fallbackToHttp;

                // Construct WebSocket URL with token if provided
                if (authToken) {
                        const separator = url.includes('?') ? '&' : '?';
                        this.url = `${url}${separator}token=${encodeURIComponent(authToken)}`;
                } else {
                        this.url = url;
                }

                if (httpFallbackUrl && fallbackToHttp) {
                        this.httpFallback = new HTTPTransport(httpFallbackUrl, 5000, 3, authToken);
                }
        }

        async send(entry: LogEntry): Promise<boolean> {
                // Try WebSocket first
                if (await this.ensureConnection()) {
                        try {
                                this.ws!.send(JSON.stringify(entry));
                                return true;
                        } catch (error) {
                                console.error('WebSocket send failed:', error);
                                this.handleDisconnection();
                        }
                }

                // Fall back to HTTP if WebSocket fails
                if (this.httpFallback) {
                        console.log('Falling back to HTTP transport');
                        return await this.httpFallback.send(entry);
                }

                return false;
        }

        async ensureConnection(): Promise<boolean> {
                if (this.isConnected()) {
                        return true;
                }

                if (this.connectionPromise) {
                        return await this.connectionPromise;
                }

                this.connectionPromise = this.connect();
                const result = await this.connectionPromise;
                this.connectionPromise = null;
                return result;
        }

        private async connect(): Promise<boolean> {
                return new Promise((resolve) => {
                        try {
                                this.ws = new WebSocket(this.url);

                                const timeout = setTimeout(() => {
                                        if (this.ws) {
                                                this.ws.close();
                                                this.ws = null;
                                        }
                                        console.error('WebSocket connection timeout');
                                        resolve(false);
                                }, 10000); // 10 second connection timeout

                                this.ws.onopen = () => {
                                        clearTimeout(timeout);
                                        this.reconnectAttempts = 0;
                                        console.log('WebSocket connected');
                                        resolve(true);
                                };

                                this.ws.onerror = (error) => {
                                        clearTimeout(timeout);
                                        console.error('WebSocket connection error:', error);
                                        this.ws = null;
                                        resolve(false);
                                };

                                this.ws.onclose = (event) => {
                                        clearTimeout(timeout);
                                        console.log(
                                                `WebSocket connection closed: ${event.code} ${event.reason}`
                                        );

                                        // Check for authentication errors
                                        if (event.code === 1008 || event.code === 4001) {
                                                console.error(
                                                        'WebSocket authentication failed - check your auth token'
                                                );
                                                resolve(false);
                                                return;
                                        }

                                        this.handleDisconnection();
                                        resolve(false);
                                };

                                this.ws.onmessage = (event) => {
                                        // Handle any response messages if needed
                                        console.log('WebSocket message received:', event.data);
                                };
                        } catch (error) {
                                console.error('Failed to create WebSocket:', error);
                                resolve(false);
                        }
                });
        }

        private handleDisconnection(): void {
                this.ws = null;

                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

                        console.log(
                                `Reconnecting WebSocket in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
                        );

                        setTimeout(() => {
                                this.ensureConnection();
                        }, delay);
                } else {
                        console.warn('Max WebSocket reconnection attempts reached');
                }
        }

        isConnected(): boolean {
                return this.ws?.readyState === WebSocket.OPEN;
        }

        async close(): Promise<void> {
                if (this.ws) {
                        this.ws.close();
                        this.ws = null;
                }
                this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
        }
}
