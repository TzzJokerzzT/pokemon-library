// ============================================
// TIPOS DE DATOS
// ============================================

// Auth Types
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  createdAt: string | Date;
}

export interface AuthResponse {
  user: UserData;
  tokens: AuthTokens;
}

// Tipos para las respuestas del backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  message?: string;
  timestamp?: string;
  path?: string;
}

// Tipos para errores
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}
