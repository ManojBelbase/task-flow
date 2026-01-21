import { AppDataSource } from '../../config/data-source';
import { User } from '../../entities/User.entity';

export class UsersService {
    private static userRepository = AppDataSource.getRepository(User);

    static async findAll() {
        return await this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
}
