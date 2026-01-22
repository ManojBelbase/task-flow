import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';

export class UsersController {
    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UsersService.findAll(req.user?.id);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await UsersService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
