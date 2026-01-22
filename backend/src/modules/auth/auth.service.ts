import { AppDataSource } from '../../config/data-source';
import { User, UserRole } from '../../entities/User.entity';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middlewares/error.middleware';
import { AuthCredentialsDto, RegisterDto } from './auth.types';

export class AuthService {
    private static userRepository = AppDataSource.getRepository(User);

    private static async generateTokens(user: User) {
        const payload = { userId: user.id, role: user.role };
        const accessToken = signToken(payload);
        const refreshToken = signRefreshToken(payload);

        // Store refresh token in DB
        user.refreshToken = refreshToken;
        await this.userRepository.save(user);

        return { accessToken, refreshToken };
    }

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
            role: UserRole.USER,
        });

        await this.userRepository.save(user);

        const { accessToken, refreshToken } = await this.generateTokens(user);

        return { user, accessToken, refreshToken };
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

        delete (user as { password?: string }).password;

        const { accessToken, refreshToken } = await this.generateTokens(user);

        return { user, accessToken, refreshToken };
    }

    static async refreshToken(oldRefreshToken: string) {
        try {
            const payload = verifyRefreshToken(oldRefreshToken);
            const user = await this.userRepository.findOne({
                where: { id: payload.userId },
                select: ['id', 'role', 'refreshToken']
            });

            if (!user || user.refreshToken !== oldRefreshToken) {
                throw new AppError('Invalid refresh token', 401);
            }

            const newPayload = { userId: user.id, role: user.role };
            const accessToken = signToken(newPayload);
            const newRefreshToken = signRefreshToken(newPayload);

            user.refreshToken = newRefreshToken;
            await this.userRepository.save(user);

            return { accessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new AppError('Invalid or expired refresh token', 401);
        }
    }
}
