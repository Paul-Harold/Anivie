import axios from 'axios';

// ADDED: Base configuration for TMDB API calls
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Grabs the hidden key from your .env file

// ADDED: Helper function to fetch trending movies
export const getTrendingMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching TMDB trending movies:", error);
    return [];
  }
};

// ADDED: Helper function to search for movies
export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    return response.data.results;
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return [];
  }
};