import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function AnimeCarousel({ title, apiEndpoint, onAdd, delay = 0, categoryLink }) {
  const [animeList, setAnimeList] = useState([]);
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      axios.get(apiEndpoint)
        .then((response) => setAnimeList(response.data.data))
        .catch((error) => console.error(`Error fetching ${title}:`, error));
    }, delay);

    return () => clearTimeout(timer);
  }, [apiEndpoint, delay]);

  const handleAddClick = async (e, anime) => {
    e.stopPropagation(); // Stop the card click
    setAddingId(anime.mal_id); // Set the loading state for THIS specific card
    
    try {
      await onAdd(anime); // Wait for the parent component to finish saving to MongoDB
    } catch (error) {
      console.error("Failed to add:", error);
    } finally {
      setAddingId(null); // Turn the loading state off
    }
  };

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
        {animeList.map((anime, index) => {
          const isAdding = addingId === anime.mal_id;

          return (
          <div 
            key={`${anime.mal_id}-${index}`} 
            className="min-w-[140px] max-w-[140px] snap-start flex flex-col group cursor-pointer"
            onClick={() => navigate(`/details/anime/${anime.mal_id}`)}
          >
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
                onClick={(e) => handleAddClick(e, anime)}
                disabled={isAdding}
                className={`mt-auto w-full py-1.5 border rounded text-xs font-bold transition-colors flex justify-center items-center gap-2 ${
                  isAdding 
                    ? 'bg-blue-400 border-blue-400 text-white cursor-not-allowed' 
                    : 'bg-[#0d253f] border-ani-blue text-ani-blue hover:bg-ani-blue hover:text-[#0d253f]'
                }`}
              >
                {isAdding ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  '+ Add to List'
                )}
              </button>
          </div>
        )})}
      </div>
    </div>
  );
}

export default AnimeCarousel;