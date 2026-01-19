import { MongoUserRepository } from '../infrastructure/database/repositories/MongoUserRepository';
import { BcryptPasswordService } from '../infrastructure/security/PasswordService';
import { JWTService } from '../infrastructure/security/JWTService';
import { RegisterUserUseCase } from '../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../application/use-cases/LoginUserUseCase';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IPasswordService } from '../infrastructure/security/PasswordService';
import { ITokenService } from '../infrastructure/security/JWTService';

interface Container {
  userRepository: IUserRepository;
  passwordService: IPasswordService;
  tokenService: ITokenService;
  registerUserUseCase: RegisterUserUseCase;
  loginUserUseCase: LoginUserUseCase;
}

class DependencyContainer {
  private static instance: DependencyContainer;
  private container: Container;

  private constructor() {
    // Inicializar servicios de infraestructura
    const userRepository = new MongoUserRepository();
    const passwordService = new BcryptPasswordService(
      parseInt(process.env.BCRYPT_ROUNDS || '12')
    );
    const tokenService = new JWTService(
      process.env.JWT_SECRET || 'default-secret-change-this',
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-this',
      process.env.JWT_EXPIRES_IN || '7d',
      process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    );

    // Inicializar casos de uso con dependency injection
    const registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      passwordService,
      tokenService
    );

    const loginUserUseCase = new LoginUserUseCase(
      userRepository,
      passwordService,
      tokenService
    );

    this.container = {
      userRepository,
      passwordService,
      tokenService,
      registerUserUseCase,
      loginUserUseCase,
    };
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  get<K extends keyof Container>(key: K): Container[K] {
    return this.container[key];
  }

  getAll(): Container {
    return this.container;
  }
}

export const container = DependencyContainer.getInstance();
