import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MovieProvider, useMovie } from './context/MovieContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import DetailModal from './components/DetailModal';

// Separate routing component to access useMovie context safely
function AppContent() {
  const { searchQuery } = useMovie();

  return (
    <div className="relative min-h-screen bg-netflix-black text-white">
      {/* Sticky Global Navigation Bar */}
      <Navbar />

      {/* Primary Routes */}
      <Routes>
        {/* If the user is typing in the search bar, dynamically show Search page results */}
        <Route path="/" element={searchQuery ? <Search /> : <Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Details Drawer Modal */}
      <DetailModal />
    </div>
  );
}

export default function App() {
  return (
    <MovieProvider>
      <Router>
        <AppContent />
      </Router>
    </MovieProvider>
  );
}
