import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function WatchlistCard({ item, onDelete, onUpdate }) {
  const [status, setStatus] = useState(item.watchStatus || 'Plan to Watch');
  const [rating, setRating] = useState(item.userRating || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    saveChanges(newStatus, rating);
  };

  const handleRatingChange = async (e) => {
    const newRating = Number(e.target.value);
    setRating(newRating);
    saveChanges(status, newRating);
  };

  const saveChanges = async (newStatus, newRating) => {
    setIsUpdating(true);
    try {
      // 🚨 This hits the PUT route in your backend to update the database instantly!
      const response = await axios.put(`https://anivie-backend.vercel.app/api/watchlist/${item._id}`, {
        watchStatus: newStatus,
        userRating: newRating
      });
      onUpdate(response.data);
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSearching(false); // Quick typo fix for the state name
      setIsUpdating(false); 
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove ${item.title}?`)) return;
    
    try {
      await axios.delete(`https://anivie-backend.vercel.app/api/watchlist/${item._id}`);
      onDelete(item._id);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // Dynamic styling based on media type
  const isMovie = item.mediaType === "Movie";
  const accentColor = isMovie ? "text-[#90cea1]" : "text-ani-blue";
  const borderColor = isMovie ? "border-[#90cea1]" : "border-ani-blue";

  return (
    <div className={`bg-ani-dark rounded-lg overflow-hidden flex flex-col group shadow-md border-b-4 ${borderColor} relative`}>
      
      {/* Media Type Badge */}
     <div className={`absolute top-2 right-2 px-2 py-1 bg-[#0d253f] ${accentColor} text-[10px] font-black uppercase rounded shadow z-10 border border-gray-700`}>
        {item.mediaType}
      </div>

      <Link to={`/details/${item.mediaType.toLowerCase()}/${item.apiId}`}>
        <div className="h-[240px] relative overflow-hidden bg-gray-900 cursor-pointer">
          <img src={item.posterUrl} alt="poster" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow bg-ani-card"></div>

      
      
      <div className="p-4 flex flex-col flex-grow bg-ani-card">
        <p className="text-sm font-bold text-ani-text mb-3 line-clamp-2" title={item.title}>{item.title}</p>
        
        {/* Interactive Controls */}
        <div className="mt-auto space-y-2">
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-ani-subtext font-semibold">Status:</span>
            <select 
              value={status} 
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="bg-ani-dark text-ani-text text-xs p-1.5 rounded outline-none border border-gray-700 cursor-pointer focus:border-white w-[110px]"
            >
              <option value="Plan to Watch">Plan to Watch</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-ani-subtext font-semibold">Rating:</span>
            <div className="flex items-center gap-1">
              <select 
                value={rating} 
                onChange={handleRatingChange}
                disabled={isUpdating}
                className="bg-ani-dark text-ani-text text-xs p-1.5 rounded outline-none border border-gray-700 cursor-pointer focus:border-white"
              >
                <option value="0">-</option>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <span className="text-xs text-[#f5c518]">⭐</span>
            </div>
          </div>

          <button 
            onClick={handleDelete}
            className="w-full mt-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-xs font-bold transition-colors hover:bg-red-500 hover:text-white"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default WatchlistCard;