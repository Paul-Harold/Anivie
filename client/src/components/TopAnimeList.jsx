import { useState, useEffect } from 'react';
import axios from 'axios';

function TopAnimeList({ onAdd }) {
  const [topAnime, setTopAnime] = useState([]);

  useEffect(() => {
    // We fetch the top ranked anime. 
    // We'll limit it to 10 here so the page doesn't scroll forever!
    axios.get('https://api.jikan.moe/v4/top/anime?limit=10')
      .then((response) => setTopAnime(response.data.data))
      .catch((error) => console.error("Error fetching top anime:", error));
  }, []);

  return (
    <div className="mb-10 mt-12">
      {/* Header section with the "View All" mock link */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-ani-text">Top 100 Anime</h2>
        <button className="text-ani-subtext text-sm font-semibold hover:text-ani-text transition-colors">
          View All
        </button>
      </div>

      {/* The Vertical Stack of Rows */}
      <div className="flex flex-col gap-4">
        {topAnime.map((anime, index) => (
          <div 
            key={anime.mal_id} 
            className="bg-ani-card rounded-lg p-4 flex gap-4 items-center shadow-sm transition-transform hover:scale-[1.01]"
          >
            
            {/* 1. The Rank Number */}
            <div className="text-3xl font-black text-ani-subtext w-12 text-center opacity-50">
              #{index + 1}
            </div>

            {/* 2. The Poster */}
            <div className="h-[120px] w-[85px] flex-shrink-0 rounded overflow-hidden shadow-md">
              <img 
                src={anime.images.jpg.image_url} 
                alt="poster" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* 3. The Details (Title, Genres, Stats) */}
            <div className="flex-grow flex flex-col justify-between h-full py-1">
              <div>
                <h3 className="text-lg font-bold text-ani-text mb-2">
                  {anime.title_english || anime.title}
                </h3>
                
                {/* Dynamic Genre Tags! */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {anime.genres.map(genre => (
                    <span 
                      key={genre.mal_id} 
                      className="bg-ani-dark text-[11px] font-semibold text-ani-subtext px-2.5 py-1 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Detailed Stats Row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ani-subtext font-medium">
                <span className="flex items-center gap-1 text-ani-text">
                  ⭐ {anime.score ? `${anime.score * 10}%` : 'N/A'}
                </span>
                <span>{anime.type} ({anime.episodes || '?'} eps)</span>
                <span className="capitalize">{anime.season} {anime.year}</span>
                <span>{anime.status === 'Finished Airing' ? 'Finished' : anime.status}</span>
              </div>
            </div>

            {/* 4. The Add Button */}
            <div className="flex-shrink-0 ml-4 hidden sm:block">
               <button 
                onClick={() => onAdd(anime)}
                className="px-5 py-2 bg-ani-blue text-white rounded font-bold text-sm transition-colors hover:bg-blue-400"
              >
                + Add
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default TopAnimeList;