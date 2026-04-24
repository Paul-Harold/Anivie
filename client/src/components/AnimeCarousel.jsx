import { useState, useEffect } from 'react';
import axios from 'axios';

function AnimeCarousel({ title, apiEndpoint, onAdd }) {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    // Fetch the data whenever this component loads
    axios.get(apiEndpoint)
      .then((response) => setAnimeList(response.data.data))
      .catch((error) => console.error(`Error fetching ${title}:`, error));
  }, [apiEndpoint]);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-ani-text mb-4">{title}</h2>
      
      {/* The Horizontal Scrolling Container */}
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
        {animeList.map((anime, index) => (
          <div key={`${anime.mal_id}-${index}`} className="min-w-[140px] max-w-[140px] snap-start flex flex-col group">
            
            {/* Poster Image with a subtle zoom hover effect */}
            <div className="h-[200px] overflow-hidden rounded-lg mb-2 relative shadow-lg">
              <img 
                src={anime.images.jpg.image_url} 
                alt={anime.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            
            {/* Title */}
            <h3 className="text-sm font-semibold text-ani-text line-clamp-2 mb-2" title={anime.title_english || anime.title}>
              {anime.title_english || anime.title}
            </h3>
            
            {/* Quick Add Button */}
            <button 
              onClick={() => onAdd(anime)}
              className="mt-auto w-full py-1.5 bg-ani-blue text-white rounded text-xs font-bold transition-colors hover:bg-blue-400"
            >
              + Add to List
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimeCarousel;