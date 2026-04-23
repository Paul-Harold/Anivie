import { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeCard from './components/AnimeCard';

function App() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/watchlist')
      .then((response) => setWatchlist(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // 🚨 NEW: This function filters the deleted anime out of our React state
  const removeAnimeFromUI = (deletedId) => {
    setWatchlist(watchlist.filter((anime) => anime._id !== deletedId));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>My Anime Watchlist 🍿</h1>
      
      {watchlist.length === 0 ? (
        <p>No anime found! The database is currently empty.</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {watchlist.map((anime) => (
            // 🚨 NEW: Pass the cleanup function as a prop!
            <AnimeCard key={anime._id} anime={anime} onDelete={removeAnimeFromUI} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;