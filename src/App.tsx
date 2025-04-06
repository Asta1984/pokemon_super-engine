import {useState, useEffect } from 'react';
import usePokemonStore from './stores/store';
import PokemonList from './components/PokemonList';

export default function App() {
  const { generation, pokemons, fetchPokemons } = usePokemonStore();
  const [selectedGen, setSelectedGen] = useState<number>(1);

  useEffect(() => {
    fetchPokemons(selectedGen);
  }, [selectedGen, fetchPokemons]);

  return (
    <>
        <div>
      <h1>Generation {generation} Pokémon</h1>
      <select
        value={selectedGen}
        onChange={(e) => setSelectedGen(Number(e.target.value))}
      >
        {[...Array(9)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            Generation {i + 1}
          </option>
        ))}
      </select>

      <ul>
        {pokemons.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>

    </div>
    <PokemonList/>
    </>
  );
}
