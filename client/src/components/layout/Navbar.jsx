import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Navigation links by role
  let navLinks = [];
  let showCart = false;

  if (!user) {
    navLinks = [
      <Link href="/" key="home"><a className="text-foreground/80 hover:text-foreground">Home</a></Link>,
      <Link href="/restaurants" key="restaurants"><a className="text-foreground/80 hover:text-foreground">Restaurants</a></Link>,
      <Link href="/about" key="about"><a className="text-foreground/80 hover:text-foreground">About</a></Link>,
    ];
    showCart = true;
  } else if (user.role === 'admin') {
    navLinks = [
      <Link href="/admin/dashboard" key="dashboard"><a className="text-foreground/80 hover:text-foreground">Dashboard</a></Link>,
      <Link href="/admin/users" key="users"><a className="text-foreground/80 hover:text-foreground">Users</a></Link>,
      <Link href="/admin/restaurants" key="restaurants"><a className="text-foreground/80 hover:text-foreground">Restaurants</a></Link>,
    ];
    showCart = false;
  } else if (user.role === 'restaurant_owner') {
    navLinks = [
      <Link href="/restaurant-owner/dashboard" key="dashboard"><a className="text-foreground/80 hover:text-foreground">Dashboard</a></Link>,
      <Link href="/restaurant-owner/menu" key="menu"><a className="text-foreground/80 hover:text-foreground">Menu</a></Link>,
      <Link href="/restaurant-owner/orders" key="orders"><a className="text-foreground/80 hover:text-foreground">Orders</a></Link>,
    ];
    showCart = false;
  } else {
    // Normal user
    navLinks = [
      <Link href="/" key="home"><a className="text-foreground/80 hover:text-foreground">Home</a></Link>,
      <Link href="/restaurants" key="restaurants"><a className="text-foreground/80 hover:text-foreground">Restaurants</a></Link>,
      <Link href="/my-orders" key="myorders"><a className="text-foreground/80 hover:text-foreground">My Orders</a></Link>,
      <Link href="/about" key="about"><a className="text-foreground/80 hover:text-foreground">About</a></Link>,
    ];
    showCart = true;
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Main Navigation */}
          <div className="flex items-center space-x-6">
            {navLinks}
          </div>

          {/* Right side - Cart and User Menu */}
          <div className="flex items-center space-x-6">
            {showCart && (
              <Link href="/cart">
                <a className="relative">
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </a>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Only show profile for non-admins and owners */}
                {(user.role !== 'admin') && (
                  <Link href="/profile">
                    <a className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.email ? `https://avatar.vercel.sh/${user.email}` : undefined} 
                          alt={user.name || 'User'} 
                        />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground/80 hover:text-foreground">Profile</span>
                    </a>
                  </Link>
                )}
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <a>
                    <Button variant="ghost">Login</Button>
                  </a>
                </Link>
                <Link href="/register">
                  <a>
                    <Button>Register</Button>
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 