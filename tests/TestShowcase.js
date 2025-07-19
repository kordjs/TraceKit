/**
 * Final showcase of TraceKit features
 */

const {
        Logger,
        createLogger,
        info,
        warn,
        error,
        success,
        configure,
        Colors,
        BoxLogger,
        InMemoryTransport
} = require('../dist/index.js');

console.log('🎉 TraceKit - Complete Feature Showcase\n');

// 1. Default logger with all levels
console.log('1️⃣ All Log Levels:');
const defaultLogger = new Logger();
defaultLogger.debug('Debug: Finding bugs 🐛');
defaultLogger.trace('Trace: Following the breadcrumbs 🔍');
defaultLogger.info("Info: Here's some information ℹ️");
defaultLogger.success('Success: Task completed! ✅');
defaultLogger.warn('Warning: Be careful here ⚠️');
defaultLogger.error('Error: Something went wrong ❌');
defaultLogger.fatal('Fatal: Critical system failure 💀');

// 2. Boxed output examples
console.log('\n2️⃣ Boxed Output Styles:');
defaultLogger.info('Simple boxed message', { boxed: true });

defaultLogger.warn('Warning with custom title', {
        boxed: true,
        title: '⚠️  IMPORTANT WARNING',
        borderStyle: 'ascii'
});

defaultLogger.success('Centered success message', {
        boxed: true,
        title: '🎊 CELEBRATION',
        centered: true,
        padding: 3
});

// 3. Configuration examples
console.log('\n3️⃣ Configuration Examples:');
const customLogger = createLogger({
        namespace: 'MyApp',
        enableTimestamp: true,
        defaultBoxed: true,
        defaultBorderStyle: 'rounded'
});

customLogger.info('This uses custom configuration');
customLogger.error('Error with metadata', {
        metadata: {
                userId: 'user-123',
                errorCode: 'E001',
                stack: 'api/users.js:42'
        }
});

// 4. Level filtering
console.log('\n4️⃣ Level Filtering (min level: warn):');
const filteredLogger = createLogger({
        namespace: 'Filtered',
        minLevel: 'warn',
        enableRemote: false
});

filteredLogger.debug("This won't appear");
filteredLogger.info("This won't appear either");
filteredLogger.warn('This will appear');
filteredLogger.error('This will appear too');

// 5. Convenience functions
console.log('\n5️⃣ Convenience Functions:');
configure({ namespace: 'QuickLog' });
info('Quick info using convenience function');
warn('Quick warning');
error('Quick error');
success('Quick success!');

// 6. InMemoryTransport testing
console.log('\n6️⃣ InMemoryTransport Testing:');
const testTransport = new InMemoryTransport();

async function testMemoryTransport() {
        await testTransport.send({
                level: 'info',
                namespace: 'Test',
                message: 'Test message 1',
                timestamp: new Date().toISOString()
        });

        await testTransport.send({
                level: 'error',
                namespace: 'Test',
                message: 'Test error message',
                timestamp: new Date().toISOString()
        });

        await testTransport.send({
                level: 'info',
                namespace: 'Other',
                message: 'Other namespace message',
                timestamp: new Date().toISOString()
        });

        console.log(`   Total logs: ${testTransport.getLogCount()}`);
        console.log(`   Info logs: ${testTransport.getLogsByLevel('info').length}`);
        console.log(`   Test namespace logs: ${testTransport.getLogsByNamespace('Test').length}`);
}

testMemoryTransport();

// 7. BoxLogger standalone
console.log('\n7️⃣ Standalone BoxLogger:');
const boxLogger = new BoxLogger('rounded', 2, true);

const multilineBox = boxLogger.createBox(
        [
                'This is a multi-line boxed message',
                'Line 2: More information here',
                'Line 3: Even more details',
                '',
                'Empty lines are supported too!'
        ],
        {
                title: '📋 MULTI-LINE EXAMPLE',
                color: Colors.cyan,
                minWidth: 60
        }
);

console.log(multilineBox);

// 8. Remote configuration example with authentication
console.log('\n8️⃣ Remote Configuration with Authentication:');
const remoteLogger = createLogger({
        namespace: 'RemoteApp',
        enableRemote: true,
        transportType: 'websocket',
        remoteUrl: 'wss://logs.example.com/ws',
        fallbackToHttp: true,
        remoteMinLevel: 'warn',
        authToken: 'secure-token-789'
});

console.log(`   Remote enabled: ${remoteLogger.getConfig().enableRemote}`);
console.log(`   Transport type: ${remoteLogger.getConfig().transportType}`);
console.log(`   Remote min level: ${remoteLogger.getConfig().remoteMinLevel}`);
console.log(`   Auth token configured: ${!!remoteLogger.getConfig().authToken}`);
console.log('   (Remote logs would be sent for warn, error, fatal only)');
console.log('   (WebSocket URL: wss://logs.example.com/ws?token=secure-token-789)');
console.log('   (HTTP fallback uses Bearer token authentication)');

// 9. Color showcase
console.log('\n9️⃣ Color Showcase:');
const noTimestampLogger = createLogger({
        namespace: 'Colors',
        enableTimestamp: false
});

noTimestampLogger.debug('Debug in cyan');
noTimestampLogger.info('Info in blue');
noTimestampLogger.success('Success in green');
noTimestampLogger.warn('Warning in yellow');
noTimestampLogger.error('Error in red');
noTimestampLogger.fatal('Fatal in bright red');

// Final summary
console.log('\n🎯 TraceKit Feature Summary:');
console.log('✅ 7 log levels (debug, trace, info, success, warn, error, fatal)');
console.log('✅ ANSI color-coded terminal output');
console.log('✅ Timestamps and namespaces');
console.log('✅ Boxed output with multiple border styles');
console.log('✅ HTTP and WebSocket remote transports');
console.log('✅ Authentication support (Bearer tokens & query params)');
console.log('✅ InMemoryTransport for testing');
console.log('✅ Highly configurable (global + per-call)');
console.log('✅ Zero external dependencies');
console.log('✅ Full TypeScript support');
console.log('✅ ESM and CJS exports');
console.log('✅ Built with tsup for optimal bundling');

console.log('\n🚀 Ready for NPM publishing!');

// Cleanup
setTimeout(async () => {
        await defaultLogger.close();
        await customLogger.close();
        await filteredLogger.close();
        await remoteLogger.close();
}, 100);
