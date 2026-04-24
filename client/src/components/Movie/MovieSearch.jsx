//unused


import { useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function MovieSearch({ onAdd }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return; // Don't search if the box is empty

    setIsSearching(true);
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=1`);
      // Filter out results that don't have a poster image so our grid stays beautiful
      const validMovies = response.data.results.filter(movie => movie.poster_path);
      setResults(validMovies);
    } catch (error) {
      console.error("Error searching TMDB:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mb-10">
      {/* The Search Bar Form */}
      <form onSubmit={handleSearch} className="flex gap-4 bg-ani-card p-4 rounded-lg shadow-lg mb-6 border-l-4 border-[#90cea1]">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search for any movie... (e.g. Inception, The Matrix)" 
          className="flex-1 bg-ani-dark text-ani-text p-3 rounded outline-none border border-gray-700 focus:border-[#90cea1] transition-colors"
        />
        <button 
          type="submit" 
          disabled={isSearching}
          className="bg-[#0d253f] text-[#90cea1] border border-[#90cea1] font-bold px-8 py-2 rounded hover:bg-[#90cea1] hover:text-[#0d253f] transition-colors disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* The Search Results Grid */}
      {results.length > 0 && (
        <div className="mb-8">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-ani-text">Search Results</h3>
              <button 
                onClick={() => setResults([])} 
                className="text-ani-subtext text-xs hover:text-white"
              >
                Clear Results
              </button>
           </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {results.map((movie) => (
              <div key={movie.id} className="bg-ani-card rounded-lg overflow-hidden flex flex-col group shadow-md">
                <div className="h-[240px] relative overflow-hidden bg-ani-dark">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt="poster" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <p className="text-xs font-bold text-ani-text mb-2 line-clamp-2" title={movie.title}>{movie.title}</p>
                  <p className="text-[10px] text-ani-subtext mb-3">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                  <button 
                    onClick={() => {
                      onAdd(movie);
                      setResults([]); // Optional: clear search after adding
                      setQuery('');
                    }}
                    className="mt-auto w-full py-1.5 bg-[#0d253f] text-[#90cea1] rounded text-xs font-bold transition-colors hover:bg-[#90cea1] hover:text-[#0d253f]"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;