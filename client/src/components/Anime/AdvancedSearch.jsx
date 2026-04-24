import { useState } from 'react';
import axios from 'axios';

function AdvancedSearch({ onAdd }) {
  // State for all our different filters
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Build the dynamic API URL based on what the user selected
    let apiUrl = `https://api.jikan.moe/v4/anime?q=${query}&limit=10`;
    if (format) apiUrl += `&type=${format}`;
    if (status) apiUrl += `&status=${status}`;

    try {
      const response = await axios.get(apiUrl);
      setResults(response.data.data);
    } catch (error) {
      console.error("Error with advanced search:", error);
    }
  };

  return (
    <div className="mb-10">
      {/* The Filter Bar */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-4 bg-ani-card p-4 rounded-lg shadow-lg mb-6">
        
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search anime..." 
          className="flex-1 min-w-[200px] bg-ani-dark text-ani-text p-2 rounded outline-none border border-gray-700 focus:border-ani-blue transition-colors"
        />

        <select 
          value={format} 
          onChange={(e) => setFormat(e.target.value)}
          className="bg-ani-dark text-ani-subtext p-2 rounded outline-none border border-gray-700 cursor-pointer"
        >
          <option value="">Any Format</option>
          <option value="tv">TV Show</option>
          <option value="movie">Movie</option>
          <option value="ova">OVA</option>
        </select>

        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          className="bg-ani-dark text-ani-subtext p-2 rounded outline-none border border-gray-700 cursor-pointer"
        >
          <option value="">Any Status</option>
          <option value="airing">Airing</option>
          <option value="complete">Completed</option>
          <option value="upcoming">Upcoming</option>
        </select>

        <button type="submit" className="bg-ani-blue text-white font-bold px-6 py-2 rounded hover:bg-blue-400 transition-colors">
          Search
        </button>
      </form>

      {/* The Results Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {results.map((anime) => (
            <div key={anime.mal_id} className="bg-ani-card rounded-lg overflow-hidden flex flex-col">
              <div className="h-[200px]">
                <img src={anime.images.jpg.image_url} alt="poster" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <p className="text-xs font-bold text-ani-text mb-2 line-clamp-2">{anime.title_english || anime.title}</p>
                <button 
                  onClick={() => {
                    onAdd(anime);
                    setResults([]); // Clear results after adding
                    setQuery('');
                  }}
                  className="mt-auto w-full py-1.5 bg-ani-blue text-white rounded text-xs font-bold transition-colors hover:bg-blue-400"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;