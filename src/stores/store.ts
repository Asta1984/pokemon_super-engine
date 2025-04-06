import { create } from 'zustand';
import axios from 'axios';

// Define the interface for a Pokémon object returned from the API
interface Pokemon {
  name: string;
  url: string;
}

// Define the state interface for the store
interface PokemonState {
  generation: number;
  pokemons: string[];
  fetchPokemons: (gen: number) => Promise<void>;
}

// Create the zustand store
const usePokemonStore = create<PokemonState>((set) => ({
  generation: 1,
  pokemons: [],
  fetchPokemons: async (gen: number) => {
    try {
      const response = await axios.get<Pokemon[]>(
        `https://backend-poke-production.up.railway.app/generation/${gen}`
      );
      const names = response.data.map((pokemon) => pokemon.name);
      set({ pokemons: names, generation: gen });
    } catch (error) {
      console.error(`Error fetching generation ${gen} pokemons:`, error);
    }
  },
}));

export default usePokemonStore;
