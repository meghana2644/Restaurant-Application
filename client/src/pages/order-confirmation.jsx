import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import axios from 'axios'
import { Button } from '                       {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}       {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}onents/ui/button'
import { toast } from 'react-hot-toast'

export default function OrderConfirmation() {
  const [, setLocation] = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = localStorage.getItem('lastOrderId')
        if (!orderId) {
          setLocation('/restaurants')
          return
        }

        const token = localStorage.getItem('token')
        if (!token) {
          setLocation('/login')
          return
        }

        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        setOrder(response.data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError(err.response?.data?.error || 'Failed to fetch order details')
        toast.error('Failed to fetch order details')
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
          <Button
            onClick={() => setLocation('/restaurants')}
            className="mt-4"
          >
            Return to Restaurants
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Button
            onClick={() => setLocation('/restaurants')}
            className="mt-4"
          >
            Return to Restaurants
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="mt-2 text-gray-600">Thank you for your order</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="mt-1 text-sm text-gray-900">{order._id}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Restaurant</p>
                <p className="mt-1 text-sm text-gray-900">{order.restaurantId.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Order Type</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">{order.deliveryType}</p>
              </div>

              {order.deliveryType === 'takeout' && order.deliveryAddress && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}<br />
                    Phone: {order.deliveryAddress.phone}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">Items</p>
                <div className="mt-2 space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.specialInstructions && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Special Instructions</p>
                  <p className="mt-1 text-sm text-gray-900">{order.specialInstructions}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">                <div className="flex justify-between text-sm">
                  <span className="font-medium">Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="font-medium">Tax</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium mt-2">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button
              onClick={() => setLocation('/restaurants')}
              variant="outline"
            >
              Order Again
            </Button>
            <Button
              onClick={() => setLocation('/orders')}
            >
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 