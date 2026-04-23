import axios from 'axios'; // 🚨 NEW: Import axios

// 🚨 NEW: Accept the 'onDelete' prop
function AnimeCard({ anime, onDelete }) {
  
  // 🚨 NEW: The real delete function
  const handleDelete = async () => {
    try {
      // 1. Tell the database to destroy it
      await axios.delete(`http://localhost:5000/api/watchlist/${anime._id}`);
      
      // 2. Tell App.jsx to remove it from the screen
      onDelete(anime._id);
    } catch (error) {
      console.error("Error deleting anime:", error);
      alert("Failed to delete. Is the server running?");
    }
  };

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '15px', 
      borderRadius: '10px',
      width: '200px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img src={anime.posterUrl} alt={anime.title} style={{ width: '100%', borderRadius: '5px' }} />
      <h3>{anime.title}</h3>
      <p style={{ margin: '5px 0' }}><strong>Status:</strong> {anime.watchStatus}</p>
      <p style={{ margin: '5px 0' }}><strong>Rating:</strong> {anime.userRating}/10</p>
      
      <button 
        onClick={handleDelete}
        style={{
          marginTop: 'auto',
          padding: '10px',
          backgroundColor: '#ff4d4d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Remove
      </button>
    </div>
  );
}

export default AnimeCard;