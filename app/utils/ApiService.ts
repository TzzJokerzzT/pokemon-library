import { axiosService } from "./AxiosService";
import {
  RegisterData,
  AuthResponse,
  LoginData,
  UserData,
  ApiError,
} from "./shared/types";
import { ENDPOINTS } from "./src/data/constants/url";

// ============================================
// API SERVICE CLASS
// ============================================

class ApiService {
  // ==========================================
  // AUTENTICACIÓN
  // ==========================================

  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosService.post<AuthResponse>(
        ENDPOINTS.AUTH_REGISTER,
        data,
      );

      if (response.success && response.data) {
        // Guardar tokens automáticamente
        axiosService.setToken(response.data.tokens.accessToken);
        return response.data;
      }

      throw new Error("Respuesta inválida del servidor");
    } catch (error) {
      console.error("Error en register:", error);
      throw error;
    }
  }

  /**
   * Iniciar sesión
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axiosService.post<AuthResponse>(
        ENDPOINTS.AUTH_LOGIN,
        data,
      );

      if (response.success && response.data) {
        // Guardar tokens automáticamente
        axiosService.setToken(response.data.tokens.accessToken);
        return response.data;
      }

      throw new Error("Respuesta inválida del servidor");
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await axiosService.post(ENDPOINTS.AUTH_LOGOUT);

      // Limpiar tokens del cliente
      axiosService.clearToken();
    } catch (error) {
      console.error("Error en logout:", error);
      // Limpiar tokens incluso si hay error
      axiosService.clearToken();
      throw error;
    }
  }

  // ==========================================
  // USUARIOS
  // ==========================================

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<UserData> {
    try {
      const response = await axiosService.get<{ user: UserData }>(
        ENDPOINTS.USER_PROFILE,
      );

      if (response.success && response.data) {
        return response.data.user;
      }

      throw new Error("Respuesta inválida del servidor");
    } catch (error) {
      console.error("Error en getProfile:", error);
      throw error;
    }
  }

  // ==========================================
  // UTILIDADES
  // ==========================================

  /**
   * Health check del servidor
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axiosService.get(ENDPOINTS.HEALTH);
      return response.success;
    } catch (error) {
      console.error("Error en healthCheck:", error);
      return false;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return axiosService.hasToken();
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return axiosService.getToken();
  }

  /**
   * Establecer token manualmente
   */
  setToken(token: string): void {
    axiosService.setToken(token);
  }

  /**
   * Limpiar token manualmente
   */
  clearToken(): void {
    axiosService.clearToken();
  }
}

// ============================================
// EXPORTAR INSTANCIA SINGLETON
// ============================================

export const apiService = new ApiService();

// Exportar también la clase para casos especiales
export default ApiService;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Helper para verificar si un error es un ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "statusCode" in error
  );
}

/**
 * Helper para extraer mensaje de error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ha ocurrido un error desconocido";
}
