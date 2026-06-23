import AnimeCarousel from '../components/Anime/AnimeCarousel';
import TopAnimeList from '../components/Anime/TopAnimeList';
import AnimeSearchAndFilter from '../components/Anime/AnimeSearchAndFilter';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react'; // 🚨 Added useContext
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 🚨 Importing our AuthContext


function Dashboard() {
  const { user } = useContext(AuthContext); // 🚨 Read the login state
  const navigate = useNavigate(); // 🚨 Setup the navigator
  
  const handleAddToDatabase = async (anime) => {
    if (!user) {
      alert("Please log in or create an account to start building your library!");
      navigate('/auth'); // Teleport them to the login page
      return; // Stop the function so it doesn't crash the backend
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
          // 🚨 NEW: Check if the error is our custom 400 Duplicate Error from the backend
          if (error.response && error.response.status === 400) {
            alert(`${newAnimeData.title} is already in your list!`);
          } else {
            // If it's a real crash (like the server being offline), show the generic error
            console.error("Error saving to database:", error);
            alert("Failed to add item.");
          }
        }
      };


  return (
    <div className="max-w-6xl mx-auto py-6 animate-fade-in">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-ani-border bg-gradient-to-br from-ani-card via-ani-card to-ani-dark p-7 sm:p-9">
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-ani-blue/10 rounded-full blur-3xl pointer-events-none" />
        <p className="text-ani-blue text-xs font-bold uppercase tracking-widest mb-2">Welcome to AniVie</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Discover Anime</h1>
        <p className="text-ani-subtext text-sm max-w-xl">Track what you watch, rate your favorites, and build the ultimate watchlist — anime and movies in one place.</p>
      </div>

      {/* 🚨 NEW: The Advanced Filter Engine */}
      <AnimeSearchAndFilter onAdd={handleAddToDatabase} />
      
<AnimeCarousel 
        title="Trending Now" 
        apiEndpoint="https://api.jikan.moe/v4/top/anime?filter=airing&limit=15" 
        onAdd={handleAddToDatabase} 
        delay={0}
        categoryLink="/category/trending"
      />
      
      <AnimeCarousel 
        title="All Time Popular" 
        apiEndpoint="https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=15" 
        onAdd={handleAddToDatabase} 
        delay={1000} 
        categoryLink="/category/popular"
      />
      
      <TopAnimeList onAdd={handleAddToDatabase} categoryLink="/category/top100" />
    </div>
  );
}

export default Dashboard;