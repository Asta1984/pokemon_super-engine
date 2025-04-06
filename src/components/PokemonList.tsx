import React, { useEffect, useCallback } from 'react';
import usePokemonDetailStore from '../stores/pokemonDetailStore';

const PokemonList: React.FC = () => {
  const { details, loadMore, loading } = usePokemonDetailStore();

  // Initial load on mount
  useEffect(() => {
    loadMore();
  }, [loadMore]);

  // Example scroll handler: adjust based on your container or use IntersectionObserver for better performance
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      // Load more when scrolled to within 100px of the bottom
      if (scrollHeight - scrollTop - clientHeight < 100 && !loading) {
        loadMore();
      }
    },
    [loadMore, loading]
  );

  return (
    <div style={{ height: '80vh', overflowY: 'auto' }} onScroll={handleScroll}>
      {details.map((detail) => (
        <div key={detail.name} style={{ border: '1px solid #ccc', margin: '8px', padding: '8px' }}>
          <h2>{detail.name}</h2>
          <img src={detail.sprites.default} alt={detail.name} />
          <p>Height: {detail.height} | Weight: {detail.weight}</p>
          <p>Abilities: {detail.abilities.join(', ')}</p>
        </div>
      ))}
      {loading && <p>Loading more Pokémon...</p>}
    </div>
  );
};

export default PokemonList;
