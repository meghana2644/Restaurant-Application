import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function HeroSection({ searchQuery, onSearch }) {
  const [, setLocation] = useLocation();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync with parent search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = localSearchQuery.trim();
    onSearch(trimmedQuery);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    // If the input is empty, trigger search immediately
    if (!value.trim()) {
      onSearch('');
    }
  };

  const handleCuisineClick = (cuisine) => {
    setLocalSearchQuery(cuisine);
    onSearch(cuisine);
  };

  const cuisineTypes = [
    "Indian",
    "Italian",
    "Chinese",
    "Japanese",
    "Mexican",
    "Thai",
    "American",
    "Mediterranean",
    "Middle Eastern",
    "South Indian",
    "North Indian",
    "Street Food"
  ];

  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover and Order from Local Restaurants</h1>
            <p className="text-lg md:text-xl mb-6">Browse menus, place orders, and enjoy your favorite meals.</p>
            
            <form onSubmit={handleSearch} className="relative max-w-lg">
              <input 
                type="text" 
                placeholder="Search for restaurants, cuisines, or dishes..." 
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                value={localSearchQuery}
                onChange={handleInputChange}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-white p-2 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => handleCuisineClick(cuisine)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    localSearchQuery === cuisine
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Delicious food platter" 
              className="rounded-lg shadow-xl max-w-full h-auto" 
              width="500" 
              height="350"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 