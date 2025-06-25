import { Link } from 'wouter'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocation } from 'wouter'

export default function LoginChoice() {
  const [isManagement, setIsManagement] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'admin') {
        setLocation('/admin/dashboard');
      } else if (user.role === 'restaurant_owner') {
        setLocation('/restaurant-owner/dashboard');
      } else {
        setLocation('/');
      }
    }
  }, [isAuthenticated, user, setLocation]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Restaurant Management
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isManagement ? 'Management Login' : 'User Login'}
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="mt-4 flex justify-center">
        <label className="inline-flex items-center cursor-pointer">
          <span className="mr-3 text-sm font-medium text-gray-900">User</span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isManagement}
              onChange={() => setIsManagement(!isManagement)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-900">Management</span>
        </label>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isManagement ? (
            // Management Login Options
            <div className="space-y-6">
              <Link
                href="/admin/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Admin Login
              </Link>

              <Link
                href="/restaurant-owner/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Restaurant Owner Login
              </Link>
            </div>
          ) : (
            // User Login Option
            <div className="space-y-6">
              <Link
                href="/user/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                User Login
              </Link>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 