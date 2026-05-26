import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Film } from 'lucide-react';

export default function Search() {
  const { searchQuery, searchResults, isSearching, setSelectedMovie } = useMovie();

  if (!searchQuery) return null;

  return (
    <div className="min-h-screen bg-netflix-black text-white px-4 md:px-12 pt-24 pb-20 select-none">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-300">
        Search results for: <span className="text-white font-bold">"{searchQuery}"</span>
      </h2>

      {isSearching && searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Searching...</p>
        </div>
      ) : searchResults.length > 0 ? (
        /* Results Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 animate-fade-in">
          {searchResults.map((movie) => {
            const imageSrc = movie.backdrop_path || movie.poster_path;
            const fallbackSrc = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80";

            return (
              <div 
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group relative rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md border border-neutral-900 hover:border-neutral-700 aspect-[16/9]"
              >
                <img 
                  src={imageSrc || fallbackSrc} 
                  alt={movie.title || movie.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Title Reveal Overlay on Hover */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3 transition-opacity duration-300">
                  <p className="text-xs sm:text-sm font-bold truncate text-white mb-1">
                    {movie.title || movie.name}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className="text-green-500 font-semibold">{movie.match_percentage}% Match</span>
                    <span className="text-neutral-400">{movie.release_date?.slice(0, 4)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center h-[50vh] text-neutral-500 text-center max-w-md mx-auto space-y-4">
          <Film size={48} className="text-neutral-700" />
          <h3 className="text-lg md:text-xl font-bold text-neutral-300">No matches found</h3>
          <p className="text-xs md:text-sm text-neutral-400">
            Your search for "{searchQuery}" did not find any matching titles. Check your spelling or try different keywords.
          </p>
        </div>
      )}
    </div>
  );
}
