import { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeCard from './components/AnimeCard';
import Dashboard from './pages/Dashboard';

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
    <div className="p-5 font-sans max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Anime Watchlist 🍿</h1>
      
      {/* 🚨 NEW: Our massive Discovery Engine */}
      <Dashboard onAnimeAdded={addAnimeToUI} />
      
      <hr className="border-gray-700 my-8" />
      
      <h2 className="text-xl font-bold text-ani-text mb-4">My Saved List</h2>
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