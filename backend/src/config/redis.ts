import Redis from 'ioredis';
import { env } from './env';

export const redisClient = env.redis.url
    ? new Redis(env.redis.url)
    : new Redis({
        host: env.redis.host,
        port: env.redis.port,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    });

export const connectRedis = async (): Promise<void> => {
    try {
        await redisClient.ping();
        console.log('Redis connected successfully');
    } catch (err) {
        console.error('Redis connection failed:', err);
        throw err;
    }
};
