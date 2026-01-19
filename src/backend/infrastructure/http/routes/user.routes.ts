import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middlewares/expireToken';

const router = Router();
const userController = new UserController();

// Todas las rutas aquí requieren autenticación
router.use(authenticateToken);

// GET /api/v1/users/profile - Obtener perfil del usuario autenticado
router.get('/profile', (req, res, next) => userController.getProfile(req, res, next));

export default router;
