import { redisClient } from '../config/redis';

export class CacheService {
    static async get(key: string): Promise<string | null> {
        return await redisClient.get(key);
    }

    static async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await redisClient.set(key, value, { ex: ttl });
        } else {
            await redisClient.set(key, value);
        }
    }

    static async del(key: string): Promise<void> {
        await redisClient.del(key);
    }
}
