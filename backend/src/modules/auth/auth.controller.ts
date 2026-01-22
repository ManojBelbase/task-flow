import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AuthCredentialsDto, RegisterDto, RefreshTokenDto } from './auth.types';
import { AppError } from '../../middlewares/error.middleware';

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = plainToInstance(RegisterDto, req.body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                throw new AppError('Validation failed', 400);
            }

            const result = await AuthService.register(dto);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = plainToInstance(AuthCredentialsDto, req.body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                throw new AppError('Validation failed', 400);
            }

            const result = await AuthService.login(dto);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = plainToInstance(RefreshTokenDto, req.body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                throw new AppError('Validation failed', 400);
            }

            const result = await AuthService.refreshToken(dto.refreshToken);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
