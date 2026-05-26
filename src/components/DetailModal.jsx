import React, { useEffect, useRef } from 'react';
import { X, Play, Plus, Check, Heart, Star } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function DetailModal() {
  const { selectedMovie, setSelectedMovie, toggleMyList, isInMyList } = useMovie();
  const modalRef = useRef(null);

  // Disable scroll when modal is open
  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMovie]);

  // Close modal when clicking outside the content card
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedMovie(null);
    }
  };

  if (!selectedMovie) return null;

  const favorited = isInMyList(selectedMovie.id);

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
    >
      {/* Modal Drawer Container */}
      <div 
        ref={modalRef}
        className="relative bg-netflix-darkGray text-white w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl animate-slide-up my-auto border border-neutral-800"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedMovie(null)}
          className="absolute top-4 right-4 z-40 bg-black/60 hover:bg-black/80 hover:text-red-500 rounded-full p-2 text-white transition focus:outline-none cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Banner Image Header */}
        <div className="relative h-[250px] sm:h-[350px] md:h-[400px] w-full">
          <img 
            src={selectedMovie.backdrop_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80"} 
            alt={selectedMovie.title || selectedMovie.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-darkGray via-netflix-darkGray/30 to-transparent" />
          
          {/* Action Overlay Bottom Left */}
          <div className="absolute bottom-6 left-6 md:left-10 z-20">
            <h2 className="text-2xl sm:text-4xl font-black mb-4 text-shadow-lg leading-tight">
              {selectedMovie.title || selectedMovie.name}
            </h2>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => alert(`Playing: ${selectedMovie.title || selectedMovie.name}`)}
                className="flex items-center justify-center space-x-2 bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded font-bold text-sm sm:text-base transition duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <Play size={16} fill="currentColor" />
                <span>Play</span>
              </button>
              
              <button 
                onClick={() => toggleMyList(selectedMovie)}
                className={`flex items-center justify-center p-2.5 rounded-full border transition duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  favorited 
                    ? 'bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/30' 
                    : 'bg-black/40 border-neutral-400 text-white hover:border-white hover:bg-black/60'
                }`}
                title={favorited ? "Remove from List" : "Add to List"}
              >
                {favorited ? <Check size={18} /> : <Plus size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Movie Detailed Information Section */}
        <div className="px-6 md:px-10 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Info Columns */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3 text-sm text-neutral-300 font-semibold flex-wrap gap-y-1.5">
                <span className="text-green-500">{selectedMovie.match_percentage}% Match</span>
                <span>{selectedMovie.release_date?.slice(0, 4) || selectedMovie.first_air_date?.slice(0, 4)}</span>
                <span className="border border-neutral-600 px-1.5 py-0.5 rounded text-xs leading-none">
                  {selectedMovie.maturity_rating || "TV-MA"}
                </span>
                <span>{selectedMovie.duration}</span>
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1 rounded border border-neutral-700">HD</span>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-gray-200">
                {selectedMovie.overview}
              </p>
            </div>

            {/* Right Meta Specifications Column */}
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-neutral-400">Rating: </span>
                <span className="text-yellow-500 font-bold inline-flex items-center gap-1">
                  <Star size={14} fill="currentColor" />
                  {selectedMovie.vote_average?.toFixed(1)}/10
                </span>
              </div>

              <div>
                <span className="text-neutral-400">Genres: </span>
                <span className="text-neutral-200">
                  {selectedMovie.genres ? selectedMovie.genres.join(", ") : "Drama, Thriller"}
                </span>
              </div>

              <div>
                <span className="text-neutral-400">Availability: </span>
                <span className="text-neutral-200">Stream or Download in UHD</span>
              </div>
            </div>
          </div>

          {/* Similar Recommendations Section */}
          {selectedMovie.similar_movies && selectedMovie.similar_movies.length > 0 && (
            <div className="border-t border-neutral-800 pt-6 space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-200">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedMovie.similar_movies.map((similar) => (
                  <div 
                    key={similar.id}
                    onClick={() => setSelectedMovie(similar)}
                    className="bg-neutral-900 rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-neutral-600 transition flex flex-col group border border-neutral-800/40"
                  >
                    <div className="relative h-28 sm:h-32 w-full overflow-hidden">
                      <img 
                        src={similar.backdrop_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80"} 
                        alt={similar.title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-green-500 font-bold">
                        {similar.match_percentage}%
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs sm:text-sm font-semibold truncate text-white">
                            {similar.title}
                          </p>
                        </div>
                        <p className="text-[10px] sm:text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {similar.overview}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-neutral-400 font-medium">
                        <span>{similar.release_date?.slice(0, 4)}</span>
                        <span className="border border-neutral-700 px-1 rounded-sm">
                          {similar.maturity_rating || "PG-13"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
