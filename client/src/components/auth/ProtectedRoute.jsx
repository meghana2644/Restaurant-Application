import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Handle browser back button
    const handlePopState = () => {
      if (!isAuthenticated) {
        // If user is not authenticated and tries to go back, redirect to login
        sessionStorage.setItem('redirectUrl', location);
        setLocation('/login');
      } else {
        // If user is authenticated, allow navigation to previous page
        // If previous page was login/register, redirect to dashboard
        const previousPath = window.history.state?.previousPath;
        if (previousPath === '/login' || previousPath === '/register') {
          setLocation('/');
        }
      }
    };

    // Store current path in history state
    window.history.replaceState(
      { ...window.history.state, previousPath: location },
      ''
    );

    window.addEventListener('popstate', handlePopState);

    if (!loading && !isAuthenticated) {
      // Store the attempted URL to redirect back after login
      sessionStorage.setItem('redirectUrl', location);
      setLocation('/login');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, loading, location, setLocation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Component {...rest} /> : null;
};

export default ProtectedRoute; 