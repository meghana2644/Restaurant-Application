import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      
      await login(data);
      // Get the redirect URL from sessionStorage or default to home
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
      sessionStorage.removeItem('redirectUrl'); // Clear the stored URL
      setLocation(redirectUrl);
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      
      // If it's a password error, highlight the password field
      if (errorMessage.toLowerCase().includes('password')) {
        setFormError('password', {
          type: 'manual',
          message: errorMessage
        });
      }
      // If it's an email error, highlight the email field
      else if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('account')) {
        setFormError('email', {
          type: 'manual',
          message: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary sm:text-sm ${
            errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary sm:text-sm ${
            errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary'
          }`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
} 