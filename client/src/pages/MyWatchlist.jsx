import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WatchlistCard from '../components/MyList/WatchlistCard';

function MyWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); 
  const [isLoading, setIsLoading] = useState(true);

  // 🚨 NEW: State for our advanced list filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

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

  const handleItemUpdated = (updatedItem) => {
    setWatchlist(prevList => 
      prevList.map(item => item._id === updatedItem._id ? updatedItem : item)
    );
  };

  const handleItemDeleted = (deletedId) => {
    setWatchlist(prevList => prevList.filter((item) => item._id !== deletedId));
  };

  // 🚨 UPDATED: The Master Filter Logic (Combines Tabs, Status, and Rating)
  const filteredList = watchlist.filter(item => {
    // 1. Media Type Check
    let matchesTab = true;
    if (activeTab !== 'All') {
      const type = (item.mediaType || 'ANIME').toUpperCase();
      const tab = activeTab.toUpperCase();
      
      if (tab === 'MOVIE') matchesTab = (type === 'MOVIE');
      else if (tab === 'ANIME') matchesTab = ['ANIME', 'TV', 'OVA', 'SPECIAL', 'ONA'].includes(type);
    }

    // 2. Status Check
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      const itemStatus = item.watchStatus || 'Plan to Watch';
      matchesStatus = (itemStatus === statusFilter);
    }

    // 3. Rating Check
    let matchesRating = true;
    if (ratingFilter !== 'All') {
      const itemRating = item.userRating || 0;
      matchesRating = (itemRating === Number(ratingFilter));
    }

    // Item must pass ALL active filters to be shown
    return matchesTab && matchesStatus && matchesRating;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      {/* HEADER & MAIN TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-ani-text border-l-4 border-gray-500 pl-4">
          My Library
        </h1>
        
        <div className="flex bg-ani-card p-1 rounded-lg border border-gray-800 shadow-md">
          <button onClick={() => setActiveTab('All')} className={`px-6 py-2 text-sm font-bold rounded transition-colors ${activeTab === 'All' ? 'bg-gray-700 text-white' : 'text-ani-subtext hover:text-white'}`}>
            Everything
          </button>
          <button onClick={() => setActiveTab('Anime')} className={`px-6 py-2 text-sm font-bold rounded transition-colors ${activeTab === 'Anime' ? 'bg-ani-blue text-white' : 'text-ani-subtext hover:text-white'}`}>
            Anime
          </button>
          <button onClick={() => setActiveTab('Movie')} className={`px-6 py-2 text-sm font-bold rounded transition-colors ${activeTab === 'Movie' ? 'bg-[#90cea1] text-[#0d253f]' : 'text-ani-subtext hover:text-white'}`}>
            Movies
          </button>
        </div>
      </div>

      {/* 🚨 NEW: SECONDARY FILTER BAR */}
      {!isLoading && watchlist.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-ani-card p-4 rounded-lg border border-gray-800 shadow-md mb-8">
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-ani-subtext text-xs font-bold">Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-ani-dark text-ani-text text-sm p-2 rounded outline-none border border-gray-700 cursor-pointer focus:border-white min-w-[150px]"
              >
                <option value="All">All Statuses</option>
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-ani-subtext text-xs font-bold">Rating:</label>
              <select 
                value={ratingFilter} 
                onChange={(e) => setRatingFilter(e.target.value)}
                className="bg-ani-dark text-ani-text text-sm p-2 rounded outline-none border border-gray-700 cursor-pointer focus:border-white min-w-[120px]"
              >
                <option value="All">All Ratings</option>
                <option value="10">⭐ 10 (Masterpiece)</option>
                <option value="9">⭐ 9 (Great)</option>
                <option value="8">⭐ 8 (Very Good)</option>
                <option value="7">⭐ 7 (Good)</option>
                <option value="6">⭐ 6 (Fine)</option>
                <option value="5">⭐ 5 (Average)</option>
                <option value="4">⭐ 4 (Bad)</option>
                <option value="3">⭐ 3 (Very Bad)</option>
                <option value="2">⭐ 2 (Horrible)</option>
                <option value="1">⭐ 1 (Appalling)</option>
                <option value="0">Unrated</option>
              </select>
            </div>
          </div>

          <div className="text-ani-subtext text-sm font-bold bg-ani-dark px-4 py-2 rounded border border-gray-700">
            Showing {filteredList.length} {filteredList.length === 1 ? 'Title' : 'Titles'}
          </div>

        </div>
      )}

      {/* THE GRID */}
      {isLoading ? (
        <div className="text-center py-20 text-ani-subtext font-bold animate-pulse">Loading library...</div>
      ) : watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-ani-card rounded-lg border border-gray-800 border-dashed">
          <p className="text-ani-subtext text-lg mb-6">Nothing to see here.</p>
          <div className="flex gap-4">
            <Link to="/" className="px-6 py-2 bg-ani-blue text-white rounded font-bold hover:bg-blue-400 transition-colors">Find Anime</Link>
            <Link to="/movies" className="px-6 py-2 bg-[#0d253f] border border-[#90cea1] text-[#90cea1] rounded font-bold hover:bg-[#90cea1] hover:text-[#0d253f] transition-colors">Find Movies</Link>
          </div>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-20 text-ani-subtext">No titles match your current filters.</div>
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