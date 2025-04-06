import { useState, useEffect } from 'react';
import usePokemonStore from './stores/store';
import PokemonList from './components/PokemonList';

export default function App() {
  const { generation, pokemons, fetchPokemons, loading } = usePokemonStore();
  const [selectedGen, setSelectedGen] = useState<number>(1);

  useEffect(() => {
    fetchPokemons(selectedGen);
  }, [selectedGen, fetchPokemons]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pokémon Explorer</h1>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-4">
        <div>
          <label htmlFor="generation" className="block mb-2 font-medium">
            Select Generation:
          </label>
          <select
            id="generation"
            value={selectedGen}
            onChange={(e) => setSelectedGen(Number(e.target.value))}
            className="border rounded p-2 min-w-40"
            disabled={loading}
          >
            {[...Array(9)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Generation {i + 1}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mt-2 sm:mt-0">
          <p className="font-medium">Generation {generation}</p>
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${pokemons.length} Pokémon available`}
          </p>
        </div>
      </div>

      <PokemonList />
    </div>
  );
}
