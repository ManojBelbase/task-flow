import { Redis } from '@upstash/redis';
import { env } from './env';

export const redisClient = new Redis({
    url: env.upstash.url || '',
    token: env.upstash.token || '',
});

export const connectRedis = async (): Promise<void> => {
    try {
        await redisClient.ping();
        console.log('Redis (Upstash) connected successfully');
    } catch (err) {
        console.error('Redis (Upstash) connection failed:', err);
        throw err;
    }
};
