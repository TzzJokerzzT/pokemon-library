import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { apiService, getErrorMessage } from "../utils/ApiService";
import { AuthState } from "./types";
import { addToast } from "@heroui/react";

// ============================================
// STORE
// ============================================

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        message: null,

        // ==========================================
        // ACCIONES
        // ==========================================

        /**
         * Iniciar sesión
         */
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            const response = await apiService.login({ email, password });

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            addToast({
              color: "success",
              description: "Login Exitoso!",
              variant: "flat",
            });
          } catch (error) {
            const errorMessage = getErrorMessage(error);

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });

            addToast({
              color: "danger",
              description: errorMessage,
              variant: "flat",
            });
          }
        },

        /**
         * Registrar nuevo usuario
         */
        register: async (
          name: string,
          email: string,
          password: string,
          confirmPassword: string,
        ) => {
          set({ isLoading: true, error: null });

          try {
            const response = await apiService.register({
              name,
              email,
              password,
              confirmPassword,
            });

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            addToast({
              color: "success",
              description: "Registro Exitoso!",
              variant: "flat",
            });
          } catch (error) {
            const errorMessage = getErrorMessage(error);

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });

            addToast({
              color: "danger",
              description: errorMessage,
              variant: "flat",
            });
          }
        },

        /**
         * Cerrar sesión
         */
        logout: async () => {
          set({ isLoading: true, error: null });

          try {
            await apiService.logout();

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage = getErrorMessage(error);

            // Limpiar estado incluso si hay error
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });

            throw error;
          }
        },

        /**
         * Refrescar información del usuario
         */
        refreshUser: async () => {
          // Solo intentar refrescar si hay un token
          if (!apiService.isAuthenticated()) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const userData = await apiService.getProfile();

            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage = getErrorMessage(error);

            // Si falla (ej: token expirado), limpiar estado
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });

            // Limpiar token inválido
            apiService.clearToken();
          }
        },

        /**
         * Limpiar error
         */
        clearError: () => {
          set({ error: null });
        },

        /**
         * Inicializar autenticación (llamar al cargar la app)
         */
        initializeAuth: async () => {
          // Si hay un token guardado, intentar obtener el perfil
          if (apiService.isAuthenticated()) {
            await get().refreshUser();
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },
      }),
      {
        name: "auth-storage",
        // Solo persistir user e isAuthenticated
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "AuthStore",
    },
  ),
);

// ============================================
// SELECTORES (para optimizar renders)
// ============================================

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthMessage = () => useAuthStore((state) => state.message);

// Acceso directo a las acciones (las acciones son estables y no causan re-renders)
export const useAuthActions = () => ({
  login: useAuthStore.getState().login,
  register: useAuthStore.getState().register,
  logout: useAuthStore.getState().logout,
  refreshUser: useAuthStore.getState().refreshUser,
  clearError: useAuthStore.getState().clearError,
  initializeAuth: useAuthStore.getState().initializeAuth,
});
