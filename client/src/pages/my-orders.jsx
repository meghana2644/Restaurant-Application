import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const MyOrders = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your orders</h1>
          <Link href="/login">
            <a>
              <Button>Login</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No orders found</h1>
          <Link href="/restaurants">
            <a>
              <Button>Browse Restaurants</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => {
          const restaurant = order.restaurant || order.restaurantId;
          return (
            <div key={order._id} className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {restaurant?.name || 'Restaurant'}
                  </h2>
                  <p className="text-muted-foreground">
                    {order.createdAt ? format(new Date(order.createdAt), 'PPP') : 'Date not available'}
                  </p>                  {order.deliveryType === 'dinein' && order.reservation && (
                    <>
                      <p className="text-muted-foreground">
                        Reservation for: {format(new Date(order.reservation.date), 'PPP')}
                      </p>
                      <p className="text-muted-foreground">
                        Time: {order.reservation.time}
                      </p>
                      <p className="text-muted-foreground">
                        Number of Guests: {order.reservation.guests}
                      </p>
                    </>
                  )}
                  {order.deliveryType === 'takeout' && order.customer && (
                    <p className="text-muted-foreground">
                      Takeaway Order
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{order.total?.toFixed(2) || '0.00'}</div>
                  <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                    {order.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name || 'Item'}</span>
                      <span className="text-muted-foreground ml-2">x {item.quantity || 0}</span>
                    </div>
                    <div>₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {(order.customer?.specialRequests || order.reservation?.specialRequests) && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Special Requests:</span> {order.customer?.specialRequests || order.reservation?.specialRequests}
                  </p>
                </div>
              )}              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Order Type: {order.deliveryType === 'dinein' ? 'Dine-in' : 'Takeaway'}
                </div>
                {restaurant?._id && (
                  <Link href={`/restaurants/${restaurant._id}`}>
                    <a>
                      <Button variant="outline">View Restaurant</Button>
                    </a>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders; 