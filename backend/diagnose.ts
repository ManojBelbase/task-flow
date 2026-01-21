import { Logger } from './src/utils/logger.js'; // Use .js for npx tsx sometimes help or just test
try {
    await import('./src/server.js');
} catch (err) {
    console.error('FULL CRASH ERR:', err);
    if (err.stack) console.error('STACK:', err.stack);
    process.exit(1);
}
