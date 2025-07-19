/**
 * Authentication examples for TraceKit
 */

const { createLogger } = require('../dist/index.js')

console.log('🔐 TraceKit Authentication Examples\n')

// 1. HTTP Transport with Bearer Token
console.log('1️⃣ HTTP Transport with Authentication:')
const httpLogger = createLogger({
  namespace: 'SecureHTTP',
  enableRemote: true,
  transportType: 'http',
  remoteUrl: 'https://logsify.onrender.com/api/logs',
  authToken: 'your-secret-token-123',
  retryAttempts: 2
})

httpLogger.info('Authenticated HTTP message')
httpLogger.error('Authenticated error message', {
  metadata: { 
    userId: 'secure-user-456',
    action: 'login-attempt'
  }
})

// 2. WebSocket Transport with Token Query Parameter
console.log('\n2️⃣ WebSocket Transport with Authentication:')
const wsLogger = createLogger({
  namespace: 'SecureWS',
  enableRemote: true,
  transportType: 'websocket',
  remoteUrl: 'wss://logs.example.com/ws',
  authToken: 'ws-token-789',
  fallbackToHttp: true,
  wsMaxReconnectAttempts: 3
})

wsLogger.warn('WebSocket authenticated message')
wsLogger.fatal('Critical authenticated message', {
  metadata: { 
    server: 'prod-01',
    severity: 'high'
  }
})

// 3. Runtime authentication updates
console.log('\n3️⃣ Runtime Authentication Updates:')
const dynamicLogger = createLogger({
  namespace: 'Dynamic',
  enableRemote: true,
  transportType: 'http',
  remoteUrl: 'https://api.example.com/logs'
})

// Initially no authentication
dynamicLogger.info('Message without authentication')

// Add authentication token at runtime
dynamicLogger.configure({ 
  authToken: 'runtime-token-abc' 
})

dynamicLogger.info('Message with runtime authentication')

// Update token again
dynamicLogger.configure({ 
  authToken: 'updated-token-def' 
})

dynamicLogger.warn('Message with updated token')

console.log('\n📝 Authentication Details:')
console.log('✅ HTTP: Uses Authorization Bearer header')
console.log('✅ WebSocket: Uses ?token=xxx query parameter')
console.log('✅ Fallback: HTTP fallback preserves authentication')
console.log('✅ Runtime: Tokens can be updated dynamically')
console.log('✅ Error Handling: 401/403 responses properly handled')

console.log('\n🔒 Security Notes:')
console.log('• Store tokens securely (environment variables)')
console.log('• Use HTTPS/WSS in production')
console.log('• Implement token rotation for long-running apps')
console.log('• Monitor authentication failures in logs')

// Cleanup
setTimeout(async () => {
  await httpLogger.close()
  await wsLogger.close()
  await dynamicLogger.close()
}, 100)