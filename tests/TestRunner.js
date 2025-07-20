/**
 * Test runner for TraceKit (compiled version)
 */

const { Logger, InMemoryTransport } = require('../dist/index.js');

// Simple test runner
class TestRunner {
        constructor() {
                this.tests = [];
                this.passed = 0;
                this.failed = 0;
        }

        test(name, fn) {
                this.tests.push({ name, fn });
        }

        async run() {
                console.log('🧪 Running TraceKit tests...\n');

                for (const { name, fn } of this.tests) {
                        try {
                                await fn();
                                console.log(`✅ ${name}`);
                                this.passed++;
                        } catch (error) {
                                console.log(`❌ ${name}`);
                                console.error(`   Error: ${error}`);
                                this.failed++;
                        }
                }

                console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);

                if (this.failed > 0) {
                        process.exit(1);
                }
        }
}

const runner = new TestRunner();

// Helper function for assertions
function assert(condition, message) {
        if (!condition) {
                throw new Error(message);
        }
}

// Test: Basic logging
runner.test('Basic logging works', () => {
        const logger = new Logger({ enableRemote: false });

        // These should not throw
        logger.debug('Debug message');
        logger.info('Info message');
        logger.warn('Warning message');
        logger.error('Error message');
        logger.fatal('Fatal message');
        logger.success('Success message');
        logger.trace('Trace message');
});

// Test: Configuration
runner.test('Configuration updates work', () => {
        const logger = new Logger();

        const originalConfig = logger.getConfig();
        assert(originalConfig.namespace === 'System', 'Default namespace should be System');

        logger.configure({ namespace: 'TestApp' });
        const updatedConfig = logger.getConfig();
        assert(updatedConfig.namespace === 'TestApp', 'Namespace should be updated');
});

// Test: Log level filtering
runner.test('Log level filtering works', () => {
        // This test is basic since we can't easily capture console output
        // In a real test environment, you'd mock console.log
        const logger = new Logger({ minLevel: 'warn', enableRemote: false });

        // These should work without errors
        logger.warn('This should appear');
        logger.error('This should appear');
        logger.debug('This should not appear');
        logger.info('This should not appear');
});

// Test: Remote logging with memory transport
runner.test('Remote logging with InMemoryTransport', async () => {
        const memoryTransport = new InMemoryTransport();

        // We can't directly inject transport, but we can test the transport itself
        const logEntry = {
                level: 'info',
                namespace: 'TestApp',
                message: 'Test message',
                timestamp: new Date().toISOString()
        };

        const success = await memoryTransport.send(logEntry);
        assert(success === true, 'Memory transport should successfully send logs');

        const logs = memoryTransport.getLogs();
        assert(logs.length === 1, 'Should have one log entry');
        assert(logs[0].message === 'Test message', 'Log message should match');
});

// Test: Memory transport filtering
runner.test('Memory transport filtering', async () => {
        const transport = new InMemoryTransport();

        await transport.send({
                level: 'info',
                namespace: 'App1',
                message: 'Info 1',
                timestamp: '2023-01-01'
        });
        await transport.send({
                level: 'error',
                namespace: 'App1',
                message: 'Error 1',
                timestamp: '2023-01-01'
        });
        await transport.send({
                level: 'info',
                namespace: 'App2',
                message: 'Info 2',
                timestamp: '2023-01-01'
        });

        const infoLogs = transport.getLogsByLevel('info');
        assert(infoLogs.length === 2, 'Should have 2 info logs');

        const app1Logs = transport.getLogsByNamespace('App1');
        assert(app1Logs.length === 2, 'Should have 2 logs from App1');

        const errorLogs = transport.getLogsByLevel('error');
        assert(errorLogs.length === 1, 'Should have 1 error log');
});

// Test: Box logging (just ensure it doesn't crash)
runner.test('Box logging works', () => {
        const logger = new Logger({ enableRemote: false });

        logger.info('Boxed message', { boxed: true });
        logger.info('Boxed with title', { boxed: true, title: 'Important' });
        logger.error('Boxed error', { boxed: true, centered: true });
});

// Test: Configuration merging
runner.test('Configuration merging', () => {
        const logger = new Logger({
                namespace: 'Initial',
                enableTimestamp: false
        });

        let config = logger.getConfig();
        assert(config.namespace === 'Initial', 'Initial namespace should be set');
        assert(config.enableTimestamp === false, 'Timestamp should be disabled');
        assert(config.enableColors === true, 'Colors should have default value');

        logger.configure({ namespace: 'Updated' });
        config = logger.getConfig();
        assert(config.namespace === 'Updated', 'Namespace should be updated');
        assert(config.enableTimestamp === false, 'Timestamp should remain disabled');
});

