import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordService } from '../../infrastructure/security/PasswordService';
import { ITokenService } from '../../infrastructure/security/JWTService';
import { UnauthorizedError } from '../../domain/errors/DomainErrors';
import { UserResponse, AuthTokens } from '../../domain/entities/User';
import { LoginUserInput } from '../dto/validators';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: LoginUserInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(input.email);
    
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await this.passwordService.compare(input.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    // Preparar respuesta sin password
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    return {
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}
