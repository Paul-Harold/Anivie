import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // 🚨 NEW IMPORTS
import axios from 'axios';
import AnimeCard from './components/AnimeCard';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage'; // 🚨 NEW IMPORT

function App() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/watchlist')
      .then((response) => setWatchlist(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const removeAnimeFromUI = (deletedId) => {
    setWatchlist(watchlist.filter((anime) => anime._id !== deletedId));
  };

  const addAnimeToUI = (newAnime) => {
    setWatchlist((prevWatchlist) => [...prevWatchlist, newAnime]);
  };

  // 🚨 NEW: Everything must be inside <Router>
  return (
    <Router>
      <div className="font-sans min-h-screen">
        
        {/* A Global Navbar so it stays at the top of every page */}
        <nav className="bg-ani-card px-6 py-4 shadow-md mb-6 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-black text-ani-text tracking-wider">
              Ani<span className="text-ani-blue">List</span> Clone
            </Link>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4">
          {/* 🚨 NEW: Routes swap out the middle content based on the URL */}
          <Routes>
            
            {/* The Home Page Route */}
            <Route path="/" element={
              <>
                <Dashboard onAnimeAdded={addAnimeToUI} />
                <hr className="border-gray-700 my-10" />
                <h2 className="text-2xl font-bold text-ani-text mb-6">My Personal Watchlist</h2>
                {watchlist.length === 0 ? (
                  <p className="text-ani-subtext">No anime found! Add some from the dashboard.</p>
                ) : (
                  <div className="flex flex-wrap gap-6">
                    {watchlist.map((anime) => (
                      <AnimeCard key={anime._id} anime={anime} onDelete={removeAnimeFromUI} />
                    ))}
                  </div>
                )}
              </>
            } />

            {/* The Dynamic Category Page Route */}
            <Route path="/category/:type" element={
              <CategoryPage onAnimeAdded={addAnimeToUI} />
            } />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;