import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // This state holds the data from our database
  const [watchlist, setWatchlist] = useState([]);

  // useEffect runs once when the page loads
  useEffect(() => {
    // 1. Call our Express backend
    axios.get('http://localhost:5000/api/watchlist')
      .then((response) => {
        console.log("Data from backend:", response.data);
        // 2. Save the data into our React state
        setWatchlist(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty array means "only run this once"

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>My Anime Watchlist 🍿</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* We "map" over the array to create a visual card for every anime */}
        {watchlist.map((anime) => (
          <div key={anime._id} style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            borderRadius: '10px',
            width: '200px'
          }}>
            <img 
              src={anime.posterUrl} 
              alt={anime.title} 
              style={{ width: '100%', borderRadius: '5px' }} 
            />
            <h3>{anime.title}</h3>
            <p><strong>Status:</strong> {anime.watchStatus}</p>
            <p><strong>Rating:</strong> {anime.userRating}/10</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;