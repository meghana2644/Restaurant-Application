import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'react-hot-toast'
import { useCart } from '@/contexts/CartContext'

export default function Checkout() {
  const [, setLocation] = useLocation()
  const { items: cartItems, getSubtotal, clearCart, restaurantId } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deliveryType, setDeliveryType] = useState('takeout') // 'takeout' or 'dinein'
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    specialInstructions: ''
  })

  // Debug log to check cart data
  useEffect(() => {
    console.log('Cart Items:', cartItems)
    console.log('Restaurant ID:', restaurantId)
  }, [cartItems, restaurantId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (deliveryType === 'takeout') {
      const requiredFields = ['street', 'city', 'state', 'zipCode', 'phone']
      const missingFields = requiredFields.filter(field => !formData[field]?.trim())
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLocation('/login')
        return
      }

      if (!restaurantId) {
        toast.error('Invalid restaurant selection')
        return
      }

      if (!cartItems || cartItems.length === 0) {
        toast.error('Your cart is empty')
        return
      }

      // Calculate totals
      const subtotal = getSubtotal()
      const tax = Number((subtotal * 0.1).toFixed(2)) // 10% tax
      const total = Number((subtotal + tax).toFixed(2))

      // Format items for the order
      const formattedItems = cartItems.map(item => {
        console.log('Processing cart item:', item)
        return {
          menuItemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price.toFixed(2)),
          imageUrl: item.imageUrl
        }
      })

      // Log each item to check its structure
      console.log('Formatted Items:', formattedItems)

      const orderData = {
        restaurantId,
        items: formattedItems,
        orderType: deliveryType,
        ...(deliveryType === 'takeout' 
          ? { 
              deliveryAddress: {
                street: formData.street.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                zipCode: formData.zipCode.trim(),
                phone: formData.phone.trim()
              }
            }
          : {}),
        specialInstructions: formData.specialInstructions?.trim() || '',
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2))
      }

      // Log the complete order data
      console.log('Complete Order Data:', JSON.stringify(orderData, null, 2))
      console.log('Order Data Keys:', Object.keys(orderData))
      console.log('Items Array:', orderData.items)
      console.log('Restaurant ID:', orderData.restaurantId)

      // Validate required fields before sending
      const requiredFields = ['restaurantId', 'items', 'orderType', 'subtotal', 'tax', 'total']
      const missingFields = requiredFields.filter(field => !orderData[field])
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // Validate items array
      if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item')
      }

      // Validate each item
      for (const item of orderData.items) {
        const requiredItemFields = ['menuItemId', 'name', 'quantity', 'price']
        const missingItemFields = requiredItemFields.filter(field => !item[field] && item[field] !== 0)
        if (missingItemFields.length > 0) {
          throw new Error(`Missing required fields in item: ${missingItemFields.join(', ')}`)
        }
        
        // Validate item types
        if (typeof item.quantity !== 'number' || item.quantity < 1) {
          throw new Error(`Invalid quantity for item: ${item.name}`)
        }
        if (typeof item.price !== 'number' || item.price <= 0) {
          throw new Error(`Invalid price for item: ${item.name}`)
        }
      }

      // Validate numeric values
      const numericFields = ['subtotal', 'tax', 'total']
      for (const field of numericFields) {
        if (isNaN(orderData[field]) || orderData[field] <= 0) {
          throw new Error(`${field} must be a positive number`)
        }
      }

      // Validate total matches subtotal + tax
      const calculatedTotal = Number((orderData.subtotal + orderData.tax).toFixed(2))
      if (calculatedTotal !== orderData.total) {
        throw new Error('Total amount does not match subtotal + tax')
      }

      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Order Response:', response.data)

      // Clear cart after successful order
      clearCart()
      
      // Store order ID in localStorage for order confirmation page
      localStorage.setItem('lastOrderId', response.data._id)
      
      setLocation('/my-orders')
      toast.success('Order placed successfully!')
    } catch (err) {
      console.error('Error placing order:', err.response?.data || err)
      const errorMessage = err.response?.data?.error || err.message || 'Failed to place order'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
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
            onClick={() => setLocation('/cart')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Cart
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Your cart is empty</p>
          <button
            onClick={() => setLocation('/restaurants')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Browse Restaurants
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
            Checkout
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Summary
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item._id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={item.imageUrl}
                            alt={item.name}
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.restaurant?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">
                          {item.quantity} x ₹{item.price.toFixed(2)}
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Subtotal</h3>
                  <p className="text-lg font-medium text-gray-900">
                    ₹{getSubtotal().toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="text-lg font-medium text-gray-900">Tax (10%)</h3>
                  <p className="text-lg font-medium text-gray-900">
                    ₹{(getSubtotal() * 0.1).toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Total</h3>
                  <p className="text-lg font-medium text-gray-900">
                    ₹{(getSubtotal() * 1.1).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Type and Information Form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Information
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Type Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Order Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="takeout"
                        checked={deliveryType === 'takeout'}
                        onChange={(e) => setDeliveryType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Take Out</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="dinein"
                        checked={deliveryType === 'dinein'}
                        onChange={(e) => setDeliveryType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Dine In</span>
                    </label>
                  </div>
                </div>

                {/* Conditional Form Fields */}
                {deliveryType === 'takeout' && (
                  <>
                    <div>
                      <label
                        htmlFor="street"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        id="street"
                        required
                        value={formData.street}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your street address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your state"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          required
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your ZIP code"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Special Instructions */}
                <div>
                  <label
                    htmlFor="specialInstructions"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    id="specialInstructions"
                    rows={3}
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Any special instructions or dietary requirements?"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 