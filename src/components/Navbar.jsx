import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, X, LogOut, User, Heart } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const { searchQuery, setSearchQuery } = useMovie();
  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Listen to window scroll to transition navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle search bar visibility
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  };

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    
    // If not on Home page, navigate to Home first
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 select-none ${
      isScrolled || isLoginPage ? 'bg-netflix-black shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex items-center justify-between h-16 md:h-20">
        
        {/* Left Side: Logo & Main Navigation Links */}
        <div className="flex items-center space-x-4 md:space-x-12">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => {
              setSearchQuery("");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl md:text-3xl font-extrabold text-netflix-red tracking-tighter uppercase transition duration-300 hover:scale-105"
          >
            NETFLIX
          </Link>

          {!isLoginPage && (
            <ul className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#e5e5e5]">
              <li>
                <button onClick={() => handleNavClick('top')} className="hover:text-gray-300 transition cursor-pointer">Home</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('tv-shows')} className="hover:text-gray-300 transition cursor-pointer">TV Shows</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('movies')} className="hover:text-gray-300 transition cursor-pointer">Movies</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('trending')} className="hover:text-gray-300 transition cursor-pointer">New & Popular</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('my-list')} className="hover:text-gray-300 transition cursor-pointer flex items-center gap-1">
                  My List
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Right Side: Search, Account Dropdown & Mobile Menu Trigger */}
        {!isLoginPage ? (
          <div className="flex items-center space-x-4 text-white">
            
            {/* Collapsible Search Input */}
            <div className="flex items-center bg-black/40 border border-transparent rounded px-2 py-1 transition-all duration-300">
              <button 
                onClick={toggleSearch} 
                className="focus:outline-none hover:text-gray-300 transition cursor-pointer"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres..."
                className={`bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none border-none transition-all duration-300 ease-out ${
                  searchOpen ? 'w-40 md:w-60 ml-2 px-1 py-0.5 opacity-100' : 'w-0 ml-0 opacity-0 pointer-events-none'
                }`}
              />
              {searchOpen && searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="text-gray-400 hover:text-white ml-1 focus:outline-none cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <button className="relative hidden sm:block hover:text-gray-300 transition cursor-pointer" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-netflix-red rounded-full"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-1.5 focus:outline-none cursor-pointer group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="User Avatar" 
                  className="w-8 h-8 rounded object-cover border border-gray-600 group-hover:border-white transition-all"
                />
                <ChevronDown size={16} className={`transition-transform duration-300 group-hover:text-gray-300 ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-black border border-neutral-800 rounded-md shadow-2xl py-2 z-50 text-sm animate-fade-in">
                  <div className="px-4 py-2 border-b border-neutral-800 flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold text-white truncate">Clara Jenkins</p>
                      <p className="text-xs text-gray-400 truncate">Premium Member</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { setProfileMenuOpen(false); handleNavClick('my-list'); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-neutral-900 flex items-center space-x-2 text-gray-300 hover:text-white transition cursor-pointer"
                  >
                    <Heart size={16} className="text-netflix-red" />
                    <span>My Favorites List</span>
                  </button>

                  <Link 
                    to="/login"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full text-left px-4 py-2.5 hover:bg-neutral-900 flex items-center space-x-2 text-gray-300 hover:text-white transition border-t border-neutral-800 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Sign Out of Netflix</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-white hover:text-gray-300 focus:outline-none cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="bg-netflix-red text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-netflix-darkRed transition"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && !isLoginPage && (
        <div className="md:hidden bg-black/95 w-full border-t border-neutral-900 py-4 px-6 absolute top-16 left-0 animate-fade-in shadow-2xl">
          <ul className="flex flex-col space-y-4 text-base font-semibold text-gray-200">
            <li>
              <button 
                onClick={() => handleNavClick('top')} 
                className="w-full text-left hover:text-white transition cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('tv-shows')} 
                className="w-full text-left hover:text-white transition cursor-pointer"
              >
                TV Shows
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('movies')} 
                className="w-full text-left hover:text-white transition cursor-pointer"
              >
                Movies
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('trending')} 
                className="w-full text-left hover:text-white transition cursor-pointer"
              >
                New & Popular
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('my-list')} 
                className="w-full text-left hover:text-white transition cursor-pointer"
              >
                My List
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
