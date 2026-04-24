import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// We grab the hidden key securely from your .env file
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function MovieCarousel({ title, endpoint, delay = 0, categoryLink, onAdd }) {
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 🚨 Notice how we dynamically build the TMDB URL here
      axios.get(`${TMDB_BASE_URL}${endpoint}?api_key=${API_KEY}`)
        .then((response) => setMovieList(response.data.results))
        .catch((error) => console.error(`Error fetching ${title}:`, error));
    }, delay);

    return () => clearTimeout(timer);
  }, [endpoint, delay]);

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
        {movieList.map((movie) => (
          <div key={movie.id} className="min-w-[140px] max-w-[140px] snap-start flex flex-col group">
            <div className="h-[200px] overflow-hidden rounded-lg mb-2 relative shadow-lg bg-ani-dark">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <h3 className="text-sm font-semibold text-ani-text line-clamp-2 mb-2" title={movie.title}>
              {movie.title}
            </h3>
            <button 
              onClick={() => onAdd(movie)}
              className="mt-auto w-full py-1.5 bg-[#0d253f] border border-[#90cea1] text-[#90cea1] rounded text-xs font-bold transition-colors hover:bg-[#90cea1] hover:text-[#0d253f]"
            >
              + Add Movie
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieCarousel;