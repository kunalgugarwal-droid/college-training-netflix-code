import React, { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function Banner({ movies = [] }) {
  const [movie, setMovie] = useState(null);
  const { setSelectedMovie } = useMovie();

  useEffect(() => {
    if (movies && movies.length > 0) {
      // Pick a random Netflix original or high-quality movie to showcase
      const originals = movies.filter(m => m.isOriginal || m.category === 'originals');
      const pool = originals.length > 0 ? originals : movies;
      const randomIndex = Math.floor(Math.random() * pool.length);
      setMovie(pool[randomIndex]);
    }
  }, [movies]);

  if (!movie) {
    return (
      <div className="h-[56.25vw] max-h-[800px] min-h-[450px] w-full bg-neutral-900 animate-pulse flex items-center justify-center text-gray-500">
        Loading Featured Title...
      </div>
    );
  }

  const truncate = (str, n) => {
    return str?.length > n ? str.slice(0, n - 1) + "..." : str;
  };

  return (
    <header 
      className="relative h-[65vw] max-h-[750px] min-h-[500px] w-full text-white bg-cover bg-center select-none"
      style={{
        backgroundImage: `url("${movie.backdrop_path}")`,
        backgroundPosition: "center 20%"
      }}
    >
      {/* Visual Overlay: Left Vignette and Bottom Fade Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent z-10" />

      {/* Banner Contents */}
      <div className="absolute bottom-[20%] left-4 md:left-12 max-w-xl md:max-w-2xl z-20 flex flex-col space-y-4 px-2 md:px-0">
        {/* Category Tag */}
        {movie.isOriginal && (
          <div className="flex items-center space-x-2">
            <span className="bg-netflix-red text-white text-[10px] md:text-xs font-black px-1.5 py-0.5 rounded-sm tracking-widest uppercase">
              N
            </span>
            <span className="text-gray-300 text-xs md:text-sm font-extrabold tracking-widest uppercase">
              Original Series
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-shadow-lg">
          {movie.title || movie.name}
        </h1>

        {/* Info Line */}
        <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-300 font-semibold">
          <span className="text-green-500">{movie.match_percentage}% Match</span>
          <span>{movie.release_date?.slice(0, 4)}</span>
          <span className="border border-neutral-600 px-1 rounded-sm text-[10px] scale-90">
            {movie.maturity_rating || "TV-MA"}
          </span>
          <span>{movie.duration}</span>
        </div>

        {/* Overview */}
        <p className="text-sm md:text-base text-gray-200 line-clamp-3 leading-relaxed drop-shadow-md max-w-lg md:max-w-xl">
          {truncate(movie.overview, 180)}
        </p>

        {/* CTA Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button 
            onClick={() => setSelectedMovie(movie)}
            className="flex items-center justify-center space-x-2 bg-white hover:bg-white/80 text-black px-6 md:px-8 py-2 md:py-2.5 rounded font-bold text-sm md:text-base transition duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <Play size={20} fill="currentColor" />
            <span>Play</span>
          </button>
          
          <button 
            onClick={() => setSelectedMovie(movie)}
            className="flex items-center justify-center space-x-2 bg-neutral-600/70 hover:bg-neutral-600/50 text-white px-6 md:px-8 py-2 md:py-2.5 rounded font-bold text-sm md:text-base transition duration-200 cursor-pointer backdrop-blur-sm hover:scale-105 active:scale-95"
          >
            <Info size={20} />
            <span>More Info</span>
          </button>
        </div>
      </div>
    </header>
  );
}
