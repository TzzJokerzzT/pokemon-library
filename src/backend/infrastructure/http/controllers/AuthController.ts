import { Request, Response, NextFunction } from 'express';
import { container } from '../../../shared/container';
import { validateAndSanitize, RegisterUserSchema } from '../../../application/dto/validators';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validar y sanitizar input
      const validatedData = validateAndSanitize(RegisterUserSchema, req.body);

      // Ejecutar caso de uso
      const registerUserUseCase = container.get('registerUserUseCase');
      const result = await registerUserUseCase.execute(validatedData);

      // Establecer tokens en cookies HTTP-only para mayor seguridad
      res.cookie('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      });

      // Responder con éxito
      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          tokens: result.tokens,
        },
        message: 'Usuario registrado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validar y sanitizar input
      const validatedData = validateAndSanitize(
        await import('../../../application/dto/validators').then((m) => m.LoginUserSchema),
        req.body
      );

      // Ejecutar caso de uso
      const loginUserUseCase = container.get('loginUserUseCase');
      const result = await loginUserUseCase.execute(validatedData);

      // Establecer tokens en cookies HTTP-only
      res.cookie('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // Responder con éxito
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          tokens: result.tokens,
        },
        message: 'Login exitoso',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Limpiar cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout exitoso',
    });
  }
}
