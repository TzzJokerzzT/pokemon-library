import { Request, Response, NextFunction } from 'express';

export class UserController {
  // Ruta protegida de ejemplo - obtener perfil del usuario autenticado
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.user está disponible gracias al middleware authenticateToken
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Usuario no autenticado',
          },
        });
        return;
      }

      // Aquí podrías buscar más información del usuario en la BD
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
        message: 'Perfil obtenido exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}
