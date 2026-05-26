import React, { useState } from 'react';
import { Play, Plus, Check, ChevronDown, Heart } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function MovieCard({ movie, isLarge = false }) {
  const { setSelectedMovie, toggleMyList, isInMyList } = useMovie();
  const [isHovered, setIsHovered] = useState(false);

  const favorited = isInMyList(movie.id);

  const handleCardClick = () => {
    setSelectedMovie(movie);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    setSelectedMovie(movie);
  };

  const handleListClick = (e) => {
    e.stopPropagation();
    toggleMyList(movie);
  };

  const imageSrc = isLarge ? movie.poster_path : movie.backdrop_path;

  // Fallback visual in case image path is empty or broken
  const fallbackSrc = isLarge
    ? "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=400&q=80"
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex-none transition-all duration-300 ease-out cursor-pointer select-none rounded-md overflow-hidden ${
        isLarge 
          ? 'w-[140px] sm:w-[170px] md:w-[200px] lg:w-[230px] aspect-[2/3]' 
          : 'w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] aspect-[16/9]'
      } hover:scale-105 hover:z-30 shadow-md hover:shadow-2xl border border-neutral-900 hover:border-neutral-700`}
    >
      {/* Background Image */}
      <img
        src={imageSrc || fallbackSrc}
        alt={movie.title || movie.name}
        className="w-full h-full object-cover transition-transform duration-300"
        loading="lazy"
      />

      {/* Title label for non-hovered state (landscape rows) */}
      {!isLarge && !isHovered && (
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="text-xs sm:text-sm font-semibold truncate text-white">
            {movie.title || movie.name}
          </p>
        </div>
      )}

      {/* Detailed Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-black/80 flex flex-col justify-end p-3 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-1.5 sm:space-y-2">
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayClick}
                className="w-7 h-7 sm:w-9 sm:h-9 bg-white hover:bg-neutral-200 text-black rounded-full flex items-center justify-center transition focus:outline-none cursor-pointer"
                aria-label="Play"
              >
                <Play size={14} className="sm:scale-110 ml-0.5" fill="currentColor" />
              </button>
              
              <button
                onClick={handleListClick}
                className={`w-7 h-7 sm:w-9 sm:h-9 border-2 rounded-full flex items-center justify-center transition focus:outline-none cursor-pointer ${
                  favorited 
                    ? 'border-green-500 text-green-500 hover:bg-green-950/20' 
                    : 'border-neutral-400 text-white hover:border-white hover:bg-neutral-800/40'
                }`}
                title={favorited ? "Remove from List" : "Add to List"}
                aria-label="My List"
              >
                {favorited ? <Check size={14} className="sm:scale-110" /> : <Plus size={14} className="sm:scale-110" />}
              </button>
            </div>

            <button
              onClick={handleCardClick}
              className="w-7 h-7 sm:w-9 sm:h-9 border-2 border-neutral-400 text-white hover:border-white rounded-full flex items-center justify-center transition focus:outline-none cursor-pointer hover:bg-neutral-800/40"
              title="More Info"
              aria-label="More Info"
            >
              <ChevronDown size={14} className="sm:scale-110" />
            </button>
          </div>

          {/* Title inside hovered layout */}
          <p className="text-xs sm:text-sm font-bold truncate text-white">
            {movie.title || movie.name}
          </p>

          {/* Quick Stats */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-neutral-300 font-semibold">
            <span className="text-green-500">{movie.match_percentage}% Match</span>
            <span className="border border-neutral-600 px-1 rounded-sm text-[8px] sm:text-[10px]">
              {movie.maturity_rating || "TV-MA"}
            </span>
            <span>{movie.duration}</span>
          </div>

          {/* Genres */}
          {movie.genres && (
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 2).map((genre, i) => (
                <span 
                  key={i} 
                  className="text-[9px] sm:text-[10px] text-neutral-400 bg-neutral-900/60 px-1.5 py-0.5 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
