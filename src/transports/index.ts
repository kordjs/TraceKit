export { HTTPTransport } from './http';
export { WebSocketTransport } from './websocket';
export { InMemoryTransport } from './memory';

import { Transport, TransportType } from '../types';
import { HTTPTransport } from './http';
import { WebSocketTransport } from './websocket';
import { InMemoryTransport } from './memory';

/**
 * Factory function to create transport instances
 */
export function createTransport(
        type: TransportType,
        url: string,
        options: {
                timeout?: number;
                retryAttempts?: number;
                reconnectDelay?: number;
                maxReconnectAttempts?: number;
                fallbackToHttp?: boolean;
                authToken?: string;
        } = {}
): Transport {
        switch (type) {
                case 'http':
                        return new HTTPTransport(
                                url,
                                options.timeout,
                                options.retryAttempts,
                                options.authToken
                        );

                case 'websocket':
                        // For WebSocket, if fallback is enabled, use the same URL with HTTP protocol
                        const httpUrl = options.fallbackToHttp
                                ? url.replace('ws://', 'http://').replace('wss://', 'https://')
                                : undefined;
                        return new WebSocketTransport(
                                url,
                                options.reconnectDelay,
                                options.maxReconnectAttempts,
                                httpUrl,
                                options.fallbackToHttp,
                                options.authToken
                        );

                case 'memory':
                        return new InMemoryTransport();

                default:
                        throw new Error(`Unknown transport type: ${type}`);
        }
}
