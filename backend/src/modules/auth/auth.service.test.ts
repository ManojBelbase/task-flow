import 'reflect-metadata';
import * as passwordUtils from '../../utils/password';
import * as jwtUtils from '../../utils/jwt';

const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
};

jest.mock('../../config/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockUserRepository),
    },
}));

jest.mock('../../utils/password');
jest.mock('../../utils/jwt');

import { AuthService } from './auth.service';
import { UserRole } from '../../entities/User.entity';

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should create a new user', async () => {
            const registerDto = { email: 'test@example.com', password: 'password123', name: 'Test User' };
            mockUserRepository.findOneBy.mockResolvedValue(null);
            (passwordUtils.hashPassword as jest.Mock).mockResolvedValue('hashed_password');
            mockUserRepository.create.mockReturnValue(registerDto);
            mockUserRepository.save.mockResolvedValue({ id: 'uuid', ...registerDto, role: UserRole.USER });
            (jwtUtils.signToken as jest.Mock).mockReturnValue('mock-token');

            (jwtUtils.signRefreshToken as jest.Mock).mockReturnValue('mock-refresh-token');

            const result = await AuthService.register(registerDto);

            expect(result.user.email).toBe(registerDto.email);
            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(result.accessToken).toBe('mock-token');
        });
    });
});
