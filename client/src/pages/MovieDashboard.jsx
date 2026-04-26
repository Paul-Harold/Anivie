import axios from 'axios';
import MovieCarousel from '../components/Movie/MovieCarousel'; // 🚨 NEW IMPORT
import MovieSearchAndFilter from '../components/Movie/MovieSearchAndFilter';
import { useContext } from 'react'; // 🚨 Import useContext
import { useNavigate } from 'react-router-dom'; // 🚨 Import useNavigate
import { AuthContext } from '../context/AuthContext'; // 🚨 Import our AuthContext

function MovieDashboard() {
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleAddToDatabase = async (movie) => {
    if (!user) {
      alert("Please log in or create an account to start building your library!");
      navigate('/auth'); 
      return; 
    }
    const newMovieData = {
      apiId: `tmdb-${movie.id}`,
      title: movie.title,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      mediaType: "Movie",
      watchStatus: "Plan to Watch",
      userRating: 0
    };

    try {
      await axios.post('anivie-backend.vercel.app/api/watchlist', newMovieData);
      alert(`Added ${newMovieData.title} to your watchlist!`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(`${newMovieData.title} is already in your list!`);
      } else {
        console.error("Error saving to database:", error);
        alert("Failed to add movie.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-ani-text mb-8 border-l-4 border-[#90cea1] pl-4">
        Discover Movies
      </h1>
          <MovieSearchAndFilter onAdd={handleAddToDatabase} />
       
      {/* 🚨 NEW: Our Stacked Movie Discovery Engine! */}
      <MovieCarousel 
        title="Trending This Week" 
        endpoint="/trending/movie/week" 
        categoryLink="/movies/category/trending"
        onAdd={handleAddToDatabase} 
        delay={0}
      />

      <MovieCarousel 
        title="Popular Global Hits" 
        endpoint="/movie/popular" 
        categoryLink="/movies/category/popular"
        onAdd={handleAddToDatabase} 
        delay={200}
      />

      <MovieCarousel 
        title="Top Rated All-Time" 
        endpoint="/movie/top_rated" 
        categoryLink="/movies/category/toprated"
        onAdd={handleAddToDatabase} 
        delay={400}
      />

      <MovieCarousel 
        title="Upcoming Releases" 
        endpoint="/movie/upcoming" 
        categoryLink="/movies/category/upcoming"
        onAdd={handleAddToDatabase} 
        delay={600}
      />
    </div>
  );
}

export default MovieDashboard;