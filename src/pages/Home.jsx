import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import Row from '../components/Row';
import requests, { getMovies } from '../services/requests';

export default function Home() {
  const [originals, setOriginals] = useState([]);

  useEffect(() => {
    async function loadBannerMovies() {
      const data = await getMovies(requests.fetchNetflixOriginals, 'originals');
      setOriginals(data);
    }
    loadBannerMovies();
  }, []);

  return (
    <div id="top" className="relative bg-netflix-black pb-24 overflow-x-hidden min-h-screen">
      {/* Featured Hero Banner */}
      <Banner movies={originals} />

      {/* Rows Section (shifted upwards slightly to overlay the banner's bottom fade) */}
      <div className="relative z-20 space-y-2 -mt-12 sm:-mt-20 md:-mt-28 lg:-mt-36">
        
        {/* Dynamic My List Row */}
        <Row 
          title="My List" 
          categoryKey="mylist" 
          id="my-list" 
        />

        {/* Netflix Originals (Vertical Layout) */}
        <Row 
          title="Netflix Originals" 
          fetchUrl={requests.fetchNetflixOriginals} 
          categoryKey="originals" 
          isLarge={true} 
          id="tv-shows"
        />

        {/* Trending Now */}
        <Row 
          title="Trending Now" 
          fetchUrl={requests.fetchTrending} 
          categoryKey="trending" 
          id="trending"
        />

        {/* Top Rated */}
        <Row 
          title="Top Rated" 
          fetchUrl={requests.fetchTopRated} 
          categoryKey="topRated" 
          id="movies"
        />

        {/* Action Movies */}
        <Row 
          title="Action & Adventure" 
          fetchUrl={requests.fetchActionMovies} 
          categoryKey="action" 
        />

        {/* Comedy Movies */}
        <Row 
          title="Comedies" 
          fetchUrl={requests.fetchComedyMovies} 
          categoryKey="comedy" 
        />

        {/* Horror Movies */}
        <Row 
          title="Horror Movies" 
          fetchUrl={requests.fetchHorrorMovies} 
          categoryKey="horror" 
        />

        {/* Documentaries */}
        <Row 
          title="Documentaries" 
          fetchUrl={requests.fetchDocumentaries} 
          categoryKey="documentary" 
        />
        
      </div>
    </div>
  );
}
