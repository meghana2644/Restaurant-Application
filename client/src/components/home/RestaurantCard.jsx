import { Link } from "wouter";

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-sm font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{restaurant.rating}</span>
          <span className="text-gray-500 text-xs ml-1">({restaurant.reviewCount})</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
          <span className="text-gray-600 text-sm">{"₹".repeat(restaurant.priceLevel)}</span>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">{restaurant.cuisine.join(" • ")}</div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{restaurant.distance} miles away</span>
          <span className="mx-2">•</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{restaurant.deliveryTime}</span>
        </div>
        
        <div className="flex items-center justify-end">
          <Link 
            href={`/restaurant/${restaurant._id}`}
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
} 