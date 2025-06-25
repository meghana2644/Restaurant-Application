import React, { useState, useEffect } from 'react';
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MenuItemCard from "@/components/restaurant/MenuItem";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import MenuCategories from "@/components/restaurant/MenuCategories";
import DietaryFilter from "@/components/restaurant/DietaryFilter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Review from '@/components/restaurant/Review';
import ReviewForm from '@/components/restaurant/ReviewForm';
import { toast } from 'react-hot-toast';

const Restaurant = () => {
  const params = useParams();
  const restaurantId = params?.id;
  const [activeCategory, setActiveCategory] = useState("");
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false
  });
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { data: restaurantData, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
      }
      return response.json();
    }
  });

  const { data: menuCategories, isLoading: isLoadingMenu } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu-categories`],
    enabled: !!restaurantId,
  });

  const { data: menuItemsData, isLoading: isLoadingItems } = useQuery({
    queryKey: [
      `/api/restaurants/${restaurantId}/menu-items`, 
      activeCategory,
      dietaryFilters.vegetarian,
      dietaryFilters.vegan,
      dietaryFilters.glutenFree
    ],
    enabled: !!restaurantId,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeCategory) {
        params.append('category', activeCategory);
      }
      if (dietaryFilters.vegetarian) {
        params.append('vegetarian', 'true');
      }
      if (dietaryFilters.vegan) {
        params.append('vegan', 'true');
      }
      if (dietaryFilters.glutenFree) {
        params.append('glutenFree', 'true');
      }
      
      const response = await fetch(`/api/restaurants/${restaurantId}/menu-items?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    }
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${restaurantId}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
    enabled: !!restaurantId,
  });

  useEffect(() => {
    if (restaurantData) {
      setRestaurant(restaurantData);
    }
  }, [restaurantData]);

  useEffect(() => {
    if (menuCategories?.length > 0) {
      setCategories(menuCategories);
      setSelectedCategory(menuCategories[0]._id);
    }
  }, [menuCategories]);

  useEffect(() => {
    if (menuItemsData) {
      setMenuItems(menuItemsData);
    }
  }, [menuItemsData]);

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData);
    }
  }, [reviewsData]);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setActiveCategory(categoryId);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      setIsSubmittingReview(true);
      const response = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to submit a review');
        }
        if (response.status === 400) {
          throw { errors: data.errors };
        }
        throw new Error(data.message || 'Failed to submit review');
      }

      setReviews([data, ...reviews]);
      refetchReviews();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error('Please log in to delete a review');
        }
        throw new Error(errorData.message || 'Failed to delete review');
      }

      setReviews(reviews.filter(review => review._id !== reviewId));
      refetchReviews();
      toast.success('Review deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  if (!restaurantId) {
    return <div className="text-center py-8">Invalid restaurant ID</div>;
  }

  if (isLoadingRestaurant) {
    return <div className="text-center py-8">Loading restaurant details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error.message}</div>;
  }

  if (!restaurant) {
    return <div className="text-center py-8">Restaurant not found</div>;
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to restaurants
          </Button>
        </Link>
        
        {/* Restaurant Header */}
        {restaurant && <RestaurantHeader restaurant={restaurant} />}
        
        {/* Restaurant Information Tabs */}
        <Tabs defaultValue="menu" className="mb-8">
          <TabsList>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          {/* Menu Tab */}
          <TabsContent value="menu" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sidebar with Filters */}
              <div className="md:col-span-1">
                <DietaryFilter onFilterChange={setDietaryFilters} />
                
                {/* Active Filters */}
                {(dietaryFilters.vegetarian || dietaryFilters.vegan || dietaryFilters.glutenFree) && (
                  <div className="mb-6">
                    <h3 className="font-medium text-sm mb-2 text-gray-500">Active Filters:</h3>
                    <div className="flex flex-wrap gap-2">
                      {dietaryFilters.vegetarian && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                          Vegetarian
                        </Badge>
                      )}
                      {dietaryFilters.vegan && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                          Vegan
                        </Badge>
                      )}
                      {dietaryFilters.glutenFree && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          Gluten-Free
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Menu Content */}
              <div className="md:col-span-3">
                {/* Menu Categories */}
                {isLoadingMenu ? (
                  <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-24 rounded-full" />
                    ))}
                  </div>
                ) : (
                  menuCategories?.length > 0 && (
                    <MenuCategories 
                      categories={menuCategories.map(c => c.name)}
                      activeCategory={activeCategory}
                      onCategoryChange={setActiveCategory}
                    />
                  )
                )}
                
                {/* Menu Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{activeCategory}</h2>
                    {menuItemsData && (
                      <span className="text-sm text-gray-500">{menuItemsData.length} items</span>
                    )}
                  </div>
                  
                  {isLoadingItems ? (
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      {Array(4).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                      ))}
                    </div>
                  ) : menuItemsData && menuItemsData.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      {menuItemsData.map((item) => (
                        <MenuItemCard 
                          key={item._id} 
                          item={item} 
                          restaurantId={restaurantId}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No items match your filters</h3>
                      <p className="text-gray-500">Try adjusting your dietary preferences</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="py-4">
              <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
              
              <ReviewForm 
                restaurantId={restaurantId} 
                onSubmit={handleReviewSubmit} 
              />
              
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Review 
                      key={review._id} 
                      review={review} 
                      onDelete={handleReviewDelete}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
                    <p className="text-gray-500">Be the first to review this restaurant!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Info Tab */}
          <TabsContent value="info">
            <div className="py-4">
              <h2 className="text-xl font-bold mb-4">Restaurant Information</h2>
              
              {restaurant && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Address</h3>
                    <p className="text-gray-600">{restaurant.address}</p>
                    
                    <h3 className="text-lg font-semibold mt-4 mb-2">Hours</h3>
                    <ul className="text-gray-600">
                      <li>Monday - Friday: 11:00 AM - 10:00 PM</li>
                      <li>Saturday: 10:00 AM - 11:00 PM</li>
                      <li>Sunday: 10:00 AM - 9:00 PM</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact</h3>
                    <p className="text-gray-600">Phone: (555) 123-4567</p>
                    <p className="text-gray-600">Email: info@{restaurant.name.toLowerCase().replace(/\s/g, "")}.com</p>
                    
                    <h3 className="text-lg font-semibold mt-4 mb-2">Reservation Information</h3>
                    <p className="text-gray-600">Reservation Time: {restaurant.reservationTime}</p>
                    <p className="text-gray-600">
                      {restaurant.freeReservation ? 'Free Reservation' : 'Reservation Fee: ₹3.99'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Restaurant; 