import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminRestaurants() {
  const [, setLocation] = useLocation();
  const [restaurants, setRestaurants] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState('');
    // Form state for creating new restaurant
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    imageUrl: '',
    bannerUrl: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    priceLevel: 1,
    cuisine: [],
    distance: 0,
    deliveryTime: '',
    freeDelivery: false,
    latitude: 0,
    longitude: 0,
    reviewCount: 0,
    rating: 0,
    openingHours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '09:00', close: '22:00' }
    },
    ownerEmail: '',
    createNewOwner: false,
    ownerPassword: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLocation('/admin/login');
          return;
        }        const [restaurantsRes, ownersRes] = await Promise.all([
          axios.get('http://localhost:5000/admin/restaurants', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/admin/users?role=restaurant_owner', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setRestaurants(restaurantsRes.data || []);
        setOwners(ownersRes.data || []);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setLocation('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLocation]);
  const validateForm = () => {
    const errors = [];
    
    // Check required text fields
    if (!newRestaurant.name.trim()) errors.push('Restaurant name is required');
    if (!newRestaurant.description.trim()) errors.push('Description is required');
    if (!newRestaurant.ownerEmail.trim()) errors.push('Owner email is required');
    if (!newRestaurant.deliveryTime.trim()) errors.push('Delivery time is required');
    
    // Check URLs
    try {
      if (!newRestaurant.imageUrl.trim()) {
        errors.push('Image URL is required');
      } else {
        new URL(newRestaurant.imageUrl);
      }
    } catch {
      errors.push('Image URL must be a valid URL');
    }
    
    try {
      if (!newRestaurant.bannerUrl.trim()) {
        errors.push('Banner URL is required');
      } else {
        new URL(newRestaurant.bannerUrl);
      }
    } catch {
      errors.push('Banner URL must be a valid URL');
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newRestaurant.ownerEmail && !emailRegex.test(newRestaurant.ownerEmail)) {
      errors.push('Owner email must be a valid email address');
    }
    
    // Check address fields
    if (!newRestaurant.address.street.trim()) errors.push('Street address is required');
    if (!newRestaurant.address.city.trim()) errors.push('City is required');
    if (!newRestaurant.address.state.trim()) errors.push('State is required');
    if (!newRestaurant.address.zipCode.trim()) errors.push('Zip code is required');
    if (!newRestaurant.address.country.trim()) errors.push('Country is required');
    
    // Check cuisine
    if (!newRestaurant.cuisine || newRestaurant.cuisine.length === 0) {
      errors.push('At least one cuisine type is required');
    }
    
    return errors;
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // If creating a new owner, first create the owner account
      let ownerEmail = newRestaurant.ownerEmail;
      if (newRestaurant.createNewOwner) {
        try {
          const ownerResponse = await axios.post(
            'http://localhost:5000/admin/users',
            {
              name: newRestaurant.name,
              email: newRestaurant.ownerEmail,
              password: newRestaurant.ownerPassword,
              role: 'restaurant_owner'
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          ownerEmail = ownerResponse.data.user.email;
          toast.success('Restaurant owner created successfully');
        } catch (err) {
          console.error('Owner creation error:', err);
          toast.error(err.response?.data?.message || 'Failed to create restaurant owner');
          return;
        }
      }
      
      // Prepare the restaurant data with only required fields
      const restaurantData = {
        name: newRestaurant.name,
        description: newRestaurant.description,
        imageUrl: newRestaurant.imageUrl,
        bannerUrl: newRestaurant.bannerUrl,
        address: newRestaurant.address,
        priceLevel: newRestaurant.priceLevel,
        cuisine: newRestaurant.cuisine,
        distance: newRestaurant.distance,
        deliveryTime: newRestaurant.deliveryTime,
        freeDelivery: newRestaurant.freeDelivery,
        latitude: newRestaurant.latitude,
        longitude: newRestaurant.longitude,
        openingHours: newRestaurant.openingHours,
        ownerEmail: ownerEmail,
        reviewCount: 0,
        rating: 0
      };
      
      const response = await axios.post(
        'http://localhost:5000/admin/restaurants',
        restaurantData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Restaurant created successfully');
      setShowCreateForm(false);
      
      // Refresh restaurants list
      const restaurantsRes = await axios.get('http://localhost:5000/admin/restaurants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurants(restaurantsRes.data || []);
      
      // Reset form
      setNewRestaurant({
        name: '',
        description: '',
        imageUrl: '',
        bannerUrl: '',
        address: { street: '', city: '', state: '', zipCode: '', country: '' },
        priceLevel: 1,
        cuisine: [],
        distance: 0,
        deliveryTime: '',
        freeDelivery: false,
        latitude: 0,
        longitude: 0,
        openingHours: {
          monday: { open: '09:00', close: '22:00' },
          tuesday: { open: '09:00', close: '22:00' },
          wednesday: { open: '09:00', close: '22:00' },
          thursday: { open: '09:00', close: '22:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '09:00', close: '22:00' },
          sunday: { open: '09:00', close: '22:00' }
        },
        ownerEmail: '',
        createNewOwner: false,
        ownerPassword: ''
      });
    } catch (err) {
      console.error('Restaurant creation error:', err);
      toast.error(err.response?.data?.message || 'Failed to create restaurant');
    }
  };

  const handleAssignOwner = async () => {
    if (!selectedRestaurant || !selectedOwner) {
      toast.error('Please select both a restaurant and an owner');
      return;
    }

    try {
      const token = localStorage.getItem('token');      await axios.post(
        `http://localhost:5000/admin/restaurants/${selectedRestaurant}/owner`,
        { ownerEmail: selectedOwner },
        { headers: { Authorization: `Bearer ${token}` } }
      );      toast.success('Restaurant owner assigned successfully');
      
      // Refresh restaurants list
      const restaurantsRes = await axios.get('http://localhost:5000/admin/restaurants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurants(restaurantsRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign restaurant owner');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setLocation('/admin/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restaurant Management</h1>
            <p className="mt-2 text-gray-600">Manage restaurants and assign owners</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showCreateForm ? 'Cancel' : 'Create Restaurant'}
            </button>
            <button
              onClick={() => setLocation('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Create Restaurant Form */}
        {showCreateForm && (
          <div className="bg-white shadow sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Create New Restaurant
              </h3>
              <form onSubmit={handleCreateRestaurant} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                    <input
                      type="text"
                      required
                      value={newRestaurant.name}
                      onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Owner Email</label>
                    <input
                      type="email"
                      required
                      value={newRestaurant.ownerEmail}
                      onChange={(e) => setNewRestaurant({...newRestaurant, ownerEmail: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="createNewOwner"
                        checked={newRestaurant.createNewOwner}
                        onChange={(e) => setNewRestaurant({...newRestaurant, createNewOwner: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="createNewOwner" className="ml-2 block text-sm text-gray-900">
                        Create new owner account
                      </label>
                    </div>
                  </div>

                  {newRestaurant.createNewOwner && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Owner Password</label>
                      <input
                        type="password"
                        required
                        value={newRestaurant.ownerPassword}
                        onChange={(e) => setNewRestaurant({...newRestaurant, ownerPassword: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      required
                      value={newRestaurant.description}
                      onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/restaurant-image.jpg"
                      value={newRestaurant.imageUrl}
                      onChange={(e) => setNewRestaurant({...newRestaurant, imageUrl: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Banner URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/restaurant-banner.jpg"
                      value={newRestaurant.bannerUrl}
                      onChange={(e) => setNewRestaurant({...newRestaurant, bannerUrl: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Street</label>
                    <input
                      type="text"
                      required
                      value={newRestaurant.address.street}
                      onChange={(e) => setNewRestaurant({
                        ...newRestaurant, 
                        address: {...newRestaurant.address, street: e.target.value}
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      required
                      value={newRestaurant.address.city}
                      onChange={(e) => setNewRestaurant({
                        ...newRestaurant, 
                        address: {...newRestaurant.address, city: e.target.value}
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      required
                      value={newRestaurant.address.state}
                      onChange={(e) => setNewRestaurant({
                        ...newRestaurant, 
                        address: {...newRestaurant.address, state: e.target.value}
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={newRestaurant.address.zipCode}
                      onChange={(e) => setNewRestaurant({
                        ...newRestaurant, 
                        address: {...newRestaurant.address, zipCode: e.target.value}
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      required
                      value={newRestaurant.address.country}
                      onChange={(e) => setNewRestaurant({
                        ...newRestaurant, 
                        address: {...newRestaurant.address, country: e.target.value}
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Time</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 30-45 min"
                      value={newRestaurant.deliveryTime}
                      onChange={(e) => setNewRestaurant({...newRestaurant, deliveryTime: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cuisine Types (comma-separated)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Italian, Pizza, Mediterranean"
                      value={newRestaurant.cuisine.join(', ')}
                      onChange={(e) => setNewRestaurant({
                        ...newRestaurant, 
                        cuisine: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">Enter cuisine types separated by commas</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Restaurant
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Owner Section */}
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Assign Restaurant Owner
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Restaurant</label>
                <select
                  value={selectedRestaurant || ''}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name} {restaurant.owner ? `(Owner: ${restaurant.owner.name})` : '(No owner)'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Owner</label>
                <select
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select an owner</option>
                  {owners.map((owner) => (
                    <option key={owner._id} value={owner.email}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleAssignOwner}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Assign Owner
              </button>
            </div>
          </div>
        </div>

        {/* Restaurants List */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              All Restaurants
            </h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuisine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={restaurant.imageUrl} 
                              alt={restaurant.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {restaurant.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {restaurant.address?.city || 'No address'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {restaurant.owner ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {restaurant.owner.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {restaurant.owner.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No owner assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          restaurant.owner 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {restaurant.owner ? 'Active' : 'Needs Owner'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {restaurants.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No restaurants found. Create your first restaurant above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
