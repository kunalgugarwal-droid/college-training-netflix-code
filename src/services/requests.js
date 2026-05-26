import axios from 'axios';
import { mockMovies } from './mockData';

// TMDB API Configuration (You can define VITE_TMDB_API_KEY in your .env file)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

// Standard TMDB Requests
const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
};

export default requests;

// Custom Axios instance
const instance = axios.create({
  baseURL: BASE_URL,
});

/**
 * Helper to fetch movies for a specific request endpoint / category.
 * Falls back gracefully to mock data if no TMDB API Key is provided.
 */
export async function getMovies(requestUrl, categoryKey) {
  if (API_KEY) {
    try {
      const response = await instance.get(requestUrl);
      const results = response.data.results || [];
      // Normalize TMDB fields to match our mock structure
      return results.map(item => ({
        id: item.id,
        title: item.title || item.name || item.original_name || item.original_title,
        name: item.name || item.title,
        backdrop_path: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : "",
        poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        overview: item.overview,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
        match_percentage: Math.floor(Math.random() * 15) + 85, // generate realistic match
        duration: item.first_air_date ? "TV Series" : "2h 15m", // default duration for movies
        maturity_rating: item.adult ? "R" : "PG-13",
        genres: getGenresFromIds(item.genre_ids),
        isOriginal: categoryKey === 'originals',
        category: categoryKey
      }));
    } catch (error) {
      console.warn("Failed to fetch from TMDB, falling back to mock data.", error);
    }
  }

  // Fallback to local Mock Database
  return mockMovies.filter(movie => movie.category === categoryKey);
}

// Convert common TMDB genre IDs into text strings
function getGenresFromIds(ids) {
  if (!ids) return ["Drama"];
  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
  };
  return ids.map(id => genreMap[id]).filter(Boolean).slice(0, 3);
}

/**
 * Global search helper. Searches either locally or makes TMDB call.
 */
export async function searchMovies(query) {
  if (!query) return [];
  if (API_KEY) {
    try {
      const response = await instance.get(`/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
      const results = response.data.results || [];
      return results
        .filter(item => item.backdrop_path || item.poster_path)
        .map(item => ({
          id: item.id,
          title: item.title || item.name || item.original_name || item.original_title,
          backdrop_path: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : "",
          poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          overview: item.overview,
          vote_average: item.vote_average,
          release_date: item.release_date || item.first_air_date,
          match_percentage: Math.floor(Math.random() * 15) + 85,
          duration: "2h 10m",
          maturity_rating: item.adult ? "R" : "PG-13",
          genres: getGenresFromIds(item.genre_ids),
        }));
    } catch (error) {
      console.warn("Failed to search from TMDB, using mock search", error);
    }
  }

  // Filter from mock data
  const lowercaseQuery = query.toLowerCase();
  return mockMovies.filter(movie => 
    (movie.title && movie.title.toLowerCase().includes(lowercaseQuery)) ||
    (movie.name && movie.name.toLowerCase().includes(lowercaseQuery)) ||
    (movie.overview && movie.overview.toLowerCase().includes(lowercaseQuery))
  );
}
