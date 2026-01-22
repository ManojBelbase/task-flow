import { redisClient } from '../config/redis';

export class CacheService {
    static async get(key: string): Promise<string | null> {
        return await redisClient.get(key);
    }

    static async set(key: string, value: string, ttl?: number): Promise<void> {
        if (!ttl) {
            await redisClient.set(key, value);
            return;
        }

        // Detect if we are using Upstash (HTTP client) or ioredis (TCP client)
        // Upstash uses { ex: seconds }, ioredis uses 'EX', seconds
        if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
            await redisClient.set(key, value, { ex: ttl });
        } else {
            // @ts-ignore - ioredis specific syntax
            await redisClient.set(key, value, 'EX', ttl);
        }
    }

    static async del(key: string): Promise<void> {
        await redisClient.del(key);
    }
}
