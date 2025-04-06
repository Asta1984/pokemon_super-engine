import { create } from 'zustand';
import axios from 'axios';
import usePokemonStore from './store';

// Define the interface for a Pokémon detail object returned from the API
export interface PokemonDetail {
  name: string;
  height: number;
  weight: number;
  abilities: string[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  types: string[];
  species: string;
  main_image: string;
  evolutions: string[];
  sprites: {
    default: string;
    shiny: string;
    official_artwork: {
      front_default: string;
      front_shiny: string;
    };
    dream_world: {
      front_default: string;
      front_female: string | null;
    };
  };
}

// Define the state interface for the detailed store
interface PokemonDetailState {
  details: PokemonDetail[];
  currentIndex: number; // Pointer to the next pokemon to load
  loading: boolean;
  loadMore: (limit?: number) => Promise<void>;
  reset: () => void;
}

// Create the zustand store
const usePokemonDetailStore = create<PokemonDetailState>((set, get) => ({
  details: [],
  currentIndex: 0,
  loading: false,
  loadMore: async (limit = 50) => {
    // Get the list of pokemon names from the first store
    const { pokemons } = usePokemonStore.getState();
    const { currentIndex, details } = get();
    // If we have already loaded all names, do nothing
    if (currentIndex >= pokemons.length) return;

    set({ loading: true });
    // Determine the next set of names to load
    const namesToLoad = pokemons.slice(currentIndex, currentIndex + limit);

    try {
      // Fetch all details in parallel
      const promises = namesToLoad.map((name) =>
        axios.get<PokemonDetail>(`https://backend-poke-production.up.railway.app/pokemon/${name}`)
      );
      const responses = await Promise.all(promises);
      const newDetails = responses.map((response) => response.data);

      // Update the store state by appending new details and moving the pointer forward
      set({
        details: [...details, ...newDetails],
        currentIndex: currentIndex + limit,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading pokemon details:', error);
      set({ loading: false });
    }
  },
  // Reset the detail store if needed (for example, when changing generation)
  reset: () => set({ details: [], currentIndex: 0 }),
}));

export default usePokemonDetailStore;
