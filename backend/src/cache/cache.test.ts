import { CacheService } from './cache.service';
import { redisClient } from '../config/redis';

jest.mock('../config/redis', () => ({
    redisClient: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        ping: jest.fn(),
    },
}));

describe('CacheService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should set and get from cache', async () => {
        const key = 'test-key';
        const value = 'test-value';
        (redisClient.get as jest.Mock).mockResolvedValue(value);

        await CacheService.set(key, value);
        const result = await CacheService.get(key);

        expect(redisClient.set).toHaveBeenCalledWith(key, value);
        expect(result).toBe(value);
    });

    it('should invalidate cache', async () => {
        const key = 'test-key';
        await CacheService.del(key);
        expect(redisClient.del).toHaveBeenCalledWith(key);
    });
});
