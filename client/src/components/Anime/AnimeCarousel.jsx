import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AnimeCarousel({ title, apiEndpoint, onAdd, delay = 0, categoryLink }) {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      axios.get(apiEndpoint)
        .then((response) => setAnimeList(response.data.data))
        .catch((error) => console.error(`Error fetching ${title}:`, error));
    }, delay);

    return () => clearTimeout(timer);
  }, [apiEndpoint, delay]);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-ani-text border-l-4 border-ani-blue pl-2">{title}</h2>
        {categoryLink && (
          <Link to={categoryLink} className="text-ani-subtext text-sm font-semibold hover:text-white transition-colors">
            View All
          </Link>
        )}
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
        {animeList.map((anime, index) => (
          <div key={`${anime.mal_id}-${index}`} className="min-w-[140px] max-w-[140px] snap-start flex flex-col group">
            <div className="h-[200px] overflow-hidden rounded-lg mb-2 relative shadow-lg bg-ani-dark">
              <img 
                src={anime.images.jpg.image_url} 
                alt={anime.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <h3 className="text-sm font-semibold text-ani-text line-clamp-2 mb-2" title={anime.title_english || anime.title}>
              {anime.title_english || anime.title}
            </h3>
            <button 
              onClick={() => onAdd(anime)}
              className="mt-auto w-full py-1.5 bg-[#0d253f] border border-ani-blue text-ani-blue rounded text-xs font-bold transition-colors hover:bg-ani-blue hover:text-[#0d253f]"
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