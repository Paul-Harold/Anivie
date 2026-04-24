import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WatchlistCard from '../components/MyList/WatchlistCard'; 

function MyWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Anime', or 'Movie'
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the data when the page loads
  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/watchlist');
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchList();
  }, []);

  // Update a single item in our state after editing it in the card
  const handleItemUpdated = (updatedItem) => {
    setWatchlist(prevList => 
      prevList.map(item => item._id === updatedItem._id ? updatedItem : item)
    );
  };

  // Remove an item from the UI after deleting it
  const handleItemDeleted = (deletedId) => {
    setWatchlist(prevList => prevList.filter((item) => item._id !== deletedId));
  };

  // Apply the active tab filter
  const filteredList = watchlist.filter(item => {
    if (activeTab === 'All') return true;
    const type = item.mediaType || 'Anime';
    return type === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-ani-text border-l-4 border-gray-500 pl-4">
          My Watchlist
        </h1>
        
        {/* 🚨 THE FILTER TABS */}
        <div className="flex bg-ani-card p-1 rounded-lg border border-gray-800">
          <button 
            onClick={() => setActiveTab('All')}
            className={`px-6 py-2 text-sm font-bold rounded transition-colors ${activeTab === 'All' ? 'bg-gray-700 text-white' : 'text-ani-subtext hover:text-white'}`}
          >
            Everything
          </button>
          <button 
            onClick={() => setActiveTab('Anime')}
            className={`px-6 py-2 text-sm font-bold rounded transition-colors ${activeTab === 'Anime' ? 'bg-ani-blue text-white' : 'text-ani-subtext hover:text-white'}`}
          >
            Anime
          </button>
          <button 
            onClick={() => setActiveTab('Movie')}
            className={`px-6 py-2 text-sm font-bold rounded transition-colors ${activeTab === 'Movie' ? 'bg-[#90cea1] text-[#0d253f]' : 'text-ani-subtext hover:text-white'}`}
          >
            Movies
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-ani-subtext font-bold animate-pulse">Loading library...</div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-ani-card rounded-lg border border-gray-800 border-dashed">
          <p className="text-ani-subtext text-lg mb-6">Nothing to see here.</p>
          <div className="flex gap-4">
            <Link to="/" className="px-6 py-2 bg-ani-blue text-white rounded font-bold hover:bg-blue-400 transition-colors">Find Anime</Link>
            <Link to="/movies" className="px-6 py-2 bg-[#0d253f] border border-[#90cea1] text-[#90cea1] rounded font-bold hover:bg-[#90cea1] hover:text-[#0d253f] transition-colors">Find Movies</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredList.map((item) => (
            <WatchlistCard 
              key={item._id} 
              item={item} 
              onDelete={handleItemDeleted}
              onUpdate={handleItemUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyWatchlist;