import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// We grab the hidden key securely from your .env file
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function MovieCarousel({ title, endpoint, delay = 0, categoryLink, onAdd }) {
  const [movieList, setMovieList] = useState([]);
  
  // All hooks safely declared at the top level of the component!
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 🚨 Notice how we dynamically build the TMDB URL here
      axios.get(`${TMDB_BASE_URL}${endpoint}?api_key=${API_KEY}`)
        .then((response) => setMovieList(response.data.results))
        .catch((error) => console.error(`Error fetching ${title}:`, error));
    }, delay);

    return () => clearTimeout(timer);
  }, [endpoint, delay]);

  // The async click handler for the Add button
  const handleAddClick = async (e, movie) => {
    e.stopPropagation(); // Protect the card click!
    setAddingId(movie.id); 
    
    try {
      await onAdd(movie);
    } catch (error) {
      console.error("Failed to add:", error);
    } finally {
      setAddingId(null); 
    }
  };

  return (
    <div className="mb-10">
      
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-ani-text border-l-4 border-ani-movie pl-3">{title}</h2>
        {categoryLink && (
          <Link to={categoryLink} className="group/all flex items-center gap-1 text-ani-subtext text-sm font-semibold hover:text-white transition-colors">
            View All
            <svg className="w-4 h-4 transition-transform group-hover/all:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Link>
        )}
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x scroll-smooth">
        {/* Skeleton placeholders while the API call is in flight */}
        {movieList.length === 0 && Array.from({ length: 8 }).map((_, i) => (
          <div key={`skel-${i}`} className="min-w-[140px] max-w-[140px] flex flex-col">
            <div className="h-[200px] rounded-lg mb-2 skeleton" />
            <div className="h-3 w-3/4 rounded skeleton mb-2" />
            <div className="h-7 w-full rounded skeleton mt-auto" />
          </div>
        ))}

        {movieList.map((movie, index) => {
          // Check if THIS specific movie is loading
          const isAdding = addingId === movie.id;

          return (
            <div 
              key={`${movie.id}-${index}`} 
              className="min-w-[140px] max-w-[140px] snap-start flex flex-col group cursor-pointer"
              // Click the card to navigate to details
              onClick={() => navigate(`/details/movie/${movie.id}`)}
            >
              <div className="h-[200px] overflow-hidden rounded-lg mb-2 relative shadow-card bg-ani-dark ring-1 ring-white/5 transition-all duration-300 group-hover:ring-ani-movie/50 group-hover:shadow-card-hover group-hover:-translate-y-1">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xs text-gray-500">
                    No Image
                  </div>
                )}
                {typeof movie.vote_average === 'number' && movie.vote_average > 0 && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-[#f5c518] text-[11px] font-bold px-1.5 py-0.5 rounded-md tabular-nums">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" /></svg>
                    {movie.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-ani-text line-clamp-2 mb-2 transition-colors group-hover:text-ani-movie" title={movie.title}>
                {movie.title}
              </h3>

              {/* Dynamic Add to List Button */}
              <button
                onClick={(e) => handleAddClick(e, movie)}
                disabled={isAdding}
                className={`mt-auto w-full py-1.5 rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-2 active:scale-95 ${
                  isAdding
                    ? 'bg-ani-movie text-ani-dark cursor-not-allowed opacity-90'
                    : 'bg-ani-movie/10 border border-ani-movie/60 text-ani-movie hover:bg-ani-movie hover:text-ani-dark'
                }`}
              >
                {isAdding ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-[#0d253f]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  '+ Add Movie'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MovieCarousel;