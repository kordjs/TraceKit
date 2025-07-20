/**
 * Test MinimalBox functionality showcase
 */

const { MinimalBox, createLogger, Colors } = require('../dist/index.js');

console.log('🎪 MinimalBox Style Showcase\n');

// 1. Standalone MinimalBox usage
console.log('1️⃣ Standalone MinimalBox:');
const minimalBox = new MinimalBox(2, true);

const simpleBox = minimalBox.createBox(
        [
                'Application started successfully',
                'Database connection established',
                'Server listening on port 3000'
        ],
        {
                title: 'STARTUP',
                color: Colors.green
        }
);
console.log(simpleBox);

// 2. MinimalBox with logger
console.log('\n2️⃣ Logger with MinimalBox style:');
const logger = createLogger({
        namespace: 'MinimalApp',
        defaultBorderStyle: 'minimal',
        defaultPadding: 1
});

logger.info('Starting application', { boxed: true });
logger.success('All systems operational', {
        boxed: true,
        title: 'SUCCESS',
        padding: 3,
        centered: true
});
logger.warn('Low disk space detected', {
        boxed: true,
        borderStyle: 'minimal',
        title: 'WARNING'
});

// 3. Comparison of all three styles
console.log('\n3️⃣ All Border Styles Comparison:');

const compareLogger = createLogger({
        namespace: 'StyleDemo',
        enableTimestamp: false
});

console.log('\n  🔸 Rounded Style:');
compareLogger.info('Rounded border example', {
        boxed: true,
        borderStyle: 'rounded',
        title: 'ROUNDED'
});

console.log('\n  🔸 ASCII Style:');
compareLogger.info('ASCII border example', {
        boxed: true,
        borderStyle: 'ascii',
        title: 'ASCII'
});

console.log('\n  🔸 Minimal Style:');
compareLogger.info('Minimal style example', {
        boxed: true,
        borderStyle: 'minimal',
        title: 'MINIMAL'
});

// 4. MinimalBox with metadata
console.log('\n4️⃣ MinimalBox with Metadata:');
logger.error('Database connection failed', {
        boxed: true,
        borderStyle: 'minimal',
        title: 'DATABASE ERROR',
        metadata: {
                host: 'localhost:5432',
                database: 'production',
                errorCode: 'CONNECTION_REFUSED',
                retryAttempt: 3,
                lastSuccessful: '2025-07-19T15:30:00Z'
        }
});

console.log('\n🌟 MinimalBox Features:');
console.log('✅ Borderless design perfect for CI/CD logs');
console.log('✅ Maintains alignment and readability');
console.log('✅ Supports titles with separator format (=== TITLE ===)');
console.log('✅ Configurable padding for indentation');
console.log('✅ Works with all log levels and metadata');
console.log('✅ ANSI color support when enabled');
console.log('✅ Centered text option available');

// Cleanup
setTimeout(async () => {
        await logger.close();
        await compareLogger.close();
}, 100);
