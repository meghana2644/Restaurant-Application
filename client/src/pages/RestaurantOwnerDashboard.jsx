import { useLocation } from 'wouter'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export default function RestaurantOwnerDashboard() {
  const [, setLocation] = useLocation()
  const [stats, setStats] = useState({
    restaurant: null,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  })
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLocation('/restaurant-owner/login')
          return
        }

        const [dashboardRes, menuRes] = await Promise.all([
          axios.get('http://localhost:5000/api/restaurant-owner/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/restaurant-owner/menu-items', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        setStats(dashboardRes.data)
        setMenuItems(menuRes.data)
      } catch (err) {
        setError('Failed to fetch dashboard data')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    // Set up polling for new orders every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [setLocation])

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `http://localhost:5000/api/restaurant-owner/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Update the order in the stats
      setStats(prev => ({
        ...prev,
        recentOrders: prev.recentOrders.map(order =>
          order._id === orderId ? response.data : order
        )
      }))

      toast.success(`Order ${newStatus} successfully`)
    } catch (err) {
      toast.error('Failed to update order status')
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:5000/api/restaurant-owner/menu-items',
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setMenuItems([...menuItems, response.data])
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
      })
      toast.success('Menu item added successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add menu item')
    }
  }

  const handleUpdateItem = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `http://localhost:5000/api/restaurant-owner/menu-items/${editingItem._id}`,
        editingItem,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setMenuItems(menuItems.map(item => 
        item._id === editingItem._id ? response.data : item
      ))
      setEditingItem(null)
      toast.success('Menu item updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update menu item')
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `http://localhost:5000/api/restaurant-owner/menu-items/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setMenuItems(menuItems.filter(item => item._id !== itemId))
      toast.success('Menu item deleted successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete menu item')
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
            onClick={() => setLocation('/restaurant-owner/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  if (!stats.restaurant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No restaurant found</p>
          <button
            onClick={() => setLocation('/restaurant-owner/register-restaurant')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Register Restaurant
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
            Restaurant Dashboard
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {stats.restaurant.name}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Orders Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalOrders}
                </dd>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Revenue                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  ₹{stats.totalRevenue}
                </dd>
              </div>
            </div>

            {/* Restaurant Status Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Status
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.restaurant.isActive ? 'Open' : 'Closed'}
                </dd>
              </div>
            </div>
          </div>

          {/* Menu Management Section */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Manage Menu
              </h3>

              {/* Add/Edit Menu Item Form */}
              <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={editingItem ? editingItem.name : newItem.name}
                      onChange={(e) => editingItem 
                        ? setEditingItem({...editingItem, name: e.target.value})
                        : setNewItem({...newItem, name: e.target.value})
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={editingItem ? editingItem.price : newItem.price}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, price: parseFloat(e.target.value)})
                        : setNewItem({...newItem, price: parseFloat(e.target.value)})
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={editingItem ? editingItem.description : newItem.description}
                    onChange={(e) => editingItem
                      ? setEditingItem({...editingItem, description: e.target.value})
                      : setNewItem({...newItem, description: e.target.value})
                    }
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      value={editingItem ? editingItem.category : newItem.category}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, category: e.target.value})
                        : setNewItem({...newItem, category: e.target.value})
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      value={editingItem ? editingItem.imageUrl : newItem.imageUrl}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, imageUrl: e.target.value})
                        : setNewItem({...newItem, imageUrl: e.target.value})
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={editingItem ? editingItem.isVegetarian : newItem.isVegetarian}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, isVegetarian: e.target.checked})
                        : setNewItem({...newItem, isVegetarian: e.target.checked})
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Vegetarian</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={editingItem ? editingItem.isVegan : newItem.isVegan}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, isVegan: e.target.checked})
                        : setNewItem({...newItem, isVegan: e.target.checked})
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Vegan</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={editingItem ? editingItem.isGlutenFree : newItem.isGlutenFree}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, isGlutenFree: e.target.checked})
                        : setNewItem({...newItem, isGlutenFree: e.target.checked})
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Gluten Free</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  {editingItem && (
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>

              {/* Menu Items List */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Current Menu Items</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {menuItems.map((item) => (
                    <div key={item._id} className="bg-white border rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-lg font-medium text-gray-900">{item.name}</h5>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{item.description}</p>                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                        <div className="flex space-x-2">
                          {item.isVegetarian && (
                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                              Vegetarian
                            </span>
                          )}
                          {item.isVegan && (
                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                              Vegan
                            </span>
                          )}
                          {item.isGlutenFree && (
                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                              Gluten Free
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Orders
              </h3>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order #{order._id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium">
                          Type: {order.deliveryType === 'takeout' ? 'Take Out' : 'Dine In'}
                        </p>
                        {order.deliveryType === 'takeout' && order.deliveryAddress && (
                          <p className="text-sm text-gray-500">
                            Address: {order.deliveryAddress.street}, {order.deliveryAddress.city}
                          </p>
                        )}                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium">
                          ₹{order.total.toFixed(2)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'preparing' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'ready' ? 'bg-green-100 text-green-800' :
                            order.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                      <ul className="mt-2 space-y-2">                        {order.items.map((item, index) => (
                          <li key={index} className="text-sm text-gray-500">
                            {item.quantity}x {item.name} - ₹{(item.price * item.quantity).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {order.specialInstructions && (
                      <p className="mt-2 text-sm text-gray-500">
                        Special Instructions: {order.specialInstructions}
                      </p>
                    )}
                    <div className="mt-4 flex justify-end space-x-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'accepted')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'ready')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Mark as Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'completed')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Complete Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 