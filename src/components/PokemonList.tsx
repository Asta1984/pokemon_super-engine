import React, { useEffect, useCallback } from 'react';
import usePokemonStore from '../stores/store';
import usePokemonDetailStore from '../stores/pokemonDetailStore';
import { PokemonCard } from './PokemonCard';

export default function PokemonList() {
  const { pokemons, generation } = usePokemonStore();
  const { details, loadMore, loading, reset } = usePokemonDetailStore();

  useEffect(() => {
    reset();
    if (pokemons.length > 0) {
      loadMore(pokemons);
    }
  }, [generation, pokemons, reset, loadMore]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 100 && !loading && pokemons.length > 0) {
        loadMore(pokemons);
      }
    },
    [loadMore, loading, pokemons]
  );

  return (
    <div 
      className="h-[80vh] overflow-y-auto rounded-lg border border-gray-200 p-6 mt-5 bg-gray-50"
      onScroll={handleScroll}
    >
      {details.length === 0 && !loading && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-lg">
            No Pokémon to display. Select a generation to get started.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail) => (
          <PokemonCard key={detail.name} detail={detail} />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center py-6">
          <div className="animate-pulse text-gray-600">
            Loading more Pokémon...
          </div>
        </div>
      )}
    </div>
  );
}