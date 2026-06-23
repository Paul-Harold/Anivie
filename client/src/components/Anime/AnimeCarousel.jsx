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
        <h2 className="text-xl font-bold text-ani-text border-l-4 border-ani-blue pl-3">{title}</h2>
        {categoryLink && (
          <Link to={categoryLink} className="group/all flex items-center gap-1 text-ani-subtext text-sm font-semibold hover:text-white transition-colors">
            View All
            <svg className="w-4 h-4 transition-transform group-hover/all:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Link>
        )}
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x scroll-smooth">
        {/* Skeleton placeholders while the API call is in flight */}
        {animeList.length === 0 && Array.from({ length: 8 }).map((_, i) => (
          <div key={`skel-${i}`} className="min-w-[140px] max-w-[140px] flex flex-col">
            <div className="h-[200px] rounded-lg mb-2 skeleton" />
            <div className="h-3 w-3/4 rounded skeleton mb-2" />
            <div className="h-7 w-full rounded skeleton mt-auto" />
          </div>
        ))}

        {animeList.map((anime, index) => {
          const isAdding = addingId === anime.mal_id;

          return (
          <div
            key={`${anime.mal_id}-${index}`}
            className="min-w-[140px] max-w-[140px] snap-start flex flex-col group cursor-pointer"
            onClick={() => navigate(`/details/anime/${anime.mal_id}`)}
          >
            <div className="h-[200px] overflow-hidden rounded-lg mb-2 relative shadow-card bg-ani-dark ring-1 ring-white/5 transition-all duration-300 group-hover:ring-ani-blue/50 group-hover:shadow-card-hover group-hover:-translate-y-1">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gradient scrim for legibility of the score badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {anime.score && (
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-[#f5c518] text-[11px] font-bold px-1.5 py-0.5 rounded-md tabular-nums">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" /></svg>
                  {anime.score}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-ani-text line-clamp-2 mb-2 transition-colors group-hover:text-ani-blue" title={anime.title_english || anime.title}>
              {anime.title_english || anime.title}
            </h3>
<button
                onClick={(e) => handleAddClick(e, anime)}
                disabled={isAdding}
                className={`mt-auto w-full py-1.5 border rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-2 active:scale-95 ${
                  isAdding
                    ? 'bg-blue-400 border-blue-400 text-white cursor-not-allowed'
                    : 'bg-ani-blue/10 border-ani-blue/60 text-ani-blue hover:bg-ani-blue hover:text-ani-dark'
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