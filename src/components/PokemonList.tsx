import React, { useEffect, useCallback } from 'react';
import usePokemonStore from '../stores/store';
import usePokemonDetailStore from '../stores/pokemonDetailStore';

const PokemonList: React.FC = () => {
  const { pokemons, generation } = usePokemonStore();
  const { details, loadMore, loading, reset } = usePokemonDetailStore();

  // Reset details when generation changes
  useEffect(() => {
    reset();
    if (pokemons.length > 0) {
      loadMore(pokemons);
    }
  }, [generation, pokemons, reset, loadMore]);

  // Scroll handler for infinite loading
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      // Load more when scrolled to within 100px of the bottom
      if (scrollHeight - scrollTop - clientHeight < 100 && !loading && pokemons.length > 0) {
        loadMore(pokemons);
      }
    },
    [loadMore, loading, pokemons]
  );

  return (
    <div 
      style={{ 
        height: '80vh', 
        overflowY: 'auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '20px'
      }} 
      onScroll={handleScroll}
    >
      {details.length === 0 && !loading && (
        <p>No Pokémon to display. Select a generation to get started.</p>
      )}
      
      {details.map((detail) => (
        <div 
          key={detail.name} 
          style={{ 
            border: '1px solid #ccc', 
            margin: '16px 0', 
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h2 style={{ textTransform: 'capitalize' }}>{detail.name}</h2>
          {detail.sprites.default && (
            <img 
              src={detail.sprites.default} 
              alt={detail.name} 
              style={{ 
                maxWidth: '120px', 
                maxHeight: '120px',
                margin: '10px 0'
              }} 
            />
          )}
          <div style={{ width: '100%', marginTop: '10px' }}>
            <p><strong>Height:</strong> {detail.height} | <strong>Weight:</strong> {detail.weight}</p>
            <p><strong>Abilities:</strong> {detail.abilities.join(', ')}</p>
            <p><strong>Types:</strong> {detail.types.join(', ')}</p>
          </div>
        </div>
      ))}
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading more Pokémon...</p>
        </div>
      )}
    </div>
  );
};

export default PokemonList;