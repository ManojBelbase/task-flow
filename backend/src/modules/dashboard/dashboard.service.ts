import { AppDataSource } from '../../config/data-source';
import { Task } from '../../entities/Task.entity';
import { User, UserRole } from '../../entities/User.entity';
import { CacheService } from '../../cache/cache.service';
import { Not } from 'typeorm';

export class DashboardService {
    private static taskRepository = AppDataSource.getRepository(Task);
    private static userRepository = AppDataSource.getRepository(User);

    static async getStats(user: User) {
        const cacheKey = `dashboard:${user.id}`;
        const cachedStats = await CacheService.get(cacheKey);

        if (cachedStats) {
            return typeof cachedStats === 'string' ? JSON.parse(cachedStats) : cachedStats;
        }

        const queryBuilder = this.taskRepository.createQueryBuilder('task');


        // Always filter by user
        queryBuilder.where('task.userId = :userId', { userId: user.id });

        const totalTasks = await queryBuilder.getCount();

        const tasksByStatus = await queryBuilder
            .select('task.status', 'status')
            .addSelect('COUNT(task.id)', 'count')
            .groupBy('task.status')
            .getRawMany();

        // Get Recent Tasks
        const recentTasks = await this.taskRepository.find({
            where: { userId: user.id },
            order: { createdAt: 'DESC' },
            take: 5,
            relations: ['user']
        });

        // Get Productivity Trend (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendQuery = this.taskRepository.createQueryBuilder('task')
            .select("DATE(task.createdAt)", "date")
            .addSelect("COUNT(task.id)", "count")
            .where("task.createdAt >= :date", { date: sevenDaysAgo });

        trendQuery.andWhere("task.userId = :userId", { userId: user.id });

        const productivityTrend = await trendQuery
            .groupBy("date")
            .orderBy("date", "ASC")
            .getRawMany();

        // User stats for Admin
        let userStats = null;
        if (user.role === UserRole.ADMIN) {
            const totalUsers = await this.userRepository.count();
            const usersByRole = await this.userRepository.createQueryBuilder('user')
                .select('user.role', 'role')
                .addSelect('COUNT(user.id)', 'count')
                .groupBy('user.role')
                .getRawMany();

            const recentUsers = await this.userRepository.find({
                where: { id: Not(user.id) },
                order: { createdAt: 'DESC' },
                take: 5
            });

            userStats = {
                totalUsers,
                roles: usersByRole.reduce((acc: Record<string, number>, curr: { role: string; count: string }) => {
                    acc[curr.role] = parseInt(curr.count);
                    return acc;
                }, {} as Record<string, number>),
                recentUsers
            };
        }

        const stats = {
            totalTasks,
            tasksByStatus: tasksByStatus.reduce((acc: Record<string, number>, curr: { status: string; count: string }) => {
                acc[curr.status] = parseInt(curr.count);
                return acc;
            }, {} as Record<string, number>),
            recentTasks,
            productivityTrend: productivityTrend.map(t => ({
                date: t.date,
                count: parseInt(t.count)
            })),
            userStats
        };

        // Cache for 60 seconds
        await CacheService.set(cacheKey, JSON.stringify(stats), 60);

        return stats;
    }
}
