import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL } from "./src/data/constants/url";
import { ApiResponse, ApiError } from "./shared/types";

class AxiosService {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Crear instancia de axios con configuración base
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000, // 15 segundos
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Para enviar cookies
    });

    // Configurar interceptores
    this.setupInterceptors();
  }

  /**
   * Configurar interceptores de request y response
   */
  private setupInterceptors(): void {
    // Interceptor de Request
    this.instance.interceptors.request.use(
      (config) => {
        // Agregar token si existe
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Log de request en desarrollo
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      },
    );

    // Interceptor de Response
    this.instance.interceptors.response.use(
      (response) => {
        // Log de response en desarrollo
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ Response from ${response.config.url}:`,
            response.status,
          );
        }

        return response;
      },
      (error: AxiosError<ApiResponse>) => {
        // Manejar errores de forma centralizada
        return this.handleError(error);
      },
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: AxiosError<ApiResponse>): Promise<never> {
    const apiError: ApiError = {
      code: "UNKNOWN_ERROR",
      message: "Ha ocurrido un error desconocido",
      statusCode: 500,
    };

    if (error.response) {
      // El servidor respondió con un código de error
      const { data, status } = error.response;

      apiError.code = data.error?.code || "SERVER_ERROR";
      apiError.message =
        data.error?.message || data.message || "Error del servidor";
      apiError.statusCode = status;
      apiError.details = data.error?.details;

      console.error(`❌ API Error [${status}]:`, apiError.message);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      apiError.code = "NETWORK_ERROR";
      apiError.message =
        "No se pudo conectar con el servidor. Verifica tu conexión.";
      apiError.statusCode = 0;

      console.error("❌ Network Error:", error.message);
    } else {
      // Error al configurar la petición
      apiError.code = "REQUEST_ERROR";
      apiError.message = error.message;

      console.error("❌ Request Setup Error:", error.message);
    }

    return Promise.reject(apiError);
  }

  /**
   * Establecer token de autenticación
   */
  public setToken(token: string): void {
    this.token = token;

    // Guardar en localStorage y cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      
      // Guardar en cookie para el middleware de Next.js
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
    }
  }

  /**
   * Obtener token actual
   */
  public getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  /**
   * Limpiar token (logout)
   */
  public clearToken(): void {
    this.token = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      
      // Limpiar cookie
      document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
    }
  }

  /**
   * Verificar si hay un token
   */
  public hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Método GET
   */
  public async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Método POST
   */
  public async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  }

  /**
   * Método PUT
   */
  public async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Método PATCH
   */
  public async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  }

  /**
   * Método DELETE
   */
  public async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Obtener la instancia de axios para casos especiales
   */
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Exportar instancia singleton
export const axiosService = new AxiosService();

// Exportar la clase por si se necesita crear múltiples instancias
export default AxiosService;
