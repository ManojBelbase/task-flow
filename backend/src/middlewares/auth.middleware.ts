import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User.entity';
import { AppError } from './error.middleware';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Unauthorized: No token provided', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded || !decoded.userId) {
            throw new AppError('Unauthorized: Invalid token', 401);
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: decoded.userId });

        if (!user) {
            throw new AppError('Unauthorized: User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(new AppError('Unauthorized: Invalid token', 401));
    }
};
