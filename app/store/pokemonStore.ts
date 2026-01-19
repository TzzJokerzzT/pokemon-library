import { addToast } from "@heroui/react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { pokemonService } from "../utils/PokemonService";
import { PokemonState } from "./types";

export const usePokemonStore = create<PokemonState>()(
  devtools(
    persist(
      (set, get) => ({
        pokemonList: [],
        isLoading: false,
        error: null,

        getPokemonList: async () => {
          set({ isLoading: true, error: null });

          try {
            const response = await pokemonService.getPokemonList();
            set({
              pokemonList: response.results,
              isLoading: false,
              error: null,
            });
          } catch (err) {
            const error = err as Error;
            addToast({
              color: "danger",
              description: error.message,
              variant: "flat",
            });
          }
        },
      }),
      {
        name: "pokemon-store",
        partialize: (state) => ({
          pokemonList: state.pokemonList,
        }),
      },
    ),
    { name: "PokemonStore" },
  ),
);
