import 'reflect-metadata';
import app from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';
import { seedAdmin } from './config/seed';
import { connectRedis } from './config/redis';
import { Logger } from './utils/logger';

const startServer = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await AppDataSource.initialize();
            Logger.info('Database connected successfully');

            Logger.info('Running migrations...');
            await AppDataSource.runMigrations();
            Logger.info('Migrations completed');

            await seedAdmin();

            break;
        } catch (err) {
            retries -= 1;
            Logger.warn(`Database connection failed. Retries left: ${retries}`);
            if (retries === 0) {
                Logger.error('Could not connect to database after 5 attempts');
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    retries = 3;
    while (retries > 0) {
        try {
            await connectRedis();
            Logger.info('Redis connected successfully');
            break;
        } catch (err) {
            retries -= 1;
            if (retries > 0) {
                Logger.warn(`Redis connection failed. Retrying... (${retries} left)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                Logger.error('Could not connect to Redis. Caching will be disabled.');
                Logger.info('Tip: Ensure your Redis container is running (docker compose up)');
            }
        }
    }

    try {
        app.listen(env.port, () => {
            Logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
        });
    } catch (error) {
        Logger.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();