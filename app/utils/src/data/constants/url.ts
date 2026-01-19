// URLs de APIs externas
export const PkmBaseUrl = process.env.NEXT_PUBLIC_POKEMON_API || 'https://pokeapi.co/api/v2';

// URL del backend (cambiar según el entorno)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Endpoints del backend
export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  
  // Users
  USER_PROFILE: '/users/profile',
  
  // Health
  HEALTH: '/health',
} as const;

