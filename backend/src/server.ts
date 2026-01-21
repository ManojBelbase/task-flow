import 'reflect-metadata'; // MUST be first
import app from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';
import { connectRedis } from './config/redis';
import { Logger } from './utils/logger';

const startServer = async () => {
    try {
        // 1. Connect to Database
        await AppDataSource.initialize();
        Logger.info('🔥 Database connected successfully');

        // 2. Connect to Redis
        await connectRedis();
        Logger.info('⚡ Redis connected successfully');

        // 3. Start Express Server
        app.listen(env.port, () => {
            Logger.info(`🚀 Server running on port ${env.port} in ${env.nodeEnv} mode`);
        });
    } catch (error) {
        Logger.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

startServer();
