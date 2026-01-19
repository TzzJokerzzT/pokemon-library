import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../infrastructure/security/PasswordService";
import { ITokenService } from "../../infrastructure/security/JWTService";
import { ConflictError } from "../../domain/errors/DomainErrors";
import { UserResponse, AuthTokens } from "../../domain/entities/User";
import { RegisterUserInput } from "../dto/validators";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(
    input: RegisterUserInput,
  ): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError("El email ya está registrado");
    }

    // Hashear contraseña
    const hashedPassword = await this.passwordService.hash(input.password);

    // Crear usuario
    const user = await this.userRepository.create({
      email: input.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      name: input.name,
    });

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
