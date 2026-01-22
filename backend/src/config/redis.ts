import { Redis as UpstashRedis } from '@upstash/redis';
import IORedis from 'ioredis';
import { env } from './env';

interface UnifiedRedisClient {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ...args: any[]): Promise<any>;
    del(key: string): Promise<any>;
    ping(): Promise<any>;
}

const useUpstash = !!(env.upstash.url && env.upstash.token);

const createClient = (): UnifiedRedisClient => {
    if (useUpstash) {
        console.log('Using Upstash Redis (HTTP)');
        return new UpstashRedis({
            url: env.upstash.url!,
            token: env.upstash.token!,
        }) as unknown as UnifiedRedisClient;
    }

    console.log('Using local Redis (TCP)');
    const client = new IORedis({
        host: env.redis.host,
        port: env.redis.port,
        maxRetriesPerRequest: null,
        connectTimeout: 5000,
        retryStrategy: (times) => Math.min(times * 500, 5000)
    });

    let lastErrorLogTime = 0;
    client.on('error', (err) => {
        const now = Date.now();
        if (now - lastErrorLogTime > 5000) {
            console.error('Local Redis Connection Issue:', err.message);
            lastErrorLogTime = now;
        }
    });

    return client as unknown as UnifiedRedisClient;
};

export const redisClient = createClient();

export const connectRedis = async (): Promise<void> => {
    try {
        if (useUpstash) {
            await redisClient.ping();
            console.log('Upstash Redis connected successfully');
            return;
        }

        const pingPromise = redisClient.ping();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Local Redis ping timed out')), 2000)
        );

        await Promise.race([pingPromise, timeoutPromise]);
        console.log('Local Redis connected successfully');
    } catch (err: any) {
        console.error('Redis connection failed:', err.message || err);
        throw err;
    }
};
