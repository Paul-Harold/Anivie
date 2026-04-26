import { useState } from 'react';
import axios from 'axios';

function AnimeCard({ anime, onDelete }) {
  // We use local state so the card updates instantly on screen
  const [status, setStatus] = useState(anime.watchStatus);
  const [rating, setRating] = useState(anime.userRating);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://anivie-backend.vercel.app/api/watchlist/${anime._id}`);
      onDelete(anime._id);
    } catch (error) {
      console.error("Error deleting anime:", error);
    }
  };

  // 🚨 NEW: The Update Function
  const handleUpdate = async (newStatus, newRating) => {
    try {
      // Send the updated data to the backend
      await axios.put(`https://anivie-backend.vercel.app/api/watchlist/${anime._id}`, {
        watchStatus: newStatus,
        userRating: newRating
      });
    } catch (error) {
      console.error("Error updating anime:", error);
      alert("Failed to save changes!");
    }
  };

  return (
    <div className="bg-ani-card rounded-lg w-[200px] flex flex-col overflow-hidden shadow-lg transition-transform hover:scale-105 duration-200">
      
      <div className="h-[280px] overflow-hidden">
        <img src={anime.posterUrl} alt={anime.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-ani-text font-semibold text-base mb-3 line-clamp-2" title={anime.title}>
          {anime.title}
        </h3>
        
        {/* 🚨 NEW: Interactive Status Dropdown */}
        <div className="mb-2 flex items-center justify-between">
          <label className="text-ani-subtext text-xs">Status:</label>
          <select 
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleUpdate(e.target.value, rating); // Auto-save
            }}
            className="bg-ani-dark text-ani-text text-xs p-1 rounded border border-gray-700 outline-none cursor-pointer"
          >
            <option value="Plan to Watch">Plan to Watch</option>
            <option value="Watching">Watching</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>

        {/* 🚨 NEW: Interactive Rating Input */}
        <div className="mb-4 flex items-center justify-between">
          <label className="text-ani-subtext text-xs">Rating:</label>
          <div className="flex items-center gap-1">
            <input 
              type="number" 
              min="0" 
              max="10" 
              value={rating}
              onChange={(e) => {
                const newRating = Number(e.target.value);
                setRating(newRating);
                handleUpdate(status, newRating); // Auto-save
              }}
              className="bg-ani-dark text-ani-text text-xs p-1 rounded border border-gray-700 w-[45px] outline-none text-center"
            />
            <span className="text-ani-subtext text-xs">/10</span>
          </div>
        </div>
        
        <button 
          onClick={handleDelete}
          className="mt-auto p-2 border border-ani-red text-ani-red rounded font-semibold text-sm transition-colors hover:bg-ani-red hover:text-white"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default AnimeCard;