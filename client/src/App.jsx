import { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeCard from './components/AnimeCard';
import SearchBar from './components/SearchBar'; // 🚨 NEW IMPORT

function App() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/watchlist')
      .then((response) => setWatchlist(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // Removes a deleted card from the screen
  const removeAnimeFromUI = (deletedId) => {
    setWatchlist(watchlist.filter((anime) => anime._id !== deletedId));
  };

  // 🚨 NEW: Adds a newly saved card to the screen instantly
  const addAnimeToUI = (newAnime) => {
    setWatchlist((prevWatchlist) => [...prevWatchlist, newAnime]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>My Anime Watchlist 🍿</h1>
      
      {/* 🚨 NEW: Render the Search Bar at the top! */}
      <SearchBar onAdd={addAnimeToUI} />
      
      <hr style={{ borderColor: '#444', margin: '30px 0' }} />

      <h2>My Saved List</h2>
      {watchlist.length === 0 ? (
        <p>No anime found! Use the search bar above to add some.</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {watchlist.map((anime) => (
            <AnimeCard key={anime._id} anime={anime} onDelete={removeAnimeFromUI} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;