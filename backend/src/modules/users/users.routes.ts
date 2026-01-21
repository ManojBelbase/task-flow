import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { UserRole } from '../../entities/User.entity';

const router = Router();

router.use(authMiddleware);

// Only admins can view all users
router.get('/', roleMiddleware([UserRole.ADMIN]), UsersController.findAll);

export default router;
