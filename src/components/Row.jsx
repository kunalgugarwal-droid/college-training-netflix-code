import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { getMovies } from '../services/requests';
import { useMovie } from '../context/MovieContext';

export default function Row({ title, fetchUrl, categoryKey, isLarge = false, id }) {
  const [movies, setMovies] = useState([]);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const rowRef = useRef(null);
  const { myList } = useMovie();

  // If this is the custom 'My List' row, we source the items from MovieContext
  const isMyListRow = categoryKey === 'mylist';
  const rowMovies = isMyListRow ? myList : movies;

  useEffect(() => {
    if (isMyListRow) return;

    async function fetchData() {
      const data = await getMovies(fetchUrl, categoryKey);
      setMovies(data);
    }
    fetchData();
  }, [fetchUrl, categoryKey, isMyListRow]);

  // Monitor scroll position to conditionally render left chevron
  const updateChevronVisibility = () => {
    if (rowRef.current) {
      setShowLeftChevron(rowRef.current.scrollLeft > 10);
    }
  };

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollOffset = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  // If My List row is empty, we don't render it (just like Netflix)
  if (isMyListRow && myList.length === 0) {
    return null;
  }

  return (
    <div id={id} className="relative space-y-1.5 md:space-y-2 px-4 md:px-12 select-none group/row mb-6 md:mb-10">
      {/* Title */}
      <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-200 hover:text-white transition duration-200 cursor-pointer inline-block">
        {title}
      </h2>

      {/* Row Wrapper with Chevrons */}
      <div className="relative">
        {/* Left Slider Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className={`absolute top-0 bottom-0 left-[-16px] md:left-[-48px] w-8 md:w-12 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center z-40 transition-all duration-300 focus:outline-none cursor-pointer ${
            showLeftChevron ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } group-hover/row:opacity-100`}
          aria-label="Scroll Left"
        >
          <ChevronLeft size={30} className="hover:scale-125 transition" />
        </button>

        {/* Horizontal Card Shelf */}
        <div
          ref={rowRef}
          onScroll={updateChevronVisibility}
          className="flex items-center space-x-3.5 md:space-x-4 overflow-x-auto overflow-y-hidden py-3 no-scrollbar scroll-smooth"
        >
          {rowMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isLarge={isLarge} />
          ))}
        </div>

        {/* Right Slider Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute top-0 bottom-0 right-[-16px] md:right-[-48px] w-8 md:w-12 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center z-40 transition-all duration-300 focus:outline-none cursor-pointer opacity-0 group-hover/row:opacity-100"
          aria-label="Scroll Right"
        >
          <ChevronRight size={30} className="hover:scale-125 transition" />
        </button>
      </div>
    </div>
  );
}
