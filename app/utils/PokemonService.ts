import axios, { AxiosInstance, AxiosError } from "axios";
import {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  Type,
  Ability,
  Move,
  PokemonApiError,
} from "./types/pokemon.types";

// ============================================
// POKEMON API SERVICE CLASS
// ============================================

class PokemonService {
  private instance: AxiosInstance;
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutos

  constructor() {
    this.instance = axios.create({
      baseURL: "https://pokeapi.co/api/v2",
      timeout: 10000, // 10 segundos
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.cache = new Map();

    // Configurar interceptores
    this.setupInterceptors();
  }

  // ==========================================
  // INTERCEPTORES
  // ==========================================

  private setupInterceptors(): void {
    // Interceptor de Request
    this.instance.interceptors.request.use(
      (config) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`🎮 Fetching: ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(this.handleError(error));
      }
    );

    // Interceptor de Response
    this.instance.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ Received: ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  // ==========================================
  // MANEJO DE ERRORES
  // ==========================================

  private handleError(error: AxiosError): PokemonApiError {
    const apiError: PokemonApiError = {
      code: "UNKNOWN_ERROR",
      message: "Ha ocurrido un error desconocido",
    };

    if (error.response) {
      // La API respondió con un error
      apiError.code = "API_ERROR";
      apiError.message = `Error ${error.response.status}: ${error.response.statusText}`;
      apiError.details = error.response.data;

      console.error(`❌ PokéAPI Error [${error.response.status}]:`, error.response.statusText);
    } else if (error.request) {
      // No hubo respuesta
      apiError.code = "NETWORK_ERROR";
      apiError.message = "No se pudo conectar con la PokéAPI. Verifica tu conexión.";

      console.error("❌ Network Error:", error.message);
    } else {
      // Error al configurar la petición
      apiError.code = "REQUEST_ERROR";
      apiError.message = error.message;

      console.error("❌ Request Setup Error:", error.message);
    }

    return apiError;
  }

  // ==========================================
  // CACHE
  // ==========================================

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      if (process.env.NODE_ENV === "development") {
        console.log(`📦 Cache hit: ${key}`);
      }
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  // ==========================================
  // POKÉMON
  // ==========================================

  /**
   * Obtener lista de Pokémon con paginación
   * @param limit - Cantidad de resultados (default: 20)
   * @param offset - Desde qué Pokémon empezar (default: 0)
   */
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    const cacheKey = `pokemon-list-${limit}-${offset}`;
    const cached = this.getFromCache<PokemonListResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<PokemonListResponse>(
      `/pokemon?limit=${limit}&offset=${offset}`
    );

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  /**
   * Obtener información completa de un Pokémon por nombre o ID
   * @param nameOrId - Nombre o ID del Pokémon
   */
  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const cacheKey = `pokemon-${nameOrId}`;
    const cached = this.getFromCache<Pokemon>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<Pokemon>(`/pokemon/${nameOrId}`);

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  /**
   * Obtener información de la especie de un Pokémon
   * @param nameOrId - Nombre o ID de la especie
   */
  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    const cacheKey = `species-${nameOrId}`;
    const cached = this.getFromCache<PokemonSpecies>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<PokemonSpecies>(
      `/pokemon-species/${nameOrId}`
    );

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  /**
   * Obtener la cadena evolutiva de un Pokémon
   * @param id - ID de la cadena evolutiva
   */
  async getEvolutionChain(id: number): Promise<EvolutionChain> {
    const cacheKey = `evolution-${id}`;
    const cached = this.getFromCache<EvolutionChain>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<EvolutionChain>(
      `/evolution-chain/${id}`
    );

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  // ==========================================
  // TIPOS
  // ==========================================

  /**
   * Obtener lista de tipos de Pokémon
   */
  async getTypeList(): Promise<PokemonListResponse> {
    const cacheKey = "type-list";
    const cached = this.getFromCache<PokemonListResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<PokemonListResponse>("/type");

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  /**
   * Obtener información de un tipo específico
   * @param nameOrId - Nombre o ID del tipo
   */
  async getType(nameOrId: string | number): Promise<Type> {
    const cacheKey = `type-${nameOrId}`;
    const cached = this.getFromCache<Type>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<Type>(`/type/${nameOrId}`);

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  // ==========================================
  // HABILIDADES
  // ==========================================

  /**
   * Obtener lista de habilidades
   */
  async getAbilityList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    const cacheKey = `ability-list-${limit}-${offset}`;
    const cached = this.getFromCache<PokemonListResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<PokemonListResponse>(
      `/ability?limit=${limit}&offset=${offset}`
    );

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  /**
   * Obtener información de una habilidad específica
   * @param nameOrId - Nombre o ID de la habilidad
   */
  async getAbility(nameOrId: string | number): Promise<Ability> {
    const cacheKey = `ability-${nameOrId}`;
    const cached = this.getFromCache<Ability>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<Ability>(`/ability/${nameOrId}`);

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  // ==========================================
  // MOVIMIENTOS
  // ==========================================

  /**
   * Obtener lista de movimientos
   */
  async getMoveList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    const cacheKey = `move-list-${limit}-${offset}`;
    const cached = this.getFromCache<PokemonListResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<PokemonListResponse>(
      `/move?limit=${limit}&offset=${offset}`
    );

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  /**
   * Obtener información de un movimiento específico
   * @param nameOrId - Nombre o ID del movimiento
   */
  async getMove(nameOrId: string | number): Promise<Move> {
    const cacheKey = `move-${nameOrId}`;
    const cached = this.getFromCache<Move>(cacheKey);
    if (cached) return cached;

    const response = await this.instance.get<Move>(`/move/${nameOrId}`);

    this.setCache(cacheKey, response.data);
    return response.data;
  }

  // ==========================================
  // UTILIDADES
  // ==========================================

  /**
   * Buscar Pokémon por nombre (búsqueda simple)
   * @param query - Término de búsqueda
   */
  async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      // La PokéAPI no tiene búsqueda nativa, intentamos obtener por nombre exacto
      const pokemon = await this.getPokemon(query.toLowerCase());
      return [pokemon];
    } catch (error) {
      // Si no se encuentra, retornamos array vacío
      return [];
    }
  }

  /**
   * Obtener Pokémon aleatorio
   */
  async getRandomPokemon(): Promise<Pokemon> {
    // Hay 1010 Pokémon en la PokéAPI (Gen 1-9)
    const randomId = Math.floor(Math.random() * 1010) + 1;
    return this.getPokemon(randomId);
  }

  /**
   * Limpiar cache manualmente
   */
  clearAllCache(): void {
    this.clearCache();
    console.log("🗑️ Cache cleared");
  }

  /**
   * Configurar duración del cache
   * @param duration - Duración en milisegundos
   */
  setCacheDuration(duration: number): void {
    this.cacheDuration = duration;
  }

  /**
   * Obtener instancia de axios para peticiones personalizadas
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// ============================================
// EXPORTAR INSTANCIA SINGLETON
// ============================================

export const pokemonService = new PokemonService();

// Exportar también la clase para casos especiales
export default PokemonService;
