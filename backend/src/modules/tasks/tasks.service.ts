import { AppDataSource } from '../../config/data-source';
import { Task, TaskStatus } from '../../entities/Task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AppError } from '../../middlewares/error.middleware';
import { User, UserRole } from '../../entities/User.entity';
import { Like } from 'typeorm';
import { CacheService } from '../../cache/cache.service';

export class TasksService {
    private static taskRepository = AppDataSource.getRepository(Task);

    static async create(data: CreateTaskDto, user: User) {
        const task = this.taskRepository.create({
            ...data,
            userId: user.id,
        });
        const savedTask = await this.taskRepository.save(task);

        // Invalidate dashboard and any list cache for this user
        await CacheService.del(`dashboard:${user.id}`);
        // We rely on the short 5s TTL for the list to refresh quickly after creation.

        return savedTask;
    }

    static async findAll(
        page: number = 1,
        limit: number = 10,
        status?: TaskStatus,
        search?: string,
        date?: string,
        user?: User
    ) {
        const cacheKey = `tasks:list:${user?.id}:${page}:${limit}:${status || 'all'}:${search || 'none'}:${date || 'all'}`;
        const cachedData = await CacheService.get(cacheKey);

        if (cachedData) {
            return typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
        }

        const where: any = {};

        // Filter by status if provided
        if (status) {
            where.status = status;
        }

        // Filter by search text (title or description)
        if (search) {
            where.title = Like(`%${search}%`);
        }

        // Filter by specific date
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            // Assuming TypeORM. We need to import Between if not present, or use raw query. 
            // Since we are using FindOptions, we can use Between.
            // Let's check imports first or assume we need to import it.
            // I'll use Raw to be safe with timezone issues or just simple Between.
            // Let's use Between from typeorm.
            const { Between } = require('typeorm');
            where.createdAt = Between(startDate, endDate);
        }

        // Always filter by owner's tasks
        // Always filter by owner's tasks
        if (user) {
            where.userId = user.id;
        }

        const [tasks, total] = await this.taskRepository.findAndCount({
            where,
            take: limit,
            skip: (page - 1) * limit,
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });

        const result = {
            data: tasks,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };

        // Cache for 5 seconds to keep it fresh during rapid changes
        await CacheService.set(cacheKey, JSON.stringify(result), 5);

        return result;
    }

    static async findOne(id: string, user: User) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        // Always enforce ownership
        // Always enforce ownership
        if (task.userId !== user.id) {
            throw new AppError('Forbidden: You do not have access to this task', 403);
        }

        return task;
    }

    static async update(id: string, data: UpdateTaskDto, user: User) {
        const task = await this.findOne(id, user);

        Object.assign(task, data);

        const updatedTask = await this.taskRepository.save(task);

        // Invalidate dashboard cache
        await CacheService.del(`dashboard:${task.userId}`);
        // If admin updated another user's task, invalidate that user's cache too
        if (task.userId !== user.id) {
            await CacheService.del(`dashboard:${user.id}`);
        }

        return updatedTask;
    }

    static async delete(id: string, user: User) {
        const task = await this.findOne(id, user);

        await this.taskRepository.remove(task);

        // Invalidate dashboard cache
        await CacheService.del(`dashboard:${task.userId}`);

        return { message: 'Task deleted successfully' };
    }
}
