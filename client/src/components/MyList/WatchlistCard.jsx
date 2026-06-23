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
  const accentColor = isMovie ? "text-ani-movie" : "text-ani-blue";
  const borderColor = isMovie ? "border-ani-movie" : "border-ani-blue";

  return (
    <div className={`bg-ani-card rounded-lg overflow-hidden flex flex-col group shadow-card border-b-4 ${borderColor} relative ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}>

      {/* Media Type Badge */}
     <div className={`absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm ${accentColor} text-[10px] font-black uppercase rounded-md shadow z-10 border border-white/10`}>
        {item.mediaType}
      </div>

      <Link to={`/details/${item.mediaType.toLowerCase()}/${item.apiId}`} className="block">
        <div className="h-[240px] relative overflow-hidden bg-gray-900 cursor-pointer">
          <img src={item.posterUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-ani-card/90 to-transparent opacity-60" />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm font-bold text-ani-text mb-3 line-clamp-2" title={item.title}>{item.title}</p>
        
        {/* Interactive Controls */}
        <div className="mt-auto space-y-2">
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-ani-subtext font-semibold">Status:</span>
            <select 
              value={status} 
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="bg-ani-dark text-ani-text text-xs p-1.5 rounded outline-none border border-ani-border cursor-pointer focus:border-ani-blue w-[110px]"
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
                className="bg-ani-dark text-ani-text text-xs p-1.5 rounded outline-none border border-ani-border cursor-pointer focus:border-ani-blue tabular-nums"
              >
                <option value="0">-</option>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <svg className="w-3.5 h-3.5 text-[#f5c518] fill-current" viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" /></svg>
            </div>
          </div>

          <button 
            onClick={handleDelete}
            className="w-full mt-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-colors hover:bg-red-500 hover:text-white active:scale-95"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default WatchlistCard;