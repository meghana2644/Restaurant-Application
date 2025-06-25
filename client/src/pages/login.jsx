import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Handle browser back button
    const handlePopState = () => {
      if (isAuthenticated) {
        // If user is authenticated and tries to go back from login, redirect to dashboard
        setLocation('/');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      setLocation('/');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary hover:text-primary-dark"
            >
              {isLogin ? 'Create one now' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
} 