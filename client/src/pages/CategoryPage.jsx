import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CategoryPage({ onAnimeAdded }) {
  // useParams reads the URL. If the URL is /category/trending, type = "trending"
  const { type } = useParams();
  const [animeList, setAnimeList] = useState([]);

  // A "Dictionary" that tells our page what to load based on the URL
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
      title: "Top 100 Anime",
      endpoint: "https://api.jikan.moe/v4/top/anime?limit=24"
    }
  };

  const currentCategory = categoryConfig[type] || categoryConfig.trending;

  useEffect(() => {
    // Scroll to the top when the page loads
    window.scrollTo(0, 0); 
    
    axios.get(currentCategory.endpoint)
      .then((response) => setAnimeList(response.data.data))
      .catch((error) => console.error("Error fetching category:", error));
  }, [type]);

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
      const response = await axios.post('http://localhost:5000/api/watchlist', newAnimeData);
      onAnimeAdded(response.data);
      alert(`Added ${newAnimeData.title} to your watchlist!`);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-ani-blue hover:text-white transition-colors font-bold flex items-center gap-2">
          ← Back Home
        </Link>
        <h1 className="text-3xl font-bold text-ani-text border-l-2 border-gray-700 pl-4">
          {currentCategory.title}
        </h1>
      </div>

      {/* The Full Page Grid */}
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
    </div>
  );
}

export default CategoryPage;