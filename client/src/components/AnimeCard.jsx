import axios from 'axios';

function AnimeCard({ anime, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/watchlist/${anime._id}`);
      onDelete(anime._id);
    } catch (error) {
      console.error("Error deleting anime:", error);
    }
  };

  return (
    <div className="bg-ani-card rounded-lg w-[200px] flex flex-col overflow-hidden shadow-lg transition-transform hover:scale-105 duration-200">
      
      {/* Image Container */}
      <div className="h-[280px] overflow-hidden">
        <img 
          src={anime.posterUrl} 
          alt={anime.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Text Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-ani-text font-semibold text-base mb-2 line-clamp-2">
          {anime.title}
        </h3>
        
        <p className="text-ani-subtext text-sm mb-1">
          Status: <span className="text-ani-text">{anime.watchStatus}</span>
        </p>
        <p className="text-ani-subtext text-sm mb-4">
          Rating: <span className="text-ani-text">{anime.userRating}/10</span>
        </p>
        
        {/* Button */}
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