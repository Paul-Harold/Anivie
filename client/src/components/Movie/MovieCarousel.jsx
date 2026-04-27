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
        <h2 className="text-xl font-bold text-ani-text border-l-4 border-[#90cea1] pl-2">{title}</h2>
        {categoryLink && (
          <Link to={categoryLink} className="text-ani-subtext text-sm font-semibold hover:text-white transition-colors">
            View All
          </Link>
        )}
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
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
              <div className="h-[200px] overflow-hidden rounded-lg mb-2 relative shadow-lg bg-ani-dark">
                {movie.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-ani-text line-clamp-2 mb-2" title={movie.title}>
                {movie.title}
              </h3>
              
              {/* Dynamic Add to List Button */}
              <button 
                onClick={(e) => handleAddClick(e, movie)}
                disabled={isAdding}
                className={`mt-auto w-full py-1.5 rounded text-xs font-bold transition-colors flex justify-center items-center gap-2 ${
                  isAdding 
                    ? 'bg-[#90cea1] text-[#0d253f] cursor-not-allowed opacity-90' 
                    : 'bg-[#0d253f] border border-[#90cea1] text-[#90cea1] hover:bg-[#90cea1] hover:text-[#0d253f]'
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