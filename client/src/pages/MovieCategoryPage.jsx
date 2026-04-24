import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function MovieCategoryPage() {
  const { type } = useParams();
  const [movieList, setMovieList] = useState([]);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Map the URL parameter to the correct TMDB endpoint
  const categoryConfig = {
    trending: { title: "Trending Movies", endpoint: "/trending/movie/week" },
    popular: { title: "Popular Movies", endpoint: "/movie/popular" },
    toprated: { title: "Top Rated Movies", endpoint: "/movie/top_rated" },
    upcoming: { title: "Upcoming Movies", endpoint: "/movie/upcoming" }
  };

  const currentCategory = categoryConfig[type] || categoryConfig.trending;

  useEffect(() => {
    setPage(1);
  }, [type]);

  useEffect(() => {
    setIsLoading(true);
    
    // TMDB expects &page=X at the end of the URL
    axios.get(`${TMDB_BASE_URL}${currentCategory.endpoint}?api_key=${API_KEY}&page=${page}`)
      .then((response) => {
        setMovieList(response.data.results);
        // TMDB caps pagination at 500 pages to protect their servers
        setTotalPages(Math.min(response.data.total_pages, 500)); 
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      })
      .catch((error) => {
        console.error("Error fetching movie category:", error);
        setIsLoading(false);
      });
  }, [type, page]);

  const handleAddToDatabase = async (movie) => {
    const newMovieData = {
      apiId: `tmdb-${movie.id}`,
      title: movie.title,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      mediaType: "Movie",
      watchStatus: "Plan to Watch",
      userRating: 0
    };

    try {
      await axios.post('http://localhost:5000/api/watchlist', newMovieData);
      alert(`Added ${newMovieData.title} to your watchlist!`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(`${newMovieData.title} is already in your list!`);
      } else {
        alert("Failed to add movie.");
      }
    }
  };

  // Pagination Window Algorithm
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
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/movies" className="text-[#90cea1] hover:text-white transition-colors font-bold flex items-center gap-2">
            ← Back to Movies
          </Link>
          <h1 className="text-3xl font-bold text-ani-text border-l-2 border-gray-700 pl-4">
            {currentCategory.title}
          </h1>
        </div>
        <div className="text-ani-subtext font-semibold bg-ani-card px-4 py-2 rounded-lg">
          Page {page}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-[#90cea1] text-xl font-bold animate-pulse">Loading Movies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movieList.map((movie) => (
            <div key={movie.id} className="bg-ani-card rounded-lg overflow-hidden flex flex-col group shadow-lg">
              <div className="h-[280px] overflow-hidden relative bg-ani-dark">
                {movie.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="poster" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                ) : (
                   <div className="flex items-center justify-center h-full text-ani-subtext text-xs">No Image</div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <p className="text-xs font-bold text-ani-text mb-3 line-clamp-2">{movie.title}</p>
                <button 
                  onClick={() => handleAddToDatabase(movie)}
                  className="mt-auto w-full py-1.5 bg-[#0d253f] border border-[#90cea1] text-[#90cea1] rounded text-xs font-bold transition-colors hover:bg-[#90cea1] hover:text-[#0d253f]"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8 flex-wrap">
          <button onClick={() => setPage(prev => prev - 1)} disabled={page === 1} className="px-4 py-2 bg-ani-card text-ani-text font-bold rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors">
            Prev
          </button>
          
          {getPageNumbers()[0] > 1 && (
            <><button onClick={() => setPage(1)} className="w-10 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded hover:bg-gray-700 transition-colors">1</button><span className="text-ani-subtext px-2">...</span></>
          )}

          {getPageNumbers().map(pageNum => (
            <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-10 h-10 flex items-center justify-center font-bold rounded transition-colors ${page === pageNum ? 'bg-[#90cea1] text-[#0d253f]' : 'bg-ani-dark text-ani-text hover:bg-gray-700'}`}>
              {pageNum}
            </button>
          ))}

          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <><span className="text-ani-subtext px-2">...</span><button onClick={() => setPage(totalPages)} className="px-3 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded hover:bg-gray-700 transition-colors text-xs">{totalPages}</button></>
          )}

          <button onClick={() => setPage(prev => prev + 1)} disabled={page === totalPages} className="px-4 py-2 bg-ani-card text-ani-text font-bold rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieCategoryPage;