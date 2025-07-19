/**
 * Basic usage examples for TraceKit
 */

import { logger, createLogger, info, warn, error, configure } from '../src/index'

console.log('=== TraceKit Basic Usage Examples ===\n')

// 1. Using the default logger
console.log('1. Default logger examples:')
logger.debug('This is a debug message')
logger.info('Application started successfully')
logger.warn('This is a warning message')
logger.error('An error occurred')
logger.success('Operation completed successfully!')

console.log('\n2. Boxed messages:')
logger.info('This is a boxed message', { boxed: true })
logger.error('Critical error occurred', { 
  boxed: true, 
  title: '🚨 CRITICAL ERROR', 
  centered: true 
})

console.log('\n3. Custom styling:')
logger.info('Custom border style', { boxed: true, borderStyle: 'ascii' })

// 2. Using convenience functions
console.log('\n4. Convenience functions:')
info('Using convenience info function')
warn('Using convenience warn function')
error('Using convenience error function')

// 3. Creating custom logger
console.log('\n5. Custom logger instance:')
const customLogger = createLogger({
  namespace: 'MyApp',
  enableTimestamp: true,
  defaultBoxed: false
})

customLogger.info('Message from custom logger')
customLogger.success('Custom logger works!', { boxed: true })

// 4. Configuration updates
console.log('\n6. Configuration updates:')
configure({ namespace: 'UpdatedApp' })
info('Message with updated namespace')

// 5. Remote logging example (disabled by default)
console.log('\n7. Remote logging setup example:')
const remoteLogger = createLogger({
  namespace: 'RemoteApp',
  enableRemote: true,
  transportType: 'http',
  remoteUrl: 'https://logsify.onrender.com/api/logs'
})

remoteLogger.info('This would be sent to remote server if configured')
remoteLogger.error('Remote error log', { 
  metadata: { 
    userId: '123',
    action: 'login'
  }
})

console.log('\n8. Different log levels:')
logger.trace('Trace level message')
logger.debug('Debug level message')
logger.info('Info level message')
logger.success('Success level message')
logger.warn('Warning level message')
logger.error('Error level message')
logger.fatal('Fatal level message')

console.log('\n=== End of Examples ===')

// Cleanup
setTimeout(() => {
  logger.close()
  customLogger.close()
  remoteLogger.close()
}, 100)