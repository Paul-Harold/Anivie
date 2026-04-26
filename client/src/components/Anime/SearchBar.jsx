import { useState } from 'react';
import axios from 'axios';

function SearchBar({ onAdd }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // 1. Ask MyAnimeList for data
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    try {
      // The Jikan API is completely free and requires no API keys!
      const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&limit=4`);
      setResults(response.data.data);
    } catch (error) {
      console.error("Error searching MyAnimeList:", error);
    }
  };

  // 2. Save the chosen anime to YOUR database
  const handleAddToDatabase = async (anime) => {
    // We format the Jikan data to match our Mongoose Schema exactly
    const newAnimeData = {
      apiId: anime.mal_id,
      title: anime.title_english || anime.title, // Fallback to Japanese title if English is missing
      posterUrl: anime.images.jpg.image_url,
      mediaType: anime.type,
      watchStatus: "Plan to Watch", // Default status
      userRating: 0
    };

    try {
      // Send it to our Node backend
      const response = await axios.post('anivie-backend.vercel.app/api/watchlist', newAnimeData);
      
      // Tell App.jsx to draw the new card
      onAdd(response.data);
      
      // Clean up the UI
      setResults([]); 
      setQuery(''); 
    } catch (error) {
      console.error("Error saving to database:", error);
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#2a2a2a', borderRadius: '10px', color: 'white' }}>
      <h2>Find New Anime 🔍</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Type an anime name..." 
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: 'none' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Search
        </button>
      </form>

      {/* The Search Results Dropdown/List */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto' }}>
        {results.map((anime) => (
          <div key={anime.mal_id} style={{ minWidth: '150px', backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
            <img src={anime.images.jpg.image_url} alt="poster" style={{ width: '100%', borderRadius: '5px' }} />
            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{anime.title_english || anime.title}</p>
            <button 
              onClick={() => handleAddToDatabase(anime)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              + Add to List
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;