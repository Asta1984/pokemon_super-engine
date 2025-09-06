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
  loading: boolean;
  error: string | null;
  fetchPokemons: (gen: number) => Promise<void>;
}

// Create the zustand store
const usePokemonStore = create<PokemonState>((set) => ({
  generation: 1,
  pokemons: [],
  loading: false,
  error: null,
  fetchPokemons: async (gen: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Pokemon[]>(
        `https://sewantika.duckdns.org/generation/${gen}`
      );
      const names = response.data.map((pokemon) => pokemon.name);
      set({ pokemons: names, generation: gen, loading: false });
    } catch (error) {
      console.error(`Error fetching generation ${gen} pokemons:`, error);
      set({ 
        error: `Failed to fetch generation ${gen} Pokémon. Please try again.`, 
        loading: false 
      });
    }
  },
}));

export default usePokemonStore;