import { AppDataSource } from '../../config/data-source';
import { User, UserRole } from '../../entities/User.entity';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { AppError } from '../../middlewares/error.middleware';
import { AuthCredentialsDto, RegisterDto } from './auth.types';

export class AuthService {
    private static userRepository = AppDataSource.getRepository(User);

    static async register(data: RegisterDto) {
        const { email, password, name } = data;

        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        const hashedPassword = await hashPassword(password);

        const user = this.userRepository.create({
            email,
            name,
            password: hashedPassword,
            role: UserRole.USER, // Default role
        });

        await this.userRepository.save(user);

        const token = signToken({ userId: user.id, role: user.role });

        return { user, token };
    }

    static async login(data: AuthCredentialsDto) {
        const { email, password } = data;

        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();

        if (!user || !(await comparePassword(password, user.password))) {
            throw new AppError('Invalid email or password', 401);
        }

        // Don't return password
        delete (user as { password?: string }).password;

        const token = signToken({ userId: user.id, role: user.role });

        return { user, token };
    }
}
