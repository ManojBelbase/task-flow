import 'reflect-metadata';

const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
};

jest.mock('../../config/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockTaskRepository),
    },
}));

jest.mock('../../cache/cache.service');

import { TasksService } from './tasks.service';
import { User, UserRole } from '../../entities/User.entity';

describe('TasksService', () => {
    const mockUser = { id: 'user-id', role: UserRole.USER } as User;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a task for the user', async () => {
            const taskDto = { title: 'Test Task', description: 'Test Desc' };
            mockTaskRepository.create.mockReturnValue(taskDto);
            mockTaskRepository.save.mockResolvedValue({ id: 'task-id', ...taskDto });

            const result = await TasksService.create(taskDto as any, mockUser);

            expect(result.id).toBe('task-id');
            expect(mockTaskRepository.save).toHaveBeenCalled();
        });
    });
});
