import { Router } from 'express';
import { TasksController } from './tasks.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware); // Protect all task routes

router.post('/', TasksController.create);
router.get('/', TasksController.findAll);
router.get('/:id', TasksController.findOne);
router.patch('/:id', TasksController.update);
router.delete('/:id', TasksController.delete);

export default router;
