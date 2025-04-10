import { PokemonDetail } from '../stores/pokemonDetailStore';

interface PokemonCardProps {
  detail: PokemonDetail;
}

export function PokemonCard({ detail }: PokemonCardProps) {
  const imageUrl = detail.sprites.dream_world.front_default ||
    detail.sprites.official_artwork.front_default ||
    detail.sprites.default;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition-transform hover:scale-[1.02]">
      <h2 className="text-xl font-semibold text-gray-800 capitalize text-center mb-4">
        {detail.name}
      </h2>
      
      {imageUrl && (
        <div className="flex justify-center mb-4">
          <img 
            src={imageUrl}
            alt={detail.name}
            className="h-48 w-48 object-contain"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="space-y-2 text-gray-600">
        <div className="flex justify-between">
          <span className="font-medium">Height:</span>
          <span>{detail.height}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Weight:</span>
          <span>{detail.weight}</span>
        </div>
        <div>
          <span className="font-medium">Abilities:</span>
          <p className="mt-1 text-sm">{detail.abilities.join(', ')}</p>
        </div>
        <div>
          <span className="font-medium">Types:</span>
          <div className="flex gap-2 mt-1 flex-wrap">
            {detail.types.map(type => (
              <span 
                key={type}
                className="px-2 py-1 text-xs rounded-full bg-gray-100"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}