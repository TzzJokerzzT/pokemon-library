import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload | null;
  verifyRefreshToken(token: string): TokenPayload | null;
}

export class JWTService implements ITokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    accessSecret: string,
    refreshSecret: string,
    accessExpiresIn: string = '7d',
    refreshExpiresIn: string = '30d'
  ) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
    this.accessExpiresIn = accessExpiresIn;
    this.refreshExpiresIn = refreshExpiresIn;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      this.accessSecret,
      {
        expiresIn: this.accessExpiresIn,
        issuer: 'pokemon-library',
        audience: 'pokemon-library-users',
      }
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      this.refreshSecret,
      {
        expiresIn: this.refreshExpiresIn,
        issuer: 'pokemon-library',
        audience: 'pokemon-library-users',
      }
    );
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessSecret, {
        issuer: 'pokemon-library',
        audience: 'pokemon-library-users',
      }) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error('Error al verificar access token:', error);
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        issuer: 'pokemon-library',
        audience: 'pokemon-library-users',
      }) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error('Error al verificar refresh token:', error);
      return null;
    }
  }
}
