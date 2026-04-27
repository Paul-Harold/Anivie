import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function MovieSearchAndFilter({ onAdd }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // 🚨 NEW: Pagination & Active Search State
  const [activeParams, setActiveParams] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const genres = [
    { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" }, { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" }, { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(45), (val, index) => currentYear - index);

  // 🚨 UPDATED: The button now just sets the active parameters and resets to page 1
  const handleUnifiedSearch = (e) => {
    e.preventDefault();
    setActiveParams({ query, genre, year, sortBy });
    setPage(1);
  };

  // 🚨 NEW: This effect runs whenever the page or the search terms change
  useEffect(() => {
    if (!activeParams) return;

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        let validMovies = [];
        let total = 1;

        if (activeParams.query.trim()) {
          let searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${activeParams.query}&page=${page}`;
          if (activeParams.year) searchUrl += `&primary_release_year=${activeParams.year}`;
          
          const response = await axios.get(searchUrl);
          validMovies = response.data.results.filter(movie => movie.poster_path);
          total = response.data.total_pages;

          if (activeParams.genre) {
            validMovies = validMovies.filter(movie => movie.genre_ids.includes(Number(activeParams.genre)));
          }
        } else {
          let discoverUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${activeParams.sortBy}&page=${page}`;
          if (activeParams.genre) discoverUrl += `&with_genres=${activeParams.genre}`;
          if (activeParams.year) discoverUrl += `&primary_release_year=${activeParams.year}`;

          const response = await axios.get(discoverUrl);
          validMovies = response.data.results.filter(movie => movie.poster_path);
          total = response.data.total_pages;
        }

        setResults(validMovies);
        setTotalPages(Math.min(total, 500)); // TMDB caps pagination at 500
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [activeParams, page]);

  const clearResults = () => {
    setResults([]);
    setActiveParams(null);
    setQuery('');
    setGenre('');
    setYear('');
    setPage(1);
  };

  // 🚨 NEW: Pagination Window Math
  const getPageNumbers = () => {
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="mb-10">
      <form onSubmit={handleUnifiedSearch} className="flex flex-wrap items-end gap-4 bg-ani-card p-5 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col flex-grow min-w-[200px]">
          <label className="text-ani-subtext text-xs font-bold mb-2">Search</label>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Any movie..." className="bg-ani-dark text-ani-text p-2.5 rounded outline-none border border-gray-700 focus:border-[#90cea1] transition-colors" />
        </div>
        <div className="flex flex-col min-w-[140px]">
          <label className="text-ani-subtext text-xs font-bold mb-2">Genres</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="bg-ani-dark text-ani-subtext p-2.5 rounded outline-none border border-gray-700 cursor-pointer focus:border-[#90cea1]">
            <option value="">Any</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col min-w-[120px]">
          <label className="text-ani-subtext text-xs font-bold mb-2">Year</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="bg-ani-dark text-ani-subtext p-2.5 rounded outline-none border border-gray-700 cursor-pointer focus:border-[#90cea1]">
            <option value="">Any</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex flex-col min-w-[150px]">
          <label className="text-ani-subtext text-xs font-bold mb-2">Sort</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-ani-dark text-ani-subtext p-2.5 rounded outline-none border border-gray-700 cursor-pointer focus:border-[#90cea1]">
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
          </select>
        </div>
        <button type="submit" disabled={isSearching} className="h-[46px] px-8 bg-[#0d253f] text-[#90cea1] border border-[#90cea1] rounded font-bold hover:bg-[#90cea1] hover:text-[#0d253f] transition-colors disabled:opacity-50">
          {isSearching ? '...' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="mb-8 bg-ani-card p-6 rounded-lg shadow-lg">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-ani-text border-l-4 border-[#90cea1] pl-2">Search Results</h3>
              <button onClick={clearResults} className="text-ani-subtext text-xs hover:text-white">Clear Results</button>
           </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {results.map((movie) => (
              <div 
                key={movie.id} 
                className="bg-ani-dark rounded-lg overflow-hidden flex flex-col group shadow-md border border-gray-800 cursor-pointer"
                onClick={() => navigate(`/details/movie/${movie.id}`)}
              >
                <div className="h-[240px] relative overflow-hidden bg-gray-900">
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="poster" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <p className="text-xs font-bold text-ani-text mb-1 line-clamp-2" title={movie.title}>{movie.title}</p>
                  <p className="text-[10px] text-ani-subtext mb-2">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} • ⭐ {movie.vote_average.toFixed(1)}</p>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onAdd(movie); 
                    }} 
                    className="mt-auto w-full py-1.5 bg-[#0d253f] border border-[#90cea1] text-[#90cea1] rounded text-xs font-bold transition-colors hover:bg-[#90cea1] hover:text-[#0d253f]"
                  >
                    + Add to List
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🚨 NEW: The Pagination UI controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button onClick={() => setPage(prev => prev - 1)} disabled={page === 1} className="px-4 py-2 bg-ani-dark text-ani-text font-bold rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors border border-gray-700">Prev</button>
              {getPageNumbers()[0] > 1 && (<><button onClick={() => setPage(1)} className="w-10 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded hover:bg-gray-700 transition-colors border border-gray-700">1</button><span className="text-ani-subtext px-2">...</span></>)}
              {getPageNumbers().map(pageNum => (
                <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-10 h-10 flex items-center justify-center font-bold rounded transition-colors border ${page === pageNum ? 'bg-[#90cea1] border-[#90cea1] text-[#0d253f]' : 'bg-ani-dark border-gray-700 text-ani-text hover:bg-gray-700'}`}>{pageNum}</button>
              ))}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (<><span className="text-ani-subtext px-2">...</span><button onClick={() => setPage(totalPages)} className="px-3 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded hover:bg-gray-700 transition-colors border border-gray-700 text-xs">{totalPages}</button></>)}
              <button onClick={() => setPage(prev => prev + 1)} disabled={page === totalPages} className="px-4 py-2 bg-ani-dark text-ani-text font-bold rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors border border-gray-700">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieSearchAndFilter;