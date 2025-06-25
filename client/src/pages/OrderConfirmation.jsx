import { useLocation } from 'wouter'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function OrderConfirmation() {
  const [, setLocation] = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLocation('/login')
          return
        }

        const response = await axios.get('http://localhost:5000/api/orders/latest', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrder(response.data)
      } catch (err) {
        setError('Failed to fetch order details')
        console.error('Error fetching order:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [setLocation])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
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
            onClick={() => setLocation('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No order found</p>
          <button
            onClick={() => setLocation('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Order Confirmed!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you for your order. Your order number is #{order._id}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div>
                      <p className="text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}                  </p>
                    </div>
                    <p className="text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}                <div className="flex justify-between items-center pt-4">
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-lg font-medium text-gray-900">
                    ₹{order.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">
                Delivery Information
              </h3>
              <div className="mt-4">
                <p className="text-gray-600">
                  {order.deliveryAddress.street}
                  <br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                  {order.deliveryAddress.zipCode}
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setLocation('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 