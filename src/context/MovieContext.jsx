import React, { createContext, useContext, useState, useEffect } from 'react';
import { searchMovies } from '../services/requests';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [myList, setMyList] = useState(() => {
    try {
      const saved = localStorage.getItem('netflix_mylist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sync My List with localStorage
  useEffect(() => {
    localStorage.setItem('netflix_mylist', JSON.stringify(myList));
  }, [myList]);

  // Handle live search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addToMyList = (movie) => {
    if (!myList.some(item => item.id === movie.id)) {
      setMyList(prev => [...prev, movie]);
    }
  };

  const removeFromMyList = (movieId) => {
    setMyList(prev => prev.filter(item => item.id !== movieId));
  };

  const toggleMyList = (movie) => {
    if (myList.some(item => item.id === movie.id)) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  const isInMyList = (movieId) => {
    return myList.some(item => item.id === movieId);
  };

  return (
    <MovieContext.Provider value={{
      myList,
      selectedMovie,
      setSelectedMovie,
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      addToMyList,
      removeFromMyList,
      toggleMyList,
      isInMyList
    }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovie() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie must be used within a MovieProvider');
  }
  return context;
}
