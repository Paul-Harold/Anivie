import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TopAnimeList({ onAdd, categoryLink }) {
  const [topAnime, setTopAnime] = useState([]);
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);
  
  useEffect(() => {
    // We fetch the top ranked anime. 
    // We'll limit it to 10 here so the page doesn't scroll forever!
    axios.get('https://api.jikan.moe/v4/top/anime?limit=10')
      .then((response) => setTopAnime(response.data.data))
      .catch((error) => console.error("Error fetching top anime:", error));
  }, []);

const handleAddClick = async (e, anime) => {
    e.stopPropagation(); 
    setAddingId(anime.mal_id); 
    
    try {
      await onAdd(anime);
    } catch (error) {
      console.error("Failed to add:", error);
    } finally {
      setAddingId(null); 
    }
  };

  return (
    <div className="mb-10 mt-12">
      {/* Header section with the "View All" mock link */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-ani-text border-l-4 border-ani-blue pl-3">Top Anime</h2>
        {categoryLink && (
          <button onClick={() => navigate(categoryLink)} className="group/all flex items-center gap-1 text-ani-subtext text-sm font-semibold hover:text-white transition-colors">
            View All
            <svg className="w-4 h-4 transition-transform group-hover/all:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>

      {/* The Vertical Stack of Rows */}
      <div className="flex flex-col gap-4">
        {/* Skeletons while loading */}
        {topAnime.length === 0 && Array.from({ length: 5 }).map((_, i) => (
          <div key={`skel-${i}`} className="bg-ani-card rounded-lg p-4 flex gap-4 items-center">
            <div className="w-12 h-8 rounded skeleton" />
            <div className="h-[120px] w-[85px] flex-shrink-0 rounded skeleton" />
            <div className="flex-grow flex flex-col gap-2">
              <div className="h-5 w-1/2 rounded skeleton" />
              <div className="h-4 w-1/3 rounded skeleton" />
            </div>
          </div>
        ))}

        {topAnime.map((anime, index) => {
          const isAdding = addingId === anime.mal_id;

          return (
          <div
            key={`${anime.mal_id}-${index}`}
            className="bg-ani-card rounded-lg p-4 flex gap-4 items-center shadow-card ring-1 ring-white/5 transition-all duration-200 hover:bg-ani-elevated hover:ring-ani-blue/40 hover:-translate-y-0.5 cursor-pointer group"
            onClick={() => navigate(`/details/anime/${anime.mal_id}`)}
          >

            {/* 1. The Rank Number */}
            <div className="text-3xl font-black w-12 text-center text-transparent bg-clip-text bg-gradient-to-b from-white/70 to-white/20 tabular-nums">
              {index + 1}
            </div>

            {/* 2. The Poster */}
            <div className="h-[120px] w-[85px] flex-shrink-0 rounded-md overflow-hidden shadow-md">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title_english || anime.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* 3. The Details (Title, Genres, Stats) */}
            <div className="flex-grow flex flex-col justify-between h-full py-1">
              <div>
                <h3 className="text-lg font-bold text-ani-text mb-2 transition-colors group-hover:text-ani-blue">
                  {anime.title_english || anime.title}
                </h3>

                {/* Dynamic Genre Tags! */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {anime.genres.map(genre => (
                    <span
                      key={genre.mal_id}
                      className="bg-ani-dark text-[11px] font-semibold text-ani-subtext px-2.5 py-1 rounded-full border border-ani-border"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Stats Row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ani-subtext font-medium">
                <span className="flex items-center gap-1 text-ani-text tabular-nums">
                  <svg className="w-3.5 h-3.5 text-[#f5c518] fill-current" viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" /></svg>
                  {anime.score ? `${anime.score * 10}%` : 'N/A'}
                </span>
                <span>{anime.type} ({anime.episodes || '?'} eps)</span>
                <span className="capitalize">{anime.season} {anime.year}</span>
                <span>{anime.status === 'Finished Airing' ? 'Finished' : anime.status}</span>
              </div>
            </div>

            {/* 4. The Add Button */}
            <div className="flex-shrink-0 ml-4 hidden sm:block">
              <button 
                  onClick={(e) => handleAddClick(e, anime)}
                  disabled={isAdding}
                  className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 active:scale-95 ${
                    isAdding
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-ani-blue text-ani-dark hover:bg-white'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    '+ Add'
                  )}
                </button>
            </div>

          </div>
        )})}
      </div>
    </div>
  );
}

export default TopAnimeList;