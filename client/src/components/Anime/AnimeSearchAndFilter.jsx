import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AnimeSearchAndFilter({ onAdd }) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [orderBy, setOrderBy] = useState('members-desc');
  
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 🚨 NEW: Pagination & Active Search State
  const [activeParams, setActiveParams] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);

const handleAddClick = async (e, anime) => {
    e.stopPropagation(); // Protect the card click!
    setAddingId(anime.mal_id); 
    
    try {
      await onAdd(anime);
    } catch (error) {
      console.error("Failed to add:", error);
    } finally {
      setAddingId(null); 
    }
  };

  const genres = [
    { id: 1, name: "Action" }, { id: 2, name: "Adventure" },
    { id: 4, name: "Comedy" }, { id: 8, name: "Drama" },
    { id: 10, name: "Fantasy" }, { id: 22, name: "Romance" },
    { id: 24, name: "Sci-Fi" }, { id: 36, name: "Slice of Life" },
    { id: 30, name: "Sports" }, { id: 37, name: "Supernatural" }
  ];

  const handleUnifiedSearch = (e) => {
    e.preventDefault();
    setActiveParams({ query, genre, status, orderBy });
    setPage(1);
  };

  useEffect(() => {
    if (!activeParams) return;

    const fetchResults = async () => {
      setIsSearching(true);
      
      let url = `https://api.jikan.moe/v4/anime?sfw=true&page=${page}`;
      
      if (activeParams.query) url += `&q=${activeParams.query}`;
      if (activeParams.genre) url += `&genres=${activeParams.genre}`;
      if (activeParams.status) url += `&status=${activeParams.status}`;
      if (activeParams.orderBy) {
        const [order, sort] = activeParams.orderBy.split('-');
        url += `&order_by=${order}&sort=${sort}`;
      }

      try {
        const response = await axios.get(url);
        setResults(response.data.data);
        setTotalPages(response.data.pagination.last_visible_page);
      } catch (error) {
        console.error("Error filtering anime:", error);
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
    setStatus('');
    setPage(1);
  };

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
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Any anime..." className="bg-ani-dark text-ani-text p-2.5 rounded outline-none border border-gray-700 focus:border-ani-blue transition-colors" />
        </div>
        <div className="flex flex-col min-w-[140px]">
          <label className="text-ani-subtext text-xs font-bold mb-2">Genres</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="bg-ani-dark text-ani-subtext p-2.5 rounded outline-none border border-gray-700 cursor-pointer focus:border-ani-blue">
            <option value="">Any</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col min-w-[140px]">
          <label className="text-ani-subtext text-xs font-bold mb-2">Airing Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-ani-dark text-ani-subtext p-2.5 rounded outline-none border border-gray-700 cursor-pointer focus:border-ani-blue">
            <option value="">Any</option>
            <option value="airing">Currently Airing</option>
            <option value="complete">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
        <div className="flex flex-col min-w-[150px]">
          <label className="text-ani-subtext text-xs font-bold mb-2">Sort</label>
          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} className="bg-ani-dark text-ani-subtext p-2.5 rounded outline-none border border-gray-700 cursor-pointer focus:border-ani-blue">
            <option value="members-desc">Most Popular</option>
            <option value="score-desc">Highest Rated</option>
          </select>
        </div>
        <button type="submit" disabled={isSearching} className="h-[46px] px-8 bg-[#0d253f] border border-ani-blue text-ani-blue rounded font-bold hover:bg-ani-blue hover:text-[#0d253f] transition-colors disabled:opacity-50">
          {isSearching ? '...' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="mb-8 bg-ani-card p-6 rounded-lg shadow-lg">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-ani-text border-l-4 border-ani-blue pl-2">Search Results</h3>
              <button onClick={clearResults} className="text-ani-subtext text-xs hover:text-white">Clear Results</button>
           </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {results.map((anime) => {
              const isAdding = addingId === anime.mal_id;

          return (
              <div 
                key={anime.mal_id} 
                className="bg-ani-dark rounded-lg overflow-hidden flex flex-col group shadow-md border border-gray-800 cursor-pointer"
                onClick={() => navigate(`/details/anime/${anime.mal_id}`)}
              >
                <div className="h-[240px] relative overflow-hidden bg-gray-900">
                  <img src={anime.images.jpg.image_url} alt="poster" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <p className="text-xs font-bold text-ani-text mb-1 line-clamp-2" title={anime.title_english || anime.title}>{anime.title_english || anime.title}</p>
                  <p className="text-[10px] text-ani-subtext mb-2">{anime.year || 'N/A'} • ⭐ {anime.score || 'N/A'}</p>
                  <button 
                  onClick={(e) => handleAddClick(e, anime)}
                  disabled={isAdding}
                  className={`mt-auto w-full py-1.5 rounded text-xs font-bold transition-colors flex justify-center items-center gap-2 ${
                    isAdding 
                      ? 'bg-blue-400 text-white cursor-not-allowed' 
                      : 'bg-[#0d253f] border border-ani-blue text-ani-blue hover:bg-ani-blue hover:text-[#0d253f]'
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
              </div>
            )})}
          </div>

          {/* 🚨 NEW: The Pagination UI controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button onClick={() => setPage(prev => prev - 1)} disabled={page === 1} className="px-4 py-2 bg-ani-dark text-ani-text font-bold rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors border border-gray-700">Prev</button>
              {getPageNumbers()[0] > 1 && (<><button onClick={() => setPage(1)} className="w-10 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded hover:bg-gray-700 transition-colors border border-gray-700">1</button><span className="text-ani-subtext px-2">...</span></>)}
              {getPageNumbers().map(pageNum => (
                <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-10 h-10 flex items-center justify-center font-bold rounded transition-colors border ${page === pageNum ? 'bg-ani-blue border-ani-blue text-white' : 'bg-ani-dark border-gray-700 text-ani-text hover:bg-gray-700'}`}>{pageNum}</button>
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

export default AnimeSearchAndFilter;