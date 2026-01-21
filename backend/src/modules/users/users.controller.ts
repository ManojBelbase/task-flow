import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';

export class UsersController {
    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UsersService.findAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}
