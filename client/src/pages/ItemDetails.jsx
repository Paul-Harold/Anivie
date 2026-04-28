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
          const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${cleanId}?api_key=${TMDB_API_KEY}&append_to_response=videos`);
          
          const trailerVid = tmdbRes.data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

          setMediaData({
            title: tmdbRes.data.title,
            poster: `https://image.tmdb.org/t/p/w500${tmdbRes.data.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${tmdbRes.data.backdrop_path}`,
            synopsis: tmdbRes.data.overview,
            year: tmdbRes.data.release_date?.split('-')[0],
            genres: tmdbRes.data.genres.map(g => g.name).join(', '),
            score: tmdbRes.data.vote_average.toFixed(1),
            runtime: `${tmdbRes.data.runtime} min`,
            studios: tmdbRes.data.production_companies.map(c => c.name).join(', '),
            trailerId: trailerVid ? trailerVid.key : null
          });
        } else {
          const jikanRes = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
          const anime = jikanRes.data.data;
          
          let finalTrailerId = anime.trailer?.youtube_id;
          if (!finalTrailerId && anime.trailer?.embed_url) {
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

  const saveDiaryEntry = async () => {
    if (!dbItem) return alert("You must add this to your list before writing a diary entry!");
    
    setIsSaving(true);
    try {
      await axios.put(`https://anivie-backend.vercel.app/api/watchlist/${dbItem._id}`, {
        watchStatus: status,
        userRating: rating,
        personalNotes: notes
      });
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
      <div className="absolute top-0 left-0 w-full h-[40vh] sm:h-[50vh] z-0 overflow-hidden">
        {mediaData.backdrop ? (
          <img src={mediaData.backdrop} alt="backdrop" className="w-full h-full object-cover opacity-30" />
        ) : (
          <div className="w-full h-full bg-ani-card opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ani-dark to-transparent" />
      </div>

      {/* THE CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-[15vh] sm:pt-[20vh]">
        <Link to="/mylist" className="text-ani-subtext hover:text-white mb-6 inline-block font-bold">← Back to List</Link>
        
        {/* 🚨 Responsive Wrapper: flex-col on mobile, flex-row on desktop */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          
          {/* LEFT COLUMN: Poster & Digital Diary */}
          {/* 🚨 w-full on mobile, md:w-1/3 on desktop */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            
            {/* 🚨 Poster Image: shrunk to 2/3 width and centered on mobile, full width on desktop */}
            <img 
              src={mediaData.poster} 
              alt={mediaData.title} 
              className="w-2/3 sm:w-1/2 md:w-full mx-auto md:mx-0 rounded-xl shadow-2xl border-4 border-gray-800" 
            />
            
            {/* THE DIGITAL DIARY ZONE */}
            {dbItem ? (
              <div className="bg-ani-card p-5 sm:p-6 rounded-xl border border-gray-700 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-ani-blue pl-2">My Digital Diary</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-ani-dark text-white p-2 rounded outline-none border border-gray-700 text-sm flex-grow mr-2 sm:mr-4">
                    <option value="Plan to Watch">Plan to Watch</option>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                  
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
                  className="w-full bg-ani-dark text-gray-300 p-3 rounded outline-none border border-gray-700 focus:border-white resize-none h-32 sm:h-40 text-sm mb-4"
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
          {/* 🚨 Centered text on mobile, left aligned on desktop */}
          <div className="w-full md:w-2/3 pt-4 text-center md:text-left flex flex-col items-center md:items-start">
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              {mediaData.title}
            </h1>
            
            {/* 🚨 Tags wrapper centered on mobile */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 sm:gap-3 text-xs md:text-sm font-bold text-ani-subtext mb-8">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-white">{mediaData.year}</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">{mediaData.runtime}</span>
              <span>⭐ {mediaData.score} Global</span>
              <span className="text-ani-blue pl-0 md:pl-2 md:border-l border-gray-700 block w-full md:w-auto mt-2 md:mt-0">{mediaData.genres}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 w-full">Synopsis</h3>
            {/* 🚨 Keeping text-left for readability of long paragraphs, even on mobile */}
            <p className="w-full text-left text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg mb-8 bg-ani-card/50 p-4 sm:p-6 rounded-xl border border-gray-800/50 backdrop-blur-sm">
              {mediaData.synopsis || "No synopsis available."}
            </p>

            {mediaData.studios && (
              <div className="mb-8 w-full">
                <span className="text-ani-subtext font-bold text-sm uppercase tracking-wider">Produced By: </span>
                <span className="text-white font-semibold">{mediaData.studios}</span>
              </div>
            )}

            {mediaData.trailerId ? (
              <div className="mt-4 md:mt-8 w-full">
                <h3 className="text-xl font-bold text-white mb-4 text-center md:text-left md:border-l-4 md:border-ani-blue md:pl-2">Official Trailer</h3>
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
              <div className="mt-4 md:mt-8 p-6 bg-ani-card rounded-xl border border-gray-800 border-dashed text-center w-full">
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