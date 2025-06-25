import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'wouter';

export default function Profile() {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <Link href="/login">
            <a>
              <Button>Login</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={user.email ? `https://avatar.vercel.sh/${user.email}` : undefined} 
                alt={user.name || 'User'} 
              />
              <AvatarFallback>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name || 'User'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Account Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {user.name || 'Not set'}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                {user.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {user.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Link href="/my-orders">
                <a>
                  <Button variant="outline">View Orders</Button>
                </a>
              </Link>
              <Link href="/">
                <a>
                  <Button variant="ghost">Back to Home</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 