import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { UserRole } from '../entities/User.entity';

export const roleMiddleware = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Unauthorized: User not logged in', 401));
        }

        if (!roles.some(role => role.toUpperCase() === req.user?.role?.toUpperCase())) {
            return next(new AppError('Forbidden: Insufficient permissions', 403));
        }

        next();
    };
};
