import { AppDataSource } from '../../config/data-source';
import { User } from '../../entities/User.entity';
import { Not } from 'typeorm';

export class UsersService {
    private static userRepository = AppDataSource.getRepository(User);

    static async findAll(excludeUserId?: string) {
        return await this.userRepository.find({
            where: excludeUserId ? { id: Not(excludeUserId) } : {},
            order: { createdAt: 'DESC' },
        });
    }

    static async delete(id: string) {
        return await this.userRepository.delete(id);
    }
}