// Test: Authentication configuration
runner.test('Authentication configuration', () => {
        const logger = new Logger({
                authToken: 'test-token-123',
                enableRemote: true,
                transportType: 'http'
        });

        const config = logger.getConfig();
        assert(config.authToken === 'test-token-123', 'Auth token should be set');

        // Update auth token
        logger.configure({ authToken: 'updated-token-456' });
        const updatedConfig = logger.getConfig();
        assert(updatedConfig.authToken === 'updated-token-456', 'Auth token should be updated');
});

// Test: New LoggerConfig interfaces
runner.test('New LoggerConfig interfaces work', () => {
        const logger = new Logger({
                // General options
                namespace: 'TestApp',
                enableTimestamp: true,
                enableColors: true,
                
                // Terminal options
                defaultBoxed: true,
                defaultBorderStyle: 'minimal',
                defaultPadding: 2,
                
                // Remote options
                enableRemote: true,
                transportType: 'http',
                transportTimeout: 10000,
                retryAttempts: 5
        });

        const config = logger.getConfig();
        assert(config.namespace === 'TestApp', 'Namespace should be set');
        assert(config.defaultBorderStyle === 'minimal', 'Border style should be minimal');
        assert(config.transportTimeout === 10000, 'Transport timeout should be renamed');
        assert(config.retryAttempts === 5, 'Retry attempts should be configurable');
});

// Test: Fixed remote URLs (no override)
runner.test('Remote URLs are fixed and cannot be overridden', () => {
        const logger = new Logger({
                enableRemote: true,
                transportType: 'http'
        });

        // The logger should use hardcoded URLs, not allow custom ones
        const config = logger.getConfig();
        
        // remoteUrl should not exist in the config anymore
        assert(config.remoteUrl === undefined, 'remoteUrl should not be configurable');
        
        // The logger should still be able to initialize (proving hardcoded URLs work)
        assert(logger.getConfig().enableRemote === true, 'Remote should still be enabled');
});

// Test: MinimalBox style
runner.test('MinimalBox style works', () => {
        const { MinimalBox, Colors } = require('../dist/index.js');
        
        const minimalBox = new MinimalBox(2, false); // Disable colors for testing
        const output = minimalBox.createBox(
                ['Line 1', 'Line 2'],
                { title: 'TEST', color: Colors.green }
        );
        
        const lines = output.split('\n');
        assert(lines.length === 3, 'Should have title + 2 content lines');
        assert(lines[0].includes('=== TEST ==='), 'Should have minimal title format');
        assert(lines[1].startsWith('  '), 'Content should be indented with padding');
        assert(lines[2].startsWith('  '), 'All content should be consistently indented');
});

// Test: BorderStyle minimal works in logger
runner.test('Logger supports minimal border style', () => {
        const logger = new Logger({ 
                enableRemote: false,
                defaultBorderStyle: 'minimal'
        });

        // This should not throw and should work
        logger.info('Minimal test', { boxed: true });
        logger.warn('Minimal warning', { 
                boxed: true, 
                borderStyle: 'minimal',
                title: 'WARNING'
        });
});

// Test: Enhanced configuration options
runner.test('Enhanced configuration with new options', () => {
        const logger = new Logger();
        
        // Test the renamed transportTimeout
        logger.configure({
                transportTimeout: 15000,
                wsReconnectDelay: 3000,
                wsMaxReconnectAttempts: 10
        });
        
        const config = logger.getConfig();
        assert(config.transportTimeout === 15000, 'transportTimeout should work');
        assert(config.wsReconnectDelay === 3000, 'WebSocket delay should be configurable');
        assert(config.wsMaxReconnectAttempts === 10, 'Max reconnect attempts should be configurable');
});

// Test: Spacing consistency
runner.test('Log level spacing is consistent', () => {
        const { formatLevel } = require('../dist/index.js');
        
        const debugFormatted = formatLevel('debug', false);
        const infoFormatted = formatLevel('info', false);
        const successFormatted = formatLevel('success', false);
        const errorFormatted = formatLevel('error', false);
        
        // Should follow pattern: emoji + space + padded level text
        assert(debugFormatted.includes('🐛 '), 'Debug should have correct icon and spacing');
        assert(infoFormatted.includes('ℹ️ '), 'Info should have correct icon and spacing');
        assert(errorFormatted.includes('❌ '), 'Error should have correct icon and spacing');
        
        // All level texts should be padded to at least 8 characters after emoji
        assert(debugFormatted.includes('DEBUG   '), 'Debug should be properly padded to 8 chars');
        assert(infoFormatted.includes('INFO    '), 'Info should be properly padded to 8 chars');
        assert(successFormatted.includes('SUCCESS '), 'Success should be properly padded to 8 chars');
        assert(errorFormatted.includes('ERROR   '), 'Error should be properly padded to 8 chars');
});

// Run tests
runner.run().catch(console.error);
