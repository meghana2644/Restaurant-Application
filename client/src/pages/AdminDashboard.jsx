import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [, setLocation] = useLocation()
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: []
  })
  const [restaurants, setRestaurants] = useState([])
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [selectedOwner, setSelectedOwner] = useState('')
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLocation('/admin/login');
          return;
        }
        
        const [statsRes, restaurantsRes, ownersRes] = await Promise.all([
          axios.get('http://localhost:5000/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/admin/restaurants', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/admin/users?role=restaurant_owner', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setStats(statsRes.data);
        setRestaurants(restaurantsRes.data || []);
        setOwners(ownersRes.data || []);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [setLocation])
  const handleAssignOwner = async () => {
    if (!selectedRestaurant || !selectedOwner) {
      toast.error('Please select both a restaurant and an owner');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/admin/restaurants/${selectedRestaurant}/owner`,
        { ownerEmail: selectedOwner },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Restaurant owner assigned successfully');
      // Refresh the restaurants list
      const restaurantsRes = await axios.get('http://localhost:5000/admin/restaurants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurants(restaurantsRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign restaurant owner');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setLocation('/admin/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Admin Dashboard
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Overview of your restaurant management system
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Restaurants Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Restaurants
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalRestaurants || 0}
                </dd>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalOrders || 0}
                </dd>
              </div>
            </div>

            {/* Total Users Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Users
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalUsers || 0}
                </dd>
              </div>
            </div>
          </div>

          {/* Restaurant Owner Management Section */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Manage Restaurant Owners
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700">
                    Select Restaurant
                  </label>
                  <select
                    id="restaurant"
                    name="restaurant"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedRestaurant || ''}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                  >
                    <option value="">Select a restaurant</option>
                    {Array.isArray(restaurants) && restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name} {restaurant.owner ? `(Owner: ${restaurant.owner.name})` : '(No owner)'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                    Select Owner
                  </label>
                  <select
                    id="owner"
                    name="owner"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedOwner}
                    onChange={(e) => setSelectedOwner(e.target.value)}
                  >
                    <option value="">Select an owner</option>
                    {Array.isArray(owners) && owners.map((owner) => (
                      <option key={owner._id} value={owner.email}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAssignOwner}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Assign Owner
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Orders
            </h3>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              {!stats.recentOrders || stats.recentOrders.length === 0 ? (
                <div className="px-4 py-5 text-center text-gray-500">
                  No recent orders found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {stats.recentOrders.map((order) => (
                    <li key={order._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Order #{order._id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Total: ₹{order.total}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setLocation('/admin/restaurants')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Restaurants
            </button>
            <button
              onClick={() => setLocation('/admin/users')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 