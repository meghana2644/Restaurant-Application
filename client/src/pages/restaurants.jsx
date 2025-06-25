import React from 'react';
import { useQuery } from "@tanstack/react-query";
import RestaurantCard from "@/components/home/RestaurantCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Restaurants() {
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">All Restaurants</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">All Restaurants</h1>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading restaurants: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants?.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
} 