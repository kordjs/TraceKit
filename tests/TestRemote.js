/**
 * Test remote HTTP transport
 */

const { createLogger, HTTPTransport } = require('./dist/index.js');

async function testRemoteLogging() {
        console.log('🌐 Testing Remote HTTP Transport...\n');

        // Test HTTP transport directly
        console.log('1. Testing HTTPTransport directly:');
        const httpTransport = new HTTPTransport('https://logsify.onrender.com/api/logs', 5000, 1);

        const testEntry = {
                level: 'info',
                namespace: 'TestApp',
                message: 'Direct HTTP transport test',
                timestamp: new Date().toISOString(),
                metadata: {
                        test: true,
                        userId: 'test-123'
                }
        };

        try {
                const success = await httpTransport.send(testEntry);
                console.log(`   HTTP Transport result: ${success ? '✅ Success' : '❌ Failed'}`);
        } catch (error) {
                console.log(`   HTTP Transport error: ${error.message}`);
        }

        // Test with logger configured for remote
        console.log('\n2. Testing Logger with remote enabled:');
        const remoteLogger = createLogger({
                namespace: 'RemoteTest',
                enableRemote: true,
                transportType: 'http',
                remoteUrl: 'https://logsify.onrender.com/api/logs',
                remoteTimeout: 5000,
                retryAttempts: 1
        });

        // Send various log levels (only info, warn, error, fatal should go remote)
        remoteLogger.debug('Debug message - should NOT go to remote');
        remoteLogger.trace('Trace message - should NOT go to remote');
        remoteLogger.info('Info message - should go to remote', {
                metadata: { feature: 'remote-logging', test: 'integration' }
        });
        remoteLogger.warn('Warning message - should go to remote');
        remoteLogger.error('Error message - should go to remote', {
                metadata: { errorCode: 500, stack: 'test-stack' }
        });
        remoteLogger.fatal('Fatal message - should go to remote');

        // Give some time for remote requests to complete
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log('\n✅ Remote logging test completed!');
        console.log('Check your remote log server to verify the logs were received.');

        await remoteLogger.close();
}

testRemoteLogging().catch(console.error);
