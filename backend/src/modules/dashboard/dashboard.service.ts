import { AppDataSource } from '../../config/data-source';
import { Task } from '../../entities/Task.entity';
import { User, UserRole } from '../../entities/User.entity';
import { CacheService } from '../../cache/cache.service';

export class DashboardService {
    private static taskRepository = AppDataSource.getRepository(Task);

    static async getStats(user: User) {
        const cacheKey = `dashboard:${user.id}`;
        const cachedStats = await CacheService.get(cacheKey);

        if (cachedStats) {
            return JSON.parse(cachedStats);
        }

        const queryBuilder = this.taskRepository.createQueryBuilder('task');

        // Filter by user unless admin
        if (user.role !== UserRole.ADMIN) {
            queryBuilder.where('task.userId = :userId', { userId: user.id });
        }

        const totalTasks = await queryBuilder.getCount();

        const tasksByStatus = await queryBuilder
            .select('task.status', 'status')
            .addSelect('COUNT(task.id)', 'count')
            .groupBy('task.status')
            .getRawMany();

        const stats = {
            totalTasks,
            tasksByStatus: tasksByStatus.reduce((acc: Record<string, number>, curr: { status: string; count: string }) => {
                acc[curr.status] = parseInt(curr.count);
                return acc;
            }, {} as Record<string, number>),
        };

        // Cache for 60 seconds
        await CacheService.set(cacheKey, JSON.stringify(stats), 60);

        return stats;
    }
}
