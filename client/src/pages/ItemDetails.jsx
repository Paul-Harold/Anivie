import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function ItemDetails() {
  const { type, id } = useParams(); // type = 'anime' or 'movie', id = '16498' or 'tmdb-155'
  
  // Public API Data
  const [mediaData, setMediaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Private Database Data (The Digital Diary)
  const [dbItem, setDbItem] = useState(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Plan to Watch');
  const [rating, setRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchEverything = async () => {
      setIsLoading(true);
      try {
        if (type.toLowerCase() === 'movie') {
          const cleanId = id.replace('tmdb-', '');
          // 🚨 TWEAK: Added "&append_to_response=videos" to grab trailers in the same breath!
          const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${cleanId}?api_key=${TMDB_API_KEY}&append_to_response=videos`);
          
          // Find the official YouTube trailer
          const trailerVid = tmdbRes.data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

          setMediaData({
            title: tmdbRes.data.title,
            poster: `https://image.tmdb.org/t/p/w500${tmdbRes.data.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${tmdbRes.data.backdrop_path}`,
            synopsis: tmdbRes.data.overview,
            year: tmdbRes.data.release_date?.split('-')[0],
            genres: tmdbRes.data.genres.map(g => g.name).join(', '),
            score: tmdbRes.data.vote_average.toFixed(1),
            // 🚨 NEW: Extra details to fill space
            runtime: `${tmdbRes.data.runtime} min`,
            studios: tmdbRes.data.production_companies.map(c => c.name).join(', '),
            trailerId: trailerVid ? trailerVid.key : null
          });
        } else {
          // It's Anime!
          const jikanRes = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
          const anime = jikanRes.data.data;
          
          let finalTrailerId = anime.trailer?.youtube_id;
          if (!finalTrailerId && anime.trailer?.embed_url) {
            // This splits the string at "/embed/" and grabs the ID before the "?"
            finalTrailerId = anime.trailer.embed_url.split('/embed/')[1]?.split('?')[0];
          }
          setMediaData({
            title: anime.title_english || anime.title,
            poster: anime.images.jpg.large_image_url,
            backdrop: anime.trailer?.images?.maximum_image_url || null,
            synopsis: anime.synopsis,
            year: anime.year || 'N/A',
            genres: anime.genres.map(g => g.name).join(', '),
            score: anime.score,
            // 🚨 NEW: Extra details to fill space
            runtime: anime.episodes ? `${anime.episodes} Episodes` : anime.duration,
            studios: anime.studios.map(s => s.name).join(', '),
            trailerId: finalTrailerId
          });
        }

        const dbRes = await axios.get(`https://anivie-backend.vercel.app/api/watchlist/api/${id}`);
        if (dbRes.data) {
          setDbItem(dbRes.data);
          setNotes(dbRes.data.personalNotes || '');
          setStatus(dbRes.data.watchStatus || 'Plan to Watch');
          setRating(dbRes.data.userRating || 0);
        }

      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEverything();
  }, [type, id]);

  // Handle saving diary notes
  const saveDiaryEntry = async () => {
    if (!dbItem) return alert("You must add this to your list before writing a diary entry!");
    
    setIsSaving(true);
    try {
      await axios.put(`https://anivie-backend.vercel.app/api/watchlist/${dbItem._id}`, {
        watchStatus: status,
        userRating: rating,
        personalNotes: notes
      });
      // Brief visual feedback
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error("Failed to save diary:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-ani-subtext animate-pulse font-bold text-xl">Loading Cinematic Experience...</div>;
  if (!mediaData) return <div className="text-center py-20 text-white">Media not found.</div>;

  return (
    <div className="relative min-h-screen pb-20">
      
      {/* THE CINEMATIC BACKDROP */}
      <div className="absolute top-0 left-0 w-full h-[50vh] z-0 overflow-hidden">
        {mediaData.backdrop ? (
          <img src={mediaData.backdrop} alt="backdrop" className="w-full h-full object-cover opacity-30" />
        ) : (
          <div className="w-full h-full bg-ani-card opacity-30" />
        )}
        {/* Gradient overlay to fade smoothly into the background color */}
        <div className="absolute inset-0 bg-gradient-to-t from-ani-dark to-transparent" />
      </div>

      {/* THE CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-[20vh]">
        <Link to="/mylist" className="text-ani-subtext hover:text-white mb-6 inline-block font-bold">← Back to List</Link>
        
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* LEFT COLUMN: Poster & Digital Diary */}
          <div className="md:w-1/3 flex flex-col gap-6">
            <img src={mediaData.poster} alt={mediaData.title} className="w-full rounded-xl shadow-2xl border-4 border-gray-800" />
            
            {/* THE DIGITAL DIARY ZONE */}
            {dbItem ? (
              <div className="bg-ani-card p-6 rounded-xl border border-gray-700 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-ani-blue pl-2">My Digital Diary</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-ani-dark text-white p-2 rounded outline-none border border-gray-700 text-sm">
                    <option value="Plan to Watch">Plan to Watch</option>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[#f5c518]">⭐</span>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="bg-ani-dark text-white p-2 rounded outline-none border border-gray-700 text-sm">
                      <option value="0">-</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your thoughts, favorite quotes, or memories here..."
                  className="w-full bg-ani-dark text-gray-300 p-3 rounded outline-none border border-gray-700 focus:border-white resize-none h-40 text-sm mb-4"
                />

                <button onClick={saveDiaryEntry} className="w-full py-3 bg-ani-blue text-white font-bold rounded hover:bg-blue-400 transition-colors">
                  {isSaving ? 'Saved!' : 'Save Diary Entry'}
                </button>
              </div>
            ) : (
              <div className="bg-ani-card p-6 rounded-xl border border-gray-800 text-center">
                <p className="text-ani-subtext text-sm">Add this to your watchlist to unlock your personal digital diary.</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Lore & Details */}
          <div className="md:w-2/3 pt-4">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight">{mediaData.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold text-ani-subtext mb-8">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-white">{mediaData.year}</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">{mediaData.runtime}</span>
              <span>⭐ {mediaData.score} Global</span>
              <span className="text-ani-blue pl-2 border-l border-gray-700">{mediaData.genres}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-8 bg-ani-card/50 p-6 rounded-xl border border-gray-800/50 backdrop-blur-sm">
              {mediaData.synopsis || "No synopsis available."}
            </p>

            {/* 🚨 NEW: Studio Credit */}
            {mediaData.studios && (
              <div className="mb-8">
                <span className="text-ani-subtext font-bold text-sm uppercase tracking-wider">Produced By: </span>
                <span className="text-white font-semibold">{mediaData.studios}</span>
              </div>
            )}

            {/* 🚨 NEW: The YouTube Trailer Embed */}
            {mediaData.trailerId ? (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-ani-blue pl-2">Official Trailer</h3>
                <div className="relative w-full overflow-hidden rounded-xl shadow-2xl border border-gray-800" style={{ paddingTop: '56.25%' }}>
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${mediaData.trailerId}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className="mt-8 p-6 bg-ani-card rounded-xl border border-gray-800 border-dashed text-center">
                <p className="text-ani-subtext font-bold">No official trailer available.</p>
              </div>
            )}
            
          </div>

        </div>
      </div>
    </div>
  );
}

export default ItemDetails;