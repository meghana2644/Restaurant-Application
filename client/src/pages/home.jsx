import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import HeroSection from "@/components/home/HeroSection";
import FilterSection from "@/components/home/FilterSection";
import RestaurantCard from "@/components/home/RestaurantCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sort: "popular",
    price: 0,
    dietary: [],
  });

  // Sync URL search parameter with search state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search") || "";
    if (searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }
  }, [location]);

  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('/api/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      return response.json();
    }
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setLocation(`/?search=${encodeURIComponent(query)}`);
    } else {
      setLocation('/');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter restaurants based on search query and other filters
  const filteredRestaurants = restaurants?.filter(restaurant => {
    const searchTerm = searchQuery.toLowerCase().trim();
    
    // If no search term, only apply other filters
    if (!searchTerm) {
      return true;
    }

    // Check if search term matches restaurant name or description
    const matchesRestaurant = 
      (restaurant.name?.toLowerCase() || '').includes(searchTerm) ||
      (restaurant.description?.toLowerCase() || '').includes(searchTerm);

    // Check if search term matches any cuisine type
    const matchesCuisine = Array.isArray(restaurant.cuisine) && 
      restaurant.cuisine.some(cuisine => 
        (cuisine?.toLowerCase() || '').includes(searchTerm)
      );

    // Check if search term matches any menu item
    const matchesMenuItems = Array.isArray(restaurant.menuItems) && 
      restaurant.menuItems.some(item => 
        (item?.name?.toLowerCase() || '').includes(searchTerm) ||
        (item?.description?.toLowerCase() || '').includes(searchTerm)
      );

    // Check price level
    const matchesPrice = filters.price === 0 || restaurant.priceLevel <= filters.price;

    // Check dietary preferences
    const matchesDietary = filters.dietary.length === 0 || 
      (Array.isArray(restaurant.menuItems) && 
        restaurant.menuItems.some(item => 
          filters.dietary.every(diet => 
            (diet === 'vegetarian' && item?.isVegetarian) ||
            (diet === 'vegan' && item?.isVegan) ||
            (diet === 'glutenFree' && item?.isGlutenFree)
          )
        )
      );

    return (matchesRestaurant || matchesCuisine || matchesMenuItems) && matchesPrice && matchesDietary;
  });

  // Sort restaurants based on selected sort option
  const sortedRestaurants = filteredRestaurants?.sort((a, b) => {
    switch (filters.sort) {
      case 'rating':
        return b.rating - a.rating;
      case 'price_asc':
        return a.priceLevel - b.priceLevel;
      case 'price_desc':
        return b.priceLevel - a.priceLevel;
      default:
        return b.reviewCount - a.reviewCount; // Default to popular
    }
  });

  // Function to render restaurant card skeletons during loading
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-full h-48" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    ));
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading restaurants: {error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection 
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
      <FilterSection 
        onFilterChange={handleFilterChange} 
        filters={filters}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
      
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : "Popular Restaurants Near You"}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              renderSkeletons()
            ) : sortedRestaurants?.length > 0 ? (
              sortedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No restaurants found matching your search criteria.</p>
              </div>
            )}
          </div>
          
          {sortedRestaurants && sortedRestaurants.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline">
                Load More Restaurants
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
} 