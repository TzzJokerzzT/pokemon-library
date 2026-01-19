import { Request, Response, NextFunction } from 'express';
import { container } from '../../../shared/container';
import { UnauthorizedError } from '../../../domain/errors/DomainErrors';

// Extender el tipo Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware para validar tokens JWT
 * Verifica que el token sea válido, no esté expirado y tenga la firma correcta
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
      throw new UnauthorizedError('Token de autenticación no proporcionado');
    }

    // Obtener el servicio JWT del contenedor (arquitectura hexagonal)
    const tokenService = container.get('tokenService');
    
    // Verificar el token (esto valida la firma Y la expiración automáticamente)
    const decoded = tokenService.verifyAccessToken(token);

    if (!decoded) {
      throw new UnauthorizedError('Token inválido o expirado');
    }

    // Adjuntar información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware opcional para extraer token sin fallar si no existe
 * Útil para rutas que pueden funcionar con o sin autenticación
 */
export function optionalAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      const tokenService = container.get('tokenService');
      const decoded = tokenService.verifyAccessToken(token);

      if (decoded) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
        };
      }
    }

    next();
  } catch (error) {
    // No fallar si el token es inválido, solo continuar sin usuario
    next();
  }
}
