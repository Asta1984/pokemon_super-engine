import { create } from 'zustand';
import axios from 'axios';

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
  error: string | null;
  loadMore: (pokemonNames: string[], limit?: number) => Promise<void>;
  reset: () => void;
}

// Create the zustand store
const usePokemonDetailStore = create<PokemonDetailState>((set, get) => ({
  details: [],
  currentIndex: 0,
  loading: false,
  error: null,
  loadMore: async (pokemonNames: string[], limit = 20) => {
    const { currentIndex, details } = get();
    
    // If we have already loaded all names, do nothing
    if (currentIndex >= pokemonNames.length) return;

    set({ loading: true, error: null });
    
    // Determine the next set of names to load
    const namesToLoad = pokemonNames.slice(currentIndex, currentIndex + limit);

    try {
      // Fetch all details in parallel
      const promises = namesToLoad.map((name) =>
        axios.get<PokemonDetail>(`https://3.142.188.160/pokemon/${name}`)
      );
      
      const results = await Promise.allSettled(promises);
      const newDetails = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map((result) => result.value.data);

      // Update the store state by appending new details and moving the pointer forward
      set({
        details: [...details, ...newDetails],
        currentIndex: currentIndex + limit,
        loading: false
      });
    } catch (error) {
      console.error('Error loading pokemon details:', error);
      set({ 
        loading: false, 
        error: 'Failed to load Pokémon details. Please try again.' 
      });
    }
  },
  // Reset the detail store when changing generation
  reset: () => set({ details: [], currentIndex: 0, error: null }),
}));

export default usePokemonDetailStore;