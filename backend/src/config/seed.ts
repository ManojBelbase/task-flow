import { AppDataSource } from './data-source';
import { User, UserRole } from '../entities/User.entity';
import { hashPassword } from '../utils/password';
import { Logger } from '../utils/logger';

export const seedAdmin = async () => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin123';

        const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

        if (existingAdmin) {
            Logger.info('Admin user already exists');
            return;
        }

        Logger.info('Seeding admin user...');

        const hashedPassword = await hashPassword(adminPassword);

        const admin = userRepository.create({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: UserRole.ADMIN,
        });

        await userRepository.save(admin);
        Logger.info('Admin user created successfully: admin@gmail.com / admin123');
    } catch (error) {
        Logger.error('Error seeding admin user:', error);
    }
};
