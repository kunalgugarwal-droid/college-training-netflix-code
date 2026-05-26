import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter a valid email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Success simulation: Redirect to home page
    navigate('/');
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center select-none"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%), url("https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80")`
      }}
    >
      {/* Black Translucent Box */}
      <div className="bg-black/75 w-full max-w-[450px] p-8 sm:p-16 rounded-md shadow-2xl border border-neutral-900 mx-4 z-10">
        <h2 className="text-3xl font-bold text-white mb-7">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-[#e87c03] text-white text-xs py-2.5 px-4 rounded text-left font-medium">
              {error}
            </div>
          )}

          {/* Email/Phone Field */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#333] text-white placeholder-gray-400 text-sm px-5 py-3.5 rounded border-none focus:bg-[#454545] focus:outline-none transition"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#333] text-white placeholder-gray-400 text-sm px-5 py-3.5 rounded border-none focus:bg-[#454545] focus:outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-netflix-red hover:bg-netflix-darkRed text-white font-bold py-3.5 rounded transition shadow-lg cursor-pointer active:scale-98"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Extras: Remember Me & Help */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-netflix-red rounded w-4 h-4" />
            <span>Remember me</span>
          </label>
          <a href="#" className="hover:underline">Need help?</a>
        </div>

        {/* Auth Toggle */}
        <div className="text-sm text-gray-400 mt-10 space-y-4 text-left">
          <p>
            {isSignIn ? "New to Netflix? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError("");
              }}
              className="text-white hover:underline font-semibold cursor-pointer"
            >
              {isSignIn ? "Sign up now." : "Sign in now."}
            </button>
          </p>
          
          <p className="text-xs text-gray-500 leading-relaxed">
            This page is protected by Google reCAPTCHA to ensure you're not a bot. 
            <span className="text-[#0071eb] hover:underline cursor-pointer ml-1">Learn more.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
