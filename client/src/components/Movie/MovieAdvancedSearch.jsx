//unused


import { useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function MovieAdvancedSearch({ onAdd }) {
  // State for our advanced filters
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // TMDB requires numeric IDs for genres. Here are the most popular ones:
  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" }
  ];

  // Generate an array of years from the current year down to 1980
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(45), (val, index) => currentYear - index);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    // We use the /discover endpoint for advanced filtering
    let apiUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&page=1`;
    
    if (genre) apiUrl += `&with_genres=${genre}`;
    if (year) apiUrl += `&primary_release_year=${year}`;

    try {
      const response = await axios.get(apiUrl);
      // Filter out movies missing a poster to keep the UI perfectly aligned
      const validMovies = response.data.results.filter(movie => movie.poster_path);
      setResults(validMovies.slice(0, 10)); // Limit to top 10 results for the dashboard
    } catch (error) {
      console.error("Error with advanced movie search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mb-10">
      {/* The Advanced Filter Bar */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-4 bg-ani-card p-4 rounded-lg shadow-lg mb-6 border-l-4 border-[#90cea1]">
        
        {/* Genre Dropdown */}
        <select 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)}
          className="flex-1 min-w-[150px] bg-ani-dark text-ani-subtext p-2 rounded outline-none border border-gray-700 cursor-pointer focus:border-[#90cea1] transition-colors"
        >
          <option value="">Any Genre</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {/* Year Dropdown */}
        <select 
          value={year} 
          onChange={(e) => setYear(e.target.value)}
          className="bg-ani-dark text-ani-subtext p-2 rounded outline-none border border-gray-700 cursor-pointer focus:border-[#90cea1] transition-colors"
        >
          <option value="">Any Year</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Sort By Dropdown */}
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-ani-dark text-ani-subtext p-2 rounded outline-none border border-gray-700 cursor-pointer focus:border-[#90cea1] transition-colors"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="revenue.desc">Highest Grossing</option>
        </select>

        <button 
          type="submit" 
          disabled={isSearching}
          className="bg-[#0d253f] text-[#90cea1] border border-[#90cea1] font-bold px-8 py-2 rounded hover:bg-[#90cea1] hover:text-[#0d253f] transition-colors disabled:opacity-50"
        >
          {isSearching ? 'Filtering...' : 'Filter'}
        </button>
      </form>

      {/* The Results Grid */}
      {results.length > 0 && (
        <div className="mb-8">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-ani-text">Filtered Results</h3>
              <button onClick={() => setResults([])} className="text-ani-subtext text-xs hover:text-white">Clear</button>
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
                  <p className="text-[10px] text-[#90cea1] font-bold mb-3">⭐ {movie.vote_average.toFixed(1)}/10</p>
                  <button 
                    onClick={() => {
                      onAdd(movie);
                      setResults([]); 
                      setGenre('');
                      setYear('');
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

export default MovieAdvancedSearch;