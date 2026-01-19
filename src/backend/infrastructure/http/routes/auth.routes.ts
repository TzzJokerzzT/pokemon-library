import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();
const authController = new AuthController();

// POST /api/v1/auth/register
router.post('/register', authRateLimiter, (req, res, next) =>
  authController.register(req, res, next)
);

// POST /api/v1/auth/login
router.post('/login', authRateLimiter, (req, res, next) =>
  authController.login(req, res, next)
);

// POST /api/v1/auth/logout
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
