import { UserData } from "../utils/shared/types";
import { NamedAPIResource } from "../utils/types/pokemon.types";

// ============================================
// TYPES USER STORE
// ============================================

export interface AuthState {
  // Estado
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

// ============================================
// TYPES POKEMON STORE
// ============================================

export interface PokemonState {
  // States
  pokemonList: NamedAPIResource[];
  isLoading: boolean;
  error: string | null;

  // Action
  getPokemonList: () => void;
}
