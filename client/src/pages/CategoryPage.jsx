import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CategoryPage({ onAnimeAdded }) {
  const { type } = useParams();
  const [animeList, setAnimeList] = useState([]);
  
  // 🚨 NEW: Pagination States
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Helps prevent spam-clicking

  const categoryConfig = {
    trending: {
      title: "Trending Now",
      endpoint: "https://api.jikan.moe/v4/top/anime?filter=airing&limit=24"
    },
    popular: {
      title: "All Time Popular",
      endpoint: "https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=24"
    },
    top100: {
      title: "Top Anime",
      endpoint: "https://api.jikan.moe/v4/top/anime?limit=24"
    }
  };

  const currentCategory = categoryConfig[type] || categoryConfig.trending;

  // 🚨 NEW: If the user switches from "Trending" to "Popular", reset back to Page 1
  useEffect(() => {
    setPage(1);
  }, [type]);

  useEffect(() => {
    setIsLoading(true);
    
    // 🚨 NEW: We dynamically attach the current page number to the API URL
    const fetchUrl = `${currentCategory.endpoint}&page=${page}`;

    axios.get(fetchUrl)
      .then((response) => {
        setAnimeList(response.data.data);
        setHasNextPage(response.data.pagination.has_next_page);
        setTotalPages(response.data.pagination.last_visible_page); 
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
        setIsLoading(false);
      });
  }, [type, page]); // This runs whenever the URL changes OR the page number changes

  const handleAddToDatabase = async (anime) => {
    const newAnimeData = {
      apiId: anime.mal_id,
      title: anime.title_english || anime.title,
      posterUrl: anime.images.jpg.image_url,
      mediaType: anime.type,
      watchStatus: "Plan to Watch",
      userRating: 0
    };

    try {
      const response = await axios.post('https://anivie-backend.vercel.app/api/watchlist', newAnimeData);
      onAnimeAdded(response.data);
      alert(`Added ${newAnimeData.title} to your watchlist!`);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const getPageNumbers = () => {
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // Adjust if we are near the end
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
          <Link to="/" className="text-ani-blue hover:text-white transition-colors font-bold flex items-center gap-2">
            ← Back Home
          </Link>
          <h1 className="text-3xl font-bold text-ani-text border-l-2 border-gray-700 pl-4">
            {currentCategory.title}
          </h1>
        </div>
        
        {/* Top Page Indicator */}
        <div className="text-ani-subtext font-semibold bg-ani-card px-4 py-2 rounded-lg">
          Page {page}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-ani-blue text-xl font-bold animate-pulse">Loading Anime...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {animeList.map((anime, index) => (
            <div key={`${anime.mal_id}-${index}`} className="bg-ani-card rounded-lg overflow-hidden flex flex-col group shadow-lg">
              <div className="h-[240px] overflow-hidden relative">
                <img src={anime.images.jpg.image_url} alt="poster" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <p className="text-xs font-bold text-ani-text mb-3 line-clamp-2">{anime.title_english || anime.title}</p>
                <button 
                  onClick={() => handleAddToDatabase(anime)}
                  className="mt-auto w-full py-1.5 bg-ani-blue text-white rounded text-xs font-bold transition-colors hover:bg-blue-400"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🚨 NEW: Pagination Controls at the bottom */}
      {/* 🚨 NEW: Numbered Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8 flex-wrap">
          
          {/* Previous Button */}
          <button 
            onClick={() => setPage(prev => prev - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-ani-card text-ani-text font-bold rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Prev
          </button>
          
          {/* First Page Jump (if we scrolled far away) */}
          {getPageNumbers()[0] > 1 && (
            <>
              <button 
                onClick={() => setPage(1)}
                className="w-10 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded hover:bg-gray-700 transition-colors"
              >
                1
              </button>
              <span className="text-ani-subtext px-2">...</span>
            </>
          )}

          {/* Dynamic Page Numbers */}
          {getPageNumbers().map(pageNum => (
            <button 
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-10 h-10 flex items-center justify-center font-bold rounded transition-colors ${
                page === pageNum 
                  ? 'bg-ani-blue text-white shadow-lg shadow-ani-blue/20' // Active page styling
                  : 'bg-ani-dark text-ani-text hover:bg-gray-700'        // Inactive page styling
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Last Page Jump (if there are more pages ahead) */}
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              <span className="text-ani-subtext px-2">...</span>
              <button 
                onClick={() => setPage(totalPages)}
                className="px-3 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded hover:bg-gray-700 transition-colors text-xs"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button 
            onClick={() => setPage(prev => prev + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-ani-card text-ani-text font-bold rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

export default CategoryPage;