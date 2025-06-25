import { useLocation } from 'wouter'
import { Switch, Route } from 'wouter'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import NotFound from './pages/not-found'
import Home from './pages/home'
import Restaurant from './pages/restaurant'
import MyOrders from './pages/my-orders'
import Login from './pages/login'
import Register from './pages/register'
import CartPage from './pages/cart'
import CheckoutPage from './pages/checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderHistory from './pages/OrderHistory'
import Profile from './pages/profile'
import LoginChoice from './pages/LoginChoice'
import AdminLogin from './pages/AdminLogin'
import RestaurantOwnerLogin from './pages/RestaurantOwnerLogin'
import UserLogin from './pages/UserLogin'
import RestaurantList from './pages/restaurants'
import RestaurantDetail from './pages/restaurant'
import Cart from './pages/cart'
import Checkout from './pages/checkout'
import AdminDashboard from './pages/AdminDashboard'
import AdminRestaurants from './pages/AdminRestaurants'
import AdminUsers from './pages/AdminUsers'
import RestaurantOwnerDashboard from './pages/RestaurantOwnerDashboard'
import RestaurantOwnerMenu from './pages/RestaurantOwnerMenu'
import RestaurantOwnerOrders from './pages/RestaurantOwnerOrders'
import FAQ from './pages/support/FAQ'
import Contact from './pages/support/Contact'
import Privacy from './pages/support/Privacy'
import Terms from './pages/support/Terms'
import About from './pages/About'
import DebugOrdersPage from './pages/debug-orders'
import Refund from '@/pages/support/Refund'
import Shipping from '@/pages/support/Shipping'
import Restaurants from "@/pages/restaurants"

function App() {
  const [location] = useLocation()
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/restaurant/:id" component={Restaurant} />
              <Route path="/my-orders" component={props => <ProtectedRoute component={MyOrders} {...props} />} />
              <Route path="/login" component={LoginChoice} />
              <Route path="/admin/login" component={AdminLogin} />
              <Route path="/restaurant-owner/login" component={RestaurantOwnerLogin} />
              <Route path="/user/login" component={UserLogin} />
              <Route path="/register" component={Register} />
              <Route path="/cart" component={props => <ProtectedRoute component={CartPage} {...props} />} />
              <Route path="/checkout" component={props => <ProtectedRoute component={CheckoutPage} {...props} />} />
              <Route path="/about" component={About} />
              <Route path="/refund" component={Refund} />
              <Route path="/shipping" component={Shipping} />
              <Route path="/restaurants" component={RestaurantList} />
              <Route path="/restaurants/:id" component={RestaurantDetail} />
              <Route path="/debug/orders" component={props => <ProtectedRoute component={DebugOrdersPage} {...props} />} />
              <Route path="/faq" component={FAQ} />
              <Route path="/contact" component={Contact} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/terms" component={Terms} />
              <Route path="/profile" component={props => <ProtectedRoute component={Profile} {...props} />} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/restaurants" component={AdminRestaurants} />
              <Route path="/admin/users" component={AdminUsers} />
              <Route path="/admin/stats" component={AdminDashboard} />
              <Route path="/restaurant-owner/dashboard" component={props => <ProtectedRoute component={RestaurantOwnerDashboard} {...props} />} />
              <Route path="/restaurant-owner/menu" component={props => <ProtectedRoute component={RestaurantOwnerMenu} {...props} />} />
              <Route path="/restaurant-owner/orders" component={props => <ProtectedRoute component={RestaurantOwnerOrders} {...props} />} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App 