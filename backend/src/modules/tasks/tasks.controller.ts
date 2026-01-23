import { Request, Response, NextFunction } from 'express';
import { TasksService } from './tasks.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AppError } from '../../middlewares/error.middleware';
import { TaskStatus } from '../../entities/Task.entity';

export class TasksController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = plainToInstance(CreateTaskDto, req.body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                throw new AppError('Validation failed', 400);
            }

            const task = await TasksService.create(dto, req.user!);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as TaskStatus;
            const search = req.query.search as string;
            const date = req.query.date as string;

            const result = await TasksService.findAll(page, limit, status, search, date, req.user);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TasksService.findOne(req.params.id as string, req.user!);
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = plainToInstance(UpdateTaskDto, req.body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                throw new AppError('Validation failed', 400);
            }

            const task = await TasksService.update(req.params.id as string, dto, req.user!);
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await TasksService.delete(req.params.id as string, req.user!);
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
