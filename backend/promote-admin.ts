import 'reflect-metadata';
import { AppDataSource } from './src/config/data-source';
import { User, UserRole } from './src/entities/User.entity';

const promoteUser = async (email: string) => {
    try {
        await AppDataSource.initialize();
        console.log('Database initialized');

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        user.role = UserRole.ADMIN;
        await userRepository.save(user);

        console.log(`User ${email} promoted to ADMIN successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.error('Please provide an email: ts-node promote-admin.ts user@example.com');
} else {
    promoteUser(email);
}
