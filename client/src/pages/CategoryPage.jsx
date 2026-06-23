import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function CategoryPage() {
  const { type } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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
    if (!user) {
      alert("Please log in or create an account to start building your library!");
      navigate('/auth');
      return;
    }
    const newAnimeData = {
      apiId: anime.mal_id,
      title: anime.title_english || anime.title,
      posterUrl: anime.images.jpg.image_url,
      mediaType: anime.type,
      watchStatus: "Plan to Watch",
      userRating: 0
    };

    try {
      await axios.post('https://anivie-backend.vercel.app/api/watchlist', newAnimeData);
      alert(`Added ${newAnimeData.title} to your watchlist!`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(`${newAnimeData.title} is already in your list!`);
      } else {
        console.error("Error saving:", error);
        alert("Failed to add item.");
      }
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

    
    <div className="max-w-6xl mx-auto py-6 px-4 animate-fade-in">

      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-ani-blue hover:text-white transition-colors font-bold flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back Home
          </Link>
          <h1 className="text-3xl font-black text-ani-text border-l-4 border-ani-blue pl-4">
            {currentCategory.title}
          </h1>
        </div>

        {/* Top Page Indicator */}
        <div className="text-ani-subtext font-semibold bg-ani-card border border-ani-border px-4 py-2 rounded-lg tabular-nums">
          Page {page}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={`skel-${i}`} className="bg-ani-card rounded-lg overflow-hidden flex flex-col">
              <div className="h-[240px] skeleton" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-3 w-3/4 rounded skeleton" />
                <div className="h-7 w-full rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {animeList.map((anime, index) => (
            <div key={`${anime.mal_id}-${index}`} onClick={() => navigate(`/details/anime/${anime.mal_id}`)} className="bg-ani-card rounded-lg overflow-hidden flex flex-col group shadow-card ring-1 ring-white/5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:ring-ani-blue/50 hover:shadow-card-hover">
              <div className="h-[240px] overflow-hidden relative">
                <img src={anime.images.jpg.image_url} alt={anime.title_english || anime.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {anime.score && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-[#f5c518] text-[11px] font-bold px-1.5 py-0.5 rounded-md tabular-nums">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" /></svg>
                    {anime.score}
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <p className="text-xs font-bold text-ani-text mb-3 line-clamp-2 transition-colors group-hover:text-ani-blue">{anime.title_english || anime.title}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToDatabase(anime); }}
                  className="mt-auto w-full py-1.5 bg-ani-blue/10 border border-ani-blue/60 text-ani-blue rounded-lg text-xs font-bold transition-colors hover:bg-ani-blue hover:text-ani-dark active:scale-95"
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
        <div className="flex justify-center items-center gap-2 mt-12 mb-8 flex-wrap tabular-nums">

          {/* Previous Button */}
          <button
            onClick={() => setPage(prev => prev - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-ani-card text-ani-text font-bold rounded-lg border border-ani-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ani-elevated transition-colors"
          >
            Prev
          </button>

          {/* First Page Jump (if we scrolled far away) */}
          {getPageNumbers()[0] > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                className="w-10 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded-lg border border-ani-border hover:bg-ani-elevated transition-colors"
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
              className={`w-10 h-10 flex items-center justify-center font-bold rounded-lg border transition-colors ${
                page === pageNum
                  ? 'bg-ani-blue border-ani-blue text-ani-dark shadow-lg shadow-ani-blue/20' // Active page styling
                  : 'bg-ani-dark border-ani-border text-ani-text hover:bg-ani-elevated'        // Inactive page styling
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
                className="px-3 h-10 flex items-center justify-center bg-ani-dark text-ani-text font-bold rounded-lg border border-ani-border hover:bg-ani-elevated transition-colors text-xs"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-ani-card text-ani-text font-bold rounded-lg border border-ani-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ani-elevated transition-colors"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

export default CategoryPage;