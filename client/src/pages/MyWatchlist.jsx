import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WatchlistCard from '../components/MyList/WatchlistCard';
import { AuthContext } from '../context/AuthContext';

function MyWatchlist() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // 🚨 NEW: State for our advanced list filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const fetchList = async () => {
      try {
        const response = await axios.get('https://anivie-backend.vercel.app/api/watchlist');
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchList();
  }, [user]);

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
    <div className="max-w-6xl mx-auto py-6 px-4 animate-fade-in">

      {/* HEADER & MAIN TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-black text-ani-text border-l-4 border-ani-blue pl-4">
          My Library
        </h1>

        <div className="flex bg-ani-card p-1 rounded-lg border border-ani-border shadow-card">
          <button onClick={() => setActiveTab('All')} className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'All' ? 'bg-ani-elevated text-white' : 'text-ani-subtext hover:text-white'}`}>
            Everything
          </button>
          <button onClick={() => setActiveTab('Anime')} className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'Anime' ? 'bg-ani-blue text-ani-dark' : 'text-ani-subtext hover:text-white'}`}>
            Anime
          </button>
          <button onClick={() => setActiveTab('Movie')} className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'Movie' ? 'bg-ani-movie text-ani-dark' : 'text-ani-subtext hover:text-white'}`}>
            Movies
          </button>
        </div>
      </div>

      {/* 🚨 NEW: SECONDARY FILTER BAR */}
      {!isLoading && watchlist.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-ani-card p-4 rounded-xl border border-ani-border shadow-card mb-8">

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-ani-subtext text-xs font-bold">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-ani-dark text-ani-text text-sm p-2 rounded-lg outline-none border border-ani-border cursor-pointer focus:border-ani-blue min-w-[150px]"
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
                className="bg-ani-dark text-ani-text text-sm p-2 rounded-lg outline-none border border-ani-border cursor-pointer focus:border-ani-blue min-w-[120px]"
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

          <div className="text-ani-subtext text-sm font-bold bg-ani-dark px-4 py-2 rounded-lg border border-ani-border tabular-nums">
            Showing {filteredList.length} {filteredList.length === 1 ? 'Title' : 'Titles'}
          </div>

        </div>
      )}

      {/* THE GRID */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`skel-${i}`} className="rounded-lg overflow-hidden flex flex-col bg-ani-card">
              <div className="h-[240px] skeleton" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 w-3/4 rounded skeleton" />
                <div className="h-7 w-full rounded skeleton mt-2" />
                <div className="h-7 w-full rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-ani-card rounded-xl border border-ani-border border-dashed">
          <svg className="w-12 h-12 text-ani-subtext/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <p className="text-ani-subtext text-lg mb-6">Your library is empty.</p>
          <div className="flex gap-4">
            <Link to="/" className="px-6 py-2.5 bg-ani-blue text-ani-dark rounded-lg font-bold hover:bg-white transition-colors active:scale-95">Find Anime</Link>
            <Link to="/movies" className="px-6 py-2.5 bg-ani-movie/10 border border-ani-movie text-ani-movie rounded-lg font-bold hover:bg-ani-movie hover:text-ani-dark transition-colors active:scale-95">Find Movies</Link>
          </div>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-20 text-ani-subtext bg-ani-card rounded-xl border border-ani-border border-dashed">No titles match your current filters.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
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